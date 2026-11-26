import {
  ApiPaths,
  ServerMessage,
  type FleetRegistry,
  type TelemetrySample,
} from '@fleet/contracts';
import { FleetEngine } from '@fleet/domain';
import { afterEach, describe, expect, it } from 'vitest';
import { buildApp } from './build-app.ts';
import { StreamHub } from './stream-hub.ts';

const NOW = 1_000_000;

const now = () => NOW;

const REGISTRY: FleetRegistry = {
  sites: [{ id: 's1', name: 'Site one', widthMetres: 50, heightMetres: 30, chargers: [] }],
  robots: [{ id: 'r1', name: 'Robot one', siteId: 's1' }],
};

function sample(overrides: Partial<TelemetrySample> = {}): TelemetrySample {
  return {
    robotId: 'r1',
    sequence: 1,
    recordedAt: NOW,
    battery: 80,
    activity: 'moving',
    position: { x: 1, y: 1 },
    headingRadians: 0,
    speedMetresPerSecond: 1,
    ...overrides,
  };
}

function basic(password: string): string {
  return `Basic ${Buffer.from(`fleet:${password}`).toString('base64')}`;
}

const apps: Awaited<ReturnType<typeof buildApp>>[] = [];

async function createApp({
  ingestToken,
  consolePassword,
}: { ingestToken?: string; consolePassword?: string } = {}) {
  const engine = new FleetEngine(REGISTRY, { newId: () => 'a1' });
  const hub = new StreamHub(engine, now);

  const app = await buildApp({
    engine,
    hub,
    registry: REGISTRY,
    now,
    logLevel: 'silent',
    webRoot: undefined,
    ingestToken,
    consolePassword,
  });

  apps.push(app);

  return { app, engine };
}

afterEach(async () => {
  await Promise.all(apps.splice(0).map((app) => app.close()));
});

describe('REST routes', () => {
  it('answers the health check', async () => {
    const { app } = await createApp();
    const response = await app.inject({ method: 'GET', url: ApiPaths.health });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ ok: true });
  });

  it('rejects a batch that does not match the contract', async () => {
    const { app } = await createApp();

    const response = await app.inject({
      method: 'POST',
      url: ApiPaths.ingest,
      payload: { samples: [{ robotId: 'r1', battery: 'full' }] },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toMatchObject({ error: 'Invalid telemetry batch' });
  });

  it('applies a valid batch and reports late and unknown samples', async () => {
    const { app, engine } = await createApp();

    const response = await app.inject({
      method: 'POST',
      url: ApiPaths.ingest,
      payload: {
        samples: [sample({ sequence: 2 }), sample({ sequence: 1 }), sample({ robotId: 'ghost' })],
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ late: 1, duplicate: 0, unknownRobot: 1 });
    expect(engine.snapshot(NOW).states[0]?.last?.sequence).toBe(2);
  });

  it('acknowledges an open alert and returns 404 for an unknown one', async () => {
    const { app, engine } = await createApp();

    engine.ingest([sample({ battery: 5 })], NOW);

    const acknowledged = await app.inject({ method: 'POST', url: ApiPaths.acknowledgeAlert('a1') });
    const missing = await app.inject({ method: 'POST', url: ApiPaths.acknowledgeAlert('nope') });

    expect(acknowledged.statusCode).toBe(200);
    expect(acknowledged.json()).toMatchObject({ id: 'a1', acknowledgedAt: NOW });
    expect(missing.statusCode).toBe(404);
  });

  it('returns a robot history and 404 for an unknown robot', async () => {
    const { app, engine } = await createApp();

    engine.ingest([sample({ battery: 64 })], NOW);

    const history = await app.inject({ method: 'GET', url: ApiPaths.robotHistory('r1') });
    const missing = await app.inject({ method: 'GET', url: ApiPaths.robotHistory('ghost') });

    expect(history.json()).toMatchObject({ robotId: 'r1', points: [{ battery: 64 }] });
    expect(missing.statusCode).toBe(404);
  });
});

describe('access', () => {
  it('requires the ingest token when one is set', async () => {
    const { app } = await createApp({ ingestToken: 'token-of-sixteen-chars' });
    const payload = { samples: [sample()] };

    const without = await app.inject({ method: 'POST', url: ApiPaths.ingest, payload });

    const withToken = await app.inject({
      method: 'POST',
      url: ApiPaths.ingest,
      payload,
      headers: { authorization: 'Bearer token-of-sixteen-chars' },
    });

    expect(without.statusCode).toBe(401);
    expect(withToken.statusCode).toBe(200);
  });

  it('asks for the console password but keeps the health check open', async () => {
    const { app } = await createApp({ consolePassword: 'open sesame' });

    const health = await app.inject({ method: 'GET', url: ApiPaths.health });
    const without = await app.inject({ method: 'GET', url: ApiPaths.fleet });

    const withPassword = await app.inject({
      method: 'GET',
      url: ApiPaths.fleet,
      headers: { authorization: basic('open sesame') },
    });

    expect(health.statusCode).toBe(200);
    expect(without.statusCode).toBe(401);
    expect(without.headers['www-authenticate']).toContain('Basic');
    expect(withPassword.statusCode).toBe(200);
  });
});

describe('stream', () => {
  it('starts every connection with a snapshot numbered 0', async () => {
    const { app } = await createApp();

    await app.ready();

    const first = Promise.withResolvers<string>();

    const socket = await app.injectWS(
      ApiPaths.stream,
      {},
      { onInit: (ws) => ws.once('message', (data: Buffer) => first.resolve(data.toString())) },
    );

    const raw = await first.promise;

    socket.terminate();

    const message = ServerMessage.parse(JSON.parse(raw));

    expect(message.type).toBe('snapshot');
    expect(message.sequence).toBe(0);
  });
});
