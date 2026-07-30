'use strict';

const $ = (selector) => document.querySelector(selector);
const STARTED_AT = Date.now();
const ADMIN_USERNAME = 'admin';
const KEY = { auth: 'cmx_auth_v5', session: 'cmx_session_v4' };
const ITERATIONS = 600000;
const IDLE_MS = 10 * 60 * 1000;

const LEGACY_KEYS = [
  'cmx_auth_v4', 'cmx_session_v3', 'cmx_focus_v3', 'cmx_notes_v4',
  'cmx_bookmarks_v1', 'cmx_cases_v1', 'cmx_current_case_v1',
  'cmx_aliases_v1', 'cmx_terminal_history_v4', 'cmx_cwd_v1'
];
LEGACY_KEYS.forEach((key) => { localStorage.removeItem(key); sessionStorage.removeItem(key); });

const ROUTES = {
  menu: { path: '/menu', label: 'OSINT visual menu' },
  osint: { path: '/osint', label: 'OSINT console' },
  phone: { path: '/phone', label: 'Phone intelligence' },
  workspace: { path: '/workspace', label: 'Case workspace' },
  metadata: { path: '/metadata', label: 'Metadata extractor' },
  report: { path: '/report', label: 'Field report generator' },
  resources: { path: '/resources', label: 'OSINT resource library' },
  missing: { path: '/missing', label: 'Missing-person workflow' },
  search: { path: '/search', label: 'Advanced search workbench' },
  timeline: { path: '/timeline', label: 'Timeline builder' }
};

let user = ADMIN_USERNAME;
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
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations }, key, 256);
  return toBase64(new Uint8Array(bits));
}

function constantTimeEqual(a, b) {
  if (a.length !== b.length) return false;
  let difference = 0;
  for (let index = 0; index < a.length; index += 1) difference |= a.charCodeAt(index) ^ b.charCodeAt(index);
  return difference === 0;
}

function strongPassphrase(password) {
  if (password.length < 16) return false;
  const normalized = password.toLowerCase().replace(/[^a-z0-9]/g, '');
  const blocked = ['access', 'admin', 'password', 'passphrase', 'cmx', 'cmxchat', 'qwerty', 'letmein', '123456'];
  if (blocked.some((word) => normalized === word || normalized.startsWith(word))) return false;
  const classes = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter((pattern) => pattern.test(password)).length;
  return classes >= 3 || password.length >= 24;
}

function authData() {
  const auth = readJson(localStorage, KEY.auth, null);
  if (!auth || auth.version !== 5 || auth.username !== ADMIN_USERNAME) return null;
  return auth;
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

  const setup = !authData();
  $('#setupFields').classList.toggle('hidden', !setup);
  $('#loginFields').classList.toggle('hidden', setup);
  $('#gateTitle').textContent = setup ? 'Initialize restricted access' : 'Authentication required';
  $('#gateCopy').textContent = setup ? 'Create a strong private passphrase for admin.' : 'Authenticate to continue.';
  $('#setupUser').value = ADMIN_USERNAME;
  $('#loginUser').value = ADMIN_USERNAME;
  gateMessage('');
  setTimeout(() => $(setup ? '#setupPassword' : '#loginPassword').focus(), 80);
}

async function createVault() {
  const password = $('#setupPassword').value;
  const confirmation = $('#setupConfirm').value;
  if (!strongPassphrase(password)) return gateMessage('Use 16+ characters with mixed character types. Common words such as “access” are blocked.', 'bad');
  if (password !== confirmation) return gateMessage('Passphrase confirmation does not match.', 'bad');

  gateMessage('Establishing verifier...', 'info');
  try {
    const salt = crypto.getRandomValues(new Uint8Array(32));
    const hash = await deriveVerifier(password, salt);
    writeJson(localStorage, KEY.auth, {
      version: 5,
      username: ADMIN_USERNAME,
      salt: toBase64(salt),
      hash,
      iterations: ITERATIONS,
      failures: 0,
      lockedUntil: 0,
      createdAt: new Date().toISOString()
    });
    writeJson(sessionStorage, KEY.session, { username: ADMIN_USERNAME, at: Date.now() });
    $('#setupPassword').value = '';
    $('#setupConfirm').value = '';
    gateMessage('Access initialized.', 'ok');
    setTimeout(() => launch(), 320);
  } catch {
    gateMessage('Unable to initialize access.', 'bad');
  }
}

async function unlock() {
  const auth = authData();
  if (!auth) return showGate();
  const remaining = Math.ceil((Number(auth.lockedUntil || 0) - Date.now()) / 1000);
  if (remaining > 0) return gateMessage(`Access temporarily suspended. Retry in ${remaining}s.`, 'bad');

  const password = $('#loginPassword').value;
  if (!password) return gateMessage('Enter the admin passphrase.', 'bad');
  gateMessage('Verifying...', 'info');
  try {
    const candidate = await deriveVerifier(password, fromBase64(auth.salt), auth.iterations || ITERATIONS);
    const valid = constantTimeEqual(candidate, auth.hash);
    $('#loginPassword').value = '';
    if (!valid) {
      auth.failures = Number(auth.failures || 0) + 1;
      const lockSeconds = auth.failures >= 8 ? 3600 : auth.failures >= 5 ? 300 : auth.failures >= 3 ? 30 : 0;
      auth.lockedUntil = lockSeconds ? Date.now() + lockSeconds * 1000 : 0;
      writeJson(localStorage, KEY.auth, auth);
      return gateMessage(lockSeconds ? `Access denied. Suspended for ${lockSeconds}s.` : 'Access denied.', 'bad');
    }
    auth.failures = 0;
    auth.lockedUntil = 0;
    auth.lastLogin = new Date().toISOString();
    writeJson(localStorage, KEY.auth, auth);
    writeJson(sessionStorage, KEY.session, { username: ADMIN_USERNAME, at: Date.now() });
    gateMessage('Access granted.', 'ok');
    setTimeout(() => launch(), 240);
  } catch {
    gateMessage('Authentication failed.', 'bad');
  }
}

function resetIdleTimer() {
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    toast('Session locked.');
    showGate();
  }, IDLE_MS);
}

function launch() {
  user = ADMIN_USERNAME;
  history = [];
  historyIndex = 0;
  $('#gate').classList.add('hidden');
  $('#app').classList.remove('hidden');
  $('#promptUser').textContent = ADMIN_USERNAME;
  $('#terminalTitle').textContent = 'admin@node:~ · restricted-shell';
  clearTerminal();
  line('RESTRICTED OPERATOR NODE', 'success');
  line('Operator authenticated: admin', 'info');
  line('Policy controls active.', 'info');
  line('Type "help" for available systems.', 'dim');
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
  return String(value).replace(/[&<>\'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
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
  htmlLine(`<span class="prompt-user">admin</span>@<span class="prompt-host">node</span>:<span class="prompt-path">~</span>$ ${escapeHtml(command)}`, 'command');
}

function tokenize(input) {
  const tokens = [];
  let current = '';
  let quote = null;
  let escaped = false;
  for (const char of input.trim()) {
    if (escaped) { current += char; escaped = false; continue; }
    if (char === '\\') { escaped = true; continue; }
    if (quote) { if (char === quote) quote = null; else current += char; continue; }
    if (char === '"' || char === "'") { quote = char; continue; }
    if (/\s/.test(char)) { if (current) { tokens.push(current); current = ''; } continue; }
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
    if (quote) { current += char; if (char === quote && input[index - 1] !== '\\') quote = null; continue; }
    if (char === '"' || char === "'") { quote = char; current += char; continue; }
    if (char === '&' && next === '&') { if (current.trim()) parts.push(current.trim()); current = ''; index += 1; continue; }
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
  toastTimer = setTimeout(() => element.classList.remove('show'), 2400);
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
    return await fetch(url, { cache: 'no-store', redirect: 'follow', credentials: 'same-origin', ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}
