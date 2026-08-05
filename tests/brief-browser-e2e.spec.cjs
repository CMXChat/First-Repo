const { test, expect } = require('@playwright/test');

async function prepareFreshPage(page, route = '/brief/') {
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.reload({ waitUntil: 'domcontentloaded' });
}

async function openCurrentBrief(page, route = '/brief/') {
  await prepareFreshPage(page, route);
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#edf3f8');
  await expect(page.locator('#entry')).toBeVisible();
  await expect(page.locator('[data-entry-scenario]')).toHaveCount(5);
  await expect(page.locator('#entrySoundtrack')).toBeChecked();

  const background = await page.locator('html').evaluate(node => getComputedStyle(node).getPropertyValue('--bg').trim());
  expect(background).toBe('#edf3f8');
}

async function enterScenario(page, scenario = 'personal') {
  await page.locator('#entrySoundtrack').uncheck();
  await page.locator(`[data-entry-scenario="${scenario}"]`).click();
  await expect(page.locator('#openDemo')).toBeEnabled();
  await page.locator('#openDemo').click();
  await expect(page.locator('body')).toHaveAttribute('data-entered', 'true');
  await expect(page.locator('#demoApp')).toHaveAttribute('aria-hidden', 'false');
  await expect(page.locator('[data-view-panel="today"]')).toBeVisible();
  await expect(page.locator('#statsGrid .stat-card')).toHaveCount(4);
}

async function expectNoHorizontalOverflow(page) {
  const overflow = await page.evaluate(() => ({
    document: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    body: document.body.scrollWidth - document.body.clientWidth
  }));
  expect(overflow.document).toBeLessThanOrEqual(1);
  expect(overflow.body).toBeLessThanOrEqual(1);
}

test('current Brief opens in light mode and remains usable across devices', async ({ page }) => {
  await openCurrentBrief(page);
  await enterScenario(page, 'personal');
  await expect(page.locator('#weatherTemperature')).toHaveText('82');
  await expect(page.locator('#primaryNav button')).toHaveCount(5);
  await expect(page.locator('#mobileNav button')).toHaveCount(5);
  await expectNoHorizontalOverflow(page);

  await page.locator('#themeButton').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#05070b');

  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

  await page.evaluate(() => localStorage.removeItem('personal_os_brief_theme_v2'));
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#edf3f8');
});

test('explicit theme query remains reversible on production and staging routes', async ({ page }) => {
  await prepareFreshPage(page);

  for (const route of ['/brief/', '/brief-next/']) {
    await page.goto(`${route}?theme=dark`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#05070b');

    await page.goto(`${route}?theme=light`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#edf3f8');
    await expect(page.locator('#entry')).toBeVisible();
    await expectNoHorizontalOverflow(page);
  }
});

test('Doc final demo CTA stays contained on a narrow mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('/doc/?theme=light', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.locator('link[data-personal-os-mobile-fixes="true"]')).toHaveCount(1);

  const cta = page.locator('.final-cta');
  await cta.scrollIntoViewIfNeeded();
  await expect(cta).toBeVisible();

  const containment = await page.evaluate(() => {
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
      viewport,
      headingOverflow: heading ? heading.scrollWidth - heading.clientWidth : 0,
      sectionColumns: section ? getComputedStyle(section).gridTemplateColumns : ''
    };
  });

  expect(containment.documentOverflow).toBeLessThanOrEqual(1);
  expect(containment.bodyOverflow).toBeLessThanOrEqual(1);
  expect(containment.sectionRight).toBeLessThanOrEqual(containment.viewport + 1);
  expect(containment.buttonRight).toBeLessThanOrEqual(containment.viewport + 1);
  expect(containment.headingOverflow).toBeLessThanOrEqual(1);
  expect(containment.sectionColumns).not.toBe('none');
});
