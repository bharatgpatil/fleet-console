import { describe, expect, it } from 'vitest';
import { classifySample } from './ordering.ts';
import { sample } from './test-fixtures.ts';

describe('classifySample', () => {
  it('applies the first report', () => {
    expect(classifySample(null, sample())).toBe('applied');
  });

  it('applies a newer sequence', () => {
    expect(classifySample(sample({ sequence: 5 }), sample({ sequence: 6 }))).toBe('applied');
  });

  it('flags the same sequence as a duplicate', () => {
    expect(classifySample(sample({ sequence: 5 }), sample({ sequence: 5 }))).toBe('duplicate');
  });

  it('flags an older sequence as late', () => {
    expect(classifySample(sample({ sequence: 5 }), sample({ sequence: 4 }))).toBe('late');
  });

  it('applies a big sequence drop with a newer timestamp as a reboot', () => {
    const current = sample({ sequence: 5_000, recordedAt: 1_000 });

    expect(classifySample(current, sample({ sequence: 1, recordedAt: 2_000 }))).toBe('applied');
  });

  it('keeps a big sequence drop with an older timestamp as late', () => {
    const current = sample({ sequence: 5_000, recordedAt: 2_000 });

    expect(classifySample(current, sample({ sequence: 1, recordedAt: 1_000 }))).toBe('late');
  });
});
