import { expect, test } from '@playwright/test';

test('plays precise and both generic Reasons, cycles Candidates, and resets on reload', async ({
  page,
}) => {
  await page.goto('/');
  const application = page.getByRole('article', { name: 'Current application' });
  const vacancy = page.getByRole('region', { name: 'Vacancy' });
  const vacancyText = await vacancy.innerText();
  const credits = page
    .locator('dl > div')
    .filter({ has: page.getByText('Credits', { exact: true }) })
    .locator('dd');
  const rejected = page
    .locator('dl > div')
    .filter({ has: page.getByText('Rejected', { exact: true }) })
    .locator('dd');
  await expect(credits).toHaveText('0000');
  await expect(rejected).toHaveText('0');
  await expect(application).toContainText('Oleg Marchenko');
  await page.getByRole('button', { name: 'Short of 4 years of React +12' }).click();
  await expect(application).toContainText('Marta Kovalenko');
  await expect(credits).toHaveText('0012');
  await expect(rejected).toHaveText('1');
  await expect(page.getByRole('status')).toHaveText(
    'Rejection recorded. +12 EC. Next Candidate: Marta Kovalenko.',
  );
  await expect(page.getByRole('status')).toHaveAttribute('aria-live', 'polite');
  await page.getByRole('button', { name: 'Not a culture fit +3' }).click();
  await expect(application).toContainText('Danylo Melnyk');
  await expect(credits).toHaveText('0015');
  await expect(rejected).toHaveText('2');
  await page.getByRole('button', { name: 'Let’s circle back +3' }).click();
  await expect(application).toContainText('Oleg Marchenko');
  await expect(credits).toHaveText('0018');
  await expect(rejected).toHaveText('3');
  await expect(vacancy).toHaveText(vacancyText, { useInnerText: true });
  const shop = page.getByRole('complementary', { name: 'Shop' });
  await expect(shop.locator('button, a, input, [tabindex]')).toHaveCount(0);
  await shop.getByRole('heading', { name: 'Smart Reject' }).click();
  await expect(credits).toHaveText('0018');
  await expect(rejected).toHaveText('3');
  await page.reload();
  await expect(credits).toHaveText('0000');
  await expect(rejected).toHaveText('0');
  await expect(application).toContainText('Oleg Marchenko');
  await expect(page.getByRole('status')).toBeEmpty();
});

test('Tab, Enter and Space keep focus on native Reason buttons with visible focus', async ({
  page,
  browserName,
}) => {
  await page.goto('/');
  const reasons = page.getByRole('list', { name: 'Reason choices' }).getByRole('button');
  // macOS WebKit uses Option+Tab to include buttons with its default keyboard settings.
  // https://github.com/microsoft/playwright/issues/41808
  const tab = browserName === 'webkit' && process.platform === 'darwin' ? 'Alt+Tab' : 'Tab';
  await expect(reasons.nth(0)).toBeVisible();
  await page.keyboard.press(tab);
  await expect(reasons.nth(0)).toBeFocused();
  const focusStyle = await reasons.nth(0).evaluate((button) => ({
    ring: getComputedStyle(button).boxShadow,
    font: getComputedStyle(button).fontFamily,
  }));
  expect(focusStyle.ring).not.toBe('none');
  expect(focusStyle.font).toContain('IBM Plex Sans');
  const colors = await reasons.evaluateAll((buttons) => {
    const precise = getComputedStyle(buttons[0]!);
    const generic = getComputedStyle(buttons[1]!);
    return {
      preciseBackground: precise.backgroundColor,
      genericBackground: generic.backgroundColor,
      genericText: generic.color,
      genericBorder: generic.borderTopStyle,
    };
  });
  expect(colors.preciseBackground).toBe(colors.genericText);
  expect(colors.preciseBackground).not.toBe(colors.genericBackground);
  expect(colors.genericBorder).toBe('solid');
  await page.keyboard.press('Enter');
  await expect(reasons.nth(0)).toBeFocused();
  await expect(page.getByRole('status')).toContainText('+12 EC. Next Candidate: Marta Kovalenko.');
  await page.keyboard.press(tab);
  await expect(reasons.nth(1)).toBeFocused();
  await page.keyboard.press('Space');
  await expect(reasons.nth(1)).toBeFocused();
  await expect(page.getByRole('status')).toContainText('+3 EC. Next Candidate: Danylo Melnyk.');
  await page.keyboard.press(tab);
  await expect(reasons.nth(2)).toBeFocused();
  await page.keyboard.press('Space');
  await expect(reasons.nth(2)).toBeFocused();
  await expect(page.getByRole('status')).toContainText('+3 EC. Next Candidate: Oleg Marchenko.');
});
