(() => {
  'use strict';

  const KEY = 'continuum-control-center-theme-v1';
  const root = document.documentElement;

  try {
    const saved = localStorage.getItem(KEY);
    if (saved === 'dark' || saved === 'light') root.dataset.theme = saved;
  } catch (_) {
    // Storage is optional. The HTML light default remains truthful and usable.
  }

  // Early same-origin enhancement loading keeps the standalone HTML stable while
  // allowing focus/overlay hardening to remain isolated from product-state logic.
  if (!document.querySelector('link[data-cc-focus-v4]')) {
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = '/assets/lab/control-center-focus-v4.css?v=20260819-1';
    style.dataset.ccFocusV4 = 'true';
    document.head.appendChild(style);
  }

  if (!document.querySelector('script[data-cc-focus-v4]')) {
    const script = document.createElement('script');
    script.src = '/assets/lab/control-center-focus-v4.js?v=20260819-2';
    script.defer = true;
    script.dataset.ccFocusV4 = 'true';
    document.head.appendChild(script);
  }
})();