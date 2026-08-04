const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: '.',
  testMatch: /brief-personal-os\.spec\.cjs/,
  timeout: 30000,
  expect: { timeout: 7000 },
  retries: 1,
  workers: 1,
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
  webServer: {
    command: 'python3 -m http.server 4173',
    cwd: '..',
    port: 4173,
    reuseExistingServer: true
  },
  projects: [
    { name: 'desktop-chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'pixel-5', use: { ...devices['Pixel 5'] } }
  ]
});
