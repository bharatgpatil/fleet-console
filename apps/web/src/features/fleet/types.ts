import type { Site } from '@fleet/contracts';
import type { HealthFilter } from '../../app/search.ts';
import type { HealthCounts } from '../../live/types.ts';

export type RowFilter = {
  siteId: string | null;
  health: HealthFilter | undefined;
  query: string | undefined;
};

export type SiteSummary = {
  site: Site;
  counts: HealthCounts;
};
