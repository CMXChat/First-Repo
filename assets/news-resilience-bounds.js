(() => {
  'use strict';

  let frame = 0;

  function viewportBox() {
    const viewport = window.visualViewport;
    return {
      width: viewport?.width || window.innerWidth || document.documentElement.clientWidth || 390,
      height: viewport?.height || window.innerHeight || document.documentElement.clientHeight || 720,
      top: viewport?.offsetTop || 0,
      left: viewport?.offsetLeft || 0
    };
  }

  function applyBounds() {
    const viewport = viewportBox();
    const compact = viewport.width <= 620;
    const margin = compact ? 16 : 24;
    const maxHeight = Math.max(220, viewport.height - margin);

    document.querySelectorAll('.news-drawer-panel, .news-help-panel').forEach(panel => {
      panel.style.setProperty('max-height', `${maxHeight}px`, 'important');
      panel.style.boxSizing = 'border-box';
      panel.style.overflowY = 'auto';
    });
  }

  function scheduleBounds(delay = 0) {
    window.clearTimeout(scheduleBounds.timer);
    scheduleBounds.timer = window.setTimeout(() => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(applyBounds);
    }, delay);
  }

  function init() {
    applyBounds();
    window.addEventListener('resize', () => scheduleBounds(), { passive: true });
    window.addEventListener('orientationchange', () => scheduleBounds(160), { passive: true });
    window.visualViewport?.addEventListener('resize', () => scheduleBounds(), { passive: true });
    window.visualViewport?.addEventListener('scroll', () => scheduleBounds(), { passive: true });
    window.addEventListener('focusin', () => scheduleBounds(), { passive: true });
    window.addEventListener('focusout', () => scheduleBounds(), { passive: true });
    window.addEventListener('pageshow', applyBounds);
    document.addEventListener('click', event => {
      if (!event.target.closest?.('#newsOpenSectionDrawer, #newsHelpButton')) return;
      applyBounds();
      scheduleBounds(0);
    }, true);
    if ('MutationObserver' in window) {
      const observer = new MutationObserver(mutations => {
        if (mutations.some(mutation => mutation.addedNodes.length)) applyBounds();
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }

  window.CMX_NEWS_RESILIENCE_BOUNDS = { applyBounds, scheduleBounds, viewportBox };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
