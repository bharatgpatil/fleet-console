import {
  createTheme,
  type PaletteOptions,
  type Theme,
  type ThemeOptions,
} from '@mui/material/styles';
import { SHARED_TOKENS, type DesignTokens } from './tokens.ts';

export type ModeColors = {
  palette: PaletteOptions;
  linkAccent: string;
  components?: ThemeOptions['components'];
};

function sharedOptions(t: DesignTokens): ThemeOptions {
  const heading = {
    fontFamily: t.font.heading,
    fontWeight: t.font.headingWeight,
    letterSpacing: t.font.headingTracking,
  };

  return {
    cssVariables: true,
    shape: { borderRadius: 10 },
    typography: {
      fontFamily: t.font.body,
      h1: heading,
      h2: heading,
      h3: heading,
      h4: heading,
      h5: heading,
      h6: { ...heading, fontSize: '1rem' },
      subtitle2: { fontWeight: 600 },
      overline: { fontWeight: 600, letterSpacing: '0.08em', fontSize: '0.68rem' },
      button: {
        textTransform: 'none',
        fontFamily: t.font.heading,
        fontWeight: Math.min(t.font.headingWeight + 100, 600),
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: { fontFeatureSettings: '"cv11", "ss01"' },
          'h1, h2, h3': { textWrap: 'balance' },
          'a, button, [role="button"], [role="tab"], input, label': { touchAction: 'manipulation' },
          '@media (pointer: fine)': { html: { overscrollBehavior: 'none' } },
          '.mono, .tabular': { fontFamily: t.font.mono, fontVariantNumeric: 'tabular-nums' },
          // ::-webkit rules are for Safari, which ignores scrollbar-color.
          '*': {
            scrollbarWidth: 'thin',
            scrollbarColor:
              'color-mix(in srgb, var(--mui-palette-text-primary) 22%, transparent) transparent',
          },
          '*::-webkit-scrollbar': { width: 10, height: 10 },
          '*::-webkit-scrollbar-track': { background: 'transparent' },
          '*::-webkit-scrollbar-thumb': {
            borderRadius: 999,
            border: '2px solid transparent',
            backgroundClip: 'padding-box',
            backgroundColor: 'color-mix(in srgb, var(--mui-palette-text-primary) 22%, transparent)',
          },
          '*::-webkit-scrollbar-thumb:hover': {
            backgroundColor: 'color-mix(in srgb, var(--mui-palette-text-primary) 40%, transparent)',
          },
          '@media (prefers-reduced-motion: reduce)': {
            '*': { transitionDuration: '0ms !important', animationDuration: '0ms !important' },
          },
        },
      },
      MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
      MuiCard: {
        defaultProps: { variant: 'outlined' },
        styleOverrides: {
          root: { borderRadius: t.radius.data },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            borderRadius: t.radius.button,
            transition: 'transform 120ms ease-out, background-color 150ms',
            '&:active': { transform: 'scale(0.97)' },
          },
        },
      },
      MuiToggleButton: { styleOverrides: { root: { borderRadius: t.radius.button } } },
      MuiToggleButtonGroup: { styleOverrides: { root: { borderRadius: t.radius.button } } },
      MuiChip: { styleOverrides: { root: { fontWeight: 600, borderRadius: t.radius.tag } } },
      MuiListItemButton: { styleOverrides: { root: { borderRadius: t.radius.pill } } },
      MuiOutlinedInput: { styleOverrides: { root: { borderRadius: t.radius.control } } },
      MuiLink: {
        styleOverrides: {
          root: { textDecorationColor: t.color.linkAccent, textUnderlineOffset: 3 },
        },
      },
      MuiTooltip: { defaultProps: { arrow: true } },
    },
  };
}

export function buildTheme({ palette, linkAccent, components }: ModeColors): Theme {
  const tokens: DesignTokens = { ...SHARED_TOKENS, color: { linkAccent } };

  // Merge first: with cssVariables, createTheme builds CSS variables from its first argument only.
  return createTheme(
    deepMerge(sharedOptions(tokens), { tokens, palette, components: components ?? {} }),
  );
}

type PlainObject = Record<string, unknown>;
const isPlainObject = (v: unknown): v is PlainObject =>
  typeof v === 'object' && v !== null && Object.getPrototypeOf(v) === Object.prototype;

function deepMerge<T extends object>(base: T, override: object): T {
  const out: PlainObject = { ...(base as PlainObject) };

  for (const [key, value] of Object.entries(override)) {
    const current = out[key];

    out[key] = isPlainObject(current) && isPlainObject(value) ? deepMerge(current, value) : value;
  }

  return out as T;
}
