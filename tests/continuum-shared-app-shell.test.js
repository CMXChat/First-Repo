'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');

const control = fs.readFileSync('control/index.html', 'utf8');
const controlInit = fs.readFileSync('assets/lab/control-center-theme-init.js', 'utf8');
const directory = fs.readFileSync('directory/index.html', 'utf8');
const directoryInit = fs.readFileSync('assets/lab/directory-theme-init.js', 'utf8');
const libraryInit = fs.readFileSync('assets/lab/library-theme-init.js', 'utf8');
const automations = fs.readFileSync('assets/lab/lab-automations-operations-v7-polish.js', 'utf8');
const contract = fs.readFileSync('docs/continuum-shared-app-shell-CURRENT.md', 'utf8');

assert.match(control, /href="\/checkin\/"/);
assert.match(control, /href="\/spaces\/"/);
for (const pair of [
  ["'/lab/control/'", "'/control/'"],
  ["'/lab/automations/'", "'/automations/'"],
  ["'/lab/directory/'", "'/directory/'"],
  ["'/lab/library/'", "'/library/'"],
]) assert.ok(controlInit.includes(pair[0]) && controlInit.includes(pair[1]), `Control route convergence missing ${pair.join(' → ')}`);

assert.match(directory, /href="\/directory\/" aria-current="page"/);
assert.match(directory, /href="\/checkin\/"/);
assert.match(directory, /href="\/spaces\/"/);
assert.ok(directoryInit.includes("['/lab/control/', '/control/']"));
assert.ok(directoryInit.includes("['/lab/automations/', '/automations/']"));
assert.ok(libraryInit.includes("['/lab/library/', '/library/']"));

assert.match(automations, /brand\.href = "\/control\/"/);
assert.match(automations, /PROVING · AUTOMATIONS/);
assert.match(automations, /Back to Continuum Control Center/);

assert.match(contract, /The shared shell owns:/);
assert.match(contract, /Each domain owns its own workspace/);
assert.match(contract, /\/control\//);
assert.match(contract, /\/automations\//);
assert.match(contract, /\/directory\//);
assert.match(contract, /\/library\//);
assert.match(contract, /\/connections\//);
assert.match(contract, /Check In protection/);
assert.match(contract, /must not flatten these experiences into identical cards/i);
assert.match(contract, /background becomes inert while a modal surface is open/i);
assert.match(contract, /does not mean every domain must visually inherit the Control Center layout/i);

console.log('Continuum shared app shell canonical navigation and separation contract passed.');
