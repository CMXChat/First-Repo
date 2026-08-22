'use strict';

const { chromium } = require('playwright-core');
const assert = require('node:assert/strict');

const executablePath = process.env.BROWSER;
if (!executablePath) throw new Error('BROWSER is required');

async function prove(route, apiName) {
  const browser = await chromium.launch({ executablePath, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const page = await browser.newPage({ viewport: { width: route === '/email/' ? 1280 : 390, height: 900 } });
  const seen = [];

  await page.route('**/api/v1/**', async (requestRoute) => {
    const req = requestRoute.request();
    const path = new URL(req.url()).pathname;
    seen.push([req.method(), path]);
    if (req.method() === 'GET' && path.endsWith('/automations/automation-link/runs/run-link/receipt')) {
      return requestRoute.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ run_id: 'run-link', run_status: 'succeeded', provider_mode: 'fake' }),
      });
    }
    return requestRoute.fulfill({ status: 401, contentType: 'application/json', body: JSON.stringify({ detail: 'operator session required' }) });
  });

  await page.goto(`http://127.0.0.1:8000${route}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    const gated = document.querySelector('[data-cmx-gated-content]');
    if (gated) gated.hidden = false;
    document.body.classList.remove('cmx-black-prompt-locked');
    document.querySelectorAll('[data-cmx-gate-overlay],#cmx-black-prompt-gate').forEach((node) => node.remove());
    const receipt = document.querySelector('#receiptView, #emailReceipt');
    if (receipt) receipt.hidden = false;
  });

  await page.waitForFunction(() => document.querySelector('script[data-runtime-receipt-control-link]') !== null);
  await page.evaluate(async ({ apiName }) => {
    const api = window[apiName];
    if (!api?.getReceipt) throw new Error(`${apiName}.getReceipt missing`);
    await api.getReceipt('automation-link', 'run-link');
  }, { apiName });

  await page.waitForFunction(() => document.documentElement.dataset.continuumReceiptControlLink === 'ready');
  const fact = await page.evaluate(() => {
    const link = document.querySelector('[data-runtime-control-link] a');
    return {
      href: link?.getAttribute('href') || '',
      text: link?.textContent || '',
      cards: document.querySelectorAll('[data-runtime-control-link]').length,
    };
  });

  assert.equal(fact.href, '/control/?automation_id=automation-link&run_id=run-link');
  assert.equal(fact.text, 'Open this Run in Control');
  assert.equal(fact.cards, 1, 'receipt should expose exactly one Control handoff');
  for (const forbidden of ['operator_key', 'csrf', 'subject', 'body', 'recipient', 'sender']) {
    assert.equal(fact.href.includes(forbidden), false, `Control receipt URL leaked ${forbidden}`);
  }
  assert.equal(seen.some(([method]) => method !== 'GET'), false, 'opening receipt navigation proof must not mutate backend state');

  await browser.close();
}

(async () => {
  await prove('/email/', 'CMXEmailLabApi');
  await prove('/requests/', 'CMXOperatorApi');
  console.log('Email and Requests exact Runtime receipt navigation to Control: PASS');
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
