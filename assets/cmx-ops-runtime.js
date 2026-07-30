'use strict';

const MANUAL = {
  help: ['Show available operator systems.', 'Usage: help [command]'],
  site: ['Inspect approved local tool routes.', 'Usage: site <check|indexability> [approved-tool]'],
  tools: ['List, test, describe, or open approved tools.', 'Usage: tools <list|status|open|describe> [tool]'],
  monitor: ['Run health checks across approved tools.', 'Usage: monitor <status|tools|all>'],
  intel: ['Build a public-source research workflow.', 'Usage: intel <domain|website|phone|email|username|image|file> <target>'],
  search: ['Build and open a focused public search.', 'Usage: search <exact|site|username|email|domain|documents|images|mentions> <target>'],
  query: ['Generate research queries.', 'Usage: query <google|github|reddit|linkedin|wayback|crt> <target>'],
  osint: ['Open an approved CMX intelligence tool.', 'Usage: osint <list|open|phone|metadata|search|missing|resources|workspace|timeline|report>'],
  runbook: ['Display permanent operational procedures.', 'Usage: runbook list | runbook <name>'],
  url: ['Inspect, encode, or decode a URL.', 'Usage: url <inspect|encode|decode> <value>'],
  hash: ['Generate a cryptographic digest from text.', 'Usage: hash <sha1|sha256|sha384|sha512> <text>'],
  base64: ['Encode or decode UTF-8 Base64 data.', 'Usage: base64 <encode|decode> <text>'],
  json: ['Format, validate, or minify JSON.', 'Usage: json <format|validate|minify> <json>'],
  timestamp: ['Show or convert timestamps.', 'Usage: timestamp now | timestamp convert <value>'],
  uuid: ['Generate a random UUID.', 'Usage: uuid'],
  random: ['Generate a random URL-safe string.', 'Usage: random [length]'],
  diff: ['Compare two short text values.', 'Usage: diff <first> -- <second>'],
  ls: ['Display the restricted node namespace.', 'Usage: ls [-la] [path]'],
  tree: ['Display the restricted namespace map.', 'Usage: tree'],
  cd: ['Request access to a namespace.', 'Usage: cd <path>'],
  cat: ['Request a readable virtual resource.', 'Usage: cat <path>'],
  status: ['Show current session health.', 'Usage: status'],
  lock: ['Lock the console immediately.', 'Usage: lock']
};

const RESTRICTED_PATHS = new Set(['.vault', '.core', '.signals', '.archive', 'secrets', 'keys', 'config', 'private']);
let shellPath = '/srv/node';

function commandNames() {
  return [
    'help', 'man', 'commands', 'examples',
    'site', 'tools', 'monitor', 'intel', 'search', 'query', 'osint',
    'url', 'hash', 'base64', 'json', 'timestamp', 'uuid', 'random', 'diff',
    'runbook', 'ls', 'tree', 'pwd', 'cd', 'cat', 'open',
    'status', 'whoami', 'date', 'clear', 'lock', 'reboot', 'fullscreen', 'matrix'
  ];
}

function help(command) {
  if (command) return manual(command);
  line('CMX RESTRICTED OPERATOR NODE', 'success');
  line('OPERATIONS', 'warning');
  line('site · tools · monitor');
  line('INTELLIGENCE', 'warning');
  line('intel · search · query · osint');
  line('DATA', 'warning');
  line('url · hash · base64 · json · timestamp · uuid · random · diff');
  line('KNOWLEDGE', 'warning');
  line('runbook · man · commands · examples');
  line('NODE', 'warning');
  line('ls · tree · pwd · cd · cat · open');
  line('SYSTEM', 'warning');
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
    ['Check an approved tool', 'site check metadata'],
    ['Check tool health', 'tools status'],
    ['Inspect indexing', 'site indexability metadata'],
    ['Open a tool', 'tools open metadata'],
    ['View a procedure', 'runbook website-audit'],
    ['Inspect a URL', 'url inspect https://example.com/page?id=4'],
    ['Hash text', 'hash sha256 "CMX Chat"'],
    ['Format JSON', 'json format "{\\"name\\":\\"CMX\\"}"'],
    ['Build a username search', 'search username example123'],
    ['Plan domain research', 'intel domain example.com'],
    ['Inspect node namespace', 'ls -la'],
    ['Review restricted map', 'tree']
  ], ['GOAL', 'COMMAND']);
}

function statusCommand() {
  printRows([
    ['Node', 'ONLINE'],
    ['Operator', 'admin'],
    ['Session', 'authenticated'],
    ['Policy', 'enforced'],
    ['Active checks', String(activeRequests)],
    ['Uptime', formatDuration(Date.now() - STARTED_AT)]
  ], ['FIELD', 'VALUE']);
}

function osintCommand(args) {
  const action = (args[0] || 'list').toLowerCase();
  if (action === 'list') return toolsCommand(['list']);
  if (action === 'open' || action === 'menu') return openRoute('menu');
  return openRoute(action);
}

function virtualLs(args) {
  const long = args.includes('-la') || args.includes('-al') || args.includes('-a');
  if (long) {
    return [
      'drwxr-x---  tools/',
      'drwxr-x---  logs/',
      'drwx------  .vault/       [restricted]',
      'drwx------  .core/        [restricted]',
      'drwx------  .signals/     [restricted]',
      'drwx------  .archive/     [restricted]'
    ].forEach((item) => line(item));
  }
  line('tools/   logs/');
}

function virtualTree() {
  [
    '/srv/node',
    '├── tools/',
    '├── logs/',
    '├── .vault/      [policy restricted]',
    '├── .core/       [policy restricted]',
    '├── .signals/    [policy restricted]',
    '└── .archive/    [policy restricted]'
  ].forEach((item, index) => line(item, index === 0 ? 'success' : ''));
}

function accessDenied(target) {
  line(`access denied: ${target}`, 'error');
  line('[SEC] authorization boundary enforced', 'warning');
}

function virtualCd(args) {
  const target = (args[0] || '').replace(/^\.\//, '').replace(/\/$/, '');
  if (!target || target === '~' || target === '/srv/node') { shellPath = '/srv/node'; return line(shellPath, 'info'); }
  if (target === 'tools' || target === '/srv/node/tools') { shellPath = '/srv/node/tools'; return line(shellPath, 'info'); }
  if (target === 'logs' || target === '/srv/node/logs') { shellPath = '/srv/node/logs'; return line(shellPath, 'info'); }
  const leaf = target.split('/').filter(Boolean).pop() || target;
  if (RESTRICTED_PATHS.has(leaf) || target.startsWith('.')) return accessDenied(target);
  line(`cd: no such namespace: ${target}`, 'error');
}

function virtualCat(args) {
  const target = args.join(' ').trim();
  if (!target) return line('Usage: cat <path>', 'error');
  const lower = target.toLowerCase();
  if ([...RESTRICTED_PATHS].some((name) => lower.includes(name)) || /shadow|passwd|\.env|credential|token|secret|key/i.test(lower)) return accessDenied(target);
  if (lower.includes('logs')) {
    line('Log stream requires elevated policy scope.', 'warning');
    return;
  }
  line(`cat: ${target}: unavailable`, 'error');
}

function suggestion(input) {
  const candidates = [...new Set([...commandNames(), ...Object.keys(ROUTES), ...Object.keys(RUNBOOKS)])];
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
    case 'commands': return printRows(commandNames().map((name) => [name, MANUAL[name]?.[0] || 'Built-in command']), ['COMMAND', 'DESCRIPTION']);
    case 'examples': return examples();
    case 'site': return siteCommand(args);
    case 'tools': return toolsCommand(args);
    case 'monitor': return monitorCommand(args);
    case 'intel': return intelCommand(args);
    case 'search': return searchCommand(args);
    case 'query': return queryCommand(args);
    case 'osint': return osintCommand(args);
    case 'runbook': return runbookCommand(args);
    case 'url': return urlCommand(args);
    case 'hash': return hashCommand(args);
    case 'base64': return base64Command(args);
    case 'json': return jsonCommand(args);
    case 'timestamp': return timestampCommand(args);
    case 'uuid': return uuidCommand();
    case 'random': return randomCommand(args);
    case 'diff': return diffCommand(args);
    case 'ls': return virtualLs(args);
    case 'tree': return virtualTree();
    case 'pwd': return line(shellPath, 'info');
    case 'cd': return virtualCd(args);
    case 'cat': return virtualCat(args);
    case 'open': return openRoute(args[0]);
    case 'status': return statusCommand();
    case 'whoami': return line('admin // authorized operator', 'success');
    case 'date': return line(new Date().toString(), 'info');
    case 'clear':
    case 'cls': return clearTerminal();
    case 'lock': return showGate();
    case 'reboot': return location.reload();
    case 'fullscreen': return fullscreen();
    case 'matrix':
      document.body.classList.toggle('matrix-mode');
      return line(`Matrix display ${document.body.classList.contains('matrix-mode') ? 'enabled' : 'disabled'}.`, 'success');
    case 'sudo': return accessDenied('privileged execution');
    default:
      if (ROUTES[base]) return openRoute(base);
      if (RESTRICTED_PATHS.has(base) || base.startsWith('.')) return accessDenied(base);
      line(`restricted-shell: command not found: ${base}`, 'error');
      {
        const match = suggestion(base);
        if (match && match.distance <= Math.max(2, Math.floor(base.length / 3))) line(`Did you mean: ${match.candidate}?`, 'dim');
        else line('Type "help" for available systems.', 'dim');
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
  const options = [...new Set([...commandNames(), ...Object.keys(ROUTES), ...Object.keys(RUNBOOKS)])];
  const matches = options.filter((item) => item.startsWith(current));
  if (matches.length === 1) input.value = `${prefix}${matches[0]} `;
  else if (matches.length > 1) line(matches.join('   '), 'dim');
}

async function fullscreen() {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await document.documentElement.requestFullscreen();
  } catch { toast('Fullscreen unavailable.'); }
}

async function boot() {
  const steps = [
    ['[  OK  ]', 'Starting restricted node...'],
    ['[  OK  ]', 'Validating policy boundary...'],
    ['[  OK  ]', 'Mounting approved tool registry...'],
    ['[  OK  ]', 'Loading operator systems...'],
    ['[  OK  ]', 'Sealing restricted namespaces...'],
    ['[  OK  ]', 'Node ready.']
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
  if (session?.username === ADMIN_USERNAME && authData()) launch();
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
  const blocked = event.key === 'F12' || (event.ctrlKey && event.shiftKey && ['i', 'j', 'c'].includes(key)) || (event.ctrlKey && key === 'u');
  if (blocked) {
    event.preventDefault();
    toast('Restricted interface.');
  }
});

document.addEventListener('click', (event) => {
  if (!$('#app').classList.contains('hidden') && !event.target.closest('button,a,input,textarea')) $('#commandInput').focus();
});

window.addEventListener('pagehide', () => sessionStorage.removeItem(KEY.session));
boot();
