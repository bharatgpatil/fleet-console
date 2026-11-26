import { z } from 'zod';
import { EntityId, LIMITS, Position } from './primitives.ts';
import { TelemetrySample } from './telemetry.ts';

export const Site = z.object({
  id: EntityId,
  name: z.string().min(1).max(LIMITS.name),
  widthMetres: z.number().positive(),
  heightMetres: z.number().positive(),
  chargers: z.array(Position),
});

export type Site = z.infer<typeof Site>;

export const Robot = z.object({
  id: EntityId,
  name: z.string().min(1).max(LIMITS.name),
  siteId: EntityId,
});

export type Robot = z.infer<typeof Robot>;

export const Connectivity = z.enum(['online', 'stale', 'offline']);

export type Connectivity = z.infer<typeof Connectivity>;

export const RobotLiveState = z.object({
  robotId: EntityId,
  connectivity: Connectivity,
  lastSeenAt: z.number().nullable(),
  last: TelemetrySample.nullable(),
});

export type RobotLiveState = z.infer<typeof RobotLiveState>;
