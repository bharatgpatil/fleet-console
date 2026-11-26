import type { Alert, ServerMessage } from '@fleet/contracts';

export type LinkChange =
  | { status: 'live' }
  | { status: 'connecting' | 'reconnecting'; retryInMs: number | null; reason: string | null };

export type StreamListener = {
  onMessage: (message: ServerMessage) => void;
  onLinkChange: (change: LinkChange) => void;
};

export type FleetStream = {
  connect: (listener: StreamListener) => () => void;
};

export type FleetApi = {
  stream: FleetStream;
  acknowledgeAlert: (alertId: string) => Promise<Alert>;
};
