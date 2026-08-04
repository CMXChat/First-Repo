(() => {
  'use strict';

  if (window.BRIEF_PERSONAL_OS_STABILITY) return;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const TERMINAL_TRIGGER_SELECTOR = '#briefSystemCommandButton, #briefSystemTerminalDock, [data-terminal-open], [data-os-command]';
  let repairQueued = false;

  function isVisible(node) {
    if (!node || node.hidden) return false;
    const style = getComputedStyle(node);
    const rect = node.getBoundingClientRect();
    return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity || 0) > 0.05 && rect.width > 24 && rect.height > 24;
  }

  function createAboutLink(className = '') {
    const link = document.createElement('a');
    link.href = '/doc/';
    link.className = className;
    link.dataset.briefAbout = '';
    link.setAttribute('aria-label', 'Open the Personal OS product overview');
    link.innerHTML = '<span aria-hidden="true">ⓘ</span><small>About</small>';
    return link;
  }

  function replaceHeaderCommand() {
    const command = $('#briefSystemCommandButton');
    if (!command) return;
    const link = createAboutLink(command.className || '');
    link.id = 'briefSystemAboutButton';
    command.replaceWith(link);
  }

  function replaceOsCommandLinks() {
    $$('[data-os-command]').forEach(command => {
      const link = createAboutLink(command.className || '');
      if (command.closest('.brief-os-directory-grid')) {
        link.innerHTML = '<span aria-hidden="true">ⓘ</span><strong>About Personal OS</strong><small>Product overview and development status</small>';
      }
      command.replaceWith(link);
    });
  }

  function removeTerminalSurface() {
    document.body.classList.remove('brief-terminal-open');

    const dock = $('#briefSystemTerminalDock');
    if (dock) dock.remove();

    const terminal = $('#briefTerminal');
    if (terminal) {
      terminal.hidden = true;
      terminal.setAttribute('aria-hidden', 'true');
      terminal.inert = true;
    }

    $$('[data-terminal-open]').forEach(node => node.remove());
    replaceHeaderCommand();
    replaceOsCommandLinks();
  }

  function ensureMoreAboutLink() {
    const card = $('#briefSystemMoreLayer .brief-system-more-card');
    if (!card || $('[data-brief-about]', card)) return;
    const link = document.createElement('a');
    link.href = '/doc/';
    link.className = 'brief-system-more-about';
    link.dataset.briefAbout = '';
    link.innerHTML = '<span>About Personal OS</span><small>Read the product overview and current development status</small>';
    card.appendChild(link);
  }

  function enhanceLegacyCards() {
    $$('[data-system-link]').forEach(card => {
      if (!card.hasAttribute('tabindex')) card.tabIndex = 0;
      if (!card.hasAttribute('role')) card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `${card.querySelector('strong')?.textContent || 'Open section'}. ${card.querySelector('b')?.textContent || ''}`.trim());
    });
  }

  function closeInvalidLayer(layerSelector, surfaceSelector, expandedSelector) {
    const layer = $(layerSelector);
    if (!layer || layer.hidden) return false;
    const surface = $(surfaceSelector, layer);
    if (isVisible(surface)) return true;
    layer.hidden = true;
    if (expandedSelector) $(expandedSelector)?.setAttribute('aria-expanded', 'false');
    return false;
  }

  function clearStrandedBlur() {
    removeTerminalSurface();

    const switcherVisible = closeInvalidLayer('#briefSystemSwitcherLayer', '.brief-system-drawer', '#briefSystemSwitcher');
    const tourVisible = closeInvalidLayer('#briefSystemTour', '.brief-system-tour');
    closeInvalidLayer('#briefSystemMoreLayer', '.brief-system-more-card', '#briefSystemMoreButton');

    if (!switcherVisible && !tourVisible) {
      document.body.classList.remove('brief-system-overlay-open');
    }
  }

  function updateVisibleViewport() {
    const viewport = window.visualViewport;
    const height = Math.round(viewport?.height || window.innerHeight || document.documentElement.clientHeight);
    const width = Math.round(viewport?.width || window.innerWidth || document.documentElement.clientWidth);
    document.documentElement.style.setProperty('--brief-os-visible-height', `${Math.max(320, height)}px`);
    document.documentElement.style.setProperty('--brief-os-visible-width', `${Math.max(280, width)}px`);
  }

  function repair() {
    repairQueued = false;
    removeTerminalSurface();
    ensureMoreAboutLink();
    enhanceLegacyCards();
    clearStrandedBlur();
    updateVisibleViewport();
  }

  function queueRepair() {
    if (repairQueued) return;
    repairQueued = true;
    requestAnimationFrame(repair);
  }

  function installEvents() {
    document.addEventListener('click', event => {
      if (event.target.closest?.(TERMINAL_TRIGGER_SELECTOR)) {
        event.preventDefault();
        event.stopImmediatePropagation();
        clearStrandedBlur();
        return;
      }

      const card = event.target.closest?.('[data-system-link]');
      if (card && event.target === card) card.querySelector('b')?.focus?.();

      [0, 80, 180, 360].forEach(delay => window.setTimeout(clearStrandedBlur, delay));
    }, true);

    document.addEventListener('keydown', event => {
      const card = event.target.closest?.('[data-system-link][role="button"]');
      if (card && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        card.click();
      }
      if (event.key === 'Escape') window.setTimeout(clearStrandedBlur, 0);
    }, true);

    window.addEventListener('resize', updateVisibleViewport, { passive: true });
    window.visualViewport?.addEventListener('resize', updateVisibleViewport, { passive: true });
    window.visualViewport?.addEventListener('scroll', updateVisibleViewport, { passive: true });

    const observer = new MutationObserver(queueRepair);
    observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'hidden', 'aria-expanded'] });
  }

  window.BRIEF_PERSONAL_OS_STABILITY = {
    version: '20260804-1',
    repair,
    clearStrandedBlur,
    updateVisibleViewport
  };

  function initialize() {
    repair();
    installEvents();
    document.body.classList.add('brief-personal-os-stability-ready');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
  else initialize();
})();
