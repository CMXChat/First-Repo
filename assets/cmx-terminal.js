'use strict';

const $ = (selector) => document.querySelector(selector);

const KEY = {
  auth: 'cmx_auth_v4',
  focus: 'cmx_focus_v3',
  notes: 'cmx_notes_v3',
  hist: 'cmx_terminal_history_v3',
  session: 'cmx_session_v3'
};

const ROUTES = {
  menu: ['/menu', 'OSINT visual menu', 'core'],
  entry: ['/entry', 'Workspace selector', 'core'],
  osint: ['/osint', 'OSINT console', 'tools'],
  phone: ['/phone', 'Phone intelligence', 'tools'],
  workspace: ['/workspace', 'Case workspace', 'tools'],
  metadata: ['/metadata', 'Metadata extractor', 'tools'],
  report: ['/report', 'Field report generator', 'tools'],
  resources: ['/resources', 'OSINT resource library', 'tools'],
  missing: ['/missing', 'Missing-person workflow', 'tools'],
  search: ['/search', 'Advanced search workbench', 'tools'],
  timeline: ['/timeline', 'Timeline builder', 'tools']
};

const ITERATIONS = 310000;
const IDLE_MS = 20 * 60 * 1000;

let user = 'operator';
let history = read(KEY.hist, []);
let historyIndex = history.length;
let idleTimer;
let toastTimer;

function read(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function base64(bytes) {
  let output = '';
  bytes.forEach((byte) => { output += String.fromCharCode(byte); });
  return btoa(output);
}

function fromBase64(value) {
  return Uint8Array.from(atob(value), (char) => char.charCodeAt(0));
}

async function deriveVerifier(password, salt, iterations = ITERATIONS) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );

  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations },
    key,
    256
  );

  return base64(new Uint8Array(bits));
}

function constantTimeEqual(a, b) {
  if (a.length !== b.length) return false;
  let difference = 0;
  for (let index = 0; index < a.length; index += 1) {
    difference |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }
  return difference === 0;
}

function authData() {
  return read(KEY.auth, null);
}

function gateMessage(text, type = 'muted') {
  const output = $('#gateOutput');
  output.textContent = text;
  output.className = `gate-output ${type}`;
}

function showGate() {
  clearTimeout(idleTimer);
  $('#app').classList.add('hidden');
  $('#gate').classList.remove('hidden');
  sessionStorage.removeItem(KEY.session);

  const auth = authData();
  const setup = !auth;
  $('#setupFields').classList.toggle('hidden', !setup);
  $('#loginFields').classList.toggle('hidden', setup);
  $('#gateTitle').textContent = setup ? 'Initialize secure local access' : 'Authentication required';
  $('#gateCopy').textContent = setup
    ? 'Create a callsign and password for this device. The password itself will not be saved.'
    : 'Unlock the local CMX control shell.';

  if (auth) $('#loginUser').value = auth.username || '';
  setTimeout(() => $(setup ? '#setupUser' : '#loginPassword').focus(), 80);
}

async function createVault() {
  const username = $('#setupUser').value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '')
    .slice(0, 24);
  const password = $('#setupPassword').value;
  const confirmation = $('#setupConfirm').value;

  if (username.length < 2) return gateMessage('Callsign must contain at least two letters or numbers.', 'bad');
  if (password.length < 12) return gateMessage('Use at least 12 characters. A longer passphrase is better.', 'bad');
  if (password !== confirmation) return gateMessage('Password confirmation does not match.', 'bad');

  gateMessage('Generating salted verifier...', 'info');

  try {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const hash = await deriveVerifier(password, salt);
    save(KEY.auth, {
      version: 4,
      username,
      salt: base64(salt),
      hash,
      iterations: ITERATIONS,
      failures: 0,
      lockedUntil: 0,
      createdAt: new Date().toISOString()
    });
    sessionStorage.setItem(KEY.session, JSON.stringify({ username, at: Date.now() }));
    gateMessage('Vault initialized. Opening command node...', 'ok');
    setTimeout(() => launch(username), 420);
  } catch (error) {
    gateMessage(error.message || 'Unable to initialize local vault.', 'bad');
  }
}

async function unlock() {
  const auth = authData();
  if (!auth) return showGate();

  const secondsRemaining = Math.ceil((Number(auth.lockedUntil || 0) - Date.now()) / 1000);
  if (secondsRemaining > 0) {
    return gateMessage(`Too many failed attempts. Local lockout: ${secondsRemaining}s.`, 'bad');
  }

  const username = $('#loginUser').value.trim().toLowerCase();
  const password = $('#loginPassword').value;
  if (!username || !password) return gateMessage('Enter your callsign and password.', 'bad');

  gateMessage('Deriving verifier...', 'info');

  try {
    const candidate = await deriveVerifier(password, fromBase64(auth.salt), auth.iterations || ITERATIONS);
    const valid = username === auth.username && constantTimeEqual(candidate, auth.hash);
    $('#loginPassword').value = '';

    if (!valid) {
      auth.failures = Number(auth.failures || 0) + 1;
      const lockSeconds = auth.failures >= 8 ? 300 : auth.failures >= 5 ? 30 : 0;
      auth.lockedUntil = lockSeconds ? Date.now() + lockSeconds * 1000 : 0;
      save(KEY.auth, auth);
      return gateMessage(
        lockSeconds ? `Access denied. Locked for ${lockSeconds} seconds.` : `Access denied. Attempt ${auth.failures}.`,
        'bad'
      );
    }

    auth.failures = 0;
    auth.lockedUntil = 0;
    auth.lastLogin = new Date().toISOString();
    save(KEY.auth, auth);
    sessionStorage.setItem(KEY.session, JSON.stringify({ username: auth.username, at: Date.now() }));
    gateMessage('Access granted. Mounting workspace...', 'ok');
    setTimeout(() => launch(auth.username), 320);
  } catch (error) {
    gateMessage(error.message || 'Authentication failed.', 'bad');
  }
}

function resetVault() {
  if (prompt('Type RESET to delete this browser’s CMX login, notes, focus, and terminal history.') !== 'RESET') return;
  Object.values(KEY).forEach((key) => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });
  location.reload();
}

function resetIdleTimer() {
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    toast('Session locked after 20 minutes of inactivity.');
    showGate();
  }, IDLE_MS);
}

function launch(name) {
  user = name || 'operator';
  $('#gate').classList.add('hidden');
  $('#app').classList.remove('hidden');
  $('#promptUser').textContent = user;
  $('#terminalTitle').textContent = `${user}@cmx:~ · cmx-shell`;
  clearTerminal();
  line('CMX COMMAND NODE v1.1.0', 'success');
  line(`Authenticated operator: ${user}`, 'info');
  line('Interface mode: static browser shell // FastAPI backend pending', 'warning');
  line('Type "help" for available commands.', 'dim');
  line('');
  resetIdleTimer();
  setTimeout(() => $('#commandInput').focus(), 80);
}

['pointerdown', 'keydown', 'touchstart'].forEach((eventName) => {
  document.addEventListener(eventName, () => {
    if (!$('#app').classList.contains('hidden')) resetIdleTimer();
  }, { passive: true });
});

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[char]));
}

function line(text = '', type = '') {
  const element = document.createElement('div');
  element.className = `terminal-line ${type}`;
  element.textContent = text;
  $('#terminalOutput').appendChild(element);
  $('#terminalOutput').scrollTop = $('#terminalOutput').scrollHeight;
  return element;
}

function htmlLine(content, type = '') {
  const element = line('', type);
  element.innerHTML = content;
  return element;
}

function echo(command) {
  htmlLine(
    `<span class="prompt-user">${escapeHtml(user)}</span>@<span class="prompt-host">cmx</span>:<span class="prompt-path">~</span>$ ${escapeHtml(command)}`,
    'command'
  );
}

function clearTerminal() {
  $('#terminalOutput').innerHTML = '';
}

function openRoute(key) {
  const route = ROUTES[key];
  if (!route) return line(`Unknown route: ${key}`, 'error');
  line(`Opening ${route[1]}: ${route[0]}`, 'info');
  setTimeout(() => { location.href = route[0]; }, 260);
}

function listRoutes(group) {
  const rows = Object.entries(ROUTES).filter(([, route]) => !group || route[2] === group);
  const table = document.createElement('table');
  table.className = 'terminal-table';
  table.innerHTML = '<thead><tr><th>COMMAND</th><th>PATH</th><th>FUNCTION</th></tr></thead><tbody>'
    + rows.map(([key, route]) => `<tr><td>${escapeHtml(key)}</td><td>${escapeHtml(route[0])}</td><td>${escapeHtml(route[1])}</td></tr>`).join('')
    + '</tbody>';
  $('#terminalOutput').appendChild(table);
  $('#terminalOutput').scrollTop = $('#terminalOutput').scrollHeight;
}

function help() {
  line('CMX SHELL COMMANDS', 'success');
  line('SYSTEM', 'warning');
  line('help · status · whoami · date · pwd · hostname · clear · lock · reboot');
  line('NAVIGATION', 'warning');
  line('menu · entry · osint · phone · workspace · metadata · report');
  line('resources · missing · search · timeline');
  line('USE', 'warning');
  line('open <route> · ls · ls tools · ls core');
  line('MEMORY', 'warning');
  line('focus · focus <text> · note <text> · notes · export');
  line('Use ↑/↓ for history and Tab for autocomplete.', 'dim');
}

function status() {
  line('NODE STATUS', 'success');
  line('Host: db.cmxchat.com');
  line(`Operator: ${user}`);
  line('Interface: static browser shell');
  line('Python backend: pending FastAPI deployment', 'warning');
  line(`Local auth: PBKDF2-SHA256 / ${ITERATIONS.toLocaleString()} iterations`);
  line('Auto-lock: 20 minutes idle');
  line(`Available routes: ${Object.keys(ROUTES).length}`);
}

function notes() {
  return read(KEY.notes, []);
}

function exportData() {
  const data = {
    exportedAt: new Date().toISOString(),
    focus: localStorage.getItem(KEY.focus) || '',
    notes: notes(),
    terminalHistory: history
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `cmx-terminal-backup-${new Date().toISOString().slice(0, 10)}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
  line('Terminal data backup exported.', 'success');
}

function run(raw) {
  const command = raw.trim().replace(/\s+/g, ' ');
  if (!command) return;

  echo(command);
  history.push(command);
  history = history.slice(-80);
  save(KEY.hist, history);
  historyIndex = history.length;

  const [first, ...args] = command.split(' ');
  const base = first.toLowerCase();
  const remainder = args.join(' ');

  if (ROUTES[base]) return openRoute(base);

  switch (base) {
    case 'help':
    case '?':
      return help();
    case 'clear':
    case 'cls':
      return clearTerminal();
    case 'status':
      return status();
    case 'whoami':
      return line(`${user} // authenticated CMX operator`, 'success');
    case 'date':
      return line(new Date().toString(), 'info');
    case 'pwd':
      return line('/home/cmx/operator');
    case 'hostname':
      return line('db.cmxchat.com');
    case 'python':
    case 'python3':
      return line('Python execution begins after the FastAPI server migration. This interface is the front end.', 'warning');
    case 'ls':
      return listRoutes(args[0]);
    case 'open':
      return args[0] ? openRoute(args[0].toLowerCase()) : line('Usage: open <route>', 'error');
    case 'focus':
      if (!remainder) return line(localStorage.getItem(KEY.focus) || 'No current focus set.', 'info');
      localStorage.setItem(KEY.focus, remainder);
      return line(`Focus set: ${remainder}`, 'success');
    case 'note': {
      if (!remainder) return line('Usage: note <text>', 'error');
      const savedNotes = notes();
      savedNotes.push({ at: new Date().toISOString(), text: remainder });
      save(KEY.notes, savedNotes.slice(-50));
      return line('Local note saved.', 'success');
    }
    case 'notes': {
      const savedNotes = notes();
      if (!savedNotes.length) return line('No saved notes.', 'dim');
      savedNotes.slice(-12).forEach((item, index) => {
        line(`${index + 1}. [${new Date(item.at).toLocaleString()}] ${item.text}`);
      });
      return;
    }
    case 'export':
      return exportData();
    case 'lock':
      return showGate();
    case 'reboot':
      return location.reload();
    case 'fullscreen':
      return fullscreen();
    case 'matrix':
      document.body.classList.toggle('matrix-mode');
      return line(`Matrix display ${document.body.classList.contains('matrix-mode') ? 'enabled' : 'disabled'}.`, 'success');
    case 'sudo':
      return line(`${user} is not in the sudoers file. This incident has been reported to absolutely nobody.`, 'warning');
    default:
      line(`cmx-shell: command not found: ${base}`, 'error');
      return line('Type "help" for available commands.', 'dim');
  }
}

function autocomplete() {
  const input = $('#commandInput');
  const value = input.value.trim().toLowerCase();
  if (!value || value.includes(' ')) return;

  const commands = [
    ...Object.keys(ROUTES),
    'help', 'status', 'whoami', 'date', 'pwd', 'hostname', 'ls', 'open',
    'focus', 'note', 'notes', 'export', 'clear', 'lock', 'reboot',
    'fullscreen', 'matrix'
  ];
  const matches = commands.filter((command) => command.startsWith(value));
  if (matches.length === 1) input.value = `${matches[0]} `;
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
    ['[  OK  ]', 'Registering OSINT route manifest...'],
    ['[  OK  ]', 'Restoring terminal history and local notes...'],
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
    await new Promise((resolve) => setTimeout(resolve, 105));
  }

  await new Promise((resolve) => setTimeout(resolve, 250));
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
$('#helpBtn').onclick = help;

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

boot();
