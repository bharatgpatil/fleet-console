import type { FleetRegistry } from '@fleet/contracts';
import type { FleetEngine } from '@fleet/domain';
import type { StreamHub } from './stream-hub.ts';

export type StreamSocket = {
  readonly bufferedAmount: number;
  readonly readyState: number;
  send: (data: string) => void;
  close: (code?: number, reason?: string) => void;
};

export type StreamClient = {
  socket: StreamSocket;
  sequence: number;
};

export type AppDependencies = {
  engine: FleetEngine;
  hub: StreamHub;
  registry: FleetRegistry;
  now: () => number;
  logLevel: string;
  webRoot: string | undefined;
};
