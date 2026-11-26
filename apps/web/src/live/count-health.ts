import type { HealthCounts, RobotRow } from './types.ts';

export function countHealth(rows: readonly RobotRow[]): HealthCounts {
  const counts: HealthCounts = {
    total: rows.length,
    critical: 0,
    offline: 0,
    warning: 0,
    ok: 0,
    unknown: 0,
  };

  for (const row of rows) {
    counts[row.health]++;
  }

  return counts;
}
