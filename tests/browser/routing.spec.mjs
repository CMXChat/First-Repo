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

async function createCase(request, title) {
  const response = await request.post('/api/cases', {
    headers: writeHeaders,
    data: {
      case_type: 'routing',
      title,
      authorization_basis: 'Authorized routing browser regression'
    }
  });
  expect(response.status()).toBe(201);
  return response.json();
}

test('routing lookup cancels stale work and saves one provenance-bound observation', async ({ page, request }) => {
  const record = await createCase(request, `Routing active case ${Date.now()}`);
  let providerRequests = 0;

  await page.route('**/api/routing/origin?*', async (route) => {
    const resource = new URL(route.request().url()).searchParams.get('resource') || '';
    if (resource === '1.1.1.1') await new Promise((resolve) => setTimeout(resolve, 500));
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        adapter: 'network_info',
        provider: 'RIPEstat Data API',
        source_url: `https://stat.ripe.net/data/network-info/data.json?resource=${resource}`,
        collected_at: '2026-08-04T20:30:00+00:00',
        target: resource,
        cache_hit: false,
        requested_by: 'development:routing-browser@example.test',
        limitation: 'Routing observations do not establish ownership, control, attribution, compromise, or malicious activity.',
        result: {
          resource,
          resource_type: 'ip',
          matched_prefix: resource === '8.8.8.8' ? '8.8.8.0/24' : '1.1.1.0/24',
          origin_asns: resource === '8.8.8.8' ? [15169] : [13335],
          routed: true
        }
      })
    });
  });

  await page.route('https://stat.ripe.net/**', async (route) => {
    providerRequests += 1;
    await route.abort();
  });

  await grantClientSession(page);
  await page.goto(`/osint?case=${encodeURIComponent(record.id)}`, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#routingSection')).toBeVisible();
  await expect(page.locator('.cmx-case-context-select')).toHaveValue(record.id);

  const routingSection = page.locator('#routingSection');
  const cancel = routingSection.getByRole('button', { name: 'Cancel', exact: true });
  await page.locator('#routingResource').fill('1.1.1.1');
  await routingSection.getByRole('button', { name: 'Find origin' }).click();
  await expect(cancel).toBeEnabled();
  await cancel.click();

  await page.locator('#routingResource').fill('8.8.8.8');
  await routingSection.getByRole('button', { name: 'Find origin' }).click();
  await expect(page.locator('#routingResult')).toBeVisible();
  await expect(page.locator('#routingSummary')).toContainText('8.8.8.0/24');
  await expect(page.locator('#routingSummary')).toContainText('AS15169');
  await expect(page.locator('#routingProvenance')).toContainText('RIPEstat Data API');
  await expect(page.locator('#routingProvenance')).toContainText('8.8.8.8');
  await expect(page.locator('#routingSuggestion')).toContainText('No relationship has been created');

  await page.waitForTimeout(650);
  await expect(page.locator('#routingSummary')).not.toContainText('1.1.1.0/24');

  await routingSection.getByRole('button', { name: 'Save routing observation' }).click();
  await expect(page.locator('#routingStatus')).toContainText(/Saved routing_network_info observation/i);
  await expect(page.locator('#routingDuplicate')).toBeVisible();
  await expect(routingSection.getByRole('button', { name: 'Save routing observation' })).toBeDisabled();

  const detailResponse = await request.get(`/api/cases/${record.id}`);
  expect(detailResponse.status()).toBe(200);
  const detail = await detailResponse.json();
  const observations = detail.observations.filter((item) => item.kind === 'routing_network_info');
  expect(observations).toHaveLength(1);
  expect(observations[0].confidence).toBe('unrated');
  expect(observations[0].value_text).toContain('8.8.8.0/24');
  expect(observations[0].note).toContain('RIPEstat Data API');
  expect(observations[0].note).toContain('malicious activity');
  expect(providerRequests).toBe(0);
});

test('invalid RPKI remains a routing state and is not labeled malicious', async ({ page, request }) => {
  const record = await createCase(request, `RPKI active case ${Date.now()}`);
  let providerRequests = 0;

  await page.route('**/api/routing/rpki?*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        adapter: 'rpki_validation',
        provider: 'RIPEstat Data API',
        source_url: 'https://stat.ripe.net/data/rpki-validation/data.json?resource=15169&prefix=8.8.8.0%2F24',
        collected_at: '2026-08-04T20:31:00+00:00',
        target: '8.8.8.0/24 AS15169',
        cache_hit: false,
        requested_by: 'development:routing-browser@example.test',
        limitation: 'Routing observations do not establish ownership, control, attribution, compromise, or malicious activity.',
        result: {
          prefix: '8.8.8.0/24',
          asn: '15169',
          state: 'invalid',
          provider_status: 'invalid_asn',
          description: 'A covering ROA authorizes a different ASN.'
        }
      })
    });
  });
  await page.route('https://stat.ripe.net/**', async (route) => {
    providerRequests += 1;
    await route.abort();
  });

  await grantClientSession(page);
  await page.goto(`/osint?case=${encodeURIComponent(record.id)}`, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#routingSection')).toBeVisible();
  await page.locator('#routingResource').fill('8.8.8.0/24');
  await page.locator('#routingAsn').fill('AS15169');
  await page.locator('#routingSection').getByRole('button', { name: 'Validate RPKI' }).click();

  await expect(page.locator('#routingSummary')).toContainText('RPKI invalid');
  await expect(page.locator('#routingSummary')).not.toContainText(/malicious|compromised|attack/i);
  await expect(page.locator('#routingRecords')).toContainText('Invalid Asn');
  await expect(page.locator('#routingStatus')).toContainText(/completed/i);
  expect(providerRequests).toBe(0);
});
