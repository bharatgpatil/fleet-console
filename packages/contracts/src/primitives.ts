import { z } from 'zod';

export const LIMITS = {
  id: 128,
  name: 200,
  errorCode: 128,
  message: 500,
  batchSize: 10_000,
} as const;

export const EntityId = z.string().min(1).max(LIMITS.id);

export const Position = z.object({
  x: z.number(),
  y: z.number(),
});

export type Position = z.infer<typeof Position>;
