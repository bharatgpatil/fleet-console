import { z } from 'zod';
import { EntityId, LIMITS, Position } from './primitives.ts';

export const RobotActivity = z.enum(['idle', 'moving', 'charging', 'error']);

export type RobotActivity = z.infer<typeof RobotActivity>;

export const TelemetrySample = z.object({
  robotId: EntityId,
  sequence: z.number().int().nonnegative(),
  recordedAt: z.number().int().nonnegative(),
  battery: z.number().min(0).max(100),
  activity: RobotActivity,
  position: Position,
  headingRadians: z.number(),
  speedMetresPerSecond: z.number().nonnegative(),
  errorCode: z.string().max(LIMITS.errorCode).optional(),
});

export type TelemetrySample = z.infer<typeof TelemetrySample>;

export const IngestBatch = z.object({
  samples: z.array(TelemetrySample).max(LIMITS.batchSize),
});

export type IngestBatch = z.infer<typeof IngestBatch>;

export const IngestResult = z.object({
  late: z.number().int(),
  duplicate: z.number().int(),
  unknownRobot: z.number().int(),
});

export type IngestResult = z.infer<typeof IngestResult>;
