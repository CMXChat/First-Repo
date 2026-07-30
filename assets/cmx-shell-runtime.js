const MANUAL = {
  help: ['Show command categories or documentation.', 'Usage: help [command]'],
  man: ['Open the manual page for one command.', 'Usage: man <command>'],
  ls: ['List virtual filesystem entries.', 'Usage: ls [path]'],
  cd: ['Change virtual directory.', 'Usage: cd <path> | cd -'],
  tree: ['Display one level of the virtual filesystem.', 'Usage: tree [path]'],
  cat: ['Read a virtual file, case, note, bookmark, or tool record.', 'Usage: cat <path>'],
  open: ['Open a route, directory, virtual file, bookmark, or URL.', 'Usage: open <target>'],
  osint: ['Access the OSINT tool namespace.', 'Usage: osint list | osint open | osint <tool>'],
  case: ['Manage local investigation workspaces.', 'Usage: case <new|list|use|current|show|note|link|status|timeline|report|export|delete>'],
  note: ['Manage independent local notes.', 'Usage: note add <text> | note list | note view <id> | note search <term>'],
  bookmark: ['Manage local research links.', 'Usage: bookmark add <url> [title] | bookmark list | bookmark open <id>'],
  history: ['Review or search command history.', 'Usage: history | history search <term> | history clear'],
  alias: ['Create shortcuts for commands.', 'Usage: alias set <name> <command> | alias list | alias remove <name>'],
  system: ['Inspect the command node.', 'Usage: system <status|routes|version|security|storage|uptime>'],
  focus: ['Set or read the current focus.', 'Usage: focus [text]'],
  export: ['Download terminal cases, notes, bookmarks, aliases, focus, and history.', 'Usage: export'],
  lock: ['Lock the terminal immediately.', 'Usage: lock']
};

function commandNames() {
  return [
    'help', 'man', 'commands', 'examples', 'clear', 'status', 'system', 'whoami', 'date', 'pwd', 'hostname',
    'ls', 'cd', 'back', 'tree', 'cat', 'open', 'osint', 'case', 'note', 'bookmark', 'history', 'alias',
    'focus', 'export', 'lock', 'reboot', 'fullscreen', 'matrix', 'python'
  ];
}

function help(command) {
  if (command) return manual(command);
  line('CMX SHELL COMMANDS', 'success');
  line('DISCOVER', 'warning');
  line('help · man · commands · examples');
  line('NAVIGATE', 'warning');
  line('pwd · ls · cd · back · tree · cat · open');
  line('OPERATE', 'warning');
  line('osint · case · note · bookmark · focus');
  line('SYSTEM', 'warning');
  line('status · system · history · alias · export · clear · lock · reboot');
  line('Use ↑/↓ for history, Tab to autocomplete, and && to chain commands.', 'dim');
}

function manual(name) {
  const key = String(name || '').toLowerCase();
  const page = MANUAL[key];
  if (!page) return line(`No manual entry for: ${key}`, 'error');
  line(key.toUpperCase(), 'success');
  page.forEach((item) => line(item));
}

function examples() {
  const rows = [
    ['Explore tools', 'cd tools && ls'],
    ['Open OSINT menu', 'osint open'],
    ['Create a case', 'case new sample investigation'],
    ['Select a case', 'case use sample-investigation'],
    ['Add case note', 'case note Subject reused username example123'],
    ['Add case link', 'case link https://example.com Primary source'],
    ['Save a note', 'note add Call the client tomorrow'],
    ['Save a bookmark', 'bookmark add https://example.com Research source'],
    ['Create alias', 'alias set c case current'],
    ['Inspect security', 'system security'],
    ['Read system file', 'cat /system/about']
  ];
  printRows(rows, ['GOAL', 'COMMAND']);
}

function downloadJson(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function exportData() {
  downloadJson(`cmx-terminal-backup-${new Date().toISOString().slice(0, 10)}.json`, {
    exportedAt: new Date().toISOString(),
    focus: localStorage.getItem(KEY.focus) || '',
    cases: casesStore(),
    currentCase: currentCaseId(),
    notes: notesStore(),
    bookmarks: bookmarksStore(),
    aliases: aliasesStore(),
    terminalHistory: history,
    cwd
  });
  line('Terminal data backup exported.', 'success');
}

function levenshtein(a, b) {
  const matrix = Array.from({ length: b.length + 1 }, (_, index) => [index]);
  for (let index = 0; index <= a.length; index += 1) matrix[0][index] = index;
  for (let row = 1; row <= b.length; row += 1) {
    for (let column = 1; column <= a.length; column += 1) {
      matrix[row][column] = b[row - 1] === a[column - 1]
        ? matrix[row - 1][column - 1]
        : Math.min(matrix[row - 1][column - 1] + 1, matrix[row][column - 1] + 1, matrix[row - 1][column] + 1);
    }
  }
  return matrix[b.length][a.length];
}

function suggestion(input) {
  const options = [...commandNames(), ...Object.keys(ROUTES), ...Object.keys(aliasesStore())];
  return options
    .map((name) => ({ name, distance: levenshtein(input, name) }))
    .sort((a, b) => a.distance - b.distance)[0];
}

async function execute(raw, aliasDepth = 0) {
  const tokens = tokenize(raw);
  if (!tokens.length) return;
  const aliases = aliasesStore();
  const first = tokens[0].toLowerCase();
  if (aliases[first] && aliasDepth < 5) {
    return execute(`${aliases[first]} ${tokens.slice(1).join(' ')}`.trim(), aliasDepth + 1);
  }

  const base = first;
  const args = tokens.slice(1);
  const remainder = args.join(' ');

  if (ROUTES[base]) return openRoute(base);

  switch (base) {
    case 'help': return help(args[0]);
    case '?': return help(args[0]);
    case 'man': return manual(args[0]);
    case 'commands': return printRows(commandNames().map((name) => [name, MANUAL[name]?.[0] || 'Built-in command']), ['COMMAND', 'DESCRIPTION']);
    case 'examples': return examples();
    case 'clear':
    case 'cls': return clearTerminal();
    case 'status': return statusLines().forEach((item) => line(item));
    case 'system': return systemCommand(args);
    case 'whoami': return line(`${user} // authenticated CMX operator`, 'success');
    case 'date': return line(new Date().toString(), 'info');
    case 'pwd': return line(cwd, 'info');
    case 'hostname': return line('db.cmxchat.com');
    case 'ls': return listPath(args[0]);
    case 'cd': return changeDirectory(args[0] || '/');
    case 'back': return changeDirectory('-');
    case 'tree': return tree(args[0]);
    case 'cat': {
      if (!args[0]) return line('Usage: cat <path>', 'error');
      const content = catContent(args[0]);
      if (!content) return line(`cat: ${args[0]}: no such file`, 'error');
      return content.forEach((item) => line(item));
    }
    case 'open': return openTarget(args[0]);
    case 'osint': return osintCommand(args);
    case 'case': return caseCommand(args);
    case 'note': return noteCommand(args);
    case 'bookmark': return bookmarkCommand(args);
    case 'history': return historyCommand(args);
    case 'alias': return aliasCommand(args);
    case 'unalias': return aliasCommand(['remove', args[0]]);
    case 'focus':
      if (!remainder) return line(localStorage.getItem(KEY.focus) || 'No current focus set.', 'info');
      localStorage.setItem(KEY.focus, remainder);
      return line(`Focus set: ${remainder}`, 'success');
    case 'export': return exportData();
    case 'lock': return showGate();
    case 'reboot': return location.reload();
    case 'fullscreen': return fullscreen();
    case 'matrix':
      document.body.classList.toggle('matrix-mode');
      return line(`Matrix display ${document.body.classList.contains('matrix-mode') ? 'enabled' : 'disabled'}.`, 'success');
    case 'python':
    case 'python3': return line('Python execution begins after the FastAPI server migration. This shell is the command front end.', 'warning');
    case 'sudo': return line(`${user} is not in the sudoers file. This incident has been reported to absolutely nobody.`, 'warning');
    default: {
      line(`cmx-shell: command not found: ${base}`, 'error');
      const match = suggestion(base);
      if (match && match.distance <= Math.max(2, Math.floor(base.length / 3))) line(`Did you mean: ${match.name}?`, 'dim');
      else line('Type "help" for available commands.', 'dim');
    }
  }
}

async function run(raw) {
  const command = raw.trim();
  if (!command) return;
  echo(command);
  history.push(command);
  history = history.slice(-120);
  save(KEY.history, history);
  historyIndex = history.length;
  for (const segment of splitChain(command)) {
    await execute(segment);
  }
}

function autocomplete() {
  const input = $('#commandInput');
  const value = input.value;
  const tokens = tokenize(value);
  if (!tokens.length) return;
  const currentToken = tokens[tokens.length - 1].toLowerCase();
  const prefix = value.slice(0, value.lastIndexOf(tokens[tokens.length - 1]));
  const pathEntries = fsEntries(cwd)?.map((item) => item.name) || [];
  const options = [...new Set([...commandNames(), ...Object.keys(ROUTES), ...Object.keys(aliasesStore()), ...pathEntries])];
  const matches = options.filter((item) => item.startsWith(currentToken));
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

function toast(text) {
  const element = $('#toast');
  element.textContent = text;
  element.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => element.classList.remove('show'), 3000);
}

async function boot() {
  const steps = [
    ['[  OK  ]', 'Starting CMX secure command node...'],
    ['[  OK  ]', 'Mounting local operator vault...'],
    ['[  OK  ]', 'Loading Web Crypto PBKDF2 module...'],
    ['[  OK  ]', 'Registering command namespace...'],
    ['[  OK  ]', 'Mounting virtual filesystem...'],
    ['[  OK  ]', 'Indexing cases, notes, bookmarks, aliases, and history...'],
    ['[  OK  ]', 'Registering OSINT route manifest...'],
    ['[ INFO ]', 'Python adapter: interface ready, backend pending...'],
    ['[ WARN ]', 'Static security mode active until FastAPI migration...'],
    ['[  OK  ]', 'CMX node ready.']
  ];

  const body = $('#bootBody');
  for (const [tag, text] of steps) {
    const element = document.createElement('div');
    element.className = 'boot-line';
    const className = tag.includes('OK') ? 'ok' : tag.includes('WARN') ? 'warn' : 'info';
    element.innerHTML = `<span class="${className}">${escapeHtml(tag)}</span> ${escapeHtml(text)}`;
    body.appendChild(element);
    await new Promise((resolve) => setTimeout(resolve, 88));
  }

  await new Promise((resolve) => setTimeout(resolve, 220));
  $('#boot').classList.add('done');

  let session = null;
  try { session = JSON.parse(sessionStorage.getItem(KEY.session)); } catch { session = null; }
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
  $(`#${id}`).onkeydown = (event) => {
    if (event.key === 'Enter') createVault();
  };
});

['loginUser', 'loginPassword'].forEach((id) => {
  $(`#${id}`).onkeydown = (event) => {
    if (event.key === 'Enter') unlock();
  };
});

document.addEventListener('click', (event) => {
  if (!$('#app').classList.contains('hidden') && !event.target.closest('button,a,input,textarea')) {
    $('#commandInput').focus();
  }
});

if (!FS_ROOTS.includes(cwd.split('/')[1] || '')) cwd = '/';
boot();
