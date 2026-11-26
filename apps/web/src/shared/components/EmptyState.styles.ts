import { Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

export const EmptyRoot = styled(Stack)(({ theme }) => ({
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  padding: theme.spacing(6, 2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));
