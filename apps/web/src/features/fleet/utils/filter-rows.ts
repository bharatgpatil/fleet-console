import type { RobotRow } from '../../../live/types.ts';
import type { RowFilter } from '../types.ts';

export function filterRows(
  rows: readonly RobotRow[],
  { siteId, health, query }: RowFilter,
): RobotRow[] {
  const needle = query === undefined ? '' : query.trim().toLowerCase();

  return rows.filter(
    (row) =>
      (siteId === null || row.robot.siteId === siteId) &&
      (health === undefined || row.health === health) &&
      (needle === '' || row.robot.name.toLowerCase().includes(needle)),
  );
}
