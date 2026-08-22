(() => {
  'use strict';
  const KEY = 'continuum-library-theme-v1';
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

  function patchCanonicalRoutes() {
    const routes = new Map([
      ['/lab/control/', '/control/'],
      ['/lab/automations/', '/automations/'],
      ['/lab/directory/', '/directory/'],
      ['/lab/library/', '/library/'],
    ]);
    document.querySelectorAll('a[href]').forEach((link) => {
      const target = routes.get(link.getAttribute('href'));
      if (target) link.href = target;
    });
  }

  if (!document.querySelector('script[data-library-qa-v1]')) {
    const script = document.createElement('script');
    script.src = '/assets/lab/library-app-v1-qa.js?v=20260819-1';
    script.async = false;
    script.dataset.libraryQaV1 = 'true';
    document.head.appendChild(script);
  }

  function ready() {
    installThemeControl();
    patchCanonicalRoutes();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready, { once: true });
  else ready();
})();