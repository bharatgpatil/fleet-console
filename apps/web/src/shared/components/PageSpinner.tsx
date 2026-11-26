import { CircularProgress, Stack } from '@mui/material';

export function PageSpinner() {
  return (
    <Stack sx={{ alignItems: 'center', py: 12 }}>
      <CircularProgress aria-label="Loading fleet" />
    </Stack>
  );
}
