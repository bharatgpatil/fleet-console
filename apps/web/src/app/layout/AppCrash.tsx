import { Button } from '@mui/material';
import { EmptyState } from '../../shared/components/EmptyState.tsx';

export function AppCrash() {
  return (
    <EmptyState title="Something went wrong">
      The console hit an error it couldn't recover from.
      <br />
      <Button variant="outlined" size="small" sx={{ mt: 2 }} onClick={() => location.reload()}>
        Reload
      </Button>
    </EmptyState>
  );
}
