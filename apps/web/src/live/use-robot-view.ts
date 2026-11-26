import { useMemo } from 'react';
import { NO_ALERTS } from './constants.ts';
import { robotHealth } from './robot-health.ts';
import type { RobotView } from './types.ts';
import { useFleet } from './use-fleet.ts';
import { useOpenAlertsByRobot } from './use-open-alerts-by-robot.ts';

export function useRobotView(robotId: string): RobotView {
  const robot = useFleet((state) => state.robots[robotId]);
  const site = useFleet((state) => (robot === undefined ? undefined : state.sites[robot.siteId]));
  const state = useFleet((fleet) => fleet.states[robotId]);
  const alertsByRobot = useOpenAlertsByRobot();
  const openAlerts = alertsByRobot.get(robotId) ?? NO_ALERTS;
  const alerts = useFleet((fleet) => fleet.alerts);

  const closedAlerts = useMemo(
    () =>
      Object.values(alerts)
        .filter((alert) => alert.robotId === robotId && alert.resolvedAt !== null)
        .toSorted((first, second) => (second.resolvedAt ?? 0) - (first.resolvedAt ?? 0)),
    [alerts, robotId],
  );

  return { robot, site, state, openAlerts, closedAlerts, health: robotHealth(state, openAlerts) };
}
