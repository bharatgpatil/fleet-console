import type { Health } from '../../live/types.ts';
import { HEALTH_ICON } from './HealthIcon.styles.ts';

type HealthIconProps = {
  health: Health;
  size?: number;
};

export function HealthIcon({ health, size = 16 }: HealthIconProps) {
  const Icon = HEALTH_ICON[health];

  return <Icon aria-hidden health={health} size={size} />;
}
