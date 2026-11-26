import { useTheme } from '@mui/material';
import { memo } from 'react';
import type { RobotMarkerProps } from '../types.ts';
import { markerLabel } from '../utils/marker-label.ts';
import { sameMarker } from '../utils/same-marker.ts';

export const RobotMarker = memo(function RobotMarker({
  robot,
  x,
  y,
  outOfBounds,
  radius,
  dimmed,
  labelAnchor,
  highlighted,
  onSelect,
  onHover,
}: RobotMarkerProps) {
  const theme = useTheme();
  const color = theme.palette.health[robot.health];
  const lastKnownOnly = robot.connectivity !== 'online';
  const label = markerLabel(robot, outOfBounds);
  const showHeading = !dimmed && robot.activity === 'moving' && !lastKnownOnly;

  return (
    <g
      transform={`translate(${x} ${y})`}
      opacity={dimmed && !highlighted ? 0.15 : 1}
      role={onSelect === null ? 'img' : 'button'}
      tabIndex={onSelect === null ? undefined : 0}
      aria-label={label}
      style={{ cursor: onSelect === null ? 'default' : 'pointer', outline: 'none' }}
      onClick={onSelect === null ? undefined : () => onSelect(robot.id)}
      onKeyDown={
        onSelect === null
          ? undefined
          : (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onSelect(robot.id);
              }
            }
      }
      onMouseEnter={onHover === null ? undefined : () => onHover(robot.id)}
      onMouseLeave={onHover === null ? undefined : () => onHover(null)}
      onFocus={onHover === null ? undefined : () => onHover(robot.id)}
      onBlur={onHover === null ? undefined : () => onHover(null)}
    >
      <title>{label}</title>
      {highlighted ? <circle r={radius * 2.1} fill={color} fillOpacity={0.14} /> : null}
      {outOfBounds ? (
        <circle
          r={radius * 1.7}
          fill="none"
          stroke={theme.palette.health.warning}
          strokeWidth={radius * 0.22}
          strokeDasharray={`${radius * 0.4} ${radius * 0.3}`}
        />
      ) : null}
      {showHeading ? (
        <line
          x2={Math.cos(robot.headingRadians) * radius * 2}
          y2={Math.sin(robot.headingRadians) * radius * 2}
          stroke={color}
          strokeWidth={radius * 0.35}
          strokeLinecap="round"
        />
      ) : null}
      <circle
        r={radius}
        fill={lastKnownOnly ? theme.palette.background.paper : color}
        stroke={color}
        strokeWidth={lastKnownOnly ? radius * 0.3 : 0}
        strokeDasharray={
          robot.connectivity === 'stale' ? `${radius * 0.5} ${radius * 0.35}` : undefined
        }
      />
      {highlighted ? (
        <text
          y={-radius * 2.6}
          textAnchor={labelAnchor}
          fontSize={radius * 1.6}
          fontWeight={600}
          fill={theme.palette.text.primary}
          stroke={theme.palette.background.paper}
          strokeWidth={radius * 0.5}
          paintOrder="stroke"
        >
          {robot.name}
        </text>
      ) : null}
    </g>
  );
}, sameMarker);
