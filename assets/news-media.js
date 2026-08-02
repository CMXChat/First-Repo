(() => {
  'use strict';

  const brief = window.CMX_NEWS_BRIEF || {};
  const dailyVideo = window.CMX_DAILY_VIDEO || null;
  const root = document.getElementById('spotifyCards');
  if (!root) return;

  const crystalAudio = document.getElementById('crystalDailyAudio');
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

    function update() {
      const playing = !audio.paused && !audio.ended;
      icon.textContent = playing ? '❚❚' : '▶';
      label.textContent = playing ? 'pause today’s song' : 'play today’s song';
      button.setAttribute('aria-label', `${playing ? 'pause' : 'play'} ${title}`);
      note.textContent = audio.dataset.autoplay === 'blocked'
        ? 'Your browser blocked automatic sound. Tap to play.'
        : playing
          ? 'Playing automatically after access was granted.'
          : 'Ready when you are.';

      const duration = Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : 30;
      progressBar.style.width = `${Math.min(100, (audio.currentTime / duration) * 100)}%`;
    }

    button.addEventListener('click', async () => {
      if (audio.paused) {
        audio.muted = false;
        try { await audio.play(); } catch {}
      } else {
        audio.pause();
      }
      update();
    });

    audio.addEventListener('play', update);
    audio.addEventListener('pause', update);
    audio.addEventListener('timeupdate', update);
    audio.addEventListener('ended', () => {
      audio.currentTime = 0;
      update();
    });
    window.addEventListener('crystal:audio-ready', update);

    button.append(icon, label, note);
    shell.append(button, progress);
    update();
    return shell;
  }

  function createPlayerShell({ provider, id, title, buttonLabel }) {
    const shell = document.createElement('div');
    shell.className = `media-shell media-${provider}`;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'media-load-button';
    button.setAttribute('aria-label', buttonLabel || `play ${title}`);

    const icon = document.createElement('span');
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = '▶';

    const label = document.createElement('b');
    label.textContent = buttonLabel || 'play on page';

    const note = document.createElement('small');
    note.textContent = 'Tap to load';
    button.append(icon, label, note);

    button.addEventListener('click', () => {
      const iframe = document.createElement('iframe');
      iframe.className = 'media-frame';
      iframe.title = title || 'Embedded media player';
      iframe.loading = 'eager';
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      iframe.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
      iframe.setAttribute('allowfullscreen', '');

      if (provider === 'spotify') {
        iframe.src = `https://open.spotify.com/embed/track/${encodeURIComponent(id)}?utm_source=generator&theme=0`;
        iframe.height = '152';
      } else {
        iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0&modestbranding=1`;
      }

      shell.replaceChildren(iframe);
    }, { once: true });

    shell.appendChild(button);
    return shell;
  }

  function enhanceSpotifySong() {
    const items = sorted(brief.spotify);
    const cards = [...root.children];

    items.forEach((item, index) => {
      if (item.audience !== 'shared') return;
      const card = cards[index];
      if (!card || card.querySelector('.media-shell')) return;

      card.classList.add('media-card');
      if (crystalAudio) {
        card.appendChild(createAudioShell(crystalAudio, item.title || 'Today’s shared song'));
        return;
      }

      const trackId = safeSpotifyTrackId(item.url);
      if (!trackId) return;
      card.appendChild(createPlayerShell({
        provider: 'spotify',
        id: trackId,
        title: item.title || 'Today’s shared song',
        buttonLabel: 'play song on this page'
      }));
    });

    const intro = document.querySelector('#spotify .section-intro');
    if (intro) {
      intro.textContent = crystalAudio
        ? 'Today’s uplifting song is primed by the password click and should begin as the briefing opens. Tap the control if the browser still blocks sound.'
        : 'Today’s shared song and video stay asleep until one of you taps them.';
    }
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

  enhanceSpotifySong();
  addDailyVideo();
})();
