import { ToggleButtonGroup } from '@mui/material';
import { HealthFilter } from '../../../app/search.ts';
import { HEALTH_LABEL } from '../../../live/constants.ts';
import type { HealthCounts } from '../../../live/types.ts';
import { HealthDot } from '../../../shared/components/HealthDot.tsx';
import { FILTER_OPTIONS } from '../utils/constants.ts';
import { FilterOption } from './HealthFilterToggle.styles.ts';

type HealthFilterToggleProps = {
  value: HealthFilter | undefined;
  counts: HealthCounts;
  onChange: (value: HealthFilter | undefined) => void;
};

export function HealthFilterToggle({ value, counts, onChange }: HealthFilterToggleProps) {
  return (
    <ToggleButtonGroup
      size="small"
      exclusive
      value={value ?? 'all'}
      onChange={(_, next: unknown) => {
        const health = HealthFilter.safeParse(next);

        onChange(health.success ? health.data : undefined);
      }}
      aria-label="Filter robots by status"
      sx={{ flexWrap: 'wrap' }}
    >
      <FilterOption value="all">
        All <span className="tabular">{counts.total}</span>
      </FilterOption>
      {FILTER_OPTIONS.map((health) => (
        <FilterOption key={health} value={health}>
          <HealthDot health={health} size={8} />
          {HEALTH_LABEL[health]}
          <span className="tabular">{counts[health]}</span>
        </FilterOption>
      ))}
    </ToggleButtonGroup>
  );
}
