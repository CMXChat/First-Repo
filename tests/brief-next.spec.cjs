const { test, expect } = require('@playwright/test');

async function openScenario(page, id) {
  await page.goto('/brief-next/', { waitUntil: 'domcontentloaded' });
  await page.locator(`[data-entry-scenario="${id}"]`).click();
  await expect(page.locator('#openDemo')).toBeEnabled();
  await page.locator('#openDemo').click();
  await expect(page.locator('body')).toHaveAttribute('data-entered', 'true');
  await expect(page.locator('#demoApp')).toHaveAttribute('aria-hidden', 'false');
}

test('desktop demo keeps weather, stats and selective navigation', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium', 'Desktop navigation is tested only in the desktop project.');
  await openScenario(page, 'personal');

  await expect(page.locator('[data-view-panel="today"]')).toBeVisible();
  await expect(page.locator('#weatherTemperature')).toHaveText('82');
  await expect(page.locator('#statsGrid .stat-card')).toHaveCount(4);
  await expect(page.locator('#flowList li')).toHaveCount(4);

  await page.locator('#primaryNav [data-primary-view="workspace"]').click();
  await expect(page.locator('[data-view-panel="workspace"]')).toBeVisible();
  await expect(page.locator('#workspaceTabs button')).toHaveCount(5);
  await expect(page.locator('#workspacePanel .detail-card')).toHaveCount(3);

  await page.locator('#scenarioSelect').selectOption('team');
  await expect(page.locator('#railContextTitle')).toHaveText('Team and project');
  await expect(page.locator('#statsGrid .stat-card')).toHaveCount(4);

  await page.locator('#primaryNav [data-primary-view="spaces"]').click();
  await expect(page.locator('#sharedSpaceTitle')).toHaveText('Project Space');
  await expect(page.locator('#privateSpaceList li')).toHaveCount(3);
  await expect(page.locator('#sharedSpaceList li')).toHaveCount(3);

  await page.locator('#mediaButton').click();
  await expect(page.locator('#mediaDrawer')).toHaveClass(/is-open/);
  await expect(page.locator('#spotifyFrame')).toHaveCount(1);
  await expect(page.locator('#spotifyFrame')).toHaveAttribute('src', /open\.spotify\.com\/embed\/track\/1eyzqe2QqGZUmfcPZtrIyt/);
  await page.locator('[data-close-media]').first().click();
  await expect(page.locator('#mediaDrawer')).not.toHaveClass(/is-open/);
});

test('mobile demo navigates without a forced long document', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-chromium', 'Mobile navigation is tested only in the mobile project.');
  await openScenario(page, 'relationship');

  await expect(page.locator('#mobileNav')).toBeVisible();
  await expect(page.locator('#mobileNav button')).toHaveCount(4);

  await page.locator('#mobileNav [data-primary-view="workspace"]').click();
  await expect(page.locator('[data-view-panel="workspace"]')).toBeVisible();
  await expect(page.locator('#workspaceTabs')).toBeVisible();

  await page.locator('#scenarioSelect').selectOption('trainer');
  await expect(page.locator('#railContextTitle')).toHaveText('Trainer and student');
  await expect(page.locator('#workspacePanel .detail-card')).toHaveCount(3);

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test('theme and reset controls remain reversible', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium', 'Control reversibility is covered in the desktop project.');
  await openScenario(page, 'business');

  await page.locator('#themeButton').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

  await page.locator('#resetDemo').click();
  await expect(page.locator('body')).toHaveAttribute('data-entered', 'false');
  await expect(page.locator('#entry')).toBeVisible();
  await expect(page.locator('#openDemo')).toBeDisabled();
});
