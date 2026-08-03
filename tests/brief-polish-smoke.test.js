const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

const config = read('assets/brief/brief-config.js');
const workspace = read('assets/brief/brief-workspace.js');
const polish = read('assets/brief/brief-polish.js');
const polishCss = read('assets/brief/brief-polish.css');
const watch = read('assets/brief/brief-relationship-watch.js');

for (const [name, source] of Object.entries({ config, workspace, polish, watch })) {
  new vm.Script(source, { filename: `${name}.js` });
}

assert.match(config, /polish: '20260803-1'/);
assert.match(config, /brief-polish\.css/);
assert.match(config, /brief-polish\.js/);
assert.match(config, /watch: '20260803-3'/);
assert.match(config, /briefWorkspaceScript[\s\S]*briefPolishScript/);

assert.match(workspace, /dataset\.railPaused/);
assert.match(workspace, /state\.railPaused = !state\.railPaused/);
assert.match(polish, /animationPlayState = paused \? 'paused' : 'running'/);
assert.match(polish, /Pause moving briefing signals/);
assert.match(polish, /Moving signals playing/);
assert.doesNotMatch(polish, /new MutationObserver/);

assert.match(polish, /EXECUTIVE PULSE/);
assert.match(polish, /SIX-MONTH REVENUE/);
assert.match(polish, /Cash collected/);
assert.match(polish, /LIVE TEAM OPERATING BOARD/);
assert.match(polish, /polish-team-board/);
assert.match(polish, /ROLE WORKLOAD/);
assert.match(polish, /HANDOFF WATCH/);
assert.match(polish, /APPROVED FINANCE SIGNALS/);
assert.match(polish, /briefPriorityVisuals/);
assert.match(polish, /data-polish-open="business-finance"/);

assert.match(watch, /relationship-watch-refresh/);
assert.match(watch, /resetPlayer/);
assert.match(watch, /Video reset\. Tap Play/);
assert.match(watch, /Still loading\. Refresh the video/);
assert.match(watch, /youtube-nocookie\.com/);
assert.match(watch, /strict-origin-when-cross-origin/);
assert.match(polish, /Refresh preview/);

assert.match(polishCss, /focus-within[\s\S]*animation-play-state: running/);
assert.match(polishCss, /data-rail-paused='true'[\s\S]*animation-play-state: paused !important/);
assert.match(polishCss, /@media \(hover: hover\) and \(pointer: fine\)/);
assert.match(polishCss, /@media \(prefers-reduced-motion: reduce\)/);
assert.match(polishCss, /animation: none !important/);
assert.match(polishCss, /scroll-snap-type: x mandatory/);
assert.match(polishCss, /@media \(max-width: 520px\)/);
assert.match(polishCss, /html\[data-theme='light'\]/);

console.log('Brief polish smoke test passed.');
