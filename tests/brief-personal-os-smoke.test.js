const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

const loader = read('assets/brief/brief-lite-ui.js');
const loaderCss = read('assets/brief/brief-lite-ui.css');
const os = read('assets/brief/brief-personal-os.js');
const css = read('assets/brief/brief-personal-os.css');
const density = read('assets/brief/brief-personal-os-density.css');

new vm.Script(loader, { filename: 'brief-lite-ui.js' });
new vm.Script(os, { filename: 'brief-personal-os.js' });

assert.match(loader, /briefPersonalOsStyle/);
assert.match(loader, /briefPersonalOsDensityStyle/);
assert.match(loader, /brief-personal-os\.css/);
assert.match(loader, /brief-personal-os-density\.css/);
assert.match(loader, /brief-personal-os\.js/);
assert.match(loader, /loadPersonalOsScript/);
assert.match(loader, /personal-os-test/);
assert.match(loader, /browser-test/);
assert.match(loader, /overlay-test/);
assert.match(loaderCss, /brief-personal-os\.css/);
assert.match(loaderCss, /brief-personal-os-density\.css/);

assert.match(os, /const APP_MAP/);
assert.match(os, /Personal briefing operating system/);
assert.match(os, /brief-os-track/);
assert.match(os, /translate3d/);
assert.match(os, /data-os-next-label/);
assert.match(os, /startAutoFlow/);
assert.match(os, /stopAutoFlow/);
assert.match(os, /pointerdown/);
assert.match(os, /ArrowRight/);
assert.match(os, /brief-personal-os-detail-open/);
assert.match(os, /Return to Personal OS/);
assert.match(os, /window\.BRIEF_PERSONAL_OS/);
assert.match(os, /brief:preset-change/);
assert.doesNotMatch(os, /MutationObserver/);

assert.match(css, /overflow: hidden !important/);
assert.match(css, /height: 100dvh/);
assert.match(css, /grid-template-columns: var\(--brief-os-rail\)/);
assert.match(css, /brief-os-track/);
assert.match(css, /transition: transform/);
assert.match(css, /brief-personal-os-detail-open/);
assert.match(css, /@media \(max-width: 720px\)/);
assert.match(css, /grid-template-columns: repeat\(6,1fr\)/);
assert.match(css, /prefers-reduced-motion/);
assert.match(css, /forced-colors: active/);

assert.match(density, /Final density pass/);
assert.match(density, /--brief-os-header: 0px/);
assert.match(density, /briefSystemCommandButton/);
assert.match(density, /briefSystemMoreButton/);
assert.match(density, /brief-os-command-card h2/);
assert.match(density, /brief-os-next-card ul/);
assert.match(density, /@media \(max-width: 720px\)/);

console.log('Brief Personal OS smoke test passed.');
