import { describe, expect, it } from 'vitest';
import { TelemetryHistory } from './telemetry-history.ts';
import { sample } from './test-fixtures.ts';

function createHistory() {
  return new TelemetryHistory({ windowMs: 60_000, everyMs: 5_000 });
}

describe('TelemetryHistory', () => {
  it('keeps at most one point per interval', () => {
    const history = createHistory();

    history.record(sample({ battery: 80 }), 0);
    history.record(sample({ battery: 79 }), 4_999);
    history.record(sample({ battery: 78 }), 5_000);

    expect(history.pointsOf('r1', 5_000).map((point) => point.battery)).toEqual([80, 78]);
  });

  it('drops points older than the window', () => {
    const history = createHistory();

    history.record(sample(), 0);
    history.record(sample(), 30_000);

    expect(history.pointsOf('r1', 60_000)).toHaveLength(2);
    expect(history.pointsOf('r1', 60_001).map((point) => point.at)).toEqual([30_000]);
  });

  it('returns nothing for a robot without reports', () => {
    expect(createHistory().pointsOf('r2', 0)).toEqual([]);
  });
});
