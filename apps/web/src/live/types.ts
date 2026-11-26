import type { Alert, Robot, RobotLiveState, ServerMessage, Site } from '@fleet/contracts';
import type { LinkChange } from '../api/types.ts';

export type Health = 'critical' | 'offline' | 'warning' | 'ok' | 'unknown';

export type LinkState = LinkChange & { since: number };

export type FleetData = {
  sites: Record<string, Site>;
  siteIds: string[];
  robots: Record<string, Robot>;
  robotIds: string[];
  states: Record<string, RobotLiveState>;
  alerts: Record<string, Alert>;
};

export type FleetState = FleetData & {
  link: LinkState;
  hydrated: boolean;
  clockOffsetMs: number;
};

export type FleetActions = {
  applyMessages: (messages: readonly ServerMessage[], receivedAt: number) => void;
  setLink: (change: LinkChange) => void;
  upsertAlert: (alert: Alert) => void;
};

export type RobotRow = {
  id: string;
  robot: Robot;
  site: Site | undefined;
  state: RobotLiveState | undefined;
  openAlerts: Alert[];
  health: Health;
};

export type RobotView = {
  robot: Robot | undefined;
  site: Site | undefined;
  state: RobotLiveState | undefined;
  openAlerts: Alert[];
  health: Health;
};

export type HealthCounts = Record<Health, number> & { total: number };
