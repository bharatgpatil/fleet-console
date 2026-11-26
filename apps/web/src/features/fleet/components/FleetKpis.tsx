import { Card, CardActionArea } from '@mui/material';
import type { HealthFilter } from '../../../app/search.ts';
import type { HealthCounts } from '../../../live/types.ts';
import { KpiGrid } from './FleetKpis.styles.ts';
import { HealthKpi } from './HealthKpi.tsx';
import { Kpi } from './Kpi.tsx';

type FleetKpisProps = {
  counts: HealthCounts;
  reporting: number;
  onSelect: (health: HealthFilter | undefined) => void;
};

export function FleetKpis({ counts, reporting, onSelect }: FleetKpisProps) {
  return (
    <KpiGrid>
      <Card>
        <CardActionArea
          onClick={() => onSelect(undefined)}
          aria-label="Show all robots across all sites"
        >
          <Kpi
            label="Reporting"
            value={reporting.toLocaleString()}
            suffix={`/ ${counts.total.toLocaleString()}`}
          />
        </CardActionArea>
      </Card>
      <HealthKpi
        health="critical"
        label="Critical"
        value={counts.critical}
        onSelect={() => onSelect('critical')}
      />
      <HealthKpi
        health="offline"
        label="Offline"
        value={counts.offline}
        onSelect={() => onSelect('offline')}
      />
      <HealthKpi
        health="warning"
        label="Warnings"
        value={counts.warning}
        onSelect={() => onSelect('warning')}
      />
    </KpiGrid>
  );
}
