const { test, expect } = require('@playwright/test');

async function enterPersonalBriefing(page) {
  await page.goto('/brief/?browser-test=mobile-first-pass', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#briefEntryRadio')).toBeVisible();
  await page.locator('.brief-entry-radio-card.is-individual').click();
  await expect(page.locator('#enterBrief')).toBeEnabled();
  await expect(page.locator('#musicOnEntry')).toBeChecked();
  await expect(page.locator('#musicOnEntry')).toBeEnabled();
  await expect(page.locator('#gateSongName')).toContainText('30-second authorized preview');
  await page.locator('#enterBrief').click();
  await expect(page.locator('body')).not.toHaveClass(/is-locked/);
}

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 780 });
  await page.addInitScript(() => {
    localStorage.clear();
    sessionStorage.clear();
    localStorage.setItem('cmxBriefDemo:onboarding:tips', 'off');
    window.__briefPlayCalls = 0;

    HTMLMediaElement.prototype.play = function play() {
      window.__briefPlayCalls += 1;
      this.dispatchEvent(new Event('play'));
      return Promise.resolve();
    };

    HTMLMediaElement.prototype.pause = function pause() {
      this.dispatchEvent(new Event('pause'));
    };
  });
});

test('phone full view stays compact and entry starts the authorized music preview', async ({ page }) => {
  await enterPersonalBriefing(page);

  await expect.poll(() => page.evaluate(() => window.__briefPlayCalls)).toBeGreaterThan(0);
  await expect(page.locator('#musicPreviewAttribution')).toBeVisible();
  await expect(page.locator('#musicPreviewAttribution a')).toHaveAttribute('href', /music\.apple\.com\/us\/song\/walking-on-sunshine/);

  await expect(page.locator('#briefSystemHeader')).toBeVisible();
  await page.locator('[data-system-mode="full"]').click();
  await expect(page.locator('body')).toHaveAttribute('data-brief-system-mode', 'full');
  await expect(page.locator('#briefSystemFullBar')).toBeVisible();

  const fullBar = await page.locator('#briefSystemFullBar').evaluate(node => {
    const rect = node.getBoundingClientRect();
    const nav = node.querySelector('nav');
    return {
      height: rect.height,
      right: rect.right,
      viewport: window.innerWidth,
      navDisplay: nav ? getComputedStyle(nav).display : null
    };
  });
  expect(fullBar.height).toBeLessThan(100);
  expect(fullBar.right).toBeLessThanOrEqual(fullBar.viewport + 2);
  expect(fullBar.navDisplay).toBe('none');

  const rail = page.locator('#briefWorkspace .brief-signal-rail');
  const signal = page.locator('#briefSignalStrip span').first();
  await expect(rail).toBeVisible();
  await expect(signal).toBeVisible();

  const layout = await page.evaluate(() => {
    const railNode = document.querySelector('#briefWorkspace .brief-signal-rail');
    const signalNode = document.querySelector('#briefSignalStrip span');
    const railStyle = getComputedStyle(railNode);
    const signalStyle = getComputedStyle(signalNode);
    return {
      railDisplay: railStyle.display,
      writingMode: signalStyle.writingMode,
      whiteSpace: signalStyle.whiteSpace,
      wordBreak: signalStyle.wordBreak,
      documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      bodyOverflow: document.body.scrollWidth - document.body.clientWidth
    };
  });

  expect(layout.railDisplay).toBe('grid');
  expect(layout.writingMode).toBe('horizontal-tb');
  expect(layout.whiteSpace).toBe('nowrap');
  expect(layout.wordBreak).toBe('normal');
  expect(layout.documentOverflow).toBeLessThanOrEqual(2);
  expect(layout.bodyOverflow).toBeLessThanOrEqual(2);
});
