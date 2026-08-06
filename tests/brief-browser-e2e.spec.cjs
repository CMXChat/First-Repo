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
  await expect(page.locator('#entrySoundtrack')).not.toBeChecked();

  const background = await page.locator('html').evaluate(node => getComputedStyle(node).getPropertyValue('--bg').trim());
  expect(background).toBe('#edf3f8');
}

async function enterScenario(page, scenario = 'personal') {
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

async function expectPlainVisibleCopy(page) {
  const text = await page.locator('body').innerText();
  expect(text).not.toContain('...');
  expect(text).not.toContain('…');
  expect(text).not.toContain('Personalized does not mean unpredictable');
  expect(text).not.toContain('STABLE SHELL, ADAPTIVE COMPOSITION');
  expect(text).not.toContain('A strong demonstration with a clear path to the real platform');
}

async function selectPrimaryView(page, view) {
  const desktopButton = page.locator(`#primaryNav [data-primary-view="${view}"]`);
  if (await desktopButton.isVisible()) {
    await desktopButton.click();
    return;
  }
  await page.locator(`#mobileNav [data-primary-view="${view}"]`).click();
}

async function dispatchSwipe(page, selector, { startX, startY = 360, endX, endY = startY }) {
  await page.locator(selector).evaluate((target, points) => {
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

    emit('touchstart', points.startX, points.startY, true);
    emit('touchmove', points.endX, points.endY, true);
    emit('touchend', points.endX, points.endY, false);
  }, { startX, startY, endX, endY });
}

test('current Brief opens in light mode and remains usable across devices', async ({ page }) => {
  await openCurrentBrief(page);
  await enterScenario(page, 'personal');
  await expect(page.locator('#weatherTemperature')).toHaveText('82');
  await expect(page.locator('#primaryNav button')).toHaveCount(5);
  await expect(page.locator('#mobileNav button')).toHaveCount(5);
  await expect(page.locator('.section-pager')).toHaveCount(5);
  await expectNoHorizontalOverflow(page);
  await expectPlainVisibleCopy(page);

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

test('every briefing entry and context switch starts on Today', async ({ page }) => {
  await openCurrentBrief(page, '/brief/?scenario=team&view=everything&tab=plans');

  await page.locator('[data-entry-scenario="team"]').click();
  await page.locator('#openDemo').click();
  await expect(page.locator('body')).toHaveAttribute('data-view', 'today');
  await expect(page.locator('[data-view-panel="today"]')).toBeVisible();
  await expect(page.locator('[data-view-panel="everything"]')).toBeHidden();
  await expect(page).toHaveURL(/scenario=team/);
  await expect(page).toHaveURL(/view=today/);
  expect(new URL(page.url()).searchParams.has('tab')).toBe(false);

  await selectPrimaryView(page, 'how');
  await expect(page.locator('[data-view-panel="how"]')).toBeVisible();
  await page.locator('#resetDemo').click();
  await expect(page.locator('body')).toHaveAttribute('data-entered', 'false');
  expect(new URL(page.url()).searchParams.has('view')).toBe(false);

  await page.locator('[data-entry-scenario="relationship"]').click();
  await page.locator('#openDemo').click();
  await expect(page.locator('body')).toHaveAttribute('data-view', 'today');
  await expect(page.locator('[data-view-panel="today"]')).toBeVisible();

  await selectPrimaryView(page, 'workspace');
  await expect(page.locator('[data-view-panel="workspace"]')).toBeVisible();
  await page.locator('#scenarioSelect').selectOption('business');
  await expect(page.locator('body')).toHaveAttribute('data-scenario', 'business');
  await expect(page.locator('body')).toHaveAttribute('data-view', 'today');
  await expect(page.locator('[data-view-panel="today"]')).toBeVisible();
  await expect(page).toHaveURL(/scenario=business/);
  await expect(page).toHaveURL(/view=today/);
});

test('section pagers and guarded swipes move between views on mobile', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium-android', 'Touch navigation is validated in the Android project.');
  await openCurrentBrief(page);
  await enterScenario(page, 'trainer');

  await expect(page.locator('.section-pager')).toHaveCount(5);
  const todayPager = page.locator('[data-view-panel="today"] .section-pager');
  await expect(todayPager.locator('[data-section-view]')).toHaveCount(1);
  await expect(todayPager.locator('[data-section-view="workspace"]')).toContainText('Workspace');
  await expect(todayPager.locator('.section-swipe-hint')).toBeVisible();

  await todayPager.locator('[data-section-view="workspace"]').click();
  await expect(page.locator('body')).toHaveAttribute('data-view', 'workspace');
  await expect(page.locator('[data-view-panel="workspace"]')).toBeVisible();

  const workspacePager = page.locator('[data-view-panel="workspace"] .section-pager');
  await expect(workspacePager.locator('[data-section-view]')).toHaveCount(2);
  await workspacePager.locator('[data-section-view="spaces"]').click();
  await expect(page.locator('body')).toHaveAttribute('data-view', 'spaces');
  await workspacePager.locator('[data-section-view="today"]').click();
  await expect(page.locator('body')).toHaveAttribute('data-view', 'today');

  await dispatchSwipe(page, '#demoMain', { startX: 320, endX: 90 });
  await expect(page.locator('body')).toHaveAttribute('data-view', 'workspace');
  await dispatchSwipe(page, '#demoMain', { startX: 80, endX: 310 });
  await expect(page.locator('body')).toHaveAttribute('data-view', 'today');

  await dispatchSwipe(page, '#demoMain', { startX: 10, endX: 280 });
  await expect(page.locator('body')).toHaveAttribute('data-view', 'today');

  await selectPrimaryView(page, 'how');
  await expect(page.locator('body')).toHaveAttribute('data-view', 'how');
  await dispatchSwipe(page, '#memoryExampleTabs', { startX: 320, startY: 120, endX: 80, endY: 120 });
  await expect(page.locator('body')).toHaveAttribute('data-view', 'how');

  await dispatchSwipe(page, '#demoMain', { startX: 320, endX: 80 });
  await expect(page.locator('body')).toHaveAttribute('data-view', 'everything');
  await dispatchSwipe(page, '#demoMain', { startX: 320, endX: 80 });
  await expect(page.locator('body')).toHaveAttribute('data-view', 'everything');

  await page.locator('[data-view-panel="everything"] [data-section-view="today"]').click();
  await expect(page.locator('body')).toHaveAttribute('data-view', 'today');
  await expectNoHorizontalOverflow(page);
});

test('mobile How view remains contained and uses compact foundation cards', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await openCurrentBrief(page);
  await enterScenario(page, 'team');

  await page.locator('#mobileNav [data-primary-view="how"]').click();
  await expect(page.locator('[data-view-panel="how"]')).toBeVisible();
  await expect(page.locator('#intelligenceExplainers')).toBeVisible();

  await page.locator('[data-memory-example="preference"]').click();
  await page.locator('[data-space-example="team"]').click();
  await expectNoHorizontalOverflow(page);

  const layout = await page.evaluate(() => {
    const viewport = document.documentElement.clientWidth;
    const selectors = [
      '.foundation-map',
      '.foundation-map > *',
      '.intelligence-explainers',
      '.explainer-tabs',
      '.memory-comparison',
      '.comparison-card',
      '.space-example-panel'
    ];
    const rects = selectors.flatMap(selector =>
      [...document.querySelectorAll(selector)].map(node => {
        const rect = node.getBoundingClientRect();
        return { selector, left: rect.left, right: rect.right, width: rect.width, height: rect.height };
      })
    );
    const foundationHeights = [...document.querySelectorAll('.foundation-map > *')]
      .map(node => node.getBoundingClientRect().height);

    return {
      viewport,
      rects,
      maxFoundationHeight: Math.max(...foundationHeights)
    };
  });

  for (const rect of layout.rects) {
    expect(rect.left, `${rect.selector} should stay inside the left edge`).toBeGreaterThanOrEqual(-1);
    expect(rect.right, `${rect.selector} should stay inside the right edge`).toBeLessThanOrEqual(layout.viewport + 1);
    expect(rect.width, `${rect.selector} should not exceed the viewport`).toBeLessThanOrEqual(layout.viewport + 1);
  }
  expect(layout.maxFoundationHeight).toBeLessThanOrEqual(220);
});

test('Spotify failure never blocks entry or opens the drawer automatically', async ({ page }) => {
  await page.route('https://open.spotify.com/**', route => route.abort());
  await openCurrentBrief(page);

  await page.locator('#entrySoundtrack').check();
  await page.locator('[data-entry-scenario="team"]').click();
  await expect(page.locator('#openDemo')).toBeEnabled();
  await page.locator('#openDemo').click();

  await expect(page.locator('body')).toHaveAttribute('data-entered', 'true');
  await expect(page.locator('#mediaDrawer')).not.toHaveClass(/is-open/);
  await expect(page.locator('#mediaDrawer')).toHaveAttribute('inert', '');

  await page.locator('#mediaButton').click();
  await expect(page.locator('#mediaDrawer')).toHaveClass(/is-open/);
  await expect(page.locator('#mediaDrawer')).not.toHaveAttribute('inert', '');
  await expect(page.locator('#previewButton')).toBeHidden();
  await expect(page.locator('#spotifyFrame')).toHaveAttribute('src', /open\.spotify\.com\/embed\/track\//);

  await page.locator('.media-heading [data-close-media]').click();
  await expect(page.locator('#mediaDrawer')).not.toHaveClass(/is-open/);
  await expect(page.locator('#mediaDrawer')).toHaveAttribute('inert', '');
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

test('Doc renders the plain-language copy audit', async ({ page }) => {
  await page.goto('/doc/?theme=light', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#pageTitle')).toHaveText('One place to organize your personal life, shared Spaces, and work.');
  await expect(page.locator('#statusTitle')).toHaveText('What works now and what still needs building.');
  await expect(page.locator('#architectureTitle')).toHaveText('A technical plan that stays understandable and controllable.');
  await expect(page.locator('#finalCtaTitle')).toHaveText('Open the current Personal OS Brief demo.');
  await expect(page.locator('.status-list').first()).toContainText('A matching `/brief-next/` route used for testing');
  await expectPlainVisibleCopy(page);
});