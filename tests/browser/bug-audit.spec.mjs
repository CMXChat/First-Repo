import { expect, test } from '@playwright/test';

const writeHeaders = {
  Origin: 'http://127.0.0.1:8000',
  'Sec-Fetch-Site': 'same-origin',
  'Content-Type': 'application/json'
};

async function grantClientSession(page) {
  await page.addInitScript(() => {
    sessionStorage.setItem('cmx_session_v4', JSON.stringify({ username: 'admin', at: Date.now() }));
  });
}

async function createCase(request, title, extra = {}) {
  const response = await request.post('/api/cases', {
    headers: writeHeaders,
    data: {
      case_type: 'bug_audit',
      title,
      authorization_basis: 'Authorized browser regression for the platform bug audit',
      ...extra
    }
  });
  expect(response.status()).toBe(201);
  return response.json();
}

async function createObservation(request, caseId, data) {
  const response = await request.post(`/api/cases/${caseId}/observations`, {
    headers: writeHeaders,
    data
  });
  expect(response.status()).toBe(201);
  return response.json();
}

test('active-case deep link hydrates an exact case outside the first list page', async ({ page, request }) => {
  const record = await createCase(request, `Deep link case ${Date.now()}`);
  await page.route('**/api/cases?limit=100', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
  });

  await grantClientSession(page);
  const response = await page.goto(`/phone?case=${encodeURIComponent(record.id)}`, { waitUntil: 'domcontentloaded' });
  expect(response?.ok()).toBeTruthy();
  await expect(page.locator('.cmx-case-context-badge')).toHaveText('Protected');
  await expect(page.locator('.cmx-case-context-select')).toBeEnabled();
  await expect(page.locator('.cmx-case-context-select')).toHaveValue(record.id);
});

test('editing a tool during a delayed snapshot save remains visibly unsaved', async ({ page, request }) => {
  const record = await createCase(request, `Delayed snapshot ${Date.now()}`);
  const firstNumber = '+12125550137';
  const secondNumber = '+12125550138';

  await page.route('**/api/cases/*/imports', async (route) => {
    const response = await route.fetch();
    await new Promise((resolve) => setTimeout(resolve, 450));
    await route.fulfill({ response });
  });

  await grantClientSession(page);
  await page.goto(`/phone?case=${encodeURIComponent(record.id)}`, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.cmx-case-context-select')).toHaveValue(record.id);

  await page.locator('#phoneNumber').fill(firstNumber);
  await page.locator('#analyzePhone').click();
  const save = page.getByRole('button', { name: 'Save current snapshot' });
  await expect(save).toBeEnabled();
  await save.click();
  await expect(page.locator('.cmx-case-context-select')).toBeDisabled();

  await page.locator('#phoneNumber').fill(secondNumber);
  await page.locator('#analyzePhone').click();

  await expect(page.locator('.cmx-case-context-select')).toBeEnabled();
  await expect(page.locator('.cmx-case-context-message')).toContainText(/Unsaved/i);
  await expect(save).toBeEnabled();

  const detail = await request.get(`/api/cases/${record.id}`);
  expect(detail.status()).toBe(200);
  const payload = await detail.json();
  expect(payload.entities.some((item) => item.normalized_value === firstNumber)).toBeTruthy();
  expect(payload.entities.some((item) => item.normalized_value === secondNumber)).toBeFalsy();
});

test('case created through the visible form appears without a manual refresh', async ({ page }) => {
  const title = `Visible create refresh ${Date.now()}`;
  await grantClientSession(page);
  await page.goto('/cases', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#backendBadge')).toHaveText(/Backend connected/i);
  await page.getByRole('button', { name: 'New case' }).click();
  await page.locator('#caseTitle').fill(title);
  await page.locator('#caseAuthorization').fill('Authorized visible create regression');
  await page.locator('#createCase').click();
  await expect(page.locator('#caseList')).toContainText(title);
  await expect(page.locator('#detailTitle')).toHaveText(title);
});

test('retention review opens the exact case workspace', async ({ page, request }) => {
  const record = await createCase(request, `Retention target ${Date.now()}`, {
    retention_until: '2026-08-01T12:00:00Z'
  });
  await grantClientSession(page);
  await page.goto('/cases/lifecycle', { waitUntil: 'domcontentloaded' });
  const card = page.locator('.life-item').filter({ hasText: record.title });
  await expect(card).toBeVisible();
  await card.getByRole('button', { name: 'Open case workspace' }).click();
  await expect(page).toHaveURL(new RegExp(`/cases\\?case=${record.id}$`));
});

test('enrichment duplicate review compares provenance, not only the summary', async ({ page, request }) => {
  const record = await createCase(request, `Enrichment provenance ${Date.now()}`);
  const summary = 'RDAP domain EXAMPLE.COM · active';
  await createObservation(request, record.id, {
    kind: 'enrichment_rdap',
    value_text: summary,
    note: 'Different provider provenance from an earlier collection',
    confidence: 'unrated'
  });

  await page.route('**/api/enrichment/rdap?*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        adapter: 'rdap',
        provider: 'IANA-bootstrapped RDAP service (rdap.registry.example)',
        source_url: 'https://rdap.registry.example/domain/example.com',
        collected_at: '2026-08-04T19:30:00+00:00',
        target: 'example.com',
        target_type: 'domain',
        result: {
          ldh_name: 'EXAMPLE.COM',
          status: ['active'],
          handle: 'EXAMPLE-COM'
        },
        cache_hit: false,
        requested_by: 'development:browser@example.test'
      })
    });
  });

  await grantClientSession(page);
  await page.goto(`/osint?case=${encodeURIComponent(record.id)}`, { waitUntil: 'domcontentloaded' });
  await page.locator('#enrichmentTarget').fill('example.com');
  await page.getByRole('button', { name: 'Run RDAP' }).click();
  await expect(page.locator('#enrichmentResult')).toBeVisible();
  await page.getByRole('button', { name: 'Save finding to active case' }).click();
  await expect(page.locator('#enrichmentStatus')).toContainText(/Saved enrichment_rdap observation/i);
  await expect(page.locator('#enrichmentDuplicate')).toBeHidden();

  const detail = await request.get(`/api/cases/${record.id}`);
  expect(detail.status()).toBe(200);
  const observations = (await detail.json()).observations.filter((item) => item.kind === 'enrichment_rdap');
  expect(observations).toHaveLength(2);
});
