const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

const index = read('brief/index.html');
const bridge = read('assets/brief/brief-terminal-bridge.js');
const finalize = read('assets/brief/brief-finalize.js');
const finalizeCss = read('assets/brief/brief-finalize.css');
const vision = read('assets/brief/brief-vision-tour.js');
const visionCss = read('assets/brief/brief-vision-tour.css');

for (const [name, source] of Object.entries({ bridge, finalize, vision })) {
  new vm.Script(source, { filename: `${name}.js` });
}

assert.match(index, /brief-terminal-bridge\.js\?v=20260804-\d+/);
assert.match(bridge, /briefThemeIntegrityStyle/);
assert.match(bridge, /briefSystemStyle/);
assert.match(bridge, /briefSystemFixStyle/);
assert.match(bridge, /briefThemeIntegrityScript/);
assert.match(bridge, /briefSystemScript/);
assert.doesNotMatch(bridge, /briefFinalizeStyle/);
assert.doesNotMatch(bridge, /briefVisionStyle/);
assert.doesNotMatch(bridge, /briefFinalizeScript/);
assert.doesNotMatch(bridge, /briefVisionScript/);

assert.match(finalize, /data-open-full-workspace/);
assert.match(finalize, /removeAttribute\('data-open-full-map'\)/);
assert.match(finalize, /openFullWorkspace/);
assert.match(finalize, /closeMap\(\)/);
assert.match(finalize, /#briefStartVision/);
assert.match(finalize, /openVisionAfterHelp/);
assert.match(finalize, /BRIEF_ONBOARDING\?\.closeHelp/);
assert.match(finalize, /BRIEF_VISION_TOUR\?\.open/);
assert.doesNotMatch(finalize, /new MutationObserver/);

assert.match(finalizeCss, /brief-help-actions/);
assert.match(finalizeCss, /browsers that do not support :has/);
assert.match(finalizeCss, /prefers-reduced-motion/);

assert.match(vision, /const STEPS = \[/);
assert.match(vision, /You wake up\. The day is already sorted/);
assert.match(vision, /Spotify favorites/);
assert.match(vision, /Context turns reminders into strategy/);
assert.match(vision, /Different people see different truths/);
assert.match(vision, /learns through correction/);
assert.match(vision, /When you approve it, the briefing can act/);
assert.match(vision, /role="dialog"/);
assert.match(vision, /aria-modal="true"/);
assert.match(vision, /trapFocus/);
assert.match(vision, /Escape/);
assert.match(vision, /prefers-reduced-motion/);
assert.match(vision, /window\.BRIEF_VISION_TOUR/);
assert.doesNotMatch(vision, /setInterval/);
assert.doesNotMatch(vision, /new MutationObserver/);

assert.match(visionCss, /-webkit-backdrop-filter/);
assert.match(visionCss, /env\(safe-area-inset-top\)/);
assert.match(visionCss, /orientation: landscape/);
assert.match(visionCss, /prefers-reduced-motion: reduce/);
assert.match(visionCss, /forced-colors: active/);

console.log('Brief final navigation and vision smoke test passed.');
