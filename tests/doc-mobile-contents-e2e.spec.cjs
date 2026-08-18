const { test, expect } = require('@playwright/test');

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

async function swipeLeft(page, selector) {
  await page.locator(selector).evaluate((target) => {
    const emit = (type, x, y, active) => {
      const touch = { identifier: 1, target, clientX: x, clientY: y, pageX: x, pageY: y, screenX: x, screenY: y };
      const event = new Event(type, { bubbles: true, cancelable: true });
      Object.defineProperty(event, 'touches', { value: active ? [touch] : [] });
      Object.defineProperty(event, 'changedTouches', { value: [touch] });
      target.dispatchEvent(event);
    };
    emit('touchstart', 270, 280, true);
    emit('touchmove', 150, 282, true);
    emit('touchend', 78, 284, false);
  });
}

test('mobile Continuum doc keeps navigation in header and final visuals readable', async ({ page }, testInfo) => {
  test.skip(!['chromium-android', 'webkit-iphone'].includes(testInfo.project.name), 'Mobile document navigation runs in touch browser projects.');
  test.setTimeout(45000);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/doc/?theme=light', { waitUntil: 'domcontentloaded' });

  const trigger = page.locator('[data-mobile-contents-trigger="true"]');
  const drawer = page.locator('[data-mobile-contents-drawer="true"]');
  const backdrop = page.locator('[data-mobile-contents-backdrop="true"]');
  const sourceLinks = page.locator('.document-rail .document-toc a');
  const mobileLinks = drawer.locator('.mobile-document-toc a');

  await expect(page.locator('link[href="/assets/personal-os-doc-mobile-contents.css?v=20260809-1"]')).toHaveCount(1);
  await expect(page.locator('link[href="/assets/continuum-doc-final.css?v=20260818-3"]')).toHaveCount(1);
  await expect(page.locator('link[href="/assets/continuum-doc-promise.css?v=20260818-2"]')).toHaveCount(1);
  await expect(page.locator('link[href*="continuum-doc-v2"], link[href*="continuum-doc-mobile-v3"]')).toHaveCount(0);
  await expect(trigger).toBeVisible();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(sourceLinks).toHaveCount(8);
  await expect(mobileLinks).toHaveCount(8);
  await expect(trigger.locator('#mobileContentsTriggerCurrent')).toContainText('Continuum in one minute');
  await expect(drawer).toHaveAttribute('aria-hidden', 'true');
  await expect(drawer).toHaveAttribute('inert', '');

  const mobileVisualState = await page.evaluate(() => {
    const trigger = document.querySelector('[data-mobile-contents-trigger="true"]');
    const actions = document.querySelector('.document-actions');
    const railStatus = document.querySelector('.document-rail .rail-status');
    const network = document.querySelector('.hero-network');
    const firstNode = document.querySelector('.hero-network .network-card');
    const presenceTrack = document.querySelector('.presence-track');
    const firstPresenceStage = document.querySelector('.presence-stage');
    const firstJourney = document.querySelector('.journey-step');
    const controlRows = document.querySelector('.control-rows');
    const everydayFlow = document.querySelector('.everyday-flow');
    const afterlife = document.querySelector('.afterlife-section');
    const afterlifeCard = document.querySelector('.afterlife-step');
    return {
      triggerParentIsActions: trigger?.parentElement === actions,
      triggerWidth: Math.round(trigger.getBoundingClientRect().width),
      triggerPosition: getComputedStyle(trigger).position,
      railStatusDisplay: getComputedStyle(railStatus).display,
      networkDisplay: getComputedStyle(network).display,
      nodePosition: getComputedStyle(firstNode).position,
      presenceColumns: getComputedStyle(presenceTrack).gridTemplateColumns,
      presenceStageWidth: Math.round(firstPresenceStage.getBoundingClientRect().width),
      journeyWidth: Math.round(firstJourney.getBoundingClientRect().width),
      journeyDisplay: getComputedStyle(firstJourney).display,
      controlColumns: getComputedStyle(controlRows).gridTemplateColumns,
      everydayColumns: getComputedStyle(everydayFlow).gridTemplateColumns,
      afterlifeBackground: getComputedStyle(afterlife).backgroundImage,
      afterlifeCardBackground: getComputedStyle(afterlifeCard).backgroundColor
    };
  });

  expect(mobileVisualState.triggerParentIsActions).toBe(true);
  expect(mobileVisualState.triggerWidth).toBeLessThanOrEqual(48);
  expect(mobileVisualState.triggerPosition).toBe('relative');
  expect(mobileVisualState.railStatusDisplay).toBe('none');
  expect(mobileVisualState.networkDisplay).toBe('grid');
  expect(mobileVisualState.nodePosition).toBe('relative');
  expect(mobileVisualState.presenceColumns.split(' ').length).toBe(1);
  expect(mobileVisualState.presenceStageWidth).toBeGreaterThan(250);
  expect(mobileVisualState.journeyWidth).toBeGreaterThan(230);
  expect(mobileVisualState.journeyDisplay).toBe('block');
  expect(mobileVisualState.controlColumns.split(' ').length).toBe(1);
  expect(mobileVisualState.everydayColumns.split(' ').length).toBe(1);
  expect(mobileVisualState.afterlifeBackground).toContain('linear-gradient');
  expect(mobileVisualState.afterlifeCardBackground).not.toBe('rgba(255, 255, 255, 0.035)');

  await expect(page.locator('.hero-lead-first')).toBeVisible();
  await expect(page.locator('.hero-lead-core')).toContainText('somewhere durable to live');
  await expect(page.locator('.continuum-presence')).toBeVisible();
  await expect(page.locator('.presence-stage')).toHaveCount(4);
  await expect(page.locator('.presence-stage').nth(3)).toContainText('IF YOU CANNOT RESPOND');
  await expect(page.locator('.status-key .status-key-item')).toHaveCount(4);
  await expect(page.locator('.process-map')).toBeVisible();
  await expect(page.locator('.ai-answer')).toContainText('Why not just use AI by itself?');
  await expect(page.locator('.ai-compare')).toBeVisible();
  await expect(page.locator('.control-panel .control-row')).toHaveCount(5);
  await expect(page.locator('.people-map')).toBeVisible();
  await expect(page.locator('.library-tree')).toBeVisible();
  await expect(page.locator('.everyday-workflow')).toContainText('A client payment arrives');
  await expect(page.locator('.possibility-board')).toBeVisible();
  await expect(page.locator('.policy-ring')).toBeVisible();
  await expect(page.locator('.policy-config')).toHaveCount(4);
  await expect(page.locator('.afterlife-step.is-trigger')).toContainText('Incident, a saved record');
  await expect(page.locator('.stack-pipeline')).toBeVisible();
  await expect(page.locator('.roadmap-rich .roadmap-card')).toHaveCount(4);
  await expectNoHorizontalOverflow(page);

  await trigger.click();
  await expect(page.locator('html')).toHaveClass(/doc-mobile-contents-open/);
  await expect(drawer).toHaveAttribute('aria-hidden', 'false');
  await expect(mobileLinks.first()).toBeFocused();

  await drawer.locator('a[href="#afterlife"]').click();
  await expect(page.locator('html')).not.toHaveClass(/doc-mobile-contents-open/);
  await expect(page).toHaveURL(/#afterlife$/);
  await expect.poll(() => page.evaluate(() => document.getElementById('afterlife')?.getBoundingClientRect().top ?? 9999)).toBeLessThan(180);
  await expect(trigger.locator('#mobileContentsTriggerCurrent')).toHaveText('Afterlife');

  await page.locator('#engineering').scrollIntoViewIfNeeded();
  await expect(trigger.locator('#mobileContentsTriggerCurrent')).toHaveText('How the code works');
  await trigger.click();
  const engineeringLink = drawer.locator('a[href="#engineering"]');
  await expect(engineeringLink).toHaveAttribute('aria-current', 'location');
  await expect(engineeringLink).toBeFocused();
  await engineeringLink.press('Escape');
  await expect(trigger).toBeFocused();

  await trigger.click();
  await backdrop.click({ position: { x: 380, y: 420 } });
  await expect(trigger).toBeFocused();

  await trigger.click();
  await swipeLeft(page, '[data-mobile-contents-drawer="true"]');
  await expect(page.locator('html')).not.toHaveClass(/doc-mobile-contents-open/);
  await expectNoHorizontalOverflow(page);
});

test('desktop Continuum doc keeps rail, connected diagrams and final status system', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium-desktop', 'Desktop document isolation runs once in Chromium.');
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/doc/?theme=light', { waitUntil: 'domcontentloaded' });

  await expect(page.locator('.document-rail .rail-panel').first()).toBeVisible();
  await expect(page.locator('.document-rail .document-toc a')).toHaveCount(8);
  await expect(page.locator('[data-mobile-contents-trigger="true"]')).toBeHidden();
  await expect(page.locator('.network-lines')).toBeVisible();
  await expect(page.locator('.continuum-presence')).toBeVisible();
  await expect(page.locator('.presence-stage')).toHaveCount(4);
  await expect(page.locator('.status-key .status-key-item')).toHaveCount(4);
  await expect(page.locator('.ai-answer')).toBeVisible();
  await expect(page.locator('.control-panel')).toBeVisible();
  await expect(page.locator('.people-map')).toBeVisible();
  await expect(page.locator('.library-tree')).toBeVisible();
  await expect(page.locator('.everyday-workflow')).toBeVisible();
  await expect(page.locator('.afterlife-policy')).toBeVisible();
  await expect(page.locator('.roadmap-rich')).toBeVisible();
  await expectNoHorizontalOverflow(page);
});
