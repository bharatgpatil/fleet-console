import { createStore } from 'zustand/vanilla';
import { INITIAL_FLEET_STATE } from './constants.ts';
import { reduceMessages } from './reduce-messages.ts';
import type { FleetActions, FleetState } from './types.ts';

export type FleetStore = ReturnType<typeof createFleetStore>;

export function createFleetStore() {
  return createStore<FleetState & FleetActions>()((set) => ({
    ...INITIAL_FLEET_STATE,

    applyMessages: (messages, receivedAt) => {
      if (messages.length === 0) {
        return;
      }

      set((previous) => reduceMessages({ previous, messages, receivedAt }));
    },

    upsertAlert: (alert) => {
      set((previous) => ({ alerts: { ...previous.alerts, [alert.id]: alert } }));
    },
  }));
}
