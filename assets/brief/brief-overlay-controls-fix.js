(() => {
  'use strict';

  if (window.BRIEF_OVERLAY_CONTROLS_FIX) return;

  const api = {
    portalTerminal,
    verifyOpenSurface
  };

  function terminal() {
    return document.getElementById('briefTerminal');
  }

  function portalTerminal() {
    const node = terminal();
    if (!node || !document.body) return false;

    if (node.parentElement !== document.body) {
      document.body.appendChild(node);
    }

    node.dataset.systemPortal = 'body';
    node.classList.add('brief-terminal-system-drawer');

    const details = node.querySelector('details');
    if (details && document.body.classList.contains('brief-terminal-open')) {
      details.open = true;
    }

    return true;
  }

  function verifyOpenSurface() {
    const node = terminal();
    if (!node || !document.body.classList.contains('brief-terminal-open')) return;

    portalTerminal();
    const style = getComputedStyle(node);
    const rect = node.getBoundingClientRect();
    const hidden = style.display === 'none' || style.visibility === 'hidden' || rect.width < 1 || rect.height < 1;

    if (hidden) {
      node.dataset.systemVisibilityRepair = 'true';
    } else {
      delete node.dataset.systemVisibilityRepair;
    }
  }

  function install() {
    portalTerminal();

    document.addEventListener('click', event => {
      if (!event.target.closest?.('[data-terminal-open], #briefSystemCommandButton')) return;
      portalTerminal();
      window.setTimeout(verifyOpenSurface, 0);
      window.setTimeout(verifyOpenSurface, 100);
    }, true);

    const observer = new MutationObserver(records => {
      if (!records.some(record => record.type === 'attributes' && record.attributeName === 'class')) return;
      if (document.body.classList.contains('brief-terminal-open')) {
        portalTerminal();
        window.requestAnimationFrame(verifyOpenSurface);
      }
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  }

  window.BRIEF_OVERLAY_CONTROLS_FIX = api;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', install, { once: true });
  } else {
    install();
  }
})();
