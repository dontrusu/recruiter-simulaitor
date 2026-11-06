import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './e2e',
  outputDir: 'test-results-production',
  testMatch: 'production.spec.ts',
  use: { ...devices['Desktop Chrome'] },
  webServer: {
    command: 'pnpm run preview --host 127.0.0.1 --port 4174 --strictPort',
    url: 'http://127.0.0.1:4174',
    reuseExistingServer: false,
  },
});
