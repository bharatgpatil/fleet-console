import { useQuery } from '@tanstack/react-query';
import { useApi } from '../../../live/use-fleet.ts';
import { HISTORY_REFRESH_MS } from '../utils/constants.ts';

export function useRobotHistory(robotId: string) {
  const api = useApi();

  return useQuery({
    queryKey: ['robot-history', robotId],
    queryFn: () => api.robotHistory(robotId),
    refetchInterval: HISTORY_REFRESH_MS,
  });
}
