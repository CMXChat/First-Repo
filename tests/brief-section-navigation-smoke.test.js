const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

const spacesHtml = read('spaces/index.html');
const explainersJs = read('assets/brief/brief-demo-explainers.js');
const navigationJs = read('assets/brief/brief-demo-section-navigation.js');
const navigationCss = read('assets/brief/brief-demo-section-navigation.css');
const deepNavigationJs = read('assets/brief/brief-demo-deep-navigation.js');

assert.doesNotThrow(() => new Function(navigationJs));
assert.doesNotThrow(() => new Function(deepNavigationJs));
assert.match(explainersJs, /brief-demo-section-navigation\.js\?v=20260805-1/);
assert.match(explainersJs, /briefSectionNavigationLoader/);
assert.match(spacesHtml, /brief-demo-deep-navigation\.js\?v=20260808-1/);

assert.match(navigationJs, /const EDGE_GUARD_PX = 32/);
assert.match(navigationJs, /const MAX_SWIPE_DURATION_MS = 900/);
assert.match(navigationJs, /const SWIPE_DIRECTION_RATIO = 1\.45/);
assert.match(navigationJs, /function renderPagers\(/);
assert.match(navigationJs, /Previous section/);
assert.match(navigationJs, /Next section/);
assert.match(navigationJs, /Start again/);
assert.match(navigationJs, /Swipe left or right between sections/);
assert.match(navigationJs, /function shouldIgnoreSwipe\(/);
assert.match(navigationJs, /elementCanScrollHorizontally/);
assert.match(navigationJs, /\[role="tablist"\]/);
assert.match(navigationJs, /main\.addEventListener\('touchstart'/);
assert.match(navigationJs, /main\.addEventListener\('touchmove'/);
assert.match(navigationJs, /main\.addEventListener\('touchend'/);
assert.match(navigationJs, /views\[index \+ 1\]/);
assert.match(navigationJs, /views\[index - 1\]/);
assert.doesNotMatch(navigationJs, /preventDefault\(\)/);

assert.match(navigationCss, /\.section-pager \{/);
assert.match(navigationCss, /\.section-pager-button/);
assert.match(navigationCss, /\.section-swipe-hint/);
assert.match(navigationCss, /#demoMain\[data-section-direction="next"\]/);
assert.match(navigationCss, /#demoMain\[data-section-direction="previous"\]/);
assert.match(navigationCss, /@media \(max-width: 430px\)/);
assert.match(navigationCss, /prefers-reduced-motion/);
assert.match(navigationCss, /\.full-end-nav \{[\s\S]*display: none !important/);

assert.match(deepNavigationJs, /function workspaceDetailTarget\(/);
assert.match(deepNavigationJs, /\.workspace-related-links, \.workspace-thread-links/);
assert.match(deepNavigationJs, /\[data-workspace-continue\]/);
assert.match(deepNavigationJs, /\[data-highlight-tab\]/);
assert.match(deepNavigationJs, /\[data-full-workspace-tab\]/);
assert.match(deepNavigationJs, /#priorityReview/);
assert.match(deepNavigationJs, /\[data-go-view="workspace"\]/);
assert.match(deepNavigationJs, /origin === 'all-weather'/);
assert.match(deepNavigationJs, /origin === 'all-signals'/);
assert.match(deepNavigationJs, /origin === 'all-flow'/);
assert.match(deepNavigationJs, /\[data-view-panel="spaces"\] \.space-overview/);
assert.match(deepNavigationJs, /\[data-view-panel="how"\] \.foundation-map/);
assert.match(deepNavigationJs, /requestAnimationFrame/);
assert.doesNotMatch(deepNavigationJs, /preventDefault\(\)/);

console.log('Brief section navigation smoke test passed.');
