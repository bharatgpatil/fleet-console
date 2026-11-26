import { Alert } from '@mui/material';
import { useSyncExternalStore } from 'react';
import { STALE_FEED_MS } from '../../live/constants.ts';
import { getTick, subscribeTick } from '../../live/server-clock-tick.ts';
import { useFleet } from '../../live/use-fleet.ts';
import { formatClock } from '../../shared/utils/format.ts';

export function StaleBanner() {
  const hydrated = useFleet((state) => state.hydrated);
  const lastMessageAt = useFleet((state) => state.lastMessageAt);
  const clockOffsetMs = useFleet((state) => state.clockOffsetMs);
  const now = useSyncExternalStore(subscribeTick, getTick);

  if (!hydrated || now - lastMessageAt < STALE_FEED_MS) {
    return null;
  }

  return (
    <Alert severity="warning" variant="outlined" role="status" sx={{ mb: 2 }}>
      Updates paused. Showing data from {formatClock(lastMessageAt + clockOffsetMs)}. Reconnecting…
    </Alert>
  );
}
