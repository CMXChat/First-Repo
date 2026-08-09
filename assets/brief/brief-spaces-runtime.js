'use strict';

(() => {
  const legacyName = 'Personal OS';
  const productName = 'Spaces';

  function replaceString(value) {
    return typeof value === 'string' ? value.split(legacyName).join(productName) : value;
  }

  function updateObject(value, seen = new WeakSet()) {
    if (!value || typeof value !== 'object' || seen.has(value)) return value;
    seen.add(value);

    for (const key of Object.keys(value)) {
      const current = value[key];
      if (typeof current === 'string') value[key] = replaceString(current);
      else if (current && typeof current === 'object') updateObject(current, seen);
    }

    return value;
  }

  function updateAttributes(root) {
    root.querySelectorAll?.('[aria-label], [title]').forEach((element) => {
      for (const attribute of ['aria-label', 'title']) {
        const current = element.getAttribute(attribute);
        if (current?.includes(legacyName)) element.setAttribute(attribute, replaceString(current));
      }
    });
  }

  function updateText(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const node of nodes) {
      if (node.nodeValue?.includes(legacyName)) node.nodeValue = replaceString(node.nodeValue);
    }
  }

  function applyBrand(root = document.body) {
    if (!root) return;
    document.title = replaceString(document.title);
    updateText(root);
    updateAttributes(root);
  }

  function neutralizeEntryChoice() {
    if (document.body?.dataset.entered === 'true') return;
    const grid = document.getElementById('entryScenarioGrid');
    if (!grid) return;

    grid.querySelectorAll('[data-entry-scenario]').forEach((button) => {
      button.setAttribute('aria-pressed', 'false');
      button.classList.remove('is-selected', 'is-active');
    });

    const personalBadge = grid.querySelector('[data-entry-scenario="personal"] .entry-option-topline em');
    if (personalBadge && personalBadge.textContent !== 'One person') personalBadge.textContent = 'One person';

    const preview = document.getElementById('entrySpacePreview');
    if (preview) {
      preview.hidden = true;
      preview.dataset.entryPreview = '';
    }

    for (const id of ['openDemo', 'openDemoSticky']) {
      const button = document.getElementById(id);
      if (!button) continue;
      button.disabled = true;
      button.classList.remove('is-selection-ready');
    }

    const openLabel = document.getElementById('openDemoLabel');
    const stickyLabel = document.getElementById('openDemoStickyLabel');
    const mobileHint = document.getElementById('entryMobileChoiceHint');
    if (openLabel && openLabel.textContent !== 'Choose a Briefing') openLabel.textContent = 'Choose a Briefing';
    if (stickyLabel && stickyLabel.textContent !== 'Choose a Briefing') stickyLabel.textContent = 'Choose a Briefing';
    if (mobileHint && mobileHint.textContent !== 'Tap one to continue') mobileHint.textContent = 'Tap one to continue';
    document.body.dataset.entryChoiceMade = 'false';
  }

  function revealChosenEntryPreview(target) {
    if (!target?.closest?.('#entryScenarioGrid')) return;
    const preview = document.getElementById('entrySpacePreview');
    if (preview) preview.hidden = false;
  }

  function syncClarityPanelInert(root = document) {
    root.querySelectorAll?.('[data-clarity-workspace-panel]').forEach((panel) => {
      if (panel.getAttribute('aria-hidden') === 'true') panel.setAttribute('inert', '');
      else panel.removeAttribute('inert');
    });
  }

  updateObject(window.BRIEF_DEMO_DATA);

  document.addEventListener('DOMContentLoaded', () => {
    applyBrand();

    const target = document.getElementById('demoApp') || document.body;
    const observer = new MutationObserver((mutations) => {
      let needsUpdate = false;
      let needsClaritySync = false;
      for (const mutation of mutations) {
        if (mutation.type === 'characterData' && mutation.target.nodeValue?.includes(legacyName)) {
          needsUpdate = true;
        }
        if (mutation.type === 'attributes' && mutation.attributeName === 'aria-hidden') {
          needsClaritySync = true;
        }
        if ([...mutation.addedNodes].some((node) => node.textContent?.includes(legacyName))) {
          needsUpdate = true;
        }
        if ([...mutation.addedNodes].some((node) => node.querySelector?.('[data-clarity-workspace-panel]') || node.matches?.('[data-clarity-workspace-panel]'))) {
          needsClaritySync = true;
        }
      }
      if (needsUpdate) queueMicrotask(() => applyBrand(target));
      if (needsClaritySync) queueMicrotask(() => syncClarityPanelInert(target));
    });

    observer.observe(target, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['aria-hidden']
    });

    const entryGrid = document.getElementById('entryScenarioGrid');
    if (entryGrid) {
      const entryObserver = new MutationObserver(() => queueMicrotask(neutralizeEntryChoice));
      entryObserver.observe(entryGrid, { childList: true, subtree: true });
    }

    document.addEventListener('click', (event) => {
      const choice = event.target.closest?.('[data-entry-scenario]');
      if (choice) revealChosenEntryPreview(choice);
      if (event.target.closest?.('#resetDemo')) queueMicrotask(neutralizeEntryChoice);
    });

    syncClarityPanelInert(target);
    queueMicrotask(neutralizeEntryChoice);
  }, { once: true });
})();