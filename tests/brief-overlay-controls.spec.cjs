const { test, expect } = require('@playwright/test');

async function enterPersonalBriefing(page) {
  await page.goto('/brief/?overlay-test=1', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#briefEntryRadio')).toBeVisible();
  await page.locator('.brief-entry-radio-card.is-individual').click();
  await expect(page.locator('#enterBrief')).toBeEnabled();
  await page.locator('#enterBrief').click();
  await expect(page.locator('body')).not.toHaveClass(/is-locked/);
  await expect(page.locator('body')).toHaveClass(/brief-system-ready/);
  await expect(page.locator('body')).toHaveClass(/brief-personal-os-stability-ready/);
  await expect(page.locator('#briefSystemHeader')).toBeVisible();
}

async function surfaceState(locator) {
  return locator.evaluate(node => {
    const rect = node.getBoundingClientRect();
    const style = getComputedStyle(node);
    const x = Math.max(0, Math.min(window.innerWidth - 1, rect.left + Math.max(1, rect.width / 2)));
    const y = Math.max(0, Math.min(window.innerHeight - 1, rect.top + Math.max(1, Math.min(rect.height / 2, 120))));
    const top = document.elementFromPoint(x, y);
    return {
      rect: { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom, width: rect.width, height: rect.height },
      viewport: { width: window.innerWidth, height: window.innerHeight },
      display: style.display,
      visibility: style.visibility,
      opacity: Number(style.opacity || 0),
      pointerEvents: style.pointerEvents,
      topInside: Boolean(top && (top === node || node.contains(top)))
    };
  });
}

async function expectInteractiveSurface(locator, label = 'surface') {
  await expect(locator).toHaveCount(1);
  await expect.poll(async () => (await surfaceState(locator)).opacity).toBeGreaterThan(0.98);
  const result = await surfaceState(locator);
  console.log(`SURFACE_STATE ${label}: ${JSON.stringify(result)}`);
  expect(result.rect.width, JSON.stringify(result)).toBeGreaterThan(80);
  expect(result.rect.height, JSON.stringify(result)).toBeGreaterThan(60);
  expect(result.rect.right, JSON.stringify(result)).toBeGreaterThan(0);
  expect(result.rect.bottom, JSON.stringify(result)).toBeGreaterThan(0);
  expect(result.rect.left, JSON.stringify(result)).toBeLessThan(result.viewport.width);
  expect(result.rect.top, JSON.stringify(result)).toBeLessThan(result.viewport.height);
  expect(result.display, JSON.stringify(result)).not.toBe('none');
  expect(result.visibility, JSON.stringify(result)).not.toBe('hidden');
  expect(result.opacity, JSON.stringify(result)).toBeGreaterThan(0.98);
  expect(result.pointerEvents, JSON.stringify(result)).not.toBe('none');
  expect(result.topInside, JSON.stringify(result)).toBe(true);
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.clear();
    sessionStorage.clear();
    localStorage.setItem('cmxBriefDemo:onboarding:tips', 'off');
  });
});

test('top-left briefing switcher opens a visible usable drawer and closes cleanly', async ({ page }) => {
  await enterPersonalBriefing(page);

  const trigger = page.locator('#briefSystemSwitcher');
  await expect(trigger).toBeVisible();
  await trigger.click();

  await expect(page.locator('body')).toHaveClass(/brief-system-overlay-open/);
  await expect(page.locator('#briefSystemSwitcherLayer')).toBeVisible();
  await expectInteractiveSurface(page.locator('#briefSystemSwitcherLayer .brief-system-drawer'), 'switcher');
  await expect(page.locator('#briefSystemSwitcherLayer .brief-system-switch-grid button')).toHaveCount(5);

  await page.locator('#briefSystemSwitcherLayer [data-system-close]').last().click();
  await expect(page.locator('#briefSystemSwitcherLayer')).toBeHidden();
  await expect(page.locator('body')).not.toHaveClass(/brief-system-overlay-open|brief-terminal-open/);
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
});

test('terminal UI is absent and stale terminal state cannot leave the page blurred', async ({ page }) => {
  await enterPersonalBriefing(page);

  await expect(page.locator('#briefSystemCommandButton')).toHaveCount(0);
  await expect(page.locator('#briefSystemTerminalDock')).toHaveCount(0);
  await expect(page.locator('[data-terminal-open]:visible')).toHaveCount(0);
  await expect(page.locator('#briefTerminal')).toBeHidden();

  const about = page.locator('#briefSystemAboutButton');
  await expect(about).toBeVisible();
  await expect(about).toHaveAttribute('href', '/doc/');

  await page.evaluate(() => {
    document.body.classList.add('brief-terminal-open');
    window.BRIEF_PERSONAL_OS_STABILITY.repair();
  });
  await expect(page.locator('body')).not.toHaveClass(/brief-terminal-open|brief-system-overlay-open/);
  await expect(page.locator('#briefTerminal')).toBeHidden();
});

test('More menu and guided tour open, remain visible and close without leaving blur', async ({ page }) => {
  await enterPersonalBriefing(page);

  await page.locator('#briefSystemMoreButton').click();
  await expectInteractiveSurface(page.locator('#briefSystemMoreLayer .brief-system-more-card'), 'more-menu');
  await expect(page.locator('#briefSystemMoreLayer [data-brief-about]')).toHaveAttribute('href', '/doc/');
  await page.locator('#briefSystemMoreLayer [data-system-close]').click();
  await expect(page.locator('#briefSystemMoreLayer')).toBeHidden();

  await page.locator('#briefSystemTourButton').click();
  await expect(page.locator('body')).toHaveClass(/brief-system-overlay-open/);
  await expectInteractiveSurface(page.locator('#briefSystemTour .brief-system-tour'), 'tour');
  await page.keyboard.press('Escape');
  await expect(page.locator('#briefSystemTour')).toBeHidden();
  await expect(page.locator('body')).not.toHaveClass(/brief-system-overlay-open|brief-terminal-open/);
});

test('all retained controls remain usable at Pixel 5 width', async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 851 });
  await enterPersonalBriefing(page);

  await expect(page.locator('#briefSystemAboutButton')).toBeVisible();
  await expect(page.locator('#briefSystemTerminalDock')).toHaveCount(0);

  await page.locator('#briefSystemSwitcher').click();
  await expectInteractiveSurface(page.locator('#briefSystemSwitcherLayer .brief-system-drawer'), 'switcher-mobile');
  await page.locator('#briefSystemSwitcherLayer [data-system-close]').last().click();

  await page.locator('#briefSystemMoreButton').click();
  await expectInteractiveSurface(page.locator('#briefSystemMoreLayer .brief-system-more-card'), 'more-mobile');
  await page.locator('#briefSystemMoreLayer [data-system-close]').click();

  await page.locator('#briefSystemTourButton').click();
  await expectInteractiveSurface(page.locator('#briefSystemTour .brief-system-tour'), 'tour-mobile');
  await page.locator('#briefSystemTour [data-tour-close]').last().click();

  await expect(page.locator('body')).not.toHaveClass(/brief-system-overlay-open|brief-terminal-open/);
});
