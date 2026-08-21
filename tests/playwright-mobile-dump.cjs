const fs = require('node:fs');
const { chromium } = require('playwright-core');

const [browserPath, widthRaw, heightRaw, url, outputPath, readyDatasetKey, readyValue = 'true', timeoutRaw = '15000'] = process.argv.slice(2);
const width = Number(widthRaw);
const height = Number(heightRaw);
const timeout = Number(timeoutRaw);

if (!browserPath || !Number.isFinite(width) || !Number.isFinite(height) || !url || !outputPath || !readyDatasetKey) {
  console.error('Usage: node tests/playwright-mobile-dump.cjs <browser> <width> <height> <url> <output> <readyDatasetKey> [readyValue] [timeoutMs]');
  process.exit(2);
}

(async () => {
  const browser = await chromium.launch({
    executablePath: browserPath,
    headless: true,
    args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage']
  });

  try {
    const context = await browser.newContext({
      viewport: { width, height },
      screen: { width, height },
      deviceScaleFactor: 1,
      isMobile: true,
      hasTouch: true
    });
    const page = await context.newPage();
    const pageErrors = [];
    const consoleErrors = [];
    const failedRequests = [];
    const badResponses = [];

    page.on('pageerror', error => pageErrors.push(error?.stack || error?.message || String(error)));
    page.on('console', message => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });
    page.on('requestfailed', request => {
      failedRequests.push(`${request.method()} ${request.url()} :: ${request.failure()?.errorText || 'failed'}`);
    });
    page.on('response', response => {
      if (response.status() >= 400) badResponses.push(`${response.status()} ${response.url()}`);
    });

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout });
    await page.waitForFunction(
      ({ key, expected }) => document.documentElement.dataset[key] === expected,
      { key: readyDatasetKey, expected: readyValue },
      { timeout }
    );
    await page.waitForTimeout(80);

    const viewport = await page.evaluate(() => ({ width: window.innerWidth, height: window.innerHeight }));
    if (viewport.width !== width) {
      throw new Error(`Expected ${width}px CSS viewport, received ${viewport.width}px.`);
    }

    fs.writeFileSync(outputPath, await page.content(), 'utf8');
    console.log(`Mobile browser dump passed at ${viewport.width}x${viewport.height}.`);

    const report = (label, rows) => {
      if (!rows.length) return;
      console.error(`${label}:`);
      rows.forEach(row => console.error(row));
    };
    report('Browser page errors', pageErrors);
    report('Browser console errors', consoleErrors);
    report('Failed browser requests', failedRequests);
    report('HTTP error responses', badResponses);

    await context.close();
  } finally {
    await browser.close();
  }
})().catch(error => {
  console.error(error?.stack || error);
  process.exit(1);
});
