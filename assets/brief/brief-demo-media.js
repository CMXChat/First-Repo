(() => {
  'use strict';

  const SPOTIFY_IFRAME_API_SRC = 'https://open.spotify.com/embed/iframe-api/v1';
  const TRACK_SETTLE_DELAY_MS = 650;
  const API_TIMEOUT_MS = 9000;
  const PLAYBACK_CONFIRM_MS = 1800;

  const state = {
    scenarioId: '',
    controller: null,
    controllerReady: false,
    trackReady: false,
    loadedTrackId: '',
    playing: false,
    entryPlaybackRequested: false,
    apiRequested: false,
    apiFailed: false,
    trackReadyTimer: 0,
    apiTimeoutTimer: 0,
    playbackConfirmTimer: 0,
    entryObserver: null
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

  function entryTrackIsReady(id = selectedEntryScenarioId()) {
    const selected = scenario(id);
    return Boolean(
      selected?.soundtrack?.spotifyTrackId &&
      state.controllerReady &&
      state.trackReady &&
      state.loadedTrackId === selected.soundtrack.spotifyTrackId
    );
  }

  function setStatus(message) {
    const node = $('#mediaStatus');
    if (node) node.textContent = message;
  }

  function syncButton() {
    const button = $('#previewButton');
    if (!button) return;
    button.disabled = !state.controllerReady || !state.trackReady;
    button.setAttribute('aria-pressed', String(state.playing));
    button.textContent = state.playing
      ? 'Pause Spotify soundtrack'
      : state.controllerReady && state.trackReady
        ? 'Play Spotify soundtrack'
        : 'Loading Spotify player...';
  }

  function syncEntryButton() {
    const button = $('#openDemo');
    const selectedId = selectedEntryScenarioId();
    const selected = scenario(selectedId);
    if (!button || !selected) return;

    if (!entryWantsMusic()) {
      button.disabled = false;
      button.textContent = `Open ${selected.label} demo`;
      button.dataset.soundtrackState = 'off';
      return;
    }

    if (entryTrackIsReady(selectedId)) {
      button.disabled = false;
      button.textContent = `Open ${selected.label} demo`;
      button.dataset.soundtrackState = 'ready';
      return;
    }

    if (state.apiFailed) {
      button.disabled = false;
      button.textContent = `Open ${selected.label} demo`;
      button.dataset.soundtrackState = 'fallback';
      return;
    }

    button.disabled = true;
    button.textContent = `Preparing ${selected.label} soundtrack...`;
    button.dataset.soundtrackState = 'preparing';
  }

  function clearTimer(name) {
    if (!state[name]) return;
    window.clearTimeout(state[name]);
    state[name] = 0;
  }

  function markTrackReady(trackId, delay = TRACK_SETTLE_DELAY_MS) {
    clearTimer('trackReadyTimer');
    state.trackReady = false;
    syncButton();
    syncEntryButton();

    state.trackReadyTimer = window.setTimeout(() => {
      if (!state.controllerReady || state.loadedTrackId !== trackId) return;
      state.trackReady = true;
      setStatus(`Spotify is ready with ${track()?.title || 'the selected soundtrack'}.`);
      syncButton();
      syncEntryButton();
      document.dispatchEvent(new CustomEvent('briefdemo:mediaready', {
        detail: { scenarioId: state.scenarioId, trackId }
      }));
    }, Math.max(0, delay));
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
    if (!host || !source) return;

    if (host.tagName === 'IFRAME') {
      if (host.getAttribute('src') !== source) host.src = source;
      return;
    }

    const frame = document.createElement('iframe');
    frame.id = 'spotifyFrame';
    frame.title = `Play ${track()?.title || 'the selected soundtrack'} on Spotify`;
    frame.loading = 'eager';
    frame.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
    frame.src = source;
    host.replaceWith(frame);
  }

  function failToFallback(message) {
    state.apiFailed = true;
    state.controllerReady = false;
    state.trackReady = false;
    clearTimer('apiTimeoutTimer');
    renderFallbackFrame();
    setStatus(message);
    syncButton();
    syncEntryButton();
  }

  function loadCurrentTrack() {
    const current = track();
    if (!current?.spotifyTrackId) return;

    if (state.controllerReady && state.controller && state.loadedTrackId !== current.spotifyTrackId) {
      state.trackReady = false;
      state.controller.loadEntity(spotifyUri());
      state.loadedTrackId = current.spotifyTrackId;
      state.playing = false;
      setStatus(`Loading ${current.title} before the demo opens...`);
      markTrackReady(current.spotifyTrackId);
      return;
    }

    if (state.controllerReady && state.loadedTrackId === current.spotifyTrackId && !state.trackReady) {
      markTrackReady(current.spotifyTrackId, 0);
      return;
    }

    if (state.apiFailed) renderFallbackFrame();
    syncEntryButton();
  }

  function schedulePlaybackConfirmation() {
    clearTimer('playbackConfirmTimer');
    state.playbackConfirmTimer = window.setTimeout(() => {
      if (state.playing || !state.entryPlaybackRequested) return;
      state.entryPlaybackRequested = false;
      setStatus('Spotify did not accept automatic playback on this device. Tap the visible Spotify control once to start it.');
      open();
    }, PLAYBACK_CONFIRM_MS);
  }

  function playProvider() {
    const current = track();
    if (!state.controllerReady || !state.trackReady || !state.controller || !current) {
      setStatus('Spotify is still preparing. Wait for the Open demo button to become ready.');
      syncButton();
      syncEntryButton();
      return false;
    }

    try {
      state.entryPlaybackRequested = true;
      setStatus(`Starting ${current.title} from your Open demo click...`);
      state.controller.play();
      schedulePlaybackConfirmation();
      return true;
    } catch {
      state.playing = false;
      state.entryPlaybackRequested = false;
      setStatus('The browser blocked Spotify playback. Tap the soundtrack control once to start it.');
      syncButton();
      open();
      return false;
    }
  }

  function pause() {
    if (!state.controllerReady || !state.controller) return;
    try {
      state.controller.pause();
    } catch {}
  }

  function attachController(controller) {
    state.controller = controller;

    controller.addListener('ready', () => {
      clearTimer('apiTimeoutTimer');
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
      state.playing = true;
      state.entryPlaybackRequested = false;
      setStatus(`Playing ${track()?.title || 'the selected soundtrack'} through Spotify.`);
      syncButton();
      if (event?.data?.playingURI) state.loadedTrackId = event.data.playingURI.split(':').pop();
    });

    controller.addListener('playback_update', event => {
      if (typeof event?.data?.isPaused !== 'boolean') return;
      state.playing = !event.data.isPaused;
      if (state.playing) {
        clearTimer('playbackConfirmTimer');
        state.entryPlaybackRequested = false;
      }
      syncButton();
    });
  }

  function createSpotifyController(IFrameAPI) {
    const host = $('#spotifyFrame');
    const current = track();
    const uri = spotifyUri();
    if (!host || host.tagName === 'IFRAME' || !uri || !IFrameAPI?.createController || !current) return;

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
    if (state.apiRequested) return;
    state.apiRequested = true;

    if (window.BRIEF_SPOTIFY_IFRAME_API?.createController) {
      createSpotifyController(window.BRIEF_SPOTIFY_IFRAME_API);
      return;
    }

    window.onSpotifyIframeApiReady = IFrameAPI => createSpotifyController(IFrameAPI);

    const script = document.createElement('script');
    script.src = SPOTIFY_IFRAME_API_SRC;
    script.async = true;
    script.dataset.briefSpotifyApi = 'true';
    script.addEventListener('error', () => {
      failToFallback('Spotify loaded in tap-to-play mode because its playback controller was unavailable.');
    }, { once: true });
    document.head.append(script);

    state.apiTimeoutTimer = window.setTimeout(() => {
      if (state.controllerReady) return;
      failToFallback('Spotify took too long to prepare. The normal tap-to-play player is available instead.');
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

    installSpotifyApi();
    loadCurrentTrack();

    if (!state.controllerReady && !state.apiFailed) {
      setStatus(`Preparing ${currentTrack.title} before the demo opens.`);
    }
    syncButton();
    syncEntryButton();
  }

  function togglePreview() {
    if (state.playing) {
      pause();
      return;
    }
    playProvider();
  }

  function requestEntryPlayback(id, enabled) {
    state.entryPlaybackRequested = Boolean(enabled);
    setScenario(id);

    if (!enabled) {
      setStatus('Automatic soundtrack playback is off for this entry.');
      return false;
    }

    if (!entryTrackIsReady(id)) {
      state.entryPlaybackRequested = false;
      setStatus('Spotify was not ready in time. Wait for the entry button to finish preparing the soundtrack.');
      syncEntryButton();
      return false;
    }

    return playProvider();
  }

  function open() {
    const drawer = $('#mediaDrawer');
    const button = $('#mediaButton');
    if (!drawer) return;
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    button?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    drawer.querySelector('[data-close-media]')?.focus({ preventScroll: true });
  }

  function close() {
    const drawer = $('#mediaDrawer');
    const button = $('#mediaButton');
    if (!drawer) return;
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    button?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    button?.focus({ preventScroll: true });
  }

  function reset() {
    pause();
    close();
    clearTimer('playbackConfirmTimer');
    state.entryPlaybackRequested = false;
    syncEntryButton();
  }

  function installEntryReadinessGuard() {
    document.addEventListener('click', event => {
      const openButton = event.target.closest('#openDemo');
      if (!openButton || !entryWantsMusic()) return;
      const selectedId = selectedEntryScenarioId();
      if (!selectedId || entryTrackIsReady(selectedId) || state.apiFailed) return;

      event.preventDefault();
      event.stopImmediatePropagation();
      setStatus('The soundtrack is still preparing. Open the demo when the button becomes ready.');
      syncEntryButton();
    }, true);

    document.addEventListener('click', event => {
      const option = event.target.closest('[data-entry-scenario]');
      if (!option?.dataset.entryScenario) return;
      setScenario(option.dataset.entryScenario);
      queueMicrotask(syncEntryButton);
    });

    $('#entrySoundtrack')?.addEventListener('change', syncEntryButton);

    const grid = $('#entryScenarioGrid');
    if (grid && 'MutationObserver' in window) {
      state.entryObserver = new MutationObserver(syncEntryButton);
      state.entryObserver.observe(grid, {
        attributes: true,
        attributeFilter: ['aria-pressed'],
        childList: true,
        subtree: true
      });
    }
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
    isEntryReady: entryTrackIsReady
  };

  installEntryReadinessGuard();
  setScenario(window.BRIEF_DEMO_DATA?.meta?.defaultScenario || 'personal');
})();
