(() => {
  'use strict';

  // This is only a temporary client-side deterrent for a static site.
  // It is not server-side authorization and cannot protect public repository files.
  const root = document.documentElement;
  if (root.dataset.cmxGated !== 'true') return;

  const SESSION_KEY = 'cmx-sensitive-access-v1';
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
    } catch {}
  }

  function hasActiveSession() {
    const session = readJson(SESSION_KEY, null);
    return Boolean(session && Number.isFinite(session.lastSeen) && Date.now() - session.lastSeen < IDLE_LIMIT_MS);
  }

  function touchSession() {
    writeJson(SESSION_KEY, { lastSeen: Date.now() });
  }

  function clearSession() {
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {}
  }

  async function sha256(value) {
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
    return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
  }

  function sessionKeeperScript() {
    return `<script>(()=>{const k='${SESSION_KEY}',limit=${IDLE_LIMIT_MS};let last=Date.now(),timer;const touch=()=>{last=Date.now();clearTimeout(timer);timer=setTimeout(()=>{try{sessionStorage.setItem(k,JSON.stringify({lastSeen:Date.now()}))}catch{}},200)};['pointerdown','keydown','scroll','touchstart'].forEach(e=>addEventListener(e,touch,{passive:true}));touch();setInterval(()=>{if(Date.now()-last>=limit){try{sessionStorage.removeItem(k)}catch{}location.reload()}},30000)})()<\/script>`;
  }

  async function loadProtectedDocument(message) {
    const source = root.dataset.cmxLoadUrl;
    if (!source) return false;

    if (message) {
      message.className = 'is-success';
      message.textContent = 'Authorization accepted. Loading user resource…';
    }

    const response = await fetch(source, {
      cache: 'no-store',
      credentials: source.startsWith('/') ? 'same-origin' : 'omit',
      referrerPolicy: 'no-referrer'
    });

    if (!response.ok) throw new Error(`Resource returned HTTP ${response.status}`);

    let html = await response.text();
    html = html.replace('</body>', `${sessionKeeperScript()}</body>`);
    document.open();
    document.write(html);
    document.close();
    return true;
  }

  async function unlock(message) {
    touchSession();
    if (await loadProtectedDocument(message)) return;

    root.classList.remove('cmx-gate-pending');
    document.getElementById('cmx-sensitive-gate')?.remove();

    let timer;
    const activity = () => {
      clearTimeout(timer);
      timer = setTimeout(touchSession, 250);
    };

    ['pointerdown', 'keydown', 'scroll', 'touchstart'].forEach(eventName => {
      addEventListener(eventName, activity, { passive: true });
    });

    setInterval(() => {
      if (!hasActiveSession()) {
        clearSession();
        location.reload();
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
    } catch {}
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
            <div><small>POLICY BOUNDARY</small><strong>PRIVATE USER RESOURCE</strong></div>
          </div>
          <p class="cmx-gate-code">AUTHORIZATION // REQUIRED</p>
          <h1 id="cmx-gate-title">Restricted access</h1>
          <p class="cmx-gate-copy">Enter the user passphrase to continue.</p>
          <p class="cmx-gate-copy">Temporary browser gate only. Real privacy requires the planned server-side access controls.</p>
          <form id="cmx-gate-form" autocomplete="off">
            <label for="cmx-gate-password">Passphrase</label>
            <div class="cmx-gate-inputrow">
              <input id="cmx-gate-password" name="password" type="password" autocomplete="off" autocapitalize="none" spellcheck="false" required />
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
    const interval = setInterval(() => {
      if (!updateLockState()) clearInterval(interval);
    }, 1000);

    form.addEventListener('submit', async event => {
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
          await unlock(message);
          return;
        }

        const state = recordFailure();
        message.className = 'is-error';
        message.textContent = state.lockUntil ? 'Access denied. Temporary lock applied.' : 'Access denied.';
      } catch (error) {
        message.className = 'is-error';
        message.textContent = error?.message || 'Authorization could not be completed.';
      } finally {
        button.disabled = false;
        updateLockState();
        input.focus();
      }
    });

    setTimeout(() => input.focus(), 40);
  }

  if (hasActiveSession()) {
    document.addEventListener('DOMContentLoaded', () => {
      unlock().catch(() => {
        clearSession();
        renderGate();
      });
    }, { once: true });
    return;
  }

  document.addEventListener('DOMContentLoaded', renderGate, { once: true });
})();
