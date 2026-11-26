import type { HealthFilter } from '../../../app/search.ts';

export const TABLE_REFRESH_MS = 1_000;

export const ROWS_PER_PAGE = 25;

export const FILTER_OPTIONS: readonly HealthFilter[] = ['critical', 'offline', 'warning', 'ok'];
