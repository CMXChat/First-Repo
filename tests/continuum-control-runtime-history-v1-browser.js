'use strict';

const { chromium } = require('playwright-core');
const assert = require('node:assert/strict');

const executablePath = process.env.BROWSER;
if (!executablePath) throw new Error('BROWSER is required');

function json(status, body) {
  return { status, contentType: 'application/json', body: JSON.stringify(body) };
}

async function inspect(width, height) {
  const browser = await chromium.launch({ executablePath, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const page = await browser.newPage({ viewport: { width, height } });

  const csrf = 'control-runtime-csrf';
  const operatorKey = 'control-runtime-key';
  const automationId = '11111111-1111-4111-8111-111111111111';
  const automationVersionId = '22222222-2222-4222-8222-222222222222';
  const runId = '33333333-3333-4333-8333-333333333333';
  const personId = '44444444-4444-4444-8444-444444444444';
  const contactId = '55555555-5555-4555-8555-555555555555';
  const connectionId = '66666666-6666-4666-8666-666666666666';
  const senderId = '77777777-7777-4777-8777-777777777777';
  const contentId = '88888888-8888-4888-8888-888888888888';
  const contentVersionId = '99999999-9999-4999-8999-999999999999';
  const checksum = 'a'.repeat(64);
  let unlocked = false;
  const requests = [];

  await page.route('**/api/v1/**', async (route) => {
    const req = route.request();
    const url = new URL(req.url());
    const path = url.pathname;
    const method = req.method();
    requests.push([method, path]);

    if (method === 'GET' && path.endsWith('/checkin/operator/session')) {
      if (!unlocked) return route.fulfill(json(401, { detail: 'operator session required' }));
      return route.fulfill(json(200, { authenticated: true, expires_at: '2026-08-22T23:00:00Z', csrf_token: csrf }));
    }
    if (method === 'POST' && path.endsWith('/checkin/operator/unlock')) {
      assert.equal(req.postDataJSON()?.operator_key, operatorKey);
      unlocked = true;
      return route.fulfill(json(200, { authenticated: true, expires_at: '2026-08-22T23:00:00Z', csrf_token: csrf }));
    }
    if (!unlocked) return route.fulfill(json(401, { detail: 'operator session required' }));

    if (method === 'GET' && path.endsWith('/checkin/operator/automations')) {
      return route.fulfill(json(200, [{ id: automationId, name: 'Safe Email proof', lifecycle: 'active' }]));
    }
    if (method === 'GET' && path.endsWith(`/checkin/operator/automations/${automationId}/runs`)) {
      return route.fulfill(json(200, [{
        id: runId,
        automation_id: automationId,
        automation_version_id: automationVersionId,
        status: 'succeeded',
        trigger_type: 'manual_owner',
        requested_by: 'operator',
        request_idempotency_key: 'proof-run',
        execution_snapshot: {},
        result_summary: 'Safe simulated Email accepted.',
        failure_class: null,
        failure_message: null,
        created_at: '2026-08-22T20:00:00Z',
        started_at: '2026-08-22T20:00:01Z',
        completed_at: '2026-08-22T20:00:02Z',
      }]));
    }
    if (method === 'GET' && path.endsWith(`/checkin/operator/automations/${automationId}/runs/${runId}/receipt`)) {
      return route.fulfill(json(200, {
        run_id: runId,
        automation_id: automationId,
        automation_version_id: automationVersionId,
        initiation_type: 'manual_owner',
        requested_by: 'operator',
        authority_mode: 'manual_owner',
        authority_grant_id: null,
        authority_grant_version_id: null,
        checkin_incident_id: null,
        trigger_occurrence_id: null,
        provider_mode: 'fake',
        run_status: 'succeeded',
        action_status: 'succeeded',
        cancelled: false,
        ambiguity_requires_reconciliation: false,
        reconciliation_status: null,
        frozen_email: {
          person_id: personId,
          person_display_name: 'Adam Example',
          contact_method_id: contactId,
          recipient_address: 'adam@example.test',
          connection_id: connectionId,
          connection_display_name: 'Safe Email connection',
          sender_identity_id: senderId,
          sender_address: 'team@cmxchat.com',
          sender_display_name: 'Continuum Team',
          content_asset_id: contentId,
          content_version_id: contentVersionId,
          content_checksum_sha256: checksum,
          content_subject: 'Hello from the durable world',
        },
        provider_operation: null,
        attempts: [{
          id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
          attempt_number: 1,
          worker_id: 'proof-worker',
          started_at: '2026-08-22T20:00:01Z',
          finished_at: '2026-08-22T20:00:02Z',
          outcome: 'succeeded',
          retryable: false,
          failure_class: null,
          failure_message: null,
          provider_delivery_id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
          provider_operation_id: null,
        }],
        events: [{
          id: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
          event_type: 'run_succeeded',
          summary: 'Safe simulated delivery completed through canonical Runtime.',
          payload: {},
          created_at: '2026-08-22T20:00:02Z',
        }],
        created_at: '2026-08-22T20:00:00Z',
        started_at: '2026-08-22T20:00:01Z',
        completed_at: '2026-08-22T20:00:02Z',
      }));
    }
    return route.fulfill(json(404, { detail: `unhandled ${method} ${path}` }));
  });

  await page.goto('http://127.0.0.1:8000/control/', { waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.querySelector('#controlRuntimeBadge')?.dataset.state === 'locked');
  assert.equal(await page.locator('#controlRuntimeUnlock').isVisible(), false, 'history surface is hidden while Now tab is active');

  await page.locator('[data-cc-tab="history"]').click();
  assert.equal(await page.locator('#controlRuntimeUnlock').isVisible(), true, `unlock must appear in History at ${width}`);
  await page.locator('#controlRuntimeKey').fill(operatorKey);
  await page.locator('#controlRuntimeUnlockSubmit').click();
  await page.waitForFunction(() => document.querySelector('#controlRuntimeBadge')?.dataset.state === 'connected');
  await page.waitForFunction(() => document.querySelectorAll('.cc-runtime-run').length === 1);

  await page.locator('.cc-runtime-run').click();
  await page.waitForFunction((id) => document.querySelector('#controlRuntimeReceipt')?.innerText.includes(id), contentVersionId);

  const receiptText = await page.locator('#controlRuntimeReceipt').innerText();
  for (const expected of [runId, automationVersionId, personId, contactId, connectionId, senderId, contentId, contentVersionId, checksum, 'Adam Example', 'team@cmxchat.com', 'run_succeeded', 'Safe simulated delivery completed through canonical Runtime.']) {
    assert.ok(receiptText.includes(expected), `receipt must render ${expected}`);
  }
  assert.match(receiptText, /manual_owner/);
  assert.match(receiptText, /fake/);
  assert.match(receiptText, /succeeded/);

  const facts = await page.evaluate(() => ({
    overflow: Math.max(document.body.scrollWidth, document.documentElement.scrollWidth) > document.documentElement.clientWidth + 1,
    keyValue: document.querySelector('#controlRuntimeKey')?.value || '',
    localDump: JSON.stringify(Object.fromEntries(Object.entries(localStorage))),
    sessionDump: JSON.stringify(Object.fromEntries(Object.entries(sessionStorage))),
    directoryHref: document.querySelector('#controlRuntimeReceipt a[href^="/directory/"]')?.getAttribute('href') || '',
    libraryHref: document.querySelector('#controlRuntimeReceipt a[href^="/library/"]')?.getAttribute('href') || '',
  }));

  assert.equal(facts.overflow, false, `Control Runtime history must not cause horizontal overflow at ${width}`);
  assert.equal(facts.keyValue, '', 'operator key must be cleared immediately');
  assert.ok(facts.directoryHref.includes(personId), 'Directory reference should carry the exact Person ID');
  assert.ok(facts.libraryHref.includes(contentId), 'Library reference should carry the exact ContentAsset ID');
  for (const protectedValue of [operatorKey, csrf, personId, contentVersionId, 'adam@example.test']) {
    assert.equal(facts.localDump.includes(protectedValue), false, `protected value leaked to localStorage: ${protectedValue}`);
    assert.equal(facts.sessionDump.includes(protectedValue), false, `protected value leaked to sessionStorage: ${protectedValue}`);
  }

  const consequential = requests.filter(([method, path]) =>
    method !== 'GET' && !path.endsWith('/checkin/operator/unlock') && !path.endsWith('/checkin/operator/session'));
  assert.deepEqual(consequential, [], 'Control Runtime projection must perform no consequential Runtime mutation');

  await browser.close();
}

(async () => {
  await inspect(1280, 900);
  await inspect(390, 844);
  console.log('Continuum Control protected Runtime history browser proof passed on desktop and mobile.');
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
