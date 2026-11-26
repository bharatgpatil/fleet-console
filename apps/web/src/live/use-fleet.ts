import { useContext } from 'react';
import { useStore } from 'zustand';
import type { FleetApi } from '../api/types.ts';
import { FleetContext, type FleetContextValue } from './fleet-context.ts';
import type { FleetStore } from './fleet-store.ts';
import type { FleetActions, FleetState } from './types.ts';

function useFleetContext(): FleetContextValue {
  const context = useContext(FleetContext);

  if (context === null) {
    throw new Error('useFleet hooks must be used inside <FleetProvider>');
  }

  return context;
}

export function useFleet<Selected>(
  selector: (state: FleetState & FleetActions) => Selected,
): Selected {
  return useStore(useFleetContext().store, selector);
}

export function useFleetStore(): FleetStore {
  return useFleetContext().store;
}

export function useApi(): FleetApi {
  return useFleetContext().api;
}
