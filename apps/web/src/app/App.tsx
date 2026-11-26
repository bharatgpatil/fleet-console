import { CssBaseline, ThemeProvider, Typography } from '@mui/material';
import type { FleetApi } from '../api/types.ts';
import { FleetProvider } from '../live/FleetProvider.tsx';
import { theme } from './theme/theme.ts';

type AppProps = {
  api: FleetApi;
};

export function App({ api }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <FleetProvider api={api}>
        <Typography variant="h4" component="h1" sx={{ p: 3 }}>
          Fleet Console
        </Typography>
      </FleetProvider>
    </ThemeProvider>
  );
}
