import type { Alert, RobotLiveState } from '@fleet/contracts';
import type { Health } from './types.ts';

export function robotHealth(
  state: RobotLiveState | undefined,
  openAlerts: readonly Alert[],
): Health {
  if (state === undefined || state.lastSeenAt === null) {
    return 'unknown';
  }

  if (state.connectivity === 'offline') {
    return 'offline';
  }

  if (openAlerts.some((alert) => alert.severity === 'critical')) {
    return 'critical';
  }

  if (openAlerts.length > 0 || state.connectivity === 'stale') {
    return 'warning';
  }

  return 'ok';
}
