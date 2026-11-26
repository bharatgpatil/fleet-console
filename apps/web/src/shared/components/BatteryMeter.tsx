import BoltIcon from '@mui/icons-material/Bolt';
import { Stack, Typography } from '@mui/material';
import { batteryTone } from '../utils/battery-tone.ts';
import { MeterFill, MeterTrack, MeterValue } from './BatteryMeter.styles.ts';

type BatteryMeterProps = {
  value: number;
  charging: boolean;
  stale: boolean;
  width: number;
};

export function BatteryMeter({ value, charging, stale, width }: BatteryMeterProps) {
  const percent = Math.round(value);

  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{ alignItems: 'center' }}
      role="meter"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Battery ${percent}%${charging ? ', charging' : ''}${stale ? ', last known' : ''}`}
    >
      <MeterTrack trackWidth={width}>
        <MeterFill
          tone={batteryTone(value)}
          stale={stale}
          style={{ transform: `scaleX(${Math.max(2, value) / 100})` }}
        />
      </MeterTrack>
      <Typography
        variant="body2"
        component={MeterValue}
        className="tabular"
        color={stale ? 'text.secondary' : 'text.primary'}
      >
        {percent}%
      </Typography>
      {charging ? <BoltIcon fontSize="inherit" sx={{ color: 'primary.main', ml: -0.5 }} /> : null}
    </Stack>
  );
}
