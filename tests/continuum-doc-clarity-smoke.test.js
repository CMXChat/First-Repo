'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const html = fs.readFileSync(path.join(root, 'doc/index.html'), 'utf8');
const js = fs.readFileSync(path.join(root, 'assets/personal-os-doc.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'assets/continuum-doc-qa.css'), 'utf8');
const humanCss = fs.readFileSync(path.join(root, 'assets/continuum-doc-human.css'), 'utf8');
const contract = fs.readFileSync(path.join(root, 'docs/continuum-product-CURRENT.md'), 'utf8');

// The visible reading path starts with a short, direct promise and then the mental model.
assert.match(js, /dataset\.continuumClarity = 'ready'/);
assert.match(js, /Continuum keeps useful information, people and rules together/);
assert.match(js, /Information, people, rules and AI in one place/);
assert.match(js, /Keeps useful history/);
assert.match(js, /Links people \+ information/);
assert.match(js, /Runs approved rules/);
assert.doesNotMatch(js, /Start with the five-step loop below/);

// One ordinary story bridges the operating loop into the product vocabulary.
assert.match(js, /clarity-story-section/);
assert.match(js, /Follow one update through Continuum/);
assert.match(js, /The message arrives/);
assert.match(js, /Match it to the client/);
assert.match(js, /Show the change in Business/);
assert.match(js, /Keep the workflow running/);

// Product names follow the concepts and use plain labels.
assert.match(js, /clarity-product-map-section/);
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

// Current capability truth moves earlier; Check In-specific timing moves into Afterlife.
assert.match(js, /Current status/);
assert.match(js, /processMap\.after\(makeStatusSnapshot\(statusKey\)\)/);
assert.match(js, /afterlifeCallout\.before\(glance\)/);

// Automation definition and Runtime execution stay visibly distinct.
assert.match(js, /clarity-automation-primer/);
assert.match(js, /Automations define the steps\. Runtime runs them\./);
assert.match(js, /<strong>The plan<\/strong>/);
assert.match(js, /<strong>The execution<\/strong>/);
assert.match(js, /WHEN/);
assert.match(js, /REVIEW/);

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

// Copy should stay free of the recurring artificial-writing patterns.
for (const source of [html, js]) {
  assert.doesNotMatch(source, /\.\.\.|…|—/);
  assert.doesNotMatch(source, /Why not just use AI by itself/i);
  assert.doesNotMatch(source, /An ordinary day, not an emergency/i);
  assert.doesNotMatch(source, /\bit(?:'|’)s not\b/i);
  assert.doesNotMatch(source, /\bnot\b[^<.!?]{0,90}\bbut\b/i);
  assert.doesNotMatch(source, /\brather than\b/i);
}
assert.match(js, /What Continuum adds to AI/);
assert.match(js, /AI authority is set by server-side permissions/);

// CSS supports the teaching hierarchy and a restrained heading scale on desktop and phone.
for (const selector of [
  '.clarity-hero',
  '.clarity-status-frame',
  '.clarity-story-section',
  '.clarity-story-flow',
  '.clarity-product-map-section',
  '.clarity-concept',
  '.clarity-automation-primer',
  '.clarity-builder-sentence',
  '.clarity-automation-split',
  '.clarity-possibilities',
  '.clarity-deep-dive'
]) assert.ok(css.includes(selector), `Missing clarity styling: ${selector}`);
assert.match(css, /@media\(max-width:680px\)/);
assert.match(css, /font-size:max\(\.86rem,14px\)/);
assert.match(css, /@media print/);
assert.match(humanCss, /font-size:clamp\(3rem,5\.4vw,4\.4rem\)/);
assert.match(humanCss, /font-size:clamp\(1\.9rem,3\.15vw,2\.8rem\)/);
assert.match(humanCss, /font-size:clamp\(2\.75rem,14vw,3\.55rem\)/);

// The CURRENT contract stays authoritative for future /doc edits.
assert.match(contract, /Clarity freeze after the teaching-order rebuild/);
assert.match(contract, /concepts before product names/i);
assert.match(contract, /Automation = the plan/);
assert.match(contract, /Runtime = the execution layer/);
assert.match(contract, /Check In-specific timer values do not belong inside this generic loop/);
assert.match(contract, /optional depth in the normal reading path/);

// The clarity transform is deterministic at initialization. Avoid broad mutation loops.
assert.doesNotMatch(js, /MutationObserver/);
assert.doesNotMatch(js, /setInterval\(/);

console.log('Continuum human-copy and teaching-order smoke test passed.');
