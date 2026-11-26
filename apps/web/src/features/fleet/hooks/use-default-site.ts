import type { Site } from '@fleet/contracts';
import { useEffect } from 'react';
import type { RobotRow } from '../../../live/types.ts';
import { summariseSites } from '../utils/summarise-sites.ts';

export function useDefaultSite({
  needed,
  sites,
  rows,
  select,
}: {
  needed: boolean;
  sites: readonly Site[];
  rows: readonly RobotRow[];
  select: (siteId: string) => void;
}): void {
  useEffect(() => {
    if (!needed) {
      return;
    }

    const busiest = summariseSites(sites, rows)[0];

    if (busiest !== undefined) {
      select(busiest.site.id);
    }
  }, [needed, sites, rows, select]);
}
