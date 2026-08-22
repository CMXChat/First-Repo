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
      ['/lab/', '/directory/'],
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

  document.addEventListener('click', (event) => {
    const command = event.target.closest?.('.cc-command-item');
    if (command?.querySelector('strong')?.textContent?.trim() === 'Directory') {
      event.preventDefault();
      event.stopImmediatePropagation();
      window.location.href = '/directory/';
      return;
    }

    const detailAction = event.target.closest?.('#detailActionButton');
    if (detailAction && /directory/i.test(detailAction.textContent || '')) {
      event.preventDefault();
      event.stopImmediatePropagation();
      window.location.href = '/directory/';
    }
  }, true);

  if (!document.querySelector('script[data-library-shell-convergence]')) {
    const script = document.createElement('script');
    script.src = '/assets/lab/continuum-library-shell-convergence-v1.js?v=20260819-1';
    script.async = false;
    script.dataset.libraryShellConvergence = 'true';
    document.head.appendChild(script);
  }

  function ready() {
    installThemeControl();
    patchCanonicalRoutes();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready, { once: true });
  else ready();
})();
