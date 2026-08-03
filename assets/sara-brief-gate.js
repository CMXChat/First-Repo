(() => {
  'use strict';

  const root = document.documentElement;
  const PASSWORD_SHA256 = String(root.dataset.saraPasswordSha256 || '').toLowerCase();
  const SOURCE_URL = root.dataset.saraLoadUrl || '/assets/cmx-sara-brief.html';
  const PREVIEW_URL = 'https://p.scdn.co/mp3-preview/0f980d0fac59f77123d0272b78bce97f1374d9e9?cid=3928bbd17a50482ab7ddaa4b6da39864';

  const audio = document.createElement('audio');
  audio.id = 'saraDailyAudio';
  audio.preload = 'auto';
  audio.hidden = true;
  audio.src = PREVIEW_URL;
  audio.volume = 0.001;
  root.appendChild(audio);
  window.SARA_BRIEF_AUDIO = audio;

  let primePromise = Promise.resolve();

  async function sha256(value) {
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
    return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
  }

  function constantTimeEqual(left, right) {
    if (left.length !== right.length) return false;
    let result = 0;
    for (let index = 0; index < left.length; index += 1) {
      result |= left.charCodeAt(index) ^ right.charCodeAt(index);
    }
    return result === 0;
  }

  function primeAudio() {
    audio.currentTime = 0;
    audio.volume = 0.001;
    const attempt = audio.play();
    primePromise = attempt && typeof attempt.then === 'function' ? attempt.catch(() => {}) : Promise.resolve();
  }

  async function startMusic() {
    await primePromise;
    audio.volume = 0.24;
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
      message.textContent = 'הגישה אושרה. התדרוך שלך נפתח עכשיו.';
    }

    const response = await fetch(`${SOURCE_URL}${SOURCE_URL.includes('?') ? '&' : '?'}cb=${Date.now()}`, {
      cache: 'no-store',
      credentials: 'same-origin'
    });
    if (!response.ok) throw new Error(`העמוד החזיר שגיאה ${response.status}`);

    const html = await response.text();
    const parsed = new DOMParser().parseFromString(html, 'text/html');
    copyHeadAssets(parsed);

    const scripts = [...parsed.querySelectorAll('script[src]')]
      .map(script => script.getAttribute('src'))
      .filter(Boolean);
    parsed.querySelectorAll('script').forEach(script => script.remove());

    document.body.className = parsed.body.className;
    document.body.innerHTML = parsed.body.innerHTML;
    root.classList.remove('sara-gate-pending');
    document.querySelector('link[href*="sara-brief-gate.css"]')?.remove();

    for (const source of scripts) {
      const separator = source.includes('?') ? '&' : '?';
      await loadScript(`${source}${separator}cb=${Date.now()}`);
    }

    window.dispatchEvent(new CustomEvent('sara:audio-ready', {
      detail: { autoplay: audio.dataset.autoplay || 'unknown' }
    }));
  }

  function renderGate() {
    root.classList.remove('sara-gate-pending');
    const gate = document.createElement('main');
    gate.id = 'sara-private-gate';
    gate.setAttribute('aria-labelledby', 'saraGateTitle');

    gate.innerHTML = `
      <section class="sara-gate-card">
        <div class="sara-gate-top">
          <div>
            <p>תדרוך פרטי שנבנה במיוחד עבורך</p>
            <strong>בריאות, ישראל, מוזיקה והיום שלך</strong>
          </div>
          <div class="sara-gate-mark" aria-hidden="true">🌊</div>
        </div>
        <div class="sara-gate-body">
          <p class="sara-gate-kicker">שרה, המקום הזה הוא רק שלך</p>
          <h1 id="saraGateTitle">ברוכה הבאה</h1>
          <p class="sara-gate-copy">הכניסי את הסיסמה כדי לפתוח את התדרוך. לאחר הכניסה תתחיל מוזיקה משנות ה-80, ותוכלי גם להאזין לכל העמוד בעברית.</p>
          <form class="sara-gate-form" id="saraGateForm" autocomplete="off">
            <label for="saraGatePassword">סיסמה</label>
            <div class="sara-gate-row">
              <input id="saraGatePassword" name="password" type="password" autocomplete="current-password" required />
              <button type="submit">פתחי את התדרוך</button>
            </div>
            <p id="saraGateMessage" role="status" aria-live="polite"></p>
          </form>
          <div class="sara-gate-foot"><span>פרטי ומותאם לשרה</span><span>מוזיקה יומית · 80s/90s</span></div>
        </div>
      </section>`;

    document.body.replaceChildren(gate);

    const form = gate.querySelector('#saraGateForm');
    const input = gate.querySelector('#saraGatePassword');
    const button = gate.querySelector('button');
    const message = gate.querySelector('#saraGateMessage');

    form.addEventListener('submit', async event => {
      event.preventDefault();
      primeAudio();
      button.disabled = true;
      message.className = '';
      message.textContent = 'בודקת את הסיסמה.';

      try {
        const submittedHash = await sha256(input.value);
        input.value = '';
        if (!constantTimeEqual(submittedHash, PASSWORD_SHA256)) {
          audio.pause();
          audio.currentTime = 0;
          message.className = 'is-error';
          message.textContent = 'הסיסמה אינה נכונה.';
          return;
        }

        await startMusic();
        await loadProtectedDocument(message);
      } catch (error) {
        audio.pause();
        message.className = 'is-error';
        message.textContent = error?.message || 'לא ניתן היה לפתוח את התדרוך.';
      } finally {
        button.disabled = false;
      }
    });

    setTimeout(() => input.focus(), 80);
  }

  document.addEventListener('DOMContentLoaded', renderGate, { once: true });
})();