(() => {
  'use strict';

  const plans = Array.isArray(window.CMX_PLANS) ? window.CMX_PLANS : [];
  const container = document.querySelector('#plansList');
  if (!container) return;

  function escapeHtml(value = '') {
    const node = document.createElement('div');
    node.textContent = String(value);
    return node.innerHTML;
  }

  function safeLink(url = '') {
    return typeof url === 'string' && url.startsWith('/') ? url : '#';
  }

  function formatDate(timestamp) {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    }).format(new Date(timestamp));
  }

  function render() {
    const entries = [...plans].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    if (!entries.length) {
      container.innerHTML = '<p class="empty-note">No plan entries have been added yet.</p>';
      return;
    }

    container.innerHTML = entries.map(entry => `
      <article class="daily-note plan-entry" id="${escapeHtml(entry.id || '')}">
        <p class="note-meta">[${escapeHtml(String(entry.status || 'plan').toUpperCase())}] ${escapeHtml(formatDate(entry.timestamp))}</p>
        <h3>${escapeHtml(entry.title)}</h3>
        ${entry.summary ? `<p class="plan-summary">${escapeHtml(entry.summary)}</p>` : ''}
        <div class="plan-copy">${(entry.body || []).map(paragraph => `<p>${escapeHtml(paragraph)}</p>`).join('')}</div>
        ${(entry.tags || []).length ? `<p class="note-tags">${entry.tags.map(tag => `#${escapeHtml(tag)}`).join(' ')}</p>` : ''}
        ${(entry.links || []).length ? `<div class="note-links">${entry.links.map(link => `<a href="${safeLink(link.url)}">${escapeHtml(link.label)}</a>`).join('')}</div>` : ''}
      </article>
    `).join('');
  }

  document.addEventListener('DOMContentLoaded', render);
})();
