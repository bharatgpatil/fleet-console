import type { AlertKind, RobotActivity } from '@fleet/contracts';
import { describe, expect, it } from 'vitest';
import { activeAlertKinds, describeAlert } from './alert-rules.ts';
import { liveState, sample } from './test-fixtures.ts';

function kinds({
  battery,
  open = [],
  activity = 'moving',
}: {
  battery: number;
  open?: AlertKind[];
  activity?: RobotActivity;
}) {
  const state = liveState({ last: sample({ battery, activity }) });

  return [...activeAlertKinds({ state, open: new Set(open) })];
}

describe('activeAlertKinds', () => {
  it('raises nothing for a healthy robot', () => {
    expect(kinds({ battery: 80 })).toEqual([]);
  });

  it('raises battery_low below 20%', () => {
    expect(kinds({ battery: 20 })).toEqual([]);
    expect(kinds({ battery: 19 })).toEqual(['battery_low']);
  });

  it('raises battery_critical below 10%, even while charging', () => {
    expect(kinds({ battery: 9, activity: 'charging' })).toEqual(['battery_critical']);
  });

  it('skips battery_low while charging', () => {
    expect(kinds({ battery: 15, activity: 'charging' })).toEqual([]);
  });

  it('keeps battery_low open until the battery passes 25%', () => {
    expect(kinds({ battery: 24, open: ['battery_low'] })).toEqual(['battery_low']);
    expect(kinds({ battery: 25, open: ['battery_low'] })).toEqual([]);
  });

  it('raises robot_error when the robot reports an error', () => {
    expect(kinds({ battery: 80, activity: 'error' })).toEqual(['robot_error']);
  });

  it('raises offline only for a robot that reported before', () => {
    const seen = liveState({ connectivity: 'offline' });
    const neverSeen = liveState({ connectivity: 'offline', lastSeenAt: null, last: null });

    expect([...activeAlertKinds({ state: seen, open: new Set() })]).toEqual(['offline']);
    expect([...activeAlertKinds({ state: neverSeen, open: new Set() })]).toEqual([]);
  });

  it('keeps battery and error alerts open while offline', () => {
    const state = liveState({ connectivity: 'offline' });
    const open = new Set<AlertKind>(['battery_low', 'robot_error']);

    expect(activeAlertKinds({ state, open })).toEqual(
      new Set(['offline', 'battery_low', 'robot_error']),
    );
  });
});

describe('describeAlert', () => {
  it('includes the error code when there is one', () => {
    const state = liveState({ last: sample({ activity: 'error', errorCode: 'E42' }) });

    expect(describeAlert({ kind: 'robot_error', state })).toEqual({
      severity: 'critical',
      message: 'Robot reported error E42',
    });
  });

  it('uses the rules it is given in the message', () => {
    const rules = { batteryLowBelow: 30, batteryCriticalBelow: 15, batteryClearAbove: 35 };

    expect(describeAlert({ kind: 'battery_low', state: liveState(), rules }).message).toBe(
      'Battery below 30%',
    );
  });
});
