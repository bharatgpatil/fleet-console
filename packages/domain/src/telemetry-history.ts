import type { HistoryPoint, TelemetrySample } from '@fleet/contracts';
import type { HistoryOptions } from './types.ts';

export class TelemetryHistory {
  private readonly points = new Map<string, HistoryPoint[]>();

  constructor(private readonly options: HistoryOptions) {}

  record(sample: TelemetrySample, now: number): void {
    const list = this.points.get(sample.robotId) ?? [];
    const last = list.at(-1);

    if (last !== undefined && now - last.at < this.options.everyMs) {
      return;
    }

    list.push({
      at: now,
      battery: sample.battery,
      position: sample.position,
      activity: sample.activity,
    });

    const firstKept = list.findIndex((point) => point.at >= now - this.options.windowMs);

    if (firstKept > 0) {
      list.splice(0, firstKept);
    }

    this.points.set(sample.robotId, list);
  }

  pointsOf(robotId: string, now: number): HistoryPoint[] {
    const cutoff = now - this.options.windowMs;

    return (this.points.get(robotId) ?? []).filter((point) => point.at >= cutoff);
  }
}
