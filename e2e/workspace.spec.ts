import { expect, test } from '@playwright/test';

test('renders the first-slice Screen and fixed Shop preview', async ({ page }) => {
  await page.goto('/');

  const screen = page.getByRole('main', { name: 'Talent.OS Screen' });
  const shop = page.getByRole('complementary', { name: 'Shop' });

  await expect(screen).toBeVisible();
  await expect(screen.getByRole('region', { name: 'Vacancy' })).toBeVisible();
  await expect(screen.getByRole('article', { name: 'Current application' })).toBeVisible();
  await expect(
    screen.getByRole('list', { name: 'Reason choices' }).getByRole('listitem'),
  ).toHaveCount(3);
  await expect(shop.getByRole('article')).toHaveCount(2);
  await expect(shop.getByRole('heading', { name: 'Smart Reject' })).toBeVisible();
  await expect(shop.getByRole('heading', { name: 'Talent Pool' })).toBeVisible();
  await expect(page.getByRole('button', { name: /Camera:/ })).toHaveCount(0);
  await expect(
    shop.locator('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'),
  ).toHaveCount(0);
  await expect(page.getByRole('banner')).toHaveCount(0);
  await expect(page.locator('.taskbar')).toHaveCount(0);
});

test('development controls remain hidden when the dev flag is not enabled', async ({ page }) => {
  for (const query of ['?dev=0', '?dev=true', '?other=1']) {
    await page.goto(`/${query}`);
    await expect(page.getByRole('main', { name: 'Talent.OS Screen' })).toBeVisible();
    await expect(page.getByRole('button', { name: /Camera:/ })).toHaveCount(0);
  }
});

test('scales the Screen uniformly and keeps the Shop 300px wide', async ({ page }) => {
  const viewports = [
    { width: 1600, height: 900 },
    { width: 1280, height: 800 },
  ];

  await page.setViewportSize(viewports[0]!);
  await page.goto('/');

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await expect
      .poll(async () => (await page.locator('[data-screen-composition]').boundingBox())?.width)
      .toBeCloseTo(Math.min(viewport.width - 300, (viewport.height * 1440) / 900), 0);

    const composition = await page.locator('[data-screen-composition]').boundingBox();
    const shop = await page.getByRole('complementary', { name: 'Shop' }).boundingBox();
    const viewportSize = page.viewportSize();
    const visibleContent = await Promise.all([
      page.getByRole('region', { name: 'Vacancy' }).boundingBox(),
      page.getByRole('article', { name: 'Current application' }).boundingBox(),
      page.getByRole('list', { name: 'Reason choices' }).boundingBox(),
    ]);

    expect(composition).not.toBeNull();
    expect(viewportSize).not.toBeNull();
    expect(composition!.width / composition!.height).toBeCloseTo(1440 / 900, 2);
    expect(composition!.x).toBeGreaterThanOrEqual(0);
    expect(composition!.y).toBeGreaterThanOrEqual(0);
    expect(composition!.x + composition!.width).toBeLessThanOrEqual(
      viewportSize!.width - 300 + 0.1,
    );
    expect(composition!.y + composition!.height).toBeLessThanOrEqual(viewportSize!.height + 0.1);
    expect(shop?.width).toBe(300);
    for (const box of visibleContent) {
      expect(box).not.toBeNull();
      expect(box!.x).toBeGreaterThanOrEqual(composition!.x);
      expect(box!.y).toBeGreaterThanOrEqual(composition!.y);
      expect(box!.x + box!.width).toBeLessThanOrEqual(composition!.x + composition!.width + 0.1);
      expect(box!.y + box!.height).toBeLessThanOrEqual(composition!.y + composition!.height + 0.1);
    }
  }
});

test('loads the Sans, Serif, and Mono font roles locally', async ({ page }) => {
  const externalFontRequests: string[] = [];
  page.on('request', (request) => {
    if (/fonts\.(googleapis|gstatic)\.com/.test(request.url())) {
      externalFontRequests.push(request.url());
    }
  });

  await page.goto('/');

  const fontRoles = await page.locator('[data-screen-composition]').evaluate((screen) => {
    const sans = getComputedStyle(screen).fontFamily;
    const serif = getComputedStyle(screen.querySelector('blockquote')!).fontFamily;
    const mono = getComputedStyle(screen.querySelector('header p')!).fontFamily;

    return { sans, serif, mono };
  });
  const fontsLoaded = await page.evaluate(async () => {
    await document.fonts.ready;
    return ['IBM Plex Sans Variable', 'IBM Plex Serif', 'IBM Plex Mono'].map((family) =>
      Array.from(document.fonts).some(
        (face) => face.family.replaceAll('"', '') === family && face.status === 'loaded',
      ),
    );
  });

  expect(fontRoles.sans).toContain('IBM Plex Sans');
  expect(fontRoles.serif).toContain('IBM Plex Serif');
  expect(fontRoles.mono).toContain('IBM Plex Mono');
  expect(fontsLoaded).toEqual([true, true, true]);
  expect(externalFontRequests).toEqual([]);
});

test('development query enables the camera toggle', async ({ page }) => {
  await page.goto('/?dev=1');
  const stage = page.locator('[data-camera]');

  await expect(stage).toHaveAttribute('data-camera', 'A');
  await page.getByRole('button', { name: 'Camera: A' }).click();
  await expect(stage).toHaveAttribute('data-camera', 'B');
  await expect
    .poll(async () => (await page.locator('[data-screen-composition]').boundingBox())?.width ?? 0)
    .toBeLessThan(800);

  const composition = await page.locator('[data-screen-composition]').boundingBox();
  const shop = await page.getByRole('complementary', { name: 'Shop' }).boundingBox();

  expect(composition).not.toBeNull();
  expect(composition!.width).toBeLessThan(800);
  expect(composition!.width / composition!.height).toBeCloseTo(1440 / 900, 2);
  expect(shop?.width).toBe(300);
});
