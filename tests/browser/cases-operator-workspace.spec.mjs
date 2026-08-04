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

async function post(request, path, data) {
  const response = await request.post(path, { headers: writeHeaders, data });
  expect(response.status()).toBe(201);
  return response.json();
}

test('Cases operator workspace connects timeline, entities, relationships and audit', async ({ page, request }) => {
  const suffix = Date.now();
  const caseRecord = await post(request, '/api/cases', {
    case_type: 'osint',
    title: `Operator workspace ${suffix}`,
    authorization_basis: 'Authorized browser test for the case operator workspace',
    summary: 'Validate case views without changing the persistence contract.'
  });

  const domain = await post(request, `/api/cases/${caseRecord.id}/entities`, {
    entity_type: 'domain',
    normalized_value: `workspace-${suffix}.example`,
    display_value: `workspace-${suffix}.example`,
    confidence: 'high',
    attributes: { analyst_state: 'inferred' }
  });
  const email = await post(request, `/api/cases/${caseRecord.id}/entities`, {
    entity_type: 'email',
    normalized_value: `operator-${suffix}@example.test`,
    display_value: `operator-${suffix}@example.test`,
    confidence: 'limited',
    attributes: { analyst_state: 'unverified' }
  });
  const source = await post(request, `/api/cases/${caseRecord.id}/sources`, {
    label: 'Authorized test source',
    source_type: 'web',
    url: 'https://example.test/source',
    notes: 'Synthetic browser regression source'
  });
  await post(request, `/api/cases/${caseRecord.id}/observations`, {
    entity_id: domain.id,
    source_id: source.id,
    kind: 'dns_snapshot',
    value_text: domain.normalized_value,
    note: 'Synthetic timeline observation',
    confidence: 'high'
  });

  await grantClientSession(page);
  const response = await page.goto(`/cases?case=${encodeURIComponent(caseRecord.id)}`, { waitUntil: 'domcontentloaded' });
  expect(response?.ok()).toBeTruthy();
  await expect(page.locator('#backendBadge')).toHaveText(/Backend connected/i);
  await expect(page.locator('.cases-view-tabs')).toBeVisible();
  await expect(page.locator('[data-case-view]')).toHaveCount(8);

  await page.getByRole('button', { name: 'Timeline', exact: true }).click();
  await expect(page.locator('#operatorTimeline')).toContainText('dns_snapshot');
  await expect(page.locator('#operatorTimeline')).toContainText('Synthetic timeline observation');
  await expect(page.locator('#operatorTimeline')).toContainText(/entity\.created|source\.created|observation\.created/);

  await page.getByRole('button', { name: 'Entities', exact: true }).click();
  await page.locator('#operatorEntityType').selectOption('email');
  await expect(page.locator('#entityRecords')).toContainText(email.normalized_value);
  await expect(page.locator('#entityRecords')).not.toContainText(domain.normalized_value);
  await expect(page.locator('#entityRecords')).toContainText('unverified');

  await page.getByRole('button', { name: 'Relationships', exact: true }).click();
  await page.locator('#operatorRelationshipFrom').selectOption(domain.id);
  await page.locator('#operatorRelationshipTo').selectOption(email.id);
  await page.locator('#operatorRelationshipType').fill('contact_point');
  await page.locator('#operatorRelationshipConfidence').selectOption('medium');
  await page.locator('#operatorRelationshipNote').fill('Synthetic relationship regression');
  await page.locator('#operatorCreateRelationship').click();
  await expect(page.locator('#relationshipRecords')).toContainText('contact_point');
  await expect(page.locator('#relationshipRecords')).toContainText('Synthetic relationship regression');

  await page.getByRole('button', { name: 'Audit', exact: true }).click();
  await expect(page.locator('#operatorAuditRecords')).toContainText('relationship.created');
  await expect(page.locator('#countAudit')).not.toHaveText('0');
});
