import { CssBaseline, ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import type { FleetApi } from '../api/types.ts';
import { FleetProvider } from '../live/FleetProvider.tsx';
import { router } from './router.tsx';
import { theme } from './theme/theme.ts';

const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: 1 } } });

type AppProps = {
  api: FleetApi;
};

export function App({ api }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <QueryClientProvider client={queryClient}>
        <FleetProvider api={api}>
          <RouterProvider router={router} />
        </FleetProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
