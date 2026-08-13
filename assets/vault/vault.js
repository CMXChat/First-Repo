'use strict';

(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const ITERATIONS = 600000;
  const SALT = 'AJZgvy6gSlaz4vmHmF/J+PeJu5chL1RdPrPxgAoM0WU=';
  const VERIFIER = 'kaxZz7+7WWXt5sr5vVdV5iwA2OF5xCZeIuJ93zUnXRs=';
  const STATE_KEY = 'cmx_vault_gate_state_v1';
  const SESSION_KEY = 'cmx_vault_session_v1';

  const boot = $('#boot');
  const bootBody = $('#bootBody');
  const gate = $('#gate');
  const app = $('#app');
  const passwordInput = $('#vaultPassword');
  const unlockButton = $('#unlockVault');
  const gateOutput = $('#gateOutput');
  const terminalOutput = $('#terminalOutput');
  const terminalForm = $('#terminalForm');
  const commandInput = $('#commandInput');
  const lockButton = $('#lockVault');
  const menuButton = $('#menuButton');
  const sidebar = $('#vaultSidebar');
  const backdrop = $('#sidebarBackdrop');
  const sessionBadge = $('#sessionId');

  const MODULES = {
    control: {
      label: 'Control deck',
      code: 'CTRL',
      description: 'Primary Vault 3.0 command surface. Modules are staged here before they become dedicated pages.'
    },
    people: {
      label: 'People',
      code: 'PPL',
      description: 'Member directory for identities, roles, handles, access notes, relationships and approved profile context.'
    },
    contacts: {
      label: 'Contacts',
      code: 'CNT',
      description: 'Shared contact book for useful people, organizations, introductions, context and follow-up history.'
    },
    network: {
      label: 'Network',
      code: 'NET',
      description: 'Relationship map showing who knows who, where clusters overlap and where introductions can create value.'
    },
    briefings: {
      label: 'Briefings',
      code: 'BRF',
      description: 'Structured server briefings for drama, changes, context, decisions, rumors, receipts and unresolved threads.'
    },
    news: {
      label: 'News wire',
      code: 'NWS',
      description: 'A curated news layer for stories the server cares about, with source links, summaries and member discussion context.'
    },
    timezones: {
      label: 'Timezones',
      code: 'TZ',
      description: 'Member-local clocks and overlap windows with automatic time conversion.'
    }
  };

  const bootLines = [
    '[vault-loader] mounting /vault',
    '[crypto] local gate verifier :: ready',
    '[interface] terminal renderer :: ready',
    '[network] relationship layer :: standby',
    '[briefings] intelligence queue :: standby',
    '[timezones] clock matrix :: synchronized',
    '[vault] access boundary :: armed',
    '',
    'VAULT 3.0 // RESTRICTED COMMUNITY NODE'
  ];

  function readJson(storage, key, fallback) {
    try {
      const value = storage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  }

  function writeJson(storage, key, value) {
    try {
      storage.setItem(key, JSON.stringify(value));
    } catch {
      // Hardened browser modes may disable storage. The page remains usable.
    }
  }

  function removeStorage(storage, key) {
    try {
      storage.removeItem(key);
    } catch {
      // Ignore unavailable storage.
    }
  }

  function fromBase64(value) {
    return Uint8Array.from(atob(value), (character) => character.charCodeAt(0));
  }

  async function deriveVerifier(password) {
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(password),
      'PBKDF2',
      false,
      ['deriveBits']
    );

    const bits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        hash: 'SHA-256',
        salt: fromBase64(SALT),
        iterations: ITERATIONS
      },
      key,
      256
    );

    return new Uint8Array(bits);
  }

  function constantTimeEqual(candidate, expected) {
    let difference = candidate.length ^ expected.length;
    const length = Math.max(candidate.length, expected.length);

    for (let index = 0; index < length; index += 1) {
      difference |= (candidate[index] || 0) ^ (expected[index] || 0);
    }

    return difference === 0;
  }

  function gateState() {
    return readJson(localStorage, STATE_KEY, { failures: 0, lockedUntil: 0 });
  }

  function saveGateState(state) {
    writeJson(localStorage, STATE_KEY, state);
  }

  function setGateMessage(message = '', tone = '') {
    gateOutput.textContent = message;
    gateOutput.className = `gate-output${tone ? ` ${tone}` : ''}`;
  }

  function sessionIsValid() {
    const session = readJson(sessionStorage, SESSION_KEY, null);
    return Boolean(session?.authorized && session?.at);
  }

  function createSessionId() {
    const bytes = new Uint8Array(4);
    if (crypto?.getRandomValues) crypto.getRandomValues(bytes);
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('').toUpperCase();
  }

  async function runBoot() {
    bootBody.textContent = '';

    bootLines.forEach((line, index) => {
      const row = document.createElement('div');
      row.className = 'boot-line';
      row.style.animationDelay = `${index * 78}ms`;
      row.textContent = line;
      bootBody.appendChild(row);
    });

    await new Promise((resolve) => setTimeout(resolve, 880));
    boot.classList.add('done');
    setTimeout(() => boot.remove(), 340);
  }

  function printLine(text, tone = '') {
    const line = document.createElement('div');
    line.className = `term-line${tone ? ` ${tone}` : ''}`;
    line.textContent = text;
    terminalOutput.appendChild(line);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }

  function printDivider() {
    printLine('────────────────────────────────────────────────────────', 'dim');
  }

  function printWelcome() {
    terminalOutput.textContent = '';
    printLine('VAULT 3.0 // COMMUNITY INTELLIGENCE TERMINAL', 'blue');
    printLine('Session authenticated. Interface layer online.', 'ok');
    printLine('Static demo data loaded. Private records begin with the secure server phase.', 'warn');
    printDivider();
    printLine('Type help to inspect available commands. Press / anywhere to focus the terminal.', 'dim');
  }

  function printModule(name) {
    const module = MODULES[name];
    if (!module) return;

    printDivider();
    printLine(`[${module.code}] ${module.label.toUpperCase()}`, 'blue');
    printLine(module.description);
    printLine('state: demo ready // live source queued', 'dim');
  }

  function openSidebar() {
    sidebar.classList.add('open');
    backdrop.classList.add('show');
    menuButton.setAttribute('aria-expanded', 'true');
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    backdrop.classList.remove('show');
    menuButton.setAttribute('aria-expanded', 'false');
  }

  function selectModule(name, announce = true) {
    if (!MODULES[name]) return;

    $$('.nav-item').forEach((button) => {
      button.classList.toggle('active', button.dataset.module === name);
    });

    if (announce) printModule(name);
    closeSidebar();
  }

  function launchVault() {
    gate.classList.add('hidden');
    app.classList.remove('hidden');
    app.removeAttribute('aria-hidden');
    document.body.dataset.vault = 'open';

    let session = readJson(sessionStorage, SESSION_KEY, null);
    if (!session?.id) {
      session = { authorized: true, at: Date.now(), id: createSessionId() };
      writeJson(sessionStorage, SESSION_KEY, session);
    }
    sessionBadge.textContent = session.id;

    printWelcome();
    updateClocks();
    commandInput.focus({ preventScroll: true });
  }

  async function unlockVault() {
    const state = gateState();
    const remaining = Math.ceil((Number(state.lockedUntil || 0) - Date.now()) / 1000);

    if (remaining > 0) {
      passwordInput.value = '';
      setGateMessage(`Access suspended. Retry in ${remaining}s.`, 'bad');
      passwordInput.focus();
      return;
    }

    const password = passwordInput.value;
    if (!password) {
      setGateMessage('Enter the access password.', 'bad');
      passwordInput.focus();
      return;
    }

    unlockButton.disabled = true;
    passwordInput.disabled = true;
    setGateMessage('Checking password', 'info');

    try {
      const candidate = await deriveVerifier(password);
      const valid = constantTimeEqual(candidate, fromBase64(VERIFIER));
      passwordInput.value = '';

      if (!valid) {
        state.failures = Number(state.failures || 0) + 1;
        const lockSeconds = state.failures >= 10 ? 300 : state.failures >= 5 ? 30 : 0;
        state.lockedUntil = lockSeconds ? Date.now() + lockSeconds * 1000 : 0;
        saveGateState(state);
        setGateMessage(lockSeconds ? `Access denied. Retry in ${lockSeconds}s.` : 'Access denied.', 'bad');
        return;
      }

      saveGateState({ failures: 0, lockedUntil: 0, lastLogin: new Date().toISOString() });
      writeJson(sessionStorage, SESSION_KEY, {
        authorized: true,
        at: Date.now(),
        id: createSessionId()
      });
      setGateMessage('Access granted. Opening Vault 3.0', 'ok');
      setTimeout(launchVault, 260);
    } catch {
      setGateMessage('Authentication failed.', 'bad');
    } finally {
      unlockButton.disabled = false;
      passwordInput.disabled = false;
      passwordInput.focus();
    }
  }

  function lockVault() {
    removeStorage(sessionStorage, SESSION_KEY);
    window.location.reload();
  }

  function handleCommand(rawCommand) {
    const command = rawCommand.trim().toLowerCase();
    if (!command) return;

    printLine(`vault@node:~$ ${rawCommand}`, 'command');

    if (command === 'clear' || command === 'cls') {
      terminalOutput.textContent = '';
      return;
    }

    if (command === 'help' || command === '?') {
      printLine('COMMANDS', 'blue');
      printLine('help        show this command index');
      printLine('status      inspect Vault interface state');
      printLine('modules     list staged intelligence sectors');
      printLine('people      open member directory briefing');
      printLine('contacts    open shared contact layer');
      printLine('network     inspect relationship map concept');
      printLine('briefings   inspect server briefing layer');
      printLine('news        inspect news wire layer');
      printLine('timezones   inspect member clock layer');
      printLine('whoami      inspect current local session');
      printLine('clear       clear terminal');
      printLine('lock        end this tab session');
      return;
    }

    if (command === 'status') {
      printLine('vault interface :: ONLINE', 'ok');
      printLine('password gate :: ARMED', 'ok');
      printLine('member database :: DEMO DATA', 'warn');
      printLine('briefing pipeline :: DEMO PREVIEW', 'warn');
      printLine('news ingestion :: MANUAL UPDATES', 'warn');
      printLine('timezone matrix :: LOCAL DEMO', 'blue');
      return;
    }

    if (command === 'modules') {
      Object.values(MODULES).forEach((module) => {
        printLine(`${module.code.padEnd(5)} ${module.label}`);
      });
      return;
    }

    if (command === 'whoami') {
      const session = readJson(sessionStorage, SESSION_KEY, null);
      printLine(`session: ${session?.id || 'UNKNOWN'}`, 'blue');
      printLine('role: vault operator (local interface session)');
      printLine('identity backend: pending', 'dim');
      return;
    }

    if (command === 'lock' || command === 'exit') {
      printLine('Closing authenticated session', 'warn');
      setTimeout(lockVault, 220);
      return;
    }

    if (MODULES[command]) {
      selectModule(command, true);
      return;
    }

    if (command === 'users') {
      selectModule('people', true);
      return;
    }

    if (command === 'drama') {
      selectModule('briefings', true);
      printLine('briefing type hint: drama / context / receipts / unresolved / decision', 'dim');
      return;
    }

    printLine(`command not found: ${command}`, 'warn');
    printLine('type help for available commands', 'dim');
  }

  function updateClocks() {
    $$('.clock-card').forEach((card) => {
      const zone = card.dataset.zone;
      const target = $('strong', card);
      const dateTarget = $('small', card);

      try {
        const now = new Date();
        target.textContent = new Intl.DateTimeFormat('en-US', {
          timeZone: zone,
          hour: 'numeric',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        }).format(now);
        dateTarget.textContent = new Intl.DateTimeFormat('en-US', {
          timeZone: zone,
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        }).format(now);
      } catch {
        target.textContent = '--:--';
        dateTarget.textContent = 'unavailable';
      }
    });
  }

  function wireEvents() {
    unlockButton.addEventListener('click', unlockVault);
    passwordInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') unlockVault();
    });

    terminalForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const command = commandInput.value;
      commandInput.value = '';
      handleCommand(command);
    });

    lockButton.addEventListener('click', lockVault);
    menuButton.addEventListener('click', () => {
      if (sidebar.classList.contains('open')) closeSidebar();
      else openSidebar();
    });
    backdrop.addEventListener('click', closeSidebar);

    $$('.nav-item, .module-row').forEach((button) => {
      button.addEventListener('click', () => selectModule(button.dataset.module, true));
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeSidebar();
      if (event.key === '/' && !event.ctrlKey && !event.metaKey && app && !app.classList.contains('hidden')) {
        const active = document.activeElement;
        if (active !== commandInput && active?.tagName !== 'INPUT') {
          event.preventDefault();
          commandInput.focus();
        }
      }
    });

    setInterval(updateClocks, 1000);
  }

  async function initialize() {
    wireEvents();
    await runBoot();

    if (sessionIsValid()) {
      launchVault();
    } else {
      gate.classList.remove('hidden');
      passwordInput.focus();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }
})();
