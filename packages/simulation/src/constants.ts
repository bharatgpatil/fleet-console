import type { FaultProfile, SiteTemplate } from './types.ts';

export const SITE_TEMPLATES: readonly SiteTemplate[] = [
  { id: 'munich', name: 'Munich', widthMetres: 60, heightMetres: 40 },
  { id: 'berlin', name: 'Berlin', widthMetres: 80, heightMetres: 50 },
  { id: 'frankfurt', name: 'Frankfurt', widthMetres: 120, heightMetres: 60 },
];

export const DEFAULT_ROBOTS_PER_SITE: readonly number[] = [20, 50, 500];

export const ROBOTS_PER_CHARGER = 25;

export const MIN_CHARGERS_PER_SITE = 3;

export const DEFAULT_FAULTS: FaultProfile = {
  dropoutChancePerSecond: 0.0001,
  dropoutDurationMs: [8_000, 75_000],
  bufferDuringDropoutChance: 0.5,
  lateChancePerReport: 0.01,
  lateDelayMs: [2_000, 8_000],
  duplicateChancePerReport: 0.003,
  errorChancePerSecond: 0.00005,
  lostRobotsPerSite: 1,
  lostAfterMs: 45_000,
};

export const NO_FAULTS: FaultProfile = {
  ...DEFAULT_FAULTS,
  dropoutChancePerSecond: 0,
  lateChancePerReport: 0,
  duplicateChancePerReport: 0,
  errorChancePerSecond: 0,
  lostRobotsPerSite: 0,
};

export const REPORT_INTERVAL_MS = 1_000;

export const MAX_CATCH_UP_MS = 10_000;

export const SPEED_METRES_PER_SECOND = 1.2;

export const DRAIN_MOVING_PER_SECOND = 0.25;

export const DRAIN_IDLE_PER_SECOND = 0.02;

export const CHARGE_PER_SECOND = 0.9;

export const CHARGE_UNTIL = 95;

export const CARELESS_ROBOT_CHANCE = 0.04;

export const RESCUE_AFTER_MS = 90_000;

export const ERROR_CODES = ['E-LIDAR-04', 'E-MOTOR-12', 'E-ESTOP', 'E-NAV-LOST'] as const;
