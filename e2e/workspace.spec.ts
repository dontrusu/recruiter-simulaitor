import { expect, test } from '@playwright/test';

test('default workspace renders without development controls and responds to resizing', async ({
  page,
}) => {
  await page.goto('/');
  const stage = page.locator('[data-camera="A"]');
  const room = stage.locator(':scope > div');

  await expect(stage).toBeVisible();
  await expect(page.getByRole('complementary', { name: 'shop-column' })).toBeVisible();
  await expect(page.locator('.taskbar')).toBeVisible();
  await expect(page.getByRole('button', { name: /Camera:/ })).toHaveCount(0);

  const transformBeforeResize = await room.getAttribute('style');
  await page.setViewportSize({ width: 1366, height: 768 });
  await expect.poll(() => room.getAttribute('style')).not.toBe(transformBeforeResize);
});

test('development query enables the camera toggle', async ({ page }) => {
  await page.goto('/?dev=1');
  const stage = page.locator('[data-camera]');

  await expect(stage).toHaveAttribute('data-camera', 'A');
  await page.getByRole('button', { name: 'Camera: A' }).click();
  await expect(stage).toHaveAttribute('data-camera', 'B');
});
