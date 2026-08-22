(() => {
  'use strict';

  const route = location.pathname.endsWith('/') ? location.pathname : `${location.pathname}/`;
  const params = new URLSearchParams(location.search);
  const target = route === '/directory/'
    ? { param: 'person_id', selector: '[data-server-person]', attr: 'data-server-person' }
    : route === '/library/'
      ? { param: 'content_id', selector: '[data-library-content-id]', attr: 'data-library-content-id' }
      : null;

  if (!target) return;
  const wanted = params.get(target.param)?.trim();
  if (!wanted) return;

  let focused = false;
  let clicking = false;
  let observer = null;
  let retryTimer = null;

  function candidate() {
    return [...document.querySelectorAll(target.selector)].find((node) => node.getAttribute(target.attr) === wanted) || null;
  }

  function readyForMissing() {
    if (route === '/directory/') return document.documentElement.dataset.directoryPeopleSource === 'server';
    return document.getElementById('libraryServerProof')?.dataset.state === 'connected';
  }

  function markMissing() {
    if (focused || candidate() || !readyForMissing()) return;
    document.documentElement.dataset.continuumExactReference = 'missing';
    document.documentElement.dataset.continuumExactReferenceType = target.param;
  }

  function finalize(node) {
    focused = true;
    document.documentElement.dataset.continuumExactReference = 'focused';
    document.documentElement.dataset.continuumExactReferenceType = target.param;
    node.dataset.exactReference = 'true';
    requestAnimationFrame(() => {
      node.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      node.focus({ preventScroll: true });
    });
    clearTimeout(retryTimer);
    observer?.disconnect();
  }

  function attemptFocus() {
    if (focused) return true;
    const node = candidate();
    if (!node) {
      markMissing();
      return false;
    }

    if (node.getAttribute('aria-current') === 'true') {
      finalize(node);
      return true;
    }

    if (!clicking) {
      clicking = true;
      node.click();
      clearTimeout(retryTimer);
      retryTimer = setTimeout(() => {
        clicking = false;
        attemptFocus();
      }, 80);
    }
    return false;
  }

  function start() {
    observer = new MutationObserver(() => attemptFocus());
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['aria-current', 'data-state', 'data-directory-people-source'],
    });
    attemptFocus();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
