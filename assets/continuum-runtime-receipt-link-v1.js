(() => {
  'use strict';

  const route = location.pathname.endsWith('/') ? location.pathname : `${location.pathname}/`;
  if (!['/email/', '/requests/'].includes(route)) return;

  let pending = null;
  let timer = null;

  function receiptHost() {
    if (route === '/email/') {
      const receipt = document.getElementById('receiptView');
      return receipt?.querySelector('.receipt-grid') || receipt;
    }
    return document.getElementById('emailReceipt');
  }

  function controlHref(automationId, runId) {
    const url = new URL('/control/', location.origin);
    url.searchParams.set('automation_id', automationId);
    url.searchParams.set('run_id', runId);
    return `${url.pathname}${url.search}`;
  }

  function mount(attempt = 0) {
    clearTimeout(timer);
    if (!pending) return;
    const host = receiptHost();
    if (!host || host.hidden) {
      if (attempt < 20) timer = setTimeout(() => mount(attempt + 1), 50);
      return;
    }

    host.querySelector('[data-runtime-control-link]')?.remove();

    const card = document.createElement('div');
    card.className = 'receipt-card';
    card.dataset.runtimeControlLink = 'true';

    const label = document.createElement('span');
    label.textContent = 'HISTORY';

    const link = document.createElement('a');
    link.href = controlHref(pending.automationId, pending.runId);
    link.textContent = 'Open this Run in Control';
    link.setAttribute('aria-label', 'Open this exact Runtime Run in Continuum Control');

    const note = document.createElement('small');
    note.textContent = 'Same Automation and Run IDs · read-only receipt history';

    card.append(label, link, note);
    host.appendChild(card);
    document.documentElement.dataset.continuumReceiptControlLink = 'ready';
  }

  window.addEventListener('cmx:runtime-receipt-read', (event) => {
    const automationId = String(event.detail?.automationId || '').trim();
    const runId = String(event.detail?.runId || '').trim();
    if (!automationId || !runId) return;
    pending = { automationId, runId };
    timer = setTimeout(() => mount(), 0);
  });
})();
