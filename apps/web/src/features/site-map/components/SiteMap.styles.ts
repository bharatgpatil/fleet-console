import { styled } from '@mui/material/styles';

export const MapFrame = styled('div')({
  position: 'relative',
  width: '100%',
  height: '100%',
  minHeight: 0,
});

export const MapLayer = styled('svg')({
  position: 'absolute',
  inset: 0,
  display: 'block',
});
