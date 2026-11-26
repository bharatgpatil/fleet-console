import { Typography } from '@mui/material';
import type { ReactNode } from 'react';
import { EmptyRoot } from './EmptyState.styles.ts';

type EmptyStateProps = {
  title: string;
  children?: ReactNode;
};

export function EmptyState({ title, children }: EmptyStateProps) {
  return (
    <EmptyRoot spacing={1}>
      <Typography variant="subtitle2" component="p" color="text.primary">
        {title}
      </Typography>
      {children === undefined ? null : <Typography variant="body2">{children}</Typography>}
    </EmptyRoot>
  );
}
