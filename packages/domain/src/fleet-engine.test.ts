import { describe, expect, it } from 'vitest';
import { FleetEngine } from './fleet-engine.ts';
import { REGISTRY, sample } from './test-fixtures.ts';

function createEngine() {
  let next = 0;

  return new FleetEngine(REGISTRY, { newId: () => `a${++next}` });
}

describe('FleetEngine', () => {
  it('starts every robot offline with no telemetry', () => {
    const { states } = createEngine().snapshot(0);

    expect(states.map((state) => state.connectivity)).toEqual(['offline', 'offline']);
  });

  it('counts late, duplicate and unknown reports without applying them', () => {
    const engine = createEngine();

    engine.ingest([sample({ sequence: 5 })], 1_000);

    const result = engine.ingest(
      [sample({ sequence: 4 }), sample({ sequence: 5 }), sample({ robotId: 'ghost' })],
      1_100,
    );

    expect(result).toEqual({ late: 1, duplicate: 1, unknownRobot: 1 });
    expect(engine.snapshot(1_100).states[0]?.last?.sequence).toBe(5);
  });

  it('opens an alert once and resolves it when the cause clears', () => {
    const engine = createEngine();

    engine.ingest([sample({ sequence: 1, battery: 15 })], 1_000);
    engine.ingest([sample({ sequence: 2, battery: 14 })], 1_100);

    const opened = engine.snapshot(1_100).alerts;

    expect(opened).toHaveLength(1);
    expect(opened[0]).toMatchObject({ id: 'a1', kind: 'battery_low', resolvedAt: null });

    engine.ingest([sample({ sequence: 3, battery: 90 })], 1_200);

    expect(engine.snapshot(1_200).alerts[0]?.resolvedAt).toBe(1_200);
  });

  it('marks a silent robot stale, then offline with an alert', () => {
    const engine = createEngine();

    engine.ingest([sample()], 0);
    engine.tick(5_000);

    expect(engine.snapshot(5_000).states[0]?.connectivity).toBe('stale');

    engine.tick(30_000);

    const snapshot = engine.snapshot(30_000);

    expect(snapshot.states[0]?.connectivity).toBe('offline');
    expect(snapshot.alerts.map((alert) => alert.kind)).toEqual(['offline']);
  });

  it('acknowledges an alert once and keeps the first time', () => {
    const engine = createEngine();

    engine.ingest([sample({ battery: 5 })], 1_000);

    expect(engine.acknowledgeAlert('a1', 2_000)?.acknowledgedAt).toBe(2_000);
    expect(engine.acknowledgeAlert('a1', 3_000)?.acknowledgedAt).toBe(2_000);
    expect(engine.acknowledgeAlert('missing', 3_000)).toBeUndefined();
  });

  it('drops resolved alerts after the retention window', () => {
    const engine = new FleetEngine(REGISTRY, { newId: () => 'a1', resolvedAlertRetentionMs: 100 });

    engine.ingest([sample({ sequence: 1, battery: 5 })], 0);
    engine.ingest([sample({ sequence: 2, battery: 90 })], 10);
    engine.tick(110);

    expect(engine.snapshot(110).alerts).toHaveLength(1);

    engine.tick(111);

    expect(engine.snapshot(111).alerts).toEqual([]);
  });

  it('drains only what changed since the last drain', () => {
    const engine = createEngine();

    engine.ingest([sample({ battery: 5 })], 1_000);

    const first = engine.drainDelta();

    expect(first.states.map((state) => state.robotId)).toEqual(['r1']);
    expect(first.alerts).toHaveLength(1);
    expect(engine.drainDelta()).toEqual({ states: [], alerts: [] });
  });

  it('records history for applied reports only', () => {
    const engine = createEngine();

    engine.ingest([sample({ sequence: 2, battery: 70 })], 0);
    engine.ingest([sample({ sequence: 1, battery: 10 })], 10_000);

    expect(engine.historyOf('r1', 10_000)?.points.map((point) => point.battery)).toEqual([70]);
    expect(engine.historyOf('ghost', 10_000)).toBeUndefined();
  });
});
