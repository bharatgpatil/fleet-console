import { Button, ButtonBase } from '@mui/material';
import { styled } from '@mui/material/styles';

export const QueueList = styled('ol')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  listStyle: 'none',
  margin: `0 ${theme.spacing(-1)}`,
  padding: 0,
}));

export const QueueItem = styled('li')(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  '&:hover': { backgroundColor: theme.palette.action.hover },
}));

export const QueueItemButton = styled(ButtonBase)(({ theme }) => ({
  flex: 1,
  minWidth: 0,
  textAlign: 'left',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  gap: theme.spacing(1.25),
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
}));

export const AckButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(0.75),
  marginRight: theme.spacing(1),
  flexShrink: 0,
}));
