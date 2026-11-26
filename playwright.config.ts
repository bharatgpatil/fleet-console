import { defineConfig } from '@playwright/test';
import { fileURLToPath } from 'node:url';

const PORT = 8097;
const BASE_URL = `http://localhost:${PORT}`;
const WEB_ROOT = fileURLToPath(new URL('./apps/web/dist', import.meta.url));

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  forbidOnly: process.env.CI !== undefined,
  retries: process.env.CI === undefined ? 0 : 1,
  reporter: process.env.CI === undefined ? 'list' : 'github',
  use: {
    baseURL: BASE_URL,
    channel: process.env.CI === undefined ? 'chrome' : undefined,
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run build && npm run serve',
    url: `${BASE_URL}/healthz`,
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      PORT: String(PORT),
      SERVER_URL: BASE_URL,
      WEB_ROOT,
      LOG_LEVEL: 'warn',
      FLEET_ROBOTS_PER_SITE: '5,10,20',
      SIM_FAULTS: 'off',
      INGEST_TOKEN: '',
      CONSOLE_PASSWORD: '',
    },
  },
});
