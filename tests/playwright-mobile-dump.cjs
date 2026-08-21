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
    page.on('pageerror', error => pageErrors.push(error?.stack || error?.message || String(error)));

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
    if (pageErrors.length) {
      console.error('Browser page errors:');
      pageErrors.forEach(error => console.error(error));
    }
    await context.close();
  } finally {
    await browser.close();
  }
})().catch(error => {
  console.error(error?.stack || error);
  process.exit(1);
});
