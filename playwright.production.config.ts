import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './e2e',
  metadata: { production: true },
  outputDir: 'test-results-production',
  testMatch: ['production.spec.ts', 'accessibility.spec.ts'],
  reporter: [['list'], ['html', { outputFolder: 'playwright-report/production', open: 'never' }]],
  use: { ...devices['Desktop Chrome'], baseURL: 'http://127.0.0.1:4174' },
  webServer: {
    command: 'pnpm run preview --host 127.0.0.1 --port 4174 --strictPort',
    url: 'http://127.0.0.1:4174',
    reuseExistingServer: false,
  },
});
