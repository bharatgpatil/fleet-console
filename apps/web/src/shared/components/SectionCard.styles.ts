import { Card, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import type { ElementType } from 'react';

export const SectionRoot = styled(Card)<{ component?: ElementType }>({
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
});

export const SectionHeader = styled(Stack)(({ theme }) => ({
  alignItems: 'center',
  flexWrap: 'wrap',
  rowGap: theme.spacing(1),
  padding: theme.spacing(1.75, 2, 1.5),
  minHeight: 52,
}));

export const SectionTitle = styled(Stack)({
  flex: '1 1 180px',
  minWidth: 0,
});
