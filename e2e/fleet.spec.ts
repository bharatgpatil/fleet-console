import { expect, test } from '@playwright/test';

test('the Fleet page shows live robots', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveURL(/\/fleet/);
  await expect(page.getByRole('heading', { name: 'Fleet overview' })).toBeAttached();
  await expect(page.getByRole('tab', { name: /All sites/ })).toBeVisible();
  await expect(page.getByRole('row').nth(1)).toBeVisible();
});

test('search keeps only robots whose name matches', async ({ page }) => {
  await page.goto('/fleet?site=all');

  const firstName = await page.getByRole('row').nth(1).getByRole('link').innerText();

  await page.getByRole('searchbox', { name: 'Search robots by name' }).fill(firstName);

  await expect(page).toHaveURL(new RegExp(`q=${encodeURIComponent(firstName)}`));
  await expect(page.getByRole('row')).toHaveCount(2);
});

test('a robot name opens its page with live data and history', async ({ page }) => {
  await page.goto('/fleet?site=all');

  const link = page.getByRole('row').nth(1).getByRole('link');
  const name = await link.innerText();

  await link.click();

  await expect(page).toHaveURL(/\/robots\//);
  await expect(page.getByRole('heading', { level: 1, name })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Now' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Battery' })).toBeVisible();
});

test('an unknown robot shows not found with a way back', async ({ page }) => {
  await page.goto('/robots/no-such-robot');

  await expect(page.getByText('Robot no-such-robot not found')).toBeVisible();

  await page.getByRole('link', { name: 'Back to fleet' }).click();

  await expect(page).toHaveURL(/\/fleet/);
});
