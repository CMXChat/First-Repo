'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const html = fs.readFileSync(path.join(root, 'doc/index.html'), 'utf8');
const baseJs = fs.readFileSync(path.join(root, 'assets/personal-os-doc.js'), 'utf8');
const finalJs = fs.readFileSync(path.join(root, 'assets/continuum-doc-origin.js'), 'utf8');
const qaCss = fs.readFileSync(path.join(root, 'assets/continuum-doc-qa.css'), 'utf8');
const humanCss = fs.readFileSync(path.join(root, 'assets/continuum-doc-human.css'), 'utf8');
const finalCss = fs.readFileSync(path.join(root, 'assets/continuum-doc-origin.css'), 'utf8');
const contract = fs.readFileSync(path.join(root, 'docs/continuum-product-CURRENT.md'), 'utf8');

// The document keeps the stable eight-section reading path and the modern architecture frame.
for (const anchor of ['overview', 'difference', 'spaces', 'action', 'afterlife', 'engineering', 'build', 'status']) {
  assert.match(html, new RegExp(`id="${anchor}"`));
}
assert.match(html, /BUILT TO OUTLIVE THE MODEL/);
assert.match(html, /Knowledge, authority, rules and AI in one private layer/);
assert.match(html, /The capability ceiling can move as technology moves/);
assert.match(html, /Natural language can express intent\. Structured policy controls execution\./);

// The final one-time pass owns rendered architecture wording after the older clarity transform.
assert.match(finalJs, /dataset\.continuumArchitectureAligned = '20260819'/);
assert.match(finalJs, /dataset\.continuumPowerClarity = '20260819'/);
assert.match(finalJs, /dataset\.continuumGoals = 'ready'/);
assert.match(finalJs, /dataset\.continuumControlCenter = 'ready'/);
assert.match(finalJs, /AI provides reasoning\. Continuum gives that reasoning memory, live state, senses, tools, rules and continuity\./);
assert.match(finalJs, /A durable operating layer for changing intelligence and expanding capability\./);

// State is tangible instead of remaining an abstract architecture word.
assert.match(finalJs, /continuum-state-strip/);
for (const state of [
  'Waiting for reply',
  'Approval pending',
  'Deadline tomorrow',
  'Connection unavailable',
  'Payment received',
  'Incident active'
]) assert.match(finalJs, new RegExp(state));
assert.match(finalJs, /Knowledge keeps useful history\. State keeps the current condition/);
assert.match(finalJs, /Keeps durable knowledge, operational State, policy, incidents, authority and future Runtime records\./);

// The real-world example demonstrates a process surviving time, replies and a closed app.
assert.match(baseJs, /clarity-story-section clarity-story-prose/);
assert.match(finalJs, /What it feels like when Continuum keeps work moving/);
assert.match(finalJs, /A website migration is due Friday and server access is still missing/);
assert.match(finalJs, /Runtime can later wait on the server after the app is closed/);
assert.match(finalJs, /Access missing/);
assert.match(finalJs, /Policy checked/);
assert.match(finalJs, /Reply/);
assert.match(finalJs, /Continue/);

// Audit becomes a visible product explanation.
assert.match(finalJs, /continuum-why-receipt/);
assert.match(finalJs, /WHY DID CONTINUUM DO THAT\?/);
for (const label of ['Trigger', 'State', 'Policy', 'Authority', 'Capability', 'Result']) {
  assert.match(finalJs, new RegExp(`<b>${label}<\\/b>`));
}

// Sources and Signals are presented as the future sensing layer.
assert.match(finalJs, /continuum-senses-strip/);
assert.match(finalJs, /Signals are how Continuum can notice that the world changed/);
assert.match(finalJs, /Source<\/b><i>→<\/i><b>Observation<\/b><i>→<\/i><b>Signal<\/b><i>→<\/i><b>State/);
assert.match(finalJs, /LATER · SIGNALS \+ STATE/);
assert.match(finalJs, /SIGNAL<\/span><i>→<\/i><span>STATE<\/span><i>→<\/i><span>POLICY<\/span><i>→<\/i><span>AUTHORITY/);
assert.match(finalJs, /Evidence changes understanding\. Published authority controls execution\./);

// Model routing keeps model, provider, capability and policy limitations distinct.
assert.match(finalJs, /continuum-model-routing/);
assert.match(finalJs, /Different approved intelligence can fit different jobs/);
for (const boundary of ['Model', 'Provider', 'Capability', 'Policy']) {
  assert.match(finalJs, new RegExp(`<b>${boundary}<\\/b>`));
}
assert.match(finalJs, /Authority stays fixed unless policy changes\./);

// Goals/Missions sit above ordinary Automations and preserve explicit success/stop boundaries.
assert.match(finalJs, /continuum-goal-note/);
assert.match(finalJs, /LATER · GOALS \/ MISSIONS/);
assert.match(finalJs, /Automations handle rules\. Goals let Continuum pursue an outcome\./);
assert.match(finalJs, /GOAL<\/span><i>→<\/i><span>PLAN<\/span><i>→<\/i><span>ACT<\/span><i>→<\/i><span>OBSERVE<\/span><i>→<\/i><span>REPLAN/);
assert.match(finalJs, /Help an authorized person pursue a suitable job within 60 days/);
assert.match(finalJs, /Replanning can change strategy\. It cannot silently change hard constraints, success criteria or authority\./);

// Capability growth includes a safe improvement path instead of hidden self-rewrite language.
assert.match(finalJs, /LATER · LIVE CAPABILITY/);
assert.match(finalJs, /DISCOVER/);
assert.match(finalJs, /SIMULATE/);
assert.match(finalJs, /Continuum can notice how its environment could become more capable/);
assert.match(finalJs, /A workflow keeps stopping because deployment access is missing/);
assert.match(finalJs, /Capability growth and permission growth stay separate\./);
assert.match(finalJs, /Software, APIs, MCP servers, infrastructure, financial systems, operating systems, vehicles, wearables, smart devices and future technology/);

// Continuity explains ordinary unavailability and serious continuity events under the same prepared authority rule.
assert.match(finalJs, /asleep, on a flight, in a meeting, offline, unreachable before a deadline or in a serious continuity event/);
assert.match(finalJs, /The applicable fallback path still comes from authority established beforehand\./);
assert.match(finalJs, /The idea started with the Dead Man Switch/);

// Planner remains typed, reviewable and separate from executable authority.
assert.match(finalJs, /LATER · PLANNER/);
assert.match(finalJs, /INTENT/);
assert.match(finalJs, /CHANGE PLAN/);
assert.match(finalJs, /PREFLIGHT/);
assert.match(finalJs, /REVIEW/);
assert.match(finalJs, /Executable capability and authority remain protected server decisions\./);

// Control Center keeps background work inspectable and exposes Pause Autonomy + Simulation without claiming they exist today.
assert.match(finalJs, /continuum-control-center-note/);
assert.match(finalJs, /LATER · CONTROL CENTER/);
assert.match(finalJs, /Continuum should stay inspectable even when work keeps moving in the background\./);
for (const view of ['NOW', 'WAITING', 'UPCOMING', 'HISTORY']) assert.match(finalJs, new RegExp(view));
assert.match(finalJs, /Pause Autonomy/);
assert.match(finalJs, /Block new autonomous consequential Actions while approved observation, State maintenance, drafting and briefings can continue\./);
assert.match(finalJs, /Simulation/);
assert.match(finalJs, /without performing real side effects/);

// New compact visuals have desktop, dark-mode, phone and print coverage.
for (const selector of [
  '.continuum-state-strip',
  '.continuum-state-chips',
  '.continuum-why-receipt',
  '.continuum-receipt-grid',
  '.continuum-senses-strip',
  '.continuum-model-routing',
  '.continuum-boundary-grid',
  '.continuum-capability-example',
  '.continuum-forward-note'
]) assert.ok(finalCss.includes(selector), `Missing power-clarity styling: ${selector}`);
assert.match(finalCss, /@media\(max-width:900px\)/);
assert.match(finalCss, /@media\(max-width:680px\)/);
assert.match(finalCss, /@media\(max-width:420px\)/);
assert.match(finalCss, /html\[data-theme="dark"\]/);
assert.match(finalCss, /@media print/);

// Existing readability and product-map safeguards remain in place.
assert.match(qaCss, /\.clarity-product-map-section/);
assert.match(qaCss, /@media\(max-width:680px\)/);
assert.match(humanCss, /clarity-story-copy/);
assert.match(humanCss, /clarity-story-path/);
assert.match(humanCss, /clarity-product-map-section \.hero-network/);

// Copy follows the current writing contract.
for (const source of [html, baseJs, finalJs]) {
  assert.doesNotMatch(source, /\.\.\.|…|—/);
  assert.doesNotMatch(source, /\bit(?:'|’)s not\b/i);
  assert.doesNotMatch(source, /\bnot\b[^<.!?]{0,90}\bbut\b/i);
  assert.doesNotMatch(source, /\brather than\b/i);
}

// The CURRENT contract records the same public teaching decisions.
assert.match(contract, /Knowledge \+ State \+ Authority \+ Policy \+ Audit/);
assert.match(contract, /The capability ceiling can move/);
assert.match(contract, /Signals \+ State note/);
assert.match(contract, /Live capability extension lesson/);
assert.match(contract, /Pause Autonomy \/ Control Center direction/);
assert.match(contract, /final one-time architecture and power-clarity alignment layer/);

// Initialization stays deterministic. No broad document mutation or hidden network behavior is introduced.
for (const source of [baseJs, finalJs]) {
  assert.doesNotMatch(source, /MutationObserver/);
  assert.doesNotMatch(source, /setInterval\(/);
}
for (const forbidden of ['fetch(', 'XMLHttpRequest', 'WebSocket(', 'EventSource(', 'eval(', 'new Function(']) {
  assert.doesNotMatch(finalJs, new RegExp(forbidden.replace('(', '\\(')));
}

console.log('Continuum /doc power, adaptability, Goals, State, Signals, Runtime, Control Center and authority clarity smoke passed.');