import { styled } from '@mui/material/styles';

export const AlertList = styled('ul')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  listStyle: 'none',
  margin: 0,
  padding: 0,
}));
