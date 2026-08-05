const path = require('node:path');
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: __dirname,
  testMatch: ['brief-overlay-controls.spec.cjs'],
  timeout: 60000,
  expect: { timeout: 12000 },
  fullyParallel: false,
  retries: 1,
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
    { name: 'chromium-android', use: { ...devices['Pixel 5'] } }
  ]
});
