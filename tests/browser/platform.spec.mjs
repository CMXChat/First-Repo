import { expect, test } from '@playwright/test';

const SESSION_KEY = 'cmx_access_transition_v1';
const DEV_USER = 'browser-operator@example.test';

async function grantClientSession(page) {
  await page.addInitScript(({ key }) => {
    sessionStorage.setItem(key, JSON.stringify({ granted: true, at: Date.now() }));
  }, { key: SESSION_KEY });
}

async function openProtected(page, path) {
  await grantClientSession(page);
  await page.goto(path, { waitUntil: 'domcontentloaded' });
}

async function openCaseCreation(page) {
  const toggle = page.locator('#newCaseToggle');
  if (await toggle.count()) {
    await toggle.click();
    await expect(page.locator('#caseTitle')).toBeVisible();
  }
}

test.describe('protected route smoke tests', () => {
  for (const path of ['/directory', '/cases', '/osint', '/phone', '/metadata', '/search', '/missing', '/resources']) {
    test(`${path} loads under the client transition session`, async ({ page }) => {
      await openProtected(page, path);
      await expect(page.locator('body')).toBeVisible();
    });
  }
});

test('cross-tool query parameters prefill Phone and Search', async ({ page }) => {
  await openProtected(page, '/phone?phone=%2B12125550123');
  await expect(page.locator('#phoneInput')).toHaveValue('+12125550123');

  await openProtected(page, '/search?q=browser%20prefill');
  await expect(page.locator('#queryInput')).toHaveValue('browser prefill');
});

test('OSINT prefers the authenticated DNS gateway and discards stale responses', async ({ page }) => {
  await grantClientSession(page);
  let firstRequest;
  await page.route('**/api/dns/resolve**', async (route) => {
    const url = new URL(route.request().url());
    const name = url.searchParams.get('name');
    if (name === 'first.example') {
      firstRequest = route;
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        resolver: 'CMX authenticated DNS gateway',
        resolver_url: '/api/dns/resolve',
        fetched_at: new Date().toISOString(),
        results: [{ type: 'A', data: '203.0.113.20', ttl: 60 }]
      })
    });
  });

  await page.goto('/osint', { waitUntil: 'domcontentloaded' });
  await page.locator('#entityInput').fill('first.example');
  await page.locator('#analyzeEntity').click();
  await page.locator('#entityInput').fill('second.example');
  await page.locator('#analyzeEntity').click();
  await expect(page.locator('#dnsStatus')).toContainText(/authenticated DNS gateway/i);
  await expect(page.locator('#dnsRecords')).toContainText('203.0.113.20');

  if (firstRequest) {
    await firstRequest.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        resolver: 'CMX authenticated DNS gateway',
        resolver_url: '/api/dns/resolve',
        fetched_at: new Date().toISOString(),
        results: [{ type: 'A', data: '198.51.100.10', ttl: 60 }]
      })
    }).catch(() => {});
  }
  await expect(page.locator('#dnsRecords')).not.toContainText('198.51.100.10');
});

test('OSINT saves an explicit snapshot to the selected persistent case', async ({ page, request }) => {
  const headers = { 'X-CMX-Dev-User': DEV_USER };
  const created = await request.post('/api/cases', {
    headers,
    data: {
      title: `Browser OSINT case ${Date.now()}`,
      case_type: 'osint',
      authorization_basis: 'Authorized browser regression test'
    }
  });
  expect(created.ok()).toBeTruthy();
  const caseRecord = await created.json();

  await grantClientSession(page);
  await page.goto(`/osint?case=${encodeURIComponent(caseRecord.id)}`, { waitUntil: 'domcontentloaded' });
  await page.locator('#entityInput').fill('example.com');
  await page.locator('#analyzeEntity').click();
  await expect(page.locator('#caseContextStatus')).toContainText(/ready to save/i);
  await page.locator('#saveCaseContext').click();
  await expect(page.locator('#caseContextStatus')).toContainText(/saved/i);

  const detail = await request.get(`/api/cases/${caseRecord.id}`, { headers });
  expect(detail.ok()).toBeTruthy();
  const payload = await detail.json();
  expect(payload.entities.length).toBeGreaterThan(0);
});

test('Cases opens the exact case requested by the active-case context', async ({ page, request }) => {
  const headers = { 'X-CMX-Dev-User': DEV_USER };
  const created = await request.post('/api/cases', {
    headers,
    data: {
      title: `Exact case ${Date.now()}`,
      case_type: 'general',
      authorization_basis: 'Authorized exact-case regression test'
    }
  });
  const record = await created.json();
  await openProtected(page, `/cases?case=${encodeURIComponent(record.id)}`);
  await expect(page.locator('#detailTitle')).toHaveText(record.title);
});

test('Metadata renders an adversarial filename as text', async ({ page }) => {
  await openProtected(page, '/metadata');
  const filename = `<img src=x onerror=window.__cmxMetadataXss=1>.txt`;
  await page.locator('#fileInput').setInputFiles({
    name: filename,
    mimeType: 'text/plain',
    buffer: Buffer.from('safe browser fixture')
  });
  await expect(page.getByText(filename)).toBeVisible();
  await expect(page.locator('img[src="x"]')).toHaveCount(0);
  expect(await page.evaluate(() => window.__cmxMetadataXss)).toBeUndefined();
});

test('Cases creates and renders an adversarial title safely', async ({ page }) => {
  await openProtected(page, '/cases');
  await expect(page.locator('#backendBadge')).toHaveText(/Backend connected/i);
  await openCaseCreation(page);

  const title = `<img src=x onerror=window.__cmxCaseXss=1> ${Date.now()}`;
  await page.locator('#caseTitle').fill(title);
  await page.locator('#caseAuthorization').fill('Authorized browser regression test');
  await page.locator('#caseSummaryInput').fill('Browser-created case');
  await page.locator('#createCase').click();

  await expect(page.locator('#detailTitle')).toHaveText(title);
  await expect(page.locator('.cases-item-title').filter({ hasText: title })).toHaveCount(1);
  await expect(page.locator('img[src="x"]')).toHaveCount(0);
  expect(await page.evaluate(() => window.__cmxCaseXss)).toBeUndefined();
});

test('Cases imports a Search session through the visible workspace', async ({ page }) => {
  await openProtected(page, '/cases');
  await expect(page.locator('#backendBadge')).toHaveText(/Backend connected/i);
  await openCaseCreation(page);

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
  await expect(page.locator('#importSession')).toBeEnabled();
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
