import { Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';

type KpiProps = {
  label: string;
  value: ReactNode;
  suffix?: string;
  adornment?: ReactNode;
};

export function Kpi({ label, value, suffix, adornment }: KpiProps) {
  return (
    <Stack spacing={0.5} sx={{ p: 2 }}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        {adornment}
        <Typography variant="overline" color="text.secondary">
          {label}
        </Typography>
      </Stack>
      <Typography variant="h4" component="p" className="tabular">
        {value}
        {suffix === undefined ? null : (
          <Typography component="span" variant="h6" color="text.secondary" sx={{ ml: 0.5 }}>
            {suffix}
          </Typography>
        )}
      </Typography>
    </Stack>
  );
}
