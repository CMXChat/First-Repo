(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const storageKey = key => `cmxBriefDemo:onboarding:${key}`;
  const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;

  const STEPS = [
    {
      target: '#briefWorkspace',
      title: 'Start with what matters now',
      text: 'Quick briefing compresses the day into a few useful signals, one next move and a clear timeline.'
    },
    {
      target: '#briefWorkspaceTabs',
      title: 'Use the pill views',
      text: 'Open Finance, Work, Watch, Handoffs or another focused view without scrolling through everything.'
    },
    {
      target: '[data-depth-choice="full"]',
      title: 'Go deeper only when needed',
      text: 'Full workspace preserves every dashboard, chart, profile, player, privacy control and technical explanation.'
    },
    {
      target: '.top-actions',
      title: 'Your controls stay close',
      text: 'Switch briefing, change private or shared space, control audio, change appearance and reopen help here.'
    },
    {
      target: '#briefSignalPause',
      title: 'You control movement',
      text: 'Pause or restart the short signal rail. Important cards and decisions never rotate automatically.'
    },
    {
      target: '#explainButton',
      title: 'Help is always one tap away',
      text: 'Use the question mark to replay this tour, turn tips off, review privacy or understand what requires the backend.'
    }
  ];

  const state = {
    current: 0,
    helpOpen: false,
    tourOpen: false,
    returnFocus: null,
    appAriaHidden: null,
    positionTimer: 0,
    stepRetries: 0
  };

  function readStorage(key, fallback = '') {
    try { return localStorage.getItem(storageKey(key)) ?? fallback; } catch { return fallback; }
  }

  function writeStorage(key, value) {
    try { localStorage.setItem(storageKey(key), value); } catch {}
  }

  function tipsEnabled() {
    return readStorage('tips', 'on') !== 'off';
  }

  function setTipsEnabled(enabled) {
    writeStorage('tips', enabled ? 'on' : 'off');
    updateTipsButton();
    if (!enabled) hideInvite();
  }

  function visualViewportBox() {
    const viewport = window.visualViewport;
    return {
      width: viewport?.width || window.innerWidth || document.documentElement.clientWidth,
      height: viewport?.height || window.innerHeight || document.documentElement.clientHeight,
      left: viewport?.offsetLeft || 0,
      top: viewport?.offsetTop || 0
    };
  }

  function setAppInert(enabled) {
    const app = $('#briefApp');
    if (!app) return;
    if (enabled) {
      state.appAriaHidden = app.getAttribute('aria-hidden');
      if ('inert' in app) app.inert = true;
      else app.setAttribute('aria-hidden', 'true');
    } else {
      if ('inert' in app) app.inert = false;
      if (state.appAriaHidden === null) app.removeAttribute('aria-hidden');
      else app.setAttribute('aria-hidden', state.appAriaHidden);
      state.appAriaHidden = null;
    }
  }

  function focusable(root) {
    return $$('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])', root)
      .filter(node => node.offsetParent !== null && !node.hidden);
  }

  function trapFocus(event, root) {
    if (event.key !== 'Tab') return;
    const items = focusable(root);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function updateHelpButton(open = state.helpOpen || state.tourOpen) {
    const button = $('#explainButton');
    if (!button) return;
    button.setAttribute('aria-haspopup', 'dialog');
    button.setAttribute('aria-controls', 'briefHelpCenter');
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? 'Close briefing help' : 'Open briefing help and guided tour');
    button.title = 'Help and guided tour';
  }

  function updateTipsButton() {
    const button = $('#briefTipsToggle');
    if (!button) return;
    const enabled = tipsEnabled();
    button.setAttribute('aria-pressed', String(enabled));
    button.querySelector('strong').textContent = enabled ? 'Tips are on' : 'Tips are off';
    button.querySelector('small').textContent = enabled
      ? 'The optional first-time tour invitation may appear.'
      : 'No automatic tour invitations. Help remains available here.';
  }

  function createHelpCenter() {
    if ($('#briefHelpCenter')) return;
    const layer = document.createElement('div');
    layer.id = 'briefHelpCenter';
    layer.className = 'brief-onboarding-layer brief-help-center';
    layer.hidden = true;
    layer.innerHTML = `
      <button class="brief-glass-backdrop" type="button" data-help-close aria-label="Close help"></button>
      <section class="brief-glass-panel" role="dialog" aria-modal="true" aria-labelledby="briefHelpCenterTitle" aria-describedby="briefHelpCenterIntro">
        <header class="brief-glass-head">
          <div><span>HELP + GUIDED TOUR</span><h2 id="briefHelpCenterTitle">Understand the product without reading a manual.</h2></div>
          <button class="brief-glass-close" type="button" data-help-close aria-label="Close help">×</button>
        </header>
        <p id="briefHelpCenterIntro" class="brief-glass-intro">Take a short tour, control future tips, or review what is real, private and still waiting for the backend.</p>
        <div class="brief-help-actions">
          <button id="briefStartTour" class="brief-help-primary" type="button"><span>30-SECOND TOUR</span><strong>Show me around</strong><small>Six short steps. Skip or close anytime.</small></button>
          <button id="briefTipsToggle" class="brief-help-choice" type="button" aria-pressed="true"><span>TIPS</span><strong>Tips are on</strong><small>The optional first-time tour invitation may appear.</small></button>
        </div>
        <div class="brief-help-sections">
          <details open><summary>What should I do first?</summary><p>Choose a briefing, open it, then use Quick briefing and its pill views. Open Full workspace only when you want the deeper dashboards and explanations.</p></details>
          <details><summary>What do the top controls do?</summary><p>They switch private and shared space, control music and narration, change appearance, switch briefing type and reopen this help center.</p></details>
          <details><summary>What is real and what is demonstration data?</summary><p>Labeled public weather and stories may be current. Private-looking messages, finances, health, relationships, team records and company records are fictional until protected accounts are connected.</p></details>
          <details><summary>What changes when the backend is live?</summary><p>Authenticated users could enter structured information, upload files, connect approved services and authorize actions through the terminal or dashboard. Permissions, encryption, audit history and approval gates remain part of the product.</p></details>
        </div>
        <footer class="brief-help-foot"><span>Press Escape or tap outside to close.</span><button type="button" data-help-close>Done</button></footer>
      </section>`;
    document.body.appendChild(layer);

    $$('[data-help-close]', layer).forEach(button => button.addEventListener('click', closeHelp));
    $('#briefStartTour', layer)?.addEventListener('click', () => {
      closeHelp(false);
      window.setTimeout(() => startTour(0), 80);
    });
    $('#briefTipsToggle', layer)?.addEventListener('click', () => setTipsEnabled(!tipsEnabled()));
    layer.addEventListener('keydown', event => trapFocus(event, $('.brief-glass-panel', layer)));
    updateTipsButton();
  }

  function createTourLayer() {
    if ($('#briefTourLayer')) return;
    const layer = document.createElement('div');
    layer.id = 'briefTourLayer';
    layer.className = 'brief-onboarding-layer brief-tour-layer';
    layer.hidden = true;
    layer.innerHTML = `
      <div id="briefTourSpotlight" class="brief-tour-spotlight" aria-hidden="true"></div>
      <section id="briefTourBubble" class="brief-tour-bubble" role="dialog" aria-modal="true" aria-labelledby="briefTourTitle" aria-describedby="briefTourText">
        <header><span id="briefTourCount">STEP 1 OF ${STEPS.length}</span><button type="button" data-tour-close aria-label="Close tour">×</button></header>
        <h2 id="briefTourTitle"></h2>
        <p id="briefTourText"></p>
        <footer><button type="button" id="briefTourBack">Back</button><button type="button" id="briefTourSkip">Skip tour</button><button type="button" id="briefTourNext">Next</button></footer>
      </section>`;
    document.body.appendChild(layer);

    $('[data-tour-close]', layer)?.addEventListener('click', () => closeTour(false));
    $('#briefTourBack', layer)?.addEventListener('click', () => showStep(state.current - 1));
    $('#briefTourSkip', layer)?.addEventListener('click', () => closeTour(false));
    $('#briefTourNext', layer)?.addEventListener('click', () => {
      if (state.current >= STEPS.length - 1) closeTour(true);
      else showStep(state.current + 1);
    });
    layer.addEventListener('click', event => {
      if (event.target === layer) closeTour(false);
    });
    layer.addEventListener('keydown', event => trapFocus(event, $('#briefTourBubble', layer)));
  }

  function createInvite() {
    if ($('#briefTourInvite')) return;
    const invite = document.createElement('aside');
    invite.id = 'briefTourInvite';
    invite.className = 'brief-tour-invite';
    invite.hidden = true;
    invite.setAttribute('aria-label', 'Optional guided tour');
    invite.innerHTML = `
      <div><span>NEW HERE?</span><strong>Take the 30-second tour.</strong><small>Six clean tips. Nothing gets changed.</small></div>
      <div><button type="button" data-invite-start>Start</button><button type="button" data-invite-later>Not now</button><button type="button" data-invite-off>Turn tips off</button></div>`;
    document.body.appendChild(invite);
    $('[data-invite-start]', invite)?.addEventListener('click', () => { hideInvite(); startTour(0); });
    $('[data-invite-later]', invite)?.addEventListener('click', () => {
      try { sessionStorage.setItem(storageKey('inviteDismissed'), 'true'); } catch {}
      hideInvite();
    });
    $('[data-invite-off]', invite)?.addEventListener('click', () => { setTipsEnabled(false); hideInvite(); });
  }

  function openHelp() {
    createHelpCenter();
    if (state.tourOpen) closeTour(false, false);
    const layer = $('#briefHelpCenter');
    if (!layer || state.helpOpen) return;
    state.helpOpen = true;
    state.returnFocus = document.activeElement;
    layer.hidden = false;
    document.body.classList.add('brief-onboarding-open');
    setAppInert(true);
    updateHelpButton(true);
    window.requestAnimationFrame(() => layer.classList.add('is-visible'));
    window.setTimeout(() => $('#briefStartTour')?.focus(), reducedMotion() ? 0 : 120);
  }

  function closeHelp(restoreFocus = true) {
    const layer = $('#briefHelpCenter');
    if (!layer || !state.helpOpen) return;
    state.helpOpen = false;
    layer.classList.remove('is-visible');
    const finish = () => {
      layer.hidden = true;
      if (!state.tourOpen) {
        document.body.classList.remove('brief-onboarding-open');
        setAppInert(false);
      }
      updateHelpButton(false);
      if (restoreFocus) (state.returnFocus || $('#explainButton'))?.focus?.();
    };
    window.setTimeout(finish, reducedMotion() ? 0 : 160);
  }

  function targetForStep(index) {
    const step = STEPS[index];
    return step ? $(step.target) : null;
  }

  function placeTour() {
    if (!state.tourOpen) return;
    const target = targetForStep(state.current);
    const spotlight = $('#briefTourSpotlight');
    const bubble = $('#briefTourBubble');
    if (!target || !spotlight || !bubble) return;

    const viewport = visualViewportBox();
    const rect = target.getBoundingClientRect();
    const margin = 10;
    const left = Math.max(margin, rect.left - viewport.left - 8);
    const top = Math.max(margin, rect.top - viewport.top - 8);
    const width = Math.max(44, Math.min(rect.width + 16, viewport.width - left - margin));
    const height = Math.max(44, Math.min(rect.height + 16, viewport.height - top - margin));
    spotlight.style.transform = `translate3d(${left}px, ${top}px, 0)`;
    spotlight.style.width = `${width}px`;
    spotlight.style.height = `${height}px`;

    const bubbleRect = bubble.getBoundingClientRect();
    const gap = 16;
    const below = top + height + gap;
    const above = top - bubbleRect.height - gap;
    let bubbleTop = below + bubbleRect.height <= viewport.height - margin ? below : above;
    if (bubbleTop < margin) bubbleTop = Math.max(margin, (viewport.height - bubbleRect.height) / 2);
    let bubbleLeft = left + Math.min(width / 2, 140) - bubbleRect.width / 2;
    bubbleLeft = Math.max(margin, Math.min(bubbleLeft, viewport.width - bubbleRect.width - margin));
    bubble.style.transform = `translate3d(${bubbleLeft}px, ${bubbleTop}px, 0)`;
  }

  function scheduleTourPosition(delay = 0) {
    window.clearTimeout(state.positionTimer);
    state.positionTimer = window.setTimeout(() => {
      window.requestAnimationFrame(() => window.requestAnimationFrame(placeTour));
    }, delay);
  }

  function showStep(index) {
    const next = Math.max(0, Math.min(STEPS.length - 1, index));
    const step = STEPS[next];
    const target = targetForStep(next);
    if (!step) return;
    if (!target) {
      state.stepRetries += 1;
      if (state.stepRetries < 12) {
        window.setTimeout(() => showStep(next), 200);
        return;
      }
      state.stepRetries = 0;
      if (next < STEPS.length - 1) showStep(next + 1);
      else closeTour(false);
      return;
    }
    state.stepRetries = 0;
    state.current = next;
    $('#briefTourCount').textContent = `STEP ${next + 1} OF ${STEPS.length}`;
    $('#briefTourTitle').textContent = step.title;
    $('#briefTourText').textContent = step.text;
    $('#briefTourBack').disabled = next === 0;
    $('#briefTourNext').textContent = next === STEPS.length - 1 ? 'Done' : 'Next';
    target.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'center', inline: 'nearest' });
    scheduleTourPosition(reducedMotion() ? 0 : 320);
    window.setTimeout(() => $('#briefTourNext')?.focus(), reducedMotion() ? 0 : 350);
  }

  function startTour(index = 0) {
    createTourLayer();
    hideInvite();
    if (state.helpOpen) closeHelp(false);
    const layer = $('#briefTourLayer');
    if (!layer) return;
    state.tourOpen = true;
    state.returnFocus = $('#explainButton') || document.activeElement;
    layer.hidden = false;
    document.body.classList.add('brief-onboarding-open');
    setAppInert(true);
    updateHelpButton(true);
    window.requestAnimationFrame(() => layer.classList.add('is-visible'));
    showStep(index);
  }

  function closeTour(completed = false, restoreFocus = true) {
    const layer = $('#briefTourLayer');
    if (!layer || !state.tourOpen) return;
    state.tourOpen = false;
    if (completed) writeStorage('completed', 'true');
    layer.classList.remove('is-visible');
    const finish = () => {
      layer.hidden = true;
      if (!state.helpOpen) {
        document.body.classList.remove('brief-onboarding-open');
        setAppInert(false);
      }
      updateHelpButton(false);
      if (restoreFocus) (state.returnFocus || $('#explainButton'))?.focus?.();
    };
    window.setTimeout(finish, reducedMotion() ? 0 : 140);
  }

  function hideInvite() {
    const invite = $('#briefTourInvite');
    if (!invite) return;
    invite.classList.remove('is-visible');
    window.setTimeout(() => { invite.hidden = true; }, reducedMotion() ? 0 : 140);
  }

  function maybeShowInvite() {
    createInvite();
    if (!tipsEnabled() || readStorage('completed') === 'true') return;
    try { if (sessionStorage.getItem(storageKey('inviteDismissed')) === 'true') return; } catch {}
    if (document.body.classList.contains('is-locked') || state.helpOpen || state.tourOpen) return;
    const invite = $('#briefTourInvite');
    if (!invite) return;
    invite.hidden = false;
    window.requestAnimationFrame(() => invite.classList.add('is-visible'));
  }

  function wireHelpRequests() {
    document.addEventListener('click', event => {
      const trigger = event.target.closest?.('#explainButton, #interactionHint');
      if (!trigger) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      openHelp();
    }, true);
    window.addEventListener('brief:help-request', openHelp);
  }

  function installViewportListeners() {
    const reposition = () => scheduleTourPosition(0);
    window.addEventListener('resize', reposition, { passive: true });
    window.addEventListener('orientationchange', () => scheduleTourPosition(180), { passive: true });
    window.visualViewport?.addEventListener('resize', reposition, { passive: true });
    window.visualViewport?.addEventListener('scroll', reposition, { passive: true });
  }

  function init() {
    createHelpCenter();
    createTourLayer();
    createInvite();
    wireHelpRequests();
    installViewportListeners();
    updateHelpButton(false);

    document.addEventListener('keydown', event => {
      if (event.key !== 'Escape') return;
      if (state.tourOpen) closeTour(false);
      else if (state.helpOpen) closeHelp();
    });

    window.addEventListener('brief:device-fallback-open', () => window.setTimeout(maybeShowInvite, 1100));
    window.addEventListener('brief:preset-change', () => {
      if (state.tourOpen) window.setTimeout(() => showStep(0), 240);
    });
    if (!document.body.classList.contains('is-locked')) window.setTimeout(maybeShowInvite, 1400);
  }

  window.BRIEF_ONBOARDING = { openHelp, closeHelp, startTour, closeTour, setTipsEnabled, tipsEnabled };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
