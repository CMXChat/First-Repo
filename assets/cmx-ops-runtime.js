'use strict';

const MANUAL = {
  help: ['Show the operator-console systems.', 'Usage: help [command]'],
  site: ['Inspect and maintain pages on db.cmxchat.com.', 'Usage: site <status|routes|check|indexability|robots|sitemap|broken-links> [target]'],
  tools: ['List, test, describe, or open CMX tools.', 'Usage: tools <list|status|open|describe> [tool]'],
  monitor: ['Run current health checks across known CMX tool routes.', 'Usage: monitor <status|tools|all>'],
  repo: ['Read current public GitHub repository and latest-commit information.', 'Usage: repo <status|latest>'],
  termux: ['Inspect the planned private Termux agent bridge.', 'Usage: termux <status|capabilities|architecture>'],
  intel: ['Build a responsible investigation plan for a target.', 'Usage: intel <domain|website|phone|email|username|image|file> <target>'],
  search: ['Build and open a focused public web search.', 'Usage: search <exact|site|username|email|domain|documents|images|mentions> <target>'],
  query: ['Generate platform-specific research queries.', 'Usage: query <google|github|reddit|linkedin|wayback|crt|shodan|censys> <target>'],
  osint: ['List or open existing CMX OSINT tools.', 'Usage: osint <list|open|phone|metadata|search|missing|resources|workspace|timeline|report>'],
  runbook: ['Display permanent CMX operational procedures.', 'Usage: runbook list | runbook <name>'],
  url: ['Inspect, encode, or decode a URL.', 'Usage: url <inspect|encode|decode> <value>'],
  hash: ['Generate a cryptographic digest from text.', 'Usage: hash <sha1|sha256|sha384|sha512> <text>'],
  base64: ['Encode or decode UTF-8 Base64 data.', 'Usage: base64 <encode|decode> <text>'],
  json: ['Format, validate, or minify JSON.', 'Usage: json <format|validate|minify> <json>'],
  timestamp: ['Show or convert timestamps.', 'Usage: timestamp now | timestamp convert <value>'],
  uuid: ['Generate a cryptographically random UUID.', 'Usage: uuid'],
  random: ['Generate a random URL-safe string.', 'Usage: random [length]'],
  diff: ['Compare two short text values word by word.', 'Usage: diff <first> -- <second>'],
  status: ['Show console, route, request, and Termux bridge status.', 'Usage: status'],
  open: ['Open a known CMX tool route.', 'Usage: open <tool>'],
  lock: ['Lock the console immediately.', 'Usage: lock']
};

function commandNames() {
  return [
    'help', 'man', 'commands', 'examples',
    'site', 'tools', 'monitor', 'repo', 'termux',
    'intel', 'search', 'query', 'osint',
    'url', 'hash', 'base64', 'json', 'timestamp', 'uuid', 'random', 'diff',
    'runbook', 'open', 'status', 'whoami', 'date', 'hostname',
    'clear', 'lock', 'reboot', 'fullscreen', 'matrix'
  ];
}

function help(command) {
  if (command) return manual(command);
  line('CMX OPERATOR CONSOLE', 'success');
  line('OPERATIONS', 'warning');
  line('site · tools · monitor · repo · termux');
  line('INTELLIGENCE', 'warning');
  line('intel · search · query · osint');
  line('DATA', 'warning');
  line('url · hash · base64 · json · timestamp · uuid · random · diff');
  line('KNOWLEDGE', 'warning');
  line('runbook · man · commands · examples');
  line('NAVIGATION', 'warning');
  line('menu · phone · metadata · workspace · report · resources · missing · timeline');
  line('SYSTEM', 'warning');
  line('status · whoami · date · hostname · clear · lock · reboot · fullscreen');
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
    ['Check the root page', 'site check /'],
    ['Check every tool route', 'tools status'],
    ['Inspect indexing', 'site indexability /metadata'],
    ['Inspect robots file', 'site robots'],
    ['Find broken links', 'site broken-links /menu'],
    ['Open a tool', 'tools open metadata'],
    ['View a procedure', 'runbook website-audit'],
    ['Inspect a URL', 'url inspect https://example.com/page?id=4'],
    ['Hash text', 'hash sha256 "CMX Chat"'],
    ['Format JSON', 'json format "{\\"name\\":\\"CMX\\"}"'],
    ['Build a username search', 'search username example123'],
    ['Generate GitHub queries', 'query github example.com'],
    ['Plan domain research', 'intel domain example.com'],
    ['Read Termux bridge plan', 'termux architecture'],
    ['Check deployment source', 'repo status']
  ], ['GOAL', 'COMMAND']);
}

function statusCommand() {
  printRows([
    ['Console', 'CMX Operator Console v3.0.0'],
    ['Host', location.host],
    ['Operator', user],
    ['Known routes', String(Object.keys(ROUTES).length)],
    ['Active requests', String(activeRequests)],
    ['Uptime', formatDuration(Date.now() - STARTED_AT)],
    ['Authentication', `PBKDF2-SHA256 / ${ITERATIONS.toLocaleString()} iterations`],
    ['Idle lock', '20 minutes'],
    ['Termux agent', 'DISCONNECTED'],
    ['Backend relay', 'not deployed']
  ], ['FIELD', 'VALUE']);
}

function osintCommand(args) {
  const action = (args[0] || 'list').toLowerCase();
  if (action === 'list') return printRows(routeRows(), ['TOOL', 'ROUTE', 'FUNCTION']);
  if (action === 'open' || action === 'menu') return openRoute('menu');
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
    case 'commands': return printRows(commandNames().map((name) => [name, MANUAL[name]?.[0] || 'Built-in command']), ['COMMAND', 'DESCRIPTION']);
    case 'examples': return examples();
    case 'site': return siteCommand(args);
    case 'tools': return toolsCommand(args);
    case 'monitor': return monitorCommand(args);
    case 'repo': return repoCommand(args);
    case 'termux': return termuxCommand(args);
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
    case 'open': return openRoute(args[0]);
    case 'status': return statusCommand();
    case 'whoami': return line(`${user} // authenticated CMX operator`, 'success');
    case 'date': return line(new Date().toString(), 'info');
    case 'hostname': return line(location.host);
    case 'clear':
    case 'cls': return clearTerminal();
    case 'lock': return showGate();
    case 'reboot': return location.reload();
    case 'fullscreen': return fullscreen();
    case 'matrix':
      document.body.classList.toggle('matrix-mode');
      return line(`Matrix display ${document.body.classList.contains('matrix-mode') ? 'enabled' : 'disabled'}.`, 'success');
    case 'sudo': return line(`${user} is not in the sudoers file. Good.`, 'warning');
    default:
      if (ROUTES[base]) return openRoute(base);
      line(`cmx-console: command not found: ${base}`, 'error');
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
  history = history.slice(-80);
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
  } catch {
    toast('Fullscreen is unavailable in this browser.');
  }
}

async function boot() {
  const steps = [
    ['[  OK  ]', 'Starting CMX operator console...'],
    ['[  OK  ]', 'Mounting local authentication vault...'],
    ['[  OK  ]', 'Loading Web Crypto module...'],
    ['[  OK  ]', 'Registering website operations system...'],
    ['[  OK  ]', 'Registering tool-control and monitoring systems...'],
    ['[  OK  ]', 'Loading runbooks and data utilities...'],
    ['[  OK  ]', 'Registering intelligence and search builders...'],
    ['[ INFO ]', 'Termux agent bridge: disconnected...'],
    ['[ WARN ]', 'Remote execution disabled until private relay pairing...'],
    ['[  OK  ]', 'CMX console ready.']
  ];
  const body = $('#bootBody');
  body.innerHTML = '';
  for (const [tag, text] of steps) {
    const element = document.createElement('div');
    element.className = 'boot-line';
    const className = tag.includes('OK') ? 'ok' : tag.includes('WARN') ? 'warn' : 'info';
    element.innerHTML = `<span class="${className}">${escapeHtml(tag)}</span> ${escapeHtml(text)}`;
    body.appendChild(element);
    await new Promise((resolve) => setTimeout(resolve, 82));
  }
  await new Promise((resolve) => setTimeout(resolve, 210));
  $('#boot').classList.add('done');
  const session = readJson(sessionStorage, KEY.session, null);
  const auth = authData();
  if (session?.username && auth?.username === session.username) launch(session.username);
  else showGate();
}

$('#createVaultBtn').onclick = createVault;
$('#unlockBtn').onclick = unlock;
$('#resetVaultBtn').onclick = resetVault;
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

['loginUser', 'loginPassword'].forEach((id) => {
  $(`#${id}`).onkeydown = (event) => { if (event.key === 'Enter') unlock(); };
});

document.addEventListener('click', (event) => {
  if (!$('#app').classList.contains('hidden') && !event.target.closest('button,a,input,textarea')) $('#commandInput').focus();
});

boot();
