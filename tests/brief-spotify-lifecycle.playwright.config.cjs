const path = require('node:path');

module.exports = {
  testDir: __dirname,
  testMatch: 'brief-spotify-lifecycle.spec.cjs',
  timeout: 30000,
  expect: { timeout: 7000 },
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL: 'http://127.0.0.1:4173',
    browserName: 'chromium',
    viewport: { width: 1440, height: 1000 },
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
  webServer: {
    command: 'python3 -m http.server 4173 --bind 127.0.0.1',
    cwd: path.resolve(__dirname, '..'),
    url: 'http://127.0.0.1:4173/brief/',
    reuseExistingServer: true,
    timeout: 20000
  }
};
