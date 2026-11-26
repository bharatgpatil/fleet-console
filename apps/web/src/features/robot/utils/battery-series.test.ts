import type { HistoryPoint } from '@fleet/contracts';
import { describe, expect, it } from 'vitest';
import { batterySeries } from './battery-series.ts';

function point(at: number, battery: number): HistoryPoint {
  return { at, battery, position: { x: 0, y: 0 }, activity: 'moving' };
}

describe('batterySeries', () => {
  it('keeps close points as one line', () => {
    const { levels } = batterySeries([point(0, 80), point(5_000, 79)]);

    expect(levels).toEqual([80, 79]);
  });

  it('breaks the line where the robot was silent for more than 30 s', () => {
    const { times, levels } = batterySeries([point(0, 80), point(40_000, 70)]);

    expect(levels).toEqual([80, null, 70]);
    expect(times.map((time) => time.getTime())).toEqual([0, 20_000, 40_000]);
  });
});
