const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const html = fs.readFileSync('goals-lab/index.html', 'utf8');
const styles = fs.readFileSync('goals-lab/styles.css', 'utf8');
const script = fs.readFileSync('goals-lab/app.js', 'utf8');

new vm.Script(script, { filename: 'goals-lab/app.js' });

assert.match(html, /Goal Intelligence Lab/);
assert.match(html, /No `\/brief` integration/);
assert.match(html, /id="difficultyRange"/);
assert.match(html, /id="checkInForm"/);
assert.match(html, /id="questionPanel"/);
assert.match(html, /id="evidenceForm"/);
assert.match(html, /id="historyList"/);
assert.match(html, /data-outcome="completed"/);

assert.match(script, /cmx_goal_intelligence_lab_v1/);
assert.match(script, /const DIFFICULTIES/);
assert.match(script, /questionForContext/);
assert.match(script, /recommendationForContext/);
assert.match(script, /determineTrajectory/);
assert.match(script, /determineConfidence/);
assert.match(script, /handleCheckInSubmit/);
assert.match(script, /handleOutcome/);
assert.match(script, /handleEvidenceSubmit/);
assert.match(script, /localStorage/);
assert.doesNotMatch(script, /fetch\s*\(/);

assert.match(styles, /@media \(max-width: 680px\)/);
assert.match(styles, /prefers-reduced-motion/);
assert.match(styles, /forced-colors/);
assert.match(styles, /html\[data-theme='light'\]/);

console.log('Goal Intelligence Lab smoke test passed.');
