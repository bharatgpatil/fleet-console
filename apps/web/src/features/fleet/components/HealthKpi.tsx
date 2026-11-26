import { Box, Card, CardActionArea } from '@mui/material';
import type { Health } from '../../../live/types.ts';
import { HealthDot } from '../../../shared/components/HealthDot.tsx';
import { HealthIcon } from '../../../shared/components/HealthIcon.tsx';
import { Kpi } from './Kpi.tsx';

type HealthKpiProps = {
  health: Health;
  label: string;
  value: number;
  onSelect: () => void;
};

export function HealthKpi({ health, label, value, onSelect }: HealthKpiProps) {
  const pulsing = health === 'critical' && value > 0;

  return (
    <Card>
      <CardActionArea
        onClick={onSelect}
        aria-label={`${value} ${label.toLowerCase()}, show them across all sites`}
      >
        <Kpi
          label={label}
          value={
            <Box
              component="span"
              sx={(theme) => ({ color: value > 0 ? theme.palette.health[health] : 'text.primary' })}
            >
              {value}
            </Box>
          }
          adornment={
            pulsing ? (
              <HealthDot health={health} size={8} pulse />
            ) : (
              <HealthIcon health={health} size={15} />
            )
          }
        />
      </CardActionArea>
    </Card>
  );
}
