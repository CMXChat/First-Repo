'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const source = fs.readFileSync(path.join(root, 'assets/continuum-doc-knowledge-time.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'assets/continuum-doc-knowledge-time.css'), 'utf8');
const loader = fs.readFileSync(path.join(root, 'assets/continuum-doc-i18n.js'), 'utf8');

for (const required of [
  'Your information, plans and permissions across time',
  'continue work you have approved while you are away',
  'Library holds your information. Directory keeps track of people and relationships.',
  'Knows what changed and when',
  'Can continue work you approved',
  'BUILT TO CARRY YOUR PLAN FORWARD',
  'One place for what matters now, later, and when you cannot respond.',
  "State is Continuum's current picture of what is true now.",
  'AI can change. Continuum keeps the rules around it.',
  'Authority means permission to act.',
  'Library keeps documents, files, knowledge and version history.',
  'An Automation can keep using version 3 even while you are editing version 4.',
  'Describe what should happen, then make the rules clear',
  "Afterlife is Continuum's long-term continuity path.",
  'Silence and urgency never create permission.',
  'AI is one part of a larger system.',
  'Prototype the experience, then connect it to real server data',
  'Make the information layer real, then add long-running execution',
  'Give Continuum text, Markdown, JSON, an AI handoff, a document or an image.',
  'Files + OCR / vision',
  'Continuum uses server time and timestamps, so elapsed time comes from a real clock.',
  'You say you are leaving for two minutes and return two seconds later.',
  "dataset.continuumPositioning = 'continuity-first'",
  "dataset.continuumClarity = 'plain-english-v1'"
]) assert.match(source, new RegExp(required.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));

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
assert.match(loader, /script\.async = false/);

for (const pattern of [
  /\.\.\.|…|—/,
  /\bit(?:'|’)s not\b/i,
  /\bnot\b[^<.!?]{0,90}\bbut\b/i,
  /\brather than\b/i
]) assert.doesNotMatch(source, pattern);

console.log('Continuum plain-English continuity positioning contract passed.');
