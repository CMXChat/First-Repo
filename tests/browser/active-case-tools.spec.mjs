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

test('Direct capture writes source, finding and query records without fetching third-party content', async ({ page, request }) => {
  const record = await createCase(request, `Direct capture case ${Date.now()}`, 'osint');
  const sourceLabel = `Capture source ${Date.now()}`;
  const sourceUrl = `https://capture.example.test/source-${Date.now()}`;
  const findingValue = `Confirmed capture finding ${Date.now()}`;
  const queryText = `site:capture.example.test ${Date.now()}`;
  const resultUrl = `https://capture.example.test/result-${Date.now()}`;
  let externalRequests = 0;

  await page.route('https://capture.example.test/**', async (route) => {
    externalRequests += 1;
    await route.abort();
  });

  await openTool(page, '/osint', record.id);
  const captureToggle = page.getByRole('button', { name: 'Capture record' });
  await expect(captureToggle).toBeEnabled();
  await captureToggle.click();
  await expect(page.locator('#cmxCaptureDrawer')).toBeVisible();

  await page.locator('#cmxCaptureSourceLabel').fill(sourceLabel);
  await page.locator('#cmxCaptureSourceUrl').fill(sourceUrl);
  await page.locator('#cmxCaptureSourceType').selectOption('official');
  await page.locator('#cmxCaptureSourceNotes').fill('Direct source capture regression');
  await expect(page.locator('#cmxCaptureDisclosure')).toContainText(sourceUrl);
  await page.getByRole('button', { name: 'Save source' }).click();
  await expect(page.locator('#cmxCaptureStatus')).toContainText(/Saved source/i);

  await page.locator('#cmxCaptureSourceLabel').fill(sourceLabel);
  await page.locator('#cmxCaptureSourceUrl').fill(sourceUrl);
  await page.locator('#cmxCaptureSourceType').selectOption('official');
  await page.getByRole('button', { name: 'Save source' }).click();
  await expect(page.locator('#cmxCaptureDuplicate')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Save source' })).toBeDisabled();
  await page.locator('#cmxCaptureDuplicateReview').check();
  await expect(page.getByRole('button', { name: 'Save source' })).toBeEnabled();
  await page.locator('#cmxCaptureClear').click();
  await expect(page.locator('#cmxCaptureDuplicate')).toBeHidden();

  await page.locator('#cmxCaptureKind').selectOption('finding');
  await page.locator('#cmxCaptureFindingKind').fill('fact');
  await page.locator('#cmxCaptureFindingValue').fill(findingValue);
  await page.locator('#cmxCaptureFindingSource').selectOption({ label: `official · ${sourceLabel}` });
  await page.locator('#cmxCaptureFindingConfidence').selectOption('confirmed');
  await page.locator('#cmxCaptureFindingNote').fill('Corroborated against the registered source');
  await page.getByRole('button', { name: 'Save finding' }).click();
  await expect(page.locator('#cmxCaptureStatus')).toContainText(/Saved fact/i);

  await page.locator('#cmxCaptureKind').selectOption('query');
  await page.locator('#cmxCaptureQueryProvider').fill('Google');
  await page.locator('#cmxCaptureQueryText').fill(queryText);
  await page.locator('#cmxCaptureQueryUrl').fill(resultUrl);
  await page.locator('#cmxCaptureQueryPurpose').fill('Record query provenance without storing result content');
  await page.getByRole('button', { name: 'Save query' }).click();
  await expect(page.locator('#cmxCaptureStatus')).toContainText(/Saved query/i);

  const detailResponse = await request.get(`/api/cases/${record.id}`);
  expect(detailResponse.status()).toBe(200);
  const detail = await detailResponse.json();
  const source = detail.sources.find((item) => item.url === sourceUrl);
  expect(source).toBeTruthy();
  expect(detail.sources.filter((item) => item.url === sourceUrl)).toHaveLength(1);
  expect(detail.observations.some((item) =>
    item.kind === 'fact'
    && item.value_text === findingValue
    && item.source_id === source.id
    && item.confidence === 'confirmed'
  )).toBeTruthy();
  expect(detail.queries.some((item) =>
    item.provider === 'Google'
    && item.query_text === queryText
    && item.result_url === resultUrl
  )).toBeTruthy();
  expect(externalRequests).toBe(0);
});

test('OSINT enrichment cancels stale work and saves one normalized finding to the active case', async ({ page, request }) => {
  const record = await createCase(request, `Enrichment active case ${Date.now()}`, 'osint');
  let providerRequests = 0;

  await page.route('**/api/enrichment/rdap?*', async (route) => {
    const target = new URL(route.request().url()).searchParams.get('target') || '';
    if (target === 'old.example.com') {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        adapter: 'rdap',
        provider: 'IANA-bootstrapped RDAP service (rdap.registry.example)',
        source_url: `https://rdap.registry.example/domain/${target}`,
        collected_at: '2026-08-04T18:30:00+00:00',
        target,
        target_type: 'domain',
        result: {
          object_class_name: 'domain',
          handle: `HANDLE-${target}`,
          status: ['active'],
          ldh_name: target.toUpperCase(),
          nameservers: ['NS1.EXAMPLE.NET']
        },
        cache_hit: false,
        requested_by: 'development:browser@example.test'
      })
    });
  });

  await page.route('https://rdap.registry.example/**', async (route) => {
    providerRequests += 1;
    await route.abort();
  });

  await openTool(page, '/osint', record.id);
  await page.locator('#enrichmentTarget').fill('old.example.com');
  await page.getByRole('button', { name: 'Run RDAP' }).click();
  await expect(page.getByRole('button', { name: 'Cancel' })).toBeEnabled();
  await page.getByRole('button', { name: 'Cancel' }).click();

  await page.locator('#enrichmentTarget').fill('example.com');
  await page.getByRole('button', { name: 'Run RDAP' }).click();
  await expect(page.locator('#enrichmentResult')).toBeVisible();
  await expect(page.locator('#enrichmentProvenance')).toContainText('rdap.registry.example');
  await expect(page.locator('#enrichmentSummary')).toContainText('EXAMPLE.COM');
  await expect(page.locator('#enrichmentSaveDisclosure')).toContainText('enrichment_rdap');
  await expect(page.getByRole('button', { name: 'Save finding to active case' })).toBeEnabled();

  await page.waitForTimeout(650);
  await expect(page.locator('#enrichmentProvenance')).toContainText('example.com');
  await expect(page.locator('#enrichmentProvenance')).not.toContainText('old.example.com');

  await page.getByRole('button', { name: 'Save finding to active case' }).click();
  await expect(page.locator('#enrichmentStatus')).toContainText(/Saved enrichment_rdap observation/i);

  await page.getByRole('button', { name: 'Save finding to active case' }).click();
  await expect(page.locator('#enrichmentDuplicate')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Save finding to active case' })).toBeDisabled();

  const detailResponse = await request.get(`/api/cases/${record.id}`);
  expect(detailResponse.status()).toBe(200);
  const detail = await detailResponse.json();
  const observations = detail.observations.filter((item) => item.kind === 'enrichment_rdap');
  expect(observations).toHaveLength(1);
  expect(observations[0].value_text.toLowerCase()).toContain('example.com');
  expect(observations[0].confidence).toBe('unrated');
  expect(observations[0].note).toContain('IANA-bootstrapped RDAP service');
  expect(providerRequests).toBe(0);
});
