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

test('desktop keeps the rich Today view and exposes one briefing settings control', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium-desktop', 'Desktop composition is checked in Chromium.');
  await openDemo(page);

  await expect(page.locator('#todayFocusNav')).toBeHidden();
  await expect(page.locator('.today-grid .weather-card')).toBeVisible();
  await expect(page.locator('.today-grid .stats-panel')).toBeVisible();
  await expect(page.locator('.today-lower .flow-card')).toBeVisible();
  await expect(page.locator('#briefingSettingsButton')).toHaveCount(1);

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

  await expect(page.locator('#todayFocusNav')).toBeVisible();
  await expect(page.locator('.today-grid .weather-card')).toBeVisible();
  await expect(page.locator('.today-grid .stats-panel')).toBeHidden();
  await expect(page.locator('.today-lower .flow-card')).toBeHidden();

  await page.locator('[data-today-focus="numbers"]').click();
  await expect(page.locator('.today-grid .weather-card')).toBeHidden();
  await expect(page.locator('.today-grid .stats-panel')).toBeVisible();

  await page.locator('[data-today-focus="flow"]').click();
  await expect(page.locator('.today-grid')).toBeHidden();
  await expect(page.locator('.today-lower .flow-card')).toBeVisible();

  await page.locator('#briefingSettingsButton').click();
  await page.locator('#briefSettingStyle').selectOption('full');
  await page.locator('#doneBriefingSettings').click();
  await expect(page.locator('#todayFocusNav')).toBeHidden();
  await expect(page.locator('.today-grid .weather-card')).toBeVisible();
  await expect(page.locator('.today-grid .stats-panel')).toBeVisible();
  await expect(page.locator('.today-lower .flow-card')).toBeVisible();

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
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
  await expect(page.locator('.workspace-preview-card')).toHaveCount(4);
  await expect(page.locator('.family-calendar, .household-board, .shopping-groups, .detail-grid').first()).toBeVisible();
});

test('Everything keeps the full view and uses plain copy for the numbers section', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium-desktop', 'Full-view copy is checked in Chromium.');
  await openDemo(page);
  await openView(page, 'everything');

  await expect(page.locator('#all-overview')).toBeVisible();
  await expect(page.locator('#all-weather')).toBeVisible();
  await expect(page.locator('#all-signals')).toBeVisible();
  await expect(page.locator('#all-flow')).toBeVisible();
  await expect(page.locator('#all-workspace')).toBeVisible();
  await expect(page.locator('#all-spaces')).toBeVisible();
  await expect(page.locator('#all-adaptive')).toBeVisible();
  await expect(page.locator('#all-alarm')).toBeVisible();
  await expect(page.locator('#all-privacy')).toBeVisible();
  await expect(page.locator('#all-signals')).toContainText('Useful numbers and what they mean');
  await expect(page.locator('#all-signals')).not.toContainText('read as one signal');
});
