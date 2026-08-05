(() => {
  'use strict';

  if (window.__cmxCaseLifecycleGuard) return;
  window.__cmxCaseLifecycleGuard = true;

  const nativeFetch = window.fetch.bind(window);
  let auditQueue = Promise.resolve();

  window.fetch = (input, init = {}) => {
    const url = requestUrlFor(input);
    const method = requestMethodFor(input, init);
    if (method === 'GET' && /^\/api\/cases\/[^/]+\/audit$/.test(url?.pathname || '')) {
      const run = () => nativeFetch(input, init);
      const queued = auditQueue.then(run, run);
      auditQueue = queued.then(() => undefined, () => undefined);
      return queued;
    }
    return nativeFetch(input, init);
  };

  document.addEventListener('click', (event) => {
    const button = event.target.closest?.('button');
    if (!button || button.textContent.trim() !== 'Open case workspace') return;
    const caseId = button.closest('.life-item')?.querySelector('.life-item-head p')?.textContent?.trim() || '';
    if (!caseId) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    window.location.assign(`/cases?case=${encodeURIComponent(caseId)}`);
  }, true);

  function requestUrlFor(input) {
    try {
      const value = typeof input === 'string' || input instanceof URL ? input : input.url;
      return new URL(value, window.location.href);
    } catch {
      return null;
    }
  }

  function requestMethodFor(input, init) {
    return String(init?.method || (input instanceof Request ? input.method : 'GET')).toUpperCase();
  }
})();
