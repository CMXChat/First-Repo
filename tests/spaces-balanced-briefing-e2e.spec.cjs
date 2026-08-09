'use strict';

const { test, expect } = require('@playwright/test');

async function openDemo(page, scenario = 'personal') {
  await page.route('https://open.spotify.com/**', route => route.abort());
  await page.goto('/spaces/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.locator(`[data-entry-scenario="${scenario}"]`).click();
  await expect(page.locator('#openDemo')).toBeEnabled();
  await page.locator('#openDemo').click();
  await expect(page.locator('body')).toHaveAttribute('data-entered', 'true');
}

async function openView(page, view) {
  const desktop = page.locator(`#primaryNav [data-primary-view="${view}"]`);
  if (await desktop.isVisible()) await desktop.click();
  else await page.locator(`#mobileNav [data-primary-view="${view}"]`).click();
}

async function expectNoHorizontalOverflow(page) {
  const overflow = await page.evaluate(() => ({
    document: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    body: document.body.scrollWidth - document.body.clientWidth,
    windowX: window.scrollX
  }));
  expect(overflow.document).toBeLessThanOrEqual(1);
  expect(overflow.body).toBeLessThanOrEqual(1);
  expect(overflow.windowX).toBe(0);
}

async function expectWorkspaceDestinationAligned(page) {
  await expect.poll(() => page.evaluate(() => {
    const topbar = document.querySelector('.topbar')?.getBoundingClientRect();
    const navigation = document.querySelector('#workspaceTabNavigation')?.getBoundingClientRect();
    const heading = document.querySelector('#workspacePanel .workspace-panel-heading')?.getBoundingClientRect();
    if (!topbar || !navigation || !heading) return false;
    const gap = navigation.top - topbar.bottom;
    return gap >= 4 && gap <= 28 && heading.top >= navigation.bottom && heading.top < innerHeight;
  }), { timeout: 4000 }).toBe(true);
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

test('desktop keeps the rich Today view and exposes one briefing settings control', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium-desktop', 'Desktop composition is checked in Chromium.');
  await openDemo(page);

  await expect(page.locator('body')).not.toHaveAttribute('aria-pressed', /.+/);
  await expect(page.locator('#todayFocusNav')).toBeHidden();
  await expect(page.locator('.today-grid .weather-card')).toBeVisible();
  await expect(page.locator('.today-grid .stats-panel')).toBeVisible();
  await expect(page.locator('.today-lower .flow-card')).toBeVisible();
  await expect(page.locator('#briefingSettingsButton')).toBeVisible();

  await page.locator('#briefingSettingsButton').click();
  await expect(page.locator('#briefingSettingsDialog')).toBeVisible();
  await expect(page.locator('#briefingSettingsTitle')).toHaveText('Choose how this Space opens');
  await expect(page.locator('#briefSettingSchedule')).toHaveAttribute('role', 'switch');
  await expect(page.locator('#briefSettingStyle')).toHaveValue('focused');
  await expect(page.locator('.briefing-settings-intro')).toContainText('nothing is sent');

  await page.locator('#briefSettingRouting').click();
  await expect(page.locator('#briefingSettingsDialog')).toBeHidden();
  await expect(page.locator('#priorityRoutingDialog')).toBeVisible();
});

test('phone focus keeps dense Today modules readable and Full review restores the whole view', async ({ page }, testInfo) => {
  test.skip(!['chromium-android', 'webkit-iphone'].includes(testInfo.project.name), 'Phone composition is checked on phone projects.');
  await openDemo(page);

  await expect(page.locator('body')).not.toHaveAttribute('aria-pressed', /.+/);
  await expect(page.locator('#todayFocusNav')).toBeVisible();
  await expect(page.locator('.today-grid .weather-card')).toBeVisible();
  await expect(page.locator('.today-grid .stats-panel')).toBeHidden();
  await expect(page.locator('.today-lower .flow-card')).toBeHidden();

  await page.locator('button[data-today-focus="numbers"]').click();
  await expect(page.locator('body')).not.toHaveAttribute('aria-pressed', /.+/);
  await expect(page.locator('button[data-today-focus="numbers"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.today-grid .weather-card')).toBeHidden();
  await expect(page.locator('.today-grid .stats-panel')).toBeVisible();

  await page.locator('button[data-today-focus="flow"]').click();
  await expect(page.locator('body')).not.toHaveAttribute('aria-pressed', /.+/);
  await expect(page.locator('button[data-today-focus="flow"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.today-grid')).toBeHidden();
  await expect(page.locator('.today-lower .flow-card')).toBeVisible();

  await page.locator('#briefingSettingsButton').click();
  await page.locator('#briefSettingStyle').selectOption('full');
  await page.locator('#doneBriefingSettings').click();
  await expect(page.locator('#todayFocusNav')).toBeHidden();
  await expect(page.locator('.today-grid .weather-card')).toBeVisible();
  await expect(page.locator('.today-grid .stats-panel')).toBeVisible();
  await expect(page.locator('.today-lower .flow-card')).toBeVisible();
  await expectNoHorizontalOverflow(page);
});

test('Explore keeps one category rich and the rest compact', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium-desktop', 'Explore composition is checked in desktop Chromium.');
  await openDemo(page, 'family');
  await openView(page, 'workspace');

  await expect(page.locator('#workspacePanel')).toBeVisible();
  await expect(page.locator('#workspaceExploreOverview')).toBeVisible();
  await expect(page.locator('.workspace-preview-card')).toHaveCount(4);
  await expect(page.locator('#workspaceTitle')).toHaveText('Explore the Family briefing');
  await expect(page.locator('.workspace-preview-intro')).toContainText('The current category keeps the full detail');

  const firstPreview = page.locator('.workspace-preview-card').first();
  const target = await firstPreview.getAttribute('data-workspace-preview');
  await firstPreview.locator('.workspace-preview-open').click();
  await expect(page.locator(`[data-workspace-tab="${target}"]`)).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator(`.workspace-preview-card[data-workspace-preview="${target}"]`)).toHaveCount(0);
  await expect(page.locator('.workspace-preview-card')).toHaveCount(4);
  await expect(page.locator('.family-calendar, .household-board, .shopping-groups, .detail-grid').first()).toBeVisible();
});

test('Explore arrows and preview links keep the selected category exact', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium-desktop', 'Exact Explore navigation is checked once in Chromium at desktop and phone widths.');
  test.setTimeout(60000);

  for (const viewport of [{ width: 1140, height: 844 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    await openDemo(page, 'accounting');
    await openView(page, 'workspace');

    const tabs = page.locator('#workspaceTabs [role="tab"]');
    const next = page.locator('[data-workspace-tab-step="next"]');
    const previous = page.locator('[data-workspace-tab-step="previous"]');
    const hint = page.locator('#workspaceTabHint');
    await expect(tabs).toHaveCount(5);
    await expect(page.locator('.workspace-preview-card')).toHaveCount(4);
    await expect(hint).toContainText('Section 1 of 5 is open');
    await expect(next).toBeVisible();
    await expect(next).toBeEnabled();

    const firstTab = await tabs.first().getAttribute('data-workspace-tab');
    await next.click();
    const selected = page.locator('#workspaceTabs [role="tab"][aria-selected="true"]');
    const selectedId = await selected.getAttribute('data-workspace-tab');
    expect(selectedId).not.toBe(firstTab);
    await expect(hint).toContainText('Section 2 of 5 is open');
    await expect(page.locator(`.workspace-preview-card[data-workspace-preview="${selectedId}"]`)).toHaveCount(0);
    await expect(page.locator(`.workspace-preview-card[data-workspace-preview="${firstTab}"]`)).toBeVisible();
    await expect(previous).toBeEnabled();
    await expectWorkspaceDestinationAligned(page);

    const preview = page.locator('.workspace-preview-card').last();
    const previewTarget = await preview.getAttribute('data-workspace-preview');
    await preview.locator('.workspace-preview-open').click();
    await expect(page.locator(`[data-workspace-tab="${previewTarget}"]`)).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator(`.workspace-preview-card[data-workspace-preview="${previewTarget}"]`)).toHaveCount(0);
    await expectWorkspaceDestinationAligned(page);
    await expectNoHorizontalOverflow(page);
  }
});

test('Today highlight links land on the exact rich Explore category', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium-desktop', 'Highlight positioning is checked once in Chromium at desktop and phone widths.');
  test.setTimeout(60000);

  for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    await openDemo(page, 'personal');

    const highlight = page.locator('.space-highlight').first();
    const highlightTarget = await highlight.getAttribute('data-highlight-tab');
    await highlight.click();
    await expect(page.locator('[data-view-panel="workspace"]')).toBeVisible();
    await expect(page.locator(`[data-workspace-tab="${highlightTarget}"]`)).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator(`.workspace-preview-card[data-workspace-preview="${highlightTarget}"]`)).toHaveCount(0);
    await expect(page.locator('.workspace-preview-card')).toHaveCount(4);
    await expectWorkspaceDestinationAligned(page);

    const preview = page.locator('.workspace-preview-card').first();
    const previewTarget = await preview.getAttribute('data-workspace-preview');
    await preview.locator('.workspace-preview-open').click();
    await expect(page.locator(`[data-workspace-tab="${previewTarget}"]`)).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator(`.workspace-preview-card[data-workspace-preview="${highlightTarget}"]`)).toBeVisible();
    await expect(page.locator(`.workspace-preview-card[data-workspace-preview="${previewTarget}"]`)).toHaveCount(0);
    await expectWorkspaceDestinationAligned(page);
  }
});

test('Everything keeps the full view and uses plain copy for the numbers section', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium-desktop', 'Full-view copy is checked in Chromium.');
  await openDemo(page);
  await openView(page, 'everything');

  for (const id of ['all-overview', 'all-weather', 'all-signals', 'all-flow', 'all-workspace', 'all-spaces', 'all-adaptive', 'all-alarm', 'all-privacy']) {
    await expect(page.locator(`#${id}`)).toBeVisible();
  }
  await expect(page.locator('#all-signals')).toContainText('Useful numbers and what they mean');
  await expect(page.locator('#all-signals')).not.toContainText('read as one signal');

  for (const id of ['all-weather', 'all-workspace', 'all-privacy', 'all-overview']) {
    await page.locator(`[data-everything-jump="${id}"]`).click();
    await expect(page.locator(`[data-everything-jump="${id}"]`)).toHaveAttribute('aria-current', 'location');
    await expectEverythingDestinationAligned(page, id);
  }
});

test('current Doc assets, copy and final CTA stay intact after the source-driven cleanup', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('/doc/?theme=light', { waitUntil: 'domcontentloaded' });

  await expect(page.locator('link[href="/assets/personal-os-doc-mobile-fixes.css?v=20260808-1"]')).toHaveCount(1);
  await expect(page.locator('link[href="/assets/personal-os-doc-mobile-contents.css?v=20260809-1"]')).toHaveCount(1);
  await expect(page.locator('#pageTitle')).toHaveText('One briefing for the part of life you’re in');
  await expect(page.locator('.hero-lead')).toContainText('People, sources, memory, goals, and permissions stay attached to the Space');
  await expect(page.locator('#statusTitle')).toHaveText('The current demo shows the product direction and the work still required');
  await expect(page.locator('#architectureTitle')).toHaveText('Keep the product architecture understandable and controllable');
  await expect(page.locator('#finalCtaTitle')).toHaveText('Explore the current Spaces Brief demo');
  await expect(page.locator('.product-preview-stage')).toHaveCount(1);
  await expect(page.locator('#investment')).toHaveCount(1);

  const visibleText = await page.locator('body').innerText();
  expect(visibleText).not.toContain('...');
  expect(visibleText).not.toContain('…');
  expect(visibleText).not.toContain('—');

  const cta = page.locator('.final-cta');
  await cta.scrollIntoViewIfNeeded();
  await expect(cta).toBeVisible();
  const fit = await page.evaluate(() => {
    const section = document.querySelector('.final-cta');
    const heading = section?.querySelector('h2');
    const button = section?.querySelector('.button');
    const viewport = document.documentElement.clientWidth;
    const sectionRect = section?.getBoundingClientRect();
    const buttonRect = button?.getBoundingClientRect();
    return {
      documentOverflow: document.documentElement.scrollWidth - viewport,
      bodyOverflow: document.body.scrollWidth - document.body.clientWidth,
      sectionRight: sectionRect?.right || 0,
      buttonRight: buttonRect?.right || 0,
      headingOverflow: heading ? heading.scrollWidth - heading.clientWidth : 0,
      viewport
    };
  });
  expect(fit.documentOverflow).toBeLessThanOrEqual(1);
  expect(fit.bodyOverflow).toBeLessThanOrEqual(1);
  expect(fit.sectionRight).toBeLessThanOrEqual(fit.viewport + 1);
  expect(fit.buttonRight).toBeLessThanOrEqual(fit.viewport + 1);
  expect(fit.headingOverflow).toBeLessThanOrEqual(1);
});
