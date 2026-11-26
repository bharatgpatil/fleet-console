import { EmptyState } from '../../../shared/components/EmptyState.tsx';
import { useServerNow } from '../../../live/use-server-now.ts';
import { useRobotHistory } from '../queries/use-robot-history.ts';
import { BatteryHistoryChart } from './BatteryHistoryChart.tsx';

type RobotHistoryProps = {
  robotId: string;
};

export function RobotHistory({ robotId }: RobotHistoryProps) {
  const history = useRobotHistory(robotId);
  const now = useServerNow();

  if (history.isError) {
    return <EmptyState title="Couldn't load history">It will retry in a few seconds.</EmptyState>;
  }

  if (history.data === undefined || history.data.points.length < 2) {
    return (
      <EmptyState title="Not enough history yet">
        Battery readings show here once the robot has reported for a little while.
      </EmptyState>
    );
  }

  return (
    <BatteryHistoryChart points={history.data.points} windowMs={history.data.windowMs} now={now} />
  );
}
