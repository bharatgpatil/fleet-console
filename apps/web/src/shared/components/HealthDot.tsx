import type { Health } from '../../live/types.ts';
import { Dot } from './HealthDot.styles.ts';

type HealthDotProps = {
  health: Health;
  size?: number;
  pulse?: boolean;
};

export function HealthDot({ health, size = 10, pulse = false }: HealthDotProps) {
  return <Dot aria-hidden health={health} size={size} pulse={pulse} />;
}
