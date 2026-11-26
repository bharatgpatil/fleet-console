import { useMemo } from 'react';
import { HEALTH_RANK, NO_ALERTS } from './constants.ts';
import { robotHealth } from './robot-health.ts';
import type { RobotRow } from './types.ts';
import { useFleet } from './use-fleet.ts';
import { useOpenAlertsByRobot } from './use-open-alerts-by-robot.ts';

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

export function useRobotRows(): RobotRow[] {
  const robotIds = useFleet((state) => state.robotIds);
  const robots = useFleet((state) => state.robots);
  const sites = useFleet((state) => state.sites);
  const states = useFleet((state) => state.states);
  const alertsByRobot = useOpenAlertsByRobot();

  const idsByName = useMemo(
    () =>
      robotIds.toSorted((a, b) => collator.compare(robots[a]?.name ?? '', robots[b]?.name ?? '')),
    [robotIds, robots],
  );

  return useMemo(
    () =>
      idsByName
        .flatMap((id): RobotRow[] => {
          const robot = robots[id];

          if (robot === undefined) {
            return [];
          }

          const state = states[id];
          const openAlerts = alertsByRobot.get(id) ?? NO_ALERTS;

          return [
            {
              id,
              robot,
              site: sites[robot.siteId],
              state,
              openAlerts,
              health: robotHealth(state, openAlerts),
            },
          ];
        })
        .toSorted((a, b) => HEALTH_RANK[a.health] - HEALTH_RANK[b.health]),
    [idsByName, robots, sites, states, alertsByRobot],
  );
}
