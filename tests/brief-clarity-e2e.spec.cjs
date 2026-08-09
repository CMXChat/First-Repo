const { test, expect } = require('@playwright/test');

async function prepareFreshPage(page, route = '/spaces/') {
  await page.route('https://open.spotify.com/**', routeHandler => routeHandler.abort());
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.reload({ waitUntil: 'domcontentloaded' });
}

async function enterPersonal(page) {
  await prepareFreshPage(page);
  const option = page.locator('[data-entry-scenario="personal"]');
  await option.click();
  await expect(page.locator('#openDemo')).toBeEnabled();
  await page.locator('#openDemo').click();
  await expect(page.locator('body')).toHaveAttribute('data-entered', 'true');
  await expect(page.locator('[data-view-panel="today"]')).toBeVisible();
}

async function selectPrimaryView(page, view) {
  const desktop = page.locator(`#primaryNav [data-primary-view="${view}"]`);
  if (await desktop.isVisible()) await desktop.click();
  else await page.locator(`#mobileNav [data-primary-view="${view}"]`).click();
}

async function expectNoHorizontalOverflow(page) {
  const overflow = await page.evaluate(() => ({
    document: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    body: document.body.scrollWidth - document.body.clientWidth
  }));
  expect(overflow.document).toBeLessThanOrEqual(1);
  expect(overflow.body).toBeLessThanOrEqual(1);
}

test('briefings keep rich visuals while reducing the default vertical stack', async ({ page }, testInfo) => {
  test.skip(!['chromium-desktop', 'chromium-android'].includes(testInfo.project.name), 'Clarity regression runs on desktop and Android.');
  await enterPersonal(page);

  const focus = page.locator('#todayFocusSwitcher');
  await expect(focus).toBeVisible();
  await expect(focus.locator('[data-clarity-deck-target]')).toHaveCount(3);
  await expect(focus.locator('[data-clarity-deck-target="weather"]')).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#weatherTemperature')).toHaveText('82');
  await expect(page.locator('#statsGrid .stat-card')).toHaveCount(4);
  await expect(page.locator('.hero-scroll-cue')).toBeHidden();

  await focus.locator('[data-clarity-deck-target="numbers"]').click();
  await expect(focus.locator('[data-clarity-deck-target="numbers"]')).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('.stats-panel')).toHaveAttribute('aria-hidden', 'false');
  await expectNoHorizontalOverflow(page);

  await selectPrimaryView(page, 'workspace');
  const tabCount = await page.locator('#workspaceTabs [data-workspace-tab]').count();
  const compactSections = page.locator('#workspaceExploreOverview [data-workspace-overview-section]');
  await expect(compactSections).toHaveCount(tabCount - 1);
  await expect(compactSections.first().locator('.workspace-overview-open')).toBeVisible();
  await expect(page.locator('#workspaceExploreOverview .workspace-overview-body')).toHaveCount(0);
  await expect(page.locator('#workspaceExploreOverview .full-workspace-visual')).toHaveCount(0);
  await expect(page.locator('#workspaceTabHint')).toContainText(`All ${tabCount} categories are open below`);
  await expectNoHorizontalOverflow(page);

  await selectPrimaryView(page, 'everything');
  await expect(page.locator('#everythingJumpNav [data-everything-jump]')).toHaveCount(9);
  await expect(page.locator('#all-workspace .clarity-workspace-carousel')).toBeVisible();
  const richGroupCount = await page.locator('#all-workspace .full-workspace-group').count();
  await expect(page.locator('#all-workspace [data-clarity-workspace-target]')).toHaveCount(richGroupCount);
  expect(richGroupCount).toBeGreaterThan(1);
  await expect(page.locator('#all-adaptive .adaptive-orchestrator')).toBeVisible();
  await expect(page.locator('#all-adaptive .adaptive-process')).toBeHidden();
  await page.locator('#all-adaptive [data-clarity-detail-toggle]').click();
  await expect(page.locator('#all-adaptive .adaptive-process')).toBeVisible();
  await expect(page.locator('#all-alarm .morning-concept-stage')).toBeVisible();
  await expect(page.locator('#all-alarm .alarm-flow')).toBeHidden();

  const signalTitleColor = await page.locator('.signal-reading-card > strong').evaluate(node => getComputedStyle(node).color);
  expect(signalTitleColor).not.toBe('rgb(255, 255, 255)');
  await expectNoHorizontalOverflow(page);
});

test('briefing controls make the demo feel configurable without pretending to send anything', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium-desktop', 'Settings behavior gets one deterministic desktop pass.');
  await enterPersonal(page);

  const trigger = page.locator('#briefControlsButton');
  await expect(trigger).toBeVisible();
  await expect(trigger).toHaveText('Briefing controls');
  await trigger.click();

  const dialog = page.locator('#briefControlsDialog');
  await expect(dialog).toHaveAttribute('open', '');
  await expect(dialog.locator('#briefControlsTitle')).toContainText('Personal controls');
  await expect(dialog.locator('[data-brief-control="scheduled"]')).toHaveAttribute('aria-checked', 'true');
  await expect(dialog.locator('[data-brief-control="musicOnOpen"]')).toHaveAttribute('aria-checked', 'false');

  await dialog.locator('[data-brief-control="musicOnOpen"]').click();
  await expect(dialog.locator('[data-brief-control="musicOnOpen"]')).toHaveAttribute('aria-checked', 'true');
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('spaces_demo_controls_v1') || '{}'));
  expect(saved.personal.musicOnOpen).toBe(true);

  await dialog.locator('#briefAddPerson').click();
  await expect(dialog.locator('#briefMemberRow')).toContainText('Guest');
  await expect(dialog.locator('#briefMemberRow')).toContainText('Pending');
  await expect(dialog.locator('#briefControlsStatus')).toContainText('Nothing was sent');

  await dialog.locator('[data-brief-style="full"]').click();
  await expect(dialog.locator('[data-brief-style="full"]')).toHaveAttribute('aria-pressed', 'true');
  await dialog.locator('#doneBriefControls').click();
  await expect(dialog).not.toHaveAttribute('open', '');
  await expect(trigger).toBeFocused();

  await selectPrimaryView(page, 'spaces');
  await expect(page.locator('[data-view-panel="spaces"] .space-quick-controls')).toBeVisible();
  await expect(page.locator('[data-view-panel="spaces"] .space-quick-controls button')).toHaveCount(4);
  await expectNoHorizontalOverflow(page);
});

test('family shared calendar survives the shorter Everything presentation', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium-desktop', 'Rich family preservation gets one deterministic desktop pass.');
  await prepareFreshPage(page);
  await page.locator('[data-entry-scenario="family"]').click();
  await page.locator('#openDemo').click();
  await expect(page.locator('body')).toHaveAttribute('data-scenario', 'family');

  await selectPrimaryView(page, 'everything');
  await expect(page.locator('#all-workspace .family-calendar-day')).toHaveCount(3);
  await expect(page.locator('#all-workspace .household-column')).toHaveCount(3);
  await expect(page.locator('#all-workspace .shopping-groups li')).toHaveCount(7);
  await expect(page.locator('#all-workspace .clarity-workspace-carousel')).toBeVisible();
  await expect(page.locator('#all-spaces .space-quick-controls')).toBeVisible();
  await expectNoHorizontalOverflow(page);
});
