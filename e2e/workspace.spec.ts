import { expect, test } from '@playwright/test';

test('shows the review and Shop on a fresh load', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('region', { name: 'Vacancy' })).toBeVisible();
  await expect(page.getByRole('article', { name: 'Current application' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Reject', exact: true })).toBeVisible();
  const shop = page.getByRole('complementary', { name: 'Shop' });
  await expect(shop).toBeVisible();
  await expect(shop.getByRole('article').first()).toBeVisible();
});

test('Shop previews cannot be activated', async ({ page }) => {
  await page.goto('/');
  const shop = page.getByRole('complementary', { name: 'Shop' });
  const credits = page.getByTestId('counter-credits');
  const rejected = page.getByTestId('counter-rejected');
  await expect(
    shop.locator('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'),
  ).toHaveCount(0);
  const initialCredits = await credits.innerText();
  const initialRejected = await rejected.innerText();
  await shop.getByRole('article').first().click();
  await expect(credits).toHaveText(initialCredits);
  await expect(rejected).toHaveText(initialRejected);
});

test('fresh Screen has no outer banner', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('banner')).toHaveCount(0);
});

for (const query of ['', '?dev=0', '?dev=true', '?other=1']) {
  test(`camera control is hidden for ${query || 'a fresh load'}`, async ({ page }) => {
    await page.goto(`/${query}`);
    await expect(page.getByRole('button', { name: /Camera:/ })).toHaveCount(0);
  });
}

for (const viewport of [
  { width: 1600, height: 900 },
  { width: 1280, height: 800 },
]) {
  test(`fits Screen beside the fixed Shop at ${viewport.width}×${viewport.height}`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto('/');
    const screen = page.getByRole('main', { name: 'Talent.OS Screen' });
    const shop = page.getByRole('complementary', { name: 'Shop' });

    await expect
      .poll(async () => (await screen.boundingBox())?.width)
      .toBeCloseTo(Math.min(viewport.width - 300, (viewport.height * 1440) / 900), 0);
    const screenBox = (await screen.boundingBox())!;
    const shopBox = (await shop.boundingBox())!;
    expect(screenBox.width / screenBox.height).toBeCloseTo(1440 / 900, 2);
    expect(screenBox.x).toBeGreaterThanOrEqual(0);
    expect(screenBox.y).toBeGreaterThanOrEqual(0);
    expect(screenBox.x + screenBox.width).toBeLessThanOrEqual(shopBox.x + 0.1);
    expect(screenBox.y + screenBox.height).toBeLessThanOrEqual(viewport.height + 0.1);
    expect(shopBox.width).toBe(300);
  });

  test(`review content fits inside Screen at ${viewport.width}×${viewport.height}`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto('/');
    const screen = page.getByRole('main', { name: 'Talent.OS Screen' });
    await expect
      .poll(async () => (await screen.boundingBox())?.width)
      .toBeCloseTo(Math.min(viewport.width - 300, (viewport.height * 1440) / 900), 0);
    const screenBox = (await screen.boundingBox())!;
    for (const content of [
      page.getByRole('region', { name: 'Vacancy' }),
      page.getByRole('article', { name: 'Current application' }),
      page.getByRole('region', { name: 'Decision' }),
    ]) {
      const box = (await content.boundingBox())!;
      expect(box.x).toBeGreaterThanOrEqual(screenBox.x);
      expect(box.y).toBeGreaterThanOrEqual(screenBox.y);
      expect(box.x + box.width).toBeLessThanOrEqual(screenBox.x + screenBox.width + 0.1);
      expect(box.y + box.height).toBeLessThanOrEqual(screenBox.y + screenBox.height + 0.1);
    }
  });
}

test('uses the local Sans and Mono fonts and the editorial serif role', async ({ page }) => {
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
    return ['IBM Plex Sans Variable', 'IBM Plex Mono'].map((family) =>
      Array.from(document.fonts).some(
        (face) => face.family.replaceAll('"', '') === family && face.status === 'loaded',
      ),
    );
  });

  expect(fontRoles.sans).toContain('IBM Plex Sans');
  expect(fontRoles.serif).toContain('Georgia');
  expect(fontRoles.mono).toContain('IBM Plex Mono');
  expect(fontsLoaded).toEqual([true, true]);
  expect(externalFontRequests).toEqual([]);
});

test('switching to Room preserves the run', async ({ page }) => {
  await page.goto('/?dev=1');
  const application = page.getByRole('article', { name: 'Current application' });
  const vacancy = page.getByRole('region', { name: 'Vacancy' });
  const credits = page.getByTestId('counter-credits');
  const rejected = page.getByTestId('counter-rejected');

  await page.getByRole('button', { name: 'Reject', exact: true }).click();
  await expect(credits).toHaveText('0001');
  await expect(rejected).toHaveText('1');
  const applicationText = await application.innerText();
  const vacancyText = await vacancy.innerText();

  await page.getByRole('button', { name: 'Camera: Screen', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Camera: Room', exact: true })).toBeVisible();
  await expect(application).toHaveText(applicationText, { useInnerText: true });
  await expect(vacancy).toHaveText(vacancyText, { useInnerText: true });
  await expect(credits).toHaveText('0001');
  await expect(rejected).toHaveText('1');
});

test('a Rejection in Room updates the same run shown in Screen', async ({ page }) => {
  await page.goto('/?dev=1');
  const application = page.getByRole('article', { name: 'Current application' });
  const initialApplication = await application.innerText();
  await page.getByRole('button', { name: 'Camera: Screen', exact: true }).click();
  await page.getByRole('button', { name: 'Reject', exact: true }).click();
  await expect(application).not.toHaveText(initialApplication, { useInnerText: true });
  const nextApplication = await application.innerText();

  await page.getByRole('button', { name: 'Camera: Room', exact: true }).click();
  await expect(application).toHaveText(nextApplication, { useInnerText: true });
  await expect(page.getByTestId('counter-credits')).toHaveText('0001');
  await expect(page.getByTestId('counter-rejected')).toHaveText('1');
});

for (const size of [
  { width: 1900, height: 900, roomWidth: 1600, screenWidth: 800 },
  { width: 1280, height: 800, roomWidth: 980, screenWidth: 490 },
  { width: 1100, height: 700, roomWidth: 800, screenWidth: 400 },
  { width: 3500, height: 2000, roomWidth: 3200, screenWidth: 1600 },
]) {
  test(`fits Room beside the Shop at ${size.width}×${size.height}`, async ({ page }) => {
    await page.setViewportSize({ width: size.width, height: size.height });
    await page.goto('/?dev=1');
    await page.getByRole('button', { name: 'Camera: Screen', exact: true }).click();
    const room = page.getByRole('region', { name: 'Room', exact: true });
    const screen = page.getByRole('main', { name: 'Talent.OS Screen' });
    const shop = page.getByRole('complementary', { name: 'Shop' });

    await expect.poll(async () => (await room.boundingBox())?.width).toBeCloseTo(size.roomWidth, 0);
    await expect
      .poll(async () => (await screen.boundingBox())?.width)
      .toBeCloseTo(size.screenWidth, 0);
    const roomBox = (await room.boundingBox())!;
    const screenBox = (await screen.boundingBox())!;
    const shopBox = (await shop.boundingBox())!;
    expect(roomBox.width / roomBox.height).toBeCloseTo(1600 / 900, 4);
    expect(screenBox.width / screenBox.height).toBeCloseTo(800 / 500, 4);
    expect(roomBox.x).toBeGreaterThanOrEqual(-0.1);
    expect(roomBox.y).toBeGreaterThanOrEqual(-0.1);
    expect(roomBox.x + roomBox.width).toBeLessThanOrEqual(shopBox.x + 0.1);
    expect(roomBox.y + roomBox.height).toBeLessThanOrEqual(size.height + 0.1);
    expect(shopBox).toMatchObject({ x: size.width - 300, y: 0, width: 300, height: size.height });
  });
}

test('resizing keeps the Screen inside Room and the Shop fixed', async ({ page }) => {
  await page.setViewportSize({ width: 1900, height: 900 });
  await page.goto('/?dev=1');
  await page.getByRole('button', { name: 'Camera: Screen', exact: true }).click();
  const room = page.getByRole('region', { name: 'Room', exact: true });
  const screen = page.getByRole('main', { name: 'Talent.OS Screen' });
  const shop = page.getByRole('complementary', { name: 'Shop' });
  await expect.poll(async () => (await room.boundingBox())?.width).toBeCloseTo(1600, 0);

  await page.setViewportSize({ width: 1280, height: 800 });
  await expect.poll(async () => (await room.boundingBox())?.width).toBeCloseTo(980, 0);
  const roomBox = (await room.boundingBox())!;
  const screenBox = (await screen.boundingBox())!;
  expect(screenBox.x).toBeGreaterThanOrEqual(roomBox.x);
  expect(screenBox.y).toBeGreaterThanOrEqual(roomBox.y);
  expect(screenBox.x + screenBox.width).toBeLessThanOrEqual(roomBox.x + roomBox.width + 0.1);
  expect(screenBox.y + screenBox.height).toBeLessThanOrEqual(roomBox.y + roomBox.height + 0.1);
  expect((await shop.boundingBox())?.width).toBe(300);
});
