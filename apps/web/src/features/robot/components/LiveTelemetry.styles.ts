import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const ReadingsGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: theme.spacing(2),
}));
