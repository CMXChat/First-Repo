'use strict';

const MANUAL = {
  help: ['Show available terminal commands.', 'Usage: help [command]'],
  site: ['Inspect an approved local tool route.', 'Usage: site <check|indexability> [approved-tool]'],
  tools: ['List, test, describe, or open approved tools.', 'Usage: tools <list|status|open|describe> [tool]'],
  monitor: ['Run live health checks across approved tools.', 'Usage: monitor <status|tools|all>'],
  search: ['Build and open a focused public search.', 'Usage: search <exact|site|username|email|domain|documents|images|mentions> <target>'],
  osint: ['List or open an approved CMX intelligence tool.', 'Usage: osint <list|open|phone|metadata|search|missing|resources>'],
  open: ['Open an approved tool directly.', 'Usage: open <tool>'],
  status: ['Show current console activity and uptime.', 'Usage: status'],
  lock: ['Lock the console immediately.', 'Usage: lock'],
  fullscreen: ['Toggle browser fullscreen mode.', 'Usage: fullscreen']
};

function commandNames() {
  return [
    'help', 'man', 'commands', 'examples',
    'site', 'tools', 'monitor', 'search', 'osint', 'open',
    'status', 'whoami', 'date', 'clear', 'lock', 'reboot', 'fullscreen'
  ];
}

function help(command) {
  if (command) return manual(command);

  line('CMX USER CONSOLE', 'success');
  line('OPERATIONS', 'warning');
  line('site · tools · monitor · open');
  line('SEARCH', 'warning');
  line('search · osint');
  line('REFERENCE', 'warning');
  line('man · commands · examples');
  line('SESSION', 'warning');
  line('status · whoami · date · clear · lock · reboot · fullscreen');
  line('Use ↑/↓ for session history, Tab for autocomplete, Ctrl+L to clear, Ctrl+K to lock, and && to chain.', 'dim');
}

function manual(name) {
  const key = String(name || '').toLowerCase();
  const page = MANUAL[key];
  if (!page) return line(`No manual entry for: ${key || '(missing)'}`, 'error');

  line(key.toUpperCase(), 'success');
  page.forEach((item) => line(item));
}

function examples() {
  printRows([
    ['Check a tool', 'site check metadata'],
    ['Check indexability', 'site indexability metadata'],
    ['List approved tools', 'tools list'],
    ['Check all tool routes', 'tools status'],
    ['Open a tool', 'open metadata'],
    ['Search a username', 'search username example123'],
    ['Search documents on a domain', 'search documents example.com'],
    ['Open Operations Directory', 'directory']
  ], ['GOAL', 'COMMAND']);
}

function statusCommand() {
  printRows([
    ['User', 'admin'],
    ['Session', 'authenticated'],
    ['Active checks', String(activeRequests)],
    ['Console uptime', formatDuration(Date.now() - STARTED_AT)]
  ], ['FIELD', 'VALUE']);
}

function osintCommand(args) {
  const action = (args[0] || 'list').toLowerCase();
  if (action === 'list') return toolsCommand(['list']);
  if (action === 'open') return openRoute('directory');
  return openRoute(action);
}

function suggestion(input) {
  const candidates = [...new Set([...commandNames(), ...Object.keys(ROUTES)])];
  let best = null;

  for (const candidate of candidates) {
    const distance = levenshtein(input, candidate);
    if (!best || distance < best.distance) best = { candidate, distance };
  }

  return best;
}

function levenshtein(a, b) {
  const matrix = Array.from({ length: b.length + 1 }, (_, row) => [row]);
  for (let column = 0; column <= a.length; column += 1) matrix[0][column] = column;

  for (let row = 1; row <= b.length; row += 1) {
    for (let column = 1; column <= a.length; column += 1) {
      matrix[row][column] = b[row - 1] === a[column - 1]
        ? matrix[row - 1][column - 1]
        : Math.min(matrix[row - 1][column - 1], matrix[row][column - 1], matrix[row - 1][column]) + 1;
    }
  }

  return matrix[b.length][a.length];
}

async function execute(raw) {
  const tokens = tokenize(raw);
  if (!tokens.length) return;

  const base = tokens[0].toLowerCase();
  const args = tokens.slice(1);

  switch (base) {
    case 'help':
    case '?': return help(args[0]);
    case 'man': return manual(args[0]);
    case 'commands': return printRows(
      commandNames().map((name) => [name, MANUAL[name]?.[0] || 'Built-in command']),
      ['COMMAND', 'DESCRIPTION']
    );
    case 'examples': return examples();
    case 'site': return siteCommand(args);
    case 'tools': return toolsCommand(args);
    case 'monitor': return monitorCommand(args);
    case 'search': return searchCommand(args);
    case 'osint': return osintCommand(args);
    case 'open': return openRoute(args[0]);
    case 'status': return statusCommand();
    case 'whoami': return line('admin', 'success');
    case 'date': return line(new Date().toString(), 'info');
    case 'clear':
    case 'cls': return clearTerminal();
    case 'lock': return showGate();
    case 'reboot': return location.reload();
    case 'fullscreen': return fullscreen();
    default:
      if (ROUTES[base]) return openRoute(base);
      line(`user-console: command not found: ${base}`, 'error');
      {
        const match = suggestion(base);
        if (match && match.distance <= Math.max(2, Math.floor(base.length / 3))) line(`Did you mean: ${match.candidate}?`, 'dim');
        else line('Type "help" for available commands.', 'dim');
      }
  }
}

async function run(raw) {
  const command = raw.trim();
  if (!command) return;

  echo(command);
  history.push(command);
  history = history.slice(-60);
  historyIndex = history.length;

  for (const segment of splitChain(command)) await execute(segment);
}

function autocomplete() {
  const input = $('#commandInput');
  const value = input.value;
  const tokens = tokenize(value);
  const current = (tokens[tokens.length - 1] || '').toLowerCase();
  if (!current) return;

  const prefix = value.slice(0, value.lastIndexOf(tokens[tokens.length - 1]));
  const options = [...new Set([...commandNames(), ...Object.keys(ROUTES)])];
  const matches = options.filter((item) => item.startsWith(current));

  if (matches.length === 1) input.value = `${prefix}${matches[0]} `;
  else if (matches.length > 1) line(matches.join('   '), 'dim');
}

async function fullscreen() {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await document.documentElement.requestFullscreen();
  } catch {
    toast('Fullscreen unavailable.');
  }
}

async function boot() {
  const steps = [
    ['[  OK  ]', 'Starting user console...'],
    ['[  OK  ]', 'Loading approved tool registry...'],
    ['[  OK  ]', 'Initializing session controls...'],
    ['[  OK  ]', 'Console ready.']
  ];

  const body = $('#bootBody');
  body.innerHTML = '';

  for (const [tag, text] of steps) {
    const element = document.createElement('div');
    element.className = 'boot-line';
    element.innerHTML = `<span class="ok">${escapeHtml(tag)}</span> ${escapeHtml(text)}`;
    body.appendChild(element);
    await new Promise((resolve) => setTimeout(resolve, 90));
  }

  await new Promise((resolve) => setTimeout(resolve, 180));
  $('#boot').classList.add('done');

  const session = readJson(sessionStorage, KEY.session, null);
  if (
    session?.username === ADMIN_USERNAME
    && session?.token
    && await validateBackendSession(session.token)
  ) launch();
  else showGate();
}

$('#createVaultBtn').onclick = createVault;
$('#unlockBtn').onclick = unlock;
$('#clearBtn').onclick = clearTerminal;
$('#helpBtn').onclick = () => help();

$('#terminalForm').onsubmit = (event) => {
  event.preventDefault();
  const input = $('#commandInput');
  const value = input.value;
  input.value = '';
  run(value);
};

$('#commandInput').onkeydown = (event) => {
  if (event.key === 'ArrowUp') {
    event.preventDefault();
    if (!history.length) return;
    historyIndex = Math.max(0, historyIndex - 1);
    event.target.value = history[historyIndex] || '';
  } else if (event.key === 'ArrowDown') {
    event.preventDefault();
    historyIndex = Math.min(history.length, historyIndex + 1);
    event.target.value = historyIndex === history.length ? '' : history[historyIndex] || '';
  } else if (event.key === 'Tab') {
    event.preventDefault();
    autocomplete();
  } else if (event.ctrlKey && event.key.toLowerCase() === 'l') {
    event.preventDefault();
    clearTerminal();
  } else if (event.ctrlKey && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    showGate();
  }
};

['setupPassword', 'setupConfirm'].forEach((id) => {
  $(`#${id}`).onkeydown = (event) => { if (event.key === 'Enter') createVault(); };
});

$('#loginPassword').onkeydown = (event) => { if (event.key === 'Enter') unlock(); };

document.addEventListener('contextmenu', (event) => {
  if (event.target.closest('#gate, #app')) {
    event.preventDefault();
    toast('Restricted interface.');
  }
});

document.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();
  const blocked = event.key === 'F12'
    || (event.ctrlKey && event.shiftKey && ['i', 'j', 'c'].includes(key))
    || (event.ctrlKey && key === 'u');

  if (blocked) {
    event.preventDefault();
    toast('Restricted interface.');
  }
});

document.addEventListener('click', (event) => {
  if (!$('#app').classList.contains('hidden') && !event.target.closest('button,a,input,textarea')) $('#commandInput').focus();
});

// sessionStorage automatically clears the access token when the tab closes.
boot();
