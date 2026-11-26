import type { Health } from '../../live/types.ts';

const MONO_FONT = '"JetBrains Mono Variable", ui-monospace, SFMono-Regular, Menlo, monospace';
const INTER = '"Inter Variable", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

export type DesignTokens = {
  font: {
    heading: string;
    body: string;
    mono: string;
    headingWeight: number;
    headingTracking: string;
  };
  radius: {
    data: number;
    button: number;
    pill: number;
    tag: number;
    control: number;
  };
  color: {
    linkAccent: string;
  };
};

export const SHARED_TOKENS: Omit<DesignTokens, 'color'> = {
  font: {
    heading: INTER,
    body: INTER,
    mono: MONO_FONT,
    headingWeight: 650,
    headingTracking: '-0.02em',
  },
  radius: { data: 12, button: 8, pill: 200, tag: 16, control: 8 },
};

declare module '@mui/material/styles' {
  interface Theme {
    tokens: DesignTokens;
  }
  interface ThemeOptions {
    tokens?: DesignTokens;
  }
  interface Palette {
    health: Record<Health, string>;
  }
  interface PaletteOptions {
    health?: Record<Health, string>;
  }
}
