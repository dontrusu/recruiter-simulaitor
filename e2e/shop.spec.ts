import { expect, test } from '@playwright/test';

test('the complete Shop can be browsed by keyboard without purchase controls', async ({ page }) => {
  await page.goto('/');
  const shop = page.getByRole('region', { name: 'Shop' });
  const row = shop.getByRole('list', { name: 'Upgrade catalog' });
  await expect(row.getByRole('listitem')).toHaveCount(26);
  await expect(shop.getByRole('button')).toHaveCount(0);
  await expect(shop).not.toContainText(/\b\d+\s*(EC|Credits)\b/i);
  await row.focus();
  await expect(row).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect.poll(() => row.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
  await page.keyboard.press('End');
  await expect(row.getByText('Re: Your Application')).toBeInViewport();
});

test('Shop cards fit the handoff width without clipping their content', async ({ page }) => {
  await page.goto('/');
  const cards = page.getByRole('list', { name: 'Upgrade catalog' }).getByRole('listitem');
  const geometry = await cards.evaluateAll((items) =>
    items.map((item) => ({
      width: item instanceof HTMLElement ? item.offsetWidth : 0,
      fits: item.scrollHeight <= item.clientHeight,
    })),
  );
  expect(geometry).toHaveLength(26);
  expect(geometry.every(({ width, fits }) => width === 114 && fits)).toBe(true);
});

test('the starting Taskbar shows local time and has no open windows', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-11-25T12:34:59Z') });
  await page.clock.pauseAt(new Date('2026-11-25T12:34:59Z'));
  await page.goto('/');
  const taskbar = page.getByRole('navigation', { name: 'Taskbar' });
  await expect(
    taskbar.getByRole('group', { name: 'Open windows' }).getByRole('button'),
  ).toHaveCount(0);
  const clock = taskbar.getByLabel('Local time');
  await expect(clock).toHaveAttribute('datetime', '2026-11-25T12:34:59.000Z');
  await page.clock.fastForward('00:02');
  await expect(clock).toHaveAttribute('datetime', '2026-11-25T12:35:01.000Z');
});
