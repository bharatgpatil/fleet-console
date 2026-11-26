import '@fontsource-variable/inter';
import '@fontsource-variable/jetbrains-mono';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createFleetApi } from './api/create-fleet-api.ts';
import { App } from './app/App.tsx';

const root = document.getElementById('root');

if (root === null) {
  throw new Error('index.html is missing the #root element');
}

createRoot(root).render(
  <StrictMode>
    <App api={createFleetApi()} />
  </StrictMode>,
);
