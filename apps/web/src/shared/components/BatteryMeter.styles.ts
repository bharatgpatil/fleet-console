import { styled } from '@mui/material/styles';
import type { BatteryTone } from '../utils/battery-tone.ts';

export const MeterTrack = styled('div', {
  shouldForwardProp: (prop) => prop !== 'trackWidth',
})<{ trackWidth: number }>(({ theme, trackWidth }) => ({
  position: 'relative',
  width: trackWidth,
  height: 8,
  borderRadius: 4,
  backgroundColor: theme.palette.action.hover,
  overflow: 'hidden',
  flexShrink: 0,
}));

export const MeterFill = styled('div', {
  shouldForwardProp: (prop) => prop !== 'tone' && prop !== 'stale',
})<{ tone: BatteryTone; stale: boolean }>(({ theme, tone, stale }) => ({
  position: 'absolute',
  inset: 0,
  backgroundColor: theme.palette.health[tone],
  transformOrigin: 'left center',
  ...(stale
    ? {
        backgroundImage:
          'repeating-linear-gradient(45deg, transparent 0 4px, rgba(0,0,0,0.25) 4px 8px)',
      }
    : {}),
}));

export const MeterValue = styled('span')({
  minWidth: 38,
  textAlign: 'right',
});
