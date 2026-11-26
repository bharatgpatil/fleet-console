import { z } from 'zod';
import { Alert } from './alerts.ts';
import { Robot, RobotLiveState, Site } from './fleet.ts';

export const ApiPaths = {
  fleet: '/api/fleet',
  ingest: '/api/ingest',
  acknowledgeAlert: (alertId: string) => `/api/alerts/${encodeURIComponent(alertId)}/ack`,
  stream: '/ws',
  health: '/healthz',
} as const;

export const FleetRegistry = z.object({
  sites: z.array(Site),
  robots: z.array(Robot),
});

export type FleetRegistry = z.infer<typeof FleetRegistry>;

export const FleetSnapshot = FleetRegistry.extend({
  serverTime: z.number(),
  states: z.array(RobotLiveState),
  alerts: z.array(Alert),
});

export type FleetSnapshot = z.infer<typeof FleetSnapshot>;

export const ApiError = z.object({
  error: z.string(),
  details: z.unknown().optional(),
});

export type ApiError = z.infer<typeof ApiError>;
