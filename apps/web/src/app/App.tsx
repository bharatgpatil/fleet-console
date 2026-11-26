import { CssBaseline, ThemeProvider, Typography } from '@mui/material';
import { theme } from './theme/theme.ts';

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <Typography variant="h4" component="h1" sx={{ p: 3 }}>
        Fleet Console
      </Typography>
    </ThemeProvider>
  );
}
