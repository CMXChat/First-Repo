'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const html = fs.readFileSync(path.join(root, 'doc/index.html'), 'utf8');
const qaCss = fs.readFileSync(path.join(root, 'assets/continuum-doc-qa.css'), 'utf8');
const humanCss = fs.readFileSync(path.join(root, 'assets/continuum-doc-human.css'), 'utf8');
const originCss = fs.readFileSync(path.join(root, 'assets/continuum-doc-origin.css'), 'utf8');
const i18nCss = fs.readFileSync(path.join(root, 'assets/continuum-doc-i18n.css'), 'utf8');

const promiseIndex = html.indexOf('/assets/continuum-doc-promise.css?v=20260818-2');
const qaIndex = html.indexOf('/assets/continuum-doc-qa.css?v=20260818-1');
const humanIndex = html.indexOf('/assets/continuum-doc-human.css?v=20260818-2');
const originIndex = html.indexOf('/assets/continuum-doc-origin.css?v=20260819-3');
const capabilityIndex = html.indexOf('/assets/continuum-doc-capability.css?v=20260819-1');
const i18nIndex = html.indexOf('/assets/continuum-doc-i18n.css?v=20260819-1');
assert.ok(promiseIndex >= 0, 'Promise stylesheet must remain loaded.');
assert.ok(qaIndex > promiseIndex, 'Visual QA stylesheet must load after the main Continuum styles.');
assert.ok(humanIndex > qaIndex, 'Human-scale typography must load after the broad QA layer.');
assert.ok(originIndex > humanIndex, 'The scoped final prose/route layer must load after the general typography layer.');
assert.ok(capabilityIndex > originIndex, 'Capability styling must remain after the final prose/route layer.');
assert.ok(i18nIndex > capabilityIndex, 'RTL compatibility must load last without reopening the frozen visual system.');

// Light mode must own a complete Afterlife palette at every viewport.
assert.match(qaCss, /html\[data-theme="light"\] \.afterlife-section\{/);
assert.match(qaCss, /html\[data-theme="light"\] \.afterlife-section \.section-heading h2\{color:#0d1b2d\}/);
assert.match(qaCss, /html\[data-theme="light"\] \.afterlife-step>strong\{color:#102038\}/);
assert.match(qaCss, /html\[data-theme="light"\] \.afterlife-step>small\{color:#4f667c\}/);
assert.match(qaCss, /html\[data-theme="light"\] \.afterlife-step\.is-trigger>strong\{color:#6b3905\}/);
assert.match(qaCss, /html\[data-theme="light"\] \.afterlife-step\.is-trigger\{/);
assert.match(qaCss, /background:linear-gradient\(100deg,#fff3e5/);

// Timeline content should stay grouped instead of stretching across tall empty cards.
assert.match(qaCss, /\.afterlife-step\{[\s\S]*min-height:0;[\s\S]*display:grid;/);
assert.match(qaCss, /grid-template-areas:[\s\S]*"label status"[\s\S]*"title status"[\s\S]*"copy status"/);
assert.match(qaCss, /\.afterlife-step>em\{[\s\S]*position:static;/);

// Existing QA trims oversized components and keeps mobile readable.
assert.match(qaCss, /@media\(min-width:981px\)/);
assert.match(qaCss, /\.process-step\{min-height:232px/);
assert.match(qaCss, /\.roadmap-rich \.roadmap-card\{min-height:264px/);
assert.match(qaCss, /@media\(max-width:680px\)/);
assert.match(qaCss, /grid-template-areas:[\s\S]*"label"[\s\S]*"title"[\s\S]*"copy"[\s\S]*"status"/);
assert.match(qaCss, /font-size:max\(\.78rem,13px\)/);

// Final heading scale stays strong without becoming billboard-sized.
assert.match(humanCss, /font-size:clamp\(3rem,5\.4vw,4\.4rem\)/);
assert.match(humanCss, /font-size:clamp\(1\.9rem,3\.15vw,2\.8rem\)/);
assert.match(humanCss, /font-size:clamp\(2\.75rem,14vw,3\.55rem\)/);

// Reading balance keeps prose prominent and reserves the richest map for Parts of Continuum.
assert.match(humanCss, /\.clarity-story-section\.clarity-story-prose/);
assert.match(humanCss, /\.clarity-story-copy/);
assert.match(humanCss, /\.clarity-story-path/);
assert.match(humanCss, /\.clarity-automation-copy/);
assert.match(humanCss, /\.clarity-automation-primer\.clarity-automation-explainer/);
assert.match(humanCss, /\.clarity-product-map-section \.hero-network/);

// The final layer preserves the origin explanation and owns the new route presentation.
assert.match(originCss, /\.continuum-origin-note/);
assert.match(originCss, /max-width:860px/);
assert.match(originCss, /\.continuum-origin-copy p/);
assert.match(originCss, /line-height:1\.72/);
assert.match(originCss, /\.continuum-hero \.hero-lead-second/);
assert.match(originCss, /\.continuum-inline-status/);
assert.match(originCss, /\.continuum-checkin-context-link/);
assert.match(originCss, /\.continuum-product-actions/);
assert.match(originCss, /\.continuum-route-link/);
assert.match(originCss, /\.continuum-route-live/);
assert.match(originCss, /grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/);
assert.match(originCss, /@media\(max-width:900px\)/);
assert.match(originCss, /@media\(max-width:680px\)/);
assert.match(originCss, /@media\(max-width:420px\)/);
assert.match(originCss, /@media print/);

// RTL remains a compatibility layer over the frozen composition.
assert.match(i18nCss, /body:dir\(rtl\)/);
assert.match(i18nCss, /\.document-toc:dir\(rtl\) a/);
assert.match(i18nCss, /\.mobile-contents-drawer/);
assert.match(i18nCss, /content:"←"/);
assert.match(i18nCss, /margin-inline-end:auto/);
assert.doesNotMatch(i18nCss, /@media print\{[\s\S]*direction:ltr/);

// Light-mode supporting text should not regress to washed-out inherited colors.
assert.match(qaCss, /--muted:#4b6278/);
assert.match(qaCss, /--muted-strong:#263f56/);
assert.match(qaCss, /html\[data-theme="light"\] \.status-live/);
assert.match(qaCss, /html\[data-theme="light"\] \.status-later/);

console.log('Continuum visual QA, human-first intro, Check In routes, heading scale, RTL compatibility and prose-balance smoke test passed.');
