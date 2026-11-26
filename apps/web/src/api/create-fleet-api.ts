import { Alert, ApiPaths } from '@fleet/contracts';
import { request } from './request.ts';
import { streamUrl } from './stream-url.ts';
import type { FleetApi } from './types.ts';
import { WebSocketStream } from './websocket-stream.ts';

export function createFleetApi(): FleetApi {
  return {
    stream: new WebSocketStream(streamUrl(ApiPaths.stream)),
    acknowledgeAlert: (alertId) =>
      request({
        path: ApiPaths.acknowledgeAlert(alertId),
        schema: Alert,
        init: { method: 'POST' },
      }),
  };
}
