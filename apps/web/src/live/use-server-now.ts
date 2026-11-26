import { useSyncExternalStore } from 'react';
import { getTick, subscribeTick } from './server-clock-tick.ts';
import { useFleet } from './use-fleet.ts';

export function useServerNow(): number {
  const now = useSyncExternalStore(subscribeTick, getTick);
  const offset = useFleet((state) => state.clockOffsetMs);

  return now + offset;
}
