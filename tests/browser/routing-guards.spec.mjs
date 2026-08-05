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
      case_type: 'routing_guard',
      title,
      authorization_basis: 'Authorized routing preflight regression'
    }
  });
  expect(response.status()).toBe(201);
  return response.json();
}

test('failed duplicate preflight blocks the routing observation write', async ({ page, request }) => {
  const record = await createCase(request, `Routing preflight ${Date.now()}`);

  await page.route('**/api/routing/origin?*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        adapter: 'network_info',
        provider: 'RIPEstat Data API',
        source_url: 'https://stat.ripe.net/data/network-info/data.json?resource=8.8.8.8',
        collected_at: '2026-08-04T20:40:00+00:00',
        target: '8.8.8.8',
        cache_hit: false,
        requested_by: 'development:routing-guard@example.test',
        limitation: 'Routing observations do not establish ownership, control, attribution, compromise, or malicious activity.',
        result: {
          resource: '8.8.8.8',
          resource_type: 'ip',
          matched_prefix: '8.8.8.0/24',
          origin_asns: [15169],
          routed: true
        }
      })
    });
  });

  await grantClientSession(page);
  await page.goto(`/osint?case=${encodeURIComponent(record.id)}`, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#routingSection')).toBeVisible();
  await page.locator('#routingResource').fill('8.8.8.8');
  await page.locator('#routingSection').getByRole('button', { name: 'Find origin' }).click();
  await expect(page.locator('#routingResult')).toBeVisible();

  await page.route(`**/api/cases/${record.id}`, async (route) => {
    await route.fulfill({
      status: 503,
      contentType: 'application/json',
      body: JSON.stringify({ detail: 'Synthetic case-detail outage' })
    });
  });

  await page.locator('#routingSection').getByRole('button', { name: 'Save routing observation' }).click();
  await expect(page.locator('#routingStatus')).toContainText(/fresh duplicate review|case service returned HTTP 503/i);

  const detailResponse = await request.get(`/api/cases/${record.id}`);
  expect(detailResponse.status()).toBe(200);
  const detail = await detailResponse.json();
  expect(detail.observations.filter((item) => item.kind.startsWith('routing_'))).toHaveLength(0);
});
