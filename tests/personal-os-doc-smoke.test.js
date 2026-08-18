'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const htmlPath = path.join(root, 'doc/index.html');
const cssPath = path.join(root, 'assets/personal-os-doc.css');
const editorialCssPath = path.join(root, 'assets/personal-os-doc-editorial.css');
const continuumCssPath = path.join(root, 'assets/continuum-doc.css');
const jsPath = path.join(root, 'assets/personal-os-doc.js');
const routesPath = path.join(root, 'assets/cmx-routes.json');

for (const filePath of [htmlPath, cssPath, editorialCssPath, continuumCssPath, jsPath, routesPath]) {
  assert.ok(fs.existsSync(filePath), `Missing required Continuum document file: ${filePath}`);
}

const html = fs.readFileSync(htmlPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');
const editorialCss = fs.readFileSync(editorialCssPath, 'utf8');
const continuumCss = fs.readFileSync(continuumCssPath, 'utf8');
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
assert.match(html, /This public noindex document combines working production pieces, active prototypes and planned architecture/);
assert.match(html, /personal-os-doc\.js\?v=20260818-1/);
assert.match(html, /continuum-doc\.css\?v=20260818-1/);
assert.match(html, /<h1 id="pageTitle">Continuum<\/h1>/);
assert.match(html, /Afterlife/);
assert.match(html, /The Dead Man Switch/);
assert.match(html, /72 elapsed hours/);
assert.match(html, /24 elapsed hours/);
assert.match(html, /\/lab\/automations\//);
assert.match(html, /continuity\.md/);
assert.match(html, /Python \+ FastAPI/);
assert.match(html, /PostgreSQL/);
assert.match(html, /React \/ TypeScript/);
assert.match(html, /Codespaces \+ Dev Container/);
assert.match(html, /Alembic/);
assert.match(html, /OpenAPI/);
assert.match(html, /APIs \+ MCP/);
assert.match(html, /WhatsApp Business/);
assert.match(html, /Voice \+ SMS/);
assert.match(html, /Finance/);
assert.match(html, /AI Gateway/);
assert.match(html, /AuthorityGrant/);
assert.match(html, /Runtime/);

for (const id of [
  'overview',
  'difference',
  'spaces',
  'context',
  'automations',
  'connections',
  'ai',
  'afterlife',
  'engineering',
  'build',
  'status',
  'architecture'
]) {
  assert.match(html, new RegExp(`id="${id}"`), `Missing required section: ${id}`);
}

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
assert.match(continuumCss, /\.connection-board/);
assert.match(continuumCss, /\.ai-gateway-stage/);
assert.match(continuumCss, /\.dev-stack/);
assert.match(continuumCss, /@media \(max-width: 680px\)/);
assert.match(continuumCss, /@media \(prefers-reduced-motion: reduce\)/);
assert.match(continuumCss, /@media print/);

console.log('Continuum document smoke test passed.');
