const path = require('node:path');
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: __dirname,
  testMatch: ['brief-browser-e2e.spec.cjs', 'brief-topbar-music-e2e.spec.cjs', 'doc-mobile-contents-e2e.spec.cjs', 'spaces-balanced-briefing-e2e.spec.cjs', 'spaces-visual-refinement-e2e.spec.cjs'],
  // These four legacy cases assert implementation details that the current product
  // deliberately replaced. Equivalent current behavior is covered in
  // spaces-balanced-briefing-e2e.spec.cjs instead of preserving stale markup.
  // Do not anchor this expression: Playwright includes file/suite text in the full title.
  grepInvert: /(briefing sections expose named progress controls and working arrows|purple interlinks land at the exact selected section on desktop and mobile|Doc final demo CTA stays contained on a narrow mobile viewport|Doc renders the plain-language copy audit)/,
  timeout: 30000,
  expect: { timeout: 7000 },
  fullyParallel: false,
  retries: 0,
  reporter: [['line']],
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off'
  },
  webServer: {
    command: 'python3 -m http.server 4173 --bind 127.0.0.1',
    cwd: path.resolve(__dirname, '..'),
    port: 4173,
    reuseExistingServer: true,
    timeout: 15000
  },
  projects: [
    { name: 'chromium-desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox-desktop', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit-desktop', use: { ...devices['Desktop Safari'] } },
    { name: 'webkit-iphone', use: { ...devices['iPhone 13'] } },
    { name: 'chromium-android', use: { ...devices['Pixel 5'] } }
  ]
});
