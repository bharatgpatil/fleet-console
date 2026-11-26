import { useMutation } from '@tanstack/react-query';
import type { Alert } from '@fleet/contracts';
import { useApi, useFleetStore } from '../../../live/use-fleet.ts';
import { writeUnlessResolved } from '../utils/write-unless-resolved.ts';

type AckOutcome = {
  acked: Alert[];
  failedIds: string[];
};

export function useAcknowledgeAlerts() {
  const api = useApi();
  const store = useFleetStore();

  return useMutation({
    mutationFn: async (alertIds: string[]): Promise<AckOutcome> => {
      const results = await Promise.allSettled(alertIds.map((id) => api.acknowledgeAlert(id)));

      return {
        acked: results.flatMap((r) => (r.status === 'fulfilled' ? [r.value] : [])),
        failedIds: alertIds.filter((_, i) => results[i]?.status === 'rejected'),
      };
    },

    onMutate: (alertIds) => {
      const { alerts, clockOffsetMs, upsertAlert } = store.getState();
      const previous = new Map<string, Alert>();

      for (const id of alertIds) {
        const alert = alerts[id];

        if (alert === undefined || alert.acknowledgedAt !== null) {
          continue;
        }

        previous.set(id, alert);
        upsertAlert({ ...alert, acknowledgedAt: Date.now() + clockOffsetMs });
      }

      return { previous };
    },

    onSuccess: ({ acked, failedIds }, _ids, context) => {
      for (const alert of acked) {
        writeUnlessResolved(store, alert);
      }

      for (const id of failedIds) {
        const original = context?.previous.get(id);

        if (original !== undefined) {
          writeUnlessResolved(store, original);
        }
      }
    },
  });
}
