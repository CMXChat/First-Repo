import { expect, test } from '@playwright/test';

const writeHeaders = {
  Origin: 'http://127.0.0.1:8000',
  'Sec-Fetch-Site': 'same-origin',
  'Content-Type': 'application/json'
};

async function createCase(request, title, retentionUntil = null) {
  const response = await request.post('/api/cases', {
    headers: writeHeaders,
    data: {
      case_type: 'browser_lifecycle',
      title,
      authorization_basis: 'Authorized browser lifecycle regression test',
      retention_until: retentionUntil
    }
  });
  expect(response.status()).toBe(201);
  return response.json();
}

async function softDelete(request, caseId) {
  const response = await request.delete(`/api/cases/${caseId}`, {
    headers: {
      Origin: 'http://127.0.0.1:8000',
      'Sec-Fetch-Site': 'same-origin'
    }
  });
  expect(response.status()).toBe(204);
}

test('lifecycle page shows retention due and operational audit', async ({ page, request }) => {
  const title = `Retention browser test ${Date.now()}`;
  const record = await createCase(request, title, new Date(Date.now() - 86_400_000).toISOString());

  const response = await page.goto('/cases/lifecycle', { waitUntil: 'domcontentloaded' });
  expect(response?.ok()).toBeTruthy();
  await expect(page.locator('#lifecycleStatus')).toHaveText(/Backend connected/i);
  await expect(page.getByText(title, { exact: true })).toBeVisible();

  await page.locator('#auditCase').selectOption(record.id);
  await page.locator('#loadAudit').click();
  await expect(page.locator('#auditList')).toContainText('case.created');
  await expect(page.locator('#auditList')).not.toContainText(title);

  await softDelete(request, record.id);
  await page.locator('#refreshLifecycle').click();
});

test('lifecycle page restores a soft-deleted case', async ({ page, request }) => {
  const title = `Restore browser test ${Date.now()}`;
  const record = await createCase(request, title);
  await softDelete(request, record.id);

  await page.goto('/cases/lifecycle', { waitUntil: 'domcontentloaded' });
  await expect(page.getByText(title, { exact: true })).toBeVisible();
  const card = page.locator('.life-item').filter({ hasText: title });
  await card.getByRole('button', { name: 'Restore' }).click();
  await page.locator('#lifecycleConfirmation').fill(record.id);
  await page.locator('#lifecycleReason').fill('Restore browser lifecycle test');
  await page.locator('#confirmLifecycleAction').click();

  await expect(page.getByText(title, { exact: true })).toHaveCount(0);
  await expect(page.locator('#deletedCount')).toHaveText('0');
});

test('lifecycle page permanently purges only after typed confirmation', async ({ page, request }) => {
  const title = `Purge browser test ${Date.now()}`;
  const record = await createCase(request, title);
  await softDelete(request, record.id);

  await page.goto('/cases/lifecycle', { waitUntil: 'domcontentloaded' });
  const card = page.locator('.life-item').filter({ hasText: title });
  await card.getByRole('button', { name: 'Permanently purge' }).click();
  await page.locator('#lifecycleConfirmation').fill(record.id);
  await page.locator('#lifecycleReason').fill('Purge disposable browser lifecycle test');
  page.once('dialog', (dialog) => dialog.accept());
  await page.locator('#confirmLifecycleAction').click();

  await expect(page.getByText(title, { exact: true })).toHaveCount(0);
  const missing = await request.get(`/api/cases/${record.id}`);
  expect(missing.status()).toBe(404);
});
