import type { Robot, RobotLiveState } from '@fleet/contracts';
import type { Health } from '../../../live/types.ts';
import type { MapRobot } from '../types.ts';

export function toMapRobot({
  robot,
  state,
  health,
}: {
  robot: Robot;
  state: RobotLiveState | undefined;
  health: Health;
}): MapRobot | null {
  if (state === undefined || state.last === null) {
    return null;
  }

  const last = state.last;

  return {
    id: robot.id,
    name: robot.name,
    x: last.position.x,
    y: last.position.y,
    headingRadians: last.headingRadians,
    health,
    connectivity: state.connectivity,
    activity: last.activity,
    battery: last.battery,
  };
}
