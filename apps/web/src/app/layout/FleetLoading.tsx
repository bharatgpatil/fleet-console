import { CircularProgress, Typography } from '@mui/material';
import { SLOW_CONNECT_MS } from '../../live/constants.ts';
import { useAfterDelay } from '../../shared/hooks/use-after-delay.ts';
import { LoadingRoot } from './FleetLoading.styles.ts';

export function FleetLoading() {
  const slow = useAfterDelay(SLOW_CONNECT_MS);

  return (
    <LoadingRoot role="status">
      <CircularProgress aria-label="Loading fleet" />
      {slow ? (
        <Typography variant="body2" color="text.secondary">
          Can't reach the server yet. Retrying…
        </Typography>
      ) : null}
    </LoadingRoot>
  );
}
