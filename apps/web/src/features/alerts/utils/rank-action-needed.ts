import type { Alert } from '@fleet/contracts';

export function rankNeedsYou(alerts: readonly Alert[]): Alert[] {
  return alerts
    .filter((a) => a.resolvedAt === null && a.acknowledgedAt === null)
    .toSorted((a, b) =>
      a.severity === b.severity ? a.openedAt - b.openedAt : a.severity === 'critical' ? -1 : 1,
    );
}
