(() => {
  'use strict';
  const KEY = 'continuum-library-theme-v1';
  const canonicalRoutes = new Map([
    ['/lab/control/', '/control/'],
    ['/lab/automations/', '/automations/'],
    ['/lab/directory/', '/directory/'],
    ['/lab/library/', '/library/'],
  ]);
  const commandRoutes = new Map([
    ['Control Center', '/control/'],
    ['Directory', '/directory/'],
    ['Automations', '/automations/'],
  ]);

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

  function installSourceTruth() {
    if (document.querySelector('script[data-continuum-source-truth]')) return;
    const script = document.createElement('script');
    script.src = '/assets/continuum-source-truth-v1.js?v=20260822-2';
    script.defer = true;
    script.dataset.continuumSourceTruth = 'loader';
    document.head.appendChild(script);
  }

  function installExactReferenceFocus() {
    if (document.querySelector('script[data-continuum-exact-reference]')) return;
    const script = document.createElement('script');
    script.src = '/assets/continuum-exact-reference-v1.js?v=20260822-1';
    script.async = false;
    script.dataset.continuumExactReference = 'loader';
    document.head.appendChild(script);
  }

  function patchCanonicalRoutes() {
    document.querySelectorAll('a[href]').forEach((link) => {
      const target = canonicalRoutes.get(link.getAttribute('href'));
      if (target) link.href = target;
    });
  }

  document.addEventListener('click', (event) => {
    const command = event.target.closest?.('.lib-command-result');
    const title = command?.querySelector('strong')?.textContent?.trim();
    const target = commandRoutes.get(title);
    if (!target) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    window.location.href = target;
  }, true);

  if (!document.querySelector('script[data-library-qa-v1]')) {
    const script = document.createElement('script');
    script.src = '/assets/lab/library-app-v1-qa.js?v=20260819-1';
    script.async = false;
    script.dataset.libraryQaV1 = 'true';
    document.head.appendChild(script);
  }

  installExactReferenceFocus();

  function ready() {
    installThemeControl();
    installSourceTruth();
    patchCanonicalRoutes();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready, { once: true });
  else ready();
})();