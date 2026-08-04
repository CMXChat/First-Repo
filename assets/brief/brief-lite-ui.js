(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const OFFICIAL_YOUTUBE_ID = 'YF1R0hc5Q2I';
  const VALID_PRESETS = new Set(['individual', 'couple', 'partners', 'trainer', 'team']);
  const LITE_COPY = {
    individual: {
      label: 'PERSONAL LITE MODE',
      title: 'Your day without the long scroll.',
      text: 'See the next event, priority, weather, work and personal signals in one compact view.'
    },
    couple: {
      label: 'RELATIONSHIP LITE MODE',
      title: 'The shared plan in one calm view.',
      text: 'See one shared priority, one repair, the next plan and the approved couple space without opening every module.'
    },
    partners: {
      label: 'BUSINESS LITE MODE',
      title: 'The operating picture before the dashboards.',
      text: 'See cash, delivery risk, owners, projects and the next decision in a compact executive view.'
    },
    trainer: {
      label: 'TRAINER LITE MODE',
      title: 'Today’s training signal, clearly.',
      text: 'See the session, habit check, readiness and one coaching adjustment without the full workspace.'
    },
    team: {
      label: 'TEAM LITE MODE',
      title: 'Your work and handoffs at a glance.',
      text: 'See role priorities, blockers, handoffs and project progress in one compact team view.'
    }
  };

  let initialized = false;
  let entryGuardUntil = 0;
  let entryGuardTimer = 0;
  let entryGuardRelease = 0;
  let officialPlaying = false;
  let uiApplyTimer = 0;
  let uiApplyAttempts = 0;

  function now() {
    return window.performance?.now?.() || Date.now();
  }

  function reducedMotion() {
    return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
  }

  function preset() {
    const value = window.BRIEF_APP?.getPreset?.() || 'individual';
    return VALID_PRESETS.has(value) ? value : 'individual';
  }

  function showToast(message) {
    window.BRIEF_APP?.showToast?.(message);
  }

  function refreshLiteStylesheet() {
    const href = '/assets/brief/brief-lite-ui.css?v=20260804-2';
    const existing = [...document.querySelectorAll('link[rel="stylesheet"]')]
      .find(link => /\/assets\/brief\/brief-lite-ui\.css/.test(link.getAttribute('href') || ''));
    if (existing) {
      if (existing.getAttribute('href') !== href) existing.setAttribute('href', href);
      return;
    }
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }

  function cleanEntryRoute() {
    try {
      const url = new URL(window.location.href);
      url.hash = '';
      ['tab', 'depth', 'section', 'route', 'view'].forEach(key => url.searchParams.delete(key));
      window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}`);
    } catch {}
  }

  function forceDocumentTop() {
    if (entryGuardUntil) cleanEntryRoute();
    const nodes = [
      document.scrollingElement,
      document.documentElement,
      document.body,
      $('#briefApp'),
      $('#briefMain'),
      $('#entryGate')
    ].filter(Boolean);
    nodes.forEach(node => {
      node.scrollTop = 0;
      node.scrollLeft = 0;
    });
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }

  function stopEntryGuard() {
    window.clearInterval(entryGuardTimer);
    window.clearTimeout(entryGuardRelease);
    entryGuardTimer = 0;
    entryGuardUntil = 0;
    document.documentElement.classList.remove('brief-entry-top-guard');
    document.body?.removeAttribute('data-brief-entry-opening');
  }

  function enforceEntryTop() {
    if (!entryGuardUntil || now() > entryGuardUntil) {
      stopEntryGuard();
      return;
    }
    const position = window.scrollY
      || document.scrollingElement?.scrollTop
      || document.documentElement.scrollTop
      || document.body.scrollTop;
    const appPosition = $('#briefApp')?.scrollTop || $('#briefMain')?.scrollTop || 0;
    if (position > 1 || appPosition > 1) forceDocumentTop();
  }

  function startEntryGuard() {
    stopEntryGuard();
    document.body?.classList.remove('brief-lite-mode-active');
    cleanEntryRoute();
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    entryGuardUntil = now() + 2600;
    document.documentElement.classList.add('brief-entry-top-guard');
    document.body?.setAttribute('data-brief-entry-opening', 'true');
    forceDocumentTop();
    entryGuardTimer = window.setInterval(forceDocumentTop, 45);
    entryGuardRelease = window.setTimeout(() => {
      forceDocumentTop();
      window.requestAnimationFrame(() => {
        forceDocumentTop();
        stopEntryGuard();
      });
    }, 2650);
  }

  function installSafeScrollIntoView() {
    if (window.__CMX_BRIEF_SCROLL_SAFETY__) return;
    window.__CMX_BRIEF_SCROLL_SAFETY__ = true;
    const nativeScrollIntoView = Element.prototype.scrollIntoView;

    Element.prototype.scrollIntoView = function scrollIntoView(options) {
      const stickyHost = this.closest?.('#briefStickyRoutes');
      if (stickyHost) {
        const targetLeft = Math.max(0, this.offsetLeft - ((stickyHost.clientWidth - this.offsetWidth) / 2));
        stickyHost.scrollTo({
          left: targetLeft,
          behavior: reducedMotion() ? 'auto' : 'smooth'
        });
        return;
      }

      if (document.documentElement.classList.contains('brief-entry-top-guard')) {
        const entrySafe = this.id === 'today'
          || this.id === 'briefMain'
          || Boolean(this.closest?.('#entryGate'));
        if (!entrySafe) return;
      }

      return nativeScrollIntoView.call(this, options);
    };
  }

  function scrollElementBelowHeader(element, behavior = reducedMotion() ? 'auto' : 'smooth') {
    if (!element) return;
    const header = $('.topbar');
    const offset = Math.max(12, (header?.getBoundingClientRect().height || 0) + 12);
    const top = element.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: Math.max(0, top), left: 0, behavior });
  }

  function officialVideoUrl(autoplay = false) {
    const params = new URLSearchParams({
      autoplay: autoplay ? '1' : '0',
      controls: '1',
      playsinline: '1',
      enablejsapi: '1',
      loop: '1',
      playlist: OFFICIAL_YOUTUBE_ID,
      rel: '0',
      modestbranding: '1',
      origin: window.location.origin
    });
    return `https://www.youtube-nocookie.com/embed/${OFFICIAL_YOUTUBE_ID}?${params.toString()}`;
  }

  function youtubeCommand(frame, func, args = []) {
    if (!frame?.contentWindow) return;
    frame.contentWindow.postMessage(JSON.stringify({ event: 'command', func, args }), '*');
  }

  function syncMusicButton() {
    const button = $('#audioButton');
    if (!button) return;
    button.classList.toggle('is-active', officialPlaying);
    button.setAttribute('aria-pressed', String(officialPlaying));
    button.setAttribute('aria-label', officialPlaying ? 'Pause today’s song' : 'Play today’s song');
    button.title = officialPlaying ? 'Pause today’s song' : 'Play today’s song';
  }

  function startOfficialMusic(attempt = 0) {
    const frame = $('#youtubeFeaturedFrame');
    if (!frame) {
      const sectionButton = $('#musicPreviewButton');
      if (sectionButton && !sectionButton.disabled && /official song/i.test(sectionButton.textContent || '')) {
        sectionButton.click();
        window.setTimeout(() => {
          officialPlaying = true;
          syncMusicButton();
        }, 120);
        return;
      }
      if (attempt < 10) {
        window.setTimeout(() => startOfficialMusic(attempt + 1), 180);
        return;
      }
      scrollElementBelowHeader($('#music'));
      showToast('The music player is opening below. Tap the visible player once if your browser blocks sound.');
      return;
    }

    if (!frame.dataset.liteMusicStarted) {
      frame.dataset.liteMusicStarted = 'true';
      frame.src = officialVideoUrl(true);
    } else {
      youtubeCommand(frame, 'setVolume', [30]);
      youtubeCommand(frame, 'playVideo');
    }

    officialPlaying = true;
    syncMusicButton();
    const note = $('#musicPreviewNote');
    if (note) note.textContent = 'Playing the official song player. Full controls remain available in the Music section.';
  }

  function pauseOfficialMusic() {
    const frame = $('#youtubeFeaturedFrame');
    if (frame) youtubeCommand(frame, 'pauseVideo');
    officialPlaying = false;
    syncMusicButton();
  }

  function toggleOfficialMusic() {
    if (officialPlaying) pauseOfficialMusic();
    else startOfficialMusic();
  }

  function handleYoutubeMessage(event) {
    const frame = $('#youtubeFeaturedFrame');
    if (!frame || event.source !== frame.contentWindow) return;
    let payload = event.data;
    try {
      if (typeof payload === 'string') payload = JSON.parse(payload);
    } catch {
      return;
    }
    const playerState = payload?.info?.playerState ?? (typeof payload?.info === 'number' ? payload.info : null);
    if (playerState === 1) officialPlaying = true;
    if ([0, 2, -1].includes(playerState)) officialPlaying = false;
    if (typeof playerState === 'number') syncMusicButton();
  }

  function activateLiteMode({ scroll = true, resetTab = true } = {}) {
    const body = document.body;
    body.classList.add('brief-lite-mode-active');
    body.dataset.briefDepth = 'quick';

    const quick = $('[data-depth-choice="quick"]');
    if (quick?.getAttribute('aria-pressed') !== 'true') quick.click();

    window.setTimeout(() => {
      body.dataset.briefDepth = 'quick';
      if (resetTab) {
        const overview = $('[data-workspace-tab="overview"]');
        if (overview?.getAttribute('aria-selected') !== 'true') overview.click();
      }
      if (scroll) scrollElementBelowHeader($('#briefWorkspace'));
      $('#briefWorkspacePanel')?.focus?.({ preventScroll: true });
    }, 120);
  }

  function deactivateLiteMode() {
    document.body.classList.remove('brief-lite-mode-active');
  }

  function installEntryMusicAndDepthCapture() {
    document.addEventListener('click', event => {
      const enter = event.target.closest?.('#enterBrief');
      if (enter && !enter.disabled) {
        startEntryGuard();
        const musicOption = $('#musicOnEntry');
        const hasPreview = /^https:\/\//.test(String(window.CMX_DAILY_SONG?.previewUrl || ''));
        const entryMusicRequested = Boolean(musicOption?.checked && !hasPreview);
        if (entryMusicRequested && musicOption) musicOption.checked = false;
        if (entryMusicRequested) {
          window.setTimeout(() => {
            startOfficialMusic();
            if (musicOption) musicOption.checked = true;
          }, 900);
        }
      }

      const audio = event.target.closest?.('#audioButton');
      if (audio) {
        event.preventDefault();
        event.stopImmediatePropagation();
        toggleOfficialMusic();
        return;
      }

      const depth = event.target.closest?.('[data-depth-choice]');
      if (depth?.dataset.depthChoice === 'full') deactivateLiteMode();
      if (depth?.dataset.depthChoice === 'quick') {
        window.setTimeout(() => activateLiteMode({ scroll: false, resetTab: false }), 0);
      }
    }, true);

    window.addEventListener('scroll', enforceEntryTop, { passive: true });
    window.addEventListener('brief:device-fallback-open', startEntryGuard);
    window.addEventListener('message', handleYoutubeMessage);

    const bodyObserver = new MutationObserver(() => {
      if (!entryGuardUntil || document.body.classList.contains('is-locked')) return;
      enforceEntryTop();
    });
    bodyObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  }

  function controlLabel(button, label) {
    if (!button) return;
    button.title = label;
    button.setAttribute('aria-label', label);
  }

  function polishTopControls() {
    const actions = $('.top-actions');
    if (!actions) return false;

    const scenario = $('#scenarioMenuButton');
    if (scenario && scenario.dataset.liteIcon !== 'true') {
      scenario.dataset.liteIcon = 'true';
      scenario.innerHTML = '<span class="brief-control-glyph" aria-hidden="true">↔</span><span class="brief-control-sr">Switch briefing</span>';
    }

    controlLabel(scenario, 'Switch briefing');
    controlLabel($('#themeToggleButton'), document.documentElement.dataset.theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
    controlLabel($('#briefTopMapButton'), 'Open briefing map');
    controlLabel($('#audioButton'), officialPlaying ? 'Pause today’s song' : 'Play today’s song');
    controlLabel($('#readButton'), 'Read the opening aloud');
    controlLabel($('#explainButton'), 'Open help and guided tour');

    const ordered = [
      '#scenarioMenuButton',
      '#themeToggleButton',
      '#briefTopMapButton',
      '#briefVisionButton',
      '#briefTopVisionButton',
      '#audioButton',
      '#readButton',
      '#explainButton'
    ].map(selector => $(selector, actions)).filter(Boolean);
    ordered.forEach(node => actions.appendChild(node));
    actions.dataset.litePolished = 'true';
    return true;
  }

  function moveSpaceControl() {
    const workspace = $('#briefWorkspace');
    const button = $('#viewModeButton');
    if (!workspace || !button) return false;

    let widget = $('#briefSpaceWidget');
    if (!widget) {
      widget = document.createElement('div');
      widget.id = 'briefSpaceWidget';
      widget.className = 'brief-space-widget';
      widget.innerHTML = '<div><span>SPACE CONTROL</span><strong>Private profile or approved shared view</strong></div>';
      const rail = $('.brief-signal-rail', workspace);
      if (rail) workspace.insertBefore(widget, rail);
      else $('.brief-workspace-top', workspace)?.insertAdjacentElement('afterend', widget);
    }

    if (button.parentElement !== widget) widget.appendChild(button);
    button.classList.add('brief-space-toggle');
    button.title = 'Switch between the private profile and approved shared view';
    return true;
  }

  function createLiteSection() {
    let section = $('#briefLiteExperience');
    if (section) return section;

    section = document.createElement('section');
    section.id = 'briefLiteExperience';
    section.className = 'brief-section brief-lite-experience';
    section.setAttribute('aria-labelledby', 'briefLiteTitle');
    section.innerHTML = `
      <div class="brief-lite-copy">
        <span id="briefLiteLabel">LITE MODE</span>
        <div><h2 id="briefLiteTitle">Your briefing without the long scroll.</h2><p id="briefLiteText">Open the compact view for the few things that matter now.</p></div>
      </div>
      <div class="brief-lite-actions">
        <small>QUICK · FOCUSED · ONE TAP</small>
        <button id="briefLiteButton" type="button"><span aria-hidden="true">ϟ</span><b>Open Lite Mode</b></button>
      </div>`;

    const anchor = $('#briefingFooterSwitcher') || $('#connections') || $('#sharedSpace');
    if (anchor?.parentNode) anchor.parentNode.insertBefore(section, anchor);
    else $('#briefMain')?.appendChild(section);

    $('#briefLiteButton', section)?.addEventListener('click', () => activateLiteMode({ scroll: true, resetTab: true }));
    return section;
  }

  function syncLiteSection() {
    const section = createLiteSection();
    if (!section) return false;
    const current = preset();
    const copy = LITE_COPY[current] || LITE_COPY.individual;
    section.dataset.preset = current;
    $('#briefLiteLabel', section).textContent = copy.label;
    $('#briefLiteTitle', section).textContent = copy.title;
    $('#briefLiteText', section).textContent = copy.text;
    return true;
  }

  function applyUi() {
    const top = polishTopControls();
    const space = moveSpaceControl();
    const lite = syncLiteSection();
    syncMusicButton();
    return top && space && lite;
  }

  function scheduleUiApply() {
    window.clearTimeout(uiApplyTimer);
    uiApplyAttempts = 0;
    const run = () => {
      uiApplyAttempts += 1;
      const complete = applyUi();
      if (!complete && uiApplyAttempts < 36) uiApplyTimer = window.setTimeout(run, 220);
    };
    run();
  }

  function init() {
    if (initialized) return;
    initialized = true;
    refreshLiteStylesheet();
    installSafeScrollIntoView();
    installEntryMusicAndDepthCapture();
    scheduleUiApply();

    window.addEventListener('brief:preset-change', () => window.setTimeout(() => {
      syncLiteSection();
      moveSpaceControl();
      polishTopControls();
      if (document.body.classList.contains('brief-lite-mode-active')) {
        activateLiteMode({ scroll: false, resetTab: true });
      }
    }, 180));

    window.addEventListener('brief:device-fallback-open', () => window.setTimeout(scheduleUiApply, 180));

    document.addEventListener('click', event => {
      if (event.target.closest?.('#themeToggleButton, #scenarioMenuButton, [data-workspace-tab]')) {
        window.setTimeout(() => {
          polishTopControls();
          syncLiteSection();
        }, 80);
      }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
