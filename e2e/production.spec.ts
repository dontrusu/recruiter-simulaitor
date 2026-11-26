import { expect, test } from '@playwright/test';

test('production renders the first-slice Screen and Shop', async ({ page }) => {
  const response = await page.goto('/');

  expect(response?.ok()).toBe(true);
  await expect(page.getByRole('main', { name: 'Talent.OS Screen' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Vacancy' })).toBeVisible();
  await expect(page.getByRole('article', { name: 'Current application' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Shop' })).toBeVisible();
});

test('production hides the camera control by default', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('button', { name: /Camera:/ })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Макет' })).toHaveCount(0);
  await expect(page.getByLabel('Composition preset')).toHaveCount(0);
});

test('production loads bundled fonts without external font requests', async ({ page }) => {
  const externalFontRequests: string[] = [];
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

  await page.goto('/');

  const fontsLoaded = await page.evaluate(async () => {
    await document.fonts.ready;
    return ['IBM Plex Sans Variable', 'IBM Plex Mono'].map((family) =>
      Array.from(document.fonts).some(
        (face) => face.family.replaceAll('"', '') === family && face.status === 'loaded',
      ),
    );
  });

  expect(fontsLoaded).toEqual([true, true]);
  expect(externalFontRequests).toEqual([]);
});

test('production starts without runtime errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));

  await page.goto('/');
  await expect(page.getByRole('main', { name: 'Talent.OS Screen' })).toBeVisible();
  await page.evaluate(() => document.fonts.ready.then(() => undefined));

  expect(errors).toEqual([]);
});

test('production cannot expose development controls through URL parameters', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/?dev=1&view=room&stage=chaos&preset=chaos');

  await expect(page.getByRole('button', { name: /Camera:/ })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Макет' })).toHaveCount(0);
  await expect(page.getByLabel('Composition preset')).toHaveCount(0);
  await expect(page.getByRole('complementary', { name: 'Calm Corner' })).toHaveCount(0);
  const screen = page.getByRole('main', { name: 'Talent.OS Screen' });
  await expect.poll(async () => (await screen.boundingBox())?.width).toBeCloseTo(1296, 0);
});
