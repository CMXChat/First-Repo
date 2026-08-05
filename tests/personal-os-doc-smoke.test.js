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
  assert.ok(fs.existsSync(filePath), `Missing required Personal OS document file: ${filePath}`);
}

const html = fs.readFileSync(htmlPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');
const editorialCss = fs.readFileSync(editorialCssPath, 'utf8');
const js = fs.readFileSync(jsPath, 'utf8');
const routes = JSON.parse(fs.readFileSync(routesPath, 'utf8'));

assert.doesNotMatch(html, /data-cmx-gate=/);
assert.doesNotMatch(html, /data-cmx-gated-content/);
assert.doesNotMatch(html, /cmx-black-prompt-locked/);
assert.doesNotMatch(html, /cmx-gate-black-prompt\.(?:css|js)/);
assert.match(html, /<body>\s*<main>/);
assert.match(html, /meta name="referrer" content="no-referrer"/);
assert.match(html, /meta name="robots" content="noindex, nofollow/);
assert.match(html, /Public overview/);
assert.match(html, /This noindex overview contains product explanation and fictional examples/);

const docRoute = routes.routes.find((route) => route.path === '/doc/');
assert.ok(docRoute, '/doc/ must remain registered.');
assert.equal(docRoute.status, 'Active');
assert.equal(docRoute.visibility, 'Direct-link-only');
assert.equal(docRoute.gated, false, '/doc/ must be public and must not require a password.');
assert.match(docRoute.description, /Public noindex product narrative/);

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

assert.match(editorialCss, /Personal OS classic light refinement/);
assert.match(editorialCss, /html\[data-theme="light"\] \.document-paper/);
assert.match(editorialCss, /font-family: inherit/);
assert.match(editorialCss, /border-radius: 32px/);
assert.match(editorialCss, /linear-gradient\(135deg, #087bd6, #5164df/);
assert.match(editorialCss, /font-size: clamp\(2\.8rem, 5\.2vw, 4\.65rem\)/);
assert.match(editorialCss, /linear-gradient\(145deg, #f5f8fc, #eef3fb\)/);
assert.match(editorialCss, /html\[data-theme="light"\] \.final-cta \.button-primary/);
assert.doesNotMatch(editorialCss, /#0f2740|#153c62|#223d78/);
assert.doesNotMatch(editorialCss, /font-family: Georgia/);
assert.match(editorialCss, /@media \(max-width: 680px\)/);
assert.match(editorialCss, /@media print/);

assert.match(js, /personal_os_doc_theme_v3/);
assert.match(js, /personal-os-doc-editorial\.css/);
assert.match(js, /return getStoredTheme\(\) \|\| 'light'/);
assert.match(js, /nextTheme = theme === 'dark' \? 'dark' : 'light'/);
assert.match(js, /IntersectionObserver/);
assert.match(js, /window\.print/);
assert.match(js, /aria-current/);

console.log('Personal OS document smoke test passed.');
