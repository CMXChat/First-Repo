'use strict';

const { test, expect } = require('@playwright/test');

async function openDemo(page, scenario = 'team') {
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

async function expectCircularClose(page, selector) {
  const geometry = await page.locator(selector).evaluate(button => {
    const rect = button.getBoundingClientRect();
    const style = getComputedStyle(button);
    return {
      width: rect.width,
      height: rect.height,
      minWidth: parseFloat(style.minWidth),
      minHeight: parseFloat(style.minHeight),
      radius: parseFloat(style.borderTopLeftRadius),
      paddingLeft: parseFloat(style.paddingLeft),
      paddingRight: parseFloat(style.paddingRight)
    };
  });

  expect(Math.abs(geometry.width - geometry.height)).toBeLessThanOrEqual(1);
  expect(geometry.width).toBeGreaterThanOrEqual(40);
  expect(geometry.minWidth).toBeGreaterThanOrEqual(40);
  expect(geometry.minHeight).toBeGreaterThanOrEqual(40);
  expect(geometry.radius).toBeGreaterThanOrEqual((geometry.width / 2) - 1);
  expect(geometry.paddingLeft).toBe(0);
  expect(geometry.paddingRight).toBe(0);
}

test('priority delivery close control stays circular on desktop and phone widths', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium-desktop', 'Geometry is checked once in Chromium at both widths.');

  for (const viewport of [{ width: 1280, height: 900 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    await openDemo(page, 'team');
    await expect(page.locator('#priorityRoutingButton')).toBeVisible();
    await page.locator('#priorityRoutingButton').click();
    await expect(page.locator('#priorityRoutingDialog')).toBeVisible();
    await expectCircularClose(page, '#closePriorityRouting');
    await expectNoHorizontalOverflow(page);
    await page.locator('#closePriorityRouting').click();
    await expect(page.locator('#priorityRoutingDialog')).toBeHidden();
  }
});

test('existing briefing views gain depth without changing their information structure', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium-desktop', 'Visual surface checks run once in desktop Chromium.');
  await page.setViewportSize({ width: 1280, height: 900 });
  await openDemo(page, 'personal');

  const todaySurface = await page.locator('.hero-copy').evaluate(node => {
    const style = getComputedStyle(node);
    return { background: style.backgroundImage, shadow: style.boxShadow };
  });
  expect(todaySurface.background).not.toBe('none');
  expect(todaySurface.shadow).not.toBe('none');
  await expect(page.locator('.stats-grid .stat-card')).toHaveCount(4);

  await openView(page, 'spaces');
  await expect(page.locator('.space-card')).toHaveCount(2);
  const spacesSurface = await page.locator('.space-card').first().evaluate(node => {
    const style = getComputedStyle(node);
    return { background: style.backgroundImage, shadow: style.boxShadow };
  });
  expect(spacesSurface.background).not.toBe('none');
  expect(spacesSurface.shadow).not.toBe('none');
  await expect(page.locator('.permission-strip article')).toHaveCount(4);

  await openView(page, 'how');
  const foundationSurface = await page.locator('.foundation-map').evaluate(node => {
    const style = getComputedStyle(node);
    return { background: style.backgroundImage, shadow: style.boxShadow };
  });
  expect(foundationSurface.background).not.toBe('none');
  expect(foundationSurface.shadow).not.toBe('none');

  await openView(page, 'everything');
  await expect(page.locator('.full-section').first()).toBeVisible();
  const fullSurface = await page.locator('.full-section').first().evaluate(node => {
    const style = getComputedStyle(node);
    return { background: style.backgroundImage, shadow: style.boxShadow };
  });
  expect(fullSurface.background).not.toBe('none');
  expect(fullSurface.shadow).not.toBe('none');
  await expectNoHorizontalOverflow(page);
});

test('visual refinement remains contained on the phone briefing', async ({ page }, testInfo) => {
  test.skip(!['chromium-android', 'webkit-iphone'].includes(testInfo.project.name), 'Phone containment runs on touch projects.');
  await page.setViewportSize({ width: 390, height: 844 });
  await openDemo(page, 'family');

  await expectNoHorizontalOverflow(page);
  await openView(page, 'spaces');
  await expectNoHorizontalOverflow(page);
  await openView(page, 'how');
  await expectNoHorizontalOverflow(page);
  await openView(page, 'everything');
  await expectNoHorizontalOverflow(page);
});
