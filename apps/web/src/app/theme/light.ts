import type { ModeColors } from './build-theme.ts';

const status = {
  critical: '#dc2626',
  warning: '#d97706',
  ok: '#16a34a',
  offline: '#7c3aed',
  unknown: '#94a3b8',
};

const palette = {
  graphite: '#202020',
  canvasWhite: '#ffffff',
  ash: '#efefef',
  fog: '#f5f5f5',
  steel: '#4d4d4d',
  slate: '#828282',
  mist: '#e8e8e8',
  ember: '#ff682c',
  brass: '#816729',
};

export const lightColors: ModeColors = {
  linkAccent: palette.ember,
  palette: {
    mode: 'light',
    primary: { main: palette.graphite, contrastText: palette.canvasWhite },
    secondary: { main: palette.ember, contrastText: palette.graphite },
    error: { main: status.critical },
    warning: { main: status.warning, contrastText: palette.canvasWhite },
    success: { main: status.ok },
    info: { main: palette.brass },
    background: { default: palette.ash, paper: palette.canvasWhite },
    text: { primary: palette.graphite, secondary: palette.steel, disabled: palette.slate },
    divider: palette.mist,
    action: { hover: palette.fog, selected: palette.ash },
    health: status,
  },
  components: {
    MuiTabs: { defaultProps: { indicatorColor: 'secondary', textColor: 'inherit' } },
  },
};
