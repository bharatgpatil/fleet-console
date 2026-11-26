import { ApiPaths, FleetRegistry } from '@fleet/contracts';
import { setTimeout as sleep } from 'node:timers/promises';
import { authHeaders } from './auth-headers.ts';
import { SERVER_URL } from './config.ts';

export async function fetchRegistry(): Promise<FleetRegistry> {
  for (let attempt = 1; ; attempt++) {
    try {
      const response = await fetch(`${SERVER_URL}${ApiPaths.fleet}`, { headers: authHeaders() });

      if (response.ok) {
        return FleetRegistry.parse(await response.json());
      }

      console.warn(`[sim] fetching the fleet failed: HTTP ${response.status}`);
    } catch {
      console.warn(`[sim] server not reachable at ${SERVER_URL} (attempt ${attempt})`);
    }

    await sleep(Math.min(5_000, 500 * attempt));
  }
}
