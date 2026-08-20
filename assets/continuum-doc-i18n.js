'use strict';

(() => {
  const targets = [
    document.body,
    document.querySelector('.document-shell'),
    document.querySelector('.document-rail'),
    document.querySelector('.document-toc'),
    document.querySelector('.document-paper'),
    document.querySelector('.toolbar-links')
  ];

  targets.forEach((node) => {
    if (node && !node.hasAttribute('dir')) node.setAttribute('dir', 'auto');
  });

  document.documentElement.dataset.continuumI18n = 'rtl-ready';

  if (!document.querySelector('script[data-continuum-knowledge-time]')) {
    const script = document.createElement('script');
    script.src = '/assets/continuum-doc-knowledge-time.js?v=20260820-1';
    script.async = false;
    script.dataset.continuumKnowledgeTime = 'loader';
    document.body.append(script);
  }

  if (!document.querySelector('script[data-continuum-top-routes]')) {
    const script = document.createElement('script');
    script.src = '/assets/continuum-doc-top-routes.js?v=20260819-1';
    script.async = false;
    script.dataset.continuumTopRoutes = 'loader';
    document.body.append(script);
  }
})();
