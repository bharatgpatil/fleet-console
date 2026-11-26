import { TableCell, Typography } from '@mui/material';
import { memo } from 'react';
import { HEALTH_LABEL } from '../../../live/constants.ts';
import type { RobotRow } from '../../../live/types.ts';
import { BatteryMeter } from '../../../shared/components/BatteryMeter.tsx';
import { HealthBadge } from '../../../shared/components/HealthBadge.tsx';
import { HealthIcon } from '../../../shared/components/HealthIcon.tsx';
import { RelativeTime } from '../../../shared/components/RelativeTime.tsx';
import { AlertLine } from './AlertLine.tsx';
import { BodyRow, NameCell, NameStack } from './RobotTable.styles.ts';

type RobotTableRowProps = {
  row: RobotRow;
  compact: boolean;
  showSite: boolean;
  highlighted: boolean;
  onHover: (robotId: string | null) => void;
};

export const RobotTableRow = memo(function RobotTableRow({
  row,
  compact,
  showSite,
  highlighted,
  onHover,
}: RobotTableRowProps) {
  const last = row.state === undefined ? null : row.state.last;
  const online = row.state !== undefined && row.state.connectivity === 'online';

  const battery =
    last === null ? (
      <Typography variant="body2" color="text.secondary">
        —
      </Typography>
    ) : (
      <BatteryMeter
        value={last.battery}
        charging={last.activity === 'charging'}
        stale={!online}
        width={compact ? 48 : 80}
      />
    );

  const activity = (
    <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
      {last === null ? '—' : last.activity}
    </Typography>
  );

  const lastReport = (
    <RelativeTime
      timestamp={row.state === undefined ? null : row.state.lastSeenAt}
      muted={!online}
    />
  );

  const name = (
    <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>
      {row.robot.name}
    </Typography>
  );

  return (
    <BodyRow
      hover
      highlighted={highlighted}
      onMouseEnter={() => onHover(row.id)}
      onMouseLeave={() => onHover(null)}
    >
      {compact ? (
        <TableCell>
          <NameCell title={HEALTH_LABEL[row.health]}>
            <HealthIcon health={row.health} size={18} />
            {name}
          </NameCell>
        </TableCell>
      ) : (
        <>
          <TableCell>
            <HealthBadge health={row.health} />
          </TableCell>
          <TableCell>
            <NameStack>
              {name}
              {showSite ? (
                <Typography variant="caption" color="text.secondary" noWrap>
                  {row.site === undefined ? 'Unknown site' : row.site.name}
                </Typography>
              ) : null}
            </NameStack>
          </TableCell>
        </>
      )}
      {compact ? <TableCell>{activity}</TableCell> : <TableCell>{battery}</TableCell>}
      {compact ? <TableCell>{battery}</TableCell> : <TableCell>{activity}</TableCell>}
      <TableCell>{lastReport}</TableCell>
      {compact ? null : (
        <TableCell>
          <AlertLine alerts={row.openAlerts} />
        </TableCell>
      )}
    </BodyRow>
  );
});
