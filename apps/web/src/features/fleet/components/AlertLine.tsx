import type { Alert } from '@fleet/contracts';
import { Stack, Typography } from '@mui/material';
import { HealthDot } from '../../../shared/components/HealthDot.tsx';

type AlertLineProps = {
  alerts: readonly Alert[];
};

export function AlertLine({ alerts }: AlertLineProps) {
  const [top] = alerts;

  if (top === undefined) {
    return (
      <Typography variant="body2" color="text.secondary">
        —
      </Typography>
    );
  }

  return (
    <Stack
      direction="row"
      spacing={0.75}
      sx={{ alignItems: 'center', minWidth: 0 }}
      title={alerts.map((alert) => alert.message).join('\n')}
    >
      <HealthDot health={top.severity === 'critical' ? 'critical' : 'warning'} size={6} />
      <Typography variant="body2" noWrap color="text.secondary">
        {top.message}
      </Typography>
    </Stack>
  );
}
