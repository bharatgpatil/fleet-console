import { Outlet } from '@tanstack/react-router';
import { NeedsYouButton } from '../../features/alerts/index.ts';
import { useFleet } from '../../live/use-fleet.ts';
import { Main, ShellRoot, SkipLink, Spacer, TopBar, TopBarToolbar } from './AppShell.styles.ts';
import { Brand } from './Brand.tsx';
import { FleetLoading } from './FleetLoading.tsx';
import { StaleBanner } from './StaleBanner.tsx';

export function AppShell() {
  const hydrated = useFleet((state) => state.hydrated);

  return (
    <ShellRoot>
      <SkipLink href="#main">Skip to content</SkipLink>
      <TopBar position="sticky" color="inherit" elevation={0}>
        <TopBarToolbar variant="dense">
          <Brand />
          <Spacer />
          <NeedsYouButton />
        </TopBarToolbar>
      </TopBar>
      <Main id="main" tabIndex={-1} aria-busy={!hydrated}>
        <StaleBanner />
        {hydrated ? <Outlet /> : <FleetLoading />}
      </Main>
    </ShellRoot>
  );
}
