(() => {
  'use strict';

  const SPOTIFY_IFRAME_API_SRC = 'https://open.spotify.com/embed/iframe-api/v1';
  const API_TIMEOUT_MS = 4000;
  const TRACK_SETTLE_DELAY_MS = 350;
  const PLAYBACK_CONFIRM_MS = 1800;

  const state = {
    scenarioId: '',
    controller: null,
    controllerReady: false,
    trackReady: false,
    loadedTrackId: '',
    playing: false,
    apiRequested: false,
    apiFailed: false,
    fallbackMode: false,
    pendingEntryPlayback: false,
    apiTimeoutTimer: 0,
    trackReadyTimer: 0,
    playbackConfirmTimer: 0,
    opener: null,
    previousBodyOverflow: ''
  };

  const $ = selector => document.querySelector(selector);

  function scenario(id = state.scenarioId) {
    return window.BRIEF_DEMO_DATA?.scenarios?.[id] || null;
  }

  function track(id = state.scenarioId) {
    return scenario(id)?.soundtrack || null;
  }

  function spotifyUri(id = state.scenarioId) {
    const current = track(id);
    return current?.spotifyTrackId ? `spotify:track:${current.spotifyTrackId}` : '';
  }

  function spotifyEmbedUrl(id = state.scenarioId) {
    const current = track(id);
    if (!current?.spotifyTrackId) return '';
    return `https://open.spotify.com/embed/track/${encodeURIComponent(current.spotifyTrackId)}?utm_source=generator&theme=0`;
  }

  function selectedEntryScenarioId() {
    return $('[data-entry-scenario][aria-pressed="true"]')?.dataset.entryScenario || '';
  }

  function entryWantsMusic() {
    return $('#entrySoundtrack')?.checked === true;
  }

  function setStatus(message) {
    const node = $('#mediaStatus');
    if (node) node.textContent = message;
  }

  function clearTimer(name) {
    if (!state[name]) return;
    window.clearTimeout(state[name]);
    state[name] = 0;
  }

  function syncEntryButton() {
    const button = $('#openDemo');
    const selected = scenario(selectedEntryScenarioId());
    if (!button || !selected) return;

    button.disabled = false;
    button.textContent = `Open ${selected.label} demo`;
    button.dataset.soundtrackState = entryWantsMusic()
      ? state.controllerReady && state.trackReady
        ? 'ready'
        : state.fallbackMode
          ? 'direct-tap'
          : 'background'
      : 'off';
  }

  function syncButton() {
    const button = $('#previewButton');
    if (!button) return;

    button.hidden = state.fallbackMode;
    if (state.fallbackMode) {
      button.disabled = true;
      button.setAttribute('aria-pressed', 'false');
      button.textContent = 'Use the Spotify player below';
      return;
    }

    button.disabled = !state.controllerReady || !state.trackReady;
    button.setAttribute('aria-pressed', String(state.playing));
    button.textContent = state.playing
      ? 'Pause Spotify soundtrack'
      : state.controllerReady && state.trackReady
        ? 'Play Spotify soundtrack'
        : 'Preparing Spotify player';
  }

  function setDrawerInert(isInert) {
    const drawer = $('#mediaDrawer');
    if (!drawer) return;
    drawer.inert = isInert;
    if (isInert) drawer.setAttribute('inert', '');
    else drawer.removeAttribute('inert');
  }

  function normalizeSpotifyFrame() {
    const frame = document.querySelector('.media-sheet iframe[src*="open.spotify.com/embed"]');
    if (!frame) return;
    frame.id = 'spotifyFrame';
    frame.title = `Play ${track()?.title || 'the selected soundtrack'} on Spotify`;
    frame.setAttribute('allow', 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture');
    frame.setAttribute('loading', 'eager');
  }

  function renderFallbackFrame() {
    const host = $('#spotifyFrame');
    const source = spotifyEmbedUrl();
    if (!host || !source) return null;

    state.apiFailed = true;
    state.fallbackMode = true;
    state.controllerReady = false;
    state.trackReady = false;
    state.playing = false;
    state.pendingEntryPlayback = false;
    clearTimer('apiTimeoutTimer');
    clearTimer('trackReadyTimer');
    clearTimer('playbackConfirmTimer');

    if (host.tagName === 'IFRAME') {
      if (host.getAttribute('src') !== source) host.src = source;
      syncButton();
      syncEntryButton();
      return host;
    }

    const frame = document.createElement('iframe');
    frame.id = 'spotifyFrame';
    frame.title = `Play ${track()?.title || 'the selected soundtrack'} on Spotify`;
    frame.loading = 'eager';
    frame.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
    frame.src = source;
    host.replaceWith(frame);
    syncButton();
    syncEntryButton();
    return frame;
  }

  function failToFallback(message) {
    renderFallbackFrame();
    setStatus(message);
  }

  function schedulePlaybackConfirmation() {
    clearTimer('playbackConfirmTimer');
    state.playbackConfirmTimer = window.setTimeout(() => {
      if (state.playing) return;
      setStatus('Spotify needs one direct tap on this device, so open the soundtrack and press play in Spotify.');
    }, PLAYBACK_CONFIRM_MS);
  }

  function playProvider() {
    const current = track();
    if (state.fallbackMode) {
      const frame = renderFallbackFrame();
      setStatus('Tap play in the Spotify player below.');
      frame?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      return false;
    }

    if (!state.controllerReady || !state.trackReady || !state.controller || !current) {
      setStatus('Spotify is still preparing in the background, but the Brief is ready to use.');
      installSpotifyApi();
      syncButton();
      return false;
    }

    try {
      state.pendingEntryPlayback = false;
      setStatus(`Starting ${current.title}.`);
      state.controller.play();
      schedulePlaybackConfirmation();
      return true;
    } catch {
      state.playing = false;
      setStatus('Spotify needs one direct tap on this device, so open the soundtrack and press play in Spotify.');
      syncButton();
      return false;
    }
  }

  function playPendingEntryRequest() {
    if (!state.pendingEntryPlayback || !entryWantsMusic()) return;
    state.pendingEntryPlayback = false;
    playProvider();
  }

  function markTrackReady(trackId, delay = TRACK_SETTLE_DELAY_MS) {
    clearTimer('trackReadyTimer');
    state.trackReady = false;
    syncButton();

    state.trackReadyTimer = window.setTimeout(() => {
      if (!state.controllerReady || state.loadedTrackId !== trackId || state.fallbackMode) return;
      state.trackReady = true;
      setStatus(`Spotify is ready with ${track()?.title || 'the selected soundtrack'}.`);
      syncButton();
      syncEntryButton();
      document.dispatchEvent(new CustomEvent('briefdemo:mediaready', {
        detail: { scenarioId: state.scenarioId, trackId }
      }));
      queueMicrotask(playPendingEntryRequest);
    }, Math.max(0, delay));
  }

  function loadCurrentTrack() {
    const current = track();
    if (!current?.spotifyTrackId || state.fallbackMode) return;

    if (state.controllerReady && state.controller && state.loadedTrackId !== current.spotifyTrackId) {
      state.trackReady = false;
      state.controller.loadEntity(spotifyUri());
      state.loadedTrackId = current.spotifyTrackId;
      state.playing = false;
      setStatus(`Preparing ${current.title}.`);
      markTrackReady(current.spotifyTrackId);
      return;
    }

    if (state.controllerReady && state.loadedTrackId === current.spotifyTrackId && !state.trackReady) {
      markTrackReady(current.spotifyTrackId, 0);
    }
  }

  function pause() {
    if (state.controllerReady && state.controller) {
      try {
        state.controller.pause();
      } catch {}
    }
    state.playing = false;
    state.pendingEntryPlayback = false;
    clearTimer('playbackConfirmTimer');
    syncButton();
  }

  function attachController(controller) {
    state.controller = controller;

    controller.addListener('ready', () => {
      clearTimer('apiTimeoutTimer');
      if (state.fallbackMode) return;

      state.apiFailed = false;
      state.controllerReady = true;
      normalizeSpotifyFrame();

      const desiredTrackId = track()?.spotifyTrackId || '';
      if (desiredTrackId && state.loadedTrackId !== desiredTrackId) {
        state.trackReady = false;
        controller.loadEntity(spotifyUri());
        state.loadedTrackId = desiredTrackId;
        markTrackReady(desiredTrackId);
      } else if (desiredTrackId) {
        markTrackReady(desiredTrackId, 0);
      }

      syncButton();
      syncEntryButton();
    });

    controller.addListener('playback_started', event => {
      clearTimer('playbackConfirmTimer');
      state.pendingEntryPlayback = false;
      state.playing = true;
      setStatus(`Playing ${track()?.title || 'the selected soundtrack'} through Spotify.`);
      if (event?.data?.playingURI) state.loadedTrackId = event.data.playingURI.split(':').pop();
      syncButton();
    });

    controller.addListener('playback_update', event => {
      if (typeof event?.data?.isPaused !== 'boolean') return;
      state.playing = !event.data.isPaused;
      if (event?.data?.playingURI) state.loadedTrackId = event.data.playingURI.split(':').pop();
      if (state.playing) clearTimer('playbackConfirmTimer');
      syncButton();
    });
  }

  function createSpotifyController(IFrameAPI) {
    const host = $('#spotifyFrame');
    const current = track();
    const uri = spotifyUri();
    if (
      state.fallbackMode ||
      !host ||
      host.tagName === 'IFRAME' ||
      !uri ||
      !IFrameAPI?.createController ||
      !current
    ) return;

    state.apiFailed = false;
    state.loadedTrackId = current.spotifyTrackId;
    state.trackReady = false;

    IFrameAPI.createController(host, {
      uri,
      width: '100%',
      height: 152,
      theme: 'dark'
    }, attachController);
  }

  function installSpotifyApi() {
    if (state.apiRequested || state.fallbackMode) return;
    state.apiRequested = true;

    if (window.BRIEF_SPOTIFY_IFRAME_API?.createController) {
      createSpotifyController(window.BRIEF_SPOTIFY_IFRAME_API);
      return;
    }

    const previousReadyHandler = window.onSpotifyIframeApiReady;
    window.onSpotifyIframeApiReady = IFrameAPI => {
      window.BRIEF_SPOTIFY_IFRAME_API = IFrameAPI;
      if (typeof previousReadyHandler === 'function') {
        try {
          previousReadyHandler(IFrameAPI);
        } catch {}
      }
      createSpotifyController(IFrameAPI);
    };

    const script = document.createElement('script');
    script.src = SPOTIFY_IFRAME_API_SRC;
    script.async = true;
    script.dataset.briefSpotifyApi = 'true';
    script.addEventListener('error', () => {
      failToFallback('Spotify is ready in direct tap mode.');
    }, { once: true });
    document.head.append(script);

    state.apiTimeoutTimer = window.setTimeout(() => {
      if (state.controllerReady || state.fallbackMode) return;
      failToFallback('Spotify is ready in direct tap mode.');
    }, API_TIMEOUT_MS);
  }

  function setScenario(id) {
    const current = scenario(id);
    if (!current) return;
    state.scenarioId = id;
    const currentTrack = current.soundtrack;

    const title = $('#trackTitle');
    const artist = $('#trackArtist');
    const note = $('#trackNote');

    if (title) title.textContent = currentTrack.title;
    if (artist) artist.textContent = currentTrack.artist;
    if (note) note.textContent = currentTrack.note;

    if (state.fallbackMode) {
      renderFallbackFrame();
      setStatus('Tap play in the Spotify player below.');
    } else if (state.controllerReady) {
      loadCurrentTrack();
    } else if (state.apiRequested) {
      setStatus(`Preparing ${currentTrack.title} in the background.`);
    } else {
      setStatus('Spotify loads only when music is requested.');
    }

    syncButton();
    syncEntryButton();
  }

  function togglePreview() {
    if (state.fallbackMode) {
      playProvider();
      return;
    }

    if (state.playing) {
      pause();
      return;
    }

    playProvider();
  }

  function requestEntryPlayback(id, enabled) {
    setScenario(id);

    if (!enabled) {
      state.pendingEntryPlayback = false;
      setStatus('Soundtrack playback is off for this entry.');
      return false;
    }

    installSpotifyApi();

    if (state.controllerReady && state.trackReady) {
      return playProvider();
    }

    state.pendingEntryPlayback = true;
    setStatus('The Brief opened while Spotify continues preparing in the background.');
    return false;
  }

  function open() {
    const drawer = $('#mediaDrawer');
    const button = $('#mediaButton');
    if (!drawer || drawer.classList.contains('is-open')) return;

    state.opener = document.activeElement;
    state.previousBodyOverflow = document.body.style.overflow;
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    setDrawerInert(false);
    button?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';

    if (state.fallbackMode || state.apiFailed || !state.controllerReady) {
      renderFallbackFrame();
      setStatus('Tap play in the Spotify player below.');
    } else if (!state.trackReady) {
      loadCurrentTrack();
      setStatus(`Preparing ${track()?.title || 'the selected soundtrack'}.`);
    }

    drawer.querySelector('[data-close-media]')?.focus({ preventScroll: true });
  }

  function close(options = {}) {
    const { restoreFocus = true } = options;
    const drawer = $('#mediaDrawer');
    const button = $('#mediaButton');
    if (!drawer || !drawer.classList.contains('is-open')) return;

    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    setDrawerInert(true);
    button?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = state.previousBodyOverflow;

    if (restoreFocus && document.body.dataset.entered === 'true') {
      const focusTarget = state.opener instanceof HTMLElement ? state.opener : button;
      focusTarget?.focus({ preventScroll: true });
    }
    state.opener = null;
  }

  function reset() {
    pause();
    close({ restoreFocus: false });
    clearTimer('playbackConfirmTimer');
    setSoundtrackDefaultOff();
    syncEntryButton();
  }

  function setSoundtrackDefaultOff() {
    const choice = $('#entrySoundtrack');
    if (choice) choice.checked = false;
    state.pendingEntryPlayback = false;
    syncEntryButton();
  }

  function enableSoundtrackForScenarioChoice() {
    const choice = $('#entrySoundtrack');
    if (!choice || choice.checked) return;
    choice.checked = true;
    choice.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function installEvents() {
    document.addEventListener('pointerdown', event => {
      if (!event.target.closest('[data-entry-scenario]')) return;
      enableSoundtrackForScenarioChoice();
    }, { capture: true, passive: true });

    document.addEventListener('click', event => {
      const option = event.target.closest('[data-entry-scenario]');
      if (!option?.dataset.entryScenario) return;
      enableSoundtrackForScenarioChoice();
      setScenario(option.dataset.entryScenario);
    });

    $('#entrySoundtrack')?.addEventListener('change', () => {
      if (entryWantsMusic()) {
        installSpotifyApi();
      } else {
        state.pendingEntryPlayback = false;
      }
      syncEntryButton();
    });

    $('#resetDemo')?.addEventListener('click', () => {
      queueMicrotask(setSoundtrackDefaultOff);
    });
  }

  window.BRIEF_DEMO_MEDIA = {
    setScenario,
    requestEntryPlayback,
    togglePreview,
    playPreview: playProvider,
    pause,
    open,
    close,
    reset,
    isEntryReady: () => true
  };

  setDrawerInert(true);
  installEvents();
  setScenario(window.BRIEF_DEMO_DATA?.meta?.defaultScenario || 'personal');
  setSoundtrackDefaultOff();

  // Prepare Spotify while the entry screen is visible so the final Open demo
  // tap can start playback inside Chrome's user-activation window.
  installSpotifyApi();
})();