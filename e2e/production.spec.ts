import { test, expect } from '@playwright/test';
test('production starts clean and excludes development controls and bridge', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  const response = await page.goto('http://127.0.0.1:4173/?dev=1&seed=should-be-ignored');
  expect(response?.ok()).toBe(true);
  await expect(page.getByRole('heading', { name: 'Someone’s next chapter.' })).toBeVisible();
  await expect(page.locator('.dev-panel')).toHaveCount(0);
  expect(await page.evaluate(() => Object.hasOwn(window, '__talentStore'))).toBe(false);
  const reject = page.getByRole('button', { name: /Reject candidate/ });
  for (let i = 0; i < 3; i++) await reject.click();
  await page.getByRole('button', { name: 'Install · 3 EC', exact: true }).click();
  await expect(page.getByText('ATS MATCH', { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText('ATS MATCH', { exact: true })).toHaveCount(0);
  for (const ending of ['break', 'burnout', 'corporate']) {
    const photo = await page.request.get(`http://127.0.0.1:4173/endings/${ending}.jpg`);
    expect(photo.ok()).toBe(true);
    expect(photo.headers()['content-type']).toContain('image/jpeg');
  }
  expect(errors).toEqual([]);
});
