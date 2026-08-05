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

async function createEvidence(request) {
  const caseResponse = await request.post('/api/cases', {
    headers: writeHeaders,
    data: {
      case_type: 'evidence_review',
      title: `Evidence custody browser ${Date.now()}`,
      authorization_basis: 'Authorized evidence custody browser regression'
    }
  });
  expect(caseResponse.status()).toBe(201);
  const caseRecord = await caseResponse.json();

  const sourceResponse = await request.post(`/api/cases/${caseRecord.id}/sources`, {
    headers: writeHeaders,
    data: {
      label: 'Browser custody source',
      source_type: 'local_file',
      url: '',
      notes: 'Local browser regression source'
    }
  });
  expect(sourceResponse.status()).toBe(201);
  const source = await sourceResponse.json();

  const evidenceResponse = await request.post(`/api/cases/${caseRecord.id}/evidence`, {
    headers: writeHeaders,
    data: {
      source_id: source.id,
      filename: 'browser-evidence.txt',
      media_type: 'text/plain',
      size_bytes: 16,
      sha256: 'a'.repeat(64),
      storage_key: '',
      metadata_json: { bytes_uploaded: false, parser: 'browser-test' }
    }
  });
  expect(evidenceResponse.status()).toBe(201);
  return { caseRecord, evidence: await evidenceResponse.json() };
}

test('Evidence workspace records custody and exports a deterministic manifest', async ({ page, request }) => {
  const { caseRecord, evidence } = await createEvidence(request);
  await grantClientSession(page);
  await page.goto(`/cases?case=${encodeURIComponent(caseRecord.id)}`, { waitUntil: 'domcontentloaded' });

  await expect(page.locator('#backendBadge')).toHaveText(/Backend connected/i);
  await page.getByRole('button', { name: 'Evidence', exact: true }).click();
  await expect(page.locator('#evidenceCustodyWorkspace')).toBeVisible();
  await expect(page.locator('#custodyEvidence')).toHaveValue(evidence.id);
  await expect(page.locator('#custodyManifestHash')).toHaveText(/^[a-f0-9]{64}$/);
  await expect(page.locator('#custodyEventCount')).toHaveText('0');

  await page.locator('#custodyEventType').selectOption('verified');
  await page.locator('#custodyCustodian').fill('Primary evidence operator');
  await page.locator('#custodyLocation').fill('Controlled evidence volume');
  await page.locator('#custodyObservedHash').fill('A'.repeat(64));
  await page.locator('#custodyNote').fill('Hash checked before review');
  await page.locator('#custodyAddEvent').click();

  await expect(page.locator('#custodyEventCount')).toHaveText('1');
  await expect(page.locator('#custodyIntegrity')).toHaveText('Hash match');
  await expect(page.locator('#custodyLedger')).toContainText('Primary evidence operator');
  await expect(page.locator('#custodyLedger')).toContainText('Hash match');

  await page.locator('#custodyEventType').selectOption('transferred');
  await page.locator('#custodyCustodian').fill('Secondary review queue');
  await page.locator('#custodyObservedHash').fill('b'.repeat(64));
  await page.locator('#custodyNote').fill('Mismatch preserved for escalation');
  await page.locator('#custodyAddEvent').click();

  await expect(page.locator('#custodyEventCount')).toHaveText('2');
  await expect(page.locator('#custodyIntegrity')).toHaveText('Hash mismatch');
  await expect(page.locator('#custodyLedger')).toContainText('Mismatch preserved for escalation');

  const downloadPromise = page.waitForEvent('download');
  await page.locator('#custodyExport').click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe(`cmx-evidence-manifest-${evidence.id}.json`);
  const stream = await download.createReadStream();
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  const manifest = JSON.parse(Buffer.concat(chunks).toString('utf8'));
  expect(manifest.schema).toBe('cmx-evidence-manifest-v1');
  expect(manifest.evidence.id).toBe(evidence.id);
  expect(manifest.evidence.sha256).toBe('a'.repeat(64));
  expect(manifest.custody_events).toHaveLength(2);
  expect(manifest.custody_events.map((event) => event.integrity_state)).toEqual(['match', 'mismatch']);
  expect(manifest.manifest_sha256).toMatch(/^[a-f0-9]{64}$/);
});
