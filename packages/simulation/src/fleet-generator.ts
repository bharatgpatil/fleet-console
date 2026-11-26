import type { FleetRegistry, Robot, Site } from '@fleet/contracts';
import { MIN_CHARGERS_PER_SITE, ROBOTS_PER_CHARGER, SITE_TEMPLATES } from './constants.ts';

export function generateFleet(robotsPerSite: readonly number[]): FleetRegistry {
  const sizes = robotsPerSite.slice(0, SITE_TEMPLATES.length);

  const sites: Site[] = SITE_TEMPLATES.slice(0, Math.max(1, sizes.length)).map(
    (template, index) => {
      const count = Math.max(
        MIN_CHARGERS_PER_SITE,
        Math.ceil((sizes[index] ?? 0) / ROBOTS_PER_CHARGER),
      );
      const spacing = (template.widthMetres - 8) / Math.max(1, count - 1);

      return {
        ...template,
        chargers: Array.from({ length: count }, (_, charger) => ({
          x: 4 + charger * Math.min(6, spacing),
          y: template.heightMetres - 4,
        })),
      };
    },
  );

  const robots: Robot[] = sites.flatMap((site, siteIndex) =>
    Array.from({ length: sizes[siteIndex] ?? 0 }, (_, index) => {
      const number = String(index + 1).padStart(3, '0');

      return {
        id: `${site.id}-r${number}`,
        name: `${site.name.slice(0, 3).toUpperCase()}-${number}`,
        siteId: site.id,
      };
    }),
  );

  return { sites, robots };
}
