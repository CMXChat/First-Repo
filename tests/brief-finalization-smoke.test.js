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
const flow = read('assets/brief/brief-flow-polish.js');
const flowCss = read('assets/brief/brief-flow-polish.css');
const mapTop = read('assets/brief/brief-map-top.js');
const theme = read('assets/brief/brief-theme-integrity.js');
const vision = read('assets/brief/brief-vision-tour.js');
const visionCss = read('assets/brief/brief-vision-tour.css');
const visionV2 = read('assets/brief/brief-vision-v2.js');
const visionV2Css = read('assets/brief/brief-vision-v2.css');

for (const [name, source] of Object.entries({ bridge, finalize, flow, mapTop, theme, vision, visionV2 })) {
  new vm.Script(source, { filename: `${name}.js` });
}

assert.match(index, /brief-terminal-bridge\.js\?v=20260803-\d+/);
assert.match(index, /noindex, nofollow/);

assert.match(bridge, /NAVIGATION_VERSION = '20260803-7'/);
assert.match(bridge, /INTERFACE_VERSION = '20260803-3'/);
assert.match(bridge, /FINAL_VERSION = '20260803-4'/);
assert.match(bridge, /FLOW_VERSION = '20260803-1'/);
assert.match(bridge, /briefFinalizeStyle/);
assert.match(bridge, /briefVisionStyle/);
assert.match(bridge, /briefVisionV2Style/);
assert.match(bridge, /briefFlowPolishStyle/);
assert.match(bridge, /briefFinalizeScript/);
assert.match(bridge, /briefVisionScript/);
assert.match(bridge, /briefVisionV2Script/);
assert.match(bridge, /briefFlowPolishScript/);
assert.match(bridge, /script\.addEventListener\('error', finish/);
assert.match(bridge, /installEntryTopReset/);
assert.match(bridge, /resetEntryPosition/);
assert.match(bridge, /history\.scrollRestoration = 'manual'/);
assert.match(bridge, /#enterBrief/);
assert.match(bridge, /requestAnimationFrame/);
assert.ok(bridge.indexOf('briefFinalizeStyle') > bridge.indexOf('briefThemeIntegrityStyle'));
assert.ok(bridge.indexOf('briefVisionV2Script') > bridge.indexOf('briefVisionScript'));
assert.ok(bridge.indexOf('briefFinalizeScript') > bridge.indexOf('briefVisionV2Script'));

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

assert.match(flow, /usefulQuickTarget/);
assert.match(flow, /quick-compact-list/);
assert.match(flow, /landOnQuickContent/);
assert.match(flow, /settleAtTrueTop/);
assert.match(flow, /briefRouteJump/);
assert.match(flow, /data-flow-top/);
assert.match(flow, /brief:preset-change/);
assert.match(flow, /history\.scrollRestoration = 'manual'/);
assert.match(flow, /dataset\.briefContentLanded/);
assert.match(flow, /dataset\.briefEntryAtTop/);
assert.doesNotMatch(flow, /new MutationObserver/);
assert.doesNotMatch(flow, /setInterval/);

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

assert.match(flowCss, /brief-route-jump/);
assert.match(flowCss, /brief-context-utilities/);
assert.match(flowCss, /brief-glass-panel/);
assert.match(flowCss, /rgba\(255,255,255,\.035\)/);
assert.match(flowCss, /backdrop-filter/);
assert.match(flowCss, /max-width: 760px/);
assert.match(flowCss, /forced-colors: active/);

assert.match(theme, /attributeFilter: \['data-theme'\]/);
assert.doesNotMatch(theme, /subtree:\s*true/);

assert.match(vision, /const STEPS = \[/);
assert.match(vision, /Spotify favorites/);
assert.match(vision, /role="dialog"/);
assert.match(vision, /aria-modal="true"/);
assert.match(vision, /trapFocus/);
assert.match(vision, /Escape/);
assert.match(vision, /prefers-reduced-motion/);
assert.match(vision, /window\.BRIEF_VISION_TOUR/);
assert.doesNotMatch(vision, /setInterval/);
assert.doesNotMatch(vision, /new MutationObserver/);

assert.match(visionV2, /const MISSIONS = \[/);
assert.match(visionV2, /Build the opening you would actually use/);
assert.match(visionV2, /Spotify favorites/);
assert.match(visionV2, /Turn scattered facts into one strategic move/);
assert.match(visionV2, /Choose what each space is allowed to know/);
assert.match(visionV2, /Correct the record and improve tomorrow/);
assert.match(visionV2, /Approve the action or keep it a draft/);
assert.match(visionV2, /data-vision-choice/);
assert.match(visionV2, /briefVisionXp/);
assert.match(visionV2, /trapFocus/);
assert.match(visionV2, /Escape/);
assert.match(visionV2, /helpVisible/);
assert.match(visionV2, /window\.BRIEF_VISION_TOUR/);
assert.doesNotMatch(visionV2, /setInterval/);
assert.doesNotMatch(visionV2, /new MutationObserver/);

assert.match(visionCss, /-webkit-backdrop-filter/);
assert.match(visionCss, /env\(safe-area-inset-top\)/);
assert.match(visionCss, /orientation: landscape/);
assert.match(visionCss, /prefers-reduced-motion: reduce/);
assert.match(visionCss, /forced-colors: active/);

assert.match(visionV2Css, /brief-vision-v2/);
assert.match(visionV2Css, /vision-v2-mission-rail/);
assert.match(visionV2Css, /#briefVisionChoices/);
assert.match(visionV2Css, /backdrop-filter/);
assert.match(visionV2Css, /orientation: landscape/);
assert.match(visionV2Css, /prefers-reduced-motion: reduce/);
assert.match(visionV2Css, /forced-colors: active/);

console.log('Brief final product smoke test passed.');
