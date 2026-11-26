import { TableRow } from '@mui/material';
import { styled } from '@mui/material/styles';

const STACKED_HEIGHT = 560;

export const TableFrame = styled('div', { shouldForwardProp: (prop) => prop !== 'fill' })<{
  fill: boolean;
}>(({ fill }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: fill ? '100%' : STACKED_HEIGHT,
  minHeight: 0,
}));

export const TableScroll = styled('div')({
  flex: 1,
  minHeight: 0,
  overflow: 'auto',
});

export const BodyRow = styled(TableRow, {
  shouldForwardProp: (prop) => prop !== 'highlighted',
})<{ highlighted: boolean }>(({ theme, highlighted }) => ({
  cursor: 'pointer',
  backgroundColor: highlighted ? theme.palette.action.hover : undefined,
  '& td': { height: 52 },
}));

export const NameCell = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.25),
  minWidth: 0,
}));

export const NameStack = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
  lineHeight: 1.25,
});
