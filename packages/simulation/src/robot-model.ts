import type { Position, RobotActivity, Site, TelemetrySample } from '@fleet/contracts';
import {
  CARELESS_ROBOT_CHANCE,
  CHARGE_PER_SECOND,
  CHARGE_UNTIL,
  DRAIN_IDLE_PER_SECOND,
  DRAIN_MOVING_PER_SECOND,
  ERROR_CODES,
  RESCUE_AFTER_MS,
  SPEED_METRES_PER_SECOND,
} from './constants.ts';
import { distance, round } from './geometry.ts';
import type { Random, RobotMode, RobotModelOptions } from './types.ts';

export class RobotModel {
  readonly robotId: string;
  private readonly site: Site;
  private readonly random: Random;
  private readonly clockSkewMs: number;
  private readonly returnToChargeBelow: number;
  private mode: RobotMode = 'idle';
  private position: Position;
  private headingRadians = 0;
  private speed = 0;
  private battery: number;
  private target: Position | null = null;
  private idleUntil = 0;
  private errorUntil = 0;
  private errorCode: string | undefined;
  private sequence = 0;
  private depletedSince: number | null = null;

  constructor({ robotId, site, random, clockSkewMs }: RobotModelOptions) {
    this.robotId = robotId;
    this.site = site;
    this.random = random;
    this.clockSkewMs = clockSkewMs;
    this.position = this.randomWaypoint();
    this.battery = random.between(18, 100);
    this.returnToChargeBelow = random.chance(CARELESS_ROBOT_CHANCE)
      ? random.between(8, 12)
      : random.between(25, 35);
  }

  advance({
    elapsedSeconds,
    now,
    errorChancePerSecond,
  }: {
    elapsedSeconds: number;
    now: number;
    errorChancePerSecond: number;
  }): void {
    const canFail = this.mode !== 'error' && this.mode !== 'charging';

    if (canFail && this.random.chance(errorChancePerSecond * elapsedSeconds)) {
      this.mode = 'error';
      this.errorUntil = now + this.random.between(15_000, 45_000);
      this.errorCode = this.random.pick(ERROR_CODES);
      this.speed = 0;
    }

    switch (this.mode) {
      case 'error': {
        if (now >= this.errorUntil) {
          this.mode = 'idle';
          this.errorCode = undefined;
        }

        this.drain(DRAIN_IDLE_PER_SECOND * elapsedSeconds);
        break;
      }

      case 'charging': {
        this.battery = Math.min(100, this.battery + CHARGE_PER_SECOND * elapsedSeconds);

        if (this.battery >= CHARGE_UNTIL) {
          this.becomeIdle(now);
        }

        break;
      }

      case 'idle': {
        this.drain(DRAIN_IDLE_PER_SECOND * elapsedSeconds);

        if (now >= this.idleUntil && this.battery > 0) {
          this.goTo(this.randomWaypoint(), 'moving');
        }

        break;
      }

      case 'moving':
      case 'to_charger': {
        this.moveTowardTarget(elapsedSeconds, now);
        this.drain(DRAIN_MOVING_PER_SECOND * elapsedSeconds);
        break;
      }
    }

    const needsCharge = this.battery < this.returnToChargeBelow;

    if (needsCharge && (this.mode === 'idle' || this.mode === 'moving')) {
      this.goTo(this.nearestCharger(), 'to_charger');
    }

    if (this.battery <= 0 && this.mode !== 'charging') {
      this.strandOrRescue(now);
    }
  }

  report(now: number): TelemetrySample {
    this.sequence++;

    const sample: TelemetrySample = {
      robotId: this.robotId,
      sequence: this.sequence,
      recordedAt: Math.round(now + this.clockSkewMs),
      battery: round(this.battery, 1),
      activity: this.activity(),
      position: { x: round(this.position.x, 2), y: round(this.position.y, 2) },
      headingRadians: round(this.headingRadians, 3),
      speedMetresPerSecond: round(this.speed, 2),
    };

    return this.errorCode === undefined ? sample : { ...sample, errorCode: this.errorCode };
  }

  private activity(): RobotActivity {
    return this.mode === 'to_charger' ? 'moving' : this.mode;
  }

  private strandOrRescue(now: number): void {
    this.speed = 0;
    this.mode = 'idle';

    if (this.depletedSince === null) {
      this.depletedSince = now;
    }

    if (now - this.depletedSince >= RESCUE_AFTER_MS) {
      this.position = { ...this.nearestCharger() };
      this.target = null;
      this.mode = 'charging';
      this.depletedSince = null;
    }
  }

  private moveTowardTarget(elapsedSeconds: number, now: number): void {
    if (this.target === null) {
      this.becomeIdle(now);

      return;
    }

    const dx = this.target.x - this.position.x;
    const dy = this.target.y - this.position.y;
    const remaining = Math.hypot(dx, dy);
    const step = SPEED_METRES_PER_SECOND * elapsedSeconds;

    if (remaining <= step) {
      this.position = { ...this.target };
      this.target = null;
      this.speed = 0;

      if (this.mode === 'to_charger') {
        this.mode = 'charging';
      } else {
        this.becomeIdle(now);
      }

      return;
    }

    this.headingRadians = Math.atan2(dy, dx);
    this.speed = SPEED_METRES_PER_SECOND;
    this.position = {
      x: this.position.x + (dx / remaining) * step,
      y: this.position.y + (dy / remaining) * step,
    };
  }

  private goTo(target: Position, mode: 'moving' | 'to_charger'): void {
    this.target = target;
    this.mode = mode;
  }

  private becomeIdle(now: number): void {
    this.mode = 'idle';
    this.speed = 0;
    this.idleUntil = now + this.random.between(2_000, 12_000);
  }

  private drain(amount: number): void {
    this.battery = Math.max(0, this.battery - amount);
  }

  private randomWaypoint(): Position {
    return {
      x: this.random.between(2, this.site.widthMetres - 2),
      y: this.random.between(2, this.site.heightMetres - 8),
    };
  }

  private nearestCharger(): Position {
    let best = this.site.chargers[0] ?? { x: 1, y: 1 };

    for (const charger of this.site.chargers) {
      if (distance(charger, this.position) < distance(best, this.position)) {
        best = charger;
      }
    }

    return best;
  }
}
