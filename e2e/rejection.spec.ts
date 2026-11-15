import { expect, test } from '@playwright/test';
import { applications } from '../src/content/screen-content';

for (const reason of [
  { kind: 'precise', index: 0, credits: '0012', reward: '+12 EC' },
  { kind: 'generic', index: 0, credits: '0003', reward: '+3 EC' },
  { kind: 'generic', index: 1, credits: '0003', reward: '+3 EC' },
]) {
  test(`${reason.kind} Reason ${reason.index + 1} advances the Application and awards Credits`, async ({
    page,
  }) => {
    await page.goto('/');
    const application = page.getByRole('article', { name: 'Current application' });
    const vacancy = page.getByRole('region', { name: 'Vacancy' });
    const credits = page.getByTestId('counter-credits');
    const rejected = page.getByTestId('counter-rejected');
    const status = page.getByRole('status');
    const vacancyText = await vacancy.innerText();
    const firstApplication = await application.innerText();

    await expect(credits).toHaveText('0000');
    await expect(rejected).toHaveText('0');
    await page.getByTestId(`reason-${reason.kind}`).nth(reason.index).click();
    await expect(application).not.toHaveText(firstApplication, { useInnerText: true });
    await expect(credits).toHaveText(reason.credits);
    await expect(rejected).toHaveText('1');
    await expect(status).toContainText(reason.reward);
    await expect(status).toHaveAttribute('aria-live', 'polite');
    const nextCandidate = await application.getByRole('heading').innerText();
    await expect(status).toContainText(nextCandidate);
    await expect(vacancy).toHaveText(vacancyText, { useInnerText: true });
  });
}

test('returns to the first Application after completing the sequence', async ({ page }) => {
  await page.goto('/');
  const application = page.getByRole('article', { name: 'Current application' });
  const firstApplication = await application.innerText();

  for (let i = 0; i < applications.length; i++) {
    const previousApplication = await application.innerText();
    await page.getByTestId('reason-generic').first().click();
    await expect(page.getByTestId('counter-rejected')).toHaveText(String(i + 1));
    await expect(application).not.toHaveText(previousApplication, { useInnerText: true });
  }
  await expect(application).toHaveText(firstApplication, { useInnerText: true });
});

test('reload starts a fresh run', async ({ page }) => {
  await page.goto('/');
  const application = page.getByRole('article', { name: 'Current application' });
  const credits = page.getByTestId('counter-credits');
  const rejected = page.getByTestId('counter-rejected');
  const status = page.getByRole('status');
  const firstApplication = await application.innerText();

  await page.getByTestId('reason-precise').click();
  await expect(application).not.toHaveText(firstApplication, { useInnerText: true });
  await expect(credits).toHaveText('0012');
  await expect(rejected).toHaveText('1');
  await expect(status).toContainText('+12 EC');
  await page.reload();
  await expect(credits).toHaveText('0000');
  await expect(rejected).toHaveText('0');
  await expect(application).toHaveText(firstApplication, { useInnerText: true });
  await expect(status).toBeEmpty();
});

test('Tab, Enter and Space keep focus on native Reason buttons', async ({ page, browserName }) => {
  await page.goto('/');
  const reasons = page.getByRole('list', { name: 'Reason choices' }).getByRole('button');
  // macOS WebKit uses Option+Tab to include buttons with its default keyboard settings.
  // https://github.com/microsoft/playwright/issues/41808
  const tab = browserName === 'webkit' && process.platform === 'darwin' ? 'Alt+Tab' : 'Tab';
  await expect(reasons.nth(0)).toBeVisible();
  await page.keyboard.press(tab);
  await expect(reasons.nth(0)).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(reasons.nth(0)).toBeFocused();
  await expect(page.getByRole('status')).toContainText('+12 EC');
  await expect(page.getByTestId('counter-rejected')).toHaveText('1');
  await page.keyboard.press(tab);
  await expect(reasons.nth(1)).toBeFocused();
  await page.keyboard.press('Space');
  await expect(reasons.nth(1)).toBeFocused();
  await expect(page.getByRole('status')).toContainText('+3 EC');
  await expect(page.getByTestId('counter-rejected')).toHaveText('2');
  await page.keyboard.press(tab);
  await expect(reasons.nth(2)).toBeFocused();
  await page.keyboard.press('Space');
  await expect(reasons.nth(2)).toBeFocused();
  await expect(page.getByRole('status')).toContainText('+3 EC');
  await expect(page.getByTestId('counter-rejected')).toHaveText('3');
});

test('Reason buttons have distinct styles and a focus indicator', async ({ page, browserName }) => {
  await page.goto('/');
  const reasons = page.getByRole('list', { name: 'Reason choices' }).getByRole('button');
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
});
