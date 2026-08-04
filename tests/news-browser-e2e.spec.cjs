const { test, expect } = require('@playwright/test');

const enhancementScripts = [
  'assets/news-upgrades.js',
  'assets/news-experience.js',
  'assets/news-workspace.js',
  'assets/news-polish.js',
  'assets/news-navigation.js',
  'assets/news-navigation-state.js',
  'assets/news-resilience.js'
];

async function loadNews(page) {
  await page.goto('/assets/cmx-news.html', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => Boolean(window.CMX_NEWS_BRIEF && document.querySelector('#briefContent')));
  for (const path of enhancementScripts) await page.addScriptTag({ url: `/${path}` });
  await page.waitForSelector('#newsSectionMap');
  await page.waitForSelector('#newsHelpButton');
  await page.waitForFunction(() => {
    const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
    const loaded = name => links.some(link => link.href.includes(name) && Boolean(link.sheet));
    return Boolean(
      document.querySelector('#newsHelpLayer')
      && window.CMX_NEWS_RESILIENCE
      && loaded('/assets/news-navigation.css')
      && loaded('/assets/news-resilience.css')
    );
  });
}

async function visibleViewport(page) {
  return page.evaluate(() => ({
    width: window.visualViewport?.width || window.innerWidth,
    height: window.visualViewport?.height || window.innerHeight,
    top: window.visualViewport?.offsetTop || 0,
    left: window.visualViewport?.offsetLeft || 0
  }));
}

test('quiet help and section drawer never overlap', async ({ page }) => {
  await loadNews(page);

  await page.locator('#newsOpenSectionDrawer').click();
  await expect(page.locator('#newsSectionDrawer')).toBeVisible();
  await expect(page.locator('#newsOpenSectionDrawer')).toHaveAttribute('aria-expanded', 'true');

  await page.evaluate(() => window.CMX_NEWS_RESILIENCE.openHelp());
  await expect(page.locator('#newsSectionDrawer')).toBeHidden();
  await expect(page.locator('#newsHelpLayer')).toBeVisible();
  await expect(page.locator('#newsHelpButton')).toHaveAttribute('aria-expanded', 'true');

  await page.keyboard.press('Escape');
  await expect(page.locator('#newsHelpLayer')).toBeHidden();
});

test('help and drawer remain inside the visible viewport', async ({ page }) => {
  await loadNews(page);

  await page.locator('#newsHelpButton').click();
  await expect(page.locator('.news-help-panel')).toBeVisible();
  const helpBox = await page.locator('.news-help-panel').boundingBox();
  const viewport = await visibleViewport(page);
  expect(helpBox).not.toBeNull();
  expect(helpBox.x).toBeGreaterThanOrEqual(viewport.left - 3);
  expect(helpBox.y).toBeGreaterThanOrEqual(viewport.top - 3);
  expect(helpBox.x + helpBox.width).toBeLessThanOrEqual(viewport.left + viewport.width + 3);
  expect(helpBox.y + helpBox.height).toBeLessThanOrEqual(viewport.top + viewport.height + 3);

  await page.keyboard.press('Escape');
  await expect(page.locator('#newsHelpLayer')).toBeHidden();
  await page.locator('#newsOpenSectionDrawer').click();
  await expect(page.locator('.news-drawer-panel')).toBeVisible();
  const drawerBox = await page.locator('.news-drawer-panel').boundingBox();
  const drawerViewport = await visibleViewport(page);
  expect(drawerBox).not.toBeNull();
  expect(drawerBox.x).toBeGreaterThanOrEqual(drawerViewport.left - 3);
  expect(drawerBox.y).toBeGreaterThanOrEqual(drawerViewport.top - 3);
  expect(drawerBox.x + drawerBox.width).toBeLessThanOrEqual(drawerViewport.left + drawerViewport.width + 3);
  expect(drawerBox.y + drawerBox.height).toBeLessThanOrEqual(drawerViewport.top + drawerViewport.height + 3);
});

test('offline state keeps the written briefing available and explains live limits', async ({ page, context }) => {
  await loadNews(page);
  await context.setOffline(true);
  await page.evaluate(() => window.dispatchEvent(new Event('offline')));

  await expect(page.locator('html')).toHaveClass(/news-offline/);
  await expect(page.locator('#newsConnectionNote')).toBeVisible();
  await expect(page.locator('#newsConnectionNote')).toContainText('written briefing is still available');
  await expect(page.locator('#newsWorkspace')).toBeVisible();

  await context.setOffline(false);
  await page.evaluate(() => window.dispatchEvent(new Event('online')));
  await expect(page.locator('#newsConnectionNote')).toBeHidden();
});

test('read aloud is disabled cleanly when the browser capability is absent', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'speechSynthesis', { value: undefined, configurable: true });
    Object.defineProperty(window, 'SpeechSynthesisUtterance', { value: undefined, configurable: true });
  });
  await loadNews(page);

  const button = page.locator('#newsReadBrief');
  await expect(button).toBeDisabled();
  await expect(button).toContainText('unavailable');
  await expect(button).toHaveAttribute('aria-label', /written briefing still works normally/i);
});

test('focus returns to the control that opened help', async ({ page }) => {
  await loadNews(page);
  const button = page.locator('#newsHelpButton');
  await button.focus();
  await button.click();
  await expect(page.locator('.news-help-close')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('#newsHelpLayer')).toBeHidden();
  await expect(button).toBeFocused();
});
