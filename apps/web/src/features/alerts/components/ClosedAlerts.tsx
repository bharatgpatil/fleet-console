import type { Alert } from '@fleet/contracts';
import { Stack, Typography } from '@mui/material';
import { useServerNow } from '../../../live/use-server-now.ts';
import { EmptyState } from '../../../shared/components/EmptyState.tsx';
import { formatAge, formatDuration } from '../../../shared/utils/format.ts';
import { AlertSeverityIcon } from './AlertSeverityIcon.tsx';
import { AlertList } from './RobotAlerts.styles.ts';

type ClosedAlertsProps = {
  alerts: readonly Alert[];
};

export function ClosedAlerts({ alerts }: ClosedAlertsProps) {
  const now = useServerNow();

  if (alerts.length === 0) {
    return <EmptyState title="Nothing closed in the last 30 minutes" />;
  }

  return (
    <AlertList>
      {alerts.map((alert) => (
        <Stack
          component="li"
          key={alert.id}
          direction="row"
          spacing={1.25}
          sx={{ alignItems: 'flex-start' }}
        >
          <AlertSeverityIcon alert={alert} />
          <Stack sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2">{alert.message}</Typography>
            <Typography variant="caption" color="text.secondary" className="tabular">
              {alert.resolvedAt === null
                ? null
                : `open ${formatDuration(alert.resolvedAt - alert.openedAt)} · closed ${formatAge(now - alert.resolvedAt)}`}
            </Typography>
          </Stack>
        </Stack>
      ))}
    </AlertList>
  );
}
