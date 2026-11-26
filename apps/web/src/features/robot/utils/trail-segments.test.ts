import type { HistoryPoint } from '@fleet/contracts';
import { describe, expect, it } from 'vitest';
import { trailSegments } from './trail-segments.ts';

function point(at: number, x: number): HistoryPoint {
  return { at, battery: 50, position: { x, y: 0 }, activity: 'moving' };
}

describe('trailSegments', () => {
  it('keeps a continuous path as one segment', () => {
    const segments = trailSegments([point(0, 0), point(5_000, 5), point(10_000, 10)]);

    expect(segments.map((segment) => segment.points.length)).toEqual([3]);
  });

  it('breaks the path over a silent gap', () => {
    const segments = trailSegments([
      point(0, 0),
      point(5_000, 5),
      point(60_000, 6),
      point(65_000, 7),
    ]);

    expect(segments.map((segment) => segment.id)).toEqual(['0', '60000']);
  });

  it('breaks the path where the robot jumped, such as a tow to a charger', () => {
    const segments = trailSegments([
      point(0, 0),
      point(5_000, 1),
      point(10_000, 40),
      point(15_000, 41),
    ]);

    expect(segments).toHaveLength(2);
  });

  it('drops single points that cannot draw a line', () => {
    expect(trailSegments([point(0, 0), point(60_000, 1)])).toEqual([]);
  });
});
