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
const mapTop = read('assets/brief/brief-map-top.js');
const theme = read('assets/brief/brief-theme-integrity.js');
const vision = read('assets/brief/brief-vision-tour.js');
const visionCss = read('assets/brief/brief-vision-tour.css');

for (const [name, source] of Object.entries({ bridge, finalize, mapTop, theme, vision })) {
  new vm.Script(source, { filename: `${name}.js` });
}

assert.match(index, /brief-terminal-bridge\.js\?v=20260803-\d+/);
assert.match(index, /noindex, nofollow/);

assert.match(bridge, /NAVIGATION_VERSION = '20260803-7'/);
assert.match(bridge, /INTERFACE_VERSION = '20260803-3'/);
assert.match(bridge, /FINAL_VERSION = '20260803-3'/);
assert.match(bridge, /briefFinalizeStyle/);
assert.match(bridge, /briefVisionStyle/);
assert.match(bridge, /briefFinalizeScript/);
assert.match(bridge, /briefVisionScript/);
assert.match(bridge, /script\.addEventListener\('error', finish/);
assert.match(bridge, /installEntryTopReset/);
assert.match(bridge, /resetEntryPosition/);
assert.match(bridge, /history\.scrollRestoration = 'manual'/);
assert.match(bridge, /#enterBrief/);
assert.match(bridge, /requestAnimationFrame/);
assert.ok(bridge.indexOf("briefFinalizeStyle") > bridge.indexOf("briefThemeIntegrityStyle"));
assert.ok(bridge.indexOf("briefFinalizeScript") > bridge.indexOf("briefVisionScript"));

assert.match(finalize, /data-open-full-workspace/);
assert.match(finalize, /data-open-brief-map/);
assert.match(finalize, /data-start-vision/);
assert.match(finalize, /removeAttribute\('data-open-full-map'\)/);
assert.match(finalize, /openFullWorkspace/);
assert.match(finalize, /closeMap\(\)/);
assert.match(finalize, /BRIEF_NAVIGATION\?\.navigate/);
assert.match(finalize, /depth: 'full'/);
assert.match(finalize, /openMap/);
assert.match(finalize, /ensureVisionEntry/);
assert.match(finalize, /Imagine this with your real music, voice, context and approved connections/);
assert.match(finalize, /#briefStartVision, \[data-start-vision\]/);
assert.match(finalize, /openVisionAfterHelp/);
assert.match(finalize, /BRIEF_ONBOARDING\?\.closeHelp/);
assert.match(finalize, /BRIEF_VISION_TOUR\?\.open/);
assert.match(finalize, /brief:navigation-open/);
assert.match(finalize, /brief:navigation-close/);
assert.match(finalize, /briefFinalHelpFallbackStyle/);
assert.match(finalize, /has-vision-entry/);
assert.doesNotMatch(finalize, /new MutationObserver/);
assert.doesNotMatch(finalize, /setInterval/);

const fullWorkspaceBody = finalize.slice(
  finalize.indexOf('function openFullWorkspace'),
  finalize.indexOf('function openVisionAfterHelp')
);
assert.match(fullWorkspaceBody, /closeMap\(\)/);
assert.match(fullWorkspaceBody, /BRIEF_NAVIGATION\?\.navigate/);
assert.doesNotMatch(fullWorkspaceBody, /openMap\(\)/);

assert.match(mapTop, /brief:navigation-open/);
assert.match(mapTop, /brief:navigation-close/);
assert.match(mapTop, /syncDrawerState/);
assert.match(mapTop, /Open the \$\{label\} briefing map/);

assert.match(finalizeCss, /brief-vision-entry-card/);
assert.match(finalizeCss, /data-open-full-workspace/);
assert.match(finalizeCss, /data-open-brief-map/);
assert.match(finalizeCss, /html\[data-theme='light'\]/);
assert.match(finalizeCss, /html:not\(\[data-theme='light'\]\)/);
assert.match(finalizeCss, /quick-signal-card\.tone-blue/);
assert.match(finalizeCss, /brief-vision-panel/);
assert.match(finalizeCss, /brief-navigation-panel/);
assert.match(finalizeCss, /brief-terminal-panel/);
assert.match(finalizeCss, /prefers-reduced-motion/);
assert.match(finalizeCss, /forced-colors: active/);

assert.match(theme, /attributeFilter: \['data-theme'\]/);
assert.doesNotMatch(theme, /subtree:\s*true/);

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

console.log('Brief final product smoke test passed.');
