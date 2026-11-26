import { styled } from '@mui/material/styles';
import type { Health } from '../../live/types.ts';

export const Dot = styled('span', {
  shouldForwardProp: (prop) => prop !== 'health' && prop !== 'size' && prop !== 'pulse',
})<{ health: Health; size: number; pulse: boolean }>(({ theme, health, size, pulse }) => ({
  display: 'inline-block',
  flexShrink: 0,
  width: size,
  height: size,
  borderRadius: '50%',
  backgroundColor: theme.palette.health[health],
  boxShadow: `0 0 0 3px color-mix(in srgb, ${theme.palette.health[health]} 22%, transparent)`,
  ...(pulse
    ? {
        animation: 'health-pulse 1.6s ease-in-out infinite',
        '@keyframes health-pulse': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.35 },
        },
      }
    : {}),
}));
