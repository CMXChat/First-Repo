'use strict';

/**
 * CMX GATE LIBRARY: Black Prompt Gate (`black-prompt`)
 *
 * Visual contract: the locked viewport stays completely black and shows only
 * the white `password: ` prompt until the user submits. Do not add branding,
 * cards, borders, help text, or a visible button unless the owner explicitly
 * changes the Black Prompt design contract.
 *
 * Integration contract:
 * - Root element: `data-cmx-gate="black-prompt"`.
 * - Protected elements: `[data-cmx-gated-content]`.
 * - Optional session scope: `data-cmx-gate-id`.
 * - Optional force prompt, delay, and redirect attributes are documented in
 *   `assets/gates/README.md`.
 *
 * Credential rotation rules:
 * - Never commit or comment the plaintext credential.
 * - Replace the random salt and PBKDF2-SHA256 verifier together.
 * - Keep 600,000 iterations unless the documented policy changes.
 * - Bump state/session key versions when existing unlock state must expire.
 * - Cache-bust this script on every consuming page after behavioral changes.
 *
 * Canonical handoff:
 * `docs/concepts/cmx-gates-system-ai-handoff-2026-08-04.md`
 */

(() => {
  const root = document.documentElement;
  if (root.dataset.cmxGate !== 'black-prompt') return;

  const PUBLIC_GATE_BYPASS_IDS = new Set(['personal-os-document']);

  function revealPublicRoute() {
    root.removeAttribute('data-cmx-gate');
    root.removeAttribute('data-cmx-gate-id');
    root.removeAttribute('data-cmx-gate-delay');

    document.querySelectorAll('[data-cmx-gated-content]').forEach((element) => {
      element.hidden = false;
      element.removeAttribute('aria-hidden');
      element.removeAttribute('data-cmx-gated-content');
    });

    if (document.body) {
      document.body.classList.remove('cmx-black-prompt-locked');
      document.body.classList.add('cmx-black-prompt-unlocked');
    }
  }

  if (PUBLIC_GATE_BYPASS_IDS.has(root.dataset.cmxGateId)) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', revealPublicRoute, { once: true });
    } else {
      revealPublicRoute();
    }
    return;
  }

  const GATE_NAME = 'Black Prompt Gate';
  const ITERATIONS = 600000;

  // Encoded credential material only. The plaintext credential is never stored.
  const SALT = 'H9jnkUr1jKwn+NbZvWqXw5WQxSpP/HOg/mR3ckPbx6w=';
  const VERIFIER = 'asdL6NWjTfGhdr0eP9QFwokjIUpBg/1Gha9gFhFGL4k=';
  const STATE_KEY = 'cmx_gate_black_prompt_state_v1';

  // Session unlocks are isolated by the declared gate ID or current pathname.
  const scope = root.dataset.cmxGateId || window.location.pathname;
  const SESSION_KEY = `cmx_gate_black_prompt_session_v1:${scope}`;
  const successDelay = Math.max(250, Number(root.dataset.cmxGateDelay || 700));
  const alwaysPrompt = root.dataset.cmxGateAlwaysPrompt === 'true';
  const redirectTarget = root.dataset.cmxGateRedirect || '';

  let gate;
  let form;
  let input;
  let status;
  let statusTimer;

  const protectedContent = () => Array.from(document.querySelectorAll('[data-cmx-gated-content]'));

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
      // Storage can be unavailable in hardened browser modes. The gate still works.
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

  function setStatus(message = '') {
    if (!status) return;
    status.textContent = message ? `\n${message}` : '';
  }

  function temporarilyShow(message, duration = 900) {
    clearTimeout(statusTimer);
    setStatus(message);
    statusTimer = setTimeout(() => setStatus(''), duration);
  }

  function revealProtectedContent() {
    protectedContent().forEach((element) => {
      element.hidden = false;
      element.removeAttribute('aria-hidden');
    });

    document.body.classList.remove('cmx-black-prompt-locked');
    document.body.classList.add('cmx-black-prompt-unlocked');
  }

  function finishUnlock(animate = true) {
    revealProtectedContent();

    if (redirectTarget) {
      window.location.assign(redirectTarget);
      return;
    }

    if (!gate) return;

    if (!animate) {
      gate.remove();
      gate = null;
      return;
    }

    gate.classList.add('is-leaving');
    gate.addEventListener('transitionend', () => gate?.remove(), { once: true });
    setTimeout(() => gate?.remove(), 220);
  }

  function lock() {
    removeStorage(sessionStorage, SESSION_KEY);
    window.location.reload();
  }

  function buildGate() {
    gate = document.createElement('section');
    gate.id = 'cmx-black-prompt-gate';
    gate.setAttribute('role', 'dialog');
    gate.setAttribute('aria-modal', 'true');
    gate.setAttribute('aria-label', 'Password required');

    form = document.createElement('form');
    form.id = 'cmx-black-prompt-form';
    form.autocomplete = 'off';

    const line = document.createElement('div');
    line.className = 'cmx-black-prompt-line';

    const label = document.createElement('label');
    label.className = 'cmx-black-prompt-label';
    label.htmlFor = 'cmx-black-prompt-password';
    label.textContent = 'password: ';

    input = document.createElement('input');
    input.id = 'cmx-black-prompt-password';
    input.className = 'cmx-black-prompt-input';
    input.type = 'password';
    input.autocomplete = 'current-password';
    input.autocapitalize = 'off';
    input.spellcheck = false;
    input.setAttribute('aria-label', 'Password');

    status = document.createElement('div');
    status.className = 'cmx-black-prompt-status';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');

    line.append(label, input);
    form.append(line, status);
    gate.append(form);
    document.body.prepend(gate);

    form.addEventListener('submit', handleSubmit);
    gate.addEventListener('pointerdown', () => input.focus());
    window.addEventListener('pageshow', () => input?.focus());
    setTimeout(() => input.focus(), 0);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const state = gateState();
    const remaining = Math.ceil((Number(state.lockedUntil || 0) - Date.now()) / 1000);

    if (remaining > 0) {
      input.value = '';
      input.focus();
      temporarilyShow(`Access denied. Retry in ${remaining}s.`, 1200);
      return;
    }

    const password = input.value;
    if (!password) return;

    input.disabled = true;
    setStatus('Verifying...');

    try {
      const candidate = await deriveVerifier(password);
      const valid = constantTimeEqual(candidate, fromBase64(VERIFIER));

      if (!valid) {
        state.failures = Number(state.failures || 0) + 1;
        const lockSeconds = state.failures >= 10 ? 300 : state.failures >= 5 ? 30 : 0;
        state.lockedUntil = lockSeconds ? Date.now() + lockSeconds * 1000 : 0;
        saveGateState(state);

        input.value = '';
        input.disabled = false;
        input.focus();
        temporarilyShow(
          lockSeconds ? `Access denied. Retry in ${lockSeconds}s.` : 'Access denied.',
          lockSeconds ? 1500 : 900
        );
        return;
      }

      saveGateState({ failures: 0, lockedUntil: 0, lastLogin: new Date().toISOString() });
      writeJson(sessionStorage, SESSION_KEY, { unlockedAt: Date.now(), gate: GATE_NAME });
      setStatus('Access granted.\nLoading...');
      setTimeout(() => finishUnlock(true), successDelay);
    } catch {
      input.value = '';
      input.disabled = false;
      input.focus();
      temporarilyShow('Authentication failed.', 1200);
    }
  }

  function initialize() {
    protectedContent().forEach((element) => {
      element.hidden = true;
      element.setAttribute('aria-hidden', 'true');
    });

    const session = readJson(sessionStorage, SESSION_KEY, null);
    if (!alwaysPrompt && session?.gate === GATE_NAME) {
      finishUnlock(false);
      return;
    }

    document.body.classList.add('cmx-black-prompt-locked');
    buildGate();
  }

  window.CMXGateLibrary = window.CMXGateLibrary || {};
  window.CMXGateLibrary.blackPrompt = Object.freeze({
    id: 'black-prompt',
    name: GATE_NAME,
    lock
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }
})();