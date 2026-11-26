import fastifyStatic from '@fastify/static';
import websocket from '@fastify/websocket';
import { ApiPaths, IngestBatch, type ApiError } from '@fleet/contracts';
import Fastify, { type FastifyInstance } from 'fastify';
import { z } from 'zod';
import { hasBasicPassword, hasBearerToken } from './auth.ts';
import { BASIC_AUTH_CHALLENGE, BODY_LIMIT_BYTES } from './constants.ts';
import type { AppDependencies } from './types.ts';

const AlertParams = z.object({ alertId: z.string().min(1) });

const RobotParams = z.object({ robotId: z.string().min(1) });

export async function buildApp({
  engine,
  hub,
  registry,
  now,
  logLevel,
  webRoot,
  ingestToken,
  consolePassword,
}: AppDependencies): Promise<FastifyInstance> {
  const app = Fastify({ logger: { level: logLevel }, bodyLimit: BODY_LIMIT_BYTES });

  await app.register(websocket);

  app.addHook('onRequest', async (request, reply) => {
    const path = request.url.split('?')[0];

    if (path === ApiPaths.health) {
      return;
    }

    if (path === ApiPaths.ingest) {
      if (
        ingestToken !== undefined &&
        !hasBearerToken(request.headers.authorization, ingestToken)
      ) {
        const error: ApiError = { error: 'Missing or wrong ingest token' };

        return reply.code(401).send(error);
      }

      return;
    }

    const simulatorReadingFleet =
      path === ApiPaths.fleet &&
      ingestToken !== undefined &&
      hasBearerToken(request.headers.authorization, ingestToken);

    if (
      consolePassword !== undefined &&
      !simulatorReadingFleet &&
      !hasBasicPassword(request.headers.authorization, consolePassword)
    ) {
      const error: ApiError = { error: 'Password required' };

      return reply.code(401).header('www-authenticate', BASIC_AUTH_CHALLENGE).send(error);
    }
  });

  app.get(ApiPaths.health, async () => ({ ok: true }));

  app.get(ApiPaths.fleet, async () => registry);

  app.post(ApiPaths.ingest, async (request, reply) => {
    const parsed = IngestBatch.safeParse(request.body);

    if (!parsed.success) {
      const error: ApiError = { error: 'Invalid telemetry batch', details: parsed.error.issues };

      return reply.code(400).send(error);
    }

    return engine.ingest(parsed.data.samples, now());
  });

  app.post(ApiPaths.acknowledgeAlertRoute, async (request, reply) => {
    const parsed = AlertParams.safeParse(request.params);

    if (!parsed.success) {
      const error: ApiError = { error: 'Invalid alert id', details: parsed.error.issues };

      return reply.code(400).send(error);
    }

    const alert = engine.acknowledgeAlert(parsed.data.alertId, now());

    if (alert === undefined) {
      const error: ApiError = { error: 'Alert not found' };

      return reply.code(404).send(error);
    }

    return alert;
  });

  app.get(ApiPaths.robotHistoryRoute, async (request, reply) => {
    const parsed = RobotParams.safeParse(request.params);

    if (!parsed.success) {
      const error: ApiError = { error: 'Invalid robot id', details: parsed.error.issues };

      return reply.code(400).send(error);
    }

    const history = engine.historyOf(parsed.data.robotId, now());

    if (history === undefined) {
      const error: ApiError = { error: 'Robot not found' };

      return reply.code(404).send(error);
    }

    return history;
  });

  app.get(ApiPaths.stream, { websocket: true }, (socket) => {
    const disconnect = hub.connect(socket);

    socket.on('close', disconnect);
    socket.on('error', disconnect);
  });

  if (webRoot !== undefined) {
    await app.register(fastifyStatic, { root: webRoot });

    app.setNotFoundHandler((request, reply) => {
      if (request.method !== 'GET' || request.url.startsWith('/api/')) {
        const error: ApiError = { error: 'Not found' };

        return reply.code(404).send(error);
      }

      return reply.sendFile('index.html');
    });
  }

  return app;
}
