'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const source = fs.readFileSync(path.join(root, 'assets/continuum-doc-knowledge-time.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'assets/continuum-doc-knowledge-time.css'), 'utf8');
const loader = fs.readFileSync(path.join(root, 'assets/continuum-doc-i18n.js'), 'utf8');

for (const required of [
  'Your information, intent and authority across time',
  'preserve the continuity plan you prepared for a time when you can no longer respond',
  'Spaces, Automations, AI, Check In and Afterlife use that same durable foundation',
  'Understands what changed + when',
  'Carries approved intent forward',
  'BUILT TO CARRY INTENT FORWARD',
  'One operating layer across presence, absence and continuity.',
  'Afterlife is the continuity edge of Continuum.',
  'Decide the fallback path while you can still decide it.',
  'Silence and urgency never create authority.',
  'Paste text, hand Continuum an AI export, drop in files or share an image.',
  'Files + OCR / vision',
  'Continuum uses a real clock, so time comes from backend state and timestamps.',
  'You leave for two minutes and return two seconds later.',
  "dataset.continuumPositioning = 'continuity-first'"
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

assert.match(loader, /continuum-doc-knowledge-time\.js\?v=20260819-2/);
assert.match(loader, /script\.async = false/);

for (const pattern of [
  /\.\.\.|…|—/,
  /\bit(?:'|’)s not\b/i,
  /\bnot\b[^<.!?]{0,90}\bbut\b/i,
  /\brather than\b/i
]) assert.doesNotMatch(source, pattern);

console.log('Continuum continuity-first positioning contract passed.');
