import { expect, test } from '@playwright/test';

test('shows the review and Shop on a fresh load', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('region', { name: 'Vacancy' })).toBeVisible();
  await expect(page.getByRole('article', { name: 'Current application' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Reject', exact: true })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Shop' })).toBeVisible();
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

test('reduced motion switches to Room immediately', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1600, height: 900 });
  await page.goto('/?dev=1');
  await page.getByRole('button', { name: 'Camera: Screen' }).click();

  const room = page.getByRole('region', { name: 'Room', exact: true });
  const width = await room.evaluate((element) => element.getBoundingClientRect().width);
  expect(width).toBeCloseTo(1600, 0);
});

test('fits the whole Screen composition on a narrow viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const screen = page.getByRole('main', { name: 'Talent.OS Screen' });
  const box = (await screen.boundingBox())!;
  expect(box.width).toBeCloseTo(390, 0);
  expect(box.height).toBeCloseTo((390 * 1000) / 1120, 0);
  expect(box.x).toBeCloseTo(0, 0);
  expect(box.y).toBeCloseTo((844 - box.height) / 2, 0);
});

for (const viewport of [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
]) {
  test(`fits Room and its Screen at ${viewport.width}×${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/?dev=1');
    await page.getByRole('button', { name: 'Camera: Screen' }).click();
    const room = (await page.getByRole('region', { name: 'Room', exact: true }).boundingBox())!;
    const screen = (await page.getByRole('main', { name: 'Talent.OS Screen' }).boundingBox())!;
    const scale = Math.min(viewport.width / 1600, viewport.height / 900);
    expect(room.width).toBeCloseTo(1600 * scale, 0);
    expect(room.height).toBeCloseTo(900 * scale, 0);
    expect(screen.x - room.x).toBeCloseTo(400 * scale, 0);
    expect(screen.y - room.y).toBeCloseTo(200 * scale, 0);
    expect(screen.width).toBeCloseTo(800 * scale, 0);
    expect(screen.height).toBeCloseTo(500 * scale, 0);
  });
}

for (const viewport of [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
]) {
  test(`review controls remain above Taskbar at ${viewport.width}×${viewport.height}`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto('/');
    const reject = (await page.getByRole('button', { name: /^Reject/ }).boundingBox())!;
    const taskbar = (await page.getByRole('navigation', { name: 'Taskbar' }).boundingBox())!;
    expect(reject.y + reject.height).toBeLessThanOrEqual(taskbar.y);
  });
}
