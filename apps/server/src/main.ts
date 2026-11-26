import Fastify from 'fastify';

const app = Fastify({ logger: { level: process.env.LOG_LEVEL ?? 'info' } });

app.get('/healthz', async () => ({ ok: true }));

await app.listen({ port: Number(process.env.PORT ?? 8080), host: '0.0.0.0' });
