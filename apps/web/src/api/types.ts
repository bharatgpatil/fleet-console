import type { Alert, ServerMessage } from '@fleet/contracts';

export type StreamListener = {
  onMessage: (message: ServerMessage) => void;
};

export type FleetStream = {
  connect: (listener: StreamListener) => () => void;
};

export type FleetApi = {
  stream: FleetStream;
  acknowledgeAlert: (alertId: string) => Promise<Alert>;
};
