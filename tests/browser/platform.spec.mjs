import { expect, test } from '@playwright/test';

const writeHeaders = {
  Origin: 'http://127.0.0.1:8000',
  'Sec-Fetch-Site': 'same-origin',
  'Content-Type': 'application/json'
};

const protectedRoutes = [
  ['/directory', 'Operations Directory'],
  ['/cases', 'CMX Cases'],
  ['/osint', 'CMX OSINT Console'],
  ['/phone', 'CMX Phone Intelligence'],
  ['/metadata', 'CMX Metadata Inspector'],
  ['/search', 'CMX Search Workbench'],
  ['/missing', 'CMX Missing-Person Research'],
  ['/resources', 'CMX OSINT Resources']
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
  const expectedUrl = new URL(path, 'http://127.0.0.1:8000');
  await expect(page).toHaveURL((url) =>
    url.pathname === expectedUrl.pathname && url.search === expectedUrl.search
  );
}

async function openCaseCreation(page) {
  const title = page.locator('#caseTitle');
  if (await title.isVisible()) return;
  const toggle = page.getByRole('button', { name: 'New case', exact: true });
  await expect(toggle).toBeVisible();
  await toggle.click();
  await expect(title).toBeVisible();
}

async function createPersistentCase(request, title, caseType = 'general') {
  const response = await request.post('/api/cases', {
    headers: writeHeaders,
    data: {
      case_type: caseType,
      title,
      authorization_basis: 'Authorized platform browser regression test'
    }
  });
  expect(response.status()).toBe(201);
  return response.json();
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

test('OSINT prefers the authenticated DNS gateway and discards stale responses', async ({ page }) => {
  await grantClientSession(page);
  let directResolverCalls = 0;

  await page.route('https://dns.google/**', async (route) => {
    directResolverCalls += 1;
    await route.abort();
  });

  await page.route('**/api/dns?*', async (route) => {
    const url = new URL(route.request().url());
    const name = url.searchParams.get('name') || '';
    const type = url.searchParams.get('type') || 'A';
    const isSlow = name.includes('slow.example');
    await new Promise((resolve) => setTimeout(resolve, isSlow ? 250 : 15));

    const address = isSlow ? '192.0.2.10' : '203.0.113.20';
    const answer = type === 'A' && !name.startsWith('_')
      ? [{ name: `${name}.`, type: 1, TTL: 60, data: address }]
      : [];

    try {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          source: 'Google Public DNS JSON API',
          queried_at: new Date().toISOString(),
          cache_hit: false,
          Status: 0,
          AD: true,
          TC: false,
          RA: true,
          Comment: '',
          Answer: answer
        })
      });
    } catch {
      // The older request is expected to be aborted when the active entity changes.
    }
  });

  const response = await page.goto('/osint', { waitUntil: 'domcontentloaded' });
  expect(response?.ok()).toBeTruthy();

  await page.locator('#entityType').selectOption('domain');
  await page.locator('#entityValue').fill('slow.example');
  await page.locator('#analyzeEntity').click();
  await page.waitForTimeout(30);

  await page.locator('#entityValue').fill('fast.example');
  await page.locator('#analyzeEntity').click();

  await expect(page.locator('#dnsDomain')).toHaveText('fast.example');
  await expect(page.locator('#dnsStatus')).toContainText('CMX authenticated DNS gateway');
  await expect(page.locator('#dnsBody')).toContainText('203.0.113.20');
  await expect(page.locator('#dnsBody')).not.toContainText('192.0.2.10');
  expect(directResolverCalls).toBe(0);
});

test('OSINT saves an explicit snapshot to the selected persistent case', async ({ page, request }) => {
  const title = `OSINT context case ${Date.now()}`;
  const record = await createPersistentCase(request, title, 'osint');
  const username = `context_${Date.now()}`;

  await grantClientSession(page);
  const response = await page.goto(`/osint?case=${encodeURIComponent(record.id)}`, { waitUntil: 'domcontentloaded' });
  expect(response?.ok()).toBeTruthy();

  await expect(page.locator('.cmx-case-context-badge')).toHaveText('Protected');
  await expect(page.locator('.cmx-case-context-select')).toHaveValue(record.id);

  await page.locator('#entityType').selectOption('username');
  await page.locator('#entityValue').fill(username);
  await page.locator('#entityNotes').fill('Authorized active-case persistence regression');
  await page.locator('#analyzeEntity').click();

  const save = page.getByRole('button', { name: 'Save current snapshot' });
  await expect(save).toBeEnabled();
  await save.click();
  await expect(page.locator('.cmx-case-context-message')).toContainText(/saved/i);
  await expect(save).toBeDisabled();

  const detailResponse = await request.get(`/api/cases/${record.id}`);
  expect(detailResponse.status()).toBe(200);
  const detail = await detailResponse.json();
  expect(detail.entities.some((entity) => entity.entity_type === 'username' && entity.normalized_value === username)).toBeTruthy();
  expect(detail.observations.some((observation) => observation.kind === 'analysis' && observation.value_text === username)).toBeTruthy();
});

test('Cases opens the exact case requested by the active-case context', async ({ page, request }) => {
  const title = `Requested case ${Date.now()}`;
  const record = await createPersistentCase(request, title, 'osint');

  await grantClientSession(page);
  const response = await page.goto(`/cases?case=${encodeURIComponent(record.id)}`, { waitUntil: 'domcontentloaded' });
  expect(response?.ok()).toBeTruthy();
  await expect(page.locator('#backendBadge')).toHaveText(/Backend connected/i);
  await expect(page.locator('#detailId')).toHaveText(record.id);
  await expect(page.locator('#detailTitle')).toHaveText(title);
});

test('Metadata renders an adversarial filename as text', async ({ page }) => {
  const filename = '<img src=x onerror=window.__cmxXss=1>.txt';
  await openProtected(page, '/metadata');
  await page.locator('#fileInput').setInputFiles({
    name: filename,
    mimeType: 'text/plain',
    buffer: Buffer.from('safe text sample')
  });
  await expect(page.locator('#detailTitle')).toHaveText(filename);
  await expect(page.locator('img[src="x"]')).toHaveCount(0);
  expect(await page.evaluate(() => window.__cmxXss)).toBeUndefined();
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

  await expect(page.getByText(title, { exact: true })).toBeVisible();
  await expect(page.locator('img[src="x"]')).toHaveCount(0);
  expect(await page.evaluate(() => window.__cmxCaseXss)).toBeUndefined();
  await expect(page.locator('#detailTitle')).toHaveText(title);
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
