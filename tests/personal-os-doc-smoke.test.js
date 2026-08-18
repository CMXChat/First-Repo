'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const htmlPath = path.join(root, 'doc/index.html');
const cssPath = path.join(root, 'assets/personal-os-doc.css');
const editorialCssPath = path.join(root, 'assets/personal-os-doc-editorial.css');
const finalCssPath = path.join(root, 'assets/continuum-doc-final.css');
const promiseCssPath = path.join(root, 'assets/continuum-doc-promise.css');
const jsPath = path.join(root, 'assets/personal-os-doc.js');
const routesPath = path.join(root, 'assets/cmx-routes.json');

for (const filePath of [htmlPath, cssPath, editorialCssPath, finalCssPath, promiseCssPath, jsPath, routesPath]) {
  assert.ok(fs.existsSync(filePath), `Missing required Continuum document file: ${filePath}`);
}

const html = fs.readFileSync(htmlPath, 'utf8');
const bodySource = html.slice(html.indexOf('<body>'));
const css = fs.readFileSync(cssPath, 'utf8');
const editorialCss = fs.readFileSync(editorialCssPath, 'utf8');
const finalCss = fs.readFileSync(finalCssPath, 'utf8');
const promiseCss = fs.readFileSync(promiseCssPath, 'utf8');
const js = fs.readFileSync(jsPath, 'utf8');
const routes = JSON.parse(fs.readFileSync(routesPath, 'utf8'));

assert.doesNotMatch(html, /data-cmx-gate=|data-cmx-gated-content|cmx-black-prompt-locked/);
assert.match(html, /<html lang="en" data-theme="light">/);
assert.match(html, /meta name="robots" content="noindex, nofollow/);
assert.match(html, /<title>Continuum \| Product, Architecture and Build Overview<\/title>/);
assert.match(html, /personal-os-doc\.js\?v=20260818-3/);
assert.match(html, /continuum-doc-final\.css\?v=20260818-3/);
assert.match(html, /continuum-doc-promise\.css\?v=20260818-1/);
assert.doesNotMatch(html, /continuum-doc(?:-v2|-mobile-v3)?\.css/);
assert.doesNotMatch(html, /style=/i, 'Strict /doc CSP should not depend on inline style attributes.');
assert.match(html, /<h1 id="pageTitle">Continuum<\/h1>/);

// Opening promise must explain the whole product before architecture detail.
assert.match(html, /Continuum brings your information, people, files, messages, services, automations and AI/);
assert.match(html, /build briefings from connected sources/);
assert.match(html, /analyze money/);
assert.match(html, /future voice/);
assert.match(html, /your context, priorities and instructions have somewhere durable to live/);
assert.match(html, /Afterlife carries that idea further/);
assert.match(html, /contacting trusted people, releasing approved information/);

// Extension-of-you visual must remain directly in the hero story.
assert.match(html, /BEYOND THE CURRENT SESSION/);
assert.match(html, /Your intent has somewhere durable to live/);
assert.match(html, /WITH YOU/);
assert.match(html, /FOR YOU/);
assert.match(html, /WHEN YOU ARE AWAY/);
assert.match(html, /IF YOU CANNOT RESPOND/);
assert.match(html, /Brief, understand, plan/);
assert.match(html, /Coordinate, follow up, act/);
assert.match(html, /Wait, monitor, continue/);
assert.match(html, /Begin your continuity plan/);
assert.match(html, /The Check In trigger core works today/);

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

// Directory and Library must be taught visually.
assert.match(html, /people-map/);
assert.match(html, /Project Team/);
assert.match(html, /library-tree/);
assert.match(html, /continuity\.md/);
assert.match(html, /Draft[\s\S]*Version 1[\s\S]*Automation/);

// Afterlife current truth and customization.
assert.match(html, /Afterlife/);
assert.match(html, /The Dead Man Switch/);
assert.match(html, /You choose the timing/);
assert.match(html, /72h check-in timer \+ 24h grace/);
assert.match(html, /Choose the interval/);
assert.match(html, /Choose the extra time/);
assert.match(html, /Pause or resume/);
assert.match(html, /Move one deadline/);
assert.match(html, /Continuity is triggered/);
assert.match(html, /durable Incident/i);

// Build and long-term capability direction.
assert.match(html, /\/lab\/automations\//);
assert.match(html, /Python \+ FastAPI/);
assert.match(html, /PostgreSQL/);
assert.match(html, /React and TypeScript/);
assert.match(html, /Codespaces/);
assert.match(html, /Alembic/);
assert.match(html, /OpenAPI client/);
assert.match(html, /APIs \+ MCP/);
assert.match(html, /WhatsApp Business/);
assert.match(html, /SMS \+ voice/);
assert.match(html, /Money analysis \+ supported actions/);

// Core visual teaching components.
for (const className of [
  'network-lines',
  'continuum-presence',
  'presence-track',
  'process-map',
  'ai-compare',
  'ai-journey',
  'people-map',
  'library-tree',
  'term-guide',
  'workflow-nodes',
  'possibility-board',
  'policy-ring',
  'afterlife-timeline',
  'stack-pipeline',
  'tech-detail',
  'roadmap-rich'
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

// JS must keep the menu inside the toolbar and preserve targeted observers only.
assert.match(js, /IntersectionObserver/);
assert.match(js, /window\.print/);
assert.match(js, /aria-current/);
assert.match(js, /continuum_doc_theme_v1/);
assert.match(js, /actions\.insertBefore\(trigger/);
assert.doesNotMatch(js, /insertAdjacentElement\('afterend', trigger\)/);
assert.doesNotMatch(js, /plainCopy|createTreeWalker\(document\.body, NodeFilter\.SHOW_TEXT\).*MutationObserver/s);

assert.match(css, /html\[data-theme="light"\]/);
assert.match(css, /\.theme-toggle/);
assert.match(editorialCss, /classic light refinement/i);
assert.match(finalCss, /\.hero-network/);
assert.match(finalCss, /\.network-lines/);
assert.match(finalCss, /\.process-map/);
assert.match(finalCss, /\.ai-compare/);
assert.match(finalCss, /\.journey-step\{display:block/);
assert.match(finalCss, /\.people-map-card/);
assert.match(finalCss, /\.library-flow-card/);
assert.match(finalCss, /\.possibility-card/);
assert.match(finalCss, /\.policy-ring/);
assert.match(finalCss, /conic-gradient/);
assert.match(finalCss, /\.policy-config-grid/);
assert.match(finalCss, /\.afterlife-step\.is-trigger/);
assert.match(finalCss, /\.stack-pipeline/);
assert.match(finalCss, /\.tech-detail/);
assert.match(finalCss, /\.roadmap-rich/);
assert.match(finalCss, /\.document-rail \.rail-status\{display:none\}/);
assert.match(finalCss, /\.document-actions \.mobile-contents-trigger/);
assert.match(finalCss, /@media\(max-width:680px\)/);
assert.match(finalCss, /@media\(prefers-reduced-motion:reduce\)/);
assert.match(finalCss, /@media print/);

assert.match(promiseCss, /\.continuum-presence/);
assert.match(promiseCss, /\.presence-track/);
assert.match(promiseCss, /\.presence-stage/);
assert.match(promiseCss, /\.presence-truth/);
assert.match(promiseCss, /grid-template-columns:repeat\(4,minmax\(0,1fr\)\)/);
assert.match(promiseCss, /@media\(max-width:680px\)/);
assert.match(promiseCss, /grid-template-columns:1fr/);
assert.match(promiseCss, /@media print/);

console.log('Final Continuum document smoke test passed.');
