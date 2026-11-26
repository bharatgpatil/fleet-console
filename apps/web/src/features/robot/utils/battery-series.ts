import type { HistoryPoint } from '@fleet/contracts';
import { HISTORY_GAP_MS } from './constants.ts';

export function batterySeries(points: readonly HistoryPoint[]): {
  times: Date[];
  levels: (number | null)[];
} {
  const times: Date[] = [];
  const levels: (number | null)[] = [];

  points.forEach((point, index) => {
    const previous = points[index - 1];

    if (previous !== undefined && point.at - previous.at > HISTORY_GAP_MS) {
      times.push(new Date((previous.at + point.at) / 2));
      levels.push(null);
    }

    times.push(new Date(point.at));
    levels.push(point.battery);
  });

  return { times, levels };
}
