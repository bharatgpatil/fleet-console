import { Typography } from '@mui/material';
import type { ReactNode } from 'react';
import { SectionHeader, SectionRoot, SectionTitle } from './SectionCard.styles.ts';

type SectionCardProps = {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
};

export function SectionCard({ title, subtitle, action, children }: SectionCardProps) {
  return (
    <SectionRoot component="section">
      <SectionHeader direction="row" spacing={2} useFlexGap>
        <SectionTitle>
          <Typography variant="h6" component="h2" noWrap>
            {title}
          </Typography>
          {subtitle === undefined ? null : (
            <Typography variant="caption" color="text.secondary" noWrap>
              {subtitle}
            </Typography>
          )}
        </SectionTitle>
        {action}
      </SectionHeader>
      {children}
    </SectionRoot>
  );
}
