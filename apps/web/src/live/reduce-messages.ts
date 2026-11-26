import type { ServerMessage } from '@fleet/contracts';
import { byId } from './by-id.ts';
import type { FleetData, FleetState } from './types.ts';

export function reduceMessages({
  previous,
  messages,
  receivedAt,
}: {
  previous: FleetState;
  messages: readonly ServerMessage[];
  receivedAt: number;
}): Partial<FleetState> {
  let data: FleetData = {
    sites: previous.sites,
    siteIds: previous.siteIds,
    robots: previous.robots,
    robotIds: previous.robotIds,
    states: previous.states,
    alerts: previous.alerts,
  };
  let statesCopied = false;
  let alertsCopied = false;
  let hydrated = previous.hydrated;

  for (const message of messages) {
    if (message.type === 'snapshot') {
      const { snapshot } = message;

      data = {
        sites: byId(snapshot.sites),
        siteIds: snapshot.sites.map((site) => site.id),
        robots: byId(snapshot.robots),
        robotIds: snapshot.robots.map((robot) => robot.id),
        states: Object.fromEntries(snapshot.states.map((state) => [state.robotId, state])),
        alerts: byId(snapshot.alerts),
      };
      statesCopied = true;
      alertsCopied = true;
      hydrated = true;
      continue;
    }

    if (!hydrated) {
      continue;
    }

    if (message.states.length > 0) {
      if (!statesCopied) {
        data = { ...data, states: { ...data.states } };
        statesCopied = true;
      }

      for (const state of message.states) {
        data.states[state.robotId] = state;
      }
    }

    if (message.alerts.length > 0) {
      if (!alertsCopied) {
        data = { ...data, alerts: { ...data.alerts } };
        alertsCopied = true;
      }

      for (const alert of message.alerts) {
        data.alerts[alert.id] = alert;
      }
    }
  }

  const last = messages.at(-1);

  if (last === undefined) {
    return { ...data, hydrated };
  }

  return {
    ...data,
    hydrated,
    clockOffsetMs: last.serverTime - receivedAt,
  };
}
