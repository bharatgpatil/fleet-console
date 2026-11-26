import type { FleetRegistry, TelemetrySample } from '@fleet/contracts';
import { DEFAULT_FAULTS, MAX_CATCH_UP_MS, REPORT_INTERVAL_MS } from './constants.ts';
import { createRandom } from './random.ts';
import { RobotModel } from './robot-model.ts';
import type {
  FaultProfile,
  FleetSimulationOptions,
  PendingReport,
  Random,
  SimulatedRobot,
} from './types.ts';

export class FleetSimulation {
  private readonly random: Random;
  private readonly robots: SimulatedRobot[];
  private readonly faults: FaultProfile;
  private readonly reportIntervalMs: number;
  private pending: PendingReport[] = [];
  private lastStepAt: number;

  constructor(registry: FleetRegistry, options: FleetSimulationOptions) {
    this.random = createRandom(options.seed);
    this.faults = options.faults ?? DEFAULT_FAULTS;
    this.reportIntervalMs = options.reportIntervalMs ?? REPORT_INTERVAL_MS;
    this.lastStepAt = options.startTime;

    const sites = new Map(registry.sites.map((site) => [site.id, site]));
    const robotsSeenPerSite = new Map<string, number>();
    const lostAt = options.startTime + this.faults.lostAfterMs;

    this.robots = registry.robots.flatMap((robot) => {
      const site = sites.get(robot.siteId);

      if (site === undefined) {
        return [];
      }

      const indexInSite = robotsSeenPerSite.get(site.id) ?? 0;

      robotsSeenPerSite.set(site.id, indexInSite + 1);

      return [
        {
          model: new RobotModel({
            robotId: robot.id,
            site,
            random: createRandom(this.random.int(1, 2 ** 31)),
            clockSkewMs: this.random.between(-2_000, 2_000),
          }),
          nextReportAt: options.startTime + this.random.between(0, this.reportIntervalMs),
          silentUntil: 0,
          lostAt: indexInSite < this.faults.lostRobotsPerSite ? lostAt : null,
          buffering: false,
          buffer: [],
        },
      ];
    });
  }

  step(now: number): TelemetrySample[] {
    const elapsedMs = now - this.lastStepAt;

    this.lastStepAt = now;

    const isGap = elapsedMs > MAX_CATCH_UP_MS;
    const elapsedSeconds = Math.max(0, Math.min(elapsedMs, MAX_CATCH_UP_MS) / 1_000);

    for (const robot of this.robots) {
      robot.model.advance({
        elapsedSeconds,
        now,
        errorChancePerSecond: this.faults.errorChancePerSecond,
      });

      if (robot.lostAt !== null && now >= robot.lostAt) {
        robot.silentUntil = Number.POSITIVE_INFINITY;
        robot.buffering = false;
      }

      this.maybeStartDropout({ robot, now, elapsedSeconds });

      if (isGap) {
        robot.nextReportAt = now + this.random.between(0, this.reportIntervalMs);
      }

      while (robot.nextReportAt <= now) {
        const sample = robot.model.report(robot.nextReportAt);

        robot.nextReportAt += this.reportIntervalMs * this.random.between(0.9, 1.1);
        this.route({ robot, sample, now });
      }

      if (robot.silentUntil <= now && robot.buffer.length > 0) {
        for (const sample of robot.buffer) {
          this.enqueue(sample, now);
        }

        robot.buffer = [];
      }
    }

    const due = this.pending.filter((report) => report.deliverAt <= now);

    this.pending = this.pending.filter((report) => report.deliverAt > now);

    return due.map((report) => report.sample);
  }

  private maybeStartDropout({
    robot,
    now,
    elapsedSeconds,
  }: {
    robot: SimulatedRobot;
    now: number;
    elapsedSeconds: number;
  }): void {
    if (robot.silentUntil > now) {
      return;
    }

    if (!this.random.chance(this.faults.dropoutChancePerSecond * elapsedSeconds)) {
      return;
    }

    const [min, max] = this.faults.dropoutDurationMs;

    robot.silentUntil = now + this.random.between(min, max);
    robot.buffering = this.random.chance(this.faults.bufferDuringDropoutChance);
  }

  private route({
    robot,
    sample,
    now,
  }: {
    robot: SimulatedRobot;
    sample: TelemetrySample;
    now: number;
  }): void {
    if (robot.silentUntil <= now) {
      this.enqueue(sample, now);

      return;
    }

    if (robot.buffering) {
      robot.buffer.push(sample);
    }
  }

  private enqueue(sample: TelemetrySample, now: number): void {
    const late = this.random.chance(this.faults.lateChancePerReport);
    const [min, max] = this.faults.lateDelayMs;

    this.pending.push({ deliverAt: late ? now + this.random.between(min, max) : now, sample });

    if (this.random.chance(this.faults.duplicateChancePerReport)) {
      this.pending.push({ deliverAt: now + this.random.between(0, 1_500), sample });
    }
  }
}
