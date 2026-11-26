import { Typography } from '@mui/material';

export function TelemetryReading({
  label,
  value,
  mono = false,
  capitalize = false,
  emphasis,
}: {
  label: string;
  value: string;
  mono?: boolean;
  capitalize?: boolean;
  emphasis?: string | undefined;
}) {
  return (
    <div>
      <Typography variant="caption" color="text.secondary" component="p">
        {label}
      </Typography>
      <Typography
        variant="body1"
        className={mono ? 'tabular' : undefined}
        color={emphasis ?? 'text.primary'}
        sx={{ textTransform: capitalize ? 'capitalize' : undefined, fontWeight: 500 }}
      >
        {value}
      </Typography>
    </div>
  );
}
