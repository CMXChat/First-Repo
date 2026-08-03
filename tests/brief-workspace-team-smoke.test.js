const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

const index = read('brief/index.html');
const config = read('assets/brief/brief-config.js');
const entry = read('assets/brief/brief-entry-radio.js');
const teamData = read('assets/brief/brief-team-data.js');
const teamRenderer = read('assets/brief/brief-team-renderer.js');
const workspace = read('assets/brief/brief-workspace.js');
const workspaceCss = read('assets/brief/brief-workspace.css');
const terminal = read('assets/brief/brief-terminal.js');
const bridge = read('assets/brief/brief-terminal-bridge.js');
const daily = read('assets/brief/brief-daily-content.js');

for (const [name, source] of [
  ['brief-config.js', config],
  ['brief-entry-radio.js', entry],
  ['brief-team-data.js', teamData],
  ['brief-team-renderer.js', teamRenderer],
  ['brief-workspace.js', workspace],
  ['brief-terminal.js', terminal],
  ['brief-terminal-bridge.js', bridge],
  ['brief-daily-content.js', daily]
]) new vm.Script(source, { filename: name });

assert.match(index, /<option value="team">Atlas · Team and project<\/option>/);
assert.match(index, /FIVE WAYS THE SAME PLATFORM/);
assert.match(index, /brief-team-data\.js/);
assert.ok(index.indexOf('brief-team-data.js') < index.indexOf('brief-core.js'));
assert.match(index, /brief-config\.js\?v=20260803-11/);

assert.match(config, /team: 'Team \+ project'/);
assert.match(config, /brief-workspace\.css/);
assert.match(config, /brief-team-renderer\.js/);
assert.match(config, /brief-workspace\.js/);
assert.match(config, /brief-polish\.css/);
assert.match(config, /brief-polish\.js/);
assert.ok(config.indexOf('briefTeamRendererScript') < config.indexOf('briefWorkspaceScript'));
assert.ok(config.indexOf('briefWorkspaceScript') < config.indexOf('briefPolishScript'));

assert.match(entry, /Team \+ project/);
assert.match(entry, /input\.type = 'radio'/);
assert.doesNotMatch(entry, /enter\.click\(\)/);

assert.match(teamData, /presets\.team/);
assert.match(teamData, /data\.scenarios\.team/);
assert.match(teamData, /scenarios\.team/);
assert.match(teamData, /Private profile/);
assert.match(teamData, /Role space/);
assert.match(teamData, /Project space/);
assert.match(teamData, /Leadership space/);
assert.match(teamData, /Project phase completion is 40%/);
assert.match(teamData, /Phase completion/);
assert.match(teamData, /procedure/);
assert.match(teamData, /finance/);
assert.match(teamData, /Least-privilege access/);
assert.match(teamData, /dayCycle/);
assert.match(teamData, /intelligence/);

assert.match(teamRenderer, /team-role-console/);
assert.match(teamRenderer, /team-progress-panel/);
assert.match(teamRenderer, /team-handoff-board/);
assert.match(teamRenderer, /team-procedure-board/);
assert.match(teamRenderer, /team-finance-watch/);
assert.match(teamRenderer, /team-security-boundary/);
assert.doesNotMatch(teamRenderer, /MutationObserver/);

assert.match(workspace, /Quick briefing/);
assert.match(workspace, /Full workspace/);
assert.match(workspace, /brief-workspace-tabs/);
assert.match(workspace, /\['finance', 'Finance'\]/);
assert.match(workspace, /\['procedure', 'Procedure'\]/);
assert.match(workspace, /data-depth-choice/);
assert.match(workspace, /briefSignalPause/);
assert.match(workspace, /dailyQuotes/);
assert.match(workspace, /data-quick-preset = 'team'|dataset\.quickPreset = 'team'/);
assert.doesNotMatch(workspace, /MutationObserver/);

assert.match(workspaceCss, /data-brief-depth='quick'/);
assert.match(workspaceCss, /brief-workspace-tabs/);
assert.match(workspaceCss, /quick-quote-card/);
assert.match(workspaceCss, /briefSignalMove/);
assert.match(workspaceCss, /animation-play-state: paused/);
assert.match(workspaceCss, /prefers-reduced-motion/);
assert.match(workspaceCss, /scroll-snap-type/);
assert.match(workspaceCss, /html\[data-theme='light'\]/);

assert.match(terminal, /Team briefing terminal/);
assert.match(terminal, /team@brief:~\/project\$/);
assert.match(terminal, /view personal\|relationship\|business\|trainer\|team/);
assert.match(bridge, /brief personal\|relationship\|business\|trainer\|team/);
assert.match(bridge, /team: 'team'/);

assert.match(daily, /schemaVersion: 3/);
assert.match(daily, /dailyQuotes/);
assert.match(daily, /team: 'A strong team/);
assert.match(daily, /id: 'team'/);

console.log('Brief workspace and Team smoke test passed.');
