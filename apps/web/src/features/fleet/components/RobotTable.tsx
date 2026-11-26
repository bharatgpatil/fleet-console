import { Table, TableBody, TableCell, TableHead, TablePagination, TableRow } from '@mui/material';
import { useState } from 'react';
import type { RobotRow } from '../../../live/types.ts';
import { ROWS_PER_PAGE } from '../utils/constants.ts';
import { TableFrame, TableScroll } from './RobotTable.styles.ts';
import { RobotTableEmpty } from './RobotTableEmpty.tsx';
import { RobotTableRow } from './RobotTableRow.tsx';

const COMPACT_COLUMNS = ['Robot', 'State', 'Battery', 'Last report'];

const FULL_COLUMNS = ['Status', 'Robot', 'Battery', 'State', 'Last report', 'Open alerts'];

type RobotTableProps = {
  rows: readonly RobotRow[];
  compact: boolean;
  showSite: boolean;
  fill: boolean;
  emptyFleet: boolean;
  highlightedId: string | null;
  onHover: (robotId: string | null) => void;
};

export function RobotTable({
  rows,
  compact,
  showSite,
  fill,
  emptyFleet,
  highlightedId,
  onHover,
}: RobotTableProps) {
  const [page, setPage] = useState(0);
  const lastPage = Math.max(0, Math.ceil(rows.length / ROWS_PER_PAGE) - 1);
  const currentPage = Math.min(page, lastPage);
  const visible = rows.slice(currentPage * ROWS_PER_PAGE, (currentPage + 1) * ROWS_PER_PAGE);
  const columns = compact ? COMPACT_COLUMNS : FULL_COLUMNS;

  return (
    <TableFrame fill={fill}>
      <TableScroll>
        {rows.length === 0 ? (
          <RobotTableEmpty emptyFleet={emptyFleet} />
        ) : (
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column}>{column}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {visible.map((row) => (
                <RobotTableRow
                  key={row.id}
                  row={row}
                  compact={compact}
                  showSite={showSite}
                  highlighted={row.id === highlightedId}
                  onHover={onHover}
                />
              ))}
            </TableBody>
          </Table>
        )}
      </TableScroll>
      <TablePagination
        component="div"
        count={rows.length}
        page={currentPage}
        rowsPerPage={ROWS_PER_PAGE}
        rowsPerPageOptions={[]}
        onPageChange={(_, next) => setPage(next)}
      />
    </TableFrame>
  );
}
