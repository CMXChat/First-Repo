'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const htmlPath = path.join(root, 'doc/index.html');
const cssPath = path.join(root, 'assets/personal-os-doc.css');
const editorialCssPath = path.join(root, 'assets/personal-os-doc-editorial.css');
const finalCssPath = path.join(root, 'assets/continuum-doc-final.css');
const jsPath = path.join(root, 'assets/personal-os-doc.js');
const routesPath = path.join(root, 'assets/cmx-routes.json');

for (const filePath of [htmlPath, cssPath, editorialCssPath, finalCssPath, jsPath, routesPath]) {
  assert.ok(fs.existsSync(filePath), `Missing required Continuum document file: ${filePath}`);
}

const html = fs.readFileSync(htmlPath, 'utf8');
const bodySource = html.slice(html.indexOf('<body>'));
const css = fs.readFileSync(cssPath, 'utf8');
const editorialCss = fs.readFileSync(editorialCssPath, 'utf8');
const finalCss = fs.readFileSync(finalCssPath, 'utf8');
const js = fs.readFileSync(jsPath, 'utf8');
const routes = JSON.parse(fs.readFileSync(routesPath, 'utf8'));

assert.doesNotMatch(html, /data-cmx-gate=|data-cmx-gated-content|cmx-black-prompt-locked/);
assert.match(html, /<html lang="en" data-theme="light">/);
assert.match(html, /meta name="robots" content="noindex, nofollow/);
assert.match(html, /<title>Continuum \| Product, Architecture and Build Overview<\/title>/);
assert.match(html, /personal-os-doc\.js\?v=20260818-2/);
assert.match(html, /continuum-doc-final\.css\?v=20260818-2/);
assert.doesNotMatch(html, /continuum-doc(?:-v2|-mobile-v3)?\.css/);
assert.doesNotMatch(html, /style=/i, 'Strict /doc CSP should not depend on inline style attributes.');
assert.match(html, /<h1 id="pageTitle">Continuum<\/h1>/);

// Plain-English product story.
assert.match(html, /Think of it as a private control room/);
assert.match(html, /See what is happening/);
assert.match(html, /Remember it/);
assert.match(html, /Check your rules/);
assert.match(html, /Do approved work/);
assert.match(html, /Remember the result/);
assert.match(html, /What Continuum adds around AI/);
assert.match(html, /AI gets memory, tools, timing and rules/);
assert.match(html, /API[\s\S]*A doorway apps use to talk to each other/);
assert.match(html, /MCP[\s\S]*approved tools or information/);
assert.match(html, /Runtime[\s\S]*keeps a workflow moving after it starts/);
assert.match(html, /WHAT THIS FOUNDATION COULD UNLOCK/);
assert.match(html, /Wake-up brief/);
assert.match(html, /Coordinate people/);
assert.match(html, /Understand money/);
assert.match(html, /Communicate anywhere/);
assert.match(html, /Use more tools/);
assert.match(html, /Smarter AI over time/);

// Afterlife current truth and customization.
assert.match(html, /Afterlife/);
assert.match(html, /The Dead Man Switch/);
assert.match(html, /Current setup: 72 hours \+ 24 hours/);
assert.match(html, /CURRENT LIVE SETTINGS/);
assert.match(html, /72h check-in timer \+ 24h grace/);
assert.match(html, /Those are settings for the live switch today/);
assert.match(html, /Choose the interval/);
assert.match(html, /Choose the extra time/);
assert.match(html, /Pause or resume/);
assert.match(html, /Move one deadline/);
assert.match(html, /Continuity is triggered/);
assert.match(html, /durable Incident/i);

// Build and long-term capability direction.
assert.match(html, /\/lab\/automations\//);
assert.match(html, /continuity\.md/);
assert.match(html, /Python \+ FastAPI/);
assert.match(html, /PostgreSQL/);
assert.match(html, /React and TypeScript/);
assert.match(html, /Codespaces/);
assert.match(html, /Alembic/);
assert.match(html, /OpenAPI client/);
assert.match(html, /APIs \+ MCP/);
assert.match(html, /WhatsApp Business/);
assert.match(html, /SMS \+ voice/);
assert.match(html, /Money analysis and supported actions/);

// Core visual teaching components.
for (const className of [
  'network-lines',
  'process-map',
  'ai-journey',
  'term-guide',
  'workflow-nodes',
  'possibility-board',
  'policy-ring',
  'afterlife-timeline',
  'stack-pipeline',
  'roadmap-line'
]) {
  assert.match(html, new RegExp(className), `Missing required visual: ${className}`);
}

// Editorial contract for public /doc copy.
assert.doesNotMatch(bodySource, /\.\.\.|…|—/);
assert.doesNotMatch(bodySource, /\bit(?:'|’)s not\b/i);
assert.doesNotMatch(bodySource, /\bnot\b[^<.!?]{0,90}\bbut\b/i);
assert.doesNotMatch(bodySource, /\bit(?:'|’)s\b[^<.!?]{0,90},\s*not\b/i);
assert.doesNotMatch(bodySource, /\brather than\b/i);
assert.doesNotMatch(bodySource, /\bdoes not need\b/i);

for (const id of ['overview','difference','spaces','action','afterlife','engineering','build','status']) {
  assert.match(html, new RegExp(`id="${id}"`), `Missing required section: ${id}`);
}
assert.equal((html.match(/class="document-section continuum-section/g) || []).length, 8);

const docRoute = routes.routes.find((route) => route.path === '/doc/');
assert.ok(docRoute, '/doc/ must remain registered.');
assert.equal(docRoute.status, 'Active');
assert.equal(docRoute.visibility, 'Direct-link-only');
assert.equal(docRoute.gated, false);
assert.equal(docRoute.name, 'Continuum Product & Architecture Overview');
assert.match(docRoute.description, /Afterlife: The Dead Man Switch/);

assert.match(js, /IntersectionObserver/);
assert.match(js, /window\.print/);
assert.match(js, /aria-current/);
assert.match(js, /continuum_doc_theme_v1/);
assert.doesNotMatch(js, /plainCopy|createTreeWalker\(document\.body, NodeFilter\.SHOW_TEXT\).*MutationObserver/s);

assert.match(css, /html\[data-theme="light"\]/);
assert.match(css, /\.theme-toggle/);
assert.match(editorialCss, /classic light refinement/i);
assert.match(finalCss, /\.hero-network/);
assert.match(finalCss, /\.process-map/);
assert.match(finalCss, /\.ai-journey/);
assert.match(finalCss, /\.term-guide/);
assert.match(finalCss, /\.possibility-board/);
assert.match(finalCss, /\.policy-ring/);
assert.match(finalCss, /conic-gradient/);
assert.match(finalCss, /\.afterlife-step\.is-trigger/);
assert.match(finalCss, /\.stack-pipeline/);
assert.match(finalCss, /\.roadmap-line/);
assert.match(finalCss, /\.document-rail \.rail-status\{display:none\}/);
assert.match(finalCss, /\.mobile-contents-trigger::before/);
assert.match(finalCss, /@media\(max-width:680px\)/);
assert.match(finalCss, /@media\(prefers-reduced-motion:reduce\)/);
assert.match(finalCss, /@media print/);

console.log('Plain-English Continuum document smoke test passed.');
