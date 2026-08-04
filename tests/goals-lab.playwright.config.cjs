const path = require('node:path');
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: __dirname,
  testMatch: ['goals-lab-browser-e2e.spec.cjs'],
  timeout: 30000,
  expect: { timeout: 7000 },
  fullyParallel: false,
  retries: 1,
  reporter: [['line']],
  use: {
    baseURL: 'http://127.0.0.1:4174',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off'
  },
  webServer: {
    command: 'python3 -m http.server 4174 --bind 127.0.0.1',
    cwd: path.resolve(__dirname, '..'),
    port: 4174,
    reuseExistingServer: true,
    timeout: 15000
  },
  projects: [
    { name: 'chromium-desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'chromium-android', use: { ...devices['Pixel 5'] } }
  ]
});
