const { test, expect } = require('@playwright/test');

async function openScenario(page, id) {
  await page.goto('/brief-next/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.locator('#entrySoundtrack')).toBeChecked();
  await expect(page.locator('#readOnEntry')).toHaveCount(0);
  await page.locator(`[data-entry-scenario="${id}"]`).click();
  await expect(page.locator('#openDemo')).toBeEnabled();
  await page.locator('#openDemo').click();
  await expect(page.locator('body')).toHaveAttribute('data-entered', 'true');
  await expect(page.locator('#demoApp')).toHaveAttribute('aria-hidden', 'false');
}

test('desktop demo keeps weather, stats, selective navigation and visual intelligence', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium', 'Desktop navigation is tested only in the desktop project.');
  await openScenario(page, 'personal');

  await expect(page.locator('#primaryNav button')).toHaveCount(5);
  await expect(page.locator('#primaryNav button').last()).toHaveText('Everything');
  await expect(page.locator('#briefDocLink')).toBeVisible();
  await expect(page.locator('#briefDocLink')).toHaveAttribute('href', '/doc/');
  await expect(page.locator('[data-view-panel="today"]')).toBeVisible();
  await expect(page.locator('#weatherTemperature')).toHaveText('82');
  await expect(page.locator('#statsGrid .stat-card')).toHaveCount(4);
  await expect(page.locator('#flowList li')).toHaveCount(4);
  await expect(page.locator('#todayVisualIntelligence')).toBeVisible();
  await expect(page.locator('#todayVisualIntelligence svg')).toHaveCount(1);
  await expect(page.locator('#todayVisualIntelligence')).toContainText('Recommended timing');

  await page.locator('#primaryNav [data-primary-view="workspace"]').click();
  await expect(page.locator('[data-view-panel="workspace"]')).toBeVisible();
  await expect(page.locator('#workspaceTabs button')).toHaveCount(5);
  await expect(page.locator('#workspacePanel .detail-card')).toHaveCount(3);
  await expect(page.locator('#workspacePanel .workspace-visual')).toBeVisible();
  await expect(page.locator('#workspacePanel .data-table')).toHaveCount(1);

  await page.locator('#scenarioSelect').selectOption('team');
  await expect(page.locator('#railContextTitle')).toHaveText('Team and project');
  await expect(page.locator('#statsGrid .stat-card')).toHaveCount(4);
  await expect(page.locator('#workspacePanel .workspace-visual')).toContainText('component that fits its data');

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

test('Everything demonstrates the document model with visuals, inputs and interlinking', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium', 'Full-view behavior is covered in the desktop project.');
  await openScenario(page, 'relationship');

  await page.locator('#primaryNav [data-primary-view="everything"]').click();
  await expect(page.locator('[data-view-panel="everything"]')).toBeVisible();
  await expect(page.locator('#everythingJumpNav a')).toHaveCount(15);
  await expect(page.locator('#everythingContent .full-section')).toHaveCount(15);
  await expect(page.locator('.full-stat-grid article')).toHaveCount(4);
  await expect(page.locator('.full-workspace-group')).toHaveCount(5);
  await expect(page.locator('.component-choice-grid article')).toHaveCount(6);
  await expect(page.locator('.alarm-flow article')).toHaveCount(4);
  await expect(page.locator('#all-visuals .visual-story-grid > article')).toHaveCount(3);
  await expect(page.locator('#all-goal-pulse')).toContainText('Goal Pulse connects today’s information to movement');
  await expect(page.locator('#all-memory .memory-record')).toHaveCount(3);
  await expect(page.locator('#all-permissions tbody tr')).toHaveCount(4);
  await expect(page.locator('#all-inputs [data-input-toggle]')).toHaveCount(10);
  await expect(page.locator('#all-status')).toContainText('FastAPI services and PostgreSQL product state');
  await expect(page.locator('#everythingDocBridge a')).toHaveAttribute('href', '/doc/');
  await expect(page.locator('#all-adaptive')).toContainText('approved data is gathered, researched and checked');
  await expect(page.locator('#all-adaptive')).toContainText('Personalized does not mean unpredictable');
  await expect(page.locator('#all-alarm')).toContainText('connected Spotify account');
  await expect(page.locator('#all-alarm')).toContainText('executive overview');

  await page.locator('[data-input-toggle="finance"]').click();
  await page.locator('[data-input-toggle="weather"]').click();
  await expect(page.locator('#pipelinePreview')).toContainText('Cash watch');
  await expect(page.locator('#pipelinePreview')).toContainText('5 approved inputs');

  await page.locator('[data-full-workspace-tab="plans"]').click();
  await expect(page.locator('[data-view-panel="workspace"]')).toBeVisible();
  await expect(page.locator('[data-workspace-tab="plans"]')).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#workspacePanel .workspace-visual')).toBeVisible();

  await page.locator('#primaryNav [data-primary-view="everything"]').click();
  await page.locator('#scenarioSelect').selectOption('team');
  await expect(page.locator('#all-spaces')).toContainText('Project Space');
  await expect(page.locator('#all-workspace')).toContainText('Every category for this team and project briefing');
  await expect(page.locator('#all-goal-pulse')).toContainText('Keep the project moving with clear ownership');
  await expect(page.locator('#all-memory')).toContainText('Review queue blocks two handoffs');

  await page.locator('.full-end-nav [data-go-view="how"]').click();
  await expect(page.locator('[data-view-panel="how"]')).toBeVisible();
  await expect(page.locator('#howDocBridge')).toBeVisible();
});

test('memory and People and Spaces examples explain the product interactively', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium', 'Interactive product explanation is covered in the desktop project.');
  await openScenario(page, 'relationship');

  await page.locator('#primaryNav [data-primary-view="how"]').click();
  await expect(page.locator('#intelligenceExplainers')).toBeVisible();
  await expect(page.locator('[data-memory-example]')).toHaveCount(4);
  await expect(page.locator('[data-space-example]')).toHaveCount(3);

  await page.locator('[data-memory-example="correction"]').click();
  await expect(page.locator('#memoryComparison')).toContainText('A direct correction can replace a weaker inference');
  await expect(page.locator('#memoryComparison')).toContainText('Previous belief: archived');

  await page.locator('[data-space-example="family"]').click();
  await expect(page.locator('#spaceExamplePanel')).toContainText('One household briefing');
  await expect(page.locator('#spaceExamplePanel')).toContainText('Current expenses and bills');
  await expect(page.locator('#spaceExamplePanel')).toContainText('Parent-private notes');
  await expect(page.locator('.outcome-grid article')).toHaveCount(8);
  await expect(page.locator('.privacy-callout')).toContainText('PRIVATE FIRST');
  await expect(page.locator('#howDocBridge a')).toHaveAttribute('href', '/doc/');
});

test('mobile demo keeps focused navigation plus optional rich Everything', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-chromium', 'Mobile navigation is tested only in the mobile project.');
  await page.goto('/brief-next/', { waitUntil: 'domcontentloaded' });

  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  const bg = await page.locator('html').evaluate(node => getComputedStyle(node).getPropertyValue('--bg').trim());
  expect(bg).toBe('#edf3f8');
  const entryHeadingSize = await page.locator('#entryTitle').evaluate(node => Number.parseFloat(getComputedStyle(node).fontSize));
  expect(entryHeadingSize).toBeLessThanOrEqual(36);
  await expect(page.locator('#entrySoundtrack')).toBeChecked();

  await page.locator('[data-entry-scenario="relationship"]').click();
  await page.locator('#openDemo').click();
  await expect(page.locator('#mobileNav')).toBeVisible();
  await expect(page.locator('#mobileNav button')).toHaveCount(5);
  await expect(page.locator('#mobileNav button').last()).toHaveText('Everything');
  await expect(page.locator('#briefDocLink')).toBeVisible();
  await expect(page.locator('#todayVisualIntelligence')).toBeVisible();

  const heroHeadingSize = await page.locator('#heroTitle').evaluate(node => Number.parseFloat(getComputedStyle(node).fontSize));
  expect(heroHeadingSize).toBeLessThanOrEqual(36);

  await page.locator('#mobileNav [data-primary-view="everything"]').click();
  await expect(page.locator('[data-view-panel="everything"]')).toBeVisible();
  await expect(page.locator('#everythingJumpNav')).toBeVisible();
  await expect(page.locator('#all-inputs')).toBeVisible();
  await expect(page.locator('#everythingDocBridge')).toBeVisible();

  await page.locator('#mobileNav [data-primary-view="workspace"]').click();
  await expect(page.locator('[data-view-panel="workspace"]')).toBeVisible();
  await expect(page.locator('#workspaceTabs')).toBeVisible();
  await expect(page.locator('#workspacePanel .workspace-visual')).toBeVisible();

  await page.locator('#scenarioSelect').selectOption('trainer');
  await expect(page.locator('#railContextTitle')).toHaveText('Trainer and student');
  await expect(page.locator('#workspacePanel .detail-card')).toHaveCount(3);

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test('light default, saved explicit preferences and reset remain reversible', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium', 'Control reversibility is covered in the desktop project.');
  await openScenario(page, 'business');

  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.locator('#themeButton')).toHaveAttribute('aria-pressed', 'false');
  await page.locator('#themeButton').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#05070b');

  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

  await page.locator('#themeButton').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#edf3f8');

  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

  await page.locator('[data-entry-scenario="business"]').click();
  await page.locator('#openDemo').click();
  await page.locator('#resetDemo').click();
  await expect(page.locator('body')).toHaveAttribute('data-entered', 'false');
  await expect(page.locator('#entry')).toBeVisible();
  await expect(page.locator('#openDemo')).toBeDisabled();
  await expect(page.locator('#entrySoundtrack')).toBeChecked();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('legacy /brief source remains black-first', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium', 'The legacy dark contract is checked once in desktop Chromium.');
  await page.goto('/brief/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'black');
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#000000');
});
