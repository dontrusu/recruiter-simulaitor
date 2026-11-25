import { expect, test } from '@playwright/test';

test('a preset uses a temporary run and camera changes preserve it', async ({ page }) => {
  await page.goto('/?dev=1');
  const application = page.getByRole('article', { name: 'Current application' });
  await page.getByRole('button', { name: 'Reject', exact: true }).click();
  const playerApplication = await application.innerText();
  await page.getByLabel('Composition preset').selectOption('mid');
  await expect(page.getByTestId('counter-credits')).toHaveText('0000');
  await page.getByRole('button', { name: 'Reject', exact: true }).click();
  await page.getByRole('button', { name: 'Camera: Screen' }).click();
  await expect(page.getByTestId('counter-credits')).toHaveText('0001');
  await page.getByLabel('Composition preset').selectOption('start');
  await expect(application).toHaveText(playerApplication, { useInnerText: true });
  await expect(page.getByTestId('counter-credits')).toHaveText('0001');
  await expect(page.getByTestId('counter-rejected')).toHaveText('1');
});

test('Taskbar brings an open preset window forward using the keyboard', async ({ page }) => {
  await page.goto('/?dev=1');
  await page.getByLabel('Composition preset').selectOption('chaos');
  const taskbar = page.getByRole('navigation', { name: 'Taskbar' });
  const button = taskbar.getByRole('button', { name: 'Calm Corner' });
  await button.focus();
  await page.keyboard.press('Enter');
  await expect(button).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('complementary', { name: 'Calm Corner' })).toBeVisible();
  await expect(taskbar.getByRole('button')).toHaveCount(8);
});
