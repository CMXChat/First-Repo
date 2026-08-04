const { test, expect } = require('@playwright/test');

async function enterPersonalBriefing(page) {
  await page.goto('/brief/?overlay-test=1', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#briefEntryRadio')).toBeVisible();
  await page.locator('.brief-entry-radio-card.is-individual').click();
  await expect(page.locator('#enterBrief')).toBeEnabled();
  await page.locator('#enterBrief').click();
  await expect(page.locator('body')).not.toHaveClass(/is-locked/);
  await expect(page.locator('body')).toHaveClass(/brief-system-ready/);
  await expect(page.locator('#briefSystemHeader')).toBeVisible();
}

async function expectInteractiveSurface(locator, page) {
  await expect(locator).toBeVisible();
  const result = await locator.evaluate(node => {
    const rect = node.getBoundingClientRect();
    const style = getComputedStyle(node);
    const x = Math.max(0, Math.min(window.innerWidth - 1, rect.left + rect.width / 2));
    const y = Math.max(0, Math.min(window.innerHeight - 1, rect.top + Math.min(rect.height / 2, 120)));
    const top = document.elementFromPoint(x, y);
    return {
      rect: { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom, width: rect.width, height: rect.height },
      viewport: { width: window.innerWidth, height: window.innerHeight },
      display: style.display,
      visibility: style.visibility,
      opacity: Number(style.opacity || 1),
      pointerEvents: style.pointerEvents,
      topInside: Boolean(top && (top === node || node.contains(top))),
      topTag: top?.tagName || '',
      topId: top?.id || '',
      topClass: top?.className || ''
    };
  });

  expect(result.rect.width).toBeGreaterThan(80);
  expect(result.rect.height).toBeGreaterThan(60);
  expect(result.rect.right).toBeGreaterThan(0);
  expect(result.rect.bottom).toBeGreaterThan(0);
  expect(result.rect.left).toBeLessThan(result.viewport.width);
  expect(result.rect.top).toBeLessThan(result.viewport.height);
  expect(result.display).not.toBe('none');
  expect(result.visibility).not.toBe('hidden');
  expect(result.opacity).toBeGreaterThan(0.8);
  expect(result.pointerEvents).not.toBe('none');
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
  await expectInteractiveSurface(page.locator('#briefSystemSwitcherLayer .brief-system-drawer'), page);
  await expect(page.locator('#briefSystemSwitcherLayer .brief-system-switch-grid button')).toHaveCount(5);

  await page.locator('#briefSystemSwitcherLayer [data-system-close]').last().click();
  await expect(page.locator('#briefSystemSwitcherLayer')).toBeHidden();
  await expect(page.locator('body')).not.toHaveClass(/brief-system-overlay-open/);
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
});

test('terminal opens above its backdrop and all terminal close flows work', async ({ page }) => {
  await enterPersonalBriefing(page);

  const trigger = page.locator('#briefSystemCommandButton');
  await expect(trigger).toBeVisible();
  await trigger.click();

  await expect(page.locator('body')).toHaveClass(/brief-terminal-open/);
  await expectInteractiveSurface(page.locator('#briefTerminal.brief-terminal-system-drawer'), page);
  await expect(page.locator('#briefTerminalInput')).toBeFocused();

  await page.locator('[data-terminal-close]').click();
  await expect(page.locator('body')).not.toHaveClass(/brief-terminal-open/);
  await expect(page.locator('#briefTerminal.brief-terminal-system-drawer')).toBeHidden();

  await page.locator('[data-terminal-open]').click();
  await expect(page.locator('body')).toHaveClass(/brief-terminal-open/);
  await expectInteractiveSurface(page.locator('#briefTerminal.brief-terminal-system-drawer'), page);
  await page.keyboard.press('Escape');
  await expect(page.locator('body')).not.toHaveClass(/brief-terminal-open/);
});

test('More menu and guided tour open, remain visible and close without leaving blur', async ({ page }) => {
  await enterPersonalBriefing(page);

  await page.locator('#briefSystemMoreButton').click();
  await expectInteractiveSurface(page.locator('#briefSystemMore'), page);
  await page.locator('#briefSystemMore [data-system-close]').click();
  await expect(page.locator('#briefSystemMore')).toBeHidden();

  await page.locator('#briefSystemTourButton').click();
  await expect(page.locator('body')).toHaveClass(/brief-system-overlay-open/);
  await expectInteractiveSurface(page.locator('#briefSystemTourLayer .brief-system-tour'), page);
  await page.keyboard.press('Escape');
  await expect(page.locator('#briefSystemTourLayer')).toBeHidden();
  await expect(page.locator('body')).not.toHaveClass(/brief-system-overlay-open/);
});

test('switcher and terminal remain usable at Pixel 5 width', async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 851 });
  await enterPersonalBriefing(page);

  await page.locator('#briefSystemSwitcher').click();
  await expectInteractiveSurface(page.locator('#briefSystemSwitcherLayer .brief-system-drawer'), page);
  await page.locator('#briefSystemSwitcherLayer [data-system-close]').last().click();

  await page.locator('#briefSystemCommandButton').click();
  await expectInteractiveSurface(page.locator('#briefTerminal.brief-terminal-system-drawer'), page);
  await page.locator('[data-terminal-close]').click();
});
