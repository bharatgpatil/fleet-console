import { useMemo } from 'react';
import type { Alert } from '@fleet/contracts';
import { useFleet } from '../../../live/use-fleet.ts';
import { rankNeedsYou } from '../utils/rank-needs-you.ts';

export function useNeedsYou(): Alert[] {
  const alertsById = useFleet((s) => s.alerts);

  return useMemo(() => rankNeedsYou(Object.values(alertsById)), [alertsById]);
}
