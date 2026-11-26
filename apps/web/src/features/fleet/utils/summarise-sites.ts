import type { Site } from '@fleet/contracts';
import { countHealth } from '../../../live/count-health.ts';
import type { RobotRow } from '../../../live/types.ts';
import type { SiteSummary } from '../types.ts';

function mostAttentionFirst(a: SiteSummary, b: SiteSummary): number {
  return (
    b.counts.critical - a.counts.critical ||
    b.counts.offline - a.counts.offline ||
    b.counts.warning - a.counts.warning ||
    a.site.name.localeCompare(b.site.name)
  );
}

export function summariseSites(sites: readonly Site[], rows: readonly RobotRow[]): SiteSummary[] {
  const rowsBySite = Map.groupBy(rows, (row) => row.robot.siteId);

  return sites
    .map((site) => ({ site, counts: countHealth(rowsBySite.get(site.id) ?? []) }))
    .toSorted(mostAttentionFirst);
}
