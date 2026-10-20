import type { useGame } from '../src/store';
declare global {
  interface Window {
    __talentStore: typeof useGame;
  }
}
import { test, expect, type Page } from '@playwright/test';
async function fixture(page: Page, stop: string) {
  await page.evaluate(async (stop) => {
    const engine = await import('../src/game/engine.ts');
    let game = engine.createGame('browser');
    for (let i = 0; i < 35; i++) {
      const offer = engine.offers(game)[0];
      game = engine.purchase({ ...game, credits: offer.cost }, offer.id);
      if (offer.id === stop) break;
    }
    window.__talentStore.setState({ game: { ...game, events: [], credits: 12000 } });
  }, stop);
}
test.beforeEach(async ({ page }) => {
  await page.goto('/?dev=1&seed=browser');
});

test('opens with a quiet review, no decorative windows, and reveals a playable investment', async ({
  page,
}) => {
  await expect(page.getByRole('heading', { name: 'Just a few résumés.' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Operations playground' })).toBeVisible();
  await expect(page.getByAltText(/quiet, sunlit office/)).toBeVisible();
  await expect(page.locator('.desktop-widgets,.desktop-surface,.active-work-window')).toHaveCount(
    0,
  );
  const reject = page.getByRole('button', { name: /Reject candidate/ });
  await reject.focus();
  await page.keyboard.press('Enter');
  for (let i = 0; i < 3; i++) await reject.click();
  await page.getByRole('button', { name: 'Install · 3 EC', exact: true }).click();
  await expect(page.getByText('ATS MATCH', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: /Build your first conveyor/ }).click();
  await expect(
    page.getByRole('button', { name: 'Buy Dispatch Conveyor', exact: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Mute sound', exact: true }).click();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Unmute sound', exact: true })).toBeVisible();
  await expect(page.getByText('ATS MATCH', { exact: true })).toHaveCount(0);
});

test('long profiles keep the decision controls in a stable position', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  const reject = page.getByRole('button', { name: /Reject candidate/ });
  const before = await reject.boundingBox();
  await page.evaluate(() => {
    const store = window.__talentStore;
    const game = store.getState().game;
    store.setState({
      game: {
        ...game,
        candidate: { ...game.candidate, summary: 'A longer profile. '.repeat(100) },
      },
    });
  });
  expect(Math.abs((await reject.boundingBox())!.y - before!.y)).toBeLessThan(1);
});

test('optional requests live in an expandable inbox instead of covering the game', async ({
  page,
}) => {
  await fixture(page, 'U21');
  await page.evaluate(() => window.__talentStore.getState().dev('event:choice'));
  const inbox = page.getByRole('region', { name: 'Active work' });
  await expect(inbox).toBeVisible();
  await expect(inbox.locator('.event-card')).toHaveCount(0);
  await inbox.getByRole('button', { name: /Incoming requests/ }).click();
  await expect(inbox.locator('.event-card')).toHaveCount(1);
  await inbox.locator('.event-card').getByRole('button').first().click();
  await expect(inbox).toHaveCount(0);
});

test('an appeal pauses candidate automation and resolves through the human review', async ({
  page,
}) => {
  await fixture(page, 'U21');
  await page.evaluate(() => window.__talentStore.getState().dev('event:exception'));
  await expect(page.getByRole('button', { name: /Reject candidate/ })).toBeDisabled();
  await page.getByRole('button', { name: /One case needs a human decision/ }).click();
  await page.locator('.event-card.blocking').getByRole('button').first().click();
  await expect(page.getByRole('button', { name: /Reject candidate/ })).toBeEnabled();
  await expect
    .poll(() => page.evaluate(() => window.__talentStore.getState().game.automaticRejects))
    .toBeGreaterThan(0);
});

test('interview confirmation pauses time, traps focus and pays the delayed callback', async ({
  page,
}) => {
  await fixture(page, 'U12');
  await page.evaluate(() => {
    const store = window.__talentStore;
    const game = store.getState().game;
    store.setState({
      game: {
        ...game,
        rejectionStreak: 25,
        candidate: { ...game.candidate, interviewEligible: true },
      },
    });
  });
  await page.getByRole('button', { name: /Schedule interview/ }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Shift+Tab');
  expect(await page.evaluate(() => !!document.activeElement?.closest('dialog'))).toBe(true);
  const elapsed = await page.locator('.session-clock').textContent();
  await page.waitForTimeout(1100);
  expect(await page.locator('.session-clock').textContent()).toBe(elapsed);
  await page.getByRole('button', { name: 'Confirm', exact: true }).click();
  await expect(page.locator('.streak-ledger')).toContainText('0 rejection streak');
  for (let i = 0; i < 4; i++) await page.getByRole('button', { name: /Reject candidate/ }).click();
  await expect(page.locator('.activity')).toContainText('Interview callback');
});

test('break follows a real handover and restart clears the world', async ({ page }) => {
  await fixture(page, 'U33');
  const leave = page.getByRole('button', { name: /^Take a Break/ });
  await expect(leave).toBeDisabled();
  await page
    .getByRole('button', { name: 'Restore candidate', exact: true })
    .click({ timeout: 6000 });
  await leave.click();
  await page.getByRole('button', { name: 'Confirm', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'You took a break.' })).toBeVisible();
  await page.getByRole('button', { name: 'Start a fresh session' }).click();
  await expect(page.getByRole('heading', { name: 'Just a few résumés.' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Operations playground' })).toBeVisible();
  await expect(page.getByAltText(/quiet, sunlit office/)).toBeVisible();
});

test('rejection into burnout freezes the world and skips a rejection animation', async ({
  page,
}) => {
  await fixture(page, 'U33');
  await page.evaluate(() => {
    const store = window.__talentStore;
    store.setState({ game: { ...store.getState().game, latePressure: 27.9 } });
  });
  await page.getByRole('button', { name: /Reject candidate/ }).click();
  await expect(page.getByRole('heading', { name: 'Capacity exceeded.' })).toBeVisible();
  await expect(page.locator('.reject-ghost')).toHaveCount(0);
  const summary = await page.locator('.summary-stats').textContent();
  await page.waitForTimeout(1000);
  expect(await page.locator('.summary-stats').textContent()).toBe(summary);
});

test('corporate ending requires every handover and explicit confirmation', async ({ page }) => {
  await fixture(page, 'U35');
  const enable = page.getByRole('button', { name: /Enable Autonomous/ });
  await expect(enable).toBeDisabled();
  await page
    .getByRole('button', { name: 'Restore candidate', exact: true })
    .click({ timeout: 6000 });
  for (let i = 0; i < 2; i++) {
    await page.evaluate(() => window.__talentStore.getState().tick(21000));
    const blockers = page.locator('.event-card.blocking button');
    if (await blockers.count()) await blockers.first().click();
    if (i === 0)
      await page.getByRole('button', { name: 'Record actual capacity', exact: true }).click();
    else
      for (let j = 0; j < 3; j++)
        await page.getByRole('button', { name: /Reject candidate/ }).click();
  }
  await page.evaluate(() => window.__talentStore.getState().tick(80000));
  await expect(enable).toBeEnabled();
  await enable.click();
  await expect(page.getByRole('dialog')).toContainText('8,000');
  await page.getByRole('button', { name: 'Confirm', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Your work here is done.' })).toBeVisible();
});
