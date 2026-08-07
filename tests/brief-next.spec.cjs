const { test, expect } = require('@playwright/test');

async function installSpotifyMock(page) {
  await page.addInitScript(() => {
    window.__spotifyPlayCalls = [];
    window.__spotifyLoadedUris = [];

    window.BRIEF_SPOTIFY_IFRAME_API = {
      createController(element, options, callback) {
        const listeners = {};
        let uri = options.uri;
        const frame = document.createElement('iframe');
        frame.src = `https://open.spotify.com/embed/track/${uri.split(':').pop()}?test=1`;
        element.replaceWith(frame);

        const controller = {
          addListener(name, handler) {
            listeners[name] = handler;
            if (name === 'ready') queueMicrotask(() => handler({ data: {} }));
          },
          loadEntity(nextUri) {
            uri = nextUri;
            window.__spotifyLoadedUris.push(nextUri);
            frame.src = `https://open.spotify.com/embed/track/${uri.split(':').pop()}?test=1`;
          },
          play() {
            window.__spotifyPlayCalls.push(uri);
            listeners.playback_started?.({ data: { playingURI: uri } });
            listeners.playback_update?.({ data: { playingURI: uri, isPaused: false } });
          },
          pause() {
            listeners.playback_update?.({ data: { playingURI: uri, isPaused: true } });
          }
        };

        callback(controller);
      }
    };
  });
}

async function openScenario(page, id) {
  await installSpotifyMock(page);
  await page.goto('/brief/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.locator('#entrySoundtrack')).not.toBeChecked();
  await expect(page.locator('#readOnEntry')).toHaveCount(0);

  await page.locator('#entrySoundtrack').check();
  await page.locator(`[data-entry-scenario="${id}"]`).click();
  await expect(page.locator('#openDemo')).toBeEnabled();
  await expect(page.locator('#previewButton')).toBeEnabled();
  await page.locator('#openDemo').click();
  await expect(page.locator('body')).toHaveAttribute('data-entered', 'true');
  await expect(page.locator('#demoApp')).toHaveAttribute('aria-hidden', 'false');
  await expect(page.locator('[data-view-panel="today"]')).toBeVisible();
  await expect(page.locator('.section-pager')).toHaveCount(5);
  await expect.poll(() => page.evaluate(() => window.__spotifyPlayCalls.length)).toBeGreaterThan(0);

  const playback = await page.evaluate(scenarioId => ({
    actual: window.__spotifyPlayCalls.at(-1),
    expected: `spotify:track:${window.BRIEF_DEMO_DATA.scenarios[scenarioId].soundtrack.spotifyTrackId}`
  }), id);
  expect(playback.actual).toBe(playback.expected);
}

async function expectNoVisibleEllipses(page) {
  const text = await page.locator('body').innerText();
  expect(text).not.toContain('...');
  expect(text).not.toContain('…');
}

async function expectNoHorizontalOverflow(page) {
  const overflow = await page.evaluate(() => ({
    document: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    body: document.body.scrollWidth - document.body.clientWidth
  }));
  expect(overflow.document).toBeLessThanOrEqual(1);
  expect(overflow.body).toBeLessThanOrEqual(1);
}

test('desktop demo keeps weather, stats, navigation and opt-in soundtrack playback', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium', 'Desktop navigation is tested only in the desktop project.');
  await openScenario(page, 'personal');

  await expect(page.locator('.identity-copy strong')).toHaveText('Spaces');
  await expect(page.locator('#primaryNav button')).toHaveCount(5);
  await expect(page.locator('#primaryNav button').last()).toHaveText('Everything');
  await expect(page.locator('[data-view-panel="today"]')).toBeVisible();
  await expect(page.locator('#weatherTemperature')).toHaveText('82');
  await expect(page.locator('#statsGrid .stat-card')).toHaveCount(4);
  await expect(page.locator('#flowList li')).toHaveCount(4);
  await expect(page.locator('#mediaStatus')).toContainText('Playing You Get What You Give through Spotify');

  await page.locator('#primaryNav [data-primary-view="workspace"]').click();
  await expect(page.locator('[data-view-panel="workspace"]')).toBeVisible();
  await expect(page.locator('#workspaceTabs button')).toHaveCount(6);
  await expect(page.locator('#workspacePanel .detail-card')).toHaveCount(3);

  const firstTab = page.locator('#workspaceTabs [data-workspace-tab]').first();
  const secondTab = page.locator('#workspaceTabs [data-workspace-tab]').nth(1);
  await firstTab.focus();
  await page.keyboard.press('ArrowRight');
  await expect(secondTab).toBeFocused();
  await expect(secondTab).toHaveAttribute('aria-selected', 'true');
  await expect(firstTab).toHaveAttribute('tabindex', '-1');

  await page.locator('#scenarioSelect').selectOption('team');
  await expect(page.locator('#railContextTitle')).toHaveText('Team and project');
  await expect(page.locator('[data-view-panel="today"]')).toBeVisible();
  await expect(page.locator('#statsGrid .stat-card')).toHaveCount(4);

  await page.locator('#primaryNav [data-primary-view="spaces"]').click();
  await expect(page.locator('#sharedSpaceTitle')).toHaveText('Project Space');
  await expect(page.locator('#privateSpaceList li')).toHaveCount(3);
  await expect(page.locator('#sharedSpaceList li')).toHaveCount(3);

  await page.locator('#mediaButton').click();
  await expect(page.locator('#mediaDrawer')).toHaveClass(/is-open/);
  await expect(page.locator('#mediaDrawer')).not.toHaveAttribute('inert', '');
  await expect(page.locator('#spotifyFrame')).toHaveCount(1);
  await expect(page.locator('#spotifyFrame')).toHaveAttribute('src', /open\.spotify\.com\/embed\/track\/1eyzqe2QqGZUmfcPZtrIyt/);
  await expect(page.locator('#previewButton')).toHaveText('Play Spotify soundtrack');
  await page.locator('.media-heading [data-close-media]').click();
  await expect(page.locator('#mediaDrawer')).not.toHaveClass(/is-open/);
  await expect(page.locator('#mediaDrawer')).toHaveAttribute('inert', '');
  await expectNoVisibleEllipses(page);
});

test('Everything keeps a full view with clear interlinking and plain copy', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium', 'Full-view behavior is covered in the desktop project.');
  await openScenario(page, 'relationship');

  await page.locator('#primaryNav [data-primary-view="everything"]').click();
  await expect(page.locator('[data-view-panel="everything"]')).toBeVisible();
  await expect(page.locator('#everythingJumpNav a')).toHaveCount(9);
  await expect(page.locator('#everythingContent .full-section')).toHaveCount(9);
  await expect(page.locator('.full-stat-grid article')).toHaveCount(4);
  await expect(page.locator('.full-workspace-group')).toHaveCount(5);
  await expect(page.locator('.component-choice-grid article')).toHaveCount(6);
  await expect(page.locator('.alarm-flow article')).toHaveCount(4);
  await expect(page.locator('#all-adaptive')).toContainText('Spaces checks the approved information');
  await expect(page.locator('#all-adaptive')).toContainText('The layout stays familiar as the briefing changes');
  await expect(page.locator('#all-weather .full-weather-card')).toBeVisible();
  await expect(page.locator('#all-alarm')).toContainText('approved music from Spotify');
  await expect(page.locator('#all-alarm')).toContainText('short overview');
  await expect(page.locator('#all-privacy')).toContainText('More information requires more control');

  await page.locator('[data-full-workspace-tab="plans"]').click();
  await expect(page.locator('[data-view-panel="workspace"]')).toBeVisible();
  await expect(page.locator('[data-workspace-tab="plans"]')).toHaveAttribute('aria-selected', 'true');

  await page.locator('#primaryNav [data-primary-view="everything"]').click();
  await page.locator('#scenarioSelect').selectOption('team');
  await expect(page.locator('[data-view-panel="today"]')).toBeVisible();
  await page.locator('#primaryNav [data-primary-view="everything"]').click();
  await expect(page.locator('[data-view-panel="everything"]')).toBeVisible();
  await expect(page.locator('#all-spaces')).toContainText('Project Space');
  await expect(page.locator('#all-workspace')).toContainText('Every category in this team and project briefing');

  await page.locator('[data-view-panel="everything"] [data-section-view="how"]').click();
  await expect(page.locator('[data-view-panel="how"]')).toBeVisible();
  await expectNoVisibleEllipses(page);
});

test('memory and People and Spaces examples use plain copy and proper tab behavior', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium', 'Interactive product explanation is covered in the desktop project.');
  await openScenario(page, 'relationship');

  await page.locator('#primaryNav [data-primary-view="how"]').click();
  await expect(page.locator('#intelligenceExplainers')).toBeVisible();
  await expect(page.locator('[data-memory-example]')).toHaveCount(4);
  await expect(page.locator('[data-space-example]')).toHaveCount(3);

  const continuity = page.locator('[data-memory-example="continuity"]');
  const correction = page.locator('[data-memory-example="correction"]');
  await continuity.focus();
  await page.keyboard.press('ArrowRight');
  await expect(correction).toBeFocused();
  await expect(correction).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#memoryComparison')).toContainText('A direct correction can replace a weaker guess');
  await expect(page.locator('#memoryComparison')).toContainText('Previous belief: archived');

  await page.locator('[data-space-example="family"]').click();
  await expect(page.locator('#spaceExamplePanel')).toContainText('One household Brief with separate private records');
  await expect(page.locator('#spaceExamplePanel')).toContainText('Current expenses and bills');
  await expect(page.locator('#spaceExamplePanel')).toContainText('Parent notes');
  await expect(page.locator('.outcome-grid article')).toHaveCount(8);
  await expect(page.locator('.privacy-callout')).toContainText('PRIVATE FIRST');
  await expectNoVisibleEllipses(page);
});

test('mobile demo keeps every view contained and the How map compact', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-chromium', 'Mobile navigation is tested only in the mobile project.');
  await installSpotifyMock(page);
  await page.goto('/brief/', { waitUntil: 'domcontentloaded' });

  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  const bg = await page.locator('html').evaluate(node => getComputedStyle(node).getPropertyValue('--bg').trim());
  expect(bg).toBe('#edf3f8');
  const entryHeadingSize = await page.locator('#entryTitle').evaluate(node => Number.parseFloat(getComputedStyle(node).fontSize));
  expect(entryHeadingSize).toBeLessThanOrEqual(36);
  await expect(page.locator('#entrySoundtrack')).not.toBeChecked();

  await page.locator('#entrySoundtrack').check();
  await page.locator('[data-entry-scenario="relationship"]').click();
  await expect(page.locator('#openDemo')).toBeEnabled();
  await expect(page.locator('#previewButton')).toBeEnabled();
  await page.locator('#openDemo').click();
  await expect(page.locator('[data-view-panel="today"]')).toBeVisible();
  await expect(page.locator('.section-pager')).toHaveCount(5);
  await expect.poll(() => page.evaluate(() => window.__spotifyPlayCalls.length)).toBeGreaterThan(0);
  await expect(page.locator('#mobileNav')).toBeVisible();
  await expect(page.locator('#mobileNav button')).toHaveCount(5);
  await expect(page.locator('#mobileNav button').last()).toHaveText('Everything');

  const heroHeadingSize = await page.locator('#heroTitle').evaluate(node => Number.parseFloat(getComputedStyle(node).fontSize));
  expect(heroHeadingSize).toBeLessThanOrEqual(36);

  for (const view of ['today', 'workspace', 'spaces', 'how', 'everything']) {
    await page.locator(`#mobileNav [data-primary-view="${view}"]`).click();
    await expect(page.locator(`[data-view-panel="${view}"]`)).toBeVisible();
    await expectNoHorizontalOverflow(page);
  }

  await page.locator('#mobileNav [data-primary-view="how"]').click();
  await page.locator('[data-memory-example="preference"]').click();
  await page.locator('[data-space-example="team"]').click();
  await expectNoHorizontalOverflow(page);

  const maxFoundationHeight = await page.locator('.foundation-map > *').evaluateAll(nodes =>
    Math.max(...nodes.map(node => node.getBoundingClientRect().height))
  );
  expect(maxFoundationHeight).toBeLessThanOrEqual(220);

  await page.locator('#mobileNav [data-primary-view="workspace"]').click();
  await page.locator('#scenarioSelect').selectOption('trainer');
  await expect(page.locator('#railContextTitle')).toHaveText('Trainer and student');
  await expect(page.locator('[data-view-panel="today"]')).toBeVisible();
  await expect(page.locator('#workspacePanel .detail-card')).toHaveCount(3);
  await expectNoHorizontalOverflow(page);
  await expectNoVisibleEllipses(page);
});

test('light default, saved dark preference and reset remain reversible', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium', 'Control reversibility is covered in the desktop project.');
  await openScenario(page, 'business');

  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.locator('#themeButton').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#05070b');

  const selectorStyles = await page.locator('#scenarioSelect').evaluate((select) => {
    const selectStyle = getComputedStyle(select);
    const optionStyle = getComputedStyle(select.options[0]);
    return {
      color: selectStyle.color,
      backgroundColor: selectStyle.backgroundColor,
      colorScheme: selectStyle.colorScheme,
      optionColor: optionStyle.color,
      optionBackgroundColor: optionStyle.backgroundColor
    };
  });
  expect(selectorStyles.colorScheme).toContain('dark');
  expect(selectorStyles.color).not.toBe('rgba(0, 0, 0, 0)');
  expect(selectorStyles.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
  expect(selectorStyles.optionColor).not.toBe('rgba(0, 0, 0, 0)');
  expect(selectorStyles.optionBackgroundColor).not.toBe('rgba(0, 0, 0, 0)');
  await page.locator('#scenarioSelect').selectOption('team');
  await expect(page.locator('#railContextTitle')).toHaveText('Team and project');

  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

  await page.locator('[data-entry-scenario="business"]').click();
  await expect(page.locator('#openDemo')).toBeEnabled();
  await page.locator('#openDemo').click();
  await expect(page.locator('[data-view-panel="today"]')).toBeVisible();
  await page.locator('#resetDemo').click();
  await expect(page.locator('body')).toHaveAttribute('data-entered', 'false');
  await expect(page.locator('#entry')).toBeVisible();
  await expect(page.locator('#openDemo')).toBeDisabled();
  await expect(page.locator('#entrySoundtrack')).not.toBeChecked();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('[data-entry-scenario]').first()).toBeFocused();

  await page.evaluate(() => localStorage.removeItem('personal_os_brief_theme_v2'));
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#edf3f8');
});
