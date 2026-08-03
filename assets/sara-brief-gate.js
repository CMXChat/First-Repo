(() => {
  'use strict';

  const root = document.documentElement;
  const PASSWORD_SHA256 = String(root.dataset.saraPasswordSha256 || '').toLowerCase();
  const SOURCE_URL = root.dataset.saraLoadUrl || '/assets/cmx-sara-brief.html';
  const DEFAULT_VIDEO_ID = 'O0Zso2zx6Tk';

  const frame = document.createElement('iframe');
  frame.id = 'saraMusicPlayer';
  frame.title = 'נגן המוזיקה של שרה';
  frame.allow = 'autoplay; encrypted-media';
  frame.setAttribute('aria-hidden', 'true');
  frame.tabIndex = -1;
  frame.style.position = 'fixed';
  frame.style.width = '2px';
  frame.style.height = '2px';
  frame.style.left = '-9999px';
  frame.style.bottom = '0';
  frame.style.opacity = '0.001';
  frame.style.pointerEvents = 'none';
  frame.style.border = '0';
  root.appendChild(frame);

  let activeVideoId = DEFAULT_VIDEO_ID;
  let isPlaying = false;
  let currentVolume = 32;

  function dispatchState() {
    window.dispatchEvent(new CustomEvent('sara:music-state', {
      detail: { playing: isPlaying, videoId: activeVideoId, volume: currentVolume }
    }));
  }

  function playerUrl(videoId, autoplay) {
    const params = new URLSearchParams({
      autoplay: autoplay ? '1' : '0',
      controls: '0',
      loop: '1',
      playlist: videoId,
      playsinline: '1',
      enablejsapi: '1',
      rel: '0',
      modestbranding: '1'
    });
    return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
  }

  function command(func, args = []) {
    if (!frame.contentWindow) return;
    frame.contentWindow.postMessage(JSON.stringify({
      event: 'command',
      func,
      args
    }), '*');
  }

  const musicController = {
    get paused() {
      return !isPlaying;
    },
    load(videoId, autoplay = true) {
      if (!/^[A-Za-z0-9_-]{6,20}$/.test(String(videoId || ''))) return;
      activeVideoId = String(videoId);
      isPlaying = Boolean(autoplay);
      frame.src = playerUrl(activeVideoId, autoplay);
      setTimeout(() => {
        command('setVolume', [currentVolume]);
        if (autoplay) command('playVideo');
      }, 900);
      dispatchState();
    },
    play() {
      if (!frame.src || frame.src === 'about:blank') {
        this.load(activeVideoId, true);
        return;
      }
      command('playVideo');
      isPlaying = true;
      dispatchState();
    },
    pause() {
      command('pauseVideo');
      isPlaying = false;
      dispatchState();
    },
    setVolume(value) {
      currentVolume = Math.max(0, Math.min(100, Number(value) || 0));
      command('setVolume', [currentVolume]);
      dispatchState();
    },
    reset() {
      frame.src = 'about:blank';
      isPlaying = false;
      activeVideoId = DEFAULT_VIDEO_ID;
      dispatchState();
    }
  };

  window.SARA_BRIEF_MUSIC = musicController;

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

    for (const source of scripts) {
      const separator = source.includes('?') ? '&' : '?';
      await loadScript(`${source}${separator}cb=${Date.now()}`);
    }

    dispatchState();
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
            <strong>בריאות, ישראל, מוזיקה, טיסות והיום שלך</strong>
          </div>
          <div class="sara-gate-mark" aria-hidden="true">🌊</div>
        </div>
        <div class="sara-gate-body">
          <p class="sara-gate-kicker">שרה, המקום הזה הוא רק שלך</p>
          <h1 id="saraGateTitle">ברוכה הבאה</h1>
          <p class="sara-gate-copy">הכניסי את הסיסמה כדי לפתוח את התדרוך. לאחר הכניסה יתחיל Mama של Genesis עם פיל קולינס, ותוכלי להאזין לעמוד בעברית, לבדוק מזג אוויר, בריאות, חדשות וטיסות לישראל.</p>
          <form class="sara-gate-form" id="saraGateForm" autocomplete="off">
            <label for="saraGatePassword">סיסמה</label>
            <div class="sara-gate-row">
              <input id="saraGatePassword" name="password" type="password" autocomplete="current-password" required />
              <button type="submit">פתחי את התדרוך</button>
            </div>
            <p id="saraGateMessage" role="status" aria-live="polite"></p>
          </form>
          <div class="sara-gate-foot"><span>פרטי ומותאם לשרה</span><span>Mama · פיל קולינס ו-Genesis</span></div>
        </div>
      </section>`;

    document.body.replaceChildren(gate);

    const form = gate.querySelector('#saraGateForm');
    const input = gate.querySelector('#saraGatePassword');
    const button = gate.querySelector('button');
    const message = gate.querySelector('#saraGateMessage');

    form.addEventListener('submit', async event => {
      event.preventDefault();
      button.disabled = true;
      message.className = '';
      message.textContent = 'בודקת את הסיסמה.';

      try {
        const submittedHash = await sha256(input.value);
        input.value = '';
        if (!constantTimeEqual(submittedHash, PASSWORD_SHA256)) {
          musicController.reset();
          message.className = 'is-error';
          message.textContent = 'הסיסמה אינה נכונה.';
          return;
        }

        musicController.load(DEFAULT_VIDEO_ID, true);
        await loadProtectedDocument(message);
      } catch (error) {
        musicController.reset();
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