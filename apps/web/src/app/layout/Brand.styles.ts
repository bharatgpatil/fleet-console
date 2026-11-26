import { styled } from '@mui/material/styles';

export const BrandMark = styled('div')(({ theme }) => ({
  width: 28,
  height: 28,
  borderRadius: `calc(1.5 * ${theme.shape.borderRadius})`,
  display: 'grid',
  placeItems: 'center',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
}));

export const BrandName = styled('span')(({ theme }) => ({
  display: 'none',
  [theme.breakpoints.up('sm')]: { display: 'inline' },
}));
