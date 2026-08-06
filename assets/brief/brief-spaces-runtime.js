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

  updateObject(window.BRIEF_DEMO_DATA);

  document.addEventListener('DOMContentLoaded', () => {
    applyBrand();

    const target = document.getElementById('demoApp') || document.body;
    const observer = new MutationObserver((mutations) => {
      let needsUpdate = false;
      for (const mutation of mutations) {
        if (mutation.type === 'characterData' && mutation.target.nodeValue?.includes(legacyName)) {
          needsUpdate = true;
          break;
        }
        if ([...mutation.addedNodes].some((node) => node.textContent?.includes(legacyName))) {
          needsUpdate = true;
          break;
        }
      }
      if (needsUpdate) queueMicrotask(() => applyBrand(target));
    });

    observer.observe(target, { childList: true, subtree: true, characterData: true });
  }, { once: true });
})();
