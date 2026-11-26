import type { Alert, RobotLiveState } from '@fleet/contracts';

export type FleetDelta = {
  states: RobotLiveState[];
  alerts: Alert[];
};

export type ConnectivityThresholds = {
  readonly staleAfterMs: number;
  readonly offlineAfterMs: number;
};

export type AlertRules = {
  readonly batteryLowBelow: number;
  readonly batteryCriticalBelow: number;
  readonly batteryClearAbove: number;
};

export type FleetEngineOptions = {
  newId: () => string;
  connectivity?: ConnectivityThresholds;
  alertRules?: AlertRules;
  resolvedAlertRetentionMs?: number;
};

export type SampleOutcome = 'applied' | 'late' | 'duplicate';
