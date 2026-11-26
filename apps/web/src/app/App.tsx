import { CssBaseline, ThemeProvider } from '@mui/material';
import { RouterProvider } from '@tanstack/react-router';
import type { FleetApi } from '../api/types.ts';
import { FleetProvider } from '../live/FleetProvider.tsx';
import { router } from './router.tsx';
import { theme } from './theme/theme.ts';

type AppProps = {
  api: FleetApi;
};

export function App({ api }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <FleetProvider api={api}>
        <RouterProvider router={router} />
      </FleetProvider>
    </ThemeProvider>
  );
}
