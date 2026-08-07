'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const htmlPath = path.join(root, 'doc/index.html');
const cssPath = path.join(root, 'assets/personal-os-doc.css');
const editorialCssPath = path.join(root, 'assets/personal-os-doc-editorial.css');
const jsPath = path.join(root, 'assets/personal-os-doc.js');
const routesPath = path.join(root, 'assets/cmx-routes.json');

for (const filePath of [htmlPath, cssPath, editorialCssPath, jsPath, routesPath]) {
  assert.ok(fs.existsSync(filePath), `Missing required Spaces document file: ${filePath}`);
}

const html = fs.readFileSync(htmlPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');
const editorialCss = fs.readFileSync(editorialCssPath, 'utf8');
const js = fs.readFileSync(jsPath, 'utf8');
const routes = JSON.parse(fs.readFileSync(routesPath, 'utf8'));

assert.doesNotMatch(html, /data-cmx-gate=/);
assert.doesNotMatch(html, /data-cmx-gated-content/);
assert.doesNotMatch(html, /cmx-black-prompt-locked/);
assert.match(html, /<html lang="en" data-theme="light">/);
assert.match(html, /<body>\s*<main>/);
assert.match(html, /meta name="referrer" content="no-referrer"/);
assert.match(html, /meta name="robots" content="noindex, nofollow/);
assert.match(html, /Public overview/);
assert.match(html, /This public noindex overview contains product explanation and fictional examples/);
assert.match(html, /personal-os-doc\.js\?v=20260807-4/);
assert.match(html, /personal-os-doc\.css\?v=20260807-4/);
assert.equal((html.match(/class="scenario-card(?:\s|\")/g) || []).length, 7);
assert.match(html, /Seven briefing contexts: Personal, Relationship, Family, Business partners, Accountant and client, Trainer, and Team/);
assert.match(html, /Accountant and Client Space/);
assert.match(html, /New York and Sydney time/);
assert.match(html, /Trainer and student/);

const docRoute = routes.routes.find((route) => route.path === '/doc/');
assert.ok(docRoute, '/doc/ must remain registered.');
assert.equal(docRoute.status, 'Active');
assert.equal(docRoute.visibility, 'Direct-link-only');
assert.equal(docRoute.gated, false, '/doc/ must remain public and must not require a password.');

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
  'investment',
  'architecture',
  'scenarios',
  'faq'
]) {
  assert.match(html, new RegExp(`id="${id}"`), `Missing required section: ${id}`);
}

assert.match(js, /Spaces \| Context-Driven Workspace and Daily Brief/);
assert.match(js, /Open the part of your life you’re working in/);
assert.match(js, /A Space learns from connected accounts, direct input, and corrections/);
assert.match(js, /Memory belongs to the Space and stays under the user’s control/);
assert.match(js, /Planned Memory & Data settings/);
assert.match(js, /The model can change while the Space keeps its history/);
assert.match(js, /Cloudflare could become infrastructure beneath Spaces/);
assert.match(js, /https:\/\/developers\.cloudflare\.com\/agents\//);
assert.doesNotMatch(js, /Cloudflare OS|os\.cloudflare\.app/);
assert.match(js, /Brief · Documents · Projects · Research · Memory · Tasks · Calendar · Files · Settings/);
assert.match(js, /spaces_doc_theme_v1/);
assert.match(js, /personal_os_doc_theme_v3/);
assert.match(js, /IntersectionObserver/);
assert.match(js, /window\.print/);
assert.match(js, /aria-current/);
assert.doesNotMatch(js, /plainCopy|createTreeWalker\(document\.body, NodeFilter\.SHOW_TEXT\).*MutationObserver/s);

assert.match(css, /html\[data-theme="light"\]/);
assert.match(css, /\.theme-toggle/);
assert.match(css, /@media \(max-width: 680px\)/);
assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
assert.match(css, /@media print/);
assert.match(html, /class="product-preview-stage"/);
assert.match(html, /Adjacent products reviewed from official product pages in August 2026/);
assert.match(html, /Across these official product descriptions, no single product presents the full combination shown here/);
assert.match(html, /Yes, adjacent versions are already being built/);
assert.match(html, /A patent would need narrow technical claims/);
assert.match(html, /Remote business partners and small teams/);
assert.match(html, /Patent Public Search/);
assert.match(html, /This is a product strategy, not legal advice/);
assert.match(html, /https:\/\/developers\.cloudflare\.com\/agents\//);
assert.doesNotMatch(html, /Cloudflare OS|os\.cloudflare\.app/);
assert.match(editorialCss, /classic light refinement/i);
assert.match(editorialCss, /html\[data-theme="light"\] \.document-paper/);
assert.match(editorialCss, /@media \(max-width: 680px\)/);
assert.match(editorialCss, /@media print/);

console.log('Spaces document smoke test passed.');
