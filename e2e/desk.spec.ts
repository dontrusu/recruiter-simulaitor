import { test, expect, type Page } from '@playwright/test';
import type { DevAction, useGame } from '../src/store';
declare global {
  interface Window {
    __talentStore: typeof useGame;
  }
}
async function world(page: Page, era: DevAction = 'orbit') {
  await page.goto('/?dev=1&seed=world');
  await page.evaluate((era) => {
    const store = window.__talentStore;
    store.getState().dev(era);
    store.setState({ game: { ...store.getState().game, nextEventAt: 1e9, nextAppealAt: 1e9 } });
  }, era);
}
async function station(page: Page, name: string) {
  await page
    .getByRole('navigation', { name: 'Playable stations' })
    .getByRole('button', { name: new RegExp(name) })
    .click();
}

test('purchased machines can be upgraded and reveal different playable stations', async ({
  page,
}) => {
  await page.goto('/?dev=1&seed=shop');
  await page.evaluate(() => {
    window.__talentStore.getState().dev('planet');
  });
  await page.getByRole('button', { name: 'Workshop', exact: true }).click();
  await page.getByRole('button', { name: 'Upgrade Dispatch Conveyor', exact: true }).click();
  await expect(page.getByRole('navigation', { name: 'Playable stations' })).toContainText('Lv 2');
  await page.getByRole('button', { name: 'Buy Daylight Dividend', exact: true }).click();
  await expect(
    page.getByRole('button', { name: 'Upgrade Daylight Dividend', exact: true }),
  ).toBeDisabled();
  await expect(
    page.getByRole('button', { name: 'Buy Recruitment Probes', exact: true }),
  ).toHaveCount(0);
});

test('conveyor sorts by keyboard and swipe, paying a perfect batch once', async ({ page }) => {
  await world(page, 'department');
  await station(page, 'Dispatch line');
  await page.getByRole('button', { name: /Start batch/ }).click();
  for (let i = 0; i < 5; i++) {
    const card = page.getByRole('group', { name: 'Application on conveyor' });
    const signed = (await card.textContent())!.includes('HUMAN VERIFIED');
    if (i === 0) {
      const box = (await card.boundingBox())!;
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width / 2 + (signed ? 80 : -80), box.y + box.height / 2, {
        steps: 5,
      });
      await page.mouse.up();
    } else {
      await page.getByRole('group', { name: 'Conveyor sorting controls' }).focus();
      await page.keyboard.press(signed ? 'ArrowRight' : 'ArrowLeft');
    }
  }
  await expect(page.locator('.station-feedback')).toContainText('Perfect batch');
  expect(
    await page.evaluate(() => window.__talentStore.getState().game.income.operations),
  ).toBeGreaterThan(0);
  await expect(page.getByRole('button', { name: /Next batch in/ })).toBeDisabled();
});

test('coffee needs a held extraction and doubles production only on a good release', async ({
  page,
}) => {
  await world(page, 'department');
  await station(page, 'Coffee reactor');
  const brew = page.getByRole('button', { name: 'Hold to brew' });
  await brew.focus();
  await page.keyboard.down('Space');
  await page.waitForTimeout(2100);
  await page.keyboard.up('Space');
  await expect(page.locator('.station-feedback')).toContainText('Perfect extraction');
  expect(
    await page.evaluate(() => {
      const g = window.__talentStore.getState().game;
      return g.boostUntil > g.elapsedMs;
    }),
  ).toBe(true);
  await expect(brew).toBeDisabled();
});

test('relay puzzle carries signal through a valid path and pays once', async ({ page }) => {
  await world(page, 'planet');
  await station(page, 'Branch network');
  const turns = await page.evaluate(
    () => window.__talentStore.getState().game.operations.grid.turns,
  );
  for (let i = 0; i < 9; i++)
    for (let j = 0; j < (4 - turns[i]) % 4; j++) {
      const button = page.getByRole('button', { name: `Rotate relay ${i + 1}`, exact: true });
      if (await button.isEnabled()) await button.click();
    }
  await expect(page.locator('.station-feedback')).toContainText('Region connected');
  await expect(page.getByRole('button', { name: 'Rotate relay 1', exact: true })).toBeDisabled();
  expect(
    await page.evaluate(() => window.__talentStore.getState().game.operations.grid.links),
  ).toBe(1);
});

test('an aimed probe visibly travels and establishes a colony on arrival', async ({ page }) => {
  await world(page);
  await station(page, 'Probe control');
  const target = page.locator('.probe-target');
  await target.scrollIntoViewIfNeeded();
  const box = (await target.boundingBox())!;
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  await page.getByRole('button', { name: 'Launch probe ↗', exact: true }).click();
  await expect(page.locator('.probe-vessel')).toBeVisible();
  await expect(page.getByRole('slider', { name: 'Launch angle' })).toBeDisabled();
  await expect(page.locator('.station-feedback')).toContainText('Probe landed', { timeout: 6500 });
  expect(
    await page.evaluate(() => window.__talentStore.getState().game.operations.probe.sectors),
  ).toBe(1);
});

test('world expands through distinct eras without dead windows or viewport overflow', async ({
  page,
}, info) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/?dev=1&seed=world');
  await expect
    .poll(() =>
      page.locator('.chapter-heading').evaluate((el) => Number(getComputedStyle(el).opacity)),
    )
    .toBe(1);
  await page.screenshot({ path: `/private/tmp/talent-opening-${info.project.name}.png` });
  for (const era of ['department', 'planet', 'orbit', 'cosmos'] as const) {
    await page.evaluate((era) => window.__talentStore.getState().dev(era), era);
    await expect(page.locator(`.game-world.era-${era}`)).toBeVisible();
    await expect(page.locator('.desktop-widgets,.desktop-surface,.active-work-window')).toHaveCount(
      0,
    );
    await expect
      .poll(() =>
        page.locator('.chapter-heading').evaluate((el) => Number(getComputedStyle(el).opacity)),
      )
      .toBe(1);
    await page.screenshot({ path: `/private/tmp/talent-${era}-${info.project.name}.png` });
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByRole('heading', { name: 'The universe has an opening.' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: `/private/tmp/talent-cosmos-mobile-${info.project.name}.png` });
  await page.getByRole('button', { name: /Reject candidate/ }).scrollIntoViewIfNeeded();
  await expect(page.getByRole('button', { name: /Reject candidate/ })).toBeInViewport();
});

test('cat walks, pauses with the simulation and respects reduced motion', async ({ page }) => {
  await world(page);
  const cat = page.locator('.desktop-pet');
  await cat.scrollIntoViewIfNeeded();
  const before = await cat.evaluate((el) => getComputedStyle(el).left);
  await expect
    .poll(() => cat.evaluate((el) => getComputedStyle(el).left), { timeout: 6000 })
    .not.toBe(before);
  await page.evaluate(() => window.__talentStore.getState().pause());
  await expect
    .poll(() => cat.evaluate((el) => getComputedStyle(el).animationPlayState))
    .toBe('paused');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(await cat.evaluate((el) => getComputedStyle(el).animationName)).toBe('none');
});
for (const ending of ['break', 'burnout', 'corporate'] as const)
  test(`${ending} keeps its real photo ending and resets all station progress`, async ({
    page,
  }) => {
    await world(page);
    await page.evaluate((ending) => window.__talentStore.getState().dev(ending), ending);
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect
      .poll(() =>
        page.locator('.ending-photo').evaluate((el) => (el as HTMLImageElement).naturalWidth),
      )
      .toBeGreaterThan(500);
    await page.getByRole('button', { name: 'Start a fresh session' }).click();
    const state = await page.evaluate(() => window.__talentStore.getState().game);
    expect(state.desk).toEqual({});
    expect(state.operations.probe.sectors).toBe(0);
  });
