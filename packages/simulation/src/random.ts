import type { Random } from './types.ts';

export function createRandom(seed: number): Random {
  let state = seed >>> 0;

  const next = () => {
    state = (state + 0x6d2b79f5) >>> 0;

    let t = state;

    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);

    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296;
  };

  return {
    next,
    between: (min, max) => min + next() * (max - min),
    int: (min, maxInclusive) => min + Math.floor(next() * (maxInclusive - min + 1)),
    chance: (probability) => next() < probability,
    pick: (items) => {
      const item = items[Math.floor(next() * items.length)];

      if (item === undefined) {
        throw new Error('pick() needs a non-empty list');
      }

      return item;
    },
  };
}
