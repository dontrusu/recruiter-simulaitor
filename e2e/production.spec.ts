import { expect, test } from '@playwright/test';

test('production renders the first-slice Screen and bundled fonts', async ({ page }) => {
  const errors: string[] = [];
  const externalFontRequests: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('request', (request) => {
    const url = new URL(request.url());
    const isFontFile = /\.(woff2?|ttf|otf)$/i.test(url.pathname);
    if (
      /fonts\.(googleapis|gstatic)\.com/.test(url.hostname) ||
      (isFontFile && url.origin !== 'http://127.0.0.1:4174')
    ) {
      externalFontRequests.push(url.href);
    }
  });

  const response = await page.goto('http://127.0.0.1:4174/');

  expect(response?.ok()).toBe(true);
  await expect(page.getByRole('main', { name: 'Talent.OS Screen' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Vacancy' })).toBeVisible();
  await expect(page.getByRole('article', { name: 'Current application' })).toBeVisible();
  const shop = page.getByRole('complementary', { name: 'Shop' });
  await expect(shop.getByRole('article')).toHaveCount(2);
  await expect(page.locator('.taskbar')).toHaveCount(0);
  await expect(page.locator('.dev-panel')).toHaveCount(0);
  await expect(page.getByRole('button', { name: /Camera:/ })).toHaveCount(0);

  const fontsLoaded = await page.evaluate(async () => {
    await document.fonts.ready;
    return ['IBM Plex Sans Variable', 'IBM Plex Serif', 'IBM Plex Mono'].map((family) =>
      Array.from(document.fonts).some(
        (face) => face.family.replaceAll('"', '') === family && face.status === 'loaded',
      ),
    );
  });

  expect(fontsLoaded).toEqual([true, true, true]);
  expect(externalFontRequests).toEqual([]);
  expect(errors).toEqual([]);
});

test('production build exposes the opt-in Room camera control', async ({ page }) => {
  await page.goto('http://127.0.0.1:4174/?dev=1');

  const stage = page.locator('[data-camera]');
  const cameraToggle = page.getByRole('button', { name: 'Camera: A' });
  await expect(stage).toHaveAttribute('data-camera', 'A');
  await cameraToggle.click();
  await expect(stage).toHaveAttribute('data-camera', 'B');
  await expect
    .poll(async () => (await page.locator('[data-screen-composition]').boundingBox())?.width ?? 0)
    .toBeLessThan(800);
});
