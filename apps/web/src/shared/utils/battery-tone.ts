import { ALERT_RULES } from '@fleet/domain';

export type BatteryTone = 'critical' | 'warning' | 'ok';

export function batteryTone(value: number): BatteryTone {
  if (value < ALERT_RULES.batteryCriticalBelow) {
    return 'critical';
  }

  if (value < ALERT_RULES.batteryLowBelow) {
    return 'warning';
  }

  return 'ok';
}
