import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { defineConfig, loadEnv } from 'vite';

const REPO_ROOT = fileURLToPath(new URL('../..', import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, REPO_ROOT, '');
  const apiTarget = env.API_TARGET ?? 'http://localhost:8080';

  return {
    plugins: [react()],
    server: {
      port: 3000,
      strictPort: true,
      proxy: {
        '/api': apiTarget,
        '/ws': { target: apiTarget, ws: true },
      },
    },
    css: {
      devSourcemap: true,
    },
    build: {
      sourcemap: true,
    },
  };
});
