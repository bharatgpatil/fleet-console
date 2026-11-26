import type { Connectivity, RobotActivity } from '@fleet/contracts';
import type { Health } from '../../live/types.ts';

export type MapRobot = {
  id: string;
  name: string;
  x: number;
  y: number;
  headingRadians: number;
  health: Health;
  connectivity: Connectivity;
  activity: RobotActivity;
  battery: number;
};

export type LabelAnchor = 'start' | 'middle' | 'end';

export type RobotMarkerProps = {
  robot: MapRobot;
  x: number;
  y: number;
  outOfBounds: boolean;
  radius: number;
  dimmed: boolean;
  labelAnchor: LabelAnchor;
  highlighted: boolean;
  onSelect: ((robotId: string) => void) | null;
  onHover: ((robotId: string | null) => void) | null;
};
