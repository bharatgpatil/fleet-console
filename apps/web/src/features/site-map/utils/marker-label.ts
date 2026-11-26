import { HEALTH_LABEL } from '../../../live/constants.ts';
import type { MapRobot } from '../types.ts';

export function markerLabel(robot: MapRobot, outOfBounds: boolean): string {
  const parts = [
    `${robot.name}: ${HEALTH_LABEL[robot.health]}`,
    `battery ${Math.round(robot.battery)}%`,
    robot.activity,
  ];

  if (robot.connectivity !== 'online') {
    parts.push('last known position');
  }

  if (outOfBounds) {
    parts.push('reported outside the floor plan');
  }

  return parts.join(', ');
}
