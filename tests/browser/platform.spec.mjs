import { expect, test } from '@playwright/test';

const protectedRoutes = [
  ['/directory', 'Operations Directory'],
  ['/cases', 'CMX Cases'],
  ['/osint', 'CMX OSINT Console'],
  ['/phone', 'CMX Phone Intelligence'],
  ['/metadata', 'CMX Metadata Inspector'],
  ['/search', 'CMX Search Workbench'],
  ['/missing', 'CMX Missing-Person Research'],
  ['/resources', 'OSINT Resource Library']
];

async function grantClientSession(page) {
  await page.addInitScript(() => {
    sessionStorage.setItem('cmx_session_v4', JSON.stringify({ username: 'admin', at: Date.now() }));
  });
}

async function openProtected(page, path) {
  await grantClientSession(page);
  const response = await page.goto(path, { waitUntil: 'domcontentloaded' });
  expect(response?.ok()).toBeTruthy();
  await expect(page).toHaveURL(new RegExp(`${path.replace('/', '\\/')}/?$`));
}

test.describe('protected route smoke tests', () => {
  for (const [path, title] of protectedRoutes) {
    test(`${path} loads under the client transition session`, async ({ page }) => {
      await openProtected(page, path);
      await expect(page).toHaveTitle(new RegExp(title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
      await expect(page.locator('.cmx-standard-bar')).toBeVisible();
    });
  }
});

test('cross-tool query parameters prefill Phone and Search', async ({ page }) => {
  await openProtected(page, '/phone?n=%2B12125550100');
  await expect(page.locator('#phoneNumber')).toHaveValue('+12125550100');

  await page.goto('/search?type=email&entity=operator%40example.test', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#email')).toHaveValue('operator@example.test');
});

test('Metadata renders an adversarial filename as text', async ({ page }) => {
  await openProtected(page, '/metadata');
  await page.locator('#fileInput').setInputFiles({
    name: '<img src=x onerror=window.__cmxXss=1>.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('safe text sample')
  });
  await expect(page.getByText('<img src=x onerror=window.__cmxXss=1>.txt', { exact: true })).toBeVisible();
  await expect(page.locator('img[src="x"]')).toHaveCount(0);
  expect(await page.evaluate(() => window.__cmxXss)).toBeUndefined();
});

test('Cases creates and renders an adversarial title safely', async ({ page }) => {
  await openProtected(page, '/cases');
  await expect(page.locator('#backendBadge')).toHaveText(/Backend connected/i);

  const title = `<img src=x onerror=window.__cmxCaseXss=1> ${Date.now()}`;
  await page.locator('#caseTitle').fill(title);
  await page.locator('#caseAuthorization').fill('Authorized browser regression test');
  await page.locator('#caseSummaryInput').fill('Browser-created case');
  await page.locator('#createCase').click();

  await expect(page.getByText(title, { exact: true })).toBeVisible();
  await expect(page.locator('img[src="x"]')).toHaveCount(0);
  expect(await page.evaluate(() => window.__cmxCaseXss)).toBeUndefined();
  await expect(page.locator('#detailTitle')).toHaveText(title);
});

test('Cases imports a Search session through the visible workspace', async ({ page }) => {
  await openProtected(page, '/cases');
  await expect(page.locator('#backendBadge')).toHaveText(/Backend connected/i);

  const title = `Import case ${Date.now()}`;
  await page.locator('#caseTitle').fill(title);
  await page.locator('#caseAuthorization').fill('Authorized browser import test');
  await page.locator('#createCase').click();
  await expect(page.locator('#detailTitle')).toHaveText(title);

  const payload = {
    schema: 'cmx-search-session-v1',
    exportedAt: new Date().toISOString(),
    entries: [
      {
        savedAt: new Date().toISOString(),
        engine: 'Google',
        purpose: 'Browser import test',
        query: '"browser-import.example"',
        url: 'https://www.google.com/search?q=%22browser-import.example%22'
      }
    ]
  };
  await page.locator('#importFile').setInputFiles({
    name: 'cmx-search-session.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(payload))
  });
  await expect(page.locator('#importPreview')).toContainText('cmx-search-session-v1');
  await page.locator('#importSession').click();
  await expect(page.locator('#importResult')).toContainText('cmx-search-session-v1');
  await expect(page.locator('#countQueries')).toHaveText('1');
  await expect(page.getByText(/browser-import\.example/).first()).toBeVisible();
});

test('Cases remains read-only when the FastAPI service is unavailable', async ({ page }) => {
  await grantClientSession(page);
  await page.route('**/api/whoami', async (route) => {
    await route.fulfill({ status: 404, contentType: 'text/html', body: '<!doctype html><title>Static</title>' });
  });
  await page.goto('/cases', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#backendBadge')).toHaveText(/Static transition mode/i);
  await expect(page.locator('#createCase')).toBeDisabled();
  await expect(page.locator('#refreshCases')).toBeDisabled();
});
