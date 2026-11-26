import type { Site } from '@fleet/contracts';
import { Tab } from '@mui/material';
import { useMemo } from 'react';
import { ALL_SITES } from '../../../app/search.ts';
import type { RobotRow } from '../../../live/types.ts';
import { needsAttention } from '../utils/needs-attention.ts';
import { CountBadge, SiteTabsBar, TabLabel } from './SiteTabs.styles.ts';

type SiteTabsProps = {
  sites: readonly Site[];
  rows: readonly RobotRow[];
  value: string;
  onChange: (siteId: string) => void;
};

export function SiteTabs({ sites, rows, value, onChange }: SiteTabsProps) {
  const attentionBySite = useMemo(
    () =>
      Map.groupBy(
        rows.filter((row) => needsAttention(row.health)),
        (row) => row.robot.siteId,
      ),
    [rows],
  );

  return (
    <SiteTabsBar
      value={value}
      onChange={(_, siteId: string) => onChange(siteId)}
      variant="scrollable"
      scrollButtons="auto"
      aria-label="Site"
    >
      <Tab value={ALL_SITES} label="All sites" />
      {sites.map((site) => {
        const attention = attentionBySite.get(site.id)?.length ?? 0;

        return (
          <Tab
            key={site.id}
            value={site.id}
            aria-label={attention > 0 ? `${site.name}, ${attention} need attention` : site.name}
            label={
              <TabLabel>
                {site.name}
                {attention > 0 ? (
                  <CountBadge aria-hidden className="tabular">
                    {attention}
                  </CountBadge>
                ) : null}
              </TabLabel>
            }
          />
        );
      })}
    </SiteTabsBar>
  );
}
