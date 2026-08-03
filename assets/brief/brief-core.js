(() => {
  'use strict';

  const config = window.BRIEF_CONFIG;
  const presets = window.BRIEF_PRESETS;
  const data = window.BRIEF_DATA;
  const connections = window.BRIEF_CONNECTIONS;
  const song = window.CMX_DAILY_SONG || null;
  if (!config || !presets || !data || !connections) return;

  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const storageKey = key => `${config.storagePrefix}:${key}`;
  const state = {
    preset: localStorage.getItem(storageKey('preset')) || config.preset,
    shared: false,
    explaining: false,
    songAudio: null,
    narrationActive: false,
    narrationRestoreVolume: null,
    selectedTrack: 0
  };

  function escapeHtml(value) {
    const node = document.createElement('div');
    node.textContent = String(value ?? '');
    return node.innerHTML;
  }

  function showToast(message) {
    const toast = $('#toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove('is-visible'), 3200);
  }

  function applyPreset(id) {
    const preset = presets[id] || presets.individual;
    state.preset = preset.id;
    localStorage.setItem(storageKey('preset'), preset.id);
    $('#greeting').textContent = preset.greeting;
    $('#heroTitle').textContent = preset.heroTitle;
    $('#heroSummary').textContent = preset.summary;
  }

  function renderWeather() {
    $('#weatherLocation').textContent = data.weather.location;
    $('#weatherCondition').textContent = data.weather.condition;
    $('#weatherAdvice').textContent = data.weather.advice;
    $('#weatherMetrics').innerHTML = data.weather.metrics.map(item => `
      <div><span>${escapeHtml(item.label)}</span><strong>${escapeHtml(item.value)}</strong></div>
    `).join('');

    $('#hourlyWeather').innerHTML = data.weather.hourly.map((item, index) => `
      <button class="forecast-item ${index === 0 ? 'is-active' : ''}" type="button" data-weather-index="${index}">
        <span>${escapeHtml(item.time)}</span>
        <i aria-hidden="true"></i>
        <strong>${escapeHtml(item.temp)}°</strong>
        <small>${escapeHtml(item.condition)}</small>
      </button>
    `).join('');

    $('#dailyWeather').innerHTML = data.weather.daily.map(item => `
      <button class="forecast-item" type="button" data-day-label="${escapeHtml(item.time)}">
        <span>${escapeHtml(item.time)}</span>
        <i aria-hidden="true"></i>
        <strong>${escapeHtml(item.temp)}°</strong>
        <small>${escapeHtml(item.low)}° · ${escapeHtml(item.rain)}% rain</small>
      </button>
    `).join('');

    $$('[data-weather-index]').forEach(button => {
      button.addEventListener('click', () => {
        const item = data.weather.hourly[Number(button.dataset.weatherIndex)];
        $$('[data-weather-index]').forEach(card => card.classList.remove('is-active'));
        button.classList.add('is-active');
        $('#weatherTemp').textContent = `${item.temp}°`;
        $('#weatherCondition').textContent = item.condition;
        $('#weatherAdvice').textContent = `${item.rain}% rain chance · ${item.wind} mph wind. Select another hour to compare.`;
      });
    });
  }

  function renderPriorities() {
    const completed = JSON.parse(localStorage.getItem(storageKey('completed')) || '[]');
    $('#priorityBoard').innerHTML = data.priorities.map(item => `
      <article class="priority-card ${completed.includes(item.id) ? 'is-complete' : ''}" data-priority-id="${escapeHtml(item.id)}">
        <div class="priority-rank">${escapeHtml(item.rank)}</div>
        <div class="priority-content">
          <span class="source-label">${escapeHtml(item.status)}</span>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.detail)}</p>
          <div class="priority-meta"><span>${escapeHtml(item.due)}</span><span>${escapeHtml(item.owner)}</span></div>
        </div>
        <button class="complete-button" type="button" aria-label="Toggle ${escapeHtml(item.title)} complete">✓</button>
      </article>
    `).join('');

    $$('.complete-button').forEach(button => {
      button.addEventListener('click', () => {
        const card = button.closest('.priority-card');
        const id = card.dataset.priorityId;
        const values = new Set(JSON.parse(localStorage.getItem(storageKey('completed')) || '[]'));
        if (values.has(id)) values.delete(id); else values.add(id);
        localStorage.setItem(storageKey('completed'), JSON.stringify([...values]));
        card.classList.toggle('is-complete');
        showToast(card.classList.contains('is-complete') ? 'Marked complete on this device.' : 'Moved back to active priorities.');
      });
    });
  }

  function renderSchedule() {
    $('#scheduleTimeline').innerHTML = data.schedule.map(item => `
      <article class="timeline-item">
        <time>${escapeHtml(item.time)}</time>
        <div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.meta)}</p></div>
      </article>
    `).join('');
  }

  function renderShared() {
    const items = state.shared ? data.shared.shared : data.shared.private;
    $('#sharedGrid').innerHTML = items.map(item => `
      <article class="shared-card">
        <span>${escapeHtml(item.label)}</span>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.note)}</p>
      </article>
    `).join('');
    $('#viewModeButton').textContent = state.shared ? 'Shared view' : 'Private view';
    $('#viewModeButton').setAttribute('aria-pressed', String(state.shared));
    $('#sharedToggleInside').textContent = state.shared ? 'Return to private view' : 'Preview shared view';
  }

  function renderConnections() {
    const labels = {
      connected: 'CONNECTED',
      demo: 'DEMO',
      planned: 'PLANNED',
      'not-connected': 'NOT CONNECTED',
      'requires-approval': 'REQUIRES APPROVAL'
    };
    $('#connectionGrid').innerHTML = connections.map(item => `
      <article class="connection-card">
        <div class="connection-heading"><h3>${escapeHtml(item.label)}</h3><span class="connection-status status-${escapeHtml(item.status)}">${labels[item.status] || escapeHtml(item.status)}</span></div>
        <p>${escapeHtml(item.description)}</p>
        <small>Permission: ${escapeHtml(item.permission)}</small>
      </article>
    `).join('');
  }

  function setupWeatherTabs() {
    const hourlyTab = $('#hourlyTab');
    const dailyTab = $('#dailyTab');
    const hourly = $('#hourlyWeather');
    const daily = $('#dailyWeather');
    const switchTo = mode => {
      const isHourly = mode === 'hourly';
      hourlyTab.setAttribute('aria-selected', String(isHourly));
      dailyTab.setAttribute('aria-selected', String(!isHourly));
      hourly.classList.toggle('is-hidden', !isHourly);
      daily.classList.toggle('is-hidden', isHourly);
    };
    hourlyTab.addEventListener('click', () => switchTo('hourly'));
    dailyTab.addEventListener('click', () => switchTo('daily'));
  }

  function safeSpotifyTrackId(url) {
    const match = String(url || '').match(/open\.spotify\.com\/track\/([A-Za-z0-9]{22})/);
    return match ? match[1] : '';
  }

  function trackParts(item) {
    const display = String(item?.displayTitle || item?.title || 'Music selection');
    if (item?.artist) return { title: String(item.title || display), artist: String(item.artist) };
    const parts = display.split(' · ');
    return { title: parts[0] || display, artist: parts.slice(1).join(' · ') || 'Spotify selection' };
  }

  function spotifyUrl(item) {
    return String(item?.spotifyUrl || item?.url || '');
  }

  function formatTime(value) {
    if (!Number.isFinite(value) || value < 0) return '0:00';
    const minutes = Math.floor(value / 60);
    const seconds = Math.floor(value % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

  function setSpotifyEmbed(item, index = 0) {
    const id = safeSpotifyTrackId(spotifyUrl(item));
    if (!id) return;
    const parts = trackParts(item);
    $('#spotifyFeaturedFrame').src = `https://open.spotify.com/embed/track/${encodeURIComponent(id)}?utm_source=generator&theme=0`;
    $('#spotifyNowLabel').textContent = `${parts.title} · ${parts.artist}`;
    state.selectedTrack = index;
    $$('.favorite-track').forEach((card, cardIndex) => card.classList.toggle('is-selected', cardIndex === index));
  }

  function updateMusicUi() {
    const audio = state.songAudio;
    const playing = Boolean(audio && !audio.paused && !audio.ended);
    const previewButton = $('#musicPreviewButton');
    if (previewButton) {
      const icon = previewButton.querySelector('span');
      const label = previewButton.querySelector('b');
      if (icon) icon.textContent = playing ? '❚❚' : '▶';
      if (label) label.textContent = playing ? 'Pause actual song preview' : 'Play actual song preview';
      previewButton.setAttribute('aria-pressed', String(playing));
    }
    $('#audioButton').classList.toggle('is-active', playing);
    $('#audioButton').setAttribute('aria-label', playing ? 'Pause today’s song' : 'Play today’s song');
  }

  function updateMusicProgress() {
    const audio = state.songAudio;
    if (!audio) return;
    const duration = Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : 30;
    const percent = Math.min(100, (audio.currentTime / duration) * 100);
    $('#musicCurrentTime').textContent = formatTime(audio.currentTime);
    $('#musicDuration').textContent = formatTime(duration);
    $('#musicProgressBar').style.width = `${percent}%`;
  }

  function renderMusic() {
    const section = $('#music');
    if (!song || !section) {
      if (section) section.hidden = true;
      $('#musicOnEntry').checked = false;
      $('#musicOnEntry').disabled = true;
      $('#gateSongName').textContent = 'No daily song is configured for this demonstration.';
      $('#audioButton').disabled = true;
      return;
    }

    const parts = trackParts(song);
    const displayTitle = song.displayTitle || `${parts.title} · ${parts.artist}`;
    $('#gateSongName').textContent = `${displayTitle} will begin after you press Enter, subject to browser support.`;
    $('#musicTitle').textContent = parts.title;
    $('#musicArtist').textContent = parts.artist;
    $('#musicReason').textContent = song.text || 'Selected to match the pace and mood of the day.';
    $('#musicDirectLine').textContent = song.directLine || 'A daily soundtrack can make the briefing feel alive.';
    $('#musicSpotifyLink').href = spotifyUrl(song) || 'https://open.spotify.com/';
    $('#musicArtDate').textContent = String(song.selectedFor || data.edition.date || '').replaceAll('-', '.');

    const previewUrl = /^https:\/\//.test(String(song.previewUrl || '')) ? String(song.previewUrl) : '';
    if (previewUrl) {
      const audio = new Audio(previewUrl);
      audio.preload = 'metadata';
      audio.volume = 0.3;
      state.songAudio = audio;
      audio.addEventListener('play', () => {
        $('#musicPreviewNote').textContent = `Playing the authorized preview of ${displayTitle}.`;
        updateMusicUi();
      });
      audio.addEventListener('pause', updateMusicUi);
      audio.addEventListener('loadedmetadata', updateMusicProgress);
      audio.addEventListener('timeupdate', updateMusicProgress);
      audio.addEventListener('ended', () => {
        audio.currentTime = 0;
        $('#musicPreviewNote').textContent = 'Preview complete. Use the Spotify player for provider playback.';
        updateMusicProgress();
        updateMusicUi();
      });
      audio.addEventListener('error', () => {
        $('#musicPreviewNote').textContent = 'The preview could not load. The Spotify player remains available.';
        updateMusicUi();
      });
    } else {
      $('#musicPreviewButton').disabled = true;
      $('#musicPreviewNote').textContent = 'No authorized preview is available. Use the Spotify player for playback.';
    }

    const recommendations = Array.isArray(song.recommendations) ? song.recommendations : [];
    const accents = ['rgba(87,168,255,.48)', 'rgba(161,119,255,.48)', 'rgba(255,176,82,.48)'];
    $('#musicFavorites').innerHTML = recommendations.map((item, index) => {
      const itemParts = trackParts(item);
      return `
        <article class="favorite-track" style="--track-accent:${accents[index % accents.length]}">
          <span>${escapeHtml(item.status || item.label || 'FAVORITE')}</span>
          <h4>${escapeHtml(itemParts.title)}<br><small>${escapeHtml(itemParts.artist)}</small></h4>
          <p>${escapeHtml(item.text || 'Saved in the fictional favorites rotation.')}</p>
          <button type="button" data-spotify-track-index="${index}">Load in Spotify player</button>
        </article>
      `;
    }).join('');

    $$('[data-spotify-track-index]').forEach(button => {
      button.addEventListener('click', () => {
        const index = Number(button.dataset.spotifyTrackIndex);
        const item = recommendations[index];
        setSpotifyEmbed(item, index);
        $('#spotifyFeaturedFrame').scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    });

    setSpotifyEmbed(song, -1);
    updateMusicUi();
    updateMusicProgress();
  }

  async function startSoundtrack() {
    const audio = state.songAudio;
    if (!audio) {
      showToast('No actual song preview is available. Use the Spotify player below.');
      return;
    }
    if (audio.ended) audio.currentTime = 0;
    audio.muted = false;
    audio.volume = state.narrationActive ? 0.08 : 0.3;
    try {
      await audio.play();
    } catch {
      $('#musicPreviewNote').textContent = 'Your browser blocked automatic playback. Tap the music button to play.';
      showToast('Your browser blocked the song. Tap the music control to play it.');
    }
    updateMusicUi();
  }

  function stopSoundtrack() {
    if (!state.songAudio) return;
    state.songAudio.pause();
    updateMusicUi();
  }

  function finishNarration() {
    state.narrationActive = false;
    $('#readButton').classList.remove('is-active');
    if (state.songAudio && state.narrationRestoreVolume !== null && !state.songAudio.paused) {
      state.songAudio.volume = state.narrationRestoreVolume;
    }
    state.narrationRestoreVolume = null;
  }

  function readOpening() {
    if (!('speechSynthesis' in window)) {
      showToast('Read aloud is not available in this browser.');
      return;
    }
    if (state.narrationActive) {
      window.speechSynthesis.cancel();
      finishNarration();
      return;
    }
    const words = [$('#greeting').textContent, $('#heroTitle').textContent, $('#heroSummary').textContent, ...data.priorities.map(item => `${item.title}. ${item.detail}`)].join(' ');
    const utterance = new SpeechSynthesisUtterance(words);
    utterance.rate = 0.96;
    utterance.pitch = 1;
    utterance.onend = finishNarration;
    utterance.onerror = finishNarration;
    if (state.songAudio && !state.songAudio.paused) {
      state.narrationRestoreVolume = state.songAudio.volume;
      state.songAudio.volume = 0.08;
    }
    state.narrationActive = true;
    $('#readButton').classList.add('is-active');
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  function unlock() {
    const profile = $('#profileSelect').value;
    applyPreset(profile);
    document.body.classList.remove('is-locked');
    $('#entryGate').classList.add('is-hidden');
    $('#briefApp').setAttribute('aria-hidden', 'false');
    sessionStorage.setItem(storageKey('entered'), 'true');
    if ($('#musicOnEntry').checked) startSoundtrack();
    if ($('#readOnEntry').checked) setTimeout(readOpening, 850);
    $('#briefMain').focus({ preventScroll: true });
  }

  function setupInteractions() {
    $('#enterBrief').addEventListener('click', unlock);
    $('#profileSelect').value = state.preset;
    $('#viewModeButton').addEventListener('click', () => { state.shared = !state.shared; renderShared(); });
    $('#sharedToggleInside').addEventListener('click', () => { state.shared = !state.shared; renderShared(); $('#sharedSpace').scrollIntoView({ behavior: 'smooth' }); });
    $('#audioButton').addEventListener('click', () => state.songAudio && !state.songAudio.paused ? stopSoundtrack() : startSoundtrack());
    $('#musicPreviewButton')?.addEventListener('click', () => state.songAudio && !state.songAudio.paused ? stopSoundtrack() : startSoundtrack());
    $('#readButton').addEventListener('click', readOpening);
    $('#explainButton').addEventListener('click', () => {
      state.explaining = !state.explaining;
      $('#explainButton').setAttribute('aria-pressed', String(state.explaining));
      $('#explainPanel').classList.toggle('is-hidden', !state.explaining);
      document.body.classList.toggle('explain-mode', state.explaining);
    });
    $('#openConnections').addEventListener('click', () => $('#connections').scrollIntoView({ behavior: 'smooth' }));
    $('#resetExperience').addEventListener('click', () => {
      Object.keys(localStorage).filter(key => key.startsWith(config.storagePrefix)).forEach(key => localStorage.removeItem(key));
      sessionStorage.removeItem(storageKey('entered'));
      stopSoundtrack();
      window.speechSynthesis?.cancel();
      window.location.reload();
    });
    $$('[data-concept-action]').forEach(button => {
      button.addEventListener('click', () => showToast(`${button.dataset.conceptAction}: concept action only. A connected account would be required.`));
    });
  }

  function updateClock() {
    const value = new Intl.DateTimeFormat('en-US', { timeZone: data.edition.timezone, hour: 'numeric', minute: '2-digit' }).format(new Date());
    $('#currentTime').textContent = value;
  }

  function init() {
    $('#editionDate').textContent = data.edition.date;
    applyPreset(state.preset);
    renderWeather();
    renderMusic();
    renderPriorities();
    renderSchedule();
    renderShared();
    renderConnections();
    setupWeatherTabs();
    setupInteractions();
    updateClock();
    setInterval(updateClock, 30000);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true }); else init();
})();
