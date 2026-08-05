const { test, expect } = require('@playwright/test');

const PAIRS = [
  ['.brief-workspace-panel', 'h3'],
  ['.quick-signal-card', 'h4'],
  ['.quick-next-action', 'h4'],
  ['.brief-priority-visuals', 'h3'],
  ['.polish-kpi', 'strong'],
  ['.polish-chart-card', 'strong'],
  ['.polish-team-board article', 'strong'],
  ['.profile-account', 'strong'],
  ['.shared-space-account', 'strong'],
  ['.horoscope-card', 'strong'],
  ['.relationship-watch-card', 'h3'],
  ['.brief-system-header', 'strong'],
  ['.brief-system-full-bar', 'strong']
];

async function enterBriefing(page) {
  await page.addInitScript(() => {
    localStorage.clear();
    sessionStorage.clear();
    localStorage.setItem('cmxBriefDemo:onboarding:tips', 'off');
  });
  await page.goto('/brief/?theme-sweep=1', { waitUntil: 'domcontentloaded' });
  await page.locator('.brief-entry-radio-card.is-individual').click();
  await page.locator('#enterBrief').click();
  await expect(page.locator('body')).not.toHaveClass(/is-locked/);
  await expect(page.locator('#briefSystemHeader')).toBeVisible();
}

async function openWorkspace(page) {
  await page.locator('[data-system-mode="workspace"]').click();
  await expect(page.locator('body')).toHaveAttribute('data-brief-system-mode', 'workspace');
  await expect(page.locator('#briefWorkspace')).toBeVisible();
}

async function openFull(page) {
  await page.locator('[data-system-mode="full"]').click();
  await expect(page.locator('body')).toHaveAttribute('data-brief-system-mode', 'full');
  await expect(page.locator('#briefWorkspace')).toBeVisible();
}

async function ensureTheme(page, theme) {
  const current = await page.locator('html').getAttribute('data-theme');
  const needsToggle = (theme === 'light' && current !== 'light') || (theme === 'dark' && current === 'light');
  if (needsToggle) {
    await page.locator('#briefSystemMoreButton').click();
    await page.locator('[data-system-action="theme"]').click();
  }
  if (theme === 'light') await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  else await expect(page.locator('html')).not.toHaveAttribute('data-theme', 'light');
}

async function auditCurrentState(page, label) {
  const result = await page.evaluate(({ pairs, label }) => {
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
    const visible = node => {
      const style = getComputedStyle(node);
      const rect = node.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) > 0.2 && rect.width > 1 && rect.height > 1;
    };
    const backgroundFor = node => {
      let cursor = node;
      while (cursor) {
        const color = parse(getComputedStyle(cursor).backgroundColor);
        if (color.a > 0.75) return color;
        cursor = cursor.parentElement;
      }
      return parse(getComputedStyle(document.body).backgroundColor);
    };

    const failures = [];
    let checked = 0;
    for (const [containerSelector, textSelector] of pairs) {
      const containers = [...document.querySelectorAll(containerSelector)].filter(visible).slice(0, 3);
      for (const container of containers) {
        const textNode = container.querySelector(textSelector);
        if (!textNode || !visible(textNode) || !textNode.textContent.trim()) continue;
        const foreground = parse(getComputedStyle(textNode).color);
        const background = backgroundFor(container);
        const l1 = luminance(foreground);
        const l2 = luminance(background);
        const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
        checked += 1;
        if (ratio < 2.8) failures.push(`${label}: ${containerSelector} ${textSelector} contrast ${ratio.toFixed(2)}`);
      }
    }

    const overflow = {
      document: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      body: document.body.scrollWidth - document.body.clientWidth
    };
    if (overflow.document > 2 || overflow.body > 2) failures.push(`${label}: horizontal overflow ${JSON.stringify(overflow)}`);
    return { failures, checked };
  }, { pairs: PAIRS, label });

  expect(result.checked, `${label} should expose representative visible cards`).toBeGreaterThan(0);
  expect(result.failures).toEqual([]);
}

test('all five briefings remain readable in Workspace and Full View, light and dark', async ({ page }) => {
  test.setTimeout(120000);
  await enterBriefing(page);

  const presets = ['individual', 'couple', 'partners', 'trainer', 'team'];
  for (const theme of ['light', 'dark']) {
    await ensureTheme(page, theme);
    for (const preset of presets) {
      await page.locator('#briefSystemSwitcher').click();
      await page.locator(`[data-system-preset="${preset}"]`).click();
      await expect.poll(() => page.evaluate(() => window.BRIEF_APP.getPreset())).toBe(preset);
      await openWorkspace(page);
      await auditCurrentState(page, `${theme}/${preset}/workspace`);
      await openFull(page);
      await auditCurrentState(page, `${theme}/${preset}/full`);
    }
  }
});
