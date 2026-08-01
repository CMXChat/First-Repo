(() => {
  'use strict';

  const data = window.CMX_UPDATES;
  if (!data) return;

  const $ = selector => document.querySelector(selector);

  function escapeHtml(value = '') {
    const node = document.createElement('div');
    node.textContent = String(value);
    return node.innerHTML;
  }

  function safeLink(url = '') {
    return typeof url === 'string' && url.startsWith('/') ? url : '#';
  }

  function renderHero() {
    const node = $('#heroSummary');
    if (node) node.textContent = data.summary;
  }

  function renderPages() {
    const container = $('#pageCards');
    if (!container) return;
    container.innerHTML = data.pages.map(page => `
      <article class="panel page-card">
        <div class="page-card-top">
          <code>${escapeHtml(page.route)}</code>
          <span class="status-chip">${escapeHtml(page.status)}</span>
        </div>
        <h3>${escapeHtml(page.name)}</h3>
        <strong>${escapeHtml(page.role)}</strong>
        <p>${escapeHtml(page.description)}</p>
        <a href="${safeLink(page.route)}">Open ${escapeHtml(page.route)}</a>
      </article>
    `).join('');
  }

  function renderMission() {
    const container = $('#missionContent');
    if (!container) return;
    container.innerHTML = data.mission.map(item => `
      <article class="prose-card">
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.text)}</p>
      </article>
    `).join('');
  }

  function renderAICapabilities() {
    const container = $('#aiCapabilities');
    if (!container) return;
    container.innerHTML = data.aiCapabilities.map((item, index) => `
      <article class="panel capability-card">
        <span class="number-label">${String(index + 1).padStart(2, '0')}</span>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.text)}</p>
      </article>
    `).join('');
  }

  function renderApiFamilies() {
    const container = $('#apiFamilies');
    if (!container) return;
    container.innerHTML = data.apiFamilies.map(item => `
      <article class="api-family-card">
        <h3>${escapeHtml(item.name)}</h3>
        <p>${escapeHtml(item.examples)}</p>
        <a href="${safeLink(item.link)}">Open related blueprint</a>
      </article>
    `).join('');
  }

  function renderWorkflow() {
    const container = $('#aiWorkflow');
    if (!container) return;
    container.innerHTML = data.workflow.map(item => `
      <article class="panel workflow-step">
        <span>${escapeHtml(item.step)}</span>
        <div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.text)}</p></div>
      </article>
    `).join('');
  }

  function renderConnection() {
    const map = $('#connectionMap');
    if (map) {
      map.innerHTML = data.connection.flow.map((item, index) => `
        <article class="connection-step">
          <span>${String(index + 1).padStart(2, '0')}</span>
          <p>${escapeHtml(item)}</p>
        </article>
      `).join('');
    }

    const examples = $('#connectionExamples');
    if (examples) {
      examples.innerHTML = data.connection.examples.map(item => `
        <article class="example-card">
          <h3>${escapeHtml(item.title)}</h3>
          <pre>${escapeHtml(item.code)}</pre>
          <p>${escapeHtml(item.text)}</p>
        </article>
      `).join('');
    }
  }

  function renderSecurity() {
    const allowed = $('#allowedActions');
    const blocked = $('#blockedActions');
    if (allowed) {
      allowed.innerHTML = data.security.allowed.map(item => `<div class="check-item">${escapeHtml(item)}</div>`).join('');
    }
    if (blocked) {
      blocked.innerHTML = data.security.blocked.map(item => `<div class="check-item">${escapeHtml(item)}</div>`).join('');
    }
  }

  function renderPhases() {
    const container = $('#phaseList');
    if (!container) return;
    container.innerHTML = data.phases.map(item => `
      <article class="phase-row">
        <span class="phase-number">${escapeHtml(item.number)}</span>
        <div class="phase-copy"><h3>${escapeHtml(item.name)}</h3><p>${escapeHtml(item.text)}</p></div>
        <span class="phase-state">${escapeHtml(item.state)}</span>
      </article>
    `).join('');
  }

  function renderStatus() {
    const container = $('#statusCards');
    if (!container) return;
    container.innerHTML = data.status.map(group => `
      <article class="panel status-card">
        <div class="status-card-head"><h3>${escapeHtml(group.title)}</h3><span>${escapeHtml(group.state)}</span></div>
        <div class="status-list">${group.items.map(item => `<div>${escapeHtml(item)}</div>`).join('')}</div>
      </article>
    `).join('');
  }

  function formatDate(timestamp) {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(new Date(timestamp));
  }

  function renderChanges() {
    const container = $('#changeLog');
    if (!container) return;
    container.innerHTML = data.changes.map(item => `
      <article class="panel change-card">
        <div class="change-meta"><span>${escapeHtml(item.category)}</span><time>${escapeHtml(formatDate(item.timestamp))}</time></div>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.summary)}</p>
        <div class="change-links">${item.links.map(link => `<a href="${safeLink(link.url)}">${escapeHtml(link.label)}</a>`).join('')}</div>
      </article>
    `).join('');
  }

  function init() {
    renderHero();
    renderPages();
    renderMission();
    renderAICapabilities();
    renderApiFamilies();
    renderWorkflow();
    renderConnection();
    renderSecurity();
    renderPhases();
    renderStatus();
    renderChanges();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
