import { z } from 'zod';

export const ALL_SITES = 'all';

export const HealthFilter = z.enum(['critical', 'offline', 'warning', 'ok', 'unknown']);

export type HealthFilter = z.infer<typeof HealthFilter>;

export const FleetSearch = z.object({
  site: z.string().optional().catch(undefined),
  health: HealthFilter.optional().catch(undefined),
  q: z.string().optional().catch(undefined),
});

export type FleetSearch = z.infer<typeof FleetSearch>;
