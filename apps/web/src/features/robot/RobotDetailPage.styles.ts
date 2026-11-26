import { Box, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
export const backLinkSx = {
  alignSelf: 'flex-start',
  ml: -1,
  color: 'text.secondary',
  maxWidth: '100%',
  minWidth: 0,
} as const;

export const BackLinkLabel = styled('span')({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const HeaderRow = styled(Stack)(({ theme }) => ({
  justifyContent: 'space-between',
  [theme.breakpoints.up('md')]: { alignItems: 'center' },
}));

export const TitleRow = styled(Stack)({
  alignItems: 'center',
  flexWrap: 'wrap',
  minWidth: 0,
});

export const RobotName = styled(Typography)(({ theme }) => ({
  overflowWrap: 'anywhere',
  minWidth: 0,
  fontSize: '1.6rem',
  [theme.breakpoints.up('sm')]: { fontSize: '2.125rem' },
}));

export const DetailGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(2),
  gridTemplateColumns: '1fr',
  [theme.breakpoints.up('lg')]: { gridTemplateColumns: '320px 1fr' },
}));

export const MapWell = styled(Box)(({ theme }) => ({
  flex: 1,
  minHeight: 300,
  padding: `0 ${theme.spacing(1.5)}`,
  [theme.breakpoints.up('md')]: { minHeight: 420 },
}));

export const CardPadding = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2, 2),
}));
