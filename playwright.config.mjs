import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  use: { baseURL: 'http://127.0.0.1:4174', browserName: process.env.TEST_BROWSER || 'chromium' },
  webServer: {
    command: 'python3 scripts/preview.py 4174',
    url: 'http://127.0.0.1:4174',
    reuseExistingServer: false,
    timeout: 15000,
  },
});
