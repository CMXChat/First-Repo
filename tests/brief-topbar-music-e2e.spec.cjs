const { test, expect } = require('@playwright/test');

async function installSpotifyControllerMock(page) {
  await page.route('https://open.spotify.com/embed/iframe-api/v1', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/javascript',
      body: `
        (() => {
          const listeners = {};
          window.__briefSpotifyPlayCalls = 0;
          window.__briefSpotifyControllerReady = false;
          window.onSpotifyIframeApiReady?.({
            createController(host, options, callback) {
              const controller = {
                addListener(name, handler) {
                  listeners[name] = handler;
                  if (name === 'ready') {
                    setTimeout(() => {
                      window.__briefSpotifyControllerReady = true;
                      handler({ data: {} });
                    }, 0);
                  }
                },
                loadEntity(uri) {
                  window.__briefSpotifyLoadedUri = uri;
                },
                play() {
                  window.__briefSpotifyPlayCalls += 1;
                  listeners.playback_started?.({
                    data: { playingURI: window.__briefSpotifyLoadedUri || options.uri }
                  });
                },
                pause() {
                  listeners.playback_update?.({
                    data: {
                      isPaused: true,
                      playingURI: window.__briefSpotifyLoadedUri || options.uri
                    }
                  });
                }
              };
              callback(controller);
            }
          });
        })();
      `
    });
  });
}

test('Spaces topbar remains contained, mobile-safe, and starts music from its own control', async ({ page }) => {
  await installSpotifyControllerMock(page);
  await page.goto('/spaces/', { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveURL(/\/spaces\//);
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.reload({ waitUntil: 'domcontentloaded' });

  await expect(page.locator('#entry')).toBeVisible();
  await expect(page.locator('#entrySoundtrack')).toHaveCount(0);
  await page.waitForFunction(() => window.__briefSpotifyControllerReady === true);

  await page.locator('[data-entry-scenario="personal"]').click();
  await page.locator('#openDemo').click();

  await expect(page.locator('body')).toHaveAttribute('data-entered', 'true');
  await expect(page.locator('.doc-topbar-link')).toHaveCount(0);
  await expect(page.locator('#mediaButton')).toBeVisible();
  await expect(page.locator('#themeButton')).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.__briefSpotifyPlayCalls)).toBe(0);
  await page.locator('#mediaButton').click();
  await expect(page.locator('#previewButton')).toBeEnabled();
  await page.locator('#previewButton').click();
  await page.waitForFunction(() => window.__briefSpotifyPlayCalls >= 1);
  await page.locator('.media-heading [data-close-media]').click();

  const topbar = await page.locator('.topbar-inner').evaluate(node => {
    const rect = node.getBoundingClientRect();
    const shell = node.closest('.topbar');
    const shellStyle = shell ? getComputedStyle(shell) : null;
    const theme = document.querySelector('#themeButton');
    const themeStyle = theme ? getComputedStyle(theme) : null;
    const music = document.querySelector('#mediaButton');
    const musicStyle = music ? getComputedStyle(music) : null;
    const themeIcon = theme?.querySelector('span');
    const themeIconStyle = themeIcon ? getComputedStyle(themeIcon) : null;
    return {
      top: rect.top,
      right: rect.right,
      viewportWidth: document.documentElement.clientWidth,
      paddingTop: Number.parseFloat(shellStyle?.paddingTop || '0'),
      themeBackground: themeStyle?.backgroundColor || '',
      musicBackground: musicStyle?.backgroundColor || '',
      themeBorderRadius: themeStyle?.borderRadius || '',
      musicBorderRadius: musicStyle?.borderRadius || '',
      outerTextShadow: themeStyle?.textShadow || '',
      iconTextShadow: themeIconStyle?.textShadow || '',
      boxShadow: themeStyle?.boxShadow || 'none'
    };
  });

  expect(topbar.top).toBeGreaterThanOrEqual(0);
  expect(topbar.right).toBeLessThanOrEqual(topbar.viewportWidth + 1);
  if ((page.viewportSize()?.width || 0) <= 860) {
    expect(topbar.paddingTop).toBeGreaterThanOrEqual(9);
  }
  expect(topbar.themeBackground).toBe(topbar.musicBackground);
  expect(topbar.themeBorderRadius).toBe(topbar.musicBorderRadius);
  expect(topbar.outerTextShadow).toBe('none');
  expect(topbar.iconTextShadow).not.toBe('none');
  expect(topbar.boxShadow).not.toBe('none');

  await page.locator('#themeButton').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});
