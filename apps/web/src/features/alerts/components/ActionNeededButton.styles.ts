import { Box, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

export const ButtonLabel = styled('span')(({ theme }) => ({
  display: 'none',
  marginRight: theme.spacing(1),
  [theme.breakpoints.up('sm')]: { display: 'inline' },
}));

export const DrawerBody = styled(Stack)(({ theme }) => ({
  width: '100vw',
  height: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: { width: 420 },
}));

export const DrawerScroll = styled(Box)({
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
});
