import type { ServerMessage } from '@fleet/contracts';
import type { FleetStream } from '../api/types.ts';
import { MAX_BATCH_DELAY_MS } from './constants.ts';
import type { FleetStore } from './fleet-store.ts';

export function startLiveSync(stream: FleetStream, store: FleetStore): () => void {
  let queue: ServerMessage[] = [];
  let frame: number | null = null;
  let timer: ReturnType<typeof setTimeout> | null = null;

  const cancelScheduled = () => {
    if (frame !== null) {
      cancelAnimationFrame(frame);
      frame = null;
    }

    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
  };

  const flush = () => {
    cancelScheduled();

    const batch = queue;

    queue = [];
    store.getState().applyMessages(batch, Date.now());
  };

  const schedule = () => {
    if (frame === null) {
      frame = requestAnimationFrame(flush);
    }

    if (timer === null) {
      timer = setTimeout(flush, MAX_BATCH_DELAY_MS);
    }
  };

  const stop = stream.connect({
    onMessage: (message) => {
      if (message.type === 'snapshot') {
        queue = [];
      }

      queue.push(message);
      schedule();
    },
  });

  return () => {
    stop();
    cancelScheduled();
  };
}
