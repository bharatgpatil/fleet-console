import type { Alert } from '@fleet/contracts';
import type { FleetStore } from '../../../live/fleet-store.ts';
export function writeUnlessResolved(store: FleetStore, alert: Alert) {
  const { alerts, upsertAlert } = store.getState();

  if (alerts[alert.id]?.resolvedAt === null) {
    upsertAlert(alert);
  }
}
