(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  function updateViewportUnit() {
    const viewport = window.visualViewport;
    const height = viewport?.height || window.innerHeight || document.documentElement.clientHeight;
    document.documentElement.style.setProperty('--brief-device-height', `${Math.max(320, height)}px`);
  }

  function applyTouchSemantics() {
    const coarse = window.matchMedia?.('(pointer: coarse)').matches || navigator.maxTouchPoints > 0;
    document.documentElement.classList.toggle('is-touch-device', Boolean(coarse));
    $$('button, select, input, summary, a').forEach(node => {
      if (node.dataset.deviceReady === 'true') return;
      node.dataset.deviceReady = 'true';
      node.style.webkitTapHighlightColor = 'transparent';
    });
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

  function protectExternalFrames() {
    $$('iframe').forEach(frame => {
      frame.style.maxWidth = '100%';
      frame.setAttribute('loading', frame.getAttribute('loading') || 'lazy');
      frame.addEventListener('error', () => {
        frame.closest('article, aside, section')?.classList.add('embed-unavailable');
      }, { once: true });
    });
  }

  function watchDynamicContent() {
    if (!('MutationObserver' in window)) return;
    const observer = new MutationObserver(mutations => {
      let shouldRefresh = false;
      for (const mutation of mutations) {
        if (mutation.addedNodes.length) {
          shouldRefresh = true;
          break;
        }
      }
      if (!shouldRefresh) return;
      applyTouchSemantics();
      protectExternalFrames();
    });
    observer.observe(document.body, { childList: true, subtree: true });
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
    applyTouchSemantics();
    installCapabilityFallbacks();
    protectExternalFrames();
    addConnectionNote();
    updateConnectionState();
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
