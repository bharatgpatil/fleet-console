import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment, Typography, useMediaQuery, type Theme } from '@mui/material';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useCallback, useDeferredValue, useMemo, useState } from 'react';
import { ALL_SITES, type FleetSearch, type HealthFilter } from '../../app/search.ts';
import { countHealth } from '../../live/count-health.ts';
import { useFleet } from '../../live/use-fleet.ts';
import { useRobotRows } from '../../live/use-robot-rows.ts';
import { SectionCard } from '../../shared/components/SectionCard.tsx';
import { useThrottledValue } from '../../shared/hooks/use-throttled-value.ts';
import { countLabel } from '../../shared/utils/format.ts';
import { SiteMap, toMapRobot, type MapRobot } from '../site-map/index.ts';
import { FleetKpis } from './components/FleetKpis.tsx';
import { HealthFilterToggle } from './components/HealthFilterToggle.tsx';
import { RobotTable } from './components/RobotTable.tsx';
import { SiteTabs } from './components/SiteTabs.tsx';
import {
  CardActions,
  CardBody,
  ListPane,
  MapPane,
  PageStack,
  PageTitle,
  SearchField,
} from './FleetPage.styles.ts';
import { useDefaultSite } from './hooks/use-default-site.ts';
import { cardSubtitle } from './utils/card-subtitle.ts';
import { TABLE_REFRESH_MS } from './utils/constants.ts';
import { filterRows } from './utils/filter-rows.ts';

export function FleetPage() {
  const search = useSearch({ from: '/fleet' });
  const navigate = useNavigate({ from: '/fleet' });
  const siteIds = useFleet((state) => state.siteIds);
  const sitesById = useFleet((state) => state.sites);
  const allRows = useRobotRows();
  const wide = useMediaQuery((theme: Theme) => theme.breakpoints.up('xl'));
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const query = useDeferredValue(search.q);

  const sites = useMemo(() => siteIds.flatMap((id) => sitesById[id] ?? []), [siteIds, sitesById]);

  const setSearch = useCallback(
    (patch: Partial<FleetSearch>) => {
      void navigate({ search: (previous) => ({ ...previous, ...patch }), replace: true });
    },
    [navigate],
  );

  const selectSite = useCallback((site: string) => setSearch({ site }), [setSearch]);

  const showAll = search.site === ALL_SITES;
  const site = search.site === undefined || showAll ? undefined : sitesById[search.site];
  const siteId = site === undefined ? null : site.id;

  useDefaultSite({
    needed: site === undefined && !showAll,
    sites,
    rows: allRows,
    select: selectSite,
  });

  const siteRows = useMemo(
    () => filterRows(allRows, { siteId, health: undefined, query: undefined }),
    [allRows, siteId],
  );

  const filteredRows = useMemo(
    () => filterRows(siteRows, { siteId: null, health: search.health, query }),
    [siteRows, search.health, query],
  );

  const tableRows = useThrottledValue(filteredRows, TABLE_REFRESH_MS);
  const isFiltering = search.health !== undefined || (query !== undefined && query.trim() !== '');

  const focusIds = useMemo(
    () => (isFiltering ? new Set(filteredRows.map((row) => row.id)) : null),
    [isFiltering, filteredRows],
  );

  const markers = useMemo(
    () => siteRows.map(toMapRobot).filter((marker): marker is MapRobot => marker !== null),
    [siteRows],
  );

  const fleetCounts = useMemo(() => countHealth(allRows), [allRows]);
  const siteCounts = useMemo(() => countHealth(siteRows), [siteRows]);
  const reporting = allRows.filter((row) => row.state?.connectivity === 'online').length;

  if (site === undefined && !showAll) {
    return null;
  }

  return (
    <PageStack>
      <div>
        <PageTitle>Fleet overview</PageTitle>
        <Typography variant="body2" color="text.secondary">
          {countLabel(allRows.length, 'robot')} across {countLabel(sites.length, 'site')}
        </Typography>
      </div>

      <FleetKpis
        counts={fleetCounts}
        reporting={reporting}
        onSelect={(health: HealthFilter | undefined) => setSearch({ site: ALL_SITES, health })}
      />

      <SiteTabs sites={sites} rows={allRows} value={siteId ?? ALL_SITES} onChange={selectSite} />

      <SectionCard
        title={site === undefined ? 'All sites' : site.name}
        subtitle={cardSubtitle({
          rows: siteRows,
          matches: focusIds === null ? null : focusIds.size,
          showAll,
        })}
        action={
          <CardActions>
            <SearchField
              size="small"
              type="search"
              placeholder="Search robots…"
              autoComplete="off"
              value={search.q ?? ''}
              onChange={(event) =>
                setSearch({ q: event.target.value === '' ? undefined : event.target.value })
              }
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                },
                htmlInput: { 'aria-label': 'Search robots by name', spellCheck: false },
              }}
            />
            <HealthFilterToggle
              value={search.health}
              counts={siteCounts}
              onChange={(health) => setSearch({ health })}
            />
          </CardActions>
        }
      >
        <CardBody withMap={site !== undefined}>
          {site === undefined ? null : (
            <MapPane>
              <SiteMap
                site={site}
                robots={markers}
                focusIds={focusIds}
                highlightedId={hoveredId}
                onSelect={null}
                onHover={setHoveredId}
              />
            </MapPane>
          )}
          <ListPane besideMap={site !== undefined}>
            <RobotTable
              key={`${siteId ?? ALL_SITES}|${search.health ?? ''}|${query ?? ''}`}
              rows={tableRows}
              compact={wide && site !== undefined}
              showSite={showAll}
              fill={wide}
              emptyFleet={allRows.length === 0}
              highlightedId={hoveredId}
              onHover={setHoveredId}
            />
          </ListPane>
        </CardBody>
      </SectionCard>
    </PageStack>
  );
}
