import { expect, test } from '@playwright/test';

const baseUrl = process.env.CMX_BROWSER_BASE_URL;
if (!baseUrl) throw new Error('CMX_BROWSER_BASE_URL is required.');
const origin = new URL(baseUrl).origin;

const jsonWriteHeaders = {
  Origin: origin,
  'Sec-Fetch-Site': 'same-origin',
  'Content-Type': 'application/json'
};
const deleteHeaders = {
  Origin: origin,
  'Sec-Fetch-Site': 'same-origin'
};

async function grantClientSession(page) {
  await page.addInitScript(() => {
    sessionStorage.setItem('cmx_session_v4', JSON.stringify({ username: 'admin', at: Date.now() }));
  });
}

async function createCase(request, title, retentionUntil = null) {
  const response = await request.post('/api/cases', {
    headers: jsonWriteHeaders,
    data: {
      case_type: 'staging_lifecycle',
      title,
      authorization_basis: 'Authorized staging lifecycle regression test',
      retention_until: retentionUntil
    }
  });
  expect(response.status()).toBe(201);
  return response.json();
}

async function softDelete(request, caseId) {
  const response = await request.delete(`/api/cases/${caseId}`, { headers: deleteHeaders });
  expect(response.status()).toBe(204);
}

async function purge(request, caseId, reason) {
  const response = await request.post(`/api/cases/${caseId}/purge`, {
    headers: jsonWriteHeaders,
    data: { confirmation: caseId, reason }
  });
  expect(response.status()).toBe(204);
}

test.beforeEach(async ({ page }) => {
  await grantClientSession(page);
});

test('protected lifecycle page shows retention and redacted audit data', async ({ page, request }) => {
  const title = `Staging retention ${Date.now()}`;
  const record = await createCase(request, title, new Date(Date.now() - 86_400_000).toISOString());

  try {
    const response = await page.goto('/cases/lifecycle', { waitUntil: 'domcontentloaded' });
    expect(response?.ok()).toBeTruthy();
    await expect(page.locator('#lifecycleStatus')).toHaveText(/Backend connected/i);
    await expect(page.getByText(title, { exact: true })).toBeVisible();

    await page.locator('#auditCase').selectOption(record.id);
    await page.locator('#loadAudit').click();
    await expect(page.locator('#auditList')).toContainText('case.created');
    await expect(page.locator('#auditList')).not.toContainText(title);
  } finally {
    await softDelete(request, record.id);
    await purge(request, record.id, 'Clean up staging retention regression record');
  }
});

test('protected lifecycle page restores and then cleans up a soft-deleted case', async ({ page, request }) => {
  const title = `Staging restore ${Date.now()}`;
  const record = await createCase(request, title);
  await softDelete(request, record.id);

  let restored = false;
  try {
    await page.goto('/cases/lifecycle', { waitUntil: 'domcontentloaded' });
    const card = page.locator('.life-item').filter({ hasText: title });
    await card.getByRole('button', { name: 'Restore' }).click();
    await page.locator('#lifecycleConfirmation').fill(record.id);
    await page.locator('#lifecycleReason').fill('Restore staging lifecycle regression record');
    await page.locator('#confirmLifecycleAction').click();
    await expect(page.getByText(title, { exact: true })).toHaveCount(0);
    restored = true;
  } finally {
    if (restored) await softDelete(request, record.id);
    await purge(request, record.id, 'Clean up restored staging lifecycle record');
  }
});

test('protected lifecycle page permanently purges after typed confirmation', async ({ page, request }) => {
  const title = `Staging purge ${Date.now()}`;
  const record = await createCase(request, title);
  await softDelete(request, record.id);

  await page.goto('/cases/lifecycle', { waitUntil: 'domcontentloaded' });
  const card = page.locator('.life-item').filter({ hasText: title });
  await card.getByRole('button', { name: 'Permanently purge' }).click();
  await page.locator('#lifecycleConfirmation').fill(record.id);
  await page.locator('#lifecycleReason').fill('Purge disposable staging lifecycle record');
  page.once('dialog', (dialog) => dialog.accept());
  await page.locator('#confirmLifecycleAction').click();

  await expect(page.getByText(title, { exact: true })).toHaveCount(0);
  const missing = await request.get(`/api/cases/${record.id}`);
  expect(missing.status()).toBe(404);
});
