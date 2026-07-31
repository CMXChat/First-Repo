(() => {
  'use strict';

  const root = document.documentElement;
  if (root.dataset.cmxGated !== 'true') return;

  const STORAGE_KEY = 'cmx-sensitive-access-v1';
  const ATTEMPTS_KEY = 'cmx-sensitive-attempts-v1';
  const PASSWORD_SHA256 = '5acc5a298686271b024634c1affb1a03a228278e707b6ff9f816af5e1cc948b9';
  const IDLE_LIMIT_MS = 10 * 60 * 1000;

  function readJson(key, fallback) {
    try {
      return JSON.parse(sessionStorage.getItem(key)) ?? fallback;
    } catch {
      return fallback;
    }
  }

  function writeJson(key, value) {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Session storage is a convenience only. The gate still works without persistence.
    }
  }

  function hasActiveSession() {
    const session = readJson(STORAGE_KEY, null);
    return Boolean(session && Number.isFinite(session.lastSeen) && Date.now() - session.lastSeen < IDLE_LIMIT_MS);
  }

  function touchSession() {
    writeJson(STORAGE_KEY, { lastSeen: Date.now() });
  }

  function clearSession() {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage failures.
    }
  }

  async function sha256(value) {
    const bytes = new TextEncoder().encode(value);
    const digest = await crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
  }

  function unlock() {
    touchSession();
    root.classList.remove('cmx-gate-pending');
    document.getElementById('cmx-sensitive-gate')?.remove();

    let timer;
    const activity = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(touchSession, 250);
    };
    ['pointerdown', 'keydown', 'scroll', 'touchstart'].forEach((eventName) => {
      window.addEventListener(eventName, activity, { passive: true });
    });

    window.setInterval(() => {
      if (!hasActiveSession()) {
        clearSession();
        window.location.reload();
      }
    }, 30000);
  }

  function lockSecondsRemaining() {
    const state = readJson(ATTEMPTS_KEY, { count: 0, lockUntil: 0 });
    return Math.max(0, Math.ceil((Number(state.lockUntil || 0) - Date.now()) / 1000));
  }

  function recordFailure() {
    const state = readJson(ATTEMPTS_KEY, { count: 0, lockUntil: 0 });
    const count = Number(state.count || 0) + 1;
    let lockUntil = 0;
    if (count >= 10) lockUntil = Date.now() + 5 * 60 * 1000;
    else if (count >= 5) lockUntil = Date.now() + 30 * 1000;
    writeJson(ATTEMPTS_KEY, { count, lockUntil });
    return { count, lockUntil };
  }

  function clearFailures() {
    try {
      sessionStorage.removeItem(ATTEMPTS_KEY);
    } catch {
      // Ignore storage failures.
    }
  }

  function renderGate() {
    const gate = document.createElement('main');
    gate.id = 'cmx-sensitive-gate';
    gate.setAttribute('aria-labelledby', 'cmx-gate-title');
    gate.innerHTML = `
      <section class="cmx-gate-window">
        <div class="cmx-gate-windowbar" aria-hidden="true">
          <span></span><span></span><span></span><b>restricted node</b>
        </div>
        <div class="cmx-gate-body">
          <div class="cmx-gate-brand">
            <div class="cmx-gate-emblem">CMX</div>
            <div><small>POLICY BOUNDARY</small><strong>PRIVATE OPERATOR RESOURCE</strong></div>
          </div>
          <p class="cmx-gate-code">AUTHORIZATION // REQUIRED</p>
          <h1 id="cmx-gate-title">Restricted access</h1>
          <p class="cmx-gate-copy">Enter the operator passphrase to continue. This temporary browser gate will be replaced by server-side authentication.</p>
          <form id="cmx-gate-form" autocomplete="off">
            <label for="cmx-gate-password">Passphrase</label>
            <div class="cmx-gate-inputrow">
              <input id="cmx-gate-password" name="password" type="password" inputmode="text" autocomplete="off" autocapitalize="none" spellcheck="false" required />
              <button type="submit">Authorize</button>
            </div>
            <p id="cmx-gate-message" role="status" aria-live="polite"></p>
          </form>
          <div class="cmx-gate-footer"><span>NO INDEXING</span><span>SESSION EXPIRES AFTER 10 MINUTES IDLE</span></div>
        </div>
      </section>`;
    document.body.appendChild(gate);

    const form = document.getElementById('cmx-gate-form');
    const input = document.getElementById('cmx-gate-password');
    const message = document.getElementById('cmx-gate-message');
    const button = form.querySelector('button');

    const updateLockState = () => {
      const remaining = lockSecondsRemaining();
      const locked = remaining > 0;
      input.disabled = locked;
      button.disabled = locked;
      message.textContent = locked ? `Access temporarily locked. Retry in ${remaining}s.` : '';
      message.className = locked ? 'is-error' : '';
      return locked;
    };

    updateLockState();
    const interval = window.setInterval(() => {
      if (!updateLockState()) window.clearInterval(interval);
    }, 1000);

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (updateLockState()) return;

      button.disabled = true;
      message.className = '';
      message.textContent = 'Verifying authorization…';

      try {
        const valid = await sha256(input.value) === PASSWORD_SHA256;
        input.value = '';
        if (valid) {
          clearFailures();
          message.className = 'is-success';
          message.textContent = 'Authorization accepted.';
          window.setTimeout(unlock, 180);
          return;
        }

        const state = recordFailure();
        message.className = 'is-error';
        message.textContent = state.lockUntil ? 'Access denied. Temporary lock applied.' : 'Access denied.';
      } catch {
        message.className = 'is-error';
        message.textContent = 'Authorization could not be verified in this browser.';
      } finally {
        button.disabled = false;
        updateLockState();
        input.focus();
      }
    });

    window.setTimeout(() => input.focus(), 40);
  }

  if (hasActiveSession()) {
    unlock();
    return;
  }

  document.addEventListener('DOMContentLoaded', renderGate, { once: true });
})();