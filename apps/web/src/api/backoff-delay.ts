import { RECONNECT_BASE_MS, RECONNECT_MAX_MS } from './constants.ts';

export function backoffDelay(attempt: number): number {
  const ceiling = Math.min(RECONNECT_MAX_MS, RECONNECT_BASE_MS * 2 ** attempt);

  return Math.round(ceiling / 2 + Math.random() * (ceiling / 2));
}
