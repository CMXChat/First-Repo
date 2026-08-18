'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const html = fs.readFileSync(path.join(root, 'doc/index.html'), 'utf8');
const js = fs.readFileSync(path.join(root, 'assets/personal-os-doc.js'), 'utf8');
const originJs = fs.readFileSync(path.join(root, 'assets/continuum-doc-origin.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'assets/continuum-doc-qa.css'), 'utf8');
const humanCss = fs.readFileSync(path.join(root, 'assets/continuum-doc-human.css'), 'utf8');
const originCss = fs.readFileSync(path.join(root, 'assets/continuum-doc-origin.css'), 'utf8');
const contract = fs.readFileSync(path.join(root, 'docs/continuum-product-CURRENT.md'), 'utf8');

// The visible reading path starts with the fuller plain-language introduction and then the mental model.
assert.match(js, /dataset\.continuumClarity = 'ready'/);
assert.match(js, /Continuum keeps useful context in one private place/);
assert.match(js, /Information, people, rules and AI in one place/);
assert.match(js, /Keeps useful history/);
assert.match(js, /Links people \+ information/);
assert.match(js, /Runs approved rules/);
assert.match(js, /Continuum in one minute/);
assert.doesNotMatch(js, /Start with the five-step loop below/);
assert.doesNotMatch(js, /Start here/);

// The ordinary example is prose-led, with one compact path instead of a six-card diagram.
assert.match(js, /clarity-story-section clarity-story-prose/);
assert.match(js, /What happens when something changes/);
assert.match(js, /A client emails to say a payment was sent/);
assert.match(js, /clarity-story-copy/);
assert.match(js, /clarity-story-path/);
assert.match(js, /Business Space/);
assert.match(js, /Runtime/);
assert.doesNotMatch(js, /clarity-story-flow/);

// Product names follow the concepts and the rich Parts of Continuum map stays intact.
assert.match(js, /clarity-product-map-section/);
assert.match(js, /The parts of Continuum/);
assert.match(js, /How the pieces fit together/);
for (const concept of [
  'PEOPLE',
  'SAVED INFORMATION',
  'FOCUSED VIEWS',
  'RULES + STEPS',
  'OUTSIDE TOOLS',
  'LONG-RUNNING WORK',
  'REASONING'
]) assert.match(js, new RegExp(concept.replace('+', '\\+')));

// The Dead Man Switch origin insight explains why the same foundation matters across time.
assert.match(html, /continuum-doc-origin\.css\?v=20260818-1/);
assert.match(html, /continuum-doc-origin\.js\?v=20260818-1/);
assert.match(originJs, /The idea started with the Dead Man Switch/);
assert.match(originJs, /Afterlife began with a practical problem/);
assert.match(originJs, /The same foundation matters before an emergency/);
assert.match(originJs, /Spaces and AI help while you are here/);
assert.match(originJs, /Automations define work that can continue/);
assert.match(originJs, /Afterlife uses the same foundation when you cannot respond/);
assert.match(originJs, /presence\.before\(origin\)/);
assert.match(originJs, /dataset\.continuumOrigin = 'ready'/);
assert.match(originCss, /\.continuum-origin-note/);
assert.match(originCss, /\.continuum-origin-copy p/);

// Current capability truth stays early, while the detailed four-state key remains with the product map.
assert.match(js, /What works today/);
assert.match(js, /processMap\.after\(makeStatusSnapshot\(\)\)/);
assert.doesNotMatch(js, /makeStatusSnapshot\(statusKey\)/);
assert.match(js, /afterlifeCallout\.before\(glance\)/);

// Automations are explained in words first, with one compact builder sequence.
assert.match(js, /clarity-automation-primer clarity-automation-explainer/);
assert.match(js, /clarity-automation-copy/);
assert.match(js, /Automations define what should happen/);
assert.match(js, /Automations define the steps\. Runtime runs them\./);
assert.match(js, /WHEN/);
assert.match(js, /REVIEW/);
assert.doesNotMatch(js, /<strong>The plan<\/strong>/);
assert.doesNotMatch(js, /<strong>The execution<\/strong>/);

// Technical and speculative depth stays available without crowding the primary lesson.
assert.match(js, /clarity-possibilities/);
assert.match(js, /clarity-deep-dive/);
assert.match(js, /Open the architecture walkthrough/);
assert.match(js, /Open the build workflow/);

// Navigation is concise and stable.
for (const label of [
  '01 · Overview', '02 · AI', '03 · Information', '04 · Automations',
  '05 · Afterlife', '06 · Architecture', '07 · Build', '08 · Roadmap'
]) assert.match(js, new RegExp(label.replace('·', '·')));

// Copy stays free of the recurring artificial-writing patterns.
for (const source of [html, js, originJs]) {
  assert.doesNotMatch(source, /\.\.\.|…|—/);
  assert.doesNotMatch(source, /Why not just use AI by itself/i);
  assert.doesNotMatch(source, /An ordinary day, not an emergency/i);
  assert.doesNotMatch(source, /\bit(?:'|’)s not\b/i);
  assert.doesNotMatch(source, /\bnot\b[^<.!?]{0,90}\bbut\b/i);
  assert.doesNotMatch(source, /\brather than\b/i);
}
assert.match(js, /What Continuum adds to AI/);
assert.match(js, /AI authority is set by server-side permissions/);

// Existing QA safeguards stay loaded; the final human layer owns the calmer prose presentation.
for (const selector of [
  '.clarity-hero',
  '.clarity-status-frame',
  '.clarity-story-section',
  '.clarity-product-map-section',
  '.clarity-concept',
  '.clarity-automation-primer',
  '.clarity-builder-sentence',
  '.clarity-possibilities',
  '.clarity-deep-dive'
]) assert.ok(css.includes(selector), `Missing clarity styling: ${selector}`);
assert.match(css, /@media\(max-width:680px\)/);
assert.match(css, /font-size:max\(\.86rem,14px\)/);
assert.match(css, /@media print/);
assert.match(humanCss, /font-size:clamp\(3rem,5\.4vw,4\.4rem\)/);
assert.match(humanCss, /font-size:clamp\(1\.9rem,3\.15vw,2\.8rem\)/);
assert.match(humanCss, /clarity-story-copy/);
assert.match(humanCss, /clarity-story-path/);
assert.match(humanCss, /clarity-automation-copy/);
assert.match(humanCss, /clarity-product-map-section \.hero-network/);

// The CURRENT contract stays authoritative for future /doc edits.
assert.match(contract, /human-copy rebuild/);
assert.match(contract, /Concepts before product names/i);
assert.match(contract, /Dead Man Switch/);
assert.match(contract, /origin insight/i);
assert.match(contract, /Automation = the plan/);
assert.match(contract, /Runtime = the execution layer/);
assert.match(contract, /Check In-specific timer values belong in the Afterlife section/);
assert.match(contract, /optional depth in the normal reading path/);
assert.match(contract, /AI authority is set by server-side permissions/);
assert.match(contract, /assets\/continuum-doc-human\.css/);
assert.match(contract, /assets\/continuum-doc-origin\.js/);

// The clarity transform is deterministic at initialization. Avoid broad mutation loops.
assert.doesNotMatch(js, /MutationObserver/);
assert.doesNotMatch(js, /setInterval\(/);
assert.doesNotMatch(originJs, /MutationObserver/);
assert.doesNotMatch(originJs, /setInterval\(/);

console.log('Continuum origin insight, prose balance, human-copy and teaching-order smoke test passed.');
