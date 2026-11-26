import type { FleetRegistry, RobotLiveState, TelemetrySample } from '@fleet/contracts';

export function sample(overrides: Partial<TelemetrySample> = {}): TelemetrySample {
  return {
    robotId: 'r1',
    sequence: 1,
    recordedAt: 1_000,
    battery: 80,
    activity: 'moving',
    position: { x: 1, y: 1 },
    headingRadians: 0,
    speedMetresPerSecond: 1,
    ...overrides,
  };
}

export function liveState(overrides: Partial<RobotLiveState> = {}): RobotLiveState {
  return {
    robotId: 'r1',
    connectivity: 'online',
    lastSeenAt: 1_000,
    last: sample(),
    ...overrides,
  };
}

export const REGISTRY: FleetRegistry = {
  sites: [{ id: 's1', name: 'Site one', widthMetres: 50, heightMetres: 30, chargers: [] }],
  robots: [
    { id: 'r1', name: 'Robot one', siteId: 's1' },
    { id: 'r2', name: 'Robot two', siteId: 's1' },
  ],
};
