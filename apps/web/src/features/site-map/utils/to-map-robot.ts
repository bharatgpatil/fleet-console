import type { RobotRow } from '../../../live/types.ts';
import type { MapRobot } from '../types.ts';

export function toMapRobot(row: RobotRow): MapRobot | null {
  if (row.state === undefined || row.state.last === null) {
    return null;
  }

  const last = row.state.last;

  return {
    id: row.id,
    name: row.robot.name,
    x: last.position.x,
    y: last.position.y,
    headingRadians: last.headingRadians,
    health: row.health,
    connectivity: row.state.connectivity,
    activity: last.activity,
    battery: last.battery,
  };
}
