import type { HistoryPoint, Position } from '@fleet/contracts';
import type { TrailSegment } from '../../site-map/index.ts';
import { HISTORY_GAP_MS, MAX_TRAIL_STEP_METRES } from './constants.ts';

function isBreak(previous: HistoryPoint, point: HistoryPoint): boolean {
  const jump = Math.hypot(
    point.position.x - previous.position.x,
    point.position.y - previous.position.y,
  );

  return point.at - previous.at > HISTORY_GAP_MS || jump > MAX_TRAIL_STEP_METRES;
}

export function trailSegments(points: readonly HistoryPoint[]): TrailSegment[] {
  const segments: { id: string; points: Position[] }[] = [];

  points.forEach((point, index) => {
    const previous = points[index - 1];
    const current = segments.at(-1);

    if (previous === undefined || current === undefined || isBreak(previous, point)) {
      segments.push({ id: String(point.at), points: [point.position] });

      return;
    }

    current.points.push(point.position);
  });

  return segments.filter((segment) => segment.points.length > 1);
}
