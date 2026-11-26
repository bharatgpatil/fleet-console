import { z } from 'zod';
import { EntityId, Position } from './primitives.ts';
import { RobotActivity } from './telemetry.ts';

export const HistoryPoint = z.object({
  at: z.number(),
  battery: z.number().min(0).max(100),
  position: Position,
  activity: RobotActivity,
});

export type HistoryPoint = z.infer<typeof HistoryPoint>;

export const RobotHistory = z.object({
  robotId: EntityId,
  windowMs: z.number().int().positive(),
  points: z.array(HistoryPoint),
});

export type RobotHistory = z.infer<typeof RobotHistory>;
