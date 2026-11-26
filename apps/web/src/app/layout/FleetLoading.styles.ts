import { styled } from '@mui/material/styles';

export const LoadingRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(2),
  minHeight: '100dvh',
  padding: theme.spacing(0, 2),
  textAlign: 'center',
  backgroundColor: theme.palette.background.default,
}));
