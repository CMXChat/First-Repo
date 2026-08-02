(() => {
  'use strict';

  const root = document.documentElement;
  const PASSWORD_SHA256 = String(root.dataset.cmxPasswordSha256 || '').toLowerCase();
  const SOURCE_URL = root.dataset.cmxLoadUrl || '/assets/cmx-news.html';
  const song = window.CMX_DAILY_SONG || {
    title: "Today's song",
    artist: "",
    displayTitle: "Today's song",
    spotifyUrl: "",
    previewUrl: "",
    selectedFor: ""
  };

  const songTitle = String(song.title || "Today's song");
  const songArtist = String(song.artist || "");
  const songDisplayTitle = String(song.displayTitle || [songTitle, songArtist].filter(Boolean).join(' · '));
  const previewUrl = /^https:\/\//.test(String(song.previewUrl || '')) ? String(song.previewUrl) : '';
  const spotifyUrl = /^https:\/\/open\.spotify\.com\//.test(String(song.spotifyUrl || '')) ? String(song.spotifyUrl) : '';

  const audio = document.createElement('audio');
  audio.id = 'newsDailyAudio';
  audio.preload = 'auto';
  audio.hidden = true;
  audio.volume = 0.001;
  audio.dataset.song = songDisplayTitle;
  if (previewUrl) audio.src = previewUrl;
  root.appendChild(audio);

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

  function primeAudio() {
    if (!previewUrl) {
      audio.dataset.autoplay = 'unavailable';
      primePromise = Promise.resolve();
      return;
    }

    audio.dataset.primed = 'true';
    if (audio.src !== previewUrl) audio.src = previewUrl;
    audio.muted = false;
    audio.volume = 0.001;
    audio.currentTime = 0;
    const attempt = audio.play();
    primePromise = attempt && typeof attempt.then === 'function' ? attempt.catch(() => {}) : Promise.resolve();
  }

  async function startDailySong() {
    if (!previewUrl) {
      audio.dataset.autoplay = 'unavailable';
      return;
    }

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
      const playing = previewUrl && !audio.paused && !audio.ended;
      if (!previewUrl) {
        button.textContent = 'Open music';
        button.setAttribute('aria-label', `Open ${songDisplayTitle} on Spotify`);
        button.setAttribute('aria-pressed', 'false');
        return;
      }

      button.textContent = playing ? 'Pause music' : 'Play music';
      button.setAttribute('aria-label', `${playing ? 'Pause' : 'Play'} today’s music: ${songDisplayTitle}`);
      button.setAttribute('aria-pressed', String(playing));
    };

    button.addEventListener('click', async () => {
      if (!previewUrl) {
        if (spotifyUrl) window.open(spotifyUrl, '_blank', 'noopener,noreferrer');
        return;
      }

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
      message.textContent = 'Access granted. Loading today’s briefing.';
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
        previewPrepared: Boolean(previewUrl),
        song: songDisplayTitle
      }
    }));
  }

  function renderGate() {
    root.classList.remove('cmx-gate-pending');
    const gate = document.createElement('main');
    gate.id = 'cmx-sensitive-gate';
    gate.setAttribute('aria-labelledby', 'cmx-gate-title');

    const gateSongCopy = previewUrl
      ? `Enter the passphrase. “${songTitle}”${songArtist ? ` by ${songArtist}` : ''} will begin as the page opens.`
      : `Enter the passphrase. Today’s song is “${songTitle}”${songArtist ? ` by ${songArtist}` : ''}, with a Spotify link inside.`;

    gate.innerHTML = `
      <section class="cmx-gate-window">
        <div class="cmx-gate-windowbar" aria-hidden="true"><span></span><span></span><span></span><b>jay + crystal briefing</b></div>
        <div class="cmx-gate-body">
          <div class="cmx-gate-brand"><div class="cmx-gate-emblem">J+C</div><div><small>PRIVATE DAILY BRIEF</small><strong>CREATION DAY</strong></div></div>
          <p class="cmx-gate-code">BROOKLYN // WAIKATO</p>
          <h1 id="cmx-gate-title">Open today’s briefing</h1>
          <p class="cmx-gate-copy">${gateSongCopy}</p>
          <form id="cmx-gate-form" autocomplete="off">
            <label for="cmx-gate-password">Passphrase</label>
            <div class="cmx-gate-inputrow">
              <input id="cmx-gate-password" name="password" type="password" autocomplete="current-password" required />
              <button type="submit">Open briefing</button>
            </div>
            <p id="cmx-gate-message" role="status" aria-live="polite"></p>
          </form>
          <div class="cmx-gate-footer"><span>PRIVATE</span><span>DAILY SONG · ${String(song.selectedFor || 'TODAY').toUpperCase()}</span></div>
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
      message.textContent = 'Checking access.';

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

  document.addEventListener('DOMContentLoaded', renderGate, { once: true });
})();