'use strict';

const $ = (selector) => document.querySelector(selector);
const STARTED_AT = Date.now();

const KEY = {
  auth: 'cmx_auth_v4',
  focus: 'cmx_focus_v3',
  notes: 'cmx_notes_v4',
  bookmarks: 'cmx_bookmarks_v1',
  cases: 'cmx_cases_v1',
  currentCase: 'cmx_current_case_v1',
  aliases: 'cmx_aliases_v1',
  history: 'cmx_terminal_history_v4',
  cwd: 'cmx_cwd_v1',
  session: 'cmx_session_v3'
};

const ROUTES = {
  menu: ['/menu', 'OSINT visual menu', 'core'],
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

const FS_ROOTS = ['tools', 'cases', 'reports', 'notes', 'bookmarks', 'system'];
const ITERATIONS = 310000;
const IDLE_MS = 20 * 60 * 1000;

let user = 'operator';
let cwd = read(KEY.cwd, '/');
let previousCwd = '/';
let history = read(KEY.history, []);
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
  if (prompt('Type RESET to delete this browser’s CMX login and terminal data.') !== 'RESET') return;
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
  updatePrompt();
  clearTerminal();
  line('CMX COMMAND NODE v2.0.0', 'success');
  line(`Authenticated operator: ${user}`, 'info');
  line('Virtual filesystem mounted. Command registry online.', 'info');
  line('Python adapter pending FastAPI deployment.', 'warning');
  line('Type "help" to begin or "examples" for working patterns.', 'dim');
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
  return String(value).replace(/[&<>\'"]/g, (char) => ({
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

function clearTerminal() {
  $('#terminalOutput').innerHTML = '';
}

function displayPath(path = cwd) {
  if (path === '/') return '~';
  return `~${path}`;
}

function updatePrompt() {
  $('#terminalTitle').textContent = `${user}@cmx:${displayPath()} · cmx-shell`;
  const pathNode = $('.prompt-full .p');
  if (pathNode) pathNode.textContent = displayPath();
}

function echo(command) {
  htmlLine(
    `<span class="prompt-user">${escapeHtml(user)}</span>@<span class="prompt-host">cmx</span>:<span class="prompt-path">${escapeHtml(displayPath())}</span>$ ${escapeHtml(command)}`,
    'command'
  );
}

function tokenize(input) {
  const tokens = [];
  let current = '';
  let quote = null;
  let escaped = false;
  for (const char of input.trim()) {
    if (escaped) {
      current += char;
      escaped = false;
      continue;
    }
    if (char === '\\') {
      escaped = true;
      continue;
    }
    if (quote) {
      if (char === quote) quote = null;
      else current += char;
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }
    if (/\s/.test(char)) {
      if (current) {
        tokens.push(current);
        current = '';
      }
      continue;
    }
    current += char;
  }
  if (current) tokens.push(current);
  return tokens;
}

function splitChain(input) {
  const parts = [];
  let current = '';
  let quote = null;
  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    const next = input[index + 1];
    if (quote) {
      current += char;
      if (char === quote && input[index - 1] !== '\\') quote = null;
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      current += char;
      continue;
    }
    if (char === '&' && next === '&') {
      if (current.trim()) parts.push(current.trim());
      current = '';
      index += 1;
      continue;
    }
    current += char;
  }
  if (current.trim()) parts.push(current.trim());
  return parts;
}
