import { z } from 'zod';
import { EntityId, LIMITS } from './primitives.ts';

export const AlertKind = z.enum(['battery_low', 'battery_critical', 'offline', 'robot_error']);

export type AlertKind = z.infer<typeof AlertKind>;

export const AlertSeverity = z.enum(['warning', 'critical']);

export type AlertSeverity = z.infer<typeof AlertSeverity>;

export const Alert = z.object({
  id: EntityId,
  robotId: EntityId,
  siteId: EntityId,
  kind: AlertKind,
  severity: AlertSeverity,
  message: z.string().max(LIMITS.message),
  openedAt: z.number(),
  acknowledgedAt: z.number().nullable(),
  resolvedAt: z.number().nullable(),
});

export type Alert = z.infer<typeof Alert>;
