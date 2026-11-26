import type { TelemetrySample } from '@fleet/contracts';
import { REBOOT_SEQUENCE_GAP } from './constants.ts';
import type { SampleOutcome } from './types.ts';

export function classifySample(
  current: TelemetrySample | null,
  incoming: TelemetrySample,
): SampleOutcome {
  if (current === null) {
    return 'applied';
  }

  if (incoming.sequence === current.sequence) {
    return 'duplicate';
  }

  if (incoming.sequence > current.sequence) {
    return 'applied';
  }

  const looksLikeReboot =
    current.sequence - incoming.sequence >= REBOOT_SEQUENCE_GAP &&
    incoming.recordedAt > current.recordedAt;

  return looksLikeReboot ? 'applied' : 'late';
}
