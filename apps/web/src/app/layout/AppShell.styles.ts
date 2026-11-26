import { AppBar, Toolbar } from '@mui/material';
import { styled } from '@mui/material/styles';

export const ShellRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100dvh',
  backgroundColor: theme.palette.background.default,
}));

export const SkipLink = styled('a')(({ theme }) => ({
  position: 'absolute',
  left: 8,
  top: -48,
  zIndex: theme.zIndex.tooltip,
  padding: theme.spacing(1, 2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  fontWeight: 600,
  '&:focus': { top: 8 },
}));

export const TopBar = styled(AppBar)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.default,
}));

const PAGE_MAX_WIDTH = 1600;

export const TopBarToolbar = styled(Toolbar)(({ theme }) => ({
  gap: theme.spacing(2),
  minHeight: 56,
  width: '100%',
  maxWidth: PAGE_MAX_WIDTH,
  marginInline: 'auto',
}));

export const Spacer = styled('div')({
  flex: 1,
});

export const Main = styled('main')(({ theme }) => ({
  flex: 1,
  width: '100%',
  maxWidth: PAGE_MAX_WIDTH,
  marginInline: 'auto',
  padding: theme.spacing(1.5, 1.5, 4),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(3, 3, 6),
  },
}));
