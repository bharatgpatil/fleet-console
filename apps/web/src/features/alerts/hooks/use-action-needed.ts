import { useMemo } from 'react';
import type { Alert } from '@fleet/contracts';
import { useFleet } from '../../../live/use-fleet.ts';
import { rankActionNeeded } from '../utils/rank-action-needed.ts';

export function useActionNeeded(): Alert[] {
  const alertsById = useFleet((s) => s.alerts);

  return useMemo(() => rankActionNeeded(Object.values(alertsById)), [alertsById]);
}
