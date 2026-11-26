import { TextField } from '@mui/material';
import { styled } from '@mui/material/styles';

export const PageStack = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2.5),
}));

export const PageTitle = styled('h1')(({ theme }) => ({
  ...theme.typography.h4,
  margin: 0,
}));

export const CardActions = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  flex: '1 1 auto',
  justifyContent: 'space-between',
  gap: theme.spacing(1.5),
}));

export const SearchField = styled(TextField)(({ theme }) => ({
  width: 220,
  [theme.breakpoints.up('sm')]: { width: 260 },
}));

export const CardBody = styled('div', { shouldForwardProp: (prop) => prop !== 'withMap' })<{
  withMap: boolean;
}>(({ theme, withMap }) => ({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr)',
  borderTop: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.up('xl')]: {
    gridTemplateColumns: withMap ? 'minmax(0, 1fr) 560px' : 'minmax(0, 1fr)',
    height: 'max(640px, calc(100dvh - 320px))',
  },
}));

export const MapPane = styled('div')(({ theme }) => ({
  padding: theme.spacing(1.5),
  height: 360,
  [theme.breakpoints.up('md')]: { height: 480 },
  [theme.breakpoints.up('xl')]: { height: '100%' },
}));

export const ListPane = styled('div', { shouldForwardProp: (prop) => prop !== 'besideMap' })<{
  besideMap: boolean;
}>(({ theme, besideMap }) => ({
  minWidth: 0,
  minHeight: 0,
  padding: theme.spacing(1.5),
  borderTop: besideMap ? `1px solid ${theme.palette.divider}` : 0,
  [theme.breakpoints.up('xl')]: {
    borderTop: 0,
    borderLeft: besideMap ? `1px solid ${theme.palette.divider}` : 0,
  },
}));
