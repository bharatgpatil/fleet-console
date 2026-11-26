import { Tabs } from '@mui/material';
import { styled } from '@mui/material/styles';

export const SiteTabsBar = styled(Tabs)(({ theme }) => ({
  minHeight: 44,
  borderBottom: `1px solid ${theme.palette.divider}`,
  '& .MuiTab-root': { minHeight: 44, padding: theme.spacing(0, 2) },
}));

export const TabLabel = styled('span')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

export const CountBadge = styled('span')(({ theme }) => ({
  minWidth: 20,
  height: 20,
  padding: theme.spacing(0, 0.75),
  borderRadius: theme.tokens.radius.pill,
  fontSize: theme.typography.caption.fontSize,
  lineHeight: '20px',
  fontWeight: 700,
  backgroundColor: theme.palette.warning.main,
  color: theme.palette.warning.contrastText,
}));
