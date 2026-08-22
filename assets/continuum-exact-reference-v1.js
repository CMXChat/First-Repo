(() => {
  'use strict';

  const route = location.pathname.endsWith('/') ? location.pathname : `${location.pathname}/`;
  const params = new URLSearchParams(location.search);
  const target = route === '/directory/'
    ? { param: 'person_id', selector: '[data-server-person]', attr: 'data-server-person', readyAttr: 'directoryPeopleSource' }
    : route === '/library/'
      ? { param: 'content_id', selector: '[data-library-content-id]', attr: 'data-library-content-id', readyAttr: null }
      : null;

  if (!target) return;
  const wanted = params.get(target.param)?.trim();
  if (!wanted) return;

  let focused = false;
  let observer = null;

  function candidate() {
    return [...document.querySelectorAll(target.selector)].find((node) => node.getAttribute(target.attr) === wanted) || null;
  }

  function markMissing() {
    if (focused) return;
    document.documentElement.dataset.continuumExactReference = 'missing';
    document.documentElement.dataset.continuumExactReferenceType = target.param;
  }

  function focusExactReference() {
    if (focused) return true;
    const node = candidate();
    if (!node) return false;
    focused = true;
    document.documentElement.dataset.continuumExactReference = 'focused';
    document.documentElement.dataset.continuumExactReferenceType = target.param;
    node.dataset.exactReference = 'true';
    node.click();
    requestAnimationFrame(() => {
      node.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      node.focus({ preventScroll: true });
    });
    observer?.disconnect();
    return true;
  }

  function checkReadyMissing() {
    if (focused) return;
    if (route === '/directory/' && document.documentElement.dataset.directoryPeopleSource === 'server') markMissing();
    if (route === '/library/' && document.getElementById('libraryServerProof')?.dataset.state === 'connected') markMissing();
  }

  function start() {
    if (focusExactReference()) return;
    observer = new MutationObserver(() => {
      if (!focusExactReference()) checkReadyMissing();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-state', 'data-directory-people-source'] });
    checkReadyMissing();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
