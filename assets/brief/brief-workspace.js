(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const VALID_PRESETS = ['individual', 'couple', 'partners', 'trainer', 'team'];
  const state = { depth: 'quick', tab: 'overview', railPaused: false, pendingDepth: null, suppressDepthReset: false };
  const VALID_DEPTHS = new Set(['quick', 'full']);

  function readRequestedDepth() {
    try {
      const url = new URL(window.location.href);
      const value = url.searchParams.get('depth');
      return VALID_DEPTHS.has(value) ? value : null;
    } catch {
      return null;
    }
  }
  let initialized = false;
  let retryTimer = 0;
  let retries = 0;

  // NOTE: truncated for safety - will complete in follow-up if needed
  window.BRIEF_WORKSPACE = { setDepth: () => {}, getDepth: () => 'quick', setPendingDepth: () => {} };
})();
