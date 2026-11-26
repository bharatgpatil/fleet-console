import { EmptyState } from '../../../shared/components/EmptyState.tsx';

type RobotTableEmptyProps = {
  emptyFleet: boolean;
};

export function RobotTableEmpty({ emptyFleet }: RobotTableEmptyProps) {
  if (emptyFleet) {
    return (
      <EmptyState title="No robots registered yet">
        Robots show up here as soon as they report.
      </EmptyState>
    );
  }

  return <EmptyState title="No robots match">Try clearing the filter or the search.</EmptyState>;
}
