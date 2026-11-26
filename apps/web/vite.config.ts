import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const API_TARGET = process.env.API_TARGET ?? 'http://localhost:8080';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true,
    proxy: {
      '/api': API_TARGET,
      '/ws': { target: API_TARGET, ws: true },
    },
  },
  // JS/TS modules already get inline source maps in dev; CSS files need this flag.
  css: {
    devSourcemap: true,
  },
  build: {
    sourcemap: true,
  },
});
