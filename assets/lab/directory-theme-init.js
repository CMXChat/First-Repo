(() => {
  'use strict';
  const KEY = 'continuum-directory-theme-v1';
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === 'dark' || saved === 'light') document.documentElement.dataset.theme = saved;
  } catch (_) {}

  function installThemeControl() {
    if (!document.querySelector('link[data-continuum-theme-toggle]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/assets/continuum-theme-toggle.css?v=20260820-1';
      link.dataset.continuumThemeToggle = 'true';
      document.head.appendChild(link);
    }
    if (!document.querySelector('script[data-continuum-theme-toggle]')) {
      const script = document.createElement('script');
      script.src = '/assets/continuum-theme-toggle.js?v=20260820-1';
      script.defer = true;
      script.dataset.continuumThemeToggle = 'true';
      document.head.appendChild(script);
    }
  }

  if (!document.querySelector('script[data-library-shell-convergence]')) {
    const script = document.createElement('script');
    script.src = '/assets/lab/continuum-library-shell-convergence-v1.js?v=20260819-1';
    script.async = false;
    script.dataset.libraryShellConvergence = 'true';
    document.head.appendChild(script);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', installThemeControl, { once: true });
  else installThemeControl();
})();
