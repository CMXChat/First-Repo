(() => {
  'use strict';

  const brief = window.CMX_NEWS_BRIEF || {};
  const dailyVideo = window.CMX_DAILY_VIDEO || null;
  const root = document.getElementById('spotifyCards');
  if (!root) return;

  const dailyAudio = document.getElementById('newsDailyAudio');
  const sorted = items => [...(Array.isArray(items) ? items : [])]
    .sort((a, b) => Number(b.priority || 0) - Number(a.priority || 0));

  function audienceClass(audience) {
    return audience === 'jay' ? 'card-jay' : audience === 'crystal' ? 'card-crystal' : 'card-shared';
  }

  function safeSpotifyTrackId(url) {
    const match = String(url || '').match(/open\.spotify\.com\/track\/([A-Za-z0-9]{22})/);
    return match ? match[1] : '';
  }

  function safeYouTubeId(value) {
    const id = String(value || '');
    return /^[A-Za-z0-9_-]{11}$/.test(id) ? id : '';
  }

  function cacheBust(url) {
    const value = new URL(url, window.location.href);
    value.searchParams.set('refresh', String(Date.now()));
    return value.toString();
  }

  function createStatus(text) {
    const status = document.createElement('span');
    status.className = 'media-player-status';
    status.setAttribute('role', 'status');
    status.textContent = text;
    return status;
  }

  function createAudioShell(audio, title) {
    const shell = document.createElement('div');
    shell.className = 'media-shell media-audio-preview';

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'media-load-button';

    const icon = document.createElement('span');
    icon.setAttribute('aria-hidden', 'true');
    const label = document.createElement('b');
    const note = document.createElement('small');
    const progress = document.createElement('div');
    progress.className = 'media-audio-progress';
    const progressBar = document.createElement('i');
    progress.appendChild(progressBar);

    const tools = document.createElement('div');
    tools.className = 'media-player-tools';
    const refresh = document.createElement('button');
    refresh.type = 'button';
    refresh.className = 'media-refresh-button';
    refresh.textContent = '↻ Restart preview';
    const status = createStatus('Audio preview ready.');
    tools.append(refresh, status);

    function update() {
      const playing = !audio.paused && !audio.ended;
      icon.textContent = playing ? '❚❚' : '▶';
      label.textContent = playing ? 'pause today’s song' : 'play today’s song';
      button.setAttribute('aria-label', `${playing ? 'pause' : 'play'} ${title}`);
      note.textContent = audio.dataset.autoplay === 'blocked'
        ? 'Your browser blocked automatic sound. Tap to play.'
        : playing
          ? 'Playing now.'
          : 'Ready when you are.';
      const duration = Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : 30;
      progressBar.style.width = `${Math.min(100, (audio.currentTime / duration) * 100)}%`;
    }

    button.addEventListener('click', async () => {
      if (audio.paused) {
        audio.muted = false;
        audio.volume = 0.3;
        try {
          await audio.play();
          status.textContent = 'Audio playing.';
        } catch {
          status.textContent = 'The preview could not start. Restart it or open Spotify.';
        }
      } else {
        audio.pause();
        status.textContent = 'Audio paused.';
      }
      update();
    });

    refresh.addEventListener('click', () => {
      audio.pause();
      audio.currentTime = 0;
      try { audio.load(); } catch {}
      update();
      status.textContent = 'Preview restarted and ready to play.';
    });

    audio.addEventListener('play', update);
    audio.addEventListener('pause', update);
    audio.addEventListener('timeupdate', update);
    audio.addEventListener('ended', () => {
      audio.currentTime = 0;
      status.textContent = 'Preview complete.';
      update();
    });
    audio.addEventListener('error', () => {
      status.textContent = 'The audio preview failed to load. Restart it or open Spotify.';
      update();
    });
    window.addEventListener('news:audio-ready', update);
    window.addEventListener('news:media-refresh', () => refresh.click());

    button.append(icon, label, note);
    shell.append(button, progress, tools);
    update();
    return shell;
  }

  function createPlayerShell({ provider, id, title, buttonLabel }) {
    const shell = document.createElement('div');
    shell.className = `media-shell media-${provider}`;
    shell.dataset.provider = provider;
    shell.dataset.mediaId = id;

    const stage = document.createElement('div');
    stage.className = 'media-player-stage';
    const tools = document.createElement('div');
    tools.className = 'media-player-tools';
    const refresh = document.createElement('button');
    refresh.type = 'button';
    refresh.className = 'media-refresh-button';
    refresh.textContent = '↻ Refresh player';
    const status = createStatus(provider === 'spotify' ? 'Spotify waits until you tap Play.' : 'Video waits until you tap Play.');
    tools.append(refresh, status);
    let loadTimer = 0;
    let loaded = false;

    function playerUrl() {
      if (provider === 'spotify') {
        return `https://open.spotify.com/embed/track/${encodeURIComponent(id)}?utm_source=generator&theme=0`;
      }
      return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
    }

    function idleButton() {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'media-load-button';
      button.setAttribute('aria-label', buttonLabel || `play ${title}`);

      if (provider === 'youtube') {
        const image = document.createElement('img');
        image.className = 'media-video-poster';
        image.src = cacheBust(`https://i.ytimg.com/vi/${encodeURIComponent(id)}/hqdefault.jpg`);
        image.alt = '';
        image.loading = 'lazy';
        image.addEventListener('error', () => {
          status.textContent = 'The video preview image did not load. The player can still be opened.';
        }, { once: true });
        button.appendChild(image);
      }

      const icon = document.createElement('span');
      icon.setAttribute('aria-hidden', 'true');
      icon.textContent = '▶';
      const label = document.createElement('b');
      label.textContent = buttonLabel || 'play on page';
      const note = document.createElement('small');
      note.textContent = provider === 'spotify' ? 'Tap to open the Spotify player' : 'Tap to load the official video';
      button.append(icon, label, note);
      button.addEventListener('click', () => loadPlayer(false));
      return button;
    }

    function setIdle(message) {
      window.clearTimeout(loadTimer);
      loaded = false;
      stage.replaceChildren(idleButton());
      status.textContent = message;
    }

    function loadPlayer(isRefresh) {
      window.clearTimeout(loadTimer);
      loaded = true;
      status.textContent = isRefresh ? 'Refreshing player.' : 'Loading player.';

      const iframe = document.createElement('iframe');
      iframe.className = 'media-frame';
      iframe.title = title || 'Embedded media player';
      iframe.loading = 'eager';
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      iframe.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
      iframe.setAttribute('allowfullscreen', '');
      iframe.src = cacheBust(playerUrl());
      if (provider === 'spotify') iframe.height = '152';

      iframe.addEventListener('load', () => {
        window.clearTimeout(loadTimer);
        status.textContent = 'Player loaded. Refresh it if playback stays blank.';
      }, { once: true });

      stage.replaceChildren(iframe);
      loadTimer = window.setTimeout(() => {
        status.textContent = 'Still loading. Refresh the player or use the external link.';
      }, 9000);
    }

    refresh.addEventListener('click', () => {
      if (loaded) loadPlayer(true);
      else setIdle('Preview refreshed. Tap Play to load a fresh player.');
      refresh.textContent = '✓ Refreshed';
      window.setTimeout(() => { refresh.textContent = '↻ Refresh player'; }, 1300);
    });

    window.addEventListener('news:media-refresh', () => refresh.click());
    shell.append(stage, tools);
    setIdle(provider === 'spotify' ? 'Spotify waits until you tap Play.' : 'Video waits until you tap Play.');
    return shell;
  }

  function enhanceSpotifySongs() {
    const items = sorted(brief.spotify);
    const cards = [...root.children];

    items.forEach((item, index) => {
      const card = cards[index];
      if (!card || card.querySelector('.media-shell')) return;
      card.classList.add('media-card');

      if (item.isDailySong && dailyAudio) {
        card.appendChild(createAudioShell(dailyAudio, item.title || 'Today’s shared song'));
        return;
      }

      const trackId = safeSpotifyTrackId(item.url);
      if (!trackId) return;
      card.appendChild(createPlayerShell({
        provider: 'spotify',
        id: trackId,
        title: item.title || 'Recommended song',
        buttonLabel: 'play this song on the page'
      }));
    });

    const intro = document.querySelector('#spotify .section-intro');
    if (intro) {
      const extraCount = Math.max(0, items.length - 1);
      intro.textContent = dailyAudio
        ? `Today’s main song begins after access when the browser allows it. ${extraCount ? `${extraCount} more picks are waiting farther down for running, creating, and resetting.` : 'Use either play or pause control at any time.'}`
        : 'Today’s music and video stay asleep until one of you taps them.';
    }

    const badge = document.querySelector('#spotify .section-audience');
    if (badge && items.length > 1) badge.textContent = `${items.length} songs + today’s watch`;
  }

  function createVideoCard(video) {
    const videoId = safeYouTubeId(video?.videoId);
    if (!videoId) return null;

    const card = document.createElement('article');
    card.className = `brief-card media-card ${audienceClass(video.audience)}`;
    const top = document.createElement('div');
    top.className = 'card-topline';

    const label = document.createElement('p');
    label.className = 'card-label';
    label.textContent = video.label || "today's watch";
    top.appendChild(label);

    if (video.status) {
      const status = document.createElement('span');
      status.className = `content-status status-${String(video.status).toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
      status.textContent = video.status;
      top.appendChild(status);
    }

    const title = document.createElement('h3');
    title.textContent = video.title || 'Today’s video';
    const text = document.createElement('p');
    text.className = 'card-copy';
    text.textContent = video.text || '';

    card.append(top, title, text);
    card.appendChild(createPlayerShell({
      provider: 'youtube',
      id: videoId,
      title: video.title || 'Today’s video',
      buttonLabel: video.buttonLabel || "play today's video"
    }));

    const link = document.createElement('a');
    link.className = 'card-link';
    link.href = `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = video.linkLabel || 'open on YouTube';
    card.appendChild(link);
    return card;
  }

  function addDailyVideo() {
    const card = createVideoCard(dailyVideo);
    if (!card) return;
    const firstCard = root.firstElementChild;
    if (firstCard) firstCard.insertAdjacentElement('afterend', card);
    else root.appendChild(card);
  }

  enhanceSpotifySongs();
  addDailyVideo();
})();
