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
const mobile = read('assets/brief/brief-personal-os-mobile.css');
const fullHome = read('assets/brief/brief-full-home.js');
const fullHomeCss = read('assets/brief/brief-full-home.css');

new vm.Script(loader, { filename: 'brief-lite-ui.js' });
new vm.Script(os, { filename: 'brief-personal-os.js' });
new vm.Script(fullHome, { filename: 'brief-full-home.js' });

assert.match(loader, /briefPersonalOsStyle/);
assert.match(loader, /briefPersonalOsDensityStyle/);
assert.match(loader, /briefPersonalOsMobileStyle/);
assert.match(loader, /briefFullHomeStyle/);
assert.match(loader, /brief-personal-os\.css/);
assert.match(loader, /brief-personal-os-density\.css/);
assert.match(loader, /brief-personal-os-mobile\.css/);
assert.match(loader, /brief-full-home\.css/);
assert.match(loader, /brief-personal-os\.js/);
assert.match(loader, /brief-full-home\.js/);
assert.match(loader, /loadPersonalOsScript/);
assert.match(loader, /loadFullHomeScript/);
assert.match(loader, /personal-os-test/);
assert.match(loader, /browser-test/);
assert.match(loader, /overlay-test/);
assert.match(loaderCss, /brief-personal-os\.css/);
assert.match(loaderCss, /brief-personal-os-density\.css/);
assert.match(loaderCss, /brief-personal-os-mobile\.css/);
assert.match(loaderCss, /brief-full-home\.css/);

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

assert.match(fullHome, /viewDepth/);
assert.match(fullHome, /return VALID_DEPTHS\.has\(stored\) \? stored : 'full'/);
assert.match(fullHome, /FULL OPERATING PICTURE/);
assert.match(fullHome, /EXECUTIVE SUMMARY/);
assert.match(fullHome, /PRIORITIES/);
assert.match(fullHome, /CALENDAR/);
assert.match(fullHome, /MESSAGES/);
assert.match(fullHome, /TASKS/);
assert.match(fullHome, /GOALS/);
assert.match(fullHome, /UPDATES/);
assert.match(fullHome, /INSIGHTS/);
assert.match(fullHome, /data-brief-home-depth/);
assert.match(fullHome, /localStorage\.setItem\(DEPTH_KEY/);
assert.match(fullHome, /MutationObserver/);
assert.match(fullHome, /window\.BRIEF_FULL_HOME/);
assert.doesNotMatch(fullHome, /fetch\(|XMLHttpRequest|WebSocket/);

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

assert.match(mobile, /Mobile dashboard composition/);
assert.match(mobile, /grid-template-columns: repeat\(2/);
assert.match(mobile, /grid-column: 1 \/ -1/);
assert.match(mobile, /max-height: 700px/);

assert.match(fullHomeCss, /brief-os-depth-switch/);
assert.match(fullHomeCss, /brief-os-home-grid/);
assert.match(fullHomeCss, /data-brief-os-depth='quick'/);
assert.match(fullHomeCss, /brief-os-home-module\[data-quick='false'\]/);
assert.match(fullHomeCss, /@media \(max-width: 720px\)/);
assert.match(fullHomeCss, /grid-template-columns: 1fr/);
assert.match(fullHomeCss, /prefers-reduced-motion/);
assert.match(fullHomeCss, /forced-colors: active/);

console.log('Brief Personal OS smoke test passed.');
