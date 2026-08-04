import { defineConfig, devices } from '@playwright/test';

const clientId = process.env.CF_ACCESS_CLIENT_ID || '';
const clientSecret = process.env.CF_ACCESS_CLIENT_SECRET || '';
const baseURL = process.env.CMX_BROWSER_BASE_URL || '';

if (!clientId || !clientSecret || !baseURL) {
  throw new Error('CMX_BROWSER_BASE_URL and Cloudflare Access service-token values are required.');
}

export default defineConfig({
  testDir: './tests/staging',
  timeout: 60_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  forbidOnly: true,
  retries: 1,
  workers: 1,
  reporter: [['line'], ['html', { open: 'never', outputFolder: 'playwright-platform-staging-report' }]],
  use: {
    baseURL,
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
      name: 'platform-staging-desktop',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'platform-staging-mobile',
      use: { ...devices['Pixel 7'] }
    }
  ]
});
