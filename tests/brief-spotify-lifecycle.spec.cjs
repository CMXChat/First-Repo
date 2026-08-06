const { test, expect } = require('@playwright/test');

async function mockSpotify(page, mode = 'success') {
  await page.addInitScript(({ mode }) => {
    window.__spotifyLoadedUris = [];
    window.__spotifyPlayCalls = [];
    window.__spotifyPauseCalls = 0;

    window.BRIEF_SPOTIFY_IFRAME_API = {
      createController(element, options, callback) {
        const listeners = {};
        let uri = options.uri;
        const frame = document.createElement('iframe');
        frame.src = `https://open.spotify.com/embed/track/${uri.split(':').pop()}?mock=1`;
        element.replaceWith(frame);

        const controller = {
          addListener(name, handler) {
            listeners[name] = handler;
            if (name === 'ready') queueMicrotask(() => handler({ data: {} }));
          },
          loadEntity(nextUri) {
            uri = nextUri;
            window.__spotifyLoadedUris.push(nextUri);
            frame.src = `https://open.spotify.com/embed/track/${nextUri.split(':').pop()}?mock=1`;
          },
          play() {
            window.__spotifyPlayCalls.push(uri);
            if (mode === 'throw-play') throw new Error('mock playback rejection');
            if (mode === 'silent-play') return;
            listeners.playback_started?.({ data: { playingURI: uri } });
            listeners.playback_update?.({ data: { playingURI: uri, isPaused: false } });
          },
          pause() {
            window.__spotifyPauseCalls += 1;
            listeners.playback_update?.({ data: { playingURI: uri, isPaused: true } });
          }
        };

        callback(controller);
      }
    };
  }, { mode });
}

async function openWithSoundtrack(page, scenario = 'personal') {
  await page.goto('/brief/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#entrySoundtrack')).not.toBeChecked();
  await page.locator('#entrySoundtrack').check();
  await page.locator(`[data-entry-scenario="${scenario}"]`).click();
  await expect(page.locator('#openDemo')).toBeEnabled();
  await expect(page.locator('#previewButton')).toBeEnabled();
  await page.locator('#openDemo').click();
  await expect(page.locator('body')).toHaveAttribute('data-entered', 'true');
  await expect(page.locator('[data-view-panel="today"]')).toBeVisible();
}

test('silent Spotify playback refusal becomes a direct-tap message without opening the drawer', async ({ page }) => {
  await mockSpotify(page, 'silent-play');
  await openWithSoundtrack(page, 'personal');

  await expect.poll(() => page.evaluate(() => window.__spotifyPlayCalls.length)).toBeGreaterThan(0);
  await expect(page.locator('#mediaDrawer')).not.toHaveClass(/is-open/);
  await expect(page.locator('#mediaStatus')).toContainText('one direct tap', { timeout: 3000 });

  await page.locator('#mediaButton').click();
  await expect(page.locator('#mediaDrawer')).toHaveClass(/is-open/);
  await expect(page.locator('#spotifyFrame')).toHaveAttribute('src', /open\.spotify\.com\/embed\/track\//);
});

test('Spotify play exception never blocks entry or traps focus', async ({ page }) => {
  await mockSpotify(page, 'throw-play');
  await openWithSoundtrack(page, 'team');

  await expect(page.locator('#mediaDrawer')).not.toHaveClass(/is-open/);
  await expect(page.locator('#mediaStatus')).toContainText('one direct tap');
  await page.locator('#mediaButton').focus();
  await page.locator('#mediaButton').click();
  await expect(page.locator('#mediaDrawer')).toHaveClass(/is-open/);
  await page.locator('.media-heading [data-close-media]').click();
  await expect(page.locator('#mediaButton')).toBeFocused();
});

test('switching context loads the selected scenario track through the controller', async ({ page }) => {
  await mockSpotify(page, 'success');
  await openWithSoundtrack(page, 'personal');

  await page.locator('#scenarioSelect').selectOption('team');
  await expect(page.locator('body')).toHaveAttribute('data-scenario', 'team');
  await expect(page.locator('[data-view-panel="today"]')).toBeVisible();

  await expect.poll(() => page.evaluate(() => window.__spotifyLoadedUris.at(-1) || '')).toMatch(/^spotify:track:/);
  const loaded = await page.evaluate(() => window.__spotifyLoadedUris.at(-1));
  const expected = await page.evaluate(() => `spotify:track:${window.BRIEF_DEMO_DATA.scenarios.team.soundtrack.spotifyTrackId}`);
  expect(loaded).toBe(expected);
});

test('Spotify API timeout falls back to the official direct-tap embed', async ({ page }) => {
  await page.route('https://open.spotify.com/embed/iframe-api/v1', route => route.fulfill({
    status: 200,
    contentType: 'application/javascript',
    body: '/* intentionally does not call onSpotifyIframeApiReady */'
  }));
  await page.route('https://open.spotify.com/embed/track/**', route => route.fulfill({
    status: 200,
    contentType: 'text/html',
    body: '<!doctype html><title>Spotify test frame</title>'
  }));

  await page.goto('/brief/', { waitUntil: 'domcontentloaded' });
  await page.locator('#entrySoundtrack').check();
  await page.locator('[data-entry-scenario="relationship"]').click();
  await expect(page.locator('#openDemo')).toBeEnabled();
  await page.locator('#openDemo').click();
  await expect(page.locator('body')).toHaveAttribute('data-entered', 'true');

  await expect(page.locator('#mediaStatus')).toContainText('direct tap mode', { timeout: 6000 });
  await page.locator('#mediaButton').click();
  await expect(page.locator('#previewButton')).toBeHidden();
  await expect(page.locator('#spotifyFrame')).toHaveAttribute('src', /open\.spotify\.com\/embed\/track\//);
});
