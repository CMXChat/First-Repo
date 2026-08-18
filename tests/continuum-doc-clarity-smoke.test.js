'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const js = fs.readFileSync(path.join(root, 'assets/personal-os-doc.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'assets/continuum-doc-qa.css'), 'utf8');
const contract = fs.readFileSync(path.join(root, 'docs/continuum-product-CURRENT.md'), 'utf8');

// The visible reading path must start with a short promise and then teach the mental model.
assert.match(js, /dataset\.continuumClarity = 'ready'/);
assert.match(js, /Continuum keeps useful context in one private place/);
assert.match(js, /Start with the five-step loop below/);
assert.match(js, /Remembers context/);
assert.match(js, /Connects the pieces/);
assert.match(js, /Follows your rules/);

// One ordinary story must bridge the operating loop into the product vocabulary.
assert.match(js, /clarity-story-section/);
assert.match(js, /Follow one update through Continuum/);
assert.match(js, /The message arrives/);
assert.match(js, /Continuum knows who sent it/);
assert.match(js, /Your Business view can reflect it/);
assert.match(js, /The server can keep it moving/);

// Product names are introduced after concepts, not dumped into the hero.
assert.match(js, /clarity-product-map-section/);
assert.match(js, /The product names follow the simple idea/);
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
assert.match(js, /Current product truth/);
assert.match(js, /processMap\.after\(makeStatusSnapshot\(statusKey\)\)/);
assert.match(js, /afterlifeCallout\.before\(glance\)/);

// Automation definition and Runtime execution must stay visibly distinct.
assert.match(js, /clarity-automation-primer/);
assert.match(js, /Automations define the plan\. Runtime carries it through\./);
assert.match(js, /<strong>The plan<\/strong>/);
assert.match(js, /<strong>The execution<\/strong>/);
assert.match(js, /WHEN/);
assert.match(js, /REVIEW/);

// Technical and speculative depth stays available without blocking the primary lesson.
assert.match(js, /clarity-possibilities/);
assert.match(js, /clarity-deep-dive/);
assert.match(js, /Optional architecture/);
assert.match(js, /Optional build process/);
assert.match(js, /Open the architecture walkthrough/);
assert.match(js, /Open the build workflow/);

// Navigation is concise and stable.
for (const label of [
  '01 · Overview', '02 · AI', '03 · Information', '04 · Automations',
  '05 · Afterlife', '06 · Architecture', '07 · Build', '08 · Roadmap'
]) assert.match(js, new RegExp(label.replace('·', '·')));

// CSS must support the new teaching hierarchy on desktop and phone.
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

// The new CURRENT contract is the authority for future /doc edits.
assert.match(contract, /Clarity freeze after the teaching-order rebuild/);
assert.match(contract, /concepts before product names/i);
assert.match(contract, /Automation = the plan/);
assert.match(contract, /Runtime = the execution layer/);
assert.match(contract, /Check In-specific timer values do not belong inside this generic loop/);
assert.match(contract, /optional depth in the normal reading path/);
assert.match(contract, /does \*\*not\*\* authorize backend schema changes/);

// The clarity transform is deterministic at initialization. Avoid a broad mutation loop.
assert.doesNotMatch(js, /MutationObserver/);
assert.doesNotMatch(js, /setInterval\(/);

console.log('Continuum clarity teaching-order smoke test passed.');
