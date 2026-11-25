import { expect, test } from '@playwright/test';

test('Reject advances and repeats Applications while preserving counters and focus', async ({
  page,
}) => {
  await page.goto('/');
  const application = page.getByRole('article', { name: 'Current application' });
  const first = await application.getByRole('heading').innerText();
  const reject = page.getByRole('button', { name: 'Reject', exact: true });
  await reject.focus();
  for (let count = 1; count <= 3; count++) {
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('counter-rejected')).toHaveText(String(count));
    await expect(reject).toBeFocused();
  }
  await expect(page.getByTestId('counter-credits')).toHaveText('0003');
  await expect(application.getByRole('heading')).toHaveText(first);
  await expect(page.getByRole('status')).toHaveCount(0);
});

test('rapid actions all count and replace the previous feedback', async ({ page }) => {
  await page.goto('/');
  const reject = page.getByRole('button', { name: 'Reject', exact: true });
  await reject.focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Enter');
  await page.keyboard.press('Enter');
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('counter-rejected')).toHaveText('4');
  await expect(page.getByTestId('counter-credits')).toHaveText('0004');
  await expect(page.getByText('Rejection sent')).toHaveCount(1);
});

test('the interview explanation is available on focus and hover', async ({ page }) => {
  await page.goto('/');
  const invite = page.getByRole('button', { name: 'Invite to interview' });
  const tooltip = page.getByRole('tooltip');
  await expect(invite).toHaveAttribute('aria-disabled', 'true');
  await invite.focus();
  await expect(tooltip).toBeVisible();
  await expect(invite).toHaveAccessibleDescription(
    'The candidate does not meet the role requirements.',
  );
  await invite.blur();
  await invite.hover();
  await expect(tooltip).toBeVisible();
});

test('reduced motion omits rejection stamp and movement', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.getByRole('button', { name: 'Reject', exact: true }).click();
  await expect(page.getByText('Rejection sent')).toBeHidden();
  await expect(page.getByTestId('counter-rejected')).toHaveText('1');
});
