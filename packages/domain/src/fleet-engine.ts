import type {
  Alert,
  AlertKind,
  FleetSnapshot,
  IngestResult,
  Robot,
  RobotLiveState,
  TelemetrySample,
} from '@fleet/contracts';
import { activeAlertKinds, describeAlert } from './alert-rules.ts';
import { deriveConnectivity } from './connectivity.ts';
import { ALERT_RULES, CONNECTIVITY_THRESHOLDS, RESOLVED_ALERT_RETENTION_MS } from './constants.ts';
import { classifySample } from './ordering.ts';
import type {
  AlertRules,
  ConnectivityThresholds,
  FleetDelta,
  FleetEngineOptions,
  FleetRegistry,
} from './types.ts';

export class FleetEngine {
  private readonly robots = new Map<string, Robot>();
  private readonly states = new Map<string, RobotLiveState>();
  private readonly alerts = new Map<string, Alert>();
  private readonly openAlerts = new Map<string, Map<AlertKind, Alert>>();
  private readonly changedStates = new Set<string>();
  private readonly changedAlerts = new Set<string>();
  private readonly newId: () => string;
  private readonly connectivity: ConnectivityThresholds;
  private readonly alertRules: AlertRules;
  private readonly resolvedAlertRetentionMs: number;

  constructor(
    private readonly registry: FleetRegistry,
    options: FleetEngineOptions,
  ) {
    this.newId = options.newId;
    this.connectivity = options.connectivity ?? CONNECTIVITY_THRESHOLDS;
    this.alertRules = options.alertRules ?? ALERT_RULES;
    this.resolvedAlertRetentionMs = options.resolvedAlertRetentionMs ?? RESOLVED_ALERT_RETENTION_MS;

    for (const robot of registry.robots) {
      this.robots.set(robot.id, robot);
      this.states.set(robot.id, {
        robotId: robot.id,
        connectivity: 'offline',
        lastSeenAt: null,
        last: null,
      });
    }
  }

  ingest(samples: readonly TelemetrySample[], now: number): IngestResult {
    const result: IngestResult = { late: 0, duplicate: 0, unknownRobot: 0 };

    for (const sample of samples) {
      const current = this.states.get(sample.robotId);

      if (current === undefined) {
        result.unknownRobot++;
        continue;
      }

      const outcome = classifySample(current.last, sample);

      if (outcome !== 'applied') {
        result[outcome]++;
        continue;
      }

      this.commitState(
        { robotId: sample.robotId, last: sample, lastSeenAt: now, connectivity: 'online' },
        now,
      );
    }

    return result;
  }

  tick(now: number): void {
    for (const state of this.states.values()) {
      const connectivity = deriveConnectivity({
        lastSeenAt: state.lastSeenAt,
        now,
        thresholds: this.connectivity,
      });

      if (connectivity !== state.connectivity) {
        this.commitState({ ...state, connectivity }, now);
      }
    }

    for (const [id, alert] of this.alerts) {
      if (alert.resolvedAt !== null && now - alert.resolvedAt > this.resolvedAlertRetentionMs) {
        this.alerts.delete(id);
      }
    }
  }

  acknowledgeAlert(alertId: string, now: number): Alert | undefined {
    const alert = this.alerts.get(alertId);

    if (alert === undefined || alert.acknowledgedAt !== null) {
      return alert;
    }

    const acknowledged = { ...alert, acknowledgedAt: now };

    this.storeAlert(acknowledged);

    return acknowledged;
  }

  snapshot(now: number): FleetSnapshot {
    return {
      serverTime: now,
      sites: this.registry.sites,
      robots: this.registry.robots,
      states: [...this.states.values()],
      alerts: [...this.alerts.values()].toSorted((a, b) => b.openedAt - a.openedAt),
    };
  }

  drainDelta(): FleetDelta {
    const delta: FleetDelta = {
      states: [...this.changedStates].flatMap((id) => this.states.get(id) ?? []),
      alerts: [...this.changedAlerts].flatMap((id) => this.alerts.get(id) ?? []),
    };

    this.changedStates.clear();
    this.changedAlerts.clear();

    return delta;
  }

  private commitState(state: RobotLiveState, now: number): void {
    this.states.set(state.robotId, state);
    this.changedStates.add(state.robotId);
    this.reconcileAlerts(state, now);
  }

  private reconcileAlerts(state: RobotLiveState, now: number): void {
    const robot = this.robots.get(state.robotId);

    if (robot === undefined) {
      return;
    }

    const open = this.openAlerts.get(robot.id) ?? new Map<AlertKind, Alert>();
    const active = activeAlertKinds({ state, open: new Set(open.keys()), rules: this.alertRules });

    for (const [kind, alert] of open) {
      if (active.has(kind)) {
        continue;
      }

      open.delete(kind);
      this.storeAlert({ ...alert, resolvedAt: now });
    }

    for (const kind of active) {
      if (open.has(kind)) {
        continue;
      }

      const { severity, message } = describeAlert({ kind, state, rules: this.alertRules });
      const alert: Alert = {
        id: this.newId(),
        robotId: robot.id,
        siteId: robot.siteId,
        kind,
        severity,
        message,
        openedAt: now,
        acknowledgedAt: null,
        resolvedAt: null,
      };

      open.set(kind, alert);
      this.storeAlert(alert);
    }

    this.openAlerts.set(robot.id, open);
  }

  private storeAlert(alert: Alert): void {
    this.alerts.set(alert.id, alert);
    this.changedAlerts.add(alert.id);

    if (alert.resolvedAt === null) {
      this.openAlerts.get(alert.robotId)?.set(alert.kind, alert);
    }
  }
}
