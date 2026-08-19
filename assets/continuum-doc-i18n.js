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
})();
