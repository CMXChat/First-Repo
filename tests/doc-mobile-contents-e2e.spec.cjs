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
      const touch = {
        identifier: 1,
        target,
        clientX: x,
        clientY: y,
        pageX: x,
        pageY: y,
        screenX: x,
        screenY: y
      };
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

test('mobile Continuum doc keeps navigation compact and visuals in flow', async ({ page }, testInfo) => {
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
  await expect(page.locator('link[href="/assets/continuum-doc-v2.css?v=20260818-1"]')).toHaveCount(1);
  await expect(page.locator('link[href="/assets/continuum-doc-mobile-v3.css?v=20260818-1"]')).toHaveCount(1);
  await expect(trigger).toBeVisible();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(sourceLinks).toHaveCount(8);
  await expect(mobileLinks).toHaveCount(8);
  await expect(trigger.locator('#mobileContentsTriggerCurrent')).toContainText('Continuum in one minute');
  await expect(drawer).toHaveAttribute('aria-hidden', 'true');
  await expect(drawer).toHaveAttribute('inert', '');

  const mobileVisualState = await page.evaluate(() => {
    const trigger = document.querySelector('[data-mobile-contents-trigger="true"]');
    const map = document.querySelector('.continuum-map.compact-map');
    const firstNode = document.querySelector('.compact-map .continuum-node');
    const afterlife = document.querySelector('.afterlife-section');
    const afterlifeCard = document.querySelector('.afterlife-track article');
    const triggerStyle = getComputedStyle(trigger);
    const mapStyle = getComputedStyle(map);
    const nodeStyle = getComputedStyle(firstNode);
    const afterlifeStyle = getComputedStyle(afterlife);
    const afterlifeCardStyle = getComputedStyle(afterlifeCard);
    return {
      triggerWidth: Math.round(trigger.getBoundingClientRect().width),
      triggerRight: Math.round(window.innerWidth - trigger.getBoundingClientRect().right),
      mapDisplay: mapStyle.display,
      nodePosition: nodeStyle.position,
      afterlifeBackground: afterlifeStyle.backgroundImage,
      afterlifeCardBackground: afterlifeCardStyle.backgroundColor
    };
  });

  expect(mobileVisualState.triggerWidth).toBeLessThanOrEqual(52);
  expect(mobileVisualState.triggerRight).toBeLessThanOrEqual(16);
  expect(mobileVisualState.mapDisplay).toBe('grid');
  expect(mobileVisualState.nodePosition).toBe('relative');
  expect(mobileVisualState.afterlifeBackground).toContain('linear-gradient');
  expect(mobileVisualState.afterlifeCardBackground).not.toBe('rgba(10, 20, 34, 0.72)');
  await expect(page.locator('.afterlife-policy-chart')).toBeVisible();
  await expect(page.locator('.afterlife-policy-ring')).toBeVisible();
  await expect(page.locator('.afterlife-meter')).toHaveCount(2);
  await expectNoHorizontalOverflow(page);

  await trigger.click();
  await expect(page.locator('html')).toHaveClass(/doc-mobile-contents-open/);
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect(drawer).toHaveAttribute('aria-hidden', 'false');
  await expect(drawer).not.toHaveAttribute('inert', '');
  await expect(mobileLinks.first()).toBeFocused();

  await drawer.locator('a[href="#afterlife"]').click();
  await expect(page.locator('html')).not.toHaveClass(/doc-mobile-contents-open/);
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(page).toHaveURL(/#afterlife$/);
  await expect.poll(() => page.evaluate(() => document.getElementById('afterlife')?.getBoundingClientRect().top ?? 9999)).toBeLessThan(180);
  await expect(trigger.locator('#mobileContentsTriggerCurrent')).toHaveText('Afterlife');

  await page.locator('#engineering').scrollIntoViewIfNeeded();
  await expect(trigger.locator('#mobileContentsTriggerCurrent')).toHaveText('How it is programmed');
  await trigger.click();
  const engineeringLink = drawer.locator('a[href="#engineering"]');
  await expect(engineeringLink).toHaveAttribute('aria-current', 'location');
  await expect(drawer.locator('#mobileContentsCurrent')).toHaveText('How it is programmed');
  await expect(engineeringLink).toBeFocused();

  await engineeringLink.press('Escape');
  await expect(page.locator('html')).not.toHaveClass(/doc-mobile-contents-open/);
  await expect(trigger).toBeFocused();

  await trigger.click();
  await backdrop.click({ position: { x: 380, y: 420 } });
  await expect(page.locator('html')).not.toHaveClass(/doc-mobile-contents-open/);
  await expect(trigger).toBeFocused();

  await trigger.click();
  await swipeLeft(page, '[data-mobile-contents-drawer="true"]');
  await expect(page.locator('html')).not.toHaveClass(/doc-mobile-contents-open/);
  await expect(trigger).toBeFocused();
  await expectNoHorizontalOverflow(page);
});

test('desktop Continuum doc keeps the rail and hides the mobile reading control', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium-desktop', 'Desktop document isolation runs once in Chromium.');

  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/doc/?theme=light', { waitUntil: 'domcontentloaded' });

  await expect(page.locator('.document-rail .rail-panel').first()).toBeVisible();
  await expect(page.locator('.document-rail .document-toc a')).toHaveCount(8);
  await expect(page.locator('[data-mobile-contents-trigger="true"]')).toBeHidden();
  await expect(page.locator('[data-mobile-contents-drawer="true"]')).toBeHidden();
  await expect(page.locator('.afterlife-policy-chart')).toBeVisible();
  await expectNoHorizontalOverflow(page);
});
