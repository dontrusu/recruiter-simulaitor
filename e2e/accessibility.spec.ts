import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const wcagTags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

for (const camera of ['Screen', 'Room']) {
  for (const rejected of [false, true]) {
    test(`${camera} ${rejected ? 'after Rejection' : 'on a fresh run'} passes WCAG scans`, async ({
      page,
    }, testInfo) => {
      await page.goto(camera === 'Room' ? '/?dev=1' : '/');
      await expect(page.getByRole('article', { name: 'Current application' })).toBeVisible();
      await expect(page.getByRole('region', { name: 'Shop' })).toBeVisible();

      if (camera === 'Room') {
        await page.getByRole('button', { name: 'Camera: Screen', exact: true }).click();
        await expect(page.getByRole('button', { name: 'Camera: Room', exact: true })).toBeVisible();
      }
      // Wait for the camera and fonts before interacting or scanning.
      await page.evaluate(async () => {
        await document.fonts.ready;
        await Promise.all(document.getAnimations().map((animation) => animation.finished));
      });
      if (rejected) {
        await page.getByRole('button', { name: 'Reject', exact: true }).click();
        await expect(page.getByTestId('counter-rejected')).toHaveText('1');
      }

      await expect(page.getByRole('region', { name: 'Vacancy' })).toBeVisible();
      await expect(page.getByRole('article', { name: 'Current application' })).toBeVisible();
      const results = await new AxeBuilder({ page })
        .withTags([...wcagTags, 'best-practice'])
        .analyze();
      const wcagViolations = results.violations.filter((result) =>
        result.tags.some((tag) => wcagTags.includes(tag)),
      );
      const bestPractices = results.violations.filter(
        (result) => !result.tags.some((tag) => wcagTags.includes(tag)),
      );

      const screenshot = testInfo.outputPath('rendered-state.png');
      await page.screenshot({ path: screenshot });
      await testInfo.attach('rendered-state', { path: screenshot, contentType: 'image/png' });

      // Attach before asserting so failing scans retain the complete diagnostics.
      await testInfo.attach('axe-results', {
        body: JSON.stringify(results, null, 2),
        contentType: 'application/json',
      });
      await testInfo.attach('accessibility-summary', {
        body: JSON.stringify(
          { wcagViolations, bestPractices, incomplete: results.incomplete },
          null,
          2,
        ),
        contentType: 'application/json',
      });
      testInfo.annotations.push({
        type: 'accessibility',
        description: `${wcagViolations.length} WCAG violations; ${bestPractices.length} best-practice findings; ${results.incomplete.length} incomplete rules. See attachments.`,
      });
      expect(wcagViolations, 'WCAG 2.2 A/AA violations (see axe-results attachment)').toEqual([]);
    });
  }
}
