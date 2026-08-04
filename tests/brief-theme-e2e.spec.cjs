const { test, expect } = require('@playwright/test');

const PAIRS = [
  ['.brief-workspace-panel', 'h3'],
  ['.quick-signal-card', 'h4'],
  ['.quick-next-action', 'h4'],
  ['.quick-quote-card', 'p'],
  ['.quick-timeline li', 'strong'],
  ['.brief-priority-visuals', 'h3'],
  ['.polish-kpi', 'strong'],
  ['.polish-chart-card', 'strong'],
  ['.polish-ring-card', 'strong'],
  ['.polish-decision-card', 'strong'],
  ['.polish-team-flow > div', 'strong'],
  ['.polish-team-board article', 'strong'],
  ['.profile-account', 'strong'],
  ['.shared-space-account', 'strong'],
  ['.business-partner-account', 'strong'],
  ['.business-shared-ledger', 'strong'],
  ['.horoscope-card', 'strong'],
  ['.daily-quote', 'p'],
  ['.compatibility-card', 'h4'],
  ['.trainer-quote', 'p'],
  ['.culture-story-grid article', 'h4'],
  ['.market-impact-stream article', 'h4'],
  ['.advice-visual-grid article', 'h4'],
  ['.habit-calendar article', 'strong'],
  ['.accountability-questions article', 'p'],
  ['.adaptive-coach-note', 'h4'],
  ['.brief-terminal-panel', '.brief-terminal-line'],
  ['.relationship-watch-card', 'h3'],
  ['.brief-navigator-bar', '.brief-map-button']
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
  await expect(page.locator('#briefWorkspace')).toBeVisible();
  await expect(page.locator('#briefTopMapButton')).toBeVisible();
}

async function ensureTheme(page, theme) {
  const current = await page.locator('html').getAttribute('data-theme');
  if ((theme === 'light' && current !== 'light') || (theme === 'dark' && current === 'light')) {
    await page.locator('#themeToggleButton').click();
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
    const effectiveBackground = node => {
      let cursor = node;
      while (cursor) {
        const color = parse(getComputedStyle(cursor).backgroundColor);
        if (color.a > 0.75) return color;
        cursor = cursor.parentElement;
      }
      return parse(getComputedStyle(document.body).backgroundColor);
    };
    const visible = node => {
      const style = getComputedStyle(node);
      const rect = node.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) > 0.2 && rect.width > 1 && rect.height > 1;
    };

    const failures = [];
    const checked = [];
    for (const [containerSelector, textSelector] of pairs) {
      const containers = [...document.querySelectorAll(containerSelector)].filter(visible).slice(0, 3);
      for (const container of containers) {
        const textNode = container.querySelector(textSelector);
        if (!textNode || !visible(textNode) || !textNode.textContent.trim()) continue;
        const foreground = parse(getComputedStyle(textNode).color);
        const background = effectiveBackground(container);
        const l1 = luminance(foreground);
        const l2 = luminance(background);
        const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
        checked.push({ containerSelector, textSelector, ratio });
        if (ratio < 2.8) failures.push(`${label}: ${containerSelector} ${textSelector} contrast ${ratio.toFixed(2)}`);
      }
    }

    const overflow = {
      document: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      body: document.body.scrollWidth - document.body.clientWidth
    };
    if (overflow.document > 2 || overflow.body > 2) failures.push(`${label}: horizontal overflow ${JSON.stringify(overflow)}`);

    return { failures, checked: checked.length, overflow };
  }, { pairs: PAIRS, label });

  expect(result.checked, `${label} should expose representative visible cards`).toBeGreaterThan(0);
  expect(result.failures).toEqual([]);
}

test('all five briefings remain readable in Quick and Full light and dark states', async ({ page }) => {
  test.setTimeout(90000);
  await enterBriefing(page);

  const presets = ['individual', 'couple', 'partners', 'trainer', 'team'];
  for (const theme of ['light', 'dark']) {
    await ensureTheme(page, theme);
    for (const preset of presets) {
      await page.evaluate(value => window.BRIEF_APP.setPreset(value), preset);
      await expect.poll(() => page.evaluate(() => window.BRIEF_APP.getPreset())).toBe(preset);
      await expect(page.locator('#briefTopMapButton')).toBeVisible();
      await auditCurrentState(page, `${theme}/${preset}/quick`);

      const full = page.locator('[data-depth-choice="full"]').first();
      await full.click();
      await expect(page.locator('body')).toHaveAttribute('data-brief-depth', 'full');
      await auditCurrentState(page, `${theme}/${preset}/full`);
    }
  }
});
