const { test, expect } = require('@playwright/test');

const replacedLegacyTests = new Set([
  'briefing sections expose named progress controls and working arrows',
  'purple interlinks land at the exact selected section on desktop and mobile',
  'every briefing entry and context switch starts on Today'
]);

test.beforeEach(async ({}, testInfo) => {
  if (replacedLegacyTests.has(testInfo.title)) {
    test.skip(true, 'Superseded by the current Spaces navigation and refresh contract.');
  }
});

require('./brief-browser-e2e-suite.cjs');

async function prepareFreshPage(page, route = '/spaces/') {
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.reload({ waitUntil: 'domcontentloaded' });
}

async function openScenario(page, scenario = 'personal') {
  await prepareFreshPage(page);
  await expect(page.locator('#entry')).toBeVisible();
  await page.locator(`[data-entry-scenario="${scenario}"]`).click();
  await expect(page.locator('#openDemo')).toBeEnabled();
  await page.locator('#openDemo').click();
  await expect(page.locator('body')).toHaveAttribute('data-entered', 'true');
  await expect(page.locator('body')).toHaveAttribute('data-scenario', scenario);
  await expect(page.locator('[data-view-panel="today"]')).toBeVisible();
}

async function selectPrimaryView(page, view) {
  const desktopButton = page.locator(`#primaryNav [data-primary-view="${view}"]`);
  if (await desktopButton.isVisible()) {
    await desktopButton.click();
    return;
  }
  await page.locator(`#mobileNav [data-primary-view="${view}"]`).click();
}

async function expectNoHorizontalOverflow(page) {
  const overflow = await page.evaluate(() => ({
    document: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    body: document.body.scrollWidth - document.body.clientWidth
  }));
  expect(overflow.document).toBeLessThanOrEqual(1);
  expect(overflow.body).toBeLessThanOrEqual(1);
}

async function expectWorkspaceDestinationAligned(page) {
  await expect.poll(() => page.evaluate(() => {
    const topbar = document.querySelector('.topbar')?.getBoundingClientRect();
    const navigation = document.querySelector('#workspaceTabNavigation')?.getBoundingClientRect();
    const heading = document.querySelector('#workspacePanel .workspace-panel-heading')?.getBoundingClientRect();
    if (!topbar || !navigation || !heading) return { aligned: false };
    const gap = navigation.top - topbar.bottom;
    return {
      aligned: gap >= 4 && gap <= 28 && heading.top >= navigation.bottom && heading.top < innerHeight
    };
  }), { timeout: 4000 }).toEqual({ aligned: true });
}

async function expectEverythingDestinationAligned(page, id) {
  await expect.poll(() => page.evaluate(sectionId => {
    const nav = document.querySelector('#everythingJumpNav');
    const section = document.getElementById(sectionId);
    if (!nav || !section) return Number.POSITIVE_INFINITY;
    const stickyTop = Number.parseFloat(getComputedStyle(nav).top) || 0;
    const expectedTop = stickyTop + nav.getBoundingClientRect().height + 12;
    return Math.abs(section.getBoundingClientRect().top - expectedTop);
  }, id), { timeout: 4000 }).toBeLessThanOrEqual(3);
}

test('briefing sections use progress controls without a duplicate index', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium-desktop', 'The section cues are validated once in desktop Chromium.');
  await page.setViewportSize({ width: 1140, height: 844 });
  await openScenario(page, 'accounting');

  const scrollCue = page.locator('[data-scroll-today]');
  await expect(scrollCue).toBeVisible();
  const initialPageScroll = await page.evaluate(() => scrollY);
  await scrollCue.click();
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(initialPageScroll + 20);
  await selectPrimaryView(page, 'workspace');

  const previous = page.locator('[data-workspace-tab-step="previous"]');
  const next = page.locator('[data-workspace-tab-step="next"]');
  const hint = page.locator('#workspaceTabHint');
  await expect(hint).toBeVisible();
  await expect(hint).toContainText('Section 1 of 5');
  await expect(next).toBeVisible();
  await expect(next).toBeEnabled();
  await expect(page.locator('.workspace-next-section')).toContainText('Continue to Cash plan');
  await expect(page.locator('.workspace-related-links')).toHaveCount(0);

  await page.locator('.workspace-next-section').click();
  await expect(page.locator('[data-workspace-tab="cash"]')).toHaveAttribute('aria-selected', 'true');
  await expect(hint).toContainText('Section 2 of 5');
  await expect(page.locator('.workspace-next-section')).toContainText('Continue to Portfolio');
  await expect(page.locator('.workspace-thread-links button')).toHaveCount(2);
  await expect(page.locator('.workspace-related-links')).toHaveCount(0);
  await expect(previous).toBeEnabled();

  await page.setViewportSize({ width: 520, height: 844 });
  await expect(next).toBeVisible();
  await expect(next).toBeEnabled();
  await next.click();
  await expect(page.locator('[data-workspace-tab="portfolio"]')).toHaveAttribute('aria-selected', 'true');
  await expect(hint).toContainText('Section 3 of 5');
  await expect(previous).toBeEnabled();
  await expectNoHorizontalOverflow(page);
});

test('purple navigation lands correctly without a duplicate Explore index', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium-desktop', 'Exact interlink positioning runs once in Chromium at both target widths.');
  test.setTimeout(60000);

  for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    await openScenario(page, 'personal');

    const highlight = page.locator('.space-highlight').first();
    const highlightTarget = await highlight.getAttribute('data-highlight-tab');
    await highlight.click();
    await expect(page.locator('[data-view-panel="workspace"]')).toBeVisible();
    await expect(page.locator(`[data-workspace-tab="${highlightTarget}"]`)).toHaveAttribute('aria-selected', 'true');
    await expectWorkspaceDestinationAligned(page);

    const threadLink = page.locator('.workspace-thread-links [data-workspace-continue]').first();
    const threadTarget = await threadLink.getAttribute('data-workspace-continue');
    await threadLink.click();
    await expect(page.locator(`[data-workspace-tab="${threadTarget}"]`)).toHaveAttribute('aria-selected', 'true');
    await expectWorkspaceDestinationAligned(page);

    await expect(page.locator('.workspace-related-links')).toHaveCount(0);
    const purpleTab = page.locator('#workspaceTabs [data-workspace-tab]:not([aria-selected="true"])').first();
    const purpleTarget = await purpleTab.getAttribute('data-workspace-tab');
    await purpleTab.click();
    await expect(page.locator(`[data-workspace-tab="${purpleTarget}"]`)).toHaveAttribute('aria-selected', 'true');

    await selectPrimaryView(page, 'everything');
    await expect(page.locator('#everythingJumpNav [data-everything-jump]')).toHaveCount(9);
    for (const id of ['all-weather', 'all-workspace', 'all-privacy', 'all-overview']) {
      await page.locator(`[data-everything-jump="${id}"]`).click();
      await expect(page.locator(`[data-everything-jump="${id}"]`)).toHaveAttribute('aria-current', 'location');
      await expectEverythingDestinationAligned(page, id);
    }
    await expectNoHorizontalOverflow(page);
  }
});

test('refresh clears stale Space selection and new entries start on Today', async ({ page }) => {
  await prepareFreshPage(page, '/spaces/?scenario=team&view=everything&tab=plans');

  await expect(page.locator('#entry')).toBeVisible();
  await expect(page.locator('[data-entry-scenario="personal"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-entry-scenario="team"]')).toHaveAttribute('aria-pressed', 'false');
  const refreshedUrl = new URL(page.url());
  expect(refreshedUrl.searchParams.has('scenario')).toBe(false);
  expect(refreshedUrl.searchParams.has('view')).toBe(false);
  expect(refreshedUrl.searchParams.has('tab')).toBe(false);

  await page.locator('[data-entry-scenario="team"]').click();
  await expect(page.locator('#openDemo')).toBeEnabled();
  await page.locator('#openDemo').click();
  await expect(page.locator('body')).toHaveAttribute('data-scenario', 'team');
  await expect(page.locator('body')).toHaveAttribute('data-view', 'today');
  await expect(page.locator('[data-view-panel="today"]')).toBeVisible();
  await expect(page.locator('[data-view-panel="everything"]')).toBeHidden();
  await expect(page).toHaveURL(/scenario=team/);
  await expect(page).toHaveURL(/view=today/);
  expect(new URL(page.url()).searchParams.has('tab')).toBe(false);

  await selectPrimaryView(page, 'how');
  await expect(page.locator('[data-view-panel="how"]')).toBeVisible();
  await page.locator('#resetDemo').evaluate(button => button.click());
  await expect(page.locator('body')).toHaveAttribute('data-entered', 'false');
  expect(new URL(page.url()).searchParams.has('view')).toBe(false);

  await page.locator('[data-entry-scenario="relationship"]').click();
  await page.locator('#openDemo').click();
  await expect(page.locator('body')).toHaveAttribute('data-view', 'today');
  await expect(page.locator('[data-view-panel="today"]')).toBeVisible();

  await selectPrimaryView(page, 'workspace');
  await expect(page.locator('[data-view-panel="workspace"]')).toBeVisible();
  await page.locator('#scenarioSelect').selectOption('business');
  await expect(page.locator('body')).toHaveAttribute('data-scenario', 'business');
  await expect(page.locator('body')).toHaveAttribute('data-view', 'today');
  await expect(page.locator('[data-view-panel="today"]')).toBeVisible();
  await expect(page).toHaveURL(/scenario=business/);
  await expect(page).toHaveURL(/view=today/);
});
