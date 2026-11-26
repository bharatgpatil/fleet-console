import type { Position } from '@fleet/contracts';

export function distance(a: Position, b: Position): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function round(value: number, digits: number): number {
  return Math.round(value * 10 ** digits) / 10 ** digits;
}
