'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const htmlPath = path.join(root, 'doc/index.html');
const cssPath = path.join(root, 'assets/personal-os-doc.css');
const editorialCssPath = path.join(root, 'assets/personal-os-doc-editorial.css');
const continuumCssPath = path.join(root, 'assets/continuum-doc.css');
const continuumV2CssPath = path.join(root, 'assets/continuum-doc-v2.css');
const continuumMobileV3CssPath = path.join(root, 'assets/continuum-doc-mobile-v3.css');
const jsPath = path.join(root, 'assets/personal-os-doc.js');
const routesPath = path.join(root, 'assets/cmx-routes.json');

for (const filePath of [htmlPath, cssPath, editorialCssPath, continuumCssPath, continuumV2CssPath, continuumMobileV3CssPath, jsPath, routesPath]) {
  assert.ok(fs.existsSync(filePath), `Missing required Continuum document file: ${filePath}`);
}

const html = fs.readFileSync(htmlPath, 'utf8');
const bodySource = html.slice(html.indexOf('<body>'));
const css = fs.readFileSync(cssPath, 'utf8');
const editorialCss = fs.readFileSync(editorialCssPath, 'utf8');
const continuumCss = fs.readFileSync(continuumCssPath, 'utf8');
const continuumV2Css = fs.readFileSync(continuumV2CssPath, 'utf8');
const continuumMobileV3Css = fs.readFileSync(continuumMobileV3CssPath, 'utf8');
const js = fs.readFileSync(jsPath, 'utf8');
const routes = JSON.parse(fs.readFileSync(routesPath, 'utf8'));

assert.doesNotMatch(html, /data-cmx-gate=/);
assert.doesNotMatch(html, /data-cmx-gated-content/);
assert.doesNotMatch(html, /cmx-black-prompt-locked/);
assert.match(html, /<html lang="en" data-theme="light">/);
assert.match(html, /<body>\s*<main>/);
assert.match(html, /meta name="referrer" content="no-referrer"/);
assert.match(html, /meta name="robots" content="noindex, nofollow/);
assert.match(html, /<title>Continuum \| Product, Architecture and Build Overview<\/title>/);
assert.match(html, /working production, active prototypes and planned platform work/);
assert.match(html, /personal-os-doc\.js\?v=20260818-2/);
assert.match(html, /continuum-doc\.css\?v=20260818-1/);
assert.match(html, /continuum-doc-v2\.css\?v=20260818-1/);
assert.match(html, /continuum-doc-mobile-v3\.css\?v=20260818-1/);
assert.match(html, /<h1 id="pageTitle">Continuum<\/h1>/);
assert.match(html, /Afterlife/);
assert.match(html, /The Dead Man Switch/);
assert.match(html, /72 elapsed hours/);
assert.match(html, /24 elapsed hours/);
assert.match(html, /96h/);
assert.match(html, /afterlife-policy-chart/);
assert.match(html, /afterlife-meter/);
assert.match(html, /afterlife-state/);
assert.match(html, /Approved continuity outcomes/);
assert.match(html, /\/lab\/automations\//);
assert.match(html, /continuity\.md/);
assert.match(html, /Python \+ FastAPI/);
assert.match(html, /PostgreSQL/);
assert.match(html, /React \/ TypeScript/);
assert.match(html, /Codespaces \+ Dev Container/);
assert.match(html, /Alembic migrations/);
assert.match(html, /OpenAPI \+ generated client/);
assert.match(html, /APIs \+ MCP/);
assert.match(html, /WhatsApp Business/);
assert.match(html, /SMS \+ voice/);
assert.match(html, /Finance/);
assert.match(html, /server-enforced authority/);
assert.match(html, /Runtime/);
assert.match(html, /provenance|Source/i);
assert.match(html, /Freshness/);

// Editorial contract for public /doc copy. Keep the writing direct and human.
assert.doesNotMatch(bodySource, /\.\.\.|…/);
assert.doesNotMatch(bodySource, /—/);
assert.doesNotMatch(bodySource, /\bit(?:'|’)s not\b/i);
assert.doesNotMatch(bodySource, /\bnot\b[^<.!?]{0,90}\bbut\b/i);
assert.doesNotMatch(bodySource, /\bit(?:'|’)s\b[^<.!?]{0,90},\s*not\b/i);
assert.doesNotMatch(bodySource, /\brather than\b/i);
assert.doesNotMatch(bodySource, /\bdoes not need\b/i);

for (const id of [
  'overview',
  'difference',
  'spaces',
  'action',
  'afterlife',
  'engineering',
  'build',
  'status'
]) {
  assert.match(html, new RegExp(`id="${id}"`), `Missing required section: ${id}`);
}

assert.equal((html.match(/class="document-section continuum-section/g) || []).length, 8);

const docRoute = routes.routes.find((route) => route.path === '/doc/');
assert.ok(docRoute, '/doc/ must remain registered.');
assert.equal(docRoute.status, 'Active');
assert.equal(docRoute.visibility, 'Direct-link-only');
assert.equal(docRoute.gated, false, '/doc/ must remain public and must not require a password.');
assert.equal(docRoute.name, 'Continuum Product & Architecture Overview');
assert.match(docRoute.description, /Afterlife: The Dead Man Switch/);

assert.match(js, /IntersectionObserver/);
assert.match(js, /window\.print/);
assert.match(js, /aria-current/);
assert.match(js, /continuum_doc_theme_v1/);
assert.match(js, /spaces_doc_theme_v1/);
assert.doesNotMatch(js, /plainCopy|createTreeWalker\(document\.body, NodeFilter\.SHOW_TEXT\).*MutationObserver/s);

assert.match(css, /html\[data-theme="light"\]/);
assert.match(css, /\.theme-toggle/);
assert.match(css, /@media \(max-width: 680px\)/);
assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
assert.match(css, /@media print/);
assert.match(editorialCss, /classic light refinement/i);
assert.match(editorialCss, /html\[data-theme="light"\] \.document-paper/);
assert.match(continuumCss, /\.continuum-map/);
assert.match(continuumCss, /\.afterlife-section/);
assert.match(continuumV2Css, /\.tour-grid/);
assert.match(continuumV2Css, /\.leverage-stage/);
assert.match(continuumV2Css, /\.brief-preview/);
assert.match(continuumV2Css, /\.workflow-card/);
assert.match(continuumV2Css, /\.afterlife-track/);
assert.match(continuumV2Css, /\.stack-visual/);
assert.match(continuumMobileV3Css, /\.afterlife-policy-ring/);
assert.match(continuumMobileV3Css, /conic-gradient/);
assert.match(continuumMobileV3Css, /\.afterlife-track::before/);
assert.match(continuumMobileV3Css, /#overview \.tour-grid::before/);
assert.match(continuumMobileV3Css, /grid-auto-flow:column/);
assert.match(continuumMobileV3Css, /\.compact-map \.node-runtime/);
assert.match(continuumMobileV3Css, /\.mobile-contents-trigger::before/);
assert.match(continuumMobileV3Css, /@media \(max-width: 680px\)/);
assert.match(continuumMobileV3Css, /@media \(prefers-reduced-motion: reduce\)/);
assert.match(continuumMobileV3Css, /@media print/);

console.log('Continuum mobile infographic document smoke test passed.');
