import type { Alert, RobotLiveState, ServerMessage } from '@fleet/contracts';
import { describe, expect, it } from 'vitest';
import { INITIAL_FLEET_STATE } from './constants.ts';
import { reduceMessages } from './reduce-messages.ts';
import type { FleetState } from './types.ts';

const STATE: RobotLiveState = {
  robotId: 'r1',
  connectivity: 'offline',
  lastSeenAt: null,
  last: null,
};

const ALERT: Alert = {
  id: 'a1',
  robotId: 'r1',
  siteId: 's1',
  kind: 'offline',
  severity: 'critical',
  message: 'Robot stopped reporting',
  openedAt: 0,
  acknowledgedAt: null,
  resolvedAt: null,
};

const SNAPSHOT: ServerMessage = {
  type: 'snapshot',
  sequence: 0,
  serverTime: 1_000,
  snapshot: {
    serverTime: 1_000,
    sites: [{ id: 's1', name: 'Site one', widthMetres: 50, heightMetres: 30, chargers: [] }],
    robots: [{ id: 'r1', name: 'Robot one', siteId: 's1' }],
    states: [STATE],
    alerts: [],
  },
};

function delta({
  sequence,
  states = [],
  alerts = [],
}: {
  sequence: number;
  states?: RobotLiveState[];
  alerts?: Alert[];
}): ServerMessage {
  return { type: 'delta', sequence, serverTime: 1_000 + sequence, states, alerts };
}

function hydrate(): FleetState {
  return {
    ...INITIAL_FLEET_STATE,
    ...reduceMessages({ previous: INITIAL_FLEET_STATE, messages: [SNAPSHOT], receivedAt: 900 }),
  };
}

describe('reduceMessages', () => {
  it('loads everything from a snapshot and records the clock offset', () => {
    const next = hydrate();

    expect(next.hydrated).toBe(true);
    expect(next.siteIds).toEqual(['s1']);
    expect(next.robotIds).toEqual(['r1']);
    expect(next.states.r1).toEqual(STATE);
    expect(next.clockOffsetMs).toBe(100);
    expect(next.lastMessageAt).toBe(900);
  });

  it('ignores deltas that arrive before the snapshot', () => {
    const next = reduceMessages({
      previous: INITIAL_FLEET_STATE,
      messages: [delta({ sequence: 1, alerts: [ALERT] })],
      receivedAt: 0,
    });

    expect(next.hydrated).toBe(false);
    expect(next.alerts).toEqual({});
  });

  it('applies a batch of deltas in order', () => {
    const online: RobotLiveState = { ...STATE, connectivity: 'online', lastSeenAt: 1_000 };
    const acknowledged = { ...ALERT, acknowledgedAt: 1_500 };

    const next = reduceMessages({
      previous: hydrate(),
      messages: [
        delta({ sequence: 1, states: [online], alerts: [ALERT] }),
        delta({ sequence: 2, alerts: [acknowledged] }),
      ],
      receivedAt: 1_000,
    });

    expect(next.states?.r1).toEqual(online);
    expect(next.alerts?.a1).toEqual(acknowledged);
    expect(next.clockOffsetMs).toBe(2);
  });

  it('copies only the records a delta touches', () => {
    const previous = hydrate();

    const next = reduceMessages({
      previous,
      messages: [delta({ sequence: 1, alerts: [ALERT] })],
      receivedAt: 1_000,
    });

    expect(next.states).toBe(previous.states);
    expect(next.alerts).not.toBe(previous.alerts);
    expect(previous.alerts).toEqual({});
  });

  it('keeps every record for an empty heartbeat but notes when it arrived', () => {
    const previous = hydrate();

    const next = reduceMessages({
      previous,
      messages: [delta({ sequence: 1 })],
      receivedAt: 2_000,
    });

    expect(next.states).toBe(previous.states);
    expect(next.alerts).toBe(previous.alerts);
    expect(next.robots).toBe(previous.robots);
    expect(next.lastMessageAt).toBe(2_000);
  });
});
