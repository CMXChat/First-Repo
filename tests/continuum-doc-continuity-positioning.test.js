'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const source = fs.readFileSync(path.join(root, 'assets/continuum-doc-knowledge-time.js'), 'utf8');
const cadence = fs.readFileSync(path.join(root, 'assets/continuum-doc-human-cadence.js'), 'utf8');
const cadenceReadable = cadence.replace(/\\'/g, "'");
const reader = fs.readFileSync(path.join(root, 'assets/continuum-doc-reader-first.js'), 'utf8');
const readerReadable = reader.replace(/\\'/g, "'");
const css = fs.readFileSync(path.join(root, 'assets/continuum-doc-knowledge-time.css'), 'utf8');
const loader = fs.readFileSync(path.join(root, 'assets/continuum-doc-i18n.js'), 'utf8');

const mustContain = (text, required) => {
  for (const phrase of required) {
    assert.match(text, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
};

mustContain(source, [
  'Your information, plans and permissions across time',
  'continue work you have approved while you are away',
  'BUILT TO CARRY YOUR PLAN FORWARD',
  'current picture of what is true now',
  'Authority means permission to act.',
  'Silence and urgency never create permission.',
  'Files + OCR / vision',
  'Continuum uses server time and timestamps, so elapsed time comes from a real clock.',
  'You say you are leaving for two minutes and return two seconds later.',
  "dataset.continuumPositioning = 'continuity-first'",
  "dataset.continuumClarity = 'plain-english-v1'"
]);

mustContain(cadenceReadable, [
  'Continuum keeps all of this connected.',
  "when you can't respond",
  "doesn't take the underlying records",
  'The rules stay with Continuum when the AI changes',
  'Library, Directory and Spaces each handle a different part of the same context.',
  'An Automation can keep using version 3 even after you start editing version 4.',
  'Afterlife carries the same Continuum foundation into long-term continuity.',
  "the AI doesn't have to stay open",
  "Changing the model doesn't change the authority",
  "It can't quietly change the limits",
  "Adding a tool doesn't add permission",
  "when you can't take part directly",
  'If the same problem keeps coming up, Continuum may need a new data model or backend feature.',
  'The Control Center gives you one place to see what Continuum is doing in the background.',
  'Afterlife started with a practical question.',
  "dataset.continuumHumanCadence = 'ready'",
  "dataset.continuumVoice = 'natural-v3'"
]);

mustContain(readerReadable, [
  'Think of AI as the brain and Continuum as the nervous system around it',
  'An AI model can reason, write and help make decisions.',
  'carry your life and work context across time',
  'Continuum is that private layer.',
  'That might mean acting, waiting, asking you, contacting someone or doing nothing.',
  'The Dead Man Switch is one example',
  "when you're asleep, busy or offline",
  'If you switch to a better AI later',
  'Carries context across time',
  'Keeps up with real changes',
  'Works inside rules you set',
  'You can change the AI without losing the memory, permissions and history Continuum keeps.',
  '02 · AI + Permissions',
  'From something changing to the next allowed step',
  'The pieces below give those jobs their technical names.',
  'That picture is called State',
  'AI works inside the context and permissions Continuum keeps',
  'Keep information connected to the people and situations it belongs to',
  'Continuum can notice when an approved source changes.',
  'Describe the work normally, then make the important rules clear',
  'An Automation is how Continuum remembers a repeatable or triggered piece of work.',
  'Runtime lets approved work continue after you leave.',
  'Changes can move the work forward.',
  'When one outcome takes several steps, a Goal gives Continuum something larger to work toward.',
  'Continuum grew out of a simple continuity problem.',
  'How Continuum is put together',
  'Start in the Lab, then connect the real backend',
  'Make private information durable, then let approved work keep going',
  "dataset.continuumReaderFirst = 'ready'",
  "dataset.continuumProductStory = 'balanced-v2'"
]);

for (const stale of [
  'Your information, workflows and goals across time',
  'A private system for what matters now and what should happen next',
  'Continuum is a private system for keeping the parts of your life and work that matter connected over time.',
  'Library holds your information. Directory keeps track of people and relationships.',
  'AI can change. Continuum keeps the rules around it.',
  'Automations handle repeatable rules. Goals keep an outcome alive.',
  'An Automation is a saved workflow with something that starts it, conditions to check and rules for what it may do.',
  'Runtime keeps published work alive in the background after you close the app.',
  'A Goal is for something you want Continuum to work toward over several steps, even when the route changes.'
]) {
  assert.doesNotMatch(readerReadable, new RegExp(stale.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
}

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
]) {
  assert.doesNotMatch(cadenceReadable, new RegExp(staleCadence.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
}

assert.doesNotMatch(cadenceReadable, /\bcan eventually\b/i);
assert.doesNotMatch(readerReadable, /\bcan eventually\b/i);
assert.doesNotMatch(readerReadable, /\bdoes not\b|\bcannot\b/i);
assert.ok((readerReadable.match(/\bwhile\b/gi) || []).length <= 2, 'Reader layer is overusing while constructions.');

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
assert.match(loader, /continuum-doc-reader-first\.js\?v=20260820-4/);
assert.match(loader, /loadHumanCadence/);
assert.match(loader, /loadReaderFirst/);
assert.match(loader, /script\.async = false/);

for (const checkedSource of [source, cadenceReadable, readerReadable]) {
  for (const pattern of [
    /\.\.\.|…|—/,
    /\bit(?:'|’)s not\b/i,
    /\bnot\b[^<.!?]{0,90}\bbut\b/i,
    /\brather than\b/i
  ]) assert.doesNotMatch(checkedSource, pattern);
}

console.log('Continuum one-minute explanation, natural voice and reader-first terminology contract passed.');
