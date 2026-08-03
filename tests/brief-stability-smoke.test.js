const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

const config = read('assets/brief/brief-config.js');
const entry = read('assets/brief/brief-entry-radio.js');
const device = read('assets/brief/brief-device.js');
const deviceCss = read('assets/brief/brief-device.css');
const experience = read('assets/brief/brief-experience.js');
const live = read('assets/brief/brief-live.js');
const bridge = read('assets/brief/brief-terminal-bridge.js');
const watch = read('assets/brief/brief-relationship-watch.js');

for (const [name, source] of Object.entries({ config, entry, device, experience, live, bridge, watch })) {
  new vm.Script(source, { filename: `${name}.js` });
}

assert.match(config, /device: '20260803-2'/);
assert.match(config, /entry: '20260803-4'/);
assert.match(config, /live: '20260803-5'/);
assert.match(config, /experience: '20260803-4'/);
assert.match(config, /function forceTop\(\)/);
assert.match(config, /Choose any entry preferences/);

assert.doesNotMatch(entry, /enter\.click\(\)/);
assert.doesNotMatch(entry, /setTimeout\([^\n]*enter/);
assert.match(entry, /Open this briefing/);

assert.match(device, /const root = \$\('#briefApp'\) \|\| document\.body/);
assert.match(device, /mutation\.addedNodes/);
assert.match(device, /requestAnimationFrame/);
assert.match(device, /forceDocumentTop/);
assert.match(deviceCss, /flex-wrap: nowrap !important/);
assert.match(deviceCss, /#themeToggleButton/);
assert.match(deviceCss, /width: 44px !important/);
assert.match(deviceCss, /height: 44px !important/);

assert.doesNotMatch(bridge, /new MutationObserver/);
assert.doesNotMatch(watch, /new MutationObserver/);
assert.doesNotMatch(experience, /observer\.observe\(document\.body/);
assert.doesNotMatch(live, /observer\.observe\(stage/);
assert.doesNotMatch(live, /observer\.observe\(favorites/);
assert.match(experience, /\[0, 120, 420, 900\]/);
assert.match(live, /\[120, 420, 900\]/);
assert.match(experience, /Virgo \+ Virgo example/);
assert.doesNotMatch(experience, /Virgo \+ Pisces example/);

console.log('Brief stability smoke test passed.');
