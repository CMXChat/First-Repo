'use strict';

const { chromium } = require('playwright-core');
const assert = require('node:assert/strict');

const executablePath = process.env.BROWSER;
if (!executablePath) throw new Error('BROWSER is required');

const reply = (body, status = 200) => ({ status, contentType: 'application/json', body: JSON.stringify(body) });

(async () => {
  const browser = await chromium.launch({ executablePath, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const seen = [];
  let processed = false;
  let writes = 0;

  await page.route('**/api/v1/**', async (route) => {
    const req = route.request();
    const path = new URL(req.url()).pathname;
    const method = req.method();
    const body = req.postDataJSON?.() || null;
    seen.push(`${method} ${path}`);

    if (method !== 'GET') {
      writes += 1;
      assert.equal(req.headers()['x-csrf-token'], 'email-csrf', `missing CSRF on ${method} ${path}`);
      assert.equal(JSON.stringify(body || {}).includes('real_smtp'), false, `real SMTP appeared in ${method} ${path}`);
    }

    if (method === 'GET' && path.endsWith('/checkin/operator/session')) return route.fulfill(reply({ authenticated: true, expires_at: '2026-08-22T23:30:00Z', csrf_token: 'email-csrf' }));
    if (method === 'GET' && path.endsWith('/checkin/operator/directory/people')) return route.fulfill(reply([{ id: 'person-email-1', display_name: 'Email Test Person', lifecycle: 'active' }]));
    if (method === 'GET' && path.endsWith('/directory/people/person-email-1/contact-methods')) return route.fulfill(reply([{ id: 'contact-email-1', person_id: 'person-email-1', channel: 'email', address: 'cmxchat@gmail.com', normalized_address: 'cmxchat@gmail.com', lifecycle: 'active' }]));
    if (method === 'GET' && path.endsWith('/checkin/operator/connections')) return route.fulfill(reply([{ id: 'connection-email-1', display_name: 'CMX Email', lifecycle: 'active' }]));
    if (method === 'GET' && path.endsWith('/connections/connection-email-1/sender-identities')) return route.fulfill(reply([{ id: 'sender-email-1', connection_id: 'connection-email-1', display_name: 'CMX Team', address: 'team@cmxchat.com', normalized_address: 'team@cmxchat.com', lifecycle: 'active' }]));
    if (method === 'GET' && path.endsWith('/connections/connection-email-1/readiness')) return route.fulfill(reply({ connection_id: 'connection-email-1', fake_provider_available: true, real_smtp_available: false, issue_codes: [], sender_identities: [{ sender_identity_id: 'sender-email-1', compatible_with_connection: true, compatible_with_real_smtp: false, issue_codes: [] }] }));

    if (method === 'POST' && path.endsWith('/library/content')) {
      assert.equal(body.kind, 'text');
      assert.equal(body.visibility, 'action_scoped');
      assert.equal(body.title, 'Continuum Email proof');
      return route.fulfill(reply({ asset: { id: 'content-email-1', title: body.title }, draft: { revision: 1 } }));
    }
    if (method === 'PUT' && path.endsWith('/library/content/content-email-1/draft')) {
      assert.equal(body.expected_revision, 1);
      assert.equal(body.source_text, 'Hello from the canonical Email workflow.');
      return route.fulfill(reply({ revision: 2, source_text: body.source_text }));
    }
    if (method === 'POST' && path.endsWith('/library/content/content-email-1/versions')) return route.fulfill(reply({ id: 'content-version-email-1', content_asset_id: 'content-email-1', version_number: 1, draft_revision: 2, checksum_sha256: 'checksum-email-1' }));

    if (method === 'POST' && path.endsWith('/automations')) return route.fulfill(reply({ automation: { id: 'automation-email-1', name: body.name }, draft: { revision: 1 } }));
    if (method === 'PUT' && path.endsWith('/automations/automation-email-1/draft')) {
      const action = body.definition?.actions?.[0];
      assert.equal(body.expected_revision, 1);
      assert.equal(action?.type, 'email');
      assert.equal(action?.connection_id, 'connection-email-1');
      assert.equal(action?.sender_identity_id, 'sender-email-1');
      assert.equal(action?.recipient_person_id, 'person-email-1');
      assert.equal(action?.recipient_contact_method_id, 'contact-email-1');
      assert.equal(action?.content_asset_id, 'content-email-1');
      return route.fulfill(reply({ revision: 2, definition: body.definition }));
    }
    if (method === 'GET' && path.endsWith('/automations/automation-email-1/preflight')) return route.fulfill(reply({ ready: true, issues: [] }));
    if (method === 'POST' && path.endsWith('/automations/automation-email-1/review')) return route.fulfill(reply({ ok: true }));
    if (method === 'POST' && path.endsWith('/automations/automation-email-1/publish')) return route.fulfill(reply({ id: 'automation-version-email-1', automation_id: 'automation-email-1', version_number: 1 }));

    if (method === 'POST' && path.endsWith('/automations/automation-email-1/runs')) {
      assert.equal(body.provider_mode, 'fake');
      assert.equal(body.fake_behavior, 'accepted');
      assert.ok(body.request_idempotency_key, 'Run must carry an idempotency key');
      return route.fulfill(reply({ id: 'run-email-1', status: 'pending' }));
    }
    if (method === 'POST' && path.endsWith('/automations/automation-email-1/runs/run-email-1/process')) {
      assert.equal(body.worker_id, 'email-v3-browser-proof');
      processed = true;
      return route.fulfill(reply({ id: 'run-email-1', status: 'succeeded', attempt_count: 1 }));
    }
    if (method === 'GET' && path.endsWith('/automations/automation-email-1/runs/run-email-1/receipt')) {
      return route.fulfill(reply({
        run_id: 'run-email-1',
        run_status: processed ? 'succeeded' : 'pending',
        automation_id: 'automation-email-1',
        automation_version_id: 'automation-version-email-1',
        authority_mode: 'manual_owner',
        provider_mode: 'fake',
        frozen_email_inputs: {
          person_id: 'person-email-1',
          person_display_name: 'Email Test Person',
          contact_method_id: 'contact-email-1',
          recipient_address: 'cmxchat@gmail.com',
          connection_id: 'connection-email-1',
          connection_display_name: 'CMX Email',
          sender_identity_id: 'sender-email-1',
          sender_display_name: 'CMX Team',
          sender_address: 'team@cmxchat.com',
          content_asset_id: 'content-email-1',
          content_version_id: 'content-version-email-1',
          content_checksum_sha256: 'checksum-email-1',
          content_subject: 'Continuum Email proof',
        },
        attempts: processed ? [{ attempt_number: 1, outcome: 'succeeded' }] : [],
        events: [{ event_type: processed ? 'run_succeeded' : 'run_requested', summary: processed ? 'Safe simulated delivery completed.' : 'Run requested.' }],
      }));
    }
    if (method === 'GET' && path.endsWith('/automations/automation-email-1/runs/run-email-1')) return route.fulfill(reply({ id: 'run-email-1', status: processed ? 'succeeded' : 'pending', attempt_count: processed ? 1 : 0 }));

    return route.fulfill(reply({ detail: `unhandled ${method} ${path}` }, 500));
  });

  await page.goto('http://127.0.0.1:8000/email/', { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    const gated = document.querySelector('[data-cmx-gated-content]');
    if (gated) gated.hidden = false;
    document.body.classList.remove('cmx-black-prompt-locked');
    document.querySelectorAll('[data-cmx-gate-overlay],#cmx-black-prompt-gate').forEach((node) => node.remove());
  });

  await page.waitForFunction(() => document.querySelector('#backendBadge')?.dataset.state === 'connected');
  await page.locator('#personSelect').selectOption('person-email-1');
  await page.waitForFunction(() => document.querySelector('#contactSelect option[value="contact-email-1"]'));
  await page.locator('#contactSelect').selectOption('contact-email-1');
  await page.locator('#connectionSelect').selectOption('connection-email-1');
  await page.waitForFunction(() => document.querySelector('#senderSelect option[value="sender-email-1"]'));
  await page.locator('#senderSelect').selectOption('sender-email-1');

  await page.locator('#subjectInput').fill('Continuum Email proof');
  await page.locator('#richBodyInput').fill('Hello from the canonical Email workflow.');
  await page.waitForFunction(() => document.querySelector('#bodyInput')?.value === 'Hello from the canonical Email workflow.');

  await page.locator('#freezeContent').click();
  await page.waitForFunction(() => document.querySelector('#contentState')?.textContent?.includes('ContentVersion content-version-email-1'));
  await page.waitForFunction(() => document.querySelector('#prepareAutomation')?.disabled === false);
  await page.locator('#prepareAutomation').click();
  await page.waitForFunction(() => document.querySelector('#automationState')?.textContent?.includes('Preflight ready'));
  await page.locator('#publishAutomation').click();
  await page.waitForFunction(() => document.querySelector('#automationState')?.textContent?.includes('AutomationVersion automation-version-email-1'));
  await page.locator('#requestRun').click();
  await page.waitForFunction(() => document.querySelector('#runState')?.textContent?.includes('run-email-1'));
  await page.locator('#processRun').click();
  await page.waitForFunction(() => document.querySelector('#runState')?.textContent?.includes('succeeded'));
  await page.waitForFunction(() => document.querySelector('#receiptView')?.innerText?.includes('team@cmxchat.com'));
  await page.waitForFunction(() => document.documentElement.dataset.continuumReceiptControlLink === 'ready');

  const facts = await page.evaluate(() => ({
    receipt: document.querySelector('#receiptView')?.innerText || '',
    controlHref: document.querySelector('[data-runtime-control-link] a')?.getAttribute('href') || '',
    overflow: Math.max(document.body.scrollWidth, document.documentElement.scrollWidth) > document.documentElement.clientWidth + 1,
    local: JSON.stringify(Object.fromEntries(Object.entries(localStorage))),
    session: JSON.stringify(Object.fromEntries(Object.entries(sessionStorage))),
  }));

  assert.match(facts.receipt, /Email Test Person/);
  assert.match(facts.receipt, /team@cmxchat\.com/);
  assert.match(facts.receipt, /content-version-email-1/);
  assert.equal(facts.controlHref, '/control/?automation_id=automation-email-1&run_id=run-email-1');
  assert.equal(facts.overflow, false);
  assert.equal(writes, 9, `expected 9 protected workflow mutations, saw ${writes}: ${seen.join(' | ')}`);
  for (const protectedValue of ['email-csrf', 'person-email-1', 'contact-email-1', 'content-email-1', 'run-email-1', 'cmxchat@gmail.com']) {
    assert.equal(facts.local.includes(protectedValue) || facts.session.includes(protectedValue), false, `protected value leaked to browser storage: ${protectedValue}`);
  }

  await browser.close();
  console.log('Continuum Email v3 complete safe-simulation workflow + receipt navigation: PASS');
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
