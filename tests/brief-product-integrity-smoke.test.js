const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const files = {
  bridge: read('assets/brief/brief-terminal-bridge.js'),
  finalize: read('assets/brief/brief-finalize.js'),
  css: read('assets/brief/brief-finalize.css'),
  map: read('assets/brief/brief-map-top.js'),
  vision: read('assets/brief/brief-vision-tour.js')
};

for (const [name, source] of Object.entries(files)) {
  if (name !== 'css') new vm.Script(source, { filename: `${name}.js` });
}

assert.match(files.bridge, /NAVIGATION_VERSION = '20260803-7'/);
assert.match(files.bridge, /INTERFACE_VERSION = '20260803-3'/);
assert.match(files.bridge, /FINAL_VERSION = '20260803-3'/);
assert.ok(files.bridge.indexOf("briefFinalizeStyle") > files.bridge.indexOf("briefThemeIntegrityStyle"));
assert.ok(files.bridge.indexOf("briefFinalizeScript") > files.bridge.indexOf("briefVisionScript"));

assert.match(files.finalize, /data-open-full-workspace/);
assert.match(files.finalize, /data-open-brief-map/);
assert.match(files.finalize, /data-start-vision/);
assert.match(files.finalize, /BRIEF_NAVIGATION\?\.navigate/);
assert.match(files.finalize, /brief:navigation-open/);
assert.match(files.finalize, /brief:navigation-close/);
assert.doesNotMatch(files.finalize, /new MutationObserver/);
assert.doesNotMatch(files.finalize, /setInterval/);

assert.match(files.map, /brief:navigation-open/);
assert.match(files.map, /brief:navigation-close/);
assert.match(files.map, /syncDrawerState/);

assert.match(files.css, /brief-vision-entry-card/);
assert.match(files.css, /data-open-full-workspace/);
assert.match(files.css, /data-open-brief-map/);
assert.match(files.css, /html\[data-theme='light'\]/);
assert.match(files.css, /html:not\(\[data-theme='light'\]\)/);
assert.match(files.css, /prefers-reduced-motion/);
assert.match(files.css, /forced-colors: active/);

assert.match(files.vision, /Spotify favorites/);
assert.match(files.vision, /Context turns reminders into strategy/);
assert.match(files.vision, /Different people see different truths/);
assert.match(files.vision, /When you approve it, the briefing can act/);

console.log('Brief product integrity smoke test passed.');
