import type { Position, Site } from '@fleet/contracts';
import { useTheme } from '@mui/material';
import { useId } from 'react';
import { clamp } from '../../../shared/utils/clamp.ts';
import { countLabel } from '../../../shared/utils/format.ts';
import type { MapRobot } from '../types.ts';
import { labelAnchor } from '../utils/label-anchor.ts';
import { RobotMarker } from './RobotMarker.tsx';
import { MapFrame, MapLayer } from './SiteMap.styles.ts';

const CHARGER_PATH = 'M0.2 -0.8 L-0.5 0.15 L0 0.15 L-0.2 0.8 L0.5 -0.15 L0 -0.15 Z';

type SiteMapProps = {
  site: Site;
  robots: readonly MapRobot[];
  focusIds: ReadonlySet<string> | null;
  highlightedId: string | null;
  onSelect: ((robotId: string) => void) | null;
  onHover: ((robotId: string | null) => void) | null;
  trail: readonly Position[] | null;
};

export function SiteMap({
  site,
  robots,
  focusIds,
  highlightedId,
  onSelect,
  onHover,
  trail,
}: SiteMapProps) {
  const theme = useTheme();
  const gridId = useId();
  const width = site.widthMetres;
  const height = site.heightMetres;
  const radius = Math.max(width, height) / 80;
  const markerRadius = radius * clamp(Math.sqrt(60 / Math.max(1, robots.length)), 0.45, 1);
  const pad = radius * 3;
  const viewBox = `${-pad} ${-pad} ${width + pad * 2} ${height + pad * 2}`;

  const ordered =
    focusIds === null
      ? robots
      : robots.toSorted((a, b) => Number(focusIds.has(a.id)) - Number(focusIds.has(b.id)));

  return (
    <MapFrame
      role="group"
      aria-label={`Floor plan of ${site.name}, ${countLabel(robots.length, 'robot')}`}
    >
      <MapLayer viewBox={viewBox} preserveAspectRatio="xMidYMid meet" aria-hidden>
        <defs>
          <pattern id={gridId} width={5} height={5} patternUnits="userSpaceOnUse">
            <path
              d="M 5 0 L 0 0 0 5"
              fill="none"
              stroke={theme.palette.divider}
              strokeWidth={radius * 0.1}
            />
          </pattern>
        </defs>
        <rect
          width={width}
          height={height}
          rx={radius}
          fill={`url(#${CSS.escape(gridId)})`}
          stroke={theme.palette.divider}
          strokeWidth={radius * 0.3}
        />
        {site.chargers.map((charger) => (
          <path
            key={`${charger.x},${charger.y}`}
            transform={`translate(${charger.x} ${charger.y}) scale(${radius / 1.1})`}
            d={CHARGER_PATH}
            fill={theme.palette.text.disabled}
          />
        ))}
        {trail === null || trail.length < 2 ? null : (
          <polyline
            points={trail
              .map((point) => `${clamp(point.x, 0, width)},${clamp(point.y, 0, height)}`)
              .join(' ')}
            fill="none"
            stroke={theme.palette.primary.main}
            strokeOpacity={0.4}
            strokeWidth={radius * 0.3}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        )}
      </MapLayer>
      <MapLayer viewBox={viewBox} preserveAspectRatio="xMidYMid meet">
        {ordered.map((robot) => {
          const x = clamp(robot.x, 0, width);
          const y = clamp(robot.y, 0, height);

          return (
            <RobotMarker
              key={robot.id}
              robot={robot}
              x={x}
              y={y}
              outOfBounds={x !== robot.x || y !== robot.y}
              radius={markerRadius}
              dimmed={focusIds !== null && !focusIds.has(robot.id)}
              labelAnchor={labelAnchor(x, width)}
              highlighted={robot.id === highlightedId}
              onSelect={onSelect}
              onHover={onHover}
            />
          );
        })}
      </MapLayer>
    </MapFrame>
  );
}
