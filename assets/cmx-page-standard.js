(() => {
  'use strict';

  const root = document.documentElement;
  const currentPath = normalizePath(window.location.pathname);
  const directoryVisible = new Set(['/', '/directory', '/osint', '/phone', '/metadata', '/search', '/missing', '/resources']);
  const removedRoutes = new Set(['/manual', '/menu', '/workspace', '/collab6', '/collab7', '/pythontest', '/test.html', '/report']);
  const sensitiveRoutes = new Set(['/build', '/callmax', '/project']);
  const blockedNavigationDestinations = new Set(['/', '/directory']);

  root.dataset.cmxVisibility ||= directoryVisible.has(currentPath) ? 'Directory-visible' : 'Direct-link-only';
  ensureMeta('name', 'referrer', 'no-referrer');
  ensureMeta('http-equiv', 'Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  ensureMeta('http-equiv', 'Pragma', 'no-cache');
  ensureMeta('http-equiv', 'Expires', '0');

  function unlinkAnchor(anchor) {
    const destination = anchor.getAttribute('href') || '';
    anchor.removeAttribute('href');
    anchor.removeAttribute('target');
    anchor.removeAttribute('rel');
    anchor.removeAttribute('aria-label');
    anchor.dataset.cmxUnlinked = destination;
  }

  function enforceNavigationPolicy(scope = document) {
    const anchors = [];
    if (scope.matches?.('a[href]')) anchors.push(scope);
    if (scope.querySelectorAll) anchors.push(...scope.querySelectorAll('a[href]'));

    anchors.forEach((anchor) => {
      const destination = sameOriginPath(anchor.getAttribute('href'));

      if (anchor.target === '_blank') {
        const rel = new Set((anchor.getAttribute('rel') || '').split(/\s+/).filter(Boolean));
        rel.add('noopener');
        rel.add('noreferrer');
        anchor.setAttribute('rel', Array.from(rel).join(' '));
      }

      if (!destination) return;
      if (blockedNavigationDestinations.has(destination)) {
        if (anchor.closest('.links, .gate-actions')) anchor.remove();
        else unlinkAnchor(anchor);
        return;
      }
      if (removedRoutes.has(destination) || sensitiveRoutes.has(destination)) anchor.remove();
    });
  }

  enforceNavigationPolicy();
  new MutationObserver((records) => {
    records.forEach((record) => {
      record.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) enforceNavigationPolicy(node);
      });
    });
  }).observe(document.documentElement, { childList: true, subtree: true });

  if (root.dataset.cmxStandard === 'off' || document.querySelector('.cmx-standard-bar')) return;

  const title = root.dataset.cmxTitle || document.title.replace(/^CMX\s*[·•—-]?\s*/i, '').trim() || 'Private Resource';
  const category = root.dataset.cmxCategory || 'Internal';
  const status = root.dataset.cmxStatus || 'Active';
  const version = root.dataset.cmxVersion || '1.0';

  const bar = document.createElement('nav');
  bar.className = 'cmx-standard-bar';
  bar.setAttribute('aria-label', 'CMX private page controls');
  bar.innerHTML = [
    '<span class="cmx-standard-home">CMX</span>',
    '<span class="cmx-standard-sep">/</span>',
    `<span class="cmx-standard-class">${escapeHtml(category)}</span>`,
    '<span class="cmx-standard-sep">/</span>',
    `<span class="cmx-standard-title" title="${escapeHtml(title)}">${escapeHtml(title)}</span>`,
    '<span class="cmx-standard-sep">·</span>',
    `<span class="cmx-standard-status">${escapeHtml(status)}</span>`,
    '<span class="cmx-standard-sep">·</span>',
    `<span>v${escapeHtml(version)}</span>`,
    '<span class="cmx-standard-private">Private · No indexing</span>'
  ].join('');
  document.body.appendChild(bar);

  function normalizePath(value) {
    if (!value) return '/';
    const path = value.replace(/\/index\.html$/i, '/');
    return path === '/' ? '/' : path.replace(/\/+$/, '');
  }

  function sameOriginPath(value) {
    if (!value || value.startsWith('#') || /^(?:mailto:|tel:|javascript:)/i.test(value)) return null;
    try {
      const url = new URL(value, window.location.href);
      if (url.origin !== window.location.origin) return null;
      return normalizePath(url.pathname);
    } catch {
      return null;
    }
  }

  function ensureMeta(attribute, key, content) {
    const selector = `meta[${attribute}="${CSS.escape(key)}" i]`;
    let meta = document.head.querySelector(selector);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute(attribute, key);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, (char) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    })[char]);
  }
})();