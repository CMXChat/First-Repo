(() => {
  'use strict';

  if (window.BRIEF_OVERLAY_CONTROLS_FIX) return;

  const api = {
    portalTerminal,
    verifyOpenSurface,
    focusTerminalInput
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

  function focusTerminalInput() {
    if (!document.body.classList.contains('brief-terminal-open')) return false;

    const node = terminal();
    const input = document.getElementById('briefTerminalInput');
    if (!node || !input || input.disabled) return false;

    if (document.activeElement && node.contains(document.activeElement)) return true;

    try {
      input.focus({ preventScroll: true });
    } catch {
      input.focus();
    }

    return document.activeElement === input;
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

  function settleTerminalOpen() {
    if (!document.body.classList.contains('brief-terminal-open')) return;
    portalTerminal();
    verifyOpenSurface();
    focusTerminalInput();
  }

  function scheduleOpenSettlement() {
    [0, 80, 180, 320].forEach(delay => window.setTimeout(settleTerminalOpen, delay));
  }

  function install() {
    portalTerminal();

    document.addEventListener('click', event => {
      if (!event.target.closest?.('[data-terminal-open], #briefSystemCommandButton')) return;
      portalTerminal();
      scheduleOpenSettlement();
    }, true);

    const observer = new MutationObserver(records => {
      if (!records.some(record => record.type === 'attributes' && record.attributeName === 'class')) return;
      if (document.body.classList.contains('brief-terminal-open')) {
        scheduleOpenSettlement();
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
