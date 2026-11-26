import { z } from 'zod';
import { Alert } from './alerts.ts';
import { FleetSnapshot } from './api.ts';
import { RobotLiveState } from './fleet.ts';

export const STREAM_FLUSH_INTERVAL_MS = 250;

const SnapshotMessage = z.object({
  type: z.literal('snapshot'),
  sequence: z.number().int(),
  serverTime: z.number(),
  snapshot: FleetSnapshot,
});

export const DeltaMessage = z.object({
  type: z.literal('delta'),
  sequence: z.number().int(),
  serverTime: z.number(),
  states: z.array(RobotLiveState),
  alerts: z.array(Alert),
});

export type DeltaMessage = z.infer<typeof DeltaMessage>;

export const ServerMessage = z.discriminatedUnion('type', [SnapshotMessage, DeltaMessage]);

export type ServerMessage = z.infer<typeof ServerMessage>;
