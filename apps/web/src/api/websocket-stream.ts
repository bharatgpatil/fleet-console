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
    let everLive = false;
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

    const reconnect = (reason: string) => {
      if (stopped) {
        return;
      }

      teardown();

      const retryInMs = backoffDelay(attempt);

      attempt++;
      listener.onLinkChange({
        status: everLive ? 'reconnecting' : 'connecting',
        retryInMs,
        reason,
      });
      retryTimer = setTimeout(open, retryInMs);
    };

    const armWatchdog = () => {
      clearTimeout(watchdog);
      watchdog = setTimeout(() => reconnect('no data from server'), WATCHDOG_MS);
    };

    const handleMessage = (raw: unknown) => {
      armWatchdog();

      let message: ServerMessage;

      try {
        message = ServerMessage.parse(JSON.parse(String(raw)));
      } catch {
        reconnect('malformed message');

        return;
      }

      if (message.sequence !== expectedSequence) {
        reconnect(`missed messages (expected #${expectedSequence}, got #${message.sequence})`);

        return;
      }

      expectedSequence = message.sequence + 1;

      if (message.type === 'snapshot') {
        attempt = 0;
        everLive = true;
        listener.onLinkChange({ status: 'live' });
      }

      listener.onMessage(message);
    };

    const open = () => {
      expectedSequence = 0;

      try {
        socket = new WebSocket(this.url);
      } catch {
        reconnect('could not open socket');

        return;
      }

      detach = new AbortController();
      socket.addEventListener('message', (event) => handleMessage(event.data), {
        signal: detach.signal,
      });
      socket.addEventListener('close', () => reconnect('connection closed'), {
        signal: detach.signal,
      });
      armWatchdog();
    };

    listener.onLinkChange({ status: 'connecting', retryInMs: null, reason: null });
    open();

    return () => {
      stopped = true;
      clearTimeout(retryTimer);
      teardown();
    };
  }
}
