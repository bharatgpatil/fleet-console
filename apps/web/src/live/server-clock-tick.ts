import { CLOCK_TICK_MS } from './constants.ts';

const listeners = new Set<() => void>();
let tickNow = Date.now();
let timer: ReturnType<typeof setInterval> | undefined;

export function subscribeTick(listener: () => void): () => void {
  listeners.add(listener);

  if (timer === undefined) {
    timer = setInterval(() => {
      tickNow = Date.now();

      for (const notify of listeners) {
        notify();
      }
    }, CLOCK_TICK_MS);
  }

  return () => {
    listeners.delete(listener);

    if (listeners.size === 0) {
      clearInterval(timer);
      timer = undefined;
    }
  };
}

export function getTick(): number {
  return tickNow;
}
