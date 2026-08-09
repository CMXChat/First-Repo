'use strict';

const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');

// These product-interaction checks exercise the canonical /spaces/ route.
// The dedicated legacy redirect check remains in the broader browser matrix.
const sourcePath = path.join(__dirname, 'brief-next.source.cjs');
let source = fs.readFileSync(sourcePath, 'utf8');

const legacyGoto = "page.goto('/brief/'";
const canonicalGoto = "page.goto('/spaces/'";
const gotoCount = source.split(legacyGoto).length - 1;
if (gotoCount !== 2) {
  throw new Error(`Expected 2 active product navigations through /brief/, found ${gotoCount}.`);
}
source = source.split(legacyGoto).join(canonicalGoto);

const previousMockStart = "async function installSpotifyMock(page) {\n  await page.addInitScript(";
const offlineMockStart = "async function installSpotifyMock(page) {\n  await page.route('https://open.spotify.com/**', route => route.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>Spotify mock</title>' }));\n  await page.addInitScript(";
if (!source.includes(previousMockStart)) {
  throw new Error('Spotify browser mock no longer matches the expected deterministic setup.');
}
source = source.replace(previousMockStart, offlineMockStart);

const previousReset = [
  "  await expect(page.locator('#openDemo')).toBeEnabled();",
  "  await expect(page.locator('#openDemoLabel')).toHaveText('Open Personal Briefing');",
  "  await expect(page.locator('[data-entry-scenario=\"personal\"]')).toHaveAttribute('aria-pressed', 'true');",
  "  await expect(page.locator('#entrySpacePreview')).toHaveAttribute('data-entry-preview', 'personal');"
].join('\n');

const neutralReset = [
  "  await expect(page.locator('#openDemo')).toBeDisabled();",
  "  await expect(page.locator('#openDemoLabel')).toHaveText('Choose a Briefing');",
  "  await expect(page.locator('[data-entry-scenario][aria-pressed=\"true\"]')).toHaveCount(0);",
  "  await expect(page.locator('[data-entry-scenario][aria-pressed=\"false\"]')).toHaveCount(7);",
  "  await expect(page.locator('#entrySpacePreview')).toBeHidden();",
  "  await expect(page.locator('[data-entry-scenario=\"personal\"] .entry-option-topline em')).toHaveText('One person');"
].join('\n');

if (!source.includes(previousReset)) {
  throw new Error('Reset expectations no longer match the pre-neutral entry contract.');
}
source = source.replace(previousReset, neutralReset);

const suite = new Module(sourcePath, module);
suite.filename = sourcePath;
suite.paths = Module._nodeModulePaths(__dirname);
suite._compile(source, sourcePath);
