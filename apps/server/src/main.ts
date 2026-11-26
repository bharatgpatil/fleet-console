import { STREAM_FLUSH_INTERVAL_MS } from '@fleet/contracts';
import { FleetEngine } from '@fleet/domain';
import { generateFleet } from '@fleet/simulation';
import { randomUUID } from 'node:crypto';
import { buildApp } from './build-app.ts';
import { loadConfig } from './config.ts';
import { TICK_INTERVAL_MS } from './constants.ts';
import { StreamHub } from './stream-hub.ts';

const config = loadConfig();
const now = () => Date.now();
const registry = generateFleet(config.FLEET_ROBOTS_PER_SITE);
const engine = new FleetEngine(registry, { newId: randomUUID });
const hub = new StreamHub(engine, now);
const app = await buildApp({ engine, hub, registry, now, logLevel: config.LOG_LEVEL });

setInterval(() => engine.tick(now()), TICK_INTERVAL_MS);
setInterval(() => hub.flush(), STREAM_FLUSH_INTERVAL_MS);

await app.listen({ port: config.PORT });

app.log.info({ robots: registry.robots.length, sites: registry.sites.length }, 'server ready');
