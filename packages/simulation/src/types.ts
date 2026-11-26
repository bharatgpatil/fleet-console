import type { Site, TelemetrySample } from '@fleet/contracts';
import type { RobotModel } from './robot-model.ts';

export type Random = {
  next: () => number;
  between: (min: number, max: number) => number;
  int: (min: number, maxInclusive: number) => number;
  chance: (probability: number) => boolean;
  pick: <T>(items: readonly T[]) => T;
};

export type SiteTemplate = Omit<Site, 'chargers'>;

export type FaultProfile = {
  dropoutChancePerSecond: number;
  dropoutDurationMs: readonly [min: number, max: number];
  bufferDuringDropoutChance: number;
  lateChancePerReport: number;
  lateDelayMs: readonly [min: number, max: number];
  duplicateChancePerReport: number;
  errorChancePerSecond: number;
  lostRobotsPerSite: number;
  lostAfterMs: number;
};

export type FleetSimulationOptions = {
  seed: number;
  startTime: number;
  reportIntervalMs?: number;
  faults?: FaultProfile;
};

export type RobotMode = 'idle' | 'moving' | 'to_charger' | 'charging' | 'error';

export type RobotModelOptions = {
  robotId: string;
  site: Site;
  random: Random;
  clockSkewMs: number;
};

export type SimulatedRobot = {
  model: RobotModel;
  nextReportAt: number;
  silentUntil: number;
  lostAt: number | null;
  buffering: boolean;
  buffer: TelemetrySample[];
};

export type PendingReport = {
  deliverAt: number;
  sample: TelemetrySample;
};
