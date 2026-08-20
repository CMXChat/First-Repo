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
  'Continuum keeps those pieces connected:',
  'The rules stay with Continuum when the AI changes',
  'Continuum keeps documents, people and current context connected across Library, Directory and Spaces.',
  'An Automation can continue using version 3 while you are already editing version 4.',
  'Afterlife extends the same Continuum foundation into long-term continuity:',
  'Signals help Continuum notice meaningful changes from approved sources.',
  'Goals can keep an outcome moving across multiple steps and changing conditions.',
  'The Control Center keeps background work visible and inspectable.',
  "dataset.continuumHumanCadence = 'ready'"
]) assert.match(cadence, new RegExp(required.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));

for (const staleCadence of [
  'Library holds your information. Directory keeps track of people and relationships.',
  'AI can change. Continuum keeps the rules around it.',
  'Automations handle repeatable rules. Goals keep an outcome alive.',
  'Knowledge keeps useful history. State keeps the current condition.'
]) assert.doesNotMatch(cadence, new RegExp(staleCadence.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));

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
assert.match(loader, /continuum-doc-human-cadence\.js\?v=20260820-1/);
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

console.log('Continuum plain-English positioning and human cadence contract passed.');
