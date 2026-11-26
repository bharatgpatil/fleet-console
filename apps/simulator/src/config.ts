import { DEFAULT_FAULTS, NO_FAULTS } from '@fleet/simulation';

export const SERVER_URL = process.env.SERVER_URL ?? 'http://localhost:8080';

export const SEED = Number(process.env.SIM_SEED ?? 7);

export const TICK_MS = Number(process.env.SIM_TICK_MS ?? 500);

export const FAULTS = process.env.SIM_FAULTS === 'off' ? NO_FAULTS : DEFAULT_FAULTS;

export const MAX_BACKLOG = 50_000;

export const MAX_BATCH = 5_000;

export const REQUEST_TIMEOUT_MS = 10_000;

export const STATS_EVERY_MS = 30_000;
