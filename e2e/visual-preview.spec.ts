import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('visual previews are independent and preserve the run across camera and presets', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/?dev=1');
  const screen = page.getByRole('main', { name: 'Talent.OS Screen' });
  const credits = page.getByTestId('counter-credits');
  await page.getByRole('button', { name: 'Reject', exact: true }).click();
  await expect(credits).toHaveText('1');

  await page.getByRole('button', { name: 'Макет' }).click();
  const colors = page.getByRole('button', { name: 'Перегляд: кольори' });
  const wallpaper = page.getByRole('button', { name: 'Перегляд: фон' });
  await expect(colors).toHaveAttribute('aria-pressed', 'false');
  await expect(wallpaper).toHaveAttribute('aria-pressed', 'false');
  await colors.click();
  await expect(colors).toHaveAttribute('aria-pressed', 'true');
  await expect(screen).toHaveCSS('background-color', 'rgb(241, 242, 255)');
  await expect(screen.locator('canvas')).toHaveCount(0);
  await wallpaper.click();
  await expect(wallpaper).toHaveAttribute('aria-pressed', 'true');
  await expect(screen.locator('canvas')).toBeVisible();
  const accessibility = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  expect(accessibility.violations).toEqual([]);
  await page.getByLabel('Composition preset').selectOption('chaos');
  await page.getByRole('button', { name: 'Макет' }).click();

  await page.getByRole('button', { name: 'Camera: Screen' }).click();
  await expect(screen).toHaveCSS('background-color', 'rgb(241, 242, 255)');
  await expect(screen.locator('canvas')).toBeVisible();
  await page.getByRole('button', { name: 'Макет' }).click();
  await page.getByLabel('Composition preset').selectOption('start');
  await expect(credits).toHaveText('1');
  await wallpaper.click();
  await expect(screen.locator('canvas')).toHaveCount(0);
  await expect(colors).toHaveAttribute('aria-pressed', 'true');
  await colors.click();
  await expect(screen).toHaveCSS('background-color', 'rgb(238, 237, 233)');
});

test('layout controls support keyboard and Escape', async ({ page }) => {
  await page.goto('/?dev=1');
  const trigger = page.getByRole('button', { name: 'Макет' });
  await trigger.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog', { name: 'Налаштування макета' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
});
