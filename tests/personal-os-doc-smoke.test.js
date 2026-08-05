'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const htmlPath = path.join(root, 'doc/index.html');
const cssPath = path.join(root, 'assets/personal-os-doc.css');
const jsPath = path.join(root, 'assets/personal-os-doc.js');

for (const filePath of [htmlPath, cssPath, jsPath]) {
  assert.ok(fs.existsSync(filePath), `Missing required Personal OS document file: ${filePath}`);
}

const html = fs.readFileSync(htmlPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');
const js = fs.readFileSync(jsPath, 'utf8');

assert.match(html, /data-cmx-gate="black-prompt"/);
assert.match(html, /data-cmx-gate-id="personal-os-document"/);
assert.match(html, /data-cmx-gated-content hidden/);
assert.match(html, /class="cmx-black-prompt-locked"/);
assert.match(html, /meta name="referrer" content="no-referrer"/);
assert.match(html, /meta name="robots" content="noindex, nofollow/);

for (const id of [
  'overview',
  'model',
  'spaces',
  'memory',
  'goals',
  'ritual',
  'relationships',
  'ai-layer',
  'trust',
  'status',
  'architecture',
  'scenarios',
  'faq'
]) {
  assert.match(html, new RegExp(`id="${id}"`), `Missing required section: ${id}`);
  assert.match(html, new RegExp(`href="#${id}"`), `Missing table-of-contents link: ${id}`);
}

const demoLinks = html.match(/href="\/brief\/"/g) || [];
assert.ok(demoLinks.length >= 3, 'Expected prominent /brief/ demo links at the top and bottom of the document.');
assert.match(html, /Concept \+ working demo/);
assert.match(html, /sourced public information and clearly fictional private-looking examples/i);
assert.match(html, /Spaces make one system useful between people/);
assert.match(html, /Memory should be organized, inspectable, and correctable/);
assert.match(html, /Goals turn context into movement/);
assert.match(html, /alarm, selected music, voice/i);
assert.match(html, /The AI can change\. Your operating context stays yours\./);
assert.match(html, /Current reality/);

assert.doesNotMatch(html, /…/u, 'Use full sentences instead of Unicode ellipses.');
assert.doesNotMatch(html, /—/u, 'Use punctuation other than em dashes.');

const ids = Array.from(html.matchAll(/\sid="([^"]+)"/g), (match) => match[1]);
const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
assert.deepEqual(duplicates, [], `Duplicate HTML ids found: ${duplicates.join(', ')}`);

assert.match(css, /html\[data-theme="light"\]/);
assert.match(css, /\.theme-toggle/);
assert.match(css, /@media \(max-width: 680px\)/);
assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
assert.match(css, /@media print/);

assert.match(js, /personal_os_doc_theme_v2/);
assert.match(js, /IntersectionObserver/);
assert.match(js, /window\.print/);
assert.match(js, /aria-current/);

console.log('Personal OS document smoke test passed.');
