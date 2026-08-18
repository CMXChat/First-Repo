const { test, expect } = require('@playwright/test');

async function noHorizontalOverflow(page) {
  return page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
}

test('desktop light mode keeps Afterlife readable and compact', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium-desktop', 'Desktop visual QA runs in Chromium.');
  await page.setViewportSize({ width: 1393, height: 823 });
  await page.goto('/doc/?theme=light', { waitUntil: 'domcontentloaded' });
  await page.locator('#afterlife').scrollIntoViewIfNeeded();

  await expect(page.locator('link[href="/assets/continuum-doc-qa.css?v=20260818-1"]')).toHaveCount(1);

  const state = await page.evaluate(() => {
    const section = document.querySelector('.afterlife-section');
    const normal = document.querySelector('.afterlife-step');
    const trigger = document.querySelector('.afterlife-step.is-trigger');
    const normalTitle = normal?.querySelector('strong');
    const normalCopy = normal?.querySelector('small');
    const triggerTitle = trigger?.querySelector('strong');
    const triggerCopy = trigger?.querySelector('small');
    const triggerStatus = trigger?.querySelector('em');
    return {
      sectionBackground: getComputedStyle(section).backgroundImage,
      normalHeight: Math.round(normal.getBoundingClientRect().height),
      triggerHeight: Math.round(trigger.getBoundingClientRect().height),
      normalDisplay: getComputedStyle(normal).display,
      normalTitleColor: getComputedStyle(normalTitle).color,
      normalCopyColor: getComputedStyle(normalCopy).color,
      triggerTitleColor: getComputedStyle(triggerTitle).color,
      triggerCopyColor: getComputedStyle(triggerCopy).color,
      triggerBackground: getComputedStyle(trigger).backgroundImage,
      triggerStatusPosition: getComputedStyle(triggerStatus).position
    };
  });

  expect(state.sectionBackground).toContain('linear-gradient');
  expect(state.normalDisplay).toBe('grid');
  expect(state.normalHeight).toBeLessThan(140);
  expect(state.triggerHeight).toBeLessThan(150);
  expect(state.normalTitleColor).toBe('rgb(16, 32, 56)');
  expect(state.normalCopyColor).toBe('rgb(79, 102, 124)');
  expect(state.triggerTitleColor).toBe('rgb(107, 57, 5)');
  expect(state.triggerCopyColor).toBe('rgb(79, 102, 124)');
  expect(state.triggerBackground).toContain('linear-gradient');
  expect(state.triggerStatusPosition).toBe('static');
  expect(await noHorizontalOverflow(page)).toBeLessThanOrEqual(1);
});

test('mobile light mode keeps Afterlife stacked and readable', async ({ page }, testInfo) => {
  test.skip(!['chromium-android', 'webkit-iphone'].includes(testInfo.project.name), 'Mobile visual QA runs in touch projects.');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/doc/?theme=light', { waitUntil: 'domcontentloaded' });
  await page.locator('#afterlife').scrollIntoViewIfNeeded();

  const state = await page.evaluate(() => {
    const trigger = document.querySelector('.afterlife-step.is-trigger');
    const copy = trigger?.querySelector('small');
    const status = trigger?.querySelector('em');
    return {
      columns: getComputedStyle(trigger).gridTemplateColumns,
      titleColor: getComputedStyle(trigger.querySelector('strong')).color,
      copyColor: getComputedStyle(copy).color,
      copySize: parseFloat(getComputedStyle(copy).fontSize),
      statusJustify: getComputedStyle(status).justifySelf,
      width: Math.round(trigger.getBoundingClientRect().width)
    };
  });

  expect(state.columns.split(' ').length).toBe(1);
  expect(state.titleColor).toBe('rgb(107, 57, 5)');
  expect(state.copyColor).toBe('rgb(79, 102, 124)');
  expect(state.copySize).toBeGreaterThanOrEqual(13);
  expect(state.statusJustify).toBe('start');
  expect(state.width).toBeGreaterThan(250);
  expect(await noHorizontalOverflow(page)).toBeLessThanOrEqual(1);
});
