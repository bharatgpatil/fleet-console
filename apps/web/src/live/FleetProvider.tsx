import { useEffect, useMemo, useState, type ReactNode } from 'react';
import type { FleetApi } from '../api/types.ts';
import { FleetContext } from './fleet-context.ts';
import { createFleetStore } from './fleet-store.ts';
import { startLiveSync } from './live-sync.ts';

type FleetProviderProps = {
  api: FleetApi;
  children: ReactNode;
};

export function FleetProvider({ api, children }: FleetProviderProps) {
  const [store] = useState(createFleetStore);
  const value = useMemo(() => ({ api, store }), [api, store]);

  useEffect(() => startLiveSync(api.stream, store), [api, store]);

  return <FleetContext.Provider value={value}>{children}</FleetContext.Provider>;
}
