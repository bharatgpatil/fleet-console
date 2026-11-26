import type { LabelAnchor } from '../types.ts';

export function labelAnchor(x: number, width: number): LabelAnchor {
  if (x < width * 0.25) {
    return 'start';
  }

  if (x > width * 0.75) {
    return 'end';
  }

  return 'middle';
}
