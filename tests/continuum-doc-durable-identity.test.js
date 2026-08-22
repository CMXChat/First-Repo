'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const source = fs.readFileSync(path.join(root, 'assets/continuum-doc-durable-identity.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'assets/continuum-doc-durable-identity.css'), 'utf8');
const loader = fs.readFileSync(path.join(root, 'assets/continuum-doc-i18n.js'), 'utf8');
const positioning = fs.readFileSync(path.join(root, 'docs/continuum-doc-positioning-CURRENT.md'), 'utf8');
const product = fs.readFileSync(path.join(root, 'docs/continuum-durable-identity-CURRENT.md'), 'utf8');

const mustContain = (text, phrases) => {
  for (const phrase of phrases) assert.ok(text.includes(phrase), `Missing AI continuity contract phrase: ${phrase}`);
};

mustContain(source, [
  'AI CONTINUITY · LATER',
  'Keep a consistent AI identity and way of working even when the model changes.',
  'versioned identity for an AI',
  'selected long-term memories and learned ways of working',
  'A compatible model can load that identity in a new context instead of starting from zero.',
  'learn from corrections and real outcomes so recommendations improve over time',
  'what changed, what it is waiting on and what needs attention next',
  'Identity can shape judgment, strategy and communication.',
  'The server still controls facts, AI participation, permissions and authority.',
  "dataset.continuumDurableIdentity = 'ready'",
  "dataset.continuumIdentityPortability = 'model-agnostic-v1'",
  "dataset.continuumAiContinuity = 'grounded-v2'"
]);

mustContain(loader, [
  'loadDurableIdentity',
  '/assets/continuum-doc-durable-identity.js?v=20260821-2',
  "dataset.continuumDurableIdentity = 'loader'",
  "dataset.continuumFinalVoice === 'ready'"
]);

mustContain(positioning, [
  'AI continuity across compatible model changes',
  'The AI continuity explanation belongs inside **AI + Permissions**',
  'identity still cannot create facts, AI participation, permissions or authority',
  'data-continuum-durable-identity="ready"'
]);

mustContain(product, [
  'Durable means the canonical identity belongs to Continuum',
  'A compatible model can then load that identity in a new context rather than starting from zero.',
  'That makes identity more meaningful than a cosmetic voice preset.',
  'The protected backend still decides what is actually allowed.',
  'AI continuity',
  'learn from corrections and real outcomes'
]);

for (const privateProjectName of ['Lorraine', 'Echo', 'Shapes']) {
  assert.doesNotMatch(source, new RegExp(privateProjectName, 'i'), `Private project history leaked into public /doc layer: ${privateProjectName}`);
}

for (const requiredStyle of [
  '.continuum-durable-identity-note',
  '.continuum-durable-identity-kicker',
  '.continuum-ai-continuity-grounding',
  '@media (max-width: 680px)',
  '@media print'
]) assert.ok(css.includes(requiredStyle), `Missing AI continuity style: ${requiredStyle}`);

assert.doesNotMatch(source, /sentient|consciousness|soul|self-aware|recursive self/i);

console.log('Continuum grounded AI continuity product and loader contract passed.');
