'use strict';

const { chromium } = require('playwright-core');
const assert = require('node:assert/strict');

const executablePath = process.env.BROWSER;
if (!executablePath) throw new Error('BROWSER is required');

function reply(status, body) {
  return { status, contentType: 'application/json', body: JSON.stringify(body) };
}

async function proveDirectory(browser) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const wanted = '22222222-2222-4222-8222-222222222222';
  const first = '11111111-1111-4111-8111-111111111111';
  const requests = [];

  await page.route('**/api/v1/**', async (route) => {
    const req = route.request();
    const path = new URL(req.url()).pathname;
    requests.push([req.method(), path]);
    if (req.method() === 'GET' && path.endsWith('/checkin/operator/session')) {
      return route.fulfill(reply(200, { authenticated: true, expires_at: '2026-08-22T23:00:00Z', csrf_token: 'exact-ref-csrf' }));
    }
    if (req.method() === 'GET' && path.endsWith('/checkin/operator/directory/people')) {
      return route.fulfill(reply(200, [
        { id: first, display_name: 'First Person', lifecycle: 'active', created_at: '2026-08-22T20:00:00Z', updated_at: '2026-08-22T20:00:00Z' },
        { id: wanted, display_name: 'Exact Person', lifecycle: 'active', created_at: '2026-08-22T20:01:00Z', updated_at: '2026-08-22T20:01:00Z' },
      ]));
    }
    if (req.method() === 'GET' && path.includes('/contact-methods')) {
      const personId = path.split('/people/')[1].split('/contact-methods')[0];
      return route.fulfill(reply(200, [{ id: `${personId.slice(0, 8)}-contact`, person_id: personId, channel: 'email', address: personId === wanted ? 'exact@example.test' : 'first@example.test', lifecycle: 'active', created_at: '2026-08-22T20:00:00Z', updated_at: '2026-08-22T20:00:00Z' }]));
    }
    return route.fulfill(reply(404, { detail: `unhandled ${req.method()} ${path}` }));
  });

  await page.goto(`http://127.0.0.1:8000/directory/?person_id=${wanted}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    const gated = document.querySelector('[data-cmx-gated-content]');
    if (gated) gated.hidden = false;
    document.body.classList.remove('cmx-black-prompt-locked');
    document.querySelectorAll('[data-cmx-gate-overlay],#cmx-black-prompt-gate').forEach((node) => node.remove());
  });

  await page.waitForFunction((id) => document.documentElement.dataset.continuumExactReference === 'focused' && document.querySelector(`[data-server-person="${id}"]`)?.dataset.exactReference === 'true', wanted);
  await page.waitForFunction(() => document.querySelector('#detailPane')?.innerText.includes('Exact Person'));

  assert.equal(await page.locator(`[data-server-person="${wanted}"]`).getAttribute('aria-current'), 'true');
  assert.match(await page.locator('#detailPane').innerText(), /Exact Person/);
  assert.ok(requests.some(([, path]) => path.includes(`/people/${wanted}/contact-methods`)), 'exact Person focus must load that Person contact methods');
  assert.equal(requests.some(([method]) => method !== 'GET'), false, 'exact-reference Directory landing must not mutate backend state');
  await page.close();
}

async function proveLibrary(browser) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const first = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
  const wanted = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
  const requests = [];

  function listing() {
    return {
      navigation: { current_folder_id: null, parent_folder_id: null, breadcrumbs: [] },
      items: [
        { item_type: 'content', stable_id: first, display_name: 'First Content', kind: 'markdown', lifecycle: 'active', draft_revision: 1, current_version_id: null, current_version_number: null, snippet: 'first', used_by_count: 0 },
        { item_type: 'content', stable_id: wanted, display_name: 'Exact Content', kind: 'markdown', lifecycle: 'active', draft_revision: 4, current_version_id: 'version-exact', current_version_number: 2, snippet: 'exact', used_by_count: 1 },
      ],
    };
  }

  function details(id) {
    const exact = id === wanted;
    return {
      asset: { id, kind: 'markdown', title: exact ? 'Exact Content' : 'First Content', filename: null, visibility: 'library', lifecycle: 'active', folder_id: null, current_version_id: exact ? 'version-exact' : null, created_at: '2026-08-22T20:00:00Z', updated_at: '2026-08-22T20:00:00Z' },
      draft: { id: `${id}-draft`, content_asset_id: id, revision: exact ? 4 : 1, source_text: exact ? 'Exact frozen-source family' : 'First source', created_at: '2026-08-22T20:00:00Z', updated_at: '2026-08-22T20:00:00Z' },
      current_version: null,
      versions: [],
      breadcrumbs: [],
      dependency_count: exact ? 1 : 0,
    };
  }

  await page.route('**/api/v1/**', async (route) => {
    const req = route.request();
    const path = new URL(req.url()).pathname;
    requests.push([req.method(), path]);
    if (req.method() === 'GET' && path.endsWith('/checkin/operator/session')) return route.fulfill(reply(200, { authenticated: true, expires_at: '2026-08-22T23:00:00Z', csrf_token: 'library-exact-csrf' }));
    if (req.method() === 'GET' && path.endsWith('/checkin/operator/library')) return route.fulfill(reply(200, listing()));
    if (req.method() === 'GET' && path.includes('/checkin/operator/library/content/')) {
      const id = decodeURIComponent(path.split('/content/')[1]);
      return route.fulfill(reply(200, details(id)));
    }
    return route.fulfill(reply(404, { detail: `unhandled ${req.method()} ${path}` }));
  });

  await page.goto(`http://127.0.0.1:8000/library/?content_id=${wanted}`, { waitUntil: 'networkidle' });
  await page.waitForFunction((id) => document.documentElement.dataset.continuumExactReference === 'focused' && document.querySelector(`[data-library-content-id="${id}"]`)?.dataset.exactReference === 'true', wanted);
  await page.waitForFunction(() => document.querySelector('#libraryServerSelectedTitle')?.textContent === 'Exact Content');

  assert.equal(await page.locator(`[data-library-content-id="${wanted}"]`).getAttribute('aria-current'), 'true');
  assert.equal(await page.locator('#libraryServerSelectedTitle').textContent(), 'Exact Content');
  assert.ok(requests.some(([, path]) => path.endsWith(`/library/content/${wanted}`)), 'exact Content focus must load the exact ContentAsset details');
  assert.equal(requests.some(([method]) => method !== 'GET'), false, 'exact-reference Library landing must not mutate backend state');

  const overflow = await page.evaluate(() => Math.max(document.body.scrollWidth, document.documentElement.scrollWidth) > document.documentElement.clientWidth + 1);
  assert.equal(overflow, false, 'exact-reference focus must not create mobile horizontal overflow');
  await page.close();
}

(async () => {
  const browser = await chromium.launch({ executablePath, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  try {
    await proveDirectory(browser);
    await proveLibrary(browser);
  } finally {
    await browser.close();
  }
  console.log('Continuum exact-reference Directory/Library browser proof passed.');
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
