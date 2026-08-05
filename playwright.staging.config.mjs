import { defineConfig, devices } from '@playwright/test';

const clientId = process.env.CF_ACCESS_CLIENT_ID || '';
const clientSecret = process.env.CF_ACCESS_CLIENT_SECRET || '';

if (!clientId || !clientSecret) {
  throw new Error('CF_ACCESS_CLIENT_ID and CF_ACCESS_CLIENT_SECRET are required for staging tests.');
}

export default defineConfig({
  testDir: './tests/browser',
  timeout: 45_000,
  expect: { timeout: 12_000 },
  fullyParallel: false,
  forbidOnly: true,
  retries: 1,
  workers: 1,
  reporter: [['line'], ['html', { open: 'never', outputFolder: 'playwright-staging-report' }]],
  use: {
    baseURL: process.env.CMX_BROWSER_BASE_URL,
    extraHTTPHeaders: {
      'CF-Access-Client-Id': clientId,
      'CF-Access-Client-Secret': clientSecret
    },
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    {
      name: 'staging-chromium-desktop',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'staging-chromium-mobile',
      use: { ...devices['Pixel 7'] }
    }
  ]
});
