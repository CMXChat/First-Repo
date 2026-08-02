(() => {
  'use strict';

  const root = document.documentElement;
  const PASSWORD_SHA256 = String(root.dataset.cmxPasswordSha256 || '').toLowerCase();
  const SOURCE_URL = root.dataset.cmxLoadUrl || '/assets/cmx-news.html';
  const EVERYWHERE_PREVIEW = 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview122/v4/a2/79/75/a27975f9-de23-390f-8169-5401435f17e7/mzaf_8477868711916941859.plus.aac.p.m4a';
  const ITUNES_LOOKUP = 'https://itunes.apple.com/lookup?id=202272247';

  const audio = document.createElement('audio');
  audio.id = 'newsDailyAudio';
  audio.preload = 'auto';
  audio.hidden = true;
  audio.volume = 0.001;
  audio.src = EVERYWHERE_PREVIEW;
  audio.dataset.song = 'Everywhere · Fleetwood Mac';
  root.appendChild(audio);

  let preparedPreview = EVERYWHERE_PREVIEW;
  let previewPrepared = true;
  let primePromise = Promise.resolve();

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

  async function prepareDailyPreview() {
    try {
      const response = await fetch(ITUNES_LOOKUP, { cache: 'no-store', mode: 'cors' });
      if (!response.ok) throw new Error(`Preview lookup returned ${response.status}`);
      const payload = await response.json();
      const result = payload?.results?.find(item => Number(item?.trackId) === 202272247);
      const preview = result?.previewUrl;
      if (typeof preview === 'string' && /^https:\/\//.test(preview)) {
        preparedPreview = preview;
        previewPrepared = true;
        if (audio.dataset.primed !== 'true') audio.src = preparedPreview;
      }
    } catch {
      preparedPreview = EVERYWHERE_PREVIEW;
      previewPrepared = true;
      if (audio.dataset.primed !== 'true') audio.src = preparedPreview;
    }
  }

  function primeAudio() {
    audio.dataset.primed = 'true';
    if (audio.src !== preparedPreview) audio.src = preparedPreview;
    audio.muted = false;
    audio.volume = 0.001;
    audio.currentTime = 0;
    const attempt = audio.play();
    primePromise = attempt && typeof attempt.then === 'function' ? attempt.catch(() => {}) : Promise.resolve();
  }

  async function startDailySong() {
    await primePromise;
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

  function installHeroMusicControl() {
    const header = document.querySelector('.brief-header');
    if (!header || document.getElementById('dailyMusicToggleHero')) return;

    const button = document.createElement('button');
    button.id = 'dailyMusicToggleHero';
    button.type = 'button';
    button.className = 'status-chip';
    button.style.cursor = 'pointer';
    button.style.font = 'inherit';
    button.style.marginLeft = 'auto';

    const update = () => {
      const playing = !audio.paused && !audio.ended;
      button.textContent = playing ? 'Pause Everywhere' : 'Play Everywhere';
      button.setAttribute('aria-label', playing ? 'Pause Everywhere by Fleetwood Mac' : 'Play Everywhere by Fleetwood Mac');
      button.setAttribute('aria-pressed', playing ? 'true' : 'false');
    };

    button.addEventListener('click', async () => {
      if (audio.paused) {
        audio.muted = false;
        audio.volume = 0.3;
        try {
          await audio.play();
          audio.dataset.autoplay = 'started';
        } catch {
          audio.dataset.autoplay = 'blocked';
        }
      } else {
        audio.pause();
      }
      update();
    });

    audio.addEventListener('play', update);
    audio.addEventListener('pause', update);
    audio.addEventListener('ended', update);

    const row = header.querySelector('.eyebrow-row');
    if (row) row.appendChild(button);
    else header.insertBefore(button, header.firstChild);
    update();
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

    const scriptSources = [...parsed.querySelectorAll('script[src]')]
      .map(script => script.getAttribute('src'))
      .filter(Boolean);
    parsed.querySelectorAll('script').forEach(script => script.remove());

    document.body.className = parsed.body.className;
    document.body.innerHTML = parsed.body.innerHTML;
    root.classList.remove('cmx-gate-pending');

    for (const source of scriptSources) {
      const separator = source.includes('?') ? '&' : '?';
      await loadScript(`${source}${separator}cb=${Date.now()}`);
    }

    installHeroMusicControl();
    window.dispatchEvent(new CustomEvent('news:audio-ready', {
      detail: {
        autoplay: audio.dataset.autoplay || 'unknown',
        previewPrepared,
        song: audio.dataset.song
      }
    }));
  }

  function renderGate() {
    root.classList.remove('cmx-gate-pending');
    const gate = document.createElement('main');
    gate.id = 'cmx-sensitive-gate';
    gate.setAttribute('aria-labelledby', 'cmx-gate-title');
    gate.innerHTML = `
      <section class="cmx-gate-window">
        <div class="cmx-gate-windowbar" aria-hidden="true"><span></span><span></span><span></span><b>jay + crystal briefing</b></div>
        <div class="cmx-gate-body">
          <div class="cmx-gate-brand"><div class="cmx-gate-emblem">J+C</div><div><small>PRIVATE DAILY BRIEF</small><strong>CREATION DAY</strong></div></div>
          <p class="cmx-gate-code">BROOKLYN // WAIKATO</p>
          <h1 id="cmx-gate-title">Open today’s briefing</h1>
          <p class="cmx-gate-copy">Enter the passphrase. Fleetwood Mac’s “Everywhere” will begin as the page opens.</p>
          <form id="cmx-gate-form" autocomplete="off">
            <label for="cmx-gate-password">Passphrase</label>
            <div class="cmx-gate-inputrow">
              <input id="cmx-gate-password" name="password" type="password" autocomplete="current-password" required />
              <button type="submit">Open briefing</button>
            </div>
            <p id="cmx-gate-message" role="status" aria-live="polite"></p>
          </form>
          <div class="cmx-gate-footer"><span>PRIVATE</span><span>EVERYWHERE ENABLED</span></div>
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
          audio.dataset.primed = 'false';
          message.className = 'is-error';
          message.textContent = 'Access denied.';
          return;
        }

        await startDailySong();
        await loadProtectedDocument(message);
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

  prepareDailyPreview();
  document.addEventListener('DOMContentLoaded', renderGate, { once: true });
})();
