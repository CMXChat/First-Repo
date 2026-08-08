const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const html = fs.readFileSync('goals-lab/index.html', 'utf8');
const styles = fs.readFileSync('goals-lab/styles.css', 'utf8');
const part3Styles = fs.readFileSync('goals-lab/part3.css', 'utf8');
const script = fs.readFileSync('goals-lab/app.js', 'utf8');
const part2 = fs.readFileSync('goals-lab/part2.js', 'utf8');
const part3 = fs.readFileSync('goals-lab/part3.js', 'utf8');

new vm.Script(script, { filename: 'goals-lab/app.js' });
new vm.Script(part2, { filename: 'goals-lab/part2.js' });
new vm.Script(part3, { filename: 'goals-lab/part3.js' });

assert.match(html, /Goal Intelligence Lab/);
assert.match(html, /No `\/brief` integration/);
assert.match(html, /part2\.js\?v=20260804-1/);
assert.match(html, /STEP 3 · FRONTEND PROTOTYPE · PART 2/);
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

assert.match(part2, /answeredPrompts/);
assert.match(part2, /distinctFollowUp/);
assert.match(part2, /Question loop advanced/);
assert.match(part2, /part3\.js\?v=20260804-1/);
assert.match(part2, /window\.location\.reload/);
assert.doesNotMatch(part2, /fetch\s*\(/);

assert.match(part3, /simplifyGoalEditor/);
assert.match(part3, /simplifyCheckIn/);
assert.match(part3, /simplifyRecords/);
assert.match(part3, /goalPlanningContext/);
assert.match(part3, /checkInContextDetails/);
assert.match(part3, /sprintEndDate/);
assert.match(part3, /Sprint needs an end date/);
assert.match(part3, /data-goal-part3/);
assert.doesNotMatch(part3, /fetch\s*\(/);

assert.match(styles, /@media \(max-width: 680px\)/);
assert.match(styles, /prefers-reduced-motion/);
assert.match(styles, /forced-colors/);
assert.match(styles, /html\[data-theme='light'\]/);

assert.match(part3Styles, /main-flow-layout/);
assert.match(part3Styles, /editor-drawer/);
assert.match(part3Styles, /records-drawer/);
assert.match(part3Styles, /sprint-date-field/);
assert.match(part3Styles, /@media \(max-width: 680px\)/);
assert.match(part3Styles, /forced-colors/);

console.log('Goal Intelligence Lab smoke test passed.');
