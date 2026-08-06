const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

const explainersJs = read('assets/brief/brief-demo-explainers.js');
const navigationJs = read('assets/brief/brief-demo-section-navigation.js');
const navigationCss = read('assets/brief/brief-demo-section-navigation.css');

assert.doesNotThrow(() => new Function(navigationJs));
assert.match(explainersJs, /brief-demo-section-navigation\.js\?v=20260805-1/);
assert.match(explainersJs, /data-brief-section-navigation-loader/);

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

console.log('Brief section navigation smoke test passed.');
