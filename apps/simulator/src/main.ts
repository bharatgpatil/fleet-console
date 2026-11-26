import type { TelemetrySample } from '@fleet/contracts';
import { FleetSimulation } from '@fleet/simulation';
import {
  FAULTS,
  MAX_BACKLOG,
  MAX_BATCH,
  SEED,
  SERVER_URL,
  STATS_EVERY_MS,
  TICK_MS,
} from './config.ts';
import { fetchRegistry } from './fetch-registry.ts';
import { sendBatch } from './send-batch.ts';

const registry = await fetchRegistry();
const simulation = new FleetSimulation(registry, {
  seed: SEED,
  startTime: Date.now(),
  faults: FAULTS,
});

console.warn(
  `[sim] ${registry.robots.length} robots across ${registry.sites.length} sites -> ${SERVER_URL}`,
);

let backlog: TelemetrySample[] = [];
let sending = false;
let stats = { sent: 0, late: 0, duplicate: 0 };

setInterval(async () => {
  backlog = backlog.concat(simulation.step(Date.now())).slice(-MAX_BACKLOG);

  if (sending || backlog.length === 0) {
    return;
  }

  sending = true;

  const batch = backlog.slice(0, MAX_BATCH);

  backlog = backlog.slice(MAX_BATCH);

  const outcome = await sendBatch(batch);

  sending = false;

  switch (outcome.kind) {
    case 'sent': {
      stats = {
        sent: stats.sent + batch.length,
        late: stats.late + outcome.result.late,
        duplicate: stats.duplicate + outcome.result.duplicate,
      };
      break;
    }

    case 'rejected': {
      console.error(`[sim] ${batch.length} reports rejected (HTTP ${outcome.status}), dropped`);
      break;
    }

    case 'failed': {
      backlog = batch.concat(backlog).slice(-MAX_BACKLOG);
      console.warn(`[sim] sending failed (${outcome.reason}), ${backlog.length} reports waiting`);
      break;
    }
  }
}, TICK_MS);

setInterval(() => {
  console.warn(
    `[sim] sent=${stats.sent} late=${stats.late} duplicate=${stats.duplicate} waiting=${backlog.length}`,
  );
}, STATS_EVERY_MS);
