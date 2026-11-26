import type { Alert } from '@fleet/contracts';

function criticalFirstThenNewest(a: Alert, b: Alert): number {
  if (a.severity !== b.severity) {
    return a.severity === 'critical' ? -1 : 1;
  }

  return b.openedAt - a.openedAt;
}

export function groupOpenAlertsByRobot(alerts: Record<string, Alert>): Map<string, Alert[]> {
  const open = Object.values(alerts).filter((alert) => alert.resolvedAt === null);
  const byRobot = Map.groupBy(open, (alert) => alert.robotId);

  for (const list of byRobot.values()) {
    list.sort(criticalFirstThenNewest);
  }

  return byRobot;
}
