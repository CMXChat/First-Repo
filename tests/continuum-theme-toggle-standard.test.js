const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

const css = read('assets/continuum-theme-toggle.css');
const js = read('assets/continuum-theme-toggle.js');

assert.match(css, /content:"Dark  Light"/);
assert.match(css, /width:108px!important/);
assert.match(css, /html\[data-theme="light"\]/);
assert.match(css, /\[data-v3-theme\]/);
assert.match(css, /#themeToggle/);
assert.match(css, /prefers-reduced-motion:reduce/);

assert.match(js, /aria-pressed/);
assert.match(js, /Switch to light mode/);
assert.match(js, /Switch to dark mode/);
assert.match(js, /attributeFilter: \['data-theme'\]/);
assert.doesNotMatch(js, /subtree:\s*true/);

for (const file of [
  'assets/lab/directory-theme-init.js',
  'assets/lab/library-theme-init.js',
  'assets/lab/control-center-theme-init.js',
  'assets/lab/lab-automations-theme-init.js'
]) {
  const source = read(file);
  assert.match(source, /continuum-theme-toggle\.css\?v=20260820-1/, `${file} must load shared theme CSS`);
  assert.match(source, /continuum-theme-toggle\.js\?v=20260820-1/, `${file} must load shared theme state sync`);
}

const environment = read('environment/index.html');
assert.match(environment, /data-cmx-extra-styles="\/assets\/continuum-theme-toggle\.css\?v=20260820-1"/);
assert.match(environment, /data-cmx-extra-scripts="\/assets\/continuum-theme-toggle\.js\?v=20260820-1"/);

const labSafety = read('assets/lab/lab-safety.css');
assert.match(labSafety, /@import url\("\/assets\/continuum-theme-toggle\.css\?v=20260820-1"\)/);

const checkinReference = read('assets/checkin/checkin-ring-hero.css');
assert.match(checkinReference, /Spaces-style Light \/ Dark segmented switch/);
assert.match(checkinReference, /content:"Dark"/);
assert.match(checkinReference, /content:"Light"/);

const spaces = read('spaces/index.html');
assert.match(spaces, /theme-toggle-track/);
assert.match(spaces, /theme-option-dark">Dark/);
assert.match(spaces, /theme-option-light">Light/);

const doc = read('doc/index.html');
assert.match(doc, /theme-toggle-track/);
assert.match(doc, /theme-option-dark">Dark/);
assert.match(doc, /theme-option-light">Light/);

console.log('Continuum theme toggle standard regression passed.');
