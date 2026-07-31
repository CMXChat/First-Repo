(() => {
  'use strict';
  const root = document.documentElement;
  if (root.dataset.cmxStandard === 'off' || document.querySelector('.cmx-standard-bar')) return;

  const title = root.dataset.cmxTitle || document.title.replace(/^CMX\s*[·•—-]?\s*/i, '').trim() || 'Private Resource';
  const category = root.dataset.cmxCategory || 'Internal';
  const status = root.dataset.cmxStatus || 'Active';
  const version = root.dataset.cmxVersion || '1.0';

  const bar = document.createElement('nav');
  bar.className = 'cmx-standard-bar';
  bar.setAttribute('aria-label', 'CMX private page controls');
  bar.innerHTML = [
    '<a href="/" title="Restricted node">CMX</a>',
    '<span class="cmx-standard-sep">/</span>',
    `<span class="cmx-standard-class">${escapeHtml(category)}</span>`,
    '<span class="cmx-standard-sep">/</span>',
    `<span class="cmx-standard-title" title="${escapeHtml(title)}">${escapeHtml(title)}</span>`,
    '<span class="cmx-standard-sep">·</span>',
    `<span class="cmx-standard-status">${escapeHtml(status)}</span>`,
    '<span class="cmx-standard-sep">·</span>',
    `<span>v${escapeHtml(version)}</span>`,
    '<span class="cmx-standard-sep">|</span>',
    '<a href="/directory/">Directory</a>',
    '<a href="/build/">Build</a>',
    '<span class="cmx-standard-private">Private · No indexing</span>'
  ].join('');
  document.body.appendChild(bar);

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, (char) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    })[char]);
  }
})();