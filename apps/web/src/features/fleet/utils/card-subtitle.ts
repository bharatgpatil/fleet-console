import type { RobotRow } from '../../../live/types.ts';
import { countLabel } from '../../../shared/utils/format.ts';

export function cardSubtitle({
  rows,
  matches,
  showAll,
}: {
  rows: readonly RobotRow[];
  matches: number | null;
  showAll: boolean;
}): string {
  if (matches !== null) {
    const dimmed = showAll ? '' : ', other robots dimmed';

    return `Showing ${countLabel(matches, 'match', 'matches')}${dimmed}`;
  }

  const reporting = rows.filter((row) => row.state?.connectivity === 'online').length;
  const delayed = rows.filter((row) => row.state?.connectivity === 'stale').length;
  const delayedText = delayed > 0 ? `, ${delayed} delayed` : '';

  return `${countLabel(rows.length, 'robot')}, ${reporting} reporting${delayedText}`;
}
