(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  let dynamicRefreshQueued = false;
  let viewportFrame = 0;

  function updateViewportUnit() {
    window.cancelAnimationFrame(viewportFrame);
    viewportFrame = window.requestAnimationFrame(() => {
      const viewport = window.visualViewport;
      const height = viewport?.height || window.innerHeight || document.documentElement.clientHeight;
      const width = viewport?.width || window.innerWidth || document.documentElement.clientWidth;
      const offsetTop = viewport?.offsetTop || 0;
      const offsetLeft = viewport?.offsetLeft || 0;
      const layoutHeight = window.innerHeight || document.documentElement.clientHeight || height;
      const keyboardInset = Math.max(0, layoutHeight - height - offsetTop);
      const root = document.documentElement.style;
      root.setProperty('--brief-device-height', `${Math.max(320, height)}px`);
      root.setProperty('--brief-device-width', `${Math.max(280, width)}px`);
      root.setProperty('--brief-viewport-offset-top', `${Math.max(0, offsetTop)}px`);
      root.setProperty('--brief-viewport-offset-left', `${Math.max(0, offsetLeft)}px`);
      root.setProperty('--brief-keyboard-inset', `${keyboardInset}px`);
      document.documentElement.classList.toggle('brief-keyboard-visible', keyboardInset > 120);
    });
  }

  function scheduleViewportRecovery() {
    [0, 80, 220, 520].forEach(delay => window.setTimeout(updateViewportUnit, delay));
  }

  function forceDocumentTop() {
    const gate = $('#entryGate');
    if (gate) gate.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }

  function prepareInteractiveNodes(root = document) {
    const nodes = root.matches?.('button, select, input, summary, a')
      ? [root, ...$$('button, select, input, summary, a', root)]
      : $$('button, select, input, summary, a', root);

    nodes.forEach(node => {
      if (node.dataset.deviceReady === 'true') return;
      node.dataset.deviceReady = 'true';
      node.style.webkitTapHighlightColor = 'transparent';
    });
  }

  function applyTouchSemantics(root = document) {
    const coarse = window.matchMedia?.('(pointer: coarse)').matches || navigator.maxTouchPoints > 0;
    document.documentElement.classList.toggle('is-touch-device', Boolean(coarse));
    prepareInteractiveNodes(root);
  }

  function installCapabilityFallbacks() {
    if (!('speechSynthesis' in window)) {
      const readButton = $('#readButton');
      const readEntry = $('#readOnEntry');
      if (readButton) {
        readButton.disabled = true;
        readButton.setAttribute('aria-label', 'Voice reading is unavailable in this browser');
        readButton.title = 'Voice reading is unavailable in this browser';
      }
      if (readEntry) {
        readEntry.checked = false;
        readEntry.disabled = true;
        const copy = readEntry.closest('.option-row')?.querySelector('small');
        if (copy) copy.textContent = 'Voice reading is unavailable in this browser. The written briefing still works normally.';
      }
    }

    if (!('IntersectionObserver' in window)) {
      document.documentElement.classList.add('no-intersection-observer');
    }

    if (!window.visualViewport) {
      document.documentElement.classList.add('no-visual-viewport');
    }
  }

  function prepareFrames(root = document) {
    const frames = root.matches?.('iframe') ? [root, ...$$('iframe', root)] : $$('iframe', root);
    frames.forEach(frame => {
      if (frame.dataset.deviceFrameReady === 'true') return;
      frame.dataset.deviceFrameReady = 'true';
      frame.style.maxWidth = '100%';
      frame.setAttribute('loading', frame.getAttribute('loading') || 'lazy');
      frame.addEventListener('error', () => {
        frame.closest('article, aside, section')?.classList.add('embed-unavailable');
      }, { once: true });
    });
  }

  function queueDynamicRefresh(nodes) {
    if (dynamicRefreshQueued) return;
    dynamicRefreshQueued = true;
    window.requestAnimationFrame(() => {
      dynamicRefreshQueued = false;
      nodes.forEach(node => {
        if (!(node instanceof Element)) return;
        applyTouchSemantics(node);
        prepareFrames(node);
      });
    });
  }

  function watchDynamicContent() {
    if (!('MutationObserver' in window)) return;
    const root = $('#briefApp') || document.body;
    if (!root) return;

    const observer = new MutationObserver(mutations => {
      const added = [];
      mutations.forEach(mutation => mutation.addedNodes.forEach(node => added.push(node)));
      if (added.length) queueDynamicRefresh(added);
    });
    observer.observe(root, { childList: true, subtree: true });
  }

  function installEntryTopReset() {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

    const enter = $('#enterBrief');
    enter?.addEventListener('click', () => {
      if (enter.disabled) return;
      forceDocumentTop();
      window.setTimeout(forceDocumentTop, 0);
      window.setTimeout(forceDocumentTop, 80);
      window.setTimeout(forceDocumentTop, 320);
      window.setTimeout(() => $('#briefMain')?.focus({ preventScroll: true }), 340);
    }, true);

    window.addEventListener('brief:device-fallback-open', () => {
      forceDocumentTop();
      scheduleViewportRecovery();
      window.setTimeout(forceDocumentTop, 80);
    });

    window.addEventListener('pageshow', event => {
      scheduleViewportRecovery();
      if (event.persisted) prepareFrames();
      if (document.body.classList.contains('is-locked')) forceDocumentTop();
    });
  }

  function updateConnectionState() {
    document.documentElement.classList.toggle('is-offline', !navigator.onLine);
    const note = $('#deviceConnectionNote');
    if (note) note.hidden = navigator.onLine;
  }

  function addConnectionNote() {
    if ($('#deviceConnectionNote')) return;
    const gatePanel = $('.gate-panel');
    if (!gatePanel) return;
    const note = document.createElement('p');
    note.id = 'deviceConnectionNote';
    note.className = 'device-connection-note';
    note.hidden = navigator.onLine;
    note.textContent = 'You appear to be offline. The demonstration can open, but live sources and media players may not load.';
    gatePanel.appendChild(note);
  }

  function init() {
    updateViewportUnit();
    forceDocumentTop();
    applyTouchSemantics();
    installCapabilityFallbacks();
    prepareFrames();
    addConnectionNote();
    updateConnectionState();
    installEntryTopReset();
    watchDynamicContent();

    window.addEventListener('resize', updateViewportUnit, { passive: true });
    window.addEventListener('orientationchange', scheduleViewportRecovery, { passive: true });
    window.visualViewport?.addEventListener('resize', updateViewportUnit, { passive: true });
    window.visualViewport?.addEventListener('scroll', updateViewportUnit, { passive: true });
    window.addEventListener('focusin', scheduleViewportRecovery, { passive: true });
    window.addEventListener('focusout', scheduleViewportRecovery, { passive: true });
    window.addEventListener('online', updateConnectionState);
    window.addEventListener('offline', updateConnectionState);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
