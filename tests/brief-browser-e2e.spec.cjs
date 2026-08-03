const { test, expect } = require('@playwright/test');

async function enterPersonalBriefing(page) {
  await page.goto('/brief/?browser-test=1', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#briefEntryRadio')).toBeVisible();
  await page.locator('.brief-entry-radio-card.is-individual').click();
  await expect(page.locator('body')).toHaveClass(/is-locked/);
  await expect(page.locator('#enterBrief')).toBeEnabled();
  await page.locator('#enterBrief').click();
  await expect(page.locator('body')).not.toHaveClass(/is-locked/);
  await expect(page.locator('#briefWorkspace')).toBeVisible();
}

async function expectInsideViewport(locator, page) {
  const result = await locator.evaluate(node => {
    const rect = node.getBoundingClientRect();
    const viewport = window.visualViewport;
    const width = viewport?.width || window.innerWidth;
    const height = viewport?.height || window.innerHeight;
    return {
      left: rect.left,
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      width,
      height
    };
  });
  expect(result.left).toBeGreaterThanOrEqual(-3);
  expect(result.top).toBeGreaterThanOrEqual(-3);
  expect(result.right).toBeLessThanOrEqual(result.width + 3);
  expect(result.bottom).toBeLessThanOrEqual(result.height + 3);
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
});

test('entry, help center and guided tour work without overflow', async ({ page }) => {
  await enterPersonalBriefing(page);

  const overflow = await page.evaluate(() => ({
    document: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    body: document.body.scrollWidth - document.body.clientWidth
  }));
  expect(overflow.document).toBeLessThanOrEqual(2);
  expect(overflow.body).toBeLessThanOrEqual(2);

  const help = page.locator('#explainButton');
  await expect(help).toHaveAttribute('aria-haspopup', 'dialog');
  await help.click();
  await expect(page.locator('#briefHelpCenter')).toBeVisible();
  await expect(page.locator('#briefStartTour')).toBeVisible();
  await expectInsideViewport(page.locator('.brief-glass-panel'), page);

  await page.locator('#briefStartTour').click();
  await expect(page.locator('#briefTourLayer')).toBeVisible();
  await expect(page.locator('#briefTourTitle')).toContainText('Start with what matters now');

  for (let step = 0; step < 6; step += 1) {
    await page.waitForTimeout(420);
    await expectInsideViewport(page.locator('#briefTourBubble'), page);
    if (step < 5) await page.locator('#briefTourNext').click();
  }

  await expect(page.locator('#briefTourNext')).toHaveText('Done');
  await page.locator('#briefTourNext').click();
  await expect(page.locator('#briefTourLayer')).toBeHidden();
  await expect(help).toBeFocused();
});

test('tips can be disabled and help remains available', async ({ page }) => {
  await enterPersonalBriefing(page);
  await page.locator('#explainButton').click();
  const toggle = page.locator('#briefTipsToggle');
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  await page.locator('[data-help-close]').last().click();
  await expect(page.locator('#briefHelpCenter')).toBeHidden();
  await page.locator('#explainButton').click();
  await expect(page.locator('#briefHelpCenter')).toBeVisible();
});

test('moving signal rail resumes after pause', async ({ page }) => {
  await enterPersonalBriefing(page);
  const button = page.locator('#briefSignalPause');
  const strip = page.locator('#briefSignalStrip');
  await expect(button).toBeVisible();
  await button.click();
  await expect(button).toHaveAttribute('aria-pressed', 'true');
  await expect(button).toHaveText('Play');
  await button.click();
  await expect(button).toHaveAttribute('aria-pressed', 'false');
  await expect(button).toHaveText('Pause');
  await expect.poll(async () => strip.evaluate(node => getComputedStyle(node).animationPlayState)).toBe('running');
});

test('help and tour stay usable in landscape viewport', async ({ page }) => {
  await enterPersonalBriefing(page);
  await page.setViewportSize({ width: 844, height: 390 });
  await page.waitForTimeout(300);
  await page.locator('#explainButton').click();
  await expectInsideViewport(page.locator('.brief-glass-panel'), page);
  await page.locator('#briefStartTour').click();
  await page.waitForTimeout(420);
  await expectInsideViewport(page.locator('#briefTourBubble'), page);
  await page.keyboard.press('Escape');
  await expect(page.locator('#briefTourLayer')).toBeHidden();
});

test('team switch, full workspace and question-mark help remain functional', async ({ page }) => {
  await enterPersonalBriefing(page);
  await page.evaluate(() => window.BRIEF_APP.setPreset('team'));
  await expect(page.locator('body')).toHaveAttribute('data-brief-depth', 'quick');
  await expect(page.locator('#briefWorkspace')).toBeVisible();
  await expect(page.locator('#briefPriorityVisuals')).toBeVisible();
  await page.locator('[data-depth-choice="full"]').click();
  await expect(page.locator('body')).toHaveAttribute('data-brief-depth', 'full');
  await page.locator('#explainButton').click();
  await expect(page.locator('#briefHelpCenter')).toBeVisible();
});
