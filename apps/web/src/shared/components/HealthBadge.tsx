import { Stack, Typography } from '@mui/material';
import { HEALTH_LABEL } from '../../live/constants.ts';
import type { Health } from '../../live/types.ts';
import { HealthIcon } from './HealthIcon.tsx';

type HealthBadgeProps = {
  health: Health;
};

export function HealthBadge({ health }: HealthBadgeProps) {
  return (
    <Stack
      direction="row"
      spacing={0.75}
      sx={(theme) => ({ alignItems: 'center', color: theme.palette.health[health] })}
    >
      <HealthIcon health={health} />
      <Typography variant="body2" component="span" sx={{ fontWeight: 600, color: 'inherit' }}>
        {HEALTH_LABEL[health]}
      </Typography>
    </Stack>
  );
}
