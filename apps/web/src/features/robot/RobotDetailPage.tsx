import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Alert, Stack, Typography } from '@mui/material';
import { useParams } from '@tanstack/react-router';
import { useRobotView } from '../../live/use-robot-view.ts';
import { ButtonLink } from '../../shared/components/ButtonLink.tsx';
import { EmptyState } from '../../shared/components/EmptyState.tsx';
import { HealthBadge } from '../../shared/components/HealthBadge.tsx';
import { RelativeTime } from '../../shared/components/RelativeTime.tsx';
import { SectionCard } from '../../shared/components/SectionCard.tsx';
import { formatClock } from '../../shared/utils/format.ts';
import { RobotAlerts } from '../alerts/index.ts';
import { SiteMap, type MapRobot } from '../site-map/index.ts';
import { LiveTelemetry } from './components/LiveTelemetry.tsx';
import {
  BackLinkLabel,
  backLinkSx,
  CardPadding,
  DetailGrid,
  HeaderRow,
  MapWell,
  RobotName,
  TitleRow,
} from './RobotDetailPage.styles.ts';

export function RobotDetailPage() {
  const { robotId } = useParams({ from: '/robots/$robotId' });
  const { robot, site, state, health } = useRobotView(robotId);

  if (robot === undefined) {
    return (
      <EmptyState title={`Robot ${robotId} not found`}>
        <ButtonLink to="/fleet">Back to fleet</ButtonLink>
      </EmptyState>
    );
  }

  const last = state === undefined ? null : state.last;

  const marker: MapRobot | null =
    state === undefined || last === null
      ? null
      : {
          id: robot.id,
          name: robot.name,
          x: last.position.x,
          y: last.position.y,
          headingRadians: last.headingRadians,
          health,
          connectivity: state.connectivity,
          activity: last.activity,
          battery: last.battery,
        };

  return (
    <Stack spacing={2.5}>
      <Stack spacing={1}>
        <ButtonLink
          to="/fleet"
          search={site === undefined ? {} : { site: site.id }}
          startIcon={<ArrowBackIcon />}
          size="small"
          sx={backLinkSx}
        >
          <BackLinkLabel>{site === undefined ? 'Fleet' : site.name}</BackLinkLabel>
        </ButtonLink>
        <HeaderRow direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
          <TitleRow direction="row" spacing={1.5} useFlexGap>
            <RobotName variant="h4" variantMapping={{ h4: 'h1' }}>
              {robot.name}
            </RobotName>
            <HealthBadge health={health} />
          </TitleRow>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Last report
            </Typography>
            <RelativeTime
              timestamp={state === undefined ? null : state.lastSeenAt}
              muted={state === undefined || state.connectivity !== 'online'}
            />
          </Stack>
        </HeaderRow>
      </Stack>

      {state !== undefined && state.connectivity === 'offline' && state.lastSeenAt !== null ? (
        <Alert severity="error" variant="outlined">
          This robot stopped reporting at {formatClock(state.lastSeenAt)}. Everything below is its
          last known state.
        </Alert>
      ) : null}
      {state !== undefined && state.connectivity === 'stale' ? (
        <Alert severity="warning" variant="outlined">
          Reports are delayed. Values may be a few seconds old.
        </Alert>
      ) : null}

      {state === undefined || last === null ? (
        <SectionCard title="Telemetry">
          <EmptyState title="No telemetry yet">
            This robot hasn’t reported since the server started.
          </EmptyState>
        </SectionCard>
      ) : (
        <DetailGrid>
          <Stack spacing={2}>
            <SectionCard title="Now">
              <CardPadding>
                <LiveTelemetry last={last} stale={state.connectivity !== 'online'} />
              </CardPadding>
            </SectionCard>
            <SectionCard title="Open alerts">
              <CardPadding>
                <RobotAlerts robotId={robot.id} />
              </CardPadding>
            </SectionCard>
          </Stack>
          {site === undefined || marker === null ? null : (
            <SectionCard title="Position">
              <MapWell>
                <SiteMap
                  site={site}
                  robots={[marker]}
                  focusIds={null}
                  highlightedId={robot.id}
                  onSelect={null}
                  onHover={null}
                />
              </MapWell>
            </SectionCard>
          )}
        </DetailGrid>
      )}
    </Stack>
  );
}
