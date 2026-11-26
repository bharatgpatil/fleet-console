import type { TelemetrySample } from '@fleet/contracts';
import { Stack, Typography } from '@mui/material';
import { BatteryMeter } from '../../../shared/components/BatteryMeter.tsx';
import { ReadingsGrid } from './LiveTelemetry.styles.ts';
import { TelemetryReading } from './TelemetryReading.tsx';

type LiveTelemetryProps = {
  last: TelemetrySample;
  stale: boolean;
};

export function LiveTelemetry({ last, stale }: LiveTelemetryProps) {
  const charging = last.activity === 'charging';

  return (
    <Stack spacing={2.5}>
      <div>
        <Typography variant="overline" color="text.secondary">
          {stale ? 'Battery, last known' : 'Battery'}
        </Typography>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'baseline' }}>
          <Typography variant="h4" component="p" className="tabular">
            {Math.round(last.battery)}%
          </Typography>
          <Typography variant="body2" color={charging ? 'primary.main' : 'text.secondary'}>
            {charging ? 'charging' : 'draining'}
          </Typography>
        </Stack>
        <BatteryMeter value={last.battery} charging={charging} stale={stale} width={240} />
      </div>
      <ReadingsGrid>
        <TelemetryReading
          label="Activity"
          value={last.activity}
          capitalize
          emphasis={last.activity === 'error' ? 'error.main' : undefined}
        />
        <TelemetryReading label="Error code" value={last.errorCode ?? '—'} mono />
        <TelemetryReading
          label="Speed"
          value={`${last.speedMetresPerSecond.toFixed(2)} m/s`}
          mono
        />
        <TelemetryReading
          label="Position"
          value={`${last.position.x.toFixed(1)}, ${last.position.y.toFixed(1)} m`}
          mono
        />
      </ReadingsGrid>
    </Stack>
  );
}
