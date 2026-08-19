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
    script.src = '/assets/continuum-doc-knowledge-time.js?v=20260819-2';
    script.async = false;
    script.dataset.continuumKnowledgeTime = 'loader';
    document.body.append(script);
  }
})();
