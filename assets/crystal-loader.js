(() => {
  'use strict';

  const root = document.documentElement;
  const PASSWORD_SHA256 = String(root.dataset.cmxPasswordSha256 || '').toLowerCase();
  const SOURCE_URL = root.dataset.cmxLoadUrl || '/assets/cmx-news.html';
  const SESSION_KEY = 'cmx-crystal-access-v1';
  const FALLBACK_PREVIEW = 'https://p.scdn.co/mp3-preview/9c0b4d2e32560e295b5770138abd247f08c7bba9.mp3';
  const ITUNES_LOOKUP = 'https://itunes.apple.com/lookup?id=202272247';

  const audio = document.createElement('audio');
  audio.id = 'crystalDailyAudio';
  audio.preload = 'auto';
  audio.hidden = true;
  audio.volume = 0.3;
  document.head.appendChild(audio);

  function readSession() {
    try {
      const value = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null');
      return value && Date.now() - Number(value.at || 0) < 30 * 60 * 1000;
    } catch {
      return false;
    }
  }

  function saveSession() {
    try { sessionStorage.setItem(SESSION_KEY, JSON.stringify({ at: Date.now() })); } catch {}
  }

  async function sha256(value) {
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
    return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
  }

  function constantTimeEqual(left, right) {
    if (left.length !== right.length) return false;
    let result = 0;
    for (let index = 0; index < left.length; index += 1) result |= left.charCodeAt(index) ^ right.charCodeAt(index);
    return result === 0;
  }

  function primeAudio() {
    audio.src = FALLBACK_PREVIEW;
    audio.muted = true;
    audio.currentTime = 0;
    const attempt = audio.play();
    if (attempt && typeof attempt.catch === 'function') attempt.catch(() => {});
  }

  async function resolveDailyPreview() {
    try {
      const response = await fetch(ITUNES_LOOKUP, { cache: 'no-store', mode: 'cors' });
      if (!response.ok) throw new Error(`Preview lookup returned ${response.status}`);
      const payload = await response.json();
      const preview = payload?.results?.[0]?.previewUrl;
      return typeof preview === 'string' && /^https:\/\//.test(preview) ? preview : FALLBACK_PREVIEW;
    } catch {
      return FALLBACK_PREVIEW;
    }
  }

  async function startDailySong() {
    const preview = await resolveDailyPreview();
    if (audio.src !== preview) {
      audio.src = preview;
      audio.currentTime = 0;
    }
    audio.muted = false;
    audio.volume = 0.3;
    try {
      await audio.play();
      audio.dataset.autoplay = 'started';
    } catch {
      audio.dataset.autoplay = 'blocked';
    }
  }

  function copyHeadAssets(sourceDocument) {
    sourceDocument.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
      const href = link.getAttribute('href');
      if (!href || document.querySelector(`link[href="${CSS.escape(href)}"]`)) return;
      const clone = document.createElement('link');
      clone.rel = 'stylesheet';
      clone.href = href;
      document.head.appendChild(clone);
    });

    const sourceTitle = sourceDocument.querySelector('title');
    if (sourceTitle) document.title = sourceTitle.textContent;
  }

  function loadScript(source) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = source;
      script.async = false;
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }

  async function loadProtectedDocument(message) {
    if (message) {
      message.className = 'is-success';
      message.textContent = 'Access granted. Loading today’s briefing…';
    }

    const response = await fetch(`${SOURCE_URL}${SOURCE_URL.includes('?') ? '&' : '?'}cb=${Date.now()}`, {
      cache: 'no-store',
      credentials: 'same-origin'
    });
    if (!response.ok) throw new Error(`Briefing returned HTTP ${response.status}`);

    const html = await response.text();
    const parsed = new DOMParser().parseFromString(html, 'text/html');
    copyHeadAssets(parsed);

    const scriptSources = [...parsed.querySelectorAll('script[src]')].map(script => script.getAttribute('src')).filter(Boolean);
    parsed.querySelectorAll('script').forEach(script => script.remove());

    document.body.className = parsed.body.className;
    document.body.innerHTML = parsed.body.innerHTML;
    root.classList.remove('cmx-gate-pending');

    for (const source of scriptSources) {
      const separator = source.includes('?') ? '&' : '?';
      await loadScript(`${source}${separator}cb=${Date.now()}`);
    }

    window.dispatchEvent(new CustomEvent('crystal:audio-ready', { detail: { autoplay: audio.dataset.autoplay || 'unknown' } }));
  }

  function renderGate() {
    root.classList.remove('cmx-gate-pending');
    const gate = document.createElement('main');
    gate.id = 'cmx-sensitive-gate';
    gate.setAttribute('aria-labelledby', 'cmx-gate-title');
    gate.innerHTML = `
      <section class="cmx-gate-window">
        <div class="cmx-gate-windowbar" aria-hidden="true"><span></span><span></span><span></span><b>crystal briefing</b></div>
        <div class="cmx-gate-body">
          <div class="cmx-gate-brand"><div class="cmx-gate-emblem">J+C</div><div><small>PRIVATE DAILY BRIEF</small><strong>CREATION DAY</strong></div></div>
          <p class="cmx-gate-code">BROOKLYN // WAIKATO</p>
          <h1 id="cmx-gate-title">Open today’s briefing</h1>
          <p class="cmx-gate-copy">Enter the passphrase. Today’s song will try to begin as the page opens.</p>
          <form id="cmx-gate-form" autocomplete="off">
            <label for="cmx-gate-password">Passphrase</label>
            <div class="cmx-gate-inputrow">
              <input id="cmx-gate-password" name="password" type="password" autocomplete="current-password" required />
              <button type="submit">Open briefing</button>
            </div>
            <p id="cmx-gate-message" role="status" aria-live="polite"></p>
          </form>
          <div class="cmx-gate-footer"><span>PRIVATE</span><span>DAILY SONG ENABLED</span></div>
        </div>
      </section>`;
    document.body.replaceChildren(gate);

    const form = gate.querySelector('form');
    const input = gate.querySelector('input');
    const button = gate.querySelector('button');
    const message = gate.querySelector('[role="status"]');

    form.addEventListener('submit', async event => {
      event.preventDefault();
      primeAudio();
      button.disabled = true;
      message.className = '';
      message.textContent = 'Checking access…';

      try {
        const submittedHash = await sha256(input.value);
        input.value = '';
        if (!constantTimeEqual(submittedHash, PASSWORD_SHA256)) {
          audio.pause();
          audio.currentTime = 0;
          message.className = 'is-error';
          message.textContent = 'Access denied.';
          return;
        }

        saveSession();
        await Promise.all([startDailySong(), loadProtectedDocument(message)]);
      } catch (error) {
        audio.pause();
        message.className = 'is-error';
        message.textContent = error?.message || 'The briefing could not be opened.';
      } finally {
        button.disabled = false;
        input.focus();
      }
    });

    setTimeout(() => input.focus(), 50);
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (readSession()) {
      loadProtectedDocument().catch(() => renderGate());
    } else {
      renderGate();
    }
  }, { once: true });
})();