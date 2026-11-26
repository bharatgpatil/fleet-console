import { ServerMessage } from '@fleet/contracts';
import { backoffDelay } from './backoff-delay.ts';
import { WATCHDOG_MS } from './constants.ts';
import type { FleetStream, StreamListener } from './types.ts';

export class WebSocketStream implements FleetStream {
  private readonly url: string;

  constructor(url: string) {
    this.url = url;
  }

  connect(listener: StreamListener): () => void {
    let socket: WebSocket | null = null;
    let detach: AbortController | null = null;
    let attempt = 0;
    let expectedSequence = 0;
    let stopped = false;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;
    let watchdog: ReturnType<typeof setTimeout> | undefined;

    const teardown = () => {
      clearTimeout(watchdog);

      if (detach !== null) {
        detach.abort();
        detach = null;
      }

      if (socket !== null) {
        socket.close();
        socket = null;
      }
    };

    const reconnect = () => {
      if (stopped) {
        return;
      }

      teardown();
      retryTimer = setTimeout(open, backoffDelay(attempt));
      attempt++;
    };

    const armWatchdog = () => {
      clearTimeout(watchdog);
      watchdog = setTimeout(reconnect, WATCHDOG_MS);
    };

    const handleMessage = (raw: unknown) => {
      armWatchdog();

      let message: ServerMessage;

      try {
        message = ServerMessage.parse(JSON.parse(String(raw)));
      } catch {
        reconnect();

        return;
      }

      if (message.sequence !== expectedSequence) {
        reconnect();

        return;
      }

      expectedSequence = message.sequence + 1;

      if (message.type === 'snapshot') {
        attempt = 0;
      }

      listener.onMessage(message);
    };

    const open = () => {
      expectedSequence = 0;

      try {
        socket = new WebSocket(this.url);
      } catch {
        reconnect();

        return;
      }

      detach = new AbortController();
      socket.addEventListener('message', (event) => handleMessage(event.data), {
        signal: detach.signal,
      });
      socket.addEventListener('close', reconnect, { signal: detach.signal });
      armWatchdog();
    };

    open();

    return () => {
      stopped = true;
      clearTimeout(retryTimer);
      teardown();
    };
  }
}
