import { ApiPaths, IngestResult, type TelemetrySample } from '@fleet/contracts';
import { authHeaders } from './auth-headers.ts';
import { REQUEST_TIMEOUT_MS, SERVER_URL } from './config.ts';

type SendOutcome =
  | { kind: 'sent'; result: IngestResult }
  | { kind: 'rejected'; status: number }
  | { kind: 'failed'; reason: string };

export async function sendBatch(samples: readonly TelemetrySample[]): Promise<SendOutcome> {
  try {
    const response = await fetch(`${SERVER_URL}${ApiPaths.ingest}`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...authHeaders(),
      },
      body: JSON.stringify({ samples }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (response.status >= 400 && response.status < 500) {
      return { kind: 'rejected', status: response.status };
    }

    if (!response.ok) {
      return { kind: 'failed', reason: `HTTP ${response.status}` };
    }

    return { kind: 'sent', result: IngestResult.parse(await response.json()) };
  } catch (error) {
    return { kind: 'failed', reason: error instanceof Error ? error.message : String(error) };
  }
}
