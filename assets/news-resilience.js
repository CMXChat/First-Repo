(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
  let viewportFrame = 0;
  let helpOpen = false;
  let helpReturnFocus = null;
  let shellAriaHidden = null;

  function installStylesheet() {
    if ($('link[href^="/assets/news-resilience.css"]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `/assets/news-resilience.css?v=${Date.now()}`;
    document.head.appendChild(link);
  }

  function updateViewport() {
    window.cancelAnimationFrame(viewportFrame);
    viewportFrame = window.requestAnimationFrame(() => {
      const viewport = window.visualViewport;
      const width = viewport?.width || window.innerWidth || document.documentElement.clientWidth;
      const height = viewport?.height || window.innerHeight || document.documentElement.clientHeight;
      const top = viewport?.offsetTop || 0;
      const left = viewport?.offsetLeft || 0;
      const layoutHeight = window.innerHeight || document.documentElement.clientHeight || height;
      const keyboardInset = Math.max(0, layoutHeight - height - top);
      const root = document.documentElement.style;
      root.setProperty('--news-viewport-width', `${Math.max(280, width)}px`);
      root.setProperty('--news-viewport-height', `${Math.max(320, height)}px`);
      root.setProperty('--news-viewport-top', `${Math.max(0, top)}px`);
      root.setProperty('--news-viewport-left', `${Math.max(0, left)}px`);
      root.setProperty('--news-keyboard-inset', `${keyboardInset}px`);
      document.documentElement.classList.toggle('news-keyboard-visible', keyboardInset > 120);
    });
  }

  function scheduleViewportRecovery() {
    [0, 80, 220, 520].forEach(delay => window.setTimeout(updateViewport, delay));
  }

  function focusable(root) {
    return $$('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])', root)
      .filter(node => node.offsetParent !== null && !node.hidden);
  }

  function trapFocus(event, root) {
    if (event.key !== 'Tab' || !root) return;
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

  function setShellInert(enabled) {
    const shell = $('.brief-shell');
    if (!shell) return;
    if (enabled) {
      shellAriaHidden = shell.getAttribute('aria-hidden');
      if ('inert' in shell) shell.inert = true;
      else shell.setAttribute('aria-hidden', 'true');
    } else {
      if ('inert' in shell) shell.inert = false;
      if (shellAriaHidden === null) shell.removeAttribute('aria-hidden');
      else shell.setAttribute('aria-hidden', shellAriaHidden);
      shellAriaHidden = null;
    }
  }

  function closeDrawerForHelp() {
    const drawer = $('#newsSectionDrawer');
    if (!drawer || drawer.hidden) return;
    $('[data-news-drawer-close]', drawer)?.click();
  }

  function closeHelpForDrawer() {
    if (helpOpen) closeHelp(false);
  }

  function buildHelp() {
    if ($('#newsHelpLayer')) return;
    const layer = document.createElement('div');
    layer.id = 'newsHelpLayer';
    layer.className = 'news-help-layer';
    layer.hidden = true;
    layer.innerHTML = `
      <button class="news-help-backdrop" type="button" data-news-help-close aria-label="Close briefing help"></button>
      <section class="news-help-panel" role="dialog" aria-modal="true" aria-labelledby="newsHelpTitle" aria-describedby="newsHelpIntro">
        <header class="news-help-head">
          <div><span>BRIEFING HELP</span><h2 id="newsHelpTitle">A few controls, explained once.</h2></div>
          <button class="news-help-close" type="button" data-news-help-close aria-label="Close briefing help">×</button>
        </header>
        <p id="newsHelpIntro" class="news-help-intro">Use this only when something is unclear. The page is meant to work without a manual.</p>
        <div class="news-help-items">
          <details open><summary>Quick or Full?</summary><p>Quick shows Overview, Us, Crystal, Jay, and Plans. Full keeps every section available through the sticky map and All Sections drawer.</p></details>
          <details><summary>What do the colors mean?</summary><p>Blue is Jay, pink is Crystal, and white is shared. Public information, self-reported updates, and waiting-on-input notes keep their own labels.</p></details>
          <details><summary>What is saved?</summary><p>Quick or Full preference, selected tab, paused motion, and checked actions are stored only on this device. They are not shared account data.</p></details>
          <details><summary>What does Refresh do?</summary><p>Refresh retries the live briefing pieces and media players. When offline, the written edition can still be read, but weather, public stories, and players may not update.</p></details>
          <details><summary>How do direct links work?</summary><p>Copy link opens the exact full section. Quick tabs and browser Back or Forward also preserve where you were.</p></details>
        </div>
        <footer><span>Escape or tapping outside closes this panel.</span><button type="button" data-news-help-close>Done</button></footer>
      </section>`;
    document.body.appendChild(layer);
    $$('[data-news-help-close]', layer).forEach(button => button.addEventListener('click', () => closeHelp()));
    layer.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeHelp();
        return;
      }
      trapFocus(event, $('.news-help-panel', layer));
    });
  }

  function addHelpButton() {
    if ($('#newsHelpButton')) return;
    const host = $('.news-map-actions') || $('.news-experience-actions');
    if (!host) return;
    const button = document.createElement('button');
    button.id = 'newsHelpButton';
    button.className = 'news-help-button';
    button.type = 'button';
    button.textContent = '?';
    button.title = 'Briefing help';
    button.setAttribute('aria-label', 'Open briefing help');
    button.setAttribute('aria-haspopup', 'dialog');
    button.setAttribute('aria-controls', 'newsHelpLayer');
    button.setAttribute('aria-expanded', 'false');
    button.addEventListener('click', openHelp);
    host.appendChild(button);
  }

  function openHelp() {
    buildHelp();
    closeDrawerForHelp();
    const layer = $('#newsHelpLayer');
    const button = $('#newsHelpButton');
    if (!layer || helpOpen) return;
    helpOpen = true;
    helpReturnFocus = document.activeElement;
    layer.hidden = false;
    document.body.classList.add('news-help-open');
    setShellInert(true);
    button?.setAttribute('aria-expanded', 'true');
    window.requestAnimationFrame(() => layer.classList.add('is-open'));
    window.setTimeout(() => $('.news-help-close', layer)?.focus(), reducedMotion() ? 0 : 120);
    scheduleViewportRecovery();
  }

  function closeHelp(restoreFocus = true) {
    const layer = $('#newsHelpLayer');
    const button = $('#newsHelpButton');
    if (!layer || !helpOpen) return;
    helpOpen = false;
    layer.classList.remove('is-open');
    const finish = () => {
      layer.hidden = true;
      document.body.classList.remove('news-help-open');
      setShellInert(false);
      button?.setAttribute('aria-expanded', 'false');
      if (restoreFocus) (helpReturnFocus || button)?.focus?.();
    };
    window.setTimeout(finish, reducedMotion() ? 0 : 140);
  }

  function updateConnectionState() {
    const offline = !navigator.onLine;
    document.documentElement.classList.toggle('news-offline', offline);
    const note = $('#newsConnectionNote');
    if (note) note.hidden = !offline;
    window.dispatchEvent(new CustomEvent('news:connection-change', { detail: { offline } }));
  }

  function addConnectionNote() {
    if ($('#newsConnectionNote')) return;
    const map = $('#newsSectionMap');
    const header = $('.brief-header');
    if (!map && !header) return;
    const note = document.createElement('aside');
    note.id = 'newsConnectionNote';
    note.className = 'news-connection-note';
    note.hidden = navigator.onLine;
    note.setAttribute('role', 'status');
    note.setAttribute('aria-live', 'polite');
    note.innerHTML = '<strong>Offline.</strong><span>The written briefing is still available. Weather, public stories, Refresh, and media players may not update.</span>';
    (map || header).insertAdjacentElement('afterend', note);
  }

  function applyCapabilities() {
    const readButton = $('#newsReadBrief');
    if (readButton && !('speechSynthesis' in window)) {
      readButton.disabled = true;
      readButton.classList.add('is-unavailable');
      readButton.textContent = 'Read aloud unavailable';
      readButton.title = 'This browser does not support voice reading. The written briefing still works normally.';
      readButton.setAttribute('aria-label', readButton.title);
    }
    if (!('IntersectionObserver' in window)) document.documentElement.classList.add('news-no-intersection-observer');
    if (!window.visualViewport) document.documentElement.classList.add('news-no-visual-viewport');
  }

  function prepareFrames(root = document) {
    const frames = root.matches?.('iframe') ? [root, ...$$('iframe', root)] : $$('iframe', root);
    frames.forEach(frame => {
      if (frame.dataset.newsDeviceReady === 'true') return;
      frame.dataset.newsDeviceReady = 'true';
      frame.style.maxWidth = '100%';
      if (!frame.getAttribute('loading')) frame.setAttribute('loading', 'lazy');
      frame.addEventListener('error', () => {
        const card = frame.closest('article, aside, section');
        card?.classList.add('news-embed-unavailable');
        const status = card?.querySelector('[role="status"], .news-media-status');
        if (status) status.textContent = navigator.onLine
          ? 'The provider did not load. Use Refresh or open the external link.'
          : 'You are offline. Reconnect, then use Refresh.';
      }, { once: true });
    });
  }

  function watchDynamicContent() {
    if (!('MutationObserver' in window)) return;
    const root = $('.brief-shell') || document.body;
    const observer = new MutationObserver(mutations => {
      const added = [];
      mutations.forEach(mutation => mutation.addedNodes.forEach(node => {
        if (node instanceof Element) added.push(node);
      }));
      if (!added.length) return;
      window.requestAnimationFrame(() => {
        added.forEach(node => prepareFrames(node));
        addHelpButton();
      });
    });
    observer.observe(root, { childList: true, subtree: true });
  }

  function bindOverlayCoordination() {
    document.addEventListener('click', event => {
      if (event.target.closest?.('#newsOpenSectionDrawer')) closeHelpForDrawer();
    }, true);
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && helpOpen) closeHelp();
    });
  }

  function init() {
    installStylesheet();
    updateViewport();
    buildHelp();
    addHelpButton();
    addConnectionNote();
    updateConnectionState();
    applyCapabilities();
    prepareFrames();
    watchDynamicContent();
    bindOverlayCoordination();

    window.addEventListener('resize', updateViewport, { passive: true });
    window.addEventListener('orientationchange', scheduleViewportRecovery, { passive: true });
    window.visualViewport?.addEventListener('resize', updateViewport, { passive: true });
    window.visualViewport?.addEventListener('scroll', updateViewport, { passive: true });
    window.addEventListener('focusin', scheduleViewportRecovery, { passive: true });
    window.addEventListener('focusout', scheduleViewportRecovery, { passive: true });
    window.addEventListener('online', updateConnectionState);
    window.addEventListener('offline', updateConnectionState);
    window.addEventListener('pageshow', () => {
      scheduleViewportRecovery();
      prepareFrames();
    });
    window.addEventListener('news:workspace-rendered', addHelpButton);
  }

  window.CMX_NEWS_RESILIENCE = { openHelp, closeHelp, updateViewport, updateConnectionState };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
