import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './e2e',
  outputDir: 'test-results-production',
  testMatch: 'production.spec.ts',
  use: { ...devices['Desktop Chrome'], channel: 'chrome' },
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1 --port 4173',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: false,
  },
});
