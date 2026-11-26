import { styled } from '@mui/material/styles';

export const KpiGrid = styled('div')(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(1.5),
  gridTemplateColumns: 'repeat(2, 1fr)',
  [theme.breakpoints.up('md')]: { gridTemplateColumns: 'repeat(4, 1fr)' },
}));
