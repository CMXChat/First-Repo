'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');

const control = fs.readFileSync('lab/control/index.html', 'utf8');
const controlInit = fs.readFileSync('assets/lab/control-center-theme-init.js', 'utf8');
const directory = fs.readFileSync('lab/directory/index.html', 'utf8');
const automations = fs.readFileSync('assets/lab/lab-automations-operations-v7-polish.js', 'utf8');
const contract = fs.readFileSync('docs/continuum-shared-app-shell-CURRENT.md', 'utf8');

assert.match(control, /href="\/lab\/control\/" aria-current="page"/);
assert.match(control, /href="\/checkin\/"/);
assert.match(control, /href="\/lab\/automations\/"/);
assert.match(control, /href="\/spaces\/"/);
assert.match(controlInit, /\/lab\/directory\//);
assert.match(controlInit, /patchDirectoryRoutes/);

assert.match(directory, /href="\/lab\/control\/"/);
assert.match(directory, /href="\/lab\/directory\/" aria-current="page"/);
assert.match(directory, /href="\/checkin\/"/);
assert.match(directory, /href="\/lab\/automations\/"/);
assert.match(directory, /href="\/spaces\/"/);

assert.match(automations, /brand\.href = "\/lab\/control\/"/);
assert.match(automations, /Back to Continuum Control Center/);

assert.match(contract, /The shared shell owns:/);
assert.match(contract, /Each domain owns its own workspace/);
assert.match(contract, /\/control\//);
assert.match(contract, /\/automations\//);
assert.match(contract, /\/directory\//);
assert.match(contract, /\/library\//);
assert.match(contract, /\/connections\//);
assert.match(contract, /\/lab\/directory\/.*standalone Directory prototype/);
assert.match(contract, /Check In protection/);
assert.match(contract, /must not flatten these experiences into identical cards/i);
assert.match(contract, /background becomes inert while a modal surface is open/i);
assert.match(contract, /does not mean every domain must visually inherit the Control Center layout/i);

console.log('Continuum shared app shell navigation, standalone Directory and separation contract passed.');
