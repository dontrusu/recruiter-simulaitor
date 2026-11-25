import { expect, test } from '@playwright/test';

test('the starting review is centered on the Screen with the Vacancy above the Application', async ({
  page,
}) => {
  await page.goto('/');
  const screen = await page.getByRole('main', { name: 'Talent.OS Screen' }).boundingBox();
  const vacancy = await page.getByRole('region', { name: 'Vacancy' }).boundingBox();
  const application = await page
    .getByRole('article', { name: 'Current application' })
    .boundingBox();
  expect(screen).not.toBeNull();
  expect(vacancy).not.toBeNull();
  expect(application).not.toBeNull();
  expect(
    Math.abs(application!.x + application!.width / 2 - (screen!.x + screen!.width / 2)),
  ).toBeLessThan(3);
  expect(vacancy!.y + vacancy!.height).toBeLessThanOrEqual(application!.y + 2);
});
