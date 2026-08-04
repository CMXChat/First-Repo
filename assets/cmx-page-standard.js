(() => {
  'use strict';

  const root = document.documentElement;
  const currentPath = normalizePath(window.location.pathname);
  const clientSessionKey = 'cmx_session_v4';
  const clientSessionMaxAgeMs = 12 * 60 * 60 * 1000;
  const guardedRoutes = new Set(['/directory', '/cases', '/osint', '/phone', '/metadata', '/search', '/missing', '/resources']);
  const caseContextRoutes = new Set(['/osint', '/phone', '/metadata', '/search', '/missing']);
  const directoryVisible = new Set(['/', ...guardedRoutes]);
  const removedRoutes = new Set(['/manual', '/menu', '/workspace', '/collab6', '/collab7', '/pythontest', '/test.html', '/report']);
  const sensitiveRoutes = new Set(['/build', '/callmax', '/project']);
  const blockedNavigationDestinations = new Set(['/', '/directory']);

  root.dataset.cmxVisibility ||= directoryVisible.has(currentPath) ? 'Directory-visible' : 'Direct-link-only';
  ensureMeta('name', 'referrer', 'no-referrer');
  ensureMeta('http-equiv', 'Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  ensureMeta('http-equiv', 'Pragma', 'no-cache');
  ensureMeta('http-equiv', 'Expires', '0');

  if (guardedRoutes.has(currentPath) && !hasActiveClientSession()) {
    const returnPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    window.location.replace(`/?return=${encodeURIComponent(returnPath)}`);
    return;
  }

  root.dataset.cmxAccess = guardedRoutes.has(currentPath) ? 'client-session' : 'public-entry';
  if (guardedRoutes.has(currentPath) && root.dataset.cmxModern !== 'true') loadToolHardening();
  applySearchPrefill();
  loadCasesStateSync();
  loadCaseContext();

  function hasActiveClientSession() {
    try {
      const raw = sessionStorage.getItem(clientSessionKey);
      if (!raw) return false;
      const session = JSON.parse(raw);
      const createdAt = Number(session?.at || 0);
      const age = Date.now() - createdAt;
      return session?.username === 'admin'
        && Number.isFinite(age)
        && age >= 0
        && age <= clientSessionMaxAgeMs;
    } catch {
      return false;
    }
  }

  function loadToolHardening() {
    if (document.querySelector('script[data-cmx-tool-hardening]')) return;
    const script = document.createElement('script');
    script.src = '/assets/cmx-tool-hardening.js?v=20260803-1';
    script.defer = true;
    script.dataset.cmxToolHardening = 'true';
    document.head.appendChild(script);
  }

  function loadCasesStateSync() {
    if (currentPath !== '/cases' || document.querySelector('script[data-cmx-cases-state-sync]')) return;
    const script = document.createElement('script');
    script.src = '/assets/cases-state-sync.js?v=20260804-2';
    script.defer = true;
    script.dataset.cmxCasesStateSync = 'true';
    document.head.appendChild(script);
  }

  function loadCaseContext() {
    if (!caseContextRoutes.has(currentPath)) return;

    loadStylesheet('/assets/cmx-case-context.css?v=20260804-3', 'cmxCaseContext');
    loadStylesheet('/assets/cmx-case-capture.css?v=20260804-1', 'cmxCaseCapture');

    loadOrderedScript('/assets/cmx-case-context.js?v=20260804-3', 'cmxCaseContext');
    loadOrderedScript('/assets/cmx-case-capture.js?v=20260804-1', 'cmxCaseCapture');
    loadOrderedScript('/assets/cmx-case-save-guard.js?v=20260804-1', 'cmxCaseSaveGuard');
  }

  function loadStylesheet(href, datasetKey) {
    const base = href.split('?')[0];
    if (document.querySelector(`link[href^="${base}"]`)) return;
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = href;
    style.dataset[datasetKey] = 'true';
    document.head.appendChild(style);
  }

  function loadOrderedScript(src, datasetKey) {
    const base = src.split('?')[0];
    if (document.querySelector(`script[src^="${base}"], script[data-${camelToKebab(datasetKey)}]`)) return;
    const script = document.createElement('script');
    script.src = src;
    script.async = false;
    script.dataset[datasetKey] = 'true';
    document.head.appendChild(script);
  }

  function camelToKebab(value) {
    return value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  }

  function applySearchPrefill() {
    if (currentPath !== '/search') return;
    const params = new URLSearchParams(window.location.search);
    const entity = (params.get('entity') || '').trim().slice(0, 420);
    const type = (params.get('type') || '').toLowerCase();
    if (!entity) return;

    const fieldMap = {
      email: 'email',
      phone: 'phone',
      username: 'usernames'
    };
    const fieldId = fieldMap[type] || 'fullName';
    const field = document.getElementById(fieldId);
    if (!field || field.value) return;
    field.value = entity;

    if (fieldId === 'fullName' && type && type !== 'auto') {
      const label = document.querySelector('label[for="fullName"]');
      if (label) label.textContent = 'Name or exact identifier';
      field.placeholder = 'Name, domain, IP, URL, or exact phrase';
    }
  }

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
      if (removedRoutes.has(destination) || sensitiveRoutes.has(destination)) {
        if (anchor.closest('.links, .gate-actions')) anchor.remove();
        else unlinkAnchor(anchor);
      }
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

  const home = document.createElement('button');
  home.type = 'button';
  home.className = 'cmx-standard-home';
  home.textContent = 'CMX';
  home.setAttribute('aria-label', 'Open Operations Directory');
  home.addEventListener('click', () => window.location.assign('/directory'));

  const titleElement = document.createElement('span');
  titleElement.className = 'cmx-standard-title';
  titleElement.title = title;
  titleElement.textContent = title;

  bar.append(
    home,
    standardSpan('/', 'cmx-standard-sep'),
    standardSpan(category, 'cmx-standard-class'),
    standardSpan('/', 'cmx-standard-sep'),
    titleElement,
    standardSpan('·', 'cmx-standard-sep'),
    standardSpan(status, 'cmx-standard-status'),
    standardSpan('·', 'cmx-standard-sep'),
    standardSpan(`v${version}`),
    standardSpan('Private · No indexing', 'cmx-standard-private')
  );
  document.body.appendChild(bar);

  function standardSpan(text, className = '') {
    const span = document.createElement('span');
    if (className) span.className = className;
    span.textContent = text;
    return span;
  }

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
})();
