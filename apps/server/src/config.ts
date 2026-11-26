import { DEFAULT_ROBOTS_PER_SITE } from '@fleet/simulation';
import { z } from 'zod';

const RobotsPerSite = z
  .string()
  .transform((value) => value.split(',').map(Number))
  .pipe(z.array(z.number().int().min(1).max(1_000)).min(1).max(3));

const OptionalSecret = (minLength: number) =>
  z
    .string()
    .optional()
    .transform((value) => (value === '' ? undefined : value))
    .pipe(z.string().min(minLength).optional());

const Env = z.object({
  PORT: z.coerce.number().int().default(8080),
  HOST: z.string().min(1).default('localhost'),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  FLEET_ROBOTS_PER_SITE: RobotsPerSite.default([...DEFAULT_ROBOTS_PER_SITE]),
  WEB_ROOT: z.string().min(1).optional(),
  INGEST_TOKEN: OptionalSecret(16),
  CONSOLE_PASSWORD: OptionalSecret(8),
});

type Config = z.infer<typeof Env>;

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  return Env.parse(env);
}
