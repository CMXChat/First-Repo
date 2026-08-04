const { test, expect } = require('@playwright/test');

async function enter(page) {
  await page.addInitScript(() => {
    localStorage.clear();
    sessionStorage.clear();
    localStorage.setItem('cmxBriefDemo:onboarding:tips', 'off');
  });
  await page.goto('/brief/?finalization-test=1', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#briefEntryRadio')).toBeVisible();
  await page.locator('.brief-entry-radio-card.is-individual').click();
  await page.locator('#enterBrief').click();
  await expect(page.locator('body')).not.toHaveClass(/is-locked/);
  await expect(page.locator('#briefWorkspace')).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('data-brief-finalized', 'true');
}

async function insideViewport(locator) {
  const bounds = await locator.evaluate(node => {
    const rect = node.getBoundingClientRect();
    const viewport = window.visualViewport;
    return {
      left: rect.left,
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      width: viewport?.width || window.innerWidth,
      height: viewport?.height || window.innerHeight
    };
  });
  expect(bounds.left).toBeGreaterThanOrEqual(-3);
  expect(bounds.top).toBeGreaterThanOrEqual(-3);
  expect(bounds.right).toBeLessThanOrEqual(bounds.width + 3);
  expect(bounds.bottom).toBeLessThanOrEqual(bounds.height + 3);
}

test('Mobile entry always begins at the true document top', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => {
    localStorage.clear();
    sessionStorage.clear();
    localStorage.setItem('cmxBriefDemo:onboarding:tips', 'off');
  });
  await page.goto('/brief/?mobile-entry-top=1', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#briefEntryRadio')).toBeVisible();
  await page.locator('.brief-entry-radio-card.is-individual').click();

  await page.evaluate(() => {
    document.documentElement.style.overflow = 'auto';
    document.body.style.overflow = 'auto';
    document.body.style.minHeight = '4000px';
    window.scrollTo(0, 1200);
    document.documentElement.scrollTop = 1200;
    document.body.scrollTop = 1200;
  });
  await expect.poll(() => page.evaluate(() => window.scrollY || document.documentElement.scrollTop || document.body.scrollTop)).toBeGreaterThan(100);

  await page.locator('#enterBrief').click({ force: true });
  await expect(page.locator('body')).not.toHaveClass(/is-locked/);
  await expect(page.locator('#briefWorkspace')).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.scrollY || document.documentElement.scrollTop || document.body.scrollTop)).toBeLessThanOrEqual(1);
  await expect(page.locator('.topbar')).toBeInViewport();
});

test('Map remains optional and its controls stay synchronized', async ({ page }) => {
  await enter(page);
  const drawer = page.locator('#briefNavigationDrawer');
  const topMap = page.locator('#briefTopMapButton');
  const quickMap = page.locator('[data-open-brief-map]').first();

  await expect(page.locator('#briefMapButton')).toBeVisible();
  await expect(topMap).toBeVisible();
  await expect(quickMap).toBeVisible();
  await expect(drawer).toBeHidden();
  await expect(topMap).toHaveAttribute('aria-expanded', 'false');

  await quickMap.click();
  await expect(drawer).toBeVisible();
  await expect(topMap).toHaveAttribute('aria-expanded', 'true');
  await expect(topMap).toHaveClass(/is-active/);

  await page.locator('[data-nav-close]').last().click();
  await expect(drawer).toBeHidden();
  await expect(topMap).toHaveAttribute('aria-expanded', 'false');
  await expect(topMap).not.toHaveClass(/is-active/);
});

test('Full workspace opens the current section directly without opening Map', async ({ page }) => {
  await enter(page);
  await page.locator('[data-workspace-tab="work"]').click();
  const full = page.locator('[data-open-full-workspace]').first();
  await expect(full).toBeVisible();
  await full.click();
  await expect(page.locator('body')).toHaveAttribute('data-brief-depth', 'full');
  await expect(page.locator('#briefNavigationDrawer')).toBeHidden();
  await expect(page.locator('#briefMapButton')).toBeVisible();
  await expect(page.locator('#briefTopMapButton')).toBeVisible();
  await expect(page.locator('#briefNavigatorBar')).toBeVisible();
});

test('Quick briefing launches Vision and restores focus to its launcher', async ({ page }) => {
  await enter(page);
  const launcher = page.locator('[data-start-vision]');
  await expect(launcher).toBeVisible();
  await expect(page.locator('.brief-vision-entry-card')).toContainText('real music, voice, context and approved connections');

  await launcher.click();
  await expect(page.locator('#briefVisionLayer')).toBeVisible();
  await expect(page.locator('#briefVisionTitle')).toHaveText('You wake up. The day is already sorted.');
  await insideViewport(page.locator('#briefVisionPanel'));
  await page.keyboard.press('Escape');
  await expect(page.locator('#briefVisionLayer')).toBeHidden();
  await expect(launcher).toBeFocused();
});

test('Help launches a clean manual Vision walkthrough', async ({ page }) => {
  await enter(page);
  const help = page.locator('#explainButton');
  await help.click();
  await expect(page.locator('#briefHelpCenter')).toBeVisible();
  await expect(page.locator('#briefStartVision')).toBeVisible();
  await page.locator('#briefStartVision').click();
  await expect(page.locator('#briefHelpCenter')).toBeHidden();
  await expect(page.locator('#briefVisionLayer')).toBeVisible();
  await expect(page.locator('#briefVisionTitle')).toHaveText('You wake up. The day is already sorted.');
  await insideViewport(page.locator('#briefVisionPanel'));
  await expect.poll(() => page.evaluate(() => document.querySelector('#briefApp').inert)).toBe(true);

  const titles = [
    'You wake up. The day is already sorted.',
    'It sounds like you, not a robot.',
    'Context turns reminders into strategy.',
    'Different people see different truths.',
    'It learns through correction, not assumption.',
    'When you approve it, the briefing can act.'
  ];

  for (let index = 0; index < titles.length; index += 1) {
    await expect(page.locator('#briefVisionTitle')).toHaveText(titles[index]);
    await insideViewport(page.locator('#briefVisionPanel'));
    if (index < titles.length - 1) await page.locator('#briefVisionNext').click();
  }

  await expect(page.locator('#briefVisionNext')).toHaveText('Finish');
  await page.locator('#briefVisionNext').click();
  await expect(page.locator('#briefVisionLayer')).toBeHidden();
  await expect.poll(() => page.evaluate(() => document.querySelector('#briefApp').inert)).toBe(false);
  await expect(help).toBeFocused();
});

test('Vision remains inside a narrow landscape viewport', async ({ page }) => {
  await enter(page);
  await page.setViewportSize({ width: 667, height: 375 });
  await page.locator('[data-start-vision]').click();
  await expect(page.locator('#briefVisionLayer')).toBeVisible();
  await insideViewport(page.locator('#briefVisionPanel'));
  await page.keyboard.press('Escape');
  await expect(page.locator('#briefVisionLayer')).toBeHidden();
});
