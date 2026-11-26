import { expect, test, type Page } from '@playwright/test';

async function choosePreset(page: Page, preset: 'start' | 'mid' | 'chaos') {
  await page.getByRole('button', { name: 'Макет' }).click();
  await page.getByLabel('Composition preset').selectOption(preset);
  await page.getByRole('button', { name: 'Макет' }).click();
}

test('a preset uses a temporary run and camera changes preserve it', async ({ page }) => {
  await page.goto('/?dev=1');
  const application = page.getByRole('article', { name: 'Current application' });
  await page.getByRole('button', { name: 'Reject', exact: true }).click();
  const playerApplication = await application.innerText();
  await choosePreset(page, 'mid');
  await expect(page.getByTestId('counter-credits')).toHaveText('0');
  await page.getByRole('button', { name: 'Reject', exact: true }).click();
  await page.getByRole('button', { name: 'Camera: Screen' }).click();
  await expect(page.getByTestId('counter-credits')).toHaveText('1');
  await choosePreset(page, 'start');
  await expect(application).toHaveText(playerApplication, { useInnerText: true });
  await expect(page.getByTestId('counter-credits')).toHaveText('1');
  await expect(page.getByTestId('counter-rejected')).toHaveText('1');
});

test('Taskbar brings an open preset window forward using the keyboard', async ({ page }) => {
  await page.goto('/?dev=1');
  await choosePreset(page, 'chaos');
  const taskbar = page.getByRole('navigation', { name: 'Taskbar' });
  const button = taskbar.getByRole('button', { name: 'Calm Corner' });
  await button.focus();
  await page.keyboard.press('Enter');
  await expect(button).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('complementary', { name: 'Calm Corner' })).toBeVisible();
  await expect(taskbar.getByRole('button')).toHaveCount(8);
});

test('Room chaos windows overlap the Application edges', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/?dev=1');
  await choosePreset(page, 'chaos');
  await page.getByRole('button', { name: 'Camera: Screen' }).click();

  const application = (await page
    .getByRole('article', { name: 'Current application' })
    .boundingBox())!;
  const left = (await page.getByRole('complementary', { name: 'Lo-Fi' }).boundingBox())!;
  const right = (await page.getByRole('complementary', { name: '#wins' }).boundingBox())!;

  expect(left.x + left.width).toBeGreaterThan(application.x);
  expect(right.x).toBeLessThan(application.x + application.width);
});
