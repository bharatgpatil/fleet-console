import websocket from '@fastify/websocket';
import { ApiPaths, IngestBatch, type ApiError } from '@fleet/contracts';
import Fastify, { type FastifyInstance } from 'fastify';
import { z } from 'zod';
import { BODY_LIMIT_BYTES } from './constants.ts';
import type { AppDependencies } from './types.ts';

const AlertParams = z.object({ alertId: z.string().min(1) });

export async function buildApp({
  engine,
  hub,
  registry,
  now,
  logLevel,
}: AppDependencies): Promise<FastifyInstance> {
  const app = Fastify({ logger: { level: logLevel }, bodyLimit: BODY_LIMIT_BYTES });

  await app.register(websocket);

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

  app.get(ApiPaths.stream, { websocket: true }, (socket) => {
    const disconnect = hub.connect(socket);

    socket.on('close', disconnect);
    socket.on('error', disconnect);
  });

  return app;
}
