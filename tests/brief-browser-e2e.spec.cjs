const { test, expect } = require('@playwright/test');

async function disableAutomaticTips(page) {
  await page.addInitScript(() => {
    localStorage.setItem('cmxBriefDemo:onboarding:tips', 'off');
  });
}

async function enterPersonalBriefing(page) {
  await page.goto('/brief/?browser-test=1', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#briefEntryRadio')).toBeVisible();
  await page.locator('.brief-entry-radio-card.is-individual').click();
  await expect(page.locator('#enterBrief')).toBeEnabled();
  await page.locator('#enterBrief').click();
  await expect(page.locator('body')).not.toHaveClass(/is-locked/);
  await expect(page.locator('#briefSystemHeader')).toBeVisible();
}

async function openWorkspace(page) {
  const button = page.locator('[data-system-mode="workspace"]');
  await expect(button).toBeVisible();
  await button.click();
  await expect(page.locator('body')).toHaveAttribute('data-brief-system-mode', 'workspace');
  await expect(page.locator('#briefWorkspace')).toBeVisible();
}

async function openFullView(page) {
  const button = page.locator('[data-system-mode="full"]');
  await expect(button).toBeVisible();
  await button.click();
  await expect(page.locator('body')).toHaveAttribute('data-brief-system-mode', 'full');
  await expect(page.locator('#briefWorkspace')).toBeVisible();
  await expect(page.locator('#briefSystemFullBar')).toBeVisible();
}

async function expectInsideViewport(locator, page) {
  const result = await locator.evaluate(node => {
    const rect = node.getBoundingClientRect();
    const viewport = window.visualViewport;
    return {
      left: rect.left,
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      width: viewport?.width || window.innerWidth,
      height: viewport?.height || window.innerHeight
    };
  });
  expect(result.left).toBeGreaterThanOrEqual(-3);
  expect(result.top).toBeGreaterThanOrEqual(-3);
  expect(result.right).toBeLessThanOrEqual(result.width + 3);
  expect(result.bottom).toBeLessThanOrEqual(result.height + 3);
}

async function ensureTheme(page, wanted) {
  const current = await page.locator('html').getAttribute('data-theme');
  const needsToggle = (wanted === 'light' && current !== 'light') || (wanted === 'dark' && current === 'light');
  if (needsToggle) {
    await page.locator('#briefSystemMoreButton').click();
    await expect(page.locator('#briefSystemMoreLayer')).toBeVisible();
    await page.locator('[data-system-action="theme"]').click();
  }
  if (wanted === 'light') await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  else await expect(page.locator('html')).not.toHaveAttribute('data-theme', 'light');
}

async function contrastMetrics(locator, textSelector) {
  return locator.evaluate((node, selector) => {
    const parse = value => {
      const match = String(value).match(/[\d.]+/g)?.map(Number) || [0, 0, 0, 1];
      return { r: match[0] || 0, g: match[1] || 0, b: match[2] || 0, a: match.length > 3 ? match[3] : 1 };
    };
    const luminance = ({ r, g, b }) => {
      const channels = [r, g, b].map(value => {
        const channel = value / 255;
        return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
    };
    const textNode = selector ? node.querySelector(selector) : node;
    const foreground = parse(getComputedStyle(textNode || node).color);
    let cursor = node;
    let background = parse(getComputedStyle(cursor).backgroundColor);
    while (background.a === 0 && cursor.parentElement) {
      cursor = cursor.parentElement;
      background = parse(getComputedStyle(cursor).backgroundColor);
    }
    const l1 = luminance(foreground);
    const l2 = luminance(background);
    return {
      ratio: (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05),
      backgroundLuminance: l2
    };
  }, textSelector);
}

async function expectReadable(locator, textSelector, minimum = 3) {
  await expect(locator).toBeVisible();
  const metrics = await contrastMetrics(locator, textSelector);
  expect(metrics.ratio).toBeGreaterThanOrEqual(minimum);
  return metrics;
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
});

test('entry, help center and guided tour work without overflow', async ({ page }) => {
  await enterPersonalBriefing(page);
  const overflow = await page.evaluate(() => ({
    document: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    body: document.body.scrollWidth - document.body.clientWidth
  }));
  expect(overflow.document).toBeLessThanOrEqual(2);
  expect(overflow.body).toBeLessThanOrEqual(2);

  const help = page.locator('#explainButton');
  await help.click();
  await expect(page.locator('#briefHelpCenter')).toBeVisible();
  await expectInsideViewport(page.locator('.brief-glass-panel'), page);
  await page.locator('#briefStartTour').click();
  await expect(page.locator('#briefTourLayer')).toBeVisible();
  await page.waitForTimeout(420);
  await expectInsideViewport(page.locator('#briefTourBubble'), page);
  await page.keyboard.press('Escape');
  await expect(page.locator('#briefTourLayer')).toBeHidden();
});

test('tips can be disabled and help remains available', async ({ page }) => {
  await enterPersonalBriefing(page);
  await page.locator('#explainButton').click();
  const toggle = page.locator('#briefTipsToggle');
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  await page.locator('[data-help-close]').last().click();
  await page.locator('#explainButton').click();
  await expect(page.locator('#briefHelpCenter')).toBeVisible();
});

test('workspace ticker remains controllable', async ({ page }) => {
  await disableAutomaticTips(page);
  await enterPersonalBriefing(page);
  await openWorkspace(page);
  const button = page.locator('#briefSignalPause');
  const strip = page.locator('#briefSignalStrip');
  await expect(button).toBeVisible();
  await button.click();
  await expect(button).toHaveAttribute('aria-pressed', 'true');
  await button.click();
  await expect(button).toHaveAttribute('aria-pressed', 'false');
  await expect.poll(async () => strip.evaluate(node => getComputedStyle(node).animationPlayState)).toBe('running');
});

test('current system switches between Focus, Workspace and Full View', async ({ page }) => {
  await disableAutomaticTips(page);
  await enterPersonalBriefing(page);
  await expect(page.locator('body')).toHaveAttribute('data-brief-system-mode', 'focus');
  await openWorkspace(page);
  await expect(page.locator('#briefSystemSecondary')).toBeVisible();
  await openFullView(page);
  await page.locator('[data-return-workspace]').click();
  await expect(page.locator('body')).toHaveAttribute('data-brief-system-mode', 'workspace');
  await expect(page.locator('#briefSystemFullBar')).toBeHidden();
});

test('profile switcher and scenario-specific tabs work across briefing types', async ({ page }) => {
  await disableAutomaticTips(page);
  await enterPersonalBriefing(page);
  const cases = [
    ['individual', 'Personal'],
    ['couple', 'Relationship'],
    ['partners', 'Business'],
    ['trainer', 'Trainer'],
    ['team', 'Team']
  ];

  for (const [preset, label] of cases) {
    await page.locator('#briefSystemSwitcher').click();
    await expect(page.locator('#briefSystemSwitcherLayer')).toBeVisible();
    await page.locator(`[data-system-preset="${preset}"]`).click();
    await expect.poll(() => page.evaluate(() => window.BRIEF_APP.getPreset())).toBe(preset);
    await expect(page.locator('#briefSystemProfileLabel')).toHaveText(label);
    await openWorkspace(page);
    await expect(page.locator('#briefSystemSecondary button').first()).toBeVisible();
  }

  await page.locator('[data-system-tab="handoffs"]').click();
  await expect(page.locator('[data-workspace-tab="handoffs"]')).toHaveAttribute('aria-selected', 'true');
});

test('deep links cannot bypass the deliberate gate', async ({ page }) => {
  await disableAutomaticTips(page);
  await page.goto('/brief/?view=team&tab=handoffs&depth=full#scenarioStage', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('body')).toHaveClass(/is-locked/);
  await expect(page.locator('input[name="briefEntryType"]:checked')).toHaveCount(0);
  await page.locator('.brief-entry-radio-card.is-team').click();
  await page.locator('#enterBrief').click();
  await expect(page.locator('body')).not.toHaveClass(/is-locked/);
  await expect.poll(() => page.evaluate(() => window.BRIEF_APP.getPreset())).toBe('team');
  await expect(page.locator('body')).toHaveAttribute('data-brief-system-mode', 'focus');
});

test('light and dark themes keep current workspace and Full View readable', async ({ page }) => {
  await disableAutomaticTips(page);
  await enterPersonalBriefing(page);
  await openWorkspace(page);
  await expect(page.locator('html')).toHaveAttribute('data-theme-integrity', 'ready');

  await ensureTheme(page, 'light');
  let metrics = await expectReadable(page.locator('.quick-signal-card').first(), 'h4');
  expect(metrics.backgroundLuminance).toBeGreaterThan(0.7);
  await expectReadable(page.locator('.brief-workspace-panel'), 'h3');

  await page.locator('#briefSystemSwitcher').click();
  await page.locator('[data-system-preset="team"]').click();
  await expect.poll(() => page.evaluate(() => window.BRIEF_APP.getPreset())).toBe('team');
  await openWorkspace(page);
  await expectReadable(page.locator('.brief-priority-visuals'), 'h3');
  await openFullView(page);
  await expectReadable(page.locator('.polish-team-board article').first(), 'strong');

  await ensureTheme(page, 'dark');
  metrics = await expectReadable(page.locator('.polish-team-board article').first(), 'strong');
  expect(metrics.backgroundLuminance).toBeLessThan(0.2);
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#000000');
});
