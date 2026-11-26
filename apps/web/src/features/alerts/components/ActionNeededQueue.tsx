import { Box, Button, Stack, Typography } from '@mui/material';
import { useNavigate } from '@tanstack/react-router';
import type { Alert } from '@fleet/contracts';
import { useFleet } from '../../../live/use-fleet.ts';
import { useServerNow } from '../../../live/use-server-now.ts';
import { formatDuration } from '../../../shared/utils/format.ts';
import { HealthIcon } from '../../../shared/components/HealthIcon.tsx';
import { useFocusAfterAck } from '../hooks/use-focus-after-ack.ts';
import { useAcknowledgeAlerts } from '../mutations/use-acknowledge-alert.ts';
import { AckButton, QueueItem, QueueItemButton, QueueList } from './ActionNeededQueue.styles.ts';

const MAX_ITEMS = 20;

type ActionNeededQueueProps = {
  alerts: readonly Alert[];
  onOpenRobot?: () => void;
};

export function ActionNeededQueue({ alerts, onOpenRobot }: ActionNeededQueueProps) {
  const robots = useFleet((state) => state.robots);
  const sites = useFleet((state) => state.sites);
  const navigate = useNavigate();
  const acknowledge = useAcknowledgeAlerts();
  const now = useServerNow();
  const failedIds = acknowledge.data?.failedIds ?? [];
  const { containerRef, rememberPosition } = useFocusAfterAck(alerts);
  const visible = alerts.slice(0, MAX_ITEMS);

  return (
    <div ref={containerRef} tabIndex={-1}>
      {alerts.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No unacknowledged alerts. New problems appear here with what to do next.
        </Typography>
      ) : (
        <>
          {visible.length > 1 ? (
            <Stack direction="row" sx={{ justifyContent: 'flex-end', mb: 1 }}>
              <Button
                size="small"
                onClick={(event) => {
                  rememberPosition(event.currentTarget);
                  acknowledge.mutate(visible.map((alert) => alert.id));
                }}
              >
                Ack all {visible.length} shown
              </Button>
            </Stack>
          ) : null}
          <QueueList>
            {visible.map((alert) => {
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
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{ alignItems: 'baseline', minWidth: 0 }}
                      >
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
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        noWrap
                        title={alert.message}
                      >
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
                    data-ack
                    onClick={(event) => {
                      rememberPosition(event.currentTarget);
                      acknowledge.mutate([alert.id]);
                    }}
                    aria-label={`Acknowledge ${robotName}: ${alert.message}`}
                  >
                    Ack
                  </AckButton>
                </QueueItem>
              );
            })}
          </QueueList>
          {alerts.length > MAX_ITEMS ? (
            <Typography variant="caption" color="text.secondary">
              {alerts.length - MAX_ITEMS} more not shown. Acknowledge some to see them.
            </Typography>
          ) : null}
        </>
      )}
    </div>
  );
}
