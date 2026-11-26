import { Box, Stack, Typography } from '@mui/material';
import { useNavigate } from '@tanstack/react-router';
import type { Alert } from '@fleet/contracts';
import { useFleet } from '../../../live/use-fleet.ts';
import { useServerNow } from '../../../live/use-server-now.ts';
import { formatDuration } from '../../../shared/utils/format.ts';
import { HealthIcon } from '../../../shared/components/HealthIcon.tsx';
import { useAcknowledgeAlerts } from '../mutations/use-acknowledge-alert.ts';
import { AckButton, QueueItem, QueueItemButton, QueueList } from './NeedsYouQueue.styles.ts';

const MAX_ITEMS = 20;

type NeedsYouQueueProps = {
  alerts: readonly Alert[];
  onOpenRobot?: () => void;
};

export function NeedsYouQueue({ alerts, onOpenRobot }: NeedsYouQueueProps) {
  const robots = useFleet((s) => s.robots);
  const sites = useFleet((s) => s.sites);
  const navigate = useNavigate();
  const acknowledge = useAcknowledgeAlerts();
  const now = useServerNow();
  const failedIds = acknowledge.data?.failedIds ?? [];

  if (alerts.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No unacknowledged alerts. New problems appear here with what to do next.
      </Typography>
    );
  }

  return (
    <QueueList>
      {alerts.slice(0, MAX_ITEMS).map((alert) => {
        const robotName = robots[alert.robotId]?.name ?? alert.robotId;

        return (
          <QueueItem key={alert.id}>
            <QueueItemButton
              onClick={() => {
                void navigate({ to: '/robots/$robotId', params: { robotId: alert.robotId } });
                onOpenRobot?.();
              }}
              aria-label={`${robotName}: ${alert.message}. Open robot.`}
            >
              <Box sx={{ pt: '2px' }}>
                <HealthIcon
                  health={alert.severity === 'critical' ? 'critical' : 'warning'}
                  size={18}
                />
              </Box>
              <Stack spacing={0.25} sx={{ minWidth: 0, flex: 1 }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'baseline', minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    noWrap
                    dir="auto"
                    sx={{ fontWeight: 600, minWidth: 0 }}
                  >
                    {robotName}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    noWrap
                    dir="auto"
                    sx={{ minWidth: 0 }}
                  >
                    {sites[alert.siteId]?.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    className="tabular"
                    sx={{ ml: 'auto', flexShrink: 0 }}
                  >
                    {formatDuration(now - alert.openedAt)}
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary" noWrap title={alert.message}>
                  {alert.message}
                </Typography>
                {failedIds.includes(alert.id) && alert.acknowledgedAt === null ? (
                  <Typography variant="caption" color="error">
                    Couldn't acknowledge, try again
                  </Typography>
                ) : null}
              </Stack>
            </QueueItemButton>
            <AckButton
              size="small"
              onClick={() => acknowledge.mutate([alert.id])}
              aria-label={`Acknowledge ${robotName}: ${alert.message}`}
            >
              Ack
            </AckButton>
          </QueueItem>
        );
      })}
    </QueueList>
  );
}
