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
  Object.assign(frame.style, { position:'fixed', width:'2px', height:'2px', left:'-9999px', bottom:'0', opacity:'0.001', pointerEvents:'none', border:'0' });
  root.appendChild(frame);

  let activeVideoId = DEFAULT_VIDEO_ID;
  let isPlaying = false;
  let currentVolume = 28;
  let playerReady = false;

  function dispatchState(status = '') {
    window.dispatchEvent(new CustomEvent('sara:music-state', {
      detail: { playing: isPlaying, ready: playerReady, videoId: activeVideoId, volume: currentVolume, status }
    }));
  }

  function playerUrl(videoId, autoplay) {
    const params = new URLSearchParams({ autoplay: autoplay ? '1' : '0', controls:'0', loop:'1', playlist:videoId, playsinline:'1', enablejsapi:'1', rel:'0', modestbranding:'1', origin:location.origin });
    return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
  }

  function command(func, args = []) {
    if (!frame.contentWindow) return;
    frame.contentWindow.postMessage(JSON.stringify({ event:'command', func, args }), '*');
  }

  function listenToPlayer() {
    if (!frame.contentWindow) return;
    frame.contentWindow.postMessage(JSON.stringify({ event:'listening', id:'saraMusicPlayer' }), '*');
  }

  window.addEventListener('message', event => {
    if (event.source !== frame.contentWindow) return;
    let payload = event.data;
    try { if (typeof payload === 'string') payload = JSON.parse(payload); } catch { return; }
    if (!payload || typeof payload !== 'object') return;
    const state = payload.info?.playerState ?? payload.info;
    if (payload.event === 'onReady' || payload.event === 'initialDelivery') {
      playerReady = true;
      command('setVolume', [currentVolume]);
      dispatchState('ready');
    }
    if (typeof state === 'number') {
      if (state === 1) isPlaying = true;
      if (state === 0 || state === 2 || state === -1) isPlaying = false;
      dispatchState(state === 1 ? 'playing' : state === 2 ? 'paused' : 'updated');
    }
  });

  const musicController = {
    get paused() { return !isPlaying; },
    get volume() { return currentVolume / 100; },
    set volume(value) { this.setVolume(Number(value) * 100); },
    load(videoId, autoplay = true) {
      if (!/^[A-Za-z0-9_-]{6,20}$/.test(String(videoId || ''))) return;
      activeVideoId = String(videoId);
      isPlaying = Boolean(autoplay);
      playerReady = false;
      frame.src = playerUrl(activeVideoId, autoplay);
      setTimeout(() => { listenToPlayer(); command('setVolume', [currentVolume]); if (autoplay) command('playVideo'); }, 500);
      setTimeout(() => { listenToPlayer(); command('setVolume', [currentVolume]); if (autoplay) command('playVideo'); }, 1300);
      dispatchState(autoplay ? 'starting' : 'loaded');
    },
    async play() {
      if (!frame.src || frame.src === 'about:blank') this.load(activeVideoId, true);
      command('setVolume', [currentVolume]);
      command('playVideo');
      isPlaying = true;
      dispatchState('play-requested');
    },
    pause() { command('pauseVideo'); isPlaying = false; dispatchState('paused'); },
    setVolume(value) { currentVolume = Math.max(0, Math.min(100, Number(value) || 0)); command('setVolume', [currentVolume]); dispatchState('volume'); },
    reset() { frame.src = 'about:blank'; isPlaying = false; playerReady = false; activeVideoId = DEFAULT_VIDEO_ID; dispatchState('reset'); }
  };

  window.SARA_BRIEF_MUSIC = musicController;
  window.SARA_BRIEF_AUDIO = musicController;

  async function sha256(value) {
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
    return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
  }
  function constantTimeEqual(left, right) { if (left.length !== right.length) return false; let result = 0; for (let i=0;i<left.length;i+=1) result |= left.charCodeAt(i) ^ right.charCodeAt(i); return result === 0; }

  function copyHeadAssets(sourceDocument) {
    sourceDocument.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
      const href = link.getAttribute('href');
      if (!href || document.querySelector(`link[href="${CSS.escape(href)}"]`)) return;
      const clone = document.createElement('link'); clone.rel = 'stylesheet'; clone.href = href; document.head.appendChild(clone);
    });
    const sourceTitle = sourceDocument.querySelector('title'); if (sourceTitle) document.title = sourceTitle.textContent;
  }
  function loadScript(source) { return new Promise((resolve,reject) => { const script=document.createElement('script'); script.src=source; script.async=false; script.onload=resolve; script.onerror=reject; document.body.appendChild(script); }); }

  async function loadProtectedDocument(message) {
    if (message) { message.className='is-success'; message.textContent='הגישה אושרה. התדרוך שלך נפתח עכשיו.'; }
    const response = await fetch(`${SOURCE_URL}${SOURCE_URL.includes('?') ? '&' : '?'}cb=${Date.now()}`, { cache:'no-store', credentials:'same-origin' });
    if (!response.ok) throw new Error(`העמוד החזיר שגיאה ${response.status}`);
    const parsed = new DOMParser().parseFromString(await response.text(), 'text/html');
    copyHeadAssets(parsed);
    const scripts=[...parsed.querySelectorAll('script[src]')].map(s=>s.getAttribute('src')).filter(Boolean);
    parsed.querySelectorAll('script').forEach(s=>s.remove());
    document.body.className=parsed.body.className; document.body.innerHTML=parsed.body.innerHTML; root.classList.remove('sara-gate-pending');
    for (const source of scripts) await loadScript(`${source}${source.includes('?') ? '&' : '?'}cb=${Date.now()}`);
    musicController.play();
    dispatchState('page-open');
  }

  function renderGate() {
    root.classList.remove('sara-gate-pending');
    const gate=document.createElement('main'); gate.id='sara-private-gate'; gate.setAttribute('aria-labelledby','saraGateTitle');
    gate.innerHTML=`<section class="sara-gate-card"><div class="sara-gate-top"><div><p>תדרוך פרטי שנבנה במיוחד עבורך</p><strong>בריאות, ישראל, מוזיקה, טיסות והיום שלך</strong></div><div class="sara-gate-mark" aria-hidden="true">🌊</div></div><div class="sara-gate-body"><p class="sara-gate-kicker">שרה, המקום הזה הוא רק שלך</p><h1 id="saraGateTitle">ברוכה הבאה</h1><p class="sara-gate-copy">הכניסי את הסיסמה כדי לפתוח את התדרוך. Mama של Genesis, עם פיל קולינס בקול הראשי, ינסה להתחיל מיד. אם הדפדפן חוסם הפעלה אוטומטית, כפתור ברור בראש העמוד יפעיל אותו בנגיעה אחת.</p><form class="sara-gate-form" id="saraGateForm" autocomplete="off"><label for="saraGatePassword">סיסמה</label><div class="sara-gate-row"><input id="saraGatePassword" name="password" type="password" autocomplete="current-password" required /><button type="submit">פתחי את התדרוך</button></div><p id="saraGateMessage" role="status" aria-live="polite"></p></form><div class="sara-gate-foot"><span>פרטי ומותאם לשרה</span><span>Mama · Genesis · פיל קולינס בקול הראשי</span></div></div></section>`;
    document.body.replaceChildren(gate);
    const form=gate.querySelector('form'), input=gate.querySelector('input'), button=gate.querySelector('button'), message=gate.querySelector('[role="status"]');
    form.addEventListener('submit', async event => {
      event.preventDefault(); button.disabled=true; message.className=''; message.textContent='בודקת את הסיסמה.';
      musicController.load(DEFAULT_VIDEO_ID, true);
      try {
        const submittedHash=await sha256(input.value); input.value='';
        if (!constantTimeEqual(submittedHash,PASSWORD_SHA256)) { musicController.reset(); message.className='is-error'; message.textContent='הסיסמה אינה נכונה.'; return; }
        await loadProtectedDocument(message);
      } catch(error) { musicController.reset(); message.className='is-error'; message.textContent=error?.message || 'לא ניתן היה לפתוח את התדרוך.'; }
      finally { button.disabled=false; }
    });
    setTimeout(()=>input.focus(),80);
  }
  document.addEventListener('DOMContentLoaded',renderGate,{once:true});
})();