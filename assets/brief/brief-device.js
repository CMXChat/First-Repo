(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  let dynamicRefreshQueued = false;

  function updateViewportUnit() {
    const viewport = window.visualViewport;
    const height = viewport?.height || window.innerHeight || document.documentElement.clientHeight;
    document.documentElement.style.setProperty('--brief-device-height', `${Math.max(320, height)}px`);
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
      window.setTimeout(forceDocumentTop, 80);
    });

    window.addEventListener('pageshow', () => {
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
    window.addEventListener('orientationchange', () => window.setTimeout(updateViewportUnit, 120), { passive: true });
    window.visualViewport?.addEventListener('resize', updateViewportUnit, { passive: true });
    window.addEventListener('online', updateConnectionState);
    window.addEventListener('offline', updateConnectionState);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
