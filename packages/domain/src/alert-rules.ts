import type { AlertKind, AlertSeverity, RobotLiveState } from '@fleet/contracts';
import { ALERT_RULES, ALERTS_KEPT_WHILE_OFFLINE, BATTERY_ALERT_KINDS } from './constants.ts';
import type { AlertRules } from './types.ts';

export function activeAlertKinds({
  state,
  open,
  rules = ALERT_RULES,
}: {
  state: RobotLiveState;
  open: ReadonlySet<AlertKind>;
  rules?: AlertRules;
}): Set<AlertKind> {
  const active = new Set<AlertKind>();
  const sample = state.last;

  if (state.connectivity === 'offline') {
    if (state.lastSeenAt !== null) {
      active.add('offline');
    }

    for (const kind of ALERTS_KEPT_WHILE_OFFLINE) {
      if (open.has(kind)) {
        active.add(kind);
      }
    }

    return active;
  }

  if (sample === null) {
    return active;
  }

  const charging = sample.activity === 'charging';
  const batteryAlertOpen = BATTERY_ALERT_KINDS.some((kind) => open.has(kind));

  if (sample.battery < rules.batteryCriticalBelow) {
    active.add('battery_critical');
  } else if (!charging && sample.battery < rules.batteryLowBelow) {
    active.add('battery_low');
  } else if (!charging && batteryAlertOpen && sample.battery < rules.batteryClearAbove) {
    active.add('battery_low');
  }

  if (sample.activity === 'error') {
    active.add('robot_error');
  }

  return active;
}

export function describeAlert({
  kind,
  state,
  rules = ALERT_RULES,
}: {
  kind: AlertKind;
  state: RobotLiveState;
  rules?: AlertRules;
}): { severity: AlertSeverity; message: string } {
  switch (kind) {
    case 'battery_critical': {
      return { severity: 'critical', message: `Battery below ${rules.batteryCriticalBelow}%` };
    }

    case 'battery_low': {
      return { severity: 'warning', message: `Battery below ${rules.batteryLowBelow}%` };
    }

    case 'offline': {
      return { severity: 'critical', message: 'Robot stopped reporting' };
    }

    case 'robot_error': {
      const errorCode = state.last === null ? undefined : state.last.errorCode;

      return {
        severity: 'critical',
        message:
          errorCode === undefined ? 'Robot reported an error' : `Robot reported error ${errorCode}`,
      };
    }
  }
}
