'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const voice = fs.readFileSync(path.join(root, 'assets/continuum-doc-final-voice.js'), 'utf8');
const voiceReadable = voice.replace(/\\'/g, "'");
const loader = fs.readFileSync(path.join(root, 'assets/continuum-doc-i18n.js'), 'utf8');

for (const phrase of [
  "by itself it doesn't reliably remember your life and work",
  'Continuum is the private layer around the AI that keeps those things connected over time.',
  'When something changes, Continuum can update what it knows',
  'The Dead Man Switch is one example of that',
  'From there the flow is simple.',
  'The sections below put the technical names on each part of that flow.',
  'only gives the model the information and tools you have allowed for the job',
  'Documents, files, knowledge and versions live in Library',
  'An Automation is a saved piece of work that can run again or start when something happens.',
  'If Continuum keeps running into the same missing capability',
  'If the same limitation keeps getting in the way',
  'The product map shows how those pieces fit together.',
  'That same setup is useful long before anything goes wrong.',
  "That's where Continuum becomes bigger than the Dead Man Switch.",
  'At the technical level, the browser, backend and database show how a request moves through the app.',
  "dataset.continuumFinalVoice = 'ready'",
  "dataset.continuumVoice = 'natural-v4'"
]) {
  assert.ok(voiceReadable.includes(phrase), `Missing final voice phrase: ${phrase}`);
}

for (const stale of [
  'What it still needs around it is a reliable way to carry your life and work context across time',
  'That basic idea becomes a loop.',
  'An Automation is how Continuum remembers a repeatable or triggered piece of work.',
  'When Continuum keeps reaching the edge of what a connected tool can do, that gap should be visible.',
  'If the same limitation keeps blocking useful work, the product itself may need to grow.',
  'By this point the parts have names.',
  'Once that problem is solved, the same foundation becomes useful every day.',
  'That is the broader Continuum idea.',
  'The browser, backend and database explain how the app runs.'
]) {
  assert.ok(!voiceReadable.includes(stale), `Stale AI-like phrase returned in final voice layer: ${stale}`);
}

for (const pattern of [
  /\.\.\.|…|—/,
  /\bit(?:'|’)s not\b/i,
  /\bnot\b[^<.!?]{0,90}\bbut\b/i,
  /\brather than\b/i,
  /\bdoes not\b|\bcannot\b/i
]) {
  assert.doesNotMatch(voiceReadable, pattern);
}

assert.match(loader, /continuum-doc-final-voice\.js\?v=20260820-1/);
assert.match(loader, /loadFinalVoice/);
assert.match(loader, /dataset\.continuumReaderFirst === 'ready'\) loadFinalVoice\(\)/);

console.log('Continuum final natural-voice polish contract passed.');
