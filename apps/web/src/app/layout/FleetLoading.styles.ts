import { styled } from '@mui/material/styles';

export const LoadingRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(12, 2),
  textAlign: 'center',
}));
