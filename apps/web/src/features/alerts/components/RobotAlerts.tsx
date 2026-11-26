import { Button, Stack, Typography } from '@mui/material';
import type { Alert } from '@fleet/contracts';
import { useServerNow } from '../../../live/use-server-now.ts';
import { formatDuration } from '../../../shared/utils/format.ts';
import { EmptyState } from '../../../shared/components/EmptyState.tsx';
import { AlertSeverityIcon } from './AlertSeverityIcon.tsx';
import { useFocusAfterAck } from '../hooks/use-focus-after-ack.ts';
import { useAcknowledgeAlerts } from '../mutations/use-acknowledge-alert.ts';
import { AlertList } from './RobotAlerts.styles.ts';

type RobotAlertsProps = {
  alerts: readonly Alert[];
};

export function RobotAlerts({ alerts }: RobotAlertsProps) {
  const acknowledge = useAcknowledgeAlerts();
  const now = useServerNow();
  const failedIds = acknowledge.data?.failedIds ?? [];
  const { containerRef, rememberPosition } = useFocusAfterAck(alerts);

  if (alerts.length === 0) {
    return <EmptyState title="No open alerts" />;
  }

  return (
    <div ref={containerRef} tabIndex={-1}>
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
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {alert.message}
              </Typography>
              <Typography variant="caption" color="text.secondary" className="tabular">
                open {formatDuration(now - alert.openedAt)}
                {alert.acknowledgedAt === null ? null : ' · acknowledged'}
              </Typography>
              {failedIds.includes(alert.id) && alert.acknowledgedAt === null ? (
                <Typography variant="caption" color="error">
                  Couldn't acknowledge, try again
                </Typography>
              ) : null}
            </Stack>
            {alert.acknowledgedAt === null ? (
              <Button
                size="small"
                variant="outlined"
                data-ack
                onClick={(event) => {
                  rememberPosition(event.currentTarget);
                  acknowledge.mutate([alert.id]);
                }}
                aria-label={`Acknowledge: ${alert.message}`}
              >
                Ack
              </Button>
            ) : null}
          </Stack>
        ))}
      </AlertList>
    </div>
  );
}
