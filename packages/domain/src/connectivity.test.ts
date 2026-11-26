import { describe, expect, it } from 'vitest';
import { deriveConnectivity } from './connectivity.ts';

describe('deriveConnectivity', () => {
  it('treats a robot that never reported as offline', () => {
    expect(deriveConnectivity({ lastSeenAt: null, now: 1_000 })).toBe('offline');
  });

  it('is online until 5 seconds of silence', () => {
    expect(deriveConnectivity({ lastSeenAt: 0, now: 4_999 })).toBe('online');
    expect(deriveConnectivity({ lastSeenAt: 0, now: 5_000 })).toBe('stale');
  });

  it('turns offline at 30 seconds of silence', () => {
    expect(deriveConnectivity({ lastSeenAt: 0, now: 29_999 })).toBe('stale');
    expect(deriveConnectivity({ lastSeenAt: 0, now: 30_000 })).toBe('offline');
  });

  it('uses the thresholds it is given', () => {
    const thresholds = { staleAfterMs: 100, offlineAfterMs: 200 };

    expect(deriveConnectivity({ lastSeenAt: 0, now: 150, thresholds })).toBe('stale');
  });
});
