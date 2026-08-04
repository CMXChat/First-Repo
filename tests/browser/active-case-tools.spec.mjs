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

async function createCase(request, title, caseType = 'general') {
  const response = await request.post('/api/cases', {
    headers: writeHeaders,
    data: {
      case_type: caseType,
      title,
      authorization_basis: 'Authorized active-case browser regression'
    }
  });
  expect(response.status()).toBe(201);
  return response.json();
}

async function openTool(page, path, caseId) {
  await grantClientSession(page);
  const response = await page.goto(`${path}?case=${encodeURIComponent(caseId)}`, { waitUntil: 'domcontentloaded' });
  expect(response?.ok()).toBeTruthy();
  await expect(page.locator('.cmx-case-context')).toBeVisible();
  await expect(page.locator('.cmx-case-context-badge')).toHaveText('Protected');
  await expect(page.locator('.cmx-case-context-select')).toHaveValue(caseId);
}

async function saveSnapshot(page) {
  const save = page.getByRole('button', { name: 'Save current snapshot' });
  await expect(save).toBeEnabled();
  await save.click();
  await expect(page.locator('.cmx-case-context-message')).toContainText(/Saved/i);
  await expect(save).toBeDisabled();
}

test('Phone saves the normalized number and observation log to the active case', async ({ page, request }) => {
  const record = await createCase(request, `Phone active case ${Date.now()}`, 'phone');
  const number = '+12125550137';

  await openTool(page, '/phone', record.id);
  await page.locator('#phoneNumber').fill(number);
  await page.locator('#analyzePhone').click();
  await expect(page.locator('#outE164')).toHaveText(number);
  await saveSnapshot(page);

  const detailResponse = await request.get(`/api/cases/${record.id}`);
  expect(detailResponse.status()).toBe(200);
  const detail = await detailResponse.json();
  expect(detail.entities.some((entity) => entity.entity_type === 'phone' && entity.normalized_value === number)).toBeTruthy();
  expect(detail.observations.some((observation) => observation.value_text === number)).toBeTruthy();
});

test('Search saves the exact exported research log to the active case', async ({ page, request }) => {
  const record = await createCase(request, `Search active case ${Date.now()}`, 'search');
  const identifier = `operator-query-${Date.now()}`;

  await openTool(page, '/search', record.id);
  await page.locator('#fullName').fill(identifier);
  await page.locator('#buildQueries').click();
  const firstResult = page.locator('#queryResults .cmx-result').first();
  await expect(firstResult).toContainText(identifier);
  await firstResult.getByRole('button', { name: 'Save' }).click();
  await expect(page.locator('#exportLog')).toBeEnabled();
  await saveSnapshot(page);

  const detailResponse = await request.get(`/api/cases/${record.id}`);
  expect(detailResponse.status()).toBe(200);
  const detail = await detailResponse.json();
  expect(detail.queries.some((query) => query.query_text.includes(identifier))).toBeTruthy();
});

test('Metadata saves the exact exported SHA-256 registration to the active case', async ({ page, request }) => {
  const record = await createCase(request, `Metadata active case ${Date.now()}`, 'metadata');
  const filename = `active-case-${Date.now()}.txt`;

  await openTool(page, '/metadata', record.id);
  await page.locator('#fileInput').setInputFiles({
    name: filename,
    mimeType: 'text/plain',
    buffer: Buffer.from('CMX active-case metadata regression sample')
  });
  await expect(page.locator('#exportAll')).toBeEnabled();
  await expect(page.locator('#detailRows')).toContainText(/sha-?256/i);
  await saveSnapshot(page);

  const detailResponse = await request.get(`/api/cases/${record.id}`);
  expect(detailResponse.status()).toBe(200);
  const detail = await detailResponse.json();
  expect(detail.evidence_items.length).toBeGreaterThan(0);
  expect(detail.evidence_items.some((item) => /^[a-f0-9]{64}$/.test(item.sha256))).toBeTruthy();
});

test('Missing Person saves the authorized header, source and fact to the active case', async ({ page, request }) => {
  const record = await createCase(request, `Missing active case ${Date.now()}`, 'missing_person');
  const subject = `Subject reference ${Date.now()}`;
  const sourceLabel = `Official source ${Date.now()}`;
  const fact = `Confirmed welfare fact ${Date.now()}`;

  await openTool(page, '/missing', record.id);
  await page.locator('#subjectLabel').fill(subject);
  await page.locator('#authorizationBasis').fill('Authorized welfare and official-support regression test');
  await page.locator('#saveCase').click();

  await page.locator('#sourceLabel').fill(sourceLabel);
  await page.locator('#sourceUrl').fill('https://example.test/official-source');
  await page.locator('#sourceNotes').fill('Controlled browser regression source');
  await page.locator('#addSource').click();

  await page.locator('#factText').fill(fact);
  await page.locator('#factSource').fill(sourceLabel);
  await page.locator('#factConfidence').selectOption('confirmed');
  await page.locator('#addFact').click();
  await saveSnapshot(page);

  const detailResponse = await request.get(`/api/cases/${record.id}`);
  expect(detailResponse.status()).toBe(200);
  const detail = await detailResponse.json();
  expect(detail.sources.some((source) => source.label === sourceLabel)).toBeTruthy();
  expect(detail.observations.some((observation) => observation.kind === 'fact' && observation.value_text === fact)).toBeTruthy();
  expect(detail.observations.some((observation) => observation.kind === 'missing_case_header')).toBeTruthy();
});
