import { Tooltip, Typography } from '@mui/material';
import { useServerNow } from '../../live/use-server-now.ts';
import { formatAge, formatClock } from '../utils/format.ts';

type RelativeTimeProps = {
  timestamp: number | null;
  muted: boolean;
};

export function RelativeTime({ timestamp, muted }: RelativeTimeProps) {
  const now = useServerNow();

  if (timestamp === null) {
    return (
      <Typography variant="body2" color="text.secondary">
        never
      </Typography>
    );
  }

  return (
    <Tooltip title={formatClock(timestamp)} placement="top" describeChild>
      <Typography
        variant="body2"
        component="time"
        className="tabular"
        dateTime={new Date(timestamp).toISOString()}
        color={muted ? 'text.secondary' : 'text.primary'}
      >
        {formatAge(now - timestamp)}
      </Typography>
    </Tooltip>
  );
}
