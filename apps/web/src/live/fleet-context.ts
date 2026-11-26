import { createContext } from 'react';
import type { FleetApi } from '../api/types.ts';
import type { FleetStore } from './fleet-store.ts';

export type FleetContextValue = {
  api: FleetApi;
  store: FleetStore;
};

export const FleetContext = createContext<FleetContextValue | null>(null);
