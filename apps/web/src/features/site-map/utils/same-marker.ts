import type { RobotMarkerProps } from '../types.ts';

export function sameMarker(a: RobotMarkerProps, b: RobotMarkerProps): boolean {
  return (
    a.x === b.x &&
    a.y === b.y &&
    a.robot.headingRadians === b.robot.headingRadians &&
    a.robot.health === b.robot.health &&
    a.robot.connectivity === b.robot.connectivity &&
    a.robot.activity === b.robot.activity &&
    a.robot.battery === b.robot.battery &&
    a.robot.name === b.robot.name &&
    a.outOfBounds === b.outOfBounds &&
    a.radius === b.radius &&
    a.dimmed === b.dimmed &&
    a.labelAnchor === b.labelAnchor &&
    a.highlighted === b.highlighted &&
    a.onSelect === b.onSelect &&
    a.onHover === b.onHover
  );
}
