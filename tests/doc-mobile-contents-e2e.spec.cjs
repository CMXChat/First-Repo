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

test('mobile doc Contents drawer tracks reading position and closes cleanly', async ({ page }, testInfo) => {
  test.skip(!['chromium-android', 'webkit-iphone'].includes(testInfo.project.name), 'Mobile document navigation runs in touch browser projects.');
  test.setTimeout(45000);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/doc/?theme=light', { waitUntil: 'domcontentloaded' });

  const trigger = page.locator('[data-mobile-contents-trigger="true"]');
  const drawer = page.locator('[data-mobile-contents-drawer="true"]');
  const backdrop = page.locator('[data-mobile-contents-backdrop="true"]');
  const sourceLinks = page.locator('.document-rail .document-toc a');
  const mobileLinks = drawer.locator('.mobile-document-toc a');

  await expect(page.locator('link[href*="personal-os-doc-mobile-contents.css"]')).toHaveCount(1);
  await expect(trigger).toBeVisible();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(sourceLinks).toHaveCount(15);
  await expect(mobileLinks).toHaveCount(15);
  await expect(trigger.locator('#mobileContentsTriggerCurrent')).toContainText('The whole idea');
  await expect(drawer).toHaveAttribute('aria-hidden', 'true');
  await expect(drawer).toHaveAttribute('inert', '');
  await expectNoHorizontalOverflow(page);

  await trigger.click();
  await expect(page.locator('html')).toHaveClass(/doc-mobile-contents-open/);
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect(drawer).toHaveAttribute('aria-hidden', 'false');
  await expect(drawer).not.toHaveAttribute('inert', '');
  await expect(mobileLinks.first()).toBeFocused();

  await drawer.locator('a[href="#memory"]').click();
  await expect(page.locator('html')).not.toHaveClass(/doc-mobile-contents-open/);
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(page).toHaveURL(/#memory$/);
  await expect.poll(() => page.evaluate(() => document.getElementById('memory')?.getBoundingClientRect().top ?? 9999)).toBeLessThan(180);
  await expect(trigger.locator('#mobileContentsTriggerCurrent')).toHaveText('Memory');

  await page.locator('#architecture').scrollIntoViewIfNeeded();
  await expect(trigger.locator('#mobileContentsTriggerCurrent')).toHaveText('Architecture');
  await trigger.click();
  const architectureLink = drawer.locator('a[href="#architecture"]');
  await expect(architectureLink).toHaveAttribute('aria-current', 'location');
  await expect(drawer.locator('#mobileContentsCurrent')).toHaveText('Architecture');
  await expect(architectureLink).toBeFocused();

  await architectureLink.press('Escape');
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

test('desktop doc keeps the existing rail and hides the mobile reading control', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium-desktop', 'Desktop document isolation runs once in Chromium.');

  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/doc/?theme=light', { waitUntil: 'domcontentloaded' });

  await expect(page.locator('.document-rail .rail-panel').first()).toBeVisible();
  await expect(page.locator('.document-rail .document-toc a')).toHaveCount(15);
  await expect(page.locator('[data-mobile-contents-trigger="true"]')).toBeHidden();
  await expect(page.locator('[data-mobile-contents-drawer="true"]')).toBeHidden();
  await expectNoHorizontalOverflow(page);
});
