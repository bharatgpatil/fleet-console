import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const ReadingsGrid = styled(Box, { shouldForwardProp: (prop) => prop !== 'stale' })<{
  stale: boolean;
}>(({ theme, stale }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: theme.spacing(2),
  opacity: stale ? 0.7 : 1,
}));
