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
  await expect(page.locator('#briefSystemHeader')).toBeVisible();
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

test('Full View opens directly and returns to the workspace', async ({ page }) => {
  await enter(page);
  await page.locator('[data-system-mode="full"]').click();
  await expect(page.locator('body')).toHaveAttribute('data-brief-system-mode', 'full');
  await expect(page.locator('#briefSystemFullBar')).toBeVisible();
  await expect(page.locator('#briefWorkspace')).toBeVisible();
  await page.locator('[data-return-workspace]').click();
  await expect(page.locator('body')).toHaveAttribute('data-brief-system-mode', 'workspace');
  await expect(page.locator('#briefSystemFullBar')).toBeHidden();
  await expect(page.locator('#briefWorkspace')).toBeVisible();
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
  await page.locator('#explainButton').click();
  await page.locator('#briefStartVision').click();
  await expect(page.locator('#briefVisionLayer')).toBeVisible();
  await insideViewport(page.locator('#briefVisionPanel'));
  await page.keyboard.press('Escape');
  await expect(page.locator('#briefVisionLayer')).toBeHidden();
});
