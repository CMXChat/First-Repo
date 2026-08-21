'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const loader = fs.readFileSync(path.join(root, 'assets/continuum-doc-i18n.js'), 'utf8');
const layer = fs.readFileSync(path.join(root, 'assets/continuum-doc-knowledge-time.js'), 'utf8');
const topRoutes = fs.readFileSync(path.join(root, 'assets/continuum-doc-top-routes.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'assets/continuum-doc-knowledge-time.css'), 'utf8');
const contract = fs.readFileSync(path.join(root, 'docs/continuum-knowledge-time-CURRENT.md'), 'utf8');

assert.match(loader, /continuum-doc-knowledge-time\.js\?v=20260820-1/);
assert.match(loader, /continuum-doc-top-routes\.js\?v=20260819-1/);
assert.match(layer, /BRING INFORMATION IN/);
assert.match(layer, /Paste \+ bulk text/);
assert.match(layer, /Markdown \+ JSON/);
assert.match(layer, /AI handoffs/);
assert.match(layer, /Files \+ OCR \/ vision/);
assert.match(layer, /CAPTURE/);
assert.match(layer, /UNDERSTAND/);
assert.match(layer, /REVIEW/);
assert.match(layer, /INTEGRATE/);
assert.match(layer, /New information starts private/);
assert.match(layer, /REAL CLOCK/);
assert.match(layer, /roughly two seconds passed/);
assert.match(layer, /Something can become due, overdue or stale/);
assert.match(layer, /Check In already uses server-owned elapsed timing/);
assert.match(layer, /dataset\.continuumKnowledgeTime = 'ready'/);

assert.match(topRoutes, /href = '\/lab\/automations\/'/);
assert.match(topRoutes, /Automation Lab/);
assert.match(topRoutes, /continuum-inline-status">LAB/);
assert.match(topRoutes, /dataset\.continuumTopRoutes = 'ready'/);

for (const selector of ['.continuum-kt-panel', '.continuum-kt-source-grid', '.continuum-kt-flow', '.continuum-kt-clock-grid']) {
  assert.ok(css.includes(selector), `Missing knowledge/time style: ${selector}`);
}
assert.match(css, /html\[data-theme="dark"\]/);
assert.match(css, /@media\(max-width:680px\)/);
assert.match(css, /@media\(max-width:420px\)/);
assert.match(css, /overflow-wrap:anywhere/);

assert.match(contract, /review-first/i);
assert.match(contract, /Standard/);
assert.match(contract, /Sensitive/);
assert.match(contract, /Local-only/);
assert.match(contract, /Never AI/);
assert.match(contract, /OCR \/ vision/);
assert.match(contract, /real backend clock/i);

for (const source of [layer, topRoutes, contract]) {
  assert.doesNotMatch(source, /\.\.\.|…|—/);
  assert.doesNotMatch(source, /\brather than\b/i);
}
