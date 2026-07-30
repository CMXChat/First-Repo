'use strict';

const $ = (selector) => document.querySelector(selector);
const STARTED_AT = Date.now();

const KEY = {
  auth: 'cmx_auth_v4',
  session: 'cmx_session_v3'
};

const ROUTES = {
  menu: { path: '/menu', label: 'OSINT visual menu', group: 'core' },
  osint: { path: '/osint', label: 'OSINT console', group: 'tools' },
  phone: { path: '/phone', label: 'Phone intelligence', group: 'tools' },
  workspace: { path: '/workspace', label: 'Case workspace', group: 'tools' },
  metadata: { path: '/metadata', label: 'Metadata extractor', group: 'tools' },
  report: { path: '/report', label: 'Field report generator', group: 'tools' },
  resources: { path: '/resources', label: 'OSINT resource library', group: 'tools' },
  missing: { path: '/missing', label: 'Missing-person workflow', group: 'tools' },
  search: { path: '/search', label: 'Advanced search workbench', group: 'tools' },
  timeline: { path: '/timeline', label: 'Timeline builder', group: 'tools' }
};

const ITERATIONS = 310000;
const IDLE_MS = 20 * 60 * 1000;

let user = 'operator';
let history = [];
let historyIndex = 0;
let idleTimer;
let toastTimer;
let activeRequests = 0;

function readJson(storage, key, fallback) {
  try {
    const value = storage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(storage, key, value) {
  storage.setItem(key, JSON.stringify(value));
}

function toBase64(bytes) {
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
  return toBase64(new Uint8Array(bits));
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
  return readJson(localStorage, KEY.auth, null);
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
    : 'Unlock the CMX operator console.';

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
    writeJson(localStorage, KEY.auth, {
      version: 4,
      username,
      salt: toBase64(salt),
      hash,
      iterations: ITERATIONS,
      failures: 0,
      lockedUntil: 0,
      createdAt: new Date().toISOString()
    });
    writeJson(sessionStorage, KEY.session, { username, at: Date.now() });
    gateMessage('Vault initialized. Opening operator console...', 'ok');
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
      writeJson(localStorage, KEY.auth, auth);
      return gateMessage(
        lockSeconds ? `Access denied. Locked for ${lockSeconds} seconds.` : `Access denied. Attempt ${auth.failures}.`,
        'bad'
      );
    }

    auth.failures = 0;
    auth.lockedUntil = 0;
    auth.lastLogin = new Date().toISOString();
    writeJson(localStorage, KEY.auth, auth);
    writeJson(sessionStorage, KEY.session, { username: auth.username, at: Date.now() });
    gateMessage('Access granted. Starting operator console...', 'ok');
    setTimeout(() => launch(auth.username), 320);
  } catch (error) {
    gateMessage(error.message || 'Authentication failed.', 'bad');
  }
}

function resetVault() {
  if (prompt('Type RESET to delete this browser’s CMX login.') !== 'RESET') return;
  localStorage.removeItem(KEY.auth);
  sessionStorage.removeItem(KEY.session);
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
  history = [];
  historyIndex = 0;
  $('#gate').classList.add('hidden');
  $('#app').classList.remove('hidden');
  $('#promptUser').textContent = user;
  $('#terminalTitle').textContent = `${user}@cmx:~ · operator-console`;
  clearTerminal();
  line('CMX OPERATOR CONSOLE v3.0.0', 'success');
  line(`Authenticated operator: ${user}`, 'info');
  line('Operations, tool control, runbooks, data utilities, and intelligence launchers online.', 'info');
  line('Termux agent: DISCONNECTED', 'warning');
  line('Type "help" for systems or "examples" for working commands.', 'dim');
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

function echo(command) {
  htmlLine(
    `<span class="prompt-user">${escapeHtml(user)}</span>@<span class="prompt-host">cmx</span>:<span class="prompt-path">~</span>$ ${escapeHtml(command)}`,
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

function printRows(rows, headers) {
  if (!rows.length) return line('No results.', 'dim');
  const table = document.createElement('table');
  table.className = 'terminal-table';
  table.innerHTML = `<thead><tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join('')}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`).join('')}</tbody>`;
  $('#terminalOutput').appendChild(table);
  $('#terminalOutput').scrollTop = $('#terminalOutput').scrollHeight;
}

function formatDuration(milliseconds) {
  const seconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remaining = seconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remaining).padStart(2, '0')}`;
}

function toast(text) {
  const element = $('#toast');
  element.textContent = text;
  element.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => element.classList.remove('show'), 3000);
}

function startRequest(label) {
  activeRequests += 1;
  line(`[RUN] ${label}`, 'info');
}

function endRequest() {
  activeRequests = Math.max(0, activeRequests - 1);
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 12000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      cache: 'no-store',
      redirect: 'follow',
      ...options,
      signal: controller.signal
    });
  } finally {
    clearTimeout(timeout);
  }
}
