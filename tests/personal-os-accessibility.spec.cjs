const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

function formatViolations(violations) {
  return violations.map(violation => {
    const nodes = violation.nodes.slice(0, 4).map(node => node.target.join(' ')).join(', ');
    return `${violation.id} (${violation.impact}): ${violation.help}. Targets: ${nodes}`;
  }).join('\n');
}

async function expectNoSeriousAxeViolations(page, label) {
  const results = await new AxeBuilder({ page })
    .exclude('iframe[src*="open.spotify.com"]')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();

  const blocking = results.violations.filter(violation => ['serious', 'critical'].includes(violation.impact));
  expect(blocking, `${label}\n${formatViolations(blocking)}`).toEqual([]);
}

async function openBrief(page, route = '/brief/') {
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#entry')).toBeVisible();
  await page.locator('[data-entry-scenario="personal"]').click();
  await page.locator('#openDemo').click();
  await expect(page.locator('[data-view-panel="today"]')).toBeVisible();
}

test('Brief entry has no serious automated WCAG violations', async ({ page }) => {
  await page.goto('/brief/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#entry')).toBeVisible();
  await expectNoSeriousAxeViolations(page, 'Brief entry');
});

test('Brief Today and How views have no serious automated WCAG violations', async ({ page }) => {
  await openBrief(page, '/brief/');
  await expectNoSeriousAxeViolations(page, 'Brief Today');

  const desktopHow = page.locator('#primaryNav [data-primary-view="how"]');
  if (await desktopHow.isVisible()) await desktopHow.click();
  else await page.locator('#mobileNav [data-primary-view="how"]').click();
  await expect(page.locator('[data-view-panel="how"]')).toBeVisible();
  await expectNoSeriousAxeViolations(page, 'Brief How');
});

test('Brief staging entry has no serious automated WCAG violations', async ({ page }) => {
  await page.goto('/brief-next/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#entry')).toBeVisible();
  await expectNoSeriousAxeViolations(page, 'Brief Next entry');
});

test('Personal OS document has no serious automated WCAG violations', async ({ page }) => {
  await page.goto('/doc/?theme=light', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('main')).toBeVisible();
  await expectNoSeriousAxeViolations(page, 'Personal OS document');
});
