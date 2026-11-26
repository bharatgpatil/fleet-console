import OkIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import OfflineIcon from '@mui/icons-material/CloudOffOutlined';
import CriticalIcon from '@mui/icons-material/ErrorOutlineOutlined';
import UnknownIcon from '@mui/icons-material/HelpOutlineOutlined';
import WarningIcon from '@mui/icons-material/WarningAmberOutlined';
import { styled, type Theme } from '@mui/material/styles';
import type { Health } from '../../live/types.ts';

type IconStyleProps = {
  health: Health;
  size: number;
};

const options = { shouldForwardProp: (prop: string) => prop !== 'health' && prop !== 'size' };

const iconStyles = ({ theme, health, size }: IconStyleProps & { theme: Theme }) => ({
  fontSize: size,
  flexShrink: 0,
  color: theme.palette.health[health],
});

export const HEALTH_ICON = {
  critical: styled(CriticalIcon, options)<IconStyleProps>(iconStyles),
  offline: styled(OfflineIcon, options)<IconStyleProps>(iconStyles),
  warning: styled(WarningIcon, options)<IconStyleProps>(iconStyles),
  ok: styled(OkIcon, options)<IconStyleProps>(iconStyles),
  unknown: styled(UnknownIcon, options)<IconStyleProps>(iconStyles),
} satisfies Record<Health, unknown>;
