import type { Health } from '../../../live/types.ts';

export function needsAttention(health: Health): boolean {
  return health === 'critical' || health === 'offline' || health === 'warning';
}
