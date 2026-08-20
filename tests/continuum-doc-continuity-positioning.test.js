'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const source = fs.readFileSync(path.join(root, 'assets/continuum-doc-knowledge-time.js'), 'utf8');
const cadence = fs.readFileSync(path.join(root, 'assets/continuum-doc-human-cadence.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'assets/continuum-doc-knowledge-time.css'), 'utf8');
const loader = fs.readFileSync(path.join(root, 'assets/continuum-doc-i18n.js'), 'utf8');

for (const required of [
  'Your information, plans and permissions across time',
  'continue work you have approved while you are away',
  'Knows what changed and when',
  'Can continue work you approved',
  'BUILT TO CARRY YOUR PLAN FORWARD',
  'One place for what matters now, later, and when you cannot respond.',
  'current picture of what is true now',
  'Authority means permission to act.',
  'Describe what should happen, then make the rules clear',
  'long-term continuity path',
  'Silence and urgency never create permission.',
  'AI is one part of a larger system.',
  'Prototype the experience, then connect it to real server data',
  'Make the information layer real, then add long-running execution',
  'Files + OCR / vision',
  'Continuum uses server time and timestamps, so elapsed time comes from a real clock.',
  'You say you are leaving for two minutes and return two seconds later.',
  "dataset.continuumPositioning = 'continuity-first'",
  "dataset.continuumClarity = 'plain-english-v1'"
]) assert.match(source, new RegExp(required.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));

for (const required of [
  'Continuum keeps all of this connected.',
  "when you can't respond",
  "doesn't take the underlying records",
  'The rules stay with Continuum when the AI changes',
  'Library, Directory and Spaces each handle a different part of the same context.',
  'An Automation can keep using version 3 even after you start editing version 4.',
  'Afterlife carries the same Continuum foundation into long-term continuity.',
  "the AI doesn't have to stay open",
  "Changing the model doesn't change the authority",
  'Signals help Continuum notice meaningful changes from approved sources.',
  'A Goal can keep an outcome moving across several steps and changing conditions.',
  "It can't quietly change the limits",
  "Adding a tool doesn't add permission",
  "when you can't take part directly",
  'If the same problem keeps coming up, Continuum may need a new data model or backend feature.',
  'The Control Center gives you one place to see what Continuum is doing in the background.',
  'Afterlife started with a practical question.',
  "dataset.continuumHumanCadence = 'ready'",
  "dataset.continuumVoice = 'natural-v3'"
]) assert.match(cadence, new RegExp(required.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));

for (const staleCadence of [
  'Library holds your information. Directory keeps track of people and relationships.',
  'AI can change. Continuum keeps the rules around it.',
  'Automations handle repeatable rules. Goals keep an outcome alive.',
  'Knowledge keeps useful history. State keeps the current condition.',
  'Continuum keeps those pieces connected:',
  'long-term continuity:',
  'Afterlife began with a practical problem:',
  'durable information and focused context; Automations',
  'does not take the underlying records',
  'AI does not have to stay open',
  'Changing the model does not change the authority',
  'It cannot quietly change the limits',
  'Adding a tool does not add permission',
  'when you cannot take part directly'
]) assert.doesNotMatch(cadence, new RegExp(staleCadence.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));

assert.doesNotMatch(cadence, /\bcan eventually\b/i);
assert.doesNotMatch(cadence, /\bwhile\b/i);

for (const required of [
  '.continuum-continuity-line',
  '.continuum-kt-panel',
  'html[data-theme="dark"] .continuum-continuity-line',
  'body:dir(rtl) .continuum-continuity-line',
  '@media(max-width:680px)',
  '@media(max-width:420px)',
  '@media print'
]) assert.ok(css.includes(required), `Missing continuity positioning style: ${required}`);

assert.match(loader, /continuum-doc-knowledge-time\.js\?v=20260820-1/);
assert.match(loader, /continuum-doc-human-cadence\.js\?v=20260820-3/);
assert.match(loader, /loadHumanCadence/);
assert.match(loader, /script\.async = false/);

for (const checkedSource of [source, cadence]) {
  for (const pattern of [
    /\.\.\.|…|—/,
    /\bit(?:'|’)s not\b/i,
    /\bnot\b[^<.!?]{0,90}\bbut\b/i,
    /\brather than\b/i
  ]) assert.doesNotMatch(checkedSource, pattern);
}

console.log('Continuum plain-English positioning and natural voice contract passed.');
