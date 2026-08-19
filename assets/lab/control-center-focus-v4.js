(() => {
  'use strict';

  const shell = document.querySelector('.cc-shell');
  const mobileNav = document.querySelector('.cc-mobile-nav');
  const drawers = [...document.querySelectorAll('.cc-drawer')];
  const commandButton = document.getElementById('commandButton');
  const simulationButtons = [...document.querySelectorAll('#openSimulation, #openSimulationSecondary')];
  let returnFocus = null;
  let activeSurface = null;
  let restoreQueued = false;

  const focusableSelector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(',');

  function visibleFocusable(root) {
    if (!root) return [];
    return [...root.querySelectorAll(focusableSelector)].filter((node) => {
      if (node.hidden || node.getAttribute('aria-hidden') === 'true') return false;
      const style = window.getComputedStyle(node);
      return style.display !== 'none' && style.visibility !== 'hidden';
    });
  }

  function setBackgroundInert(value) {
    [shell, mobileNav].forEach((node) => {
      if (!node) return;
      if (value) {
        node.inert = true;
        node.setAttribute('aria-hidden', 'true');
      } else {
        node.inert = false;
        node.removeAttribute('aria-hidden');
      }
    });
  }

  function markReturnFocus(target) {
    if (!(target instanceof HTMLElement)) return;
    if (target.closest('.cc-drawer, .cc-command-overlay')) return;
    returnFocus = target;
  }

  function currentOpenSurface() {
    const command = document.querySelector('.cc-command-overlay[data-open="true"] .cc-command-palette');
    if (command) return command;
    return drawers.find((drawer) => drawer.dataset.open === 'true') || null;
  }

  function syncSurface() {
    const next = currentOpenSurface();
    if (next) {
      activeSurface = next;
      setBackgroundInert(true);
      return;
    }

    activeSurface = null;
    setBackgroundInert(false);
    queueRestoreFocus();
  }

  function queueRestoreFocus() {
    if (restoreQueued || !returnFocus) return;
    restoreQueued = true;
    window.requestAnimationFrame(() => {
      restoreQueued = false;
      if (currentOpenSurface()) return;
      const target = returnFocus;
      returnFocus = null;
      if (!target?.isConnected || typeof target.focus !== 'function') return;
      target.focus({ preventScroll: true });
      target.classList.add('cc-focus-return-pulse');
      window.setTimeout(() => target.classList.remove('cc-focus-return-pulse'), 450);
    });
  }

  function trapTab(event) {
    if (event.key !== 'Tab') return;
    const surface = currentOpenSurface();
    if (!surface) return;
    const focusable = visibleFocusable(surface);
    if (!focusable.length) {
      event.preventDefault();
      if (surface instanceof HTMLElement) surface.focus({ preventScroll: true });
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const current = document.activeElement;
    if (event.shiftKey && (current === first || !surface.contains(current))) {
      event.preventDefault();
      last.focus();
      return;
    }
    if (!event.shiftKey && current === last) {
      event.preventDefault();
      first.focus();
    }
  }

  drawers.forEach((drawer) => {
    drawer.setAttribute('role', 'dialog');
    drawer.setAttribute('aria-modal', 'true');
    drawer.tabIndex = -1;
    new MutationObserver(syncSurface).observe(drawer, { attributes: true, attributeFilter: ['data-open'] });
  });

  new MutationObserver(() => {
    const overlay = document.querySelector('.cc-command-overlay');
    if (!overlay || overlay.dataset.ccFocusObserved === 'true') return;
    overlay.dataset.ccFocusObserved = 'true';
    new MutationObserver(syncSurface).observe(overlay, { attributes: true, attributeFilter: ['data-open'] });
    syncSurface();
  }).observe(document.body, { childList: true });

  document.addEventListener('pointerdown', (event) => {
    const trigger = event.target.closest('[data-why], #openSimulation, #openSimulationSecondary, #commandButton, #autonomyInfo, .cc-work-row[role="button"]');
    if (trigger) markReturnFocus(trigger);
  }, true);

  document.addEventListener('keydown', (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      markReturnFocus(commandButton || document.activeElement);
    }
    if (['Enter', ' '].includes(event.key)) {
      const trigger = document.activeElement?.closest?.('[data-why], #openSimulation, #openSimulationSecondary, #commandButton, #autonomyInfo, .cc-work-row[role="button"]');
      if (trigger) markReturnFocus(trigger);
    }
    trapTab(event);
  }, true);

  simulationButtons.forEach((button) => button.setAttribute('aria-haspopup', 'dialog'));
  commandButton?.setAttribute('aria-haspopup', 'dialog');

  syncSurface();
  document.documentElement.dataset.controlCenterFocus = 'v4';
})();
