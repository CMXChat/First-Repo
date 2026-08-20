(() => {
  'use strict';

  const root = document.documentElement;
  const selectors = [
    '#themeToggle',
    '#themeButton',
    '[data-v3-theme]',
    '[data-theme-toggle]'
  ].join(',');

  function controls() {
    return [...document.querySelectorAll(selectors)].filter((node) => node instanceof HTMLButtonElement);
  }

  function sync() {
    const dark = root.dataset.theme === 'dark';
    controls().forEach((button) => {
      button.classList.add('continuum-theme-toggle');
      button.dataset.activeTheme = dark ? 'dark' : 'light';
      button.setAttribute('aria-pressed', String(dark));
      button.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
      button.setAttribute('title', dark ? 'Switch to light mode' : 'Switch to dark mode');
    });
  }

  function start() {
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    document.addEventListener('click', (event) => {
      if (event.target.closest?.(selectors)) requestAnimationFrame(sync);
    }, true);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
