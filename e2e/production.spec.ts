import { test, expect } from '@playwright/test';
test('production renders the workspace shell without development controls by default', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  const response = await page.goto('http://127.0.0.1:4173/');
  expect(response?.ok()).toBe(true);
  await expect(page.locator('[data-camera="A"]')).toBeVisible();
  await expect(page.getByText('Talent.OS').first()).toBeVisible();
  await expect(page.getByRole('complementary', { name: 'shop-column' })).toBeVisible();
  await expect(page.locator('.taskbar')).toBeVisible();
  await expect(page.locator('.dev-panel')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('production build exposes the opt-in camera control', async ({ page }) => {
  await page.goto('http://127.0.0.1:4173/?dev=1');
  const stage = page.locator('[data-camera]');
  const cameraToggle = page.getByRole('button', { name: 'Camera: A' });
  await expect(stage).toHaveAttribute('data-camera', 'A');
  await cameraToggle.click();
  await expect(stage).toHaveAttribute('data-camera', 'B');
});
