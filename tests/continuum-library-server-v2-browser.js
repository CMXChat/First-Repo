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

  const contentId = '11111111-1111-4111-8111-111111111111';
  const draftId = '22222222-2222-4222-8222-222222222222';
  const versionIds = [
    '33333333-3333-4333-8333-333333333331',
    '33333333-3333-4333-8333-333333333332',
  ];
  const csrf = 'library-proof-csrf';
  const operatorKey = 'library-proof-key';

  let unlocked = false;
  let asset = null;
  let draft = null;
  let versions = [];
  let draftPutCount = 0;
  const mutations = [];

  function details() {
    if (!asset) return null;
    return {
      asset: { ...asset, current_version_id: versions.at(-1)?.id || null, updated_at: '2026-08-22T20:00:00Z' },
      draft: { ...draft },
      current_version: versions.at(-1) || null,
      versions: versions.map((item) => ({ ...item })),
      breadcrumbs: [],
      dependency_count: 0,
    };
  }

  function listing() {
    return {
      navigation: { current_folder_id: null, parent_folder_id: null, breadcrumbs: [] },
      items: asset ? [{
        item_type: 'content',
        stable_id: asset.id,
        display_name: asset.title,
        filename: asset.filename,
        kind: asset.kind,
        folder_id: null,
        lifecycle: 'active',
        updated_at: asset.updated_at,
        draft_revision: draft.revision,
        current_version_id: versions.at(-1)?.id || null,
        current_version_number: versions.at(-1)?.version_number || null,
        snippet: draft.source_text.slice(0, 80),
        used_by_count: 0,
      }] : [],
    };
  }

  await page.route('**/api/v1/**', async (route) => {
    const req = route.request();
    const url = new URL(req.url());
    const path = url.pathname;
    const method = req.method();
    const headers = req.headers();

    if (method === 'GET' && path.endsWith('/checkin/operator/session')) {
      if (!unlocked) return route.fulfill(json(401, { detail: 'operator session required' }));
      return route.fulfill(json(200, { authenticated: true, expires_at: '2026-08-22T23:00:00Z', csrf_token: csrf }));
    }

    if (method === 'POST' && path.endsWith('/checkin/operator/unlock')) {
      assert.equal(req.postDataJSON()?.operator_key, operatorKey, 'unlock must submit exact operator key');
      unlocked = true;
      return route.fulfill(json(200, { authenticated: true, expires_at: '2026-08-22T23:00:00Z', csrf_token: csrf }));
    }

    if (!unlocked) return route.fulfill(json(401, { detail: 'operator session required' }));

    if (method === 'GET' && path.endsWith('/checkin/operator/library')) {
      return route.fulfill(json(200, listing()));
    }

    if (method === 'POST' && path.endsWith('/checkin/operator/library/content')) {
      assert.equal(headers['x-csrf-token'], csrf, 'create content must include CSRF');
      const body = req.postDataJSON();
      assert.deepEqual(Object.keys(body).sort(), ['kind', 'source_text', 'title', 'visibility'].sort());
      assert.equal(body.visibility, 'library');
      asset = {
        id: contentId,
        kind: body.kind,
        title: body.title,
        filename: body.kind === 'markdown' ? 'durable-memory-proof.md' : null,
        visibility: body.visibility,
        lifecycle: 'active',
        folder_id: null,
        current_version_id: null,
        created_at: '2026-08-22T20:00:00Z',
        updated_at: '2026-08-22T20:00:00Z',
      };
      draft = {
        id: draftId,
        content_asset_id: contentId,
        revision: 1,
        source_text: body.source_text,
        created_at: '2026-08-22T20:00:00Z',
        updated_at: '2026-08-22T20:00:00Z',
      };
      mutations.push(['create', body]);
      return route.fulfill(json(200, details()));
    }

    if (method === 'GET' && path.endsWith(`/checkin/operator/library/content/${contentId}`)) {
      return route.fulfill(json(200, details()));
    }

    if (method === 'PUT' && path.endsWith(`/checkin/operator/library/content/${contentId}/draft`)) {
      assert.equal(headers['x-csrf-token'], csrf, 'draft update must include CSRF');
      draftPutCount += 1;
      const body = req.postDataJSON();
      mutations.push(['draft', { ...body }]);

      if (draftPutCount === 2) {
        draft = {
          ...draft,
          revision: 3,
          source_text: 'Concurrent server edit r3',
          updated_at: '2026-08-22T20:03:00Z',
        };
        return route.fulfill(json(409, { detail: 'Content draft revision conflict' }));
      }

      if (body.expected_revision !== draft.revision) {
        return route.fulfill(json(409, { detail: 'Content draft revision conflict' }));
      }
      draft = {
        ...draft,
        revision: draft.revision + 1,
        source_text: body.source_text,
        updated_at: '2026-08-22T20:02:00Z',
      };
      return route.fulfill(json(200, draft));
    }

    if (method === 'POST' && path.endsWith(`/checkin/operator/library/content/${contentId}/versions`)) {
      assert.equal(headers['x-csrf-token'], csrf, 'freeze version must include CSRF');
      const version = {
        id: versionIds[versions.length],
        content_asset_id: contentId,
        version_number: versions.length + 1,
        draft_revision: draft.revision,
        schema_version: 1,
        source_text: draft.source_text,
        checksum_sha256: String(versions.length + 1).repeat(64),
        created_by: 'operator',
        created_at: '2026-08-22T20:04:00Z',
      };
      versions.push(version);
      mutations.push(['version', { id: version.id, draft_revision: version.draft_revision, source_text: version.source_text }]);
      return route.fulfill(json(200, version));
    }

    if (method === 'DELETE' && path.endsWith('/checkin/operator/session')) {
      assert.equal(headers['x-csrf-token'], csrf, 'logout must include CSRF');
      unlocked = false;
      return route.fulfill(json(200, { message: 'session ended' }));
    }

    return route.fulfill(json(404, { detail: `unhandled ${method} ${path}` }));
  });

  await page.goto('http://127.0.0.1:8000/library/', { waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.querySelector('#libraryServerBadge')?.dataset.state === 'locked');
  assert.equal(await page.locator('#libraryUnlockForm').isVisible(), true, `unlock must be visible at ${width}`);

  await page.locator('#libraryOperatorKey').fill(operatorKey);
  await page.locator('#libraryUnlockSubmit').click();
  await page.waitForFunction(() => document.querySelector('#libraryServerBadge')?.dataset.state === 'connected');

  await page.locator('#libraryServerCreateTitle').fill('Durable Memory Proof');
  await page.locator('#libraryServerCreateSource').fill('Initial protected source r1');
  await page.locator('#libraryServerCreateSubmit').click();
  await page.waitForFunction(() => document.querySelector('#libraryServerSelectedTitle')?.textContent === 'Durable Memory Proof');
  assert.equal(await page.locator('#libraryServerEditor').inputValue(), 'Initial protected source r1');

  await page.locator('#libraryServerFreezeVersion').click();
  await page.waitForFunction(() => document.querySelector('#libraryImmutableProof')?.innerText.includes('Version 1 captured Draft r1'));
  assert.equal(versions[0].source_text, 'Initial protected source r1');

  await page.locator('#libraryServerEditor').fill('Owner edit r2 after frozen v1');
  await page.locator('#libraryServerSaveDraft').click();
  await page.waitForFunction(() => document.querySelector('#libraryServerEditorRevision')?.textContent.includes('r2'));
  await page.waitForFunction(() => document.querySelector('#libraryImmutableProof')?.innerText.includes('Draft r2 changed after Version 1 was frozen'));
  assert.equal(versions[0].source_text, 'Initial protected source r1', 'editing Draft must not rewrite Version 1');

  await page.locator('#libraryServerEditor').fill('My stale edit based on r2');
  await page.locator('#libraryServerSaveDraft').click();
  await page.waitForFunction(() => !document.querySelector('#libraryServerConflict')?.hidden);
  assert.equal(await page.locator('#libraryServerEditor').inputValue(), 'My stale edit based on r2', '409 must preserve unsaved editor text');
  assert.match(await page.locator('#libraryServerConflictCopy').innerText(), /based on Draft r2, while the server is now Draft r3/);
  assert.equal(draft.source_text, 'Concurrent server edit r3');

  await page.locator('#libraryServerReloadDraft').click();
  assert.equal(await page.locator('#libraryServerEditor').inputValue(), 'Concurrent server edit r3');
  assert.match(await page.locator('#libraryServerEditorRevision').innerText(), /r3/);

  await page.locator('#libraryServerEditor').fill('Owner reconciled edit r4');
  await page.locator('#libraryServerSaveDraft').click();
  await page.waitForFunction(() => document.querySelector('#libraryServerEditorRevision')?.textContent.includes('r4'));
  assert.equal(versions[0].source_text, 'Initial protected source r1', 'Version 1 must still be immutable after conflict recovery');

  await page.locator('#libraryServerFreezeVersion').click();
  await page.waitForFunction(() => document.querySelectorAll('.lib-server-version').length === 2);
  assert.equal(versions[1].draft_revision, 4);
  assert.equal(versions[1].source_text, 'Owner reconciled edit r4');
  assert.equal(versions[0].source_text, 'Initial protected source r1');

  const facts = await page.evaluate(() => ({
    overflow: Math.max(document.body.scrollWidth, document.documentElement.scrollWidth) > document.documentElement.clientWidth + 1,
    keyValue: document.querySelector('#libraryOperatorKey')?.value || '',
    localDump: JSON.stringify(Object.fromEntries(Object.entries(localStorage))),
    sessionDump: JSON.stringify(Object.fromEntries(Object.entries(sessionStorage))),
    badge: document.querySelector('#libraryServerBadge')?.dataset.state,
  }));
  console.log(width, height, facts, mutations.map(([kind]) => kind));
  assert.equal(facts.overflow, false, `Library protected lane must not create horizontal overflow at ${width}`);
  assert.equal(facts.keyValue, '', 'operator key field must be cleared');
  assert.equal(facts.badge, 'connected');
  for (const protectedValue of [operatorKey, csrf, contentId, 'Initial protected source r1', 'Owner reconciled edit r4', 'Concurrent server edit r3']) {
    assert.equal(facts.localDump.includes(protectedValue), false, `protected value leaked to localStorage: ${protectedValue}`);
    assert.equal(facts.sessionDump.includes(protectedValue), false, `protected value leaked to sessionStorage: ${protectedValue}`);
  }

  assert.deepEqual(mutations.map(([kind]) => kind), ['create', 'version', 'draft', 'draft', 'draft', 'version']);
  await browser.close();
}

(async () => {
  await inspect(1280, 900);
  await inspect(390, 844);
  console.log('Continuum protected Library browser proof passed on desktop and mobile.');
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
