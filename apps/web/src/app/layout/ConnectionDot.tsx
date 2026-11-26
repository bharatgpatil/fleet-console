import { Stack, Tooltip, Typography } from '@mui/material';
import { useSyncExternalStore } from 'react';
import { getTick, subscribeTick } from '../../live/server-clock-tick.ts';
import { useFleet } from '../../live/use-fleet.ts';
import { HealthDot } from '../../shared/components/HealthDot.tsx';

export function ConnectionDot() {
  const link = useFleet((state) => state.link);
  const now = useSyncExternalStore(subscribeTick, getTick);

  if (link.status === 'live') {
    return (
      <Tooltip title="Receiving live updates">
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }} role="status">
          <HealthDot health="ok" size={8} />
          <Typography variant="caption" color="text.secondary">
            Live
          </Typography>
        </Stack>
      </Tooltip>
    );
  }

  const retryAt = link.retryInMs === null ? null : link.since + link.retryInMs;
  const secondsLeft = retryAt === null ? 0 : Math.ceil((retryAt - now) / 1_000);
  const detail = secondsLeft > 0 ? `Retrying in ${secondsLeft} s` : 'Connecting…';

  return (
    <Tooltip title={link.reason === null ? detail : `${link.reason}. ${detail}`}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }} role="status">
        <HealthDot health="warning" size={8} pulse />
        <Typography variant="caption" color="text.secondary">
          {link.status === 'reconnecting' ? 'Reconnecting' : 'Connecting'}
        </Typography>
      </Stack>
    </Tooltip>
  );
}
