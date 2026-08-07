const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test.beforeEach(async ({ page }) => {
  // Accessibility coverage remains deterministic and offline. Spotify behavior
  // is exercised with a controller mock in its dedicated lifecycle suite.
  await page.route('https://open.spotify.com/**', route => route.abort());
});

function formatViolations(violations) {
  return violations.map(violation => {
    const nodes = violation.nodes.slice(0, 4).map(node => node.target.join(' ')).join(', ');
    return `${violation.id} (${violation.impact}): ${violation.help}. Targets: ${nodes}`;
  }).join('\n');
}

async function expectNoSeriousAxeViolations(page, label) {
  // Wait for view-entry transitions so axe evaluates final rendered colors.
  await page.waitForTimeout(300);
  const results = await new AxeBuilder({ page })
    .exclude('iframe[src*="open.spotify.com"]')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();

  const blocking = results.violations.filter(violation => ['serious', 'critical'].includes(violation.impact));
  expect(blocking, `${label}\n${formatViolations(blocking)}`).toEqual([]);
}

async function openSpaces(page, route = '/spaces/', scenario = 'personal') {
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveURL(/\/spaces\//);
  await expect(page.locator('#entry')).toBeVisible();
  await page.locator(`[data-entry-scenario="${scenario}"]`).click();
  await page.locator('#openDemo').click();
  await expect(page.locator('[data-view-panel="today"]')).toBeVisible();
}

test('Spaces entry has no serious automated WCAG violations', async ({ page }) => {
  await page.goto('/spaces/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#entry')).toBeVisible();
  await expectNoSeriousAxeViolations(page, 'Spaces entry');
});

test('Spaces Today and How views have no serious automated WCAG violations', async ({ page }) => {
  await openSpaces(page);
  await expectNoSeriousAxeViolations(page, 'Spaces Today');

  await page.locator('.weather-card [data-ai-trigger]').click();
  await expect(page.locator('#spacesAiDialog')).toBeVisible();
  await expectNoSeriousAxeViolations(page, 'Spaces section conversation');
  await page.locator('#closeSpacesAi').click();

  const desktopHow = page.locator('#primaryNav [data-primary-view="how"]');
  if (await desktopHow.isVisible()) await desktopHow.click();
  else await page.locator('#mobileNav [data-primary-view="how"]').click();
  await expect(page.locator('[data-view-panel="how"]')).toBeVisible();
  await expectNoSeriousAxeViolations(page, 'Spaces How');
});

test('Family calendar, household modules and full weather view have no serious automated WCAG violations', async ({ page }) => {
  await openSpaces(page, '/spaces/', 'family');

  const desktopWorkspace = page.locator('#primaryNav [data-primary-view="workspace"]');
  if (await desktopWorkspace.isVisible()) await desktopWorkspace.click();
  else await page.locator('#mobileNav [data-primary-view="workspace"]').click();
  await page.locator('[data-workspace-tab="calendar"]').click();
  await expect(page.locator('.family-calendar')).toBeVisible();
  await expectNoSeriousAxeViolations(page, 'Spaces Family calendar');

  await page.locator('[data-workspace-tab="chores"]').click();
  await expect(page.locator('.household-board')).toBeVisible();
  await expectNoSeriousAxeViolations(page, 'Spaces Family chores');

  const desktopEverything = page.locator('#primaryNav [data-primary-view="everything"]');
  if (await desktopEverything.isVisible()) await desktopEverything.click();
  else await page.locator('#mobileNav [data-primary-view="everything"]').click();
  await expect(page.locator('#all-weather .full-weather-card')).toBeVisible();
  await expectNoSeriousAxeViolations(page, 'Spaces Family Everything');

  await page.locator('#themeButton').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expectNoSeriousAxeViolations(page, 'Spaces Family Everything dark theme');
});

test('Personal habit tracking remains accessible in both themes', async ({ page }) => {
  await openSpaces(page);

  const desktopWorkspace = page.locator('#primaryNav [data-primary-view="workspace"]');
  if (await desktopWorkspace.isVisible()) await desktopWorkspace.click();
  else await page.locator('#mobileNav [data-primary-view="workspace"]').click();
  await page.locator('[data-workspace-tab="habits"]').click();
  await expect(page.locator('.habit-tracker')).toBeVisible();
  await expectNoSeriousAxeViolations(page, 'Spaces Personal habits');

  await page.locator('#themeButton').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expectNoSeriousAxeViolations(page, 'Spaces Personal habits dark theme');
});

test('Business partner and accountant-client modules have no serious automated WCAG violations', async ({ page }) => {
  await openSpaces(page, '/spaces/', 'business');

  const desktopWorkspace = page.locator('#primaryNav [data-primary-view="workspace"]');
  if (await desktopWorkspace.isVisible()) await desktopWorkspace.click();
  else await page.locator('#mobileNav [data-primary-view="workspace"]').click();
  await page.locator('[data-workspace-tab="calendar"]').click();
  await expect(page.locator('.partner-calendar')).toBeVisible();
  await expectNoSeriousAxeViolations(page, 'Spaces Business partner calendar');

  await page.locator('#scenarioSelect').selectOption('accounting');
  if (await desktopWorkspace.isVisible()) await desktopWorkspace.click();
  else await page.locator('#mobileNav [data-primary-view="workspace"]').click();
  await page.locator('[data-workspace-tab="cash"]').click();
  await expect(page.locator('.financial-sheet')).toBeVisible();
  await expectNoSeriousAxeViolations(page, 'Spaces Accountant and client cash plan');

  await page.locator('[data-workspace-tab="portfolio"]').click();
  await expect(page.locator('.portfolio-dashboard')).toBeVisible();
  await expectNoSeriousAxeViolations(page, 'Spaces Accountant and client portfolio');

  await page.locator('#themeButton').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expectNoSeriousAxeViolations(page, 'Spaces Accountant and client portfolio dark theme');

  await page.locator('#scenarioSelect').selectOption('business');
  if (await desktopWorkspace.isVisible()) await desktopWorkspace.click();
  else await page.locator('#mobileNav [data-primary-view="workspace"]').click();
  await page.locator('[data-workspace-tab="calendar"]').click();
  await expect(page.locator('.partner-calendar')).toBeVisible();
  await expectNoSeriousAxeViolations(page, 'Spaces Business partner calendar dark theme');
});

test('Legacy Brief route redirects to Spaces', async ({ page }) => {
  await page.goto('/brief/?theme=dark#how', { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveURL(/\/spaces\/\?theme=dark#how$/);
  await expect(page.locator('#entry')).toBeVisible();
});

test('Brief rollback snapshot entry has no serious automated WCAG violations', async ({ page }) => {
  await page.goto('/brief-next/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#entry')).toBeVisible();
  await expectNoSeriousAxeViolations(page, 'Brief Next rollback entry');
});

test('Spaces document has no serious automated WCAG violations', async ({ page }) => {
  await page.goto('/doc/?theme=light', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('main')).toBeVisible();
  await expectNoSeriousAxeViolations(page, 'Spaces document');
});
