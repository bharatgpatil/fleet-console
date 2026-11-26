import type { Alert, RobotLiveState } from '@fleet/contracts';
import { describe, expect, it } from 'vitest';
import { robotHealth } from './robot-health.ts';

const ONLINE: RobotLiveState = { robotId: 'r1', connectivity: 'online', lastSeenAt: 1, last: null };

function alert(severity: Alert['severity']): Alert {
  return {
    id: `a-${severity}`,
    robotId: 'r1',
    siteId: 's1',
    kind: severity === 'critical' ? 'battery_critical' : 'battery_low',
    severity,
    message: '',
    openedAt: 0,
    acknowledgedAt: null,
    resolvedAt: null,
  };
}

describe('robotHealth', () => {
  it('is unknown for a robot that never reported', () => {
    expect(robotHealth(undefined, [])).toBe('unknown');
    expect(robotHealth({ ...ONLINE, lastSeenAt: null }, [])).toBe('unknown');
  });

  it('puts offline ahead of any alert', () => {
    expect(robotHealth({ ...ONLINE, connectivity: 'offline' }, [alert('critical')])).toBe(
      'offline',
    );
  });

  it('is critical with a critical alert open', () => {
    expect(robotHealth(ONLINE, [alert('warning'), alert('critical')])).toBe('critical');
  });

  it('is a warning with a warning alert or stale reports', () => {
    expect(robotHealth(ONLINE, [alert('warning')])).toBe('warning');
    expect(robotHealth({ ...ONLINE, connectivity: 'stale' }, [])).toBe('warning');
  });

  it('is ok otherwise', () => {
    expect(robotHealth(ONLINE, [])).toBe('ok');
  });
});
