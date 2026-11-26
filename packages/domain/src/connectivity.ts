import type { Connectivity } from '@fleet/contracts';
import { CONNECTIVITY_THRESHOLDS } from './constants.ts';
import type { ConnectivityThresholds } from './types.ts';

export function deriveConnectivity({
  lastSeenAt,
  now,
  thresholds = CONNECTIVITY_THRESHOLDS,
}: {
  lastSeenAt: number | null;
  now: number;
  thresholds?: ConnectivityThresholds;
}): Connectivity {
  if (lastSeenAt === null) {
    return 'offline';
  }

  const silentForMs = now - lastSeenAt;

  if (silentForMs >= thresholds.offlineAfterMs) {
    return 'offline';
  }

  if (silentForMs >= thresholds.staleAfterMs) {
    return 'stale';
  }

  return 'online';
}
