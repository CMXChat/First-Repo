const { test, expect } = require('@playwright/test');

async function enterPersonalBriefing(page) {
  await page.addInitScript(() => {
    localStorage.clear();
    sessionStorage.clear();
    localStorage.setItem('cmxBriefDemo:onboarding:tips', 'off');
  });
  await page.goto('/brief/?personal-os-test=1', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#briefEntryRadio')).toBeVisible();
  await page.locator('.brief-entry-radio-card.is-individual').click();
  await expect(page.locator('#enterBrief')).toBeEnabled();
  await page.locator('#enterBrief').click();
  await expect(page.locator('body')).not.toHaveClass(/is-locked/);
  await expect(page.locator('#briefPersonalOS')).toBeVisible();
}

async function expectNoDocumentScroll(page) {
  const metrics = await page.evaluate(() => ({
    innerHeight: window.innerHeight,
    documentHeight: document.documentElement.scrollHeight,
    bodyHeight: document.body.scrollHeight,
    overflow: getComputedStyle(document.body).overflow
  }));
  expect(metrics.overflow).toBe('hidden');
  expect(metrics.documentHeight).toBeLessThanOrEqual(metrics.innerHeight + 4);
  expect(metrics.bodyHeight).toBeLessThanOrEqual(metrics.innerHeight + 4);
}

test('desktop uses an OS viewport instead of a continuous report', async ({ page }) => {
  await enterPersonalBriefing(page);

  await expect(page.locator('body')).toHaveClass(/brief-personal-os-ready/);
  await expect(page.locator('#briefMain')).toBeHidden();
  await expect(page.locator('#briefOsTitle')).toHaveText('Today');
  await expect(page.locator('#briefOsNav [data-os-open="today"]')).toHaveAttribute('aria-current', 'page');
  await expectNoDocumentScroll(page);

  const before = await page.locator('#briefOsTrack').evaluate(node => getComputedStyle(node).transform);
  await page.locator('#briefOsNav [data-os-open="day"]').click();
  await expect(page.locator('#briefOsTitle')).toHaveText('Day');
  await expect(page.locator('[data-os-screen="day"]')).toHaveClass(/is-active/);
  const after = await page.locator('#briefOsTrack').evaluate(node => getComputedStyle(node).transform);
  expect(after).not.toBe(before);

  await page.locator('[data-os-next-label]').click();
  await expect(page.locator('#briefOsTitle')).toHaveText('Work');

  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#briefOsTitle')).toHaveText('Private');
  await page.keyboard.press('ArrowLeft');
  await expect(page.locator('#briefOsTitle')).toHaveText('Work');
});

test('detail mode is deliberate and returns to the OS', async ({ page }) => {
  await enterPersonalBriefing(page);
  await page.locator('#briefOsNav [data-os-open="day"]').click();
  await page.locator('[data-os-detail="#schedule"]').click();

  await expect(page.locator('body')).toHaveClass(/brief-personal-os-detail-open/);
  await expect(page.locator('#briefOsReturn')).toBeVisible();
  await expect(page.locator('#briefMain')).toBeVisible();

  await page.locator('#briefOsReturn').click();
  await expect(page.locator('body')).not.toHaveClass(/brief-personal-os-detail-open/);
  await expect(page.locator('#briefPersonalOS')).toBeVisible();
  await expect(page.locator('#briefMain')).toBeHidden();
  await expect(page.locator('#briefOsTitle')).toHaveText('Day');
  await expectNoDocumentScroll(page);
});

test('OS command opens the repaired terminal and closes cleanly', async ({ page }) => {
  await enterPersonalBriefing(page);
  await page.locator('.brief-os-rail-footer [data-os-command]').click();
  await expect(page.locator('#briefTerminal')).toBeVisible();
  await expect(page.locator('body')).toHaveClass(/brief-terminal-open/);
  await page.locator('[data-terminal-close]').click();
  await expect(page.locator('#briefTerminal')).toBeHidden();
  await expect(page.locator('body')).not.toHaveClass(/brief-terminal-open/);
});

test('mobile uses bottom apps, swipe-sized screens and no page scroll', async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await enterPersonalBriefing(page);

  const navBox = await page.locator('#briefOsNav').boundingBox();
  expect(navBox).not.toBeNull();
  expect(navBox.y).toBeGreaterThan(760);

  await page.locator('#briefOsNav [data-os-open="actions"]').click();
  await expect(page.locator('#briefOsTitle')).toHaveText('Work');
  await expect(page.locator('[data-os-screen="actions"]')).toHaveClass(/is-active/);

  const overflow = await page.evaluate(() => ({
    x: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    y: document.documentElement.scrollHeight - window.innerHeight
  }));
  expect(overflow.x).toBeLessThanOrEqual(3);
  expect(overflow.y).toBeLessThanOrEqual(4);
  await expectNoDocumentScroll(page);

  await page.locator('[data-os-next]').click();
  await expect(page.locator('#briefOsTitle')).toHaveText('Private');
});

test('guided flow advances once and stops at System', async ({ page }) => {
  await enterPersonalBriefing(page);
  await page.evaluate(() => {
    const nativeSetInterval = window.setInterval;
    window.setInterval = (callback, delay, ...args) => nativeSetInterval(callback, Math.min(delay, 60), ...args);
    window.BRIEF_PERSONAL_OS.startGuidedFlow();
  });

  await expect.poll(() => page.evaluate(() => window.BRIEF_PERSONAL_OS.getState().active), { timeout: 1500 }).toBe('system');
  await expect.poll(() => page.evaluate(() => window.BRIEF_PERSONAL_OS.getState().autoRunning), { timeout: 1500 }).toBe(false);
  await expect(page.locator('[data-os-auto]')).toHaveAttribute('aria-pressed', 'false');
});
