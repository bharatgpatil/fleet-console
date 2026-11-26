import type { Alert } from '@fleet/contracts';
import { useMemo } from 'react';
import { groupOpenAlertsByRobot } from './group-open-alerts.ts';
import { useFleet } from './use-fleet.ts';

export function useOpenAlertsByRobot(): Map<string, Alert[]> {
  const alerts = useFleet((state) => state.alerts);

  return useMemo(() => groupOpenAlertsByRobot(alerts), [alerts]);
}
