import { ApiPaths, FleetRegistry, type TelemetrySample } from '@fleet/contracts';
import { ALERT_RULES } from '@fleet/domain';
import { expect, test } from '@playwright/test';

const FAR_FUTURE_MS = 24 * 60 * 60_000;

test('a critical battery alert shows in Needs you and Ack clears it', async ({
  page,
  request,
}, testInfo) => {
  const registry = FleetRegistry.parse(await (await request.get(ApiPaths.fleet)).json());
  const robot = registry.robots[testInfo.retry];

  expect(robot).toBeDefined();

  if (robot === undefined) {
    return;
  }

  const sample: TelemetrySample = {
    robotId: robot.id,
    sequence: 1_000_000_000,
    recordedAt: Date.now() + FAR_FUTURE_MS,
    battery: ALERT_RULES.batteryCriticalBelow - 1,
    activity: 'idle',
    position: { x: 1, y: 1 },
    headingRadians: 0,
    speedMetresPerSecond: 0,
  };

  const ingest = await request.post(ApiPaths.ingest, { data: { samples: [sample] } });

  expect(ingest.ok()).toBe(true);

  await page.goto('/fleet');
  await page.getByRole('button', { name: /Needs you/ }).click();

  const ack = page.getByRole('button', {
    name: `Acknowledge ${robot.name}: Battery below ${ALERT_RULES.batteryCriticalBelow}%`,
  });

  await expect(ack).toBeVisible();

  await ack.click();

  await expect(ack).toHaveCount(0);
});
