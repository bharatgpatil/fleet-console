import { INGEST_TOKEN } from './config.ts';

export function authHeaders(): Record<string, string> {
  return INGEST_TOKEN === undefined ? {} : { authorization: `Bearer ${INGEST_TOKEN}` };
}
