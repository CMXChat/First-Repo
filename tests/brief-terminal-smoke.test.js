const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

const index = read('brief/index.html');
const config = read('assets/brief/brief-config.js');
const terminal = read('assets/brief/brief-terminal.js');
const bridge = read('assets/brief/brief-terminal-bridge.js');
const repair = read('assets/brief/brief-overlay-controls-fix.js');
const styles = read('assets/brief/brief-terminal.css');
const repairStyles = read('assets/brief/brief-overlay-controls-fix.css');

new vm.Script(terminal, { filename: 'brief-terminal.js' });
new vm.Script(bridge, { filename: 'brief-terminal-bridge.js' });
new vm.Script(repair, { filename: 'brief-overlay-controls-fix.js' });

assert.match(index, /brief-terminal-bridge\.js/);
assert.match(config, /brief-terminal\.css/);
assert.match(config, /brief-terminal\.js/);
assert.match(config, /briefTerminalScript/);
assert.match(terminal, /Personal briefing terminal/);
assert.match(terminal, /Relationship briefing terminal/);
assert.match(terminal, /Business briefing terminal/);
assert.match(terminal, /Trainer briefing terminal/);
assert.match(terminal, /Team briefing terminal/);
assert.match(terminal, /user@brief:~\/personal\$/);
assert.match(terminal, /pair@brief:~\/shared\$/);
assert.match(terminal, /partners@brief:~\/ops\$/);
assert.match(terminal, /coach@brief:~\/training\$/);
assert.match(terminal, /team@brief:~\/project\$/);
assert.match(terminal, /Nothing typed here leaves this page/);
assert.match(terminal, /view personal\|relationship\|business\|trainer\|team/);
assert.match(terminal, /brief:preset-change/);
assert.match(terminal, /briefingFooterSwitcher/);

assert.match(bridge, /brief personal\|relationship\|business\|trainer\|team/);
assert.match(bridge, /Protected records, files, connectors and approved actions belong behind authenticated backend services/);
assert.match(bridge, /Learning can use approved history/);
assert.match(bridge, /Team spaces can separate member work/);
assert.match(bridge, /least-privilege permissions/);
assert.match(bridge, /const ALIASES = \{/);
assert.match(bridge, /brief:preset-change/);
assert.match(bridge, /scrollTop/);
assert.match(bridge, /briefing type/);
assert.match(bridge, /briefScopeHelp/);
assert.match(bridge, /Navigate Focus, Workspace, Full View/);
assert.match(bridge, /views · modules · privacy · briefing types/);
assert.match(bridge, /scheduleLateUi/);
assert.doesNotMatch(bridge, /new MutationObserver/);

assert.match(repair, /portalTerminal/);
assert.match(repair, /document\.body\.appendChild\(node\)/);
assert.match(repair, /focusTerminalInput/);
assert.match(repair, /brief-terminal-open/);
assert.match(repair, /MutationObserver/);
assert.match(repairStyles, /body\.brief-system-ready > #briefTerminal\.brief-terminal-system-drawer/);
assert.match(repairStyles, /z-index: 1005/);
assert.match(repairStyles, /visibility: visible !important/);
assert.match(repairStyles, /pointer-events: auto !important/);

assert.match(styles, /html\[data-theme='light'\]/);
assert.match(styles, /@media \(max-width: 680px\)/);
assert.match(styles, /font-size: 16px/);
assert.match(styles, /min-height: 44px/);

console.log('Brief terminal smoke test passed.');
