import type { Alert } from '@fleet/contracts';
import type { FleetState, Health } from './types.ts';

export const HEALTH_RANK: Record<Health, number> = {
  critical: 0,
  offline: 1,
  warning: 2,
  unknown: 3,
  ok: 4,
};

export const HEALTH_LABEL: Record<Health, string> = {
  critical: 'Critical',
  offline: 'Offline',
  warning: 'Warning',
  ok: 'Healthy',
  unknown: 'No data',
};

export const MAX_BATCH_DELAY_MS = 1_000;

export const CLOCK_TICK_MS = 1_000;

export const NO_ALERTS: Alert[] = [];

export const INITIAL_FLEET_STATE: FleetState = {
  hydrated: false,
  clockOffsetMs: 0,
  sites: {},
  siteIds: [],
  robots: {},
  robotIds: [],
  states: {},
  alerts: {},
};
