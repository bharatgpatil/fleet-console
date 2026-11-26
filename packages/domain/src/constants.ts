import type { AlertKind } from '@fleet/contracts';
import type { AlertRules, ConnectivityThresholds } from './types.ts';

export const CONNECTIVITY_THRESHOLDS: ConnectivityThresholds = {
  staleAfterMs: 5_000,
  offlineAfterMs: 30_000,
};

export const ALERT_RULES: AlertRules = {
  batteryLowBelow: 20,
  batteryCriticalBelow: 10,
  batteryClearAbove: 25,
};

export const BATTERY_ALERT_KINDS: readonly AlertKind[] = ['battery_low', 'battery_critical'];

export const ALERTS_KEPT_WHILE_OFFLINE: readonly AlertKind[] = [
  ...BATTERY_ALERT_KINDS,
  'robot_error',
];

export const RESOLVED_ALERT_RETENTION_MS = 30 * 60_000;

// A sequence this far behind, with a newer robot clock, is a rebooted robot rather than a late report.
export const REBOOT_SEQUENCE_GAP = 1_000;
