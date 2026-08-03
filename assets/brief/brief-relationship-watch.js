(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  let initialized = false;
  let retryTimer = 0;
  let retryCount = 0;
  let loadTimer = 0;

  function escapeHtml(value) {
    const node = document.createElement('div');
    node.textContent = String(value ?? '');
    return node.innerHTML;
  }

  function currentPreset() {
    return window.BRIEF_APP?.getPreset?.() || 'individual';
  }

  function validVideo() {
    const video = window.CMX_DAILY_VIDEO;
    if (!video || video.provider !== 'youtube') return null;
    const videoId = String(video.videoId || '').trim();
    if (!/^[A-Za-z0-9_-]{11}$/.test(videoId)) return null;
    return { ...video, videoId };
  }

  function youtubeEmbed(videoId, revision = Date.now()) {
    const params = new URLSearchParams({
      autoplay: '1',
      rel: '0',
      modestbranding: '1',
      playsinline: '1',
      refresh: String(revision)
    });
    return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?${params.toString()}`;
  }

  function youtubeWatch(videoId) {
    return `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`;
  }

  function safeExternalUrl(value, fallback) {
    try {
      const url = new URL(String(value || ''), window.location.href);
      return url.protocol === 'https:' ? url.toString() : fallback;
    } catch {
      return fallback;
    }
  }

  function posterButton(video, revision = Date.now()) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'relationship-watch-poster';
    button.setAttribute('aria-label', video.buttonLabel || `Play ${video.title || 'today’s watch'}`);

    const image = document.createElement('img');
    image.src = `https://i.ytimg.com/vi/${encodeURIComponent(video.videoId)}/hqdefault.jpg?refresh=${revision}`;
    image.alt = '';
    image.loading = 'lazy';

    const icon = document.createElement('span');
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = '▶';

    const label = document.createElement('strong');
    label.textContent = video.buttonLabel || 'Play the official video';

    button.append(image, icon, label);
    return button;
  }

  function setStatus(section, message) {
    const status = $('.relationship-watch-load-status', section);
    if (status) status.textContent = message;
  }

  function loadPlayer(section, video) {
    const player = $('.relationship-watch-player', section);
    if (!player || player.dataset.loaded === 'true') return;
    player.dataset.loaded = 'true';
    setStatus(section, 'Loading the official video…');

    const iframe = document.createElement('iframe');
    iframe.title = `${video.title || 'Today’s watch'} official video`;
    iframe.src = youtubeEmbed(video.videoId);
    iframe.allow = 'autoplay; encrypted-media; fullscreen; picture-in-picture';
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    iframe.addEventListener('load', () => {
      window.clearTimeout(loadTimer);
      setStatus(section, 'Video loaded. Use Refresh video if playback remains blank.');
    }, { once: true });

    player.replaceChildren(iframe);
    window.clearTimeout(loadTimer);
    loadTimer = window.setTimeout(() => {
      setStatus(section, 'Still loading. Refresh the video or open it directly on YouTube.');
    }, 9000);
  }

  function resetPlayer(section, video, announce = true) {
    const player = $('.relationship-watch-player', section);
    if (!player) return;
    window.clearTimeout(loadTimer);
    delete player.dataset.loaded;
    const poster = posterButton(video);
    poster.addEventListener('click', () => loadPlayer(section, video));
    player.replaceChildren(poster);
    setStatus(section, announce ? 'Video reset. Tap Play to load a fresh player.' : 'Player waits until you tap Play.');
  }

  function createCard(video) {
    const fallbackUrl = youtubeWatch(video.videoId);
    const section = document.createElement('section');
    section.id = 'relationshipDailyWatch';
    section.className = 'relationship-daily-watch';
    section.dataset.relationshipWatch = 'true';
    section.innerHTML = `
      <div class="relationship-watch-heading">
        <div><p class="micro-label">TODAY’S WATCH · SHARED MEDIA</p><h3>${escapeHtml(video.title || 'Today’s watch')}</h3></div>
        <span>${escapeHtml(video.status || 'OFFICIAL VIDEO')}</span>
      </div>
      <p class="relationship-watch-copy">${escapeHtml(video.text || 'A daily shared watch selected for the relationship briefing.')}</p>
      <div class="relationship-watch-player" data-video-id="${escapeHtml(video.videoId)}"></div>
      <div class="relationship-watch-footer">
        <div><small>${escapeHtml(video.published || 'Official public video')}</small><span class="relationship-watch-load-status" role="status">Player waits until you tap Play.</span></div>
        <div class="relationship-watch-actions">
          <button type="button" class="relationship-watch-refresh">↻ Refresh video</button>
          <a href="${escapeHtml(safeExternalUrl(video.url, fallbackUrl))}" target="_blank" rel="noopener noreferrer">${escapeHtml(video.linkLabel || 'Open on YouTube')}</a>
        </div>
      </div>`;

    resetPlayer(section, video, false);
    $('.relationship-watch-refresh', section)?.addEventListener('click', event => {
      resetPlayer(section, video, true);
      event.currentTarget.textContent = '✓ Refreshed';
      window.setTimeout(() => { event.currentTarget.textContent = '↻ Refresh video'; }, 1400);
    });

    return section;
  }

  function render() {
    const existing = $('#relationshipDailyWatch');
    if (currentPreset() !== 'couple') {
      existing?.remove();
      return true;
    }

    const video = validVideo();
    const addon = $('#scenarioExperienceAddon');
    if (!video) {
      existing?.remove();
      return true;
    }
    if (!addon) return false;

    if (existing?.dataset.videoId === video.videoId) return true;
    existing?.remove();

    const card = createCard(video);
    card.dataset.videoId = video.videoId;
    const culture = $('.culture-stream', addon);
    if (culture) culture.insertAdjacentElement('beforebegin', card);
    else addon.appendChild(card);
    return true;
  }

  function scheduleRender() {
    window.clearTimeout(retryTimer);
    retryCount = 0;

    const attempt = () => {
      retryCount += 1;
      const complete = render();
      if (!complete && retryCount < 12) retryTimer = window.setTimeout(attempt, 250);
    };

    attempt();
  }

  function init() {
    if (initialized || !window.BRIEF_APP) return;
    initialized = true;
    scheduleRender();
    window.addEventListener('brief:preset-change', () => window.setTimeout(scheduleRender, 120));
    window.addEventListener('brief:device-fallback-open', () => window.setTimeout(scheduleRender, 120));
  }

  window.addEventListener('brief:ready', init, { once: true });
  if (window.BRIEF_APP) init();
  else document.addEventListener('DOMContentLoaded', () => window.setTimeout(init, 900), { once: true });
})();
