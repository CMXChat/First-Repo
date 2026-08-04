(() => {
  'use strict';

  let frame = 0;

  function visibleHeight() {
    return window.visualViewport?.height || window.innerHeight || document.documentElement.clientHeight || 720;
  }

  function applyBounds() {
    window.cancelAnimationFrame(frame);
    frame = window.requestAnimationFrame(() => {
      const height = Math.max(320, visibleHeight());
      const margin = window.matchMedia?.('(max-width: 620px)').matches ? 16 : 24;
      const maxHeight = Math.max(220, height - margin);
      document.querySelectorAll('.news-drawer-panel, .news-help-panel').forEach(panel => {
        panel.style.maxHeight = `${maxHeight}px`;
        panel.style.boxSizing = 'border-box';
      });
    });
  }

  function init() {
    applyBounds();
    window.addEventListener('resize', applyBounds, { passive: true });
    window.addEventListener('orientationchange', () => window.setTimeout(applyBounds, 160), { passive: true });
    window.visualViewport?.addEventListener('resize', applyBounds, { passive: true });
    window.visualViewport?.addEventListener('scroll', applyBounds, { passive: true });
    window.addEventListener('focusin', applyBounds, { passive: true });
    window.addEventListener('focusout', applyBounds, { passive: true });
    window.addEventListener('pageshow', applyBounds);
    document.addEventListener('click', event => {
      if (event.target.closest?.('#newsOpenSectionDrawer, #newsHelpButton')) applyBounds();
    }, true);
    if ('MutationObserver' in window) {
      const observer = new MutationObserver(applyBounds);
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }

  window.CMX_NEWS_RESILIENCE_BOUNDS = { applyBounds };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
