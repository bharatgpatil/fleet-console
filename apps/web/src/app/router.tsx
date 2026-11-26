import {
  createRootRoute,
  createRoute,
  createRouter,
  lazyRouteComponent,
  redirect,
} from '@tanstack/react-router';
import { FleetPage } from '../features/fleet/index.ts';
import { AppShell } from './layout/AppShell.tsx';
import { NotFound } from './NotFound.tsx';
import { FleetSearch } from './search.ts';

const rootRoute = createRootRoute({ component: AppShell, notFoundComponent: NotFound });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/fleet' });
  },
});

const fleetRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/fleet',
  validateSearch: (search) => FleetSearch.parse(search),
  component: FleetPage,
});

const robotRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/robots/$robotId',
  component: lazyRouteComponent(() => import('../features/robot/index.ts'), 'RobotDetailPage'),
});

export const router = createRouter({
  routeTree: rootRoute.addChildren([indexRoute, fleetRoute, robotRoute]),
  scrollRestoration: true,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
