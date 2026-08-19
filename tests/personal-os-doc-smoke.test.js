'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const requiredFiles = [
  'doc/index.html',
  'assets/personal-os-doc.css',
  'assets/personal-os-doc-editorial.css',
  'assets/personal-os-doc-desktop-tuning.css',
  'assets/personal-os-doc-mobile-fixes.css',
  'assets/personal-os-doc-mobile-contents.css',
  'assets/continuum-doc-final.css',
  'assets/continuum-doc-promise.css',
  'assets/continuum-doc-qa.css',
  'assets/continuum-doc-human.css',
  'assets/continuum-doc-origin.css',
  'assets/continuum-doc-capability.css',
  'assets/personal-os-doc.js',
  'assets/continuum-doc-origin.js',
  'assets/cmx-routes.json'
];

for (const relative of requiredFiles) {
  assert.ok(fs.existsSync(path.join(root, relative)), `Missing required Continuum document file: ${relative}`);
}

const html = fs.readFileSync(path.join(root, 'doc/index.html'), 'utf8');
const baseJs = fs.readFileSync(path.join(root, 'assets/personal-os-doc.js'), 'utf8');
const finalJs = fs.readFileSync(path.join(root, 'assets/continuum-doc-origin.js'), 'utf8');
const baseCss = fs.readFileSync(path.join(root, 'assets/personal-os-doc.css'), 'utf8');
const finalCss = fs.readFileSync(path.join(root, 'assets/continuum-doc-final.css'), 'utf8');
const qaCss = fs.readFileSync(path.join(root, 'assets/continuum-doc-qa.css'), 'utf8');
const originCss = fs.readFileSync(path.join(root, 'assets/continuum-doc-origin.css'), 'utf8');
const routes = JSON.parse(fs.readFileSync(path.join(root, 'assets/cmx-routes.json'), 'utf8'));

// Public document boundary stays strict and direct-link only.
assert.match(html, /<html lang="en" data-theme="light">/);
assert.match(html, /meta name="robots" content="noindex, nofollow/);
assert.match(html, /connect-src 'none'/);
assert.match(html, /<title>Continuum \| Product Overview<\/title>/);
assert.match(html, /<h1 id="pageTitle">Continuum<\/h1>/);
assert.doesNotMatch(html, /data-cmx-gate=|data-cmx-gated-content|cmx-black-prompt-locked/);
assert.doesNotMatch(html, /style=/i, 'Strict /doc CSP should not depend on inline style attributes.');

// The static fallback carries the current human-first opening and durable architecture.
assert.match(html, /Your information, people, tools and AI in one private operating layer/);
assert.match(html, /Continuum brings your information, people, files, messages, services, automations and AI into one private environment/);
assert.match(html, /BUILT TO OUTLIVE THE MODEL/);
assert.match(html, /A continuous loop from change to useful action/);
assert.match(html, /Maintain knowledge \+ state/);
assert.match(html, /Apply authority \+ policy/);
assert.match(html, /Use available capability/);
assert.match(html, /The intelligence can change while the control layer stays durable/);
assert.match(html, /The capability ceiling can move as technology moves\. Authority still comes from policy\./);
assert.match(html, /Natural language can express intent\. Structured policy controls execution\./);
assert.match(html, /AUTHORITY CAN HAVE A CONTINUITY PLAN TOO/);
assert.match(html, /72 \+ 24 is today's configuration\. You choose these periods\./);

// Check In is the LIVE first-class route, with Spaces and Automations retained as LAB destinations.
assert.match(html, /document-action-primary" href="\/checkin\/"/);
assert.match(html, /href="\/checkin\/"[^>]*><span>Open Check In/);
assert.match(html, /continuum-route-link continuum-route-live" href="\/checkin\/"/);
assert.match(html, /Protected proof of life, timing and activity/);
assert.match(html, /href="\/spaces\/"/);
assert.match(html, /href="\/lab\/automations\/"/);
assert.match(html, /continuum-doc-origin\.css\?v=20260819-2/);
assert.match(html, /continuum-doc-origin\.js\?v=20260819-2/);

// Stable navigation and teaching anchors remain unchanged.
for (const id of ['overview', 'difference', 'spaces', 'action', 'afterlife', 'engineering', 'build', 'status']) {
  assert.match(html, new RegExp(`id="${id}"`), `Missing required section: ${id}`);
}
assert.equal((html.match(/class="document-section continuum-section/g) || []).length, 8);
for (const label of [
  '01 · Overview', '02 · AI + Authority', '03 · Information', '04 · Automations',
  '05 · Continuity', '06 · Architecture', '07 · Build', '08 · Roadmap'
]) assert.match(html, new RegExp(label.replace('+', '\\+')));

// Existing core visuals stay available before the final runtime teaching additions run.
for (const className of [
  'hero-network',
  'continuum-presence',
  'process-map',
  'ai-compare',
  'capability-layer',
  'authority-model',
  'spaces-stage',
  'people-map',
  'library-tree',
  'policy-translation',
  'workflow-nodes',
  'continuity-authority',
  'afterlife-timeline',
  'roadmap-rich'
]) assert.match(html, new RegExp(className), `Missing required visual: ${className}`);

// Base document mechanics remain deterministic and mobile-safe.
assert.match(baseJs, /dataset\.continuumClarity = 'ready'/);
assert.match(baseJs, /IntersectionObserver/);
assert.match(baseJs, /window\.print/);
assert.match(baseJs, /mobileContentsTrigger/);
assert.match(baseJs, /clarity-story-section clarity-story-prose/);
assert.match(baseJs, /clarity-product-map-section/);
assert.match(baseJs, /clarity-deep-dive/);
assert.doesNotMatch(baseJs, /MutationObserver/);
assert.doesNotMatch(baseJs, /setInterval\(/);

// Final alignment layer owns the current architecture, routes and power-clarity additions.
assert.match(finalJs, /dataset\.continuumArchitectureAligned = '20260819'/);
assert.match(finalJs, /dataset\.continuumPowerClarity = '20260819'/);
assert.match(finalJs, /dataset\.continuumCheckInRoute = 'ready'/);
assert.match(finalJs, /continuum-state-strip/);
assert.match(finalJs, /continuum-why-receipt/);
assert.match(finalJs, /continuum-senses-strip/);
assert.match(finalJs, /continuum-model-routing/);
assert.match(finalJs, /continuum-capability-example/);
assert.match(finalJs, /Open the live Check In app/);
assert.match(finalJs, /Start with what is live\. Explore what Continuum is becoming\./);
assert.doesNotMatch(finalJs, /MutationObserver/);
assert.doesNotMatch(finalJs, /setInterval\(/);

// CSS layers preserve light/dark, responsive, route-card and print behavior.
assert.match(baseCss, /html\[data-theme="light"\]/);
assert.match(finalCss, /\.hero-network/);
assert.match(qaCss, /@media\(max-width:680px\)/);
assert.match(qaCss, /@media print/);
assert.match(originCss, /\.continuum-state-strip/);
assert.match(originCss, /\.continuum-senses-strip/);
assert.match(originCss, /\.continuum-model-routing/);
assert.match(originCss, /\.continuum-route-link/);
assert.match(originCss, /\.continuum-checkin-context-link/);
assert.match(originCss, /@media\(max-width:420px\)/);
assert.match(originCss, /@media print/);

// Current public copy avoids the recurring artificial-writing patterns.
for (const source of [html, baseJs, finalJs]) {
  assert.doesNotMatch(source, /\.\.\.|…|—/);
  assert.doesNotMatch(source, /\bit(?:'|’)s not\b/i);
  assert.doesNotMatch(source, /\bnot\b[^<.!?]{0,90}\bbut\b/i);
  assert.doesNotMatch(source, /\brather than\b/i);
}

const docRoute = routes.routes.find((route) => route.path === '/doc/');
assert.ok(docRoute, '/doc/ must remain registered.');
assert.equal(docRoute.status, 'Active');
assert.equal(docRoute.visibility, 'Direct-link-only');
assert.equal(docRoute.gated, false);
assert.equal(docRoute.name, 'Continuum Product & Architecture Overview');

const checkInRoute = routes.routes.find((route) => route.path === '/checkin/');
assert.ok(checkInRoute, '/checkin/ must remain registered as the LIVE product destination linked from /doc/.');

console.log('Continuum base document, Check In routing, architecture, safety and responsive-layer smoke test passed.');