(() => {
  'use strict';

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const state = {
    results: [],
    saved: [],
    nextIndex: 0
  };

  const PACKS = {
    social: ['facebook.com', 'instagram.com', 'linkedin.com', 'tiktok.com', 'x.com', 'reddit.com'],
    forums: ['reddit.com', 'stackexchange.com', 'quora.com', 'news.ycombinator.com'],
    news: ['reuters.com', 'apnews.com', 'bbc.com', 'nytimes.com', 'theguardian.com'],
    academic: ['academia.edu', 'researchgate.net', 'semanticscholar.org', 'jstor.org'],
    official: ['usa.gov', 'data.gov', 'sec.gov', 'justice.gov', 'state.gov'],
    code: ['github.com', 'gitlab.com', 'stackoverflow.com'],
    documents: ['docs.google.com', 'drive.google.com', 'dropbox.com', 'archive.org'],
    images: ['flickr.com', 'imgur.com', 'commons.wikimedia.org']
  };

  const ENGINES = {
    google: {
      label: 'Google',
      url: (query) => `https://www.google.com/search?q=${encodeURIComponent(query)}`
    },
    bing: {
      label: 'Bing',
      url: (query) => `https://www.bing.com/search?q=${encodeURIComponent(query)}`
    },
    duckduckgo: {
      label: 'DuckDuckGo',
      url: (query) => `https://duckduckgo.com/?q=${encodeURIComponent(query)}`
    },
    images: {
      label: 'Google Images',
      url: (query) => `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}`
    },
    github: {
      label: 'GitHub',
      url: (query) => `https://github.com/search?q=${encodeURIComponent(query)}&type=code`,
      native: true
    },
    reddit: {
      label: 'Reddit',
      url: (query) => `https://www.reddit.com/search/?q=${encodeURIComponent(query)}`,
      native: true
    }
  };

  document.addEventListener('DOMContentLoaded', init, { once: true });

  function init() {
    if (!$('#buildQueries')) return;

    $('#sessionId').textContent = crypto.randomUUID?.().slice(0, 8).toUpperCase()
      || Math.random().toString(36).slice(2, 10).toUpperCase();

    installToggleGroup('[data-pack]');
    installToggleGroup('[data-engine]');

    $('#buildQueries').addEventListener('click', build);
    $('#copyQueries').addEventListener('click', copyQueries);
    $('#openNext').addEventListener('click', openNextBatch);
    $('#clearResults').addEventListener('click', clearResults);
    $('#clearInputs').addEventListener('click', clearInputs);
    $('#copyLog').addEventListener('click', copyLog);
    $('#exportLog').addEventListener('click', exportLog);
    $('#clearLog').addEventListener('click', clearLog);

    renderResults();
    renderLog();
  }

  function installToggleGroup(selector) {
    $$(selector).forEach((button) => {
      button.addEventListener('click', () => {
        const pressed = button.getAttribute('aria-pressed') === 'true';
        button.setAttribute('aria-pressed', String(!pressed));
      });
    });
  }

  function selectedValues(selector, key) {
    return $$(selector)
      .filter((button) => button.getAttribute('aria-pressed') === 'true')
      .map((button) => button.dataset[key])
      .filter(Boolean);
  }

  function value(id) {
    return String($(`#${id}`)?.value || '').trim();
  }

  function commaValues(id, limit = 8) {
    return unique(value(id).split(',').map((entry) => entry.trim()).filter(Boolean)).slice(0, limit);
  }

  function unique(values) {
    return [...new Set(values)];
  }

  function exact(text) {
    const cleaned = String(text || '').replace(/["\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
    return cleaned ? `"${cleaned}"` : '';
  }

  function buildIdentityTokens() {
    const tokens = [];
    const fullName = value('fullName');
    if (fullName) tokens.push({ kind: 'name', label: 'Exact name', token: exact(fullName) });

    commaValues('aliases').forEach((alias) => {
      tokens.push({ kind: 'alias', label: 'Alias', token: exact(alias) });
    });

    commaValues('usernames').forEach((username) => {
      const normalized = username.replace(/^@/, '');
      if (normalized) tokens.push({ kind: 'username', label: 'Username', token: exact(normalized) });
    });

    const email = value('email');
    if (email) tokens.push({ kind: 'email', label: 'Email', token: exact(email), sensitive: true });

    const phone = value('phone');
    if (phone) tokens.push({ kind: 'phone', label: 'Phone', token: exact(phone), sensitive: true });

    return uniqueBy(tokens, (item) => `${item.kind}:${item.token}`);
  }

  function buildContext() {
    const parts = [
      ...commaValues('locations', 5).map(exact),
      ...commaValues('keywords', 7).map(exact)
    ];
    const age = value('age');
    if (age) parts.push(exact(age));
    return parts.filter(Boolean).join(' ');
  }

  function uniqueBy(values, keyFn) {
    const seen = new Set();
    return values.filter((value) => {
      const key = keyFn(value);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function build() {
    const identities = buildIdentityTokens();
    if (!identities.length) {
      notify('Add at least one name, alias, username, email, or phone number.');
      return;
    }

    const engineKeys = selectedValues('[data-engine]', 'engine');
    const selectedEngines = engineKeys.length ? engineKeys : ['google'];
    const selectedPacks = selectedValues('[data-pack]', 'pack');
    const domains = unique(selectedPacks.flatMap((pack) => PACKS[pack] || []));
    const context = buildContext();
    const max = Math.min(80, Math.max(5, Number.parseInt(value('maxQueries'), 10) || 40));
    const resultMap = new Map();

    const add = (engineKey, identity, query, purpose, domain = '') => {
      const engine = ENGINES[engineKey];
      if (!engine || !query || resultMap.size >= max) return;
      const key = `${engineKey}:${query}`;
      if (resultMap.has(key)) return;
      resultMap.set(key, {
        id: crypto.randomUUID?.() || `${Date.now()}-${resultMap.size}`,
        engine: engine.label,
        engineKey,
        identityType: identity.kind,
        purpose,
        domain,
        query,
        url: engine.url(query),
        sensitive: Boolean(identity.sensitive),
        createdAt: new Date().toISOString()
      });
    };

    selectedEngines.forEach((engineKey) => {
      const engine = ENGINES[engineKey];
      if (!engine) return;

      identities.forEach((identity) => {
        const base = [identity.token, context].filter(Boolean).join(' ');
        if (engine.native) {
          add(engineKey, identity, base, `${identity.label} search inside ${engine.label}`);
          return;
        }

        add(engineKey, identity, base, `${identity.label} across the open web`);
        domains.forEach((domain) => {
          add(engineKey, identity, [`site:${domain}`, base].filter(Boolean).join(' '), `${identity.label} on ${domain}`, domain);
        });
      });
    });

    state.results = [...resultMap.values()].slice(0, max);
    state.nextIndex = 0;
    renderResults();
    notify(`${state.results.length} focused queries built.`);
  }

  function renderResults() {
    const output = $('#queryResults');
    const count = $('#queryCount');
    output.replaceChildren();
    count.textContent = `${state.results.length} quer${state.results.length === 1 ? 'y' : 'ies'}`;

    if (!state.results.length) {
      output.appendChild(emptyState('No queries built yet. Add identifiers, choose engines or site packs, then build.'));
      setResultsActions(false);
      return;
    }

    state.results.forEach((result, index) => {
      const row = document.createElement('article');
      row.className = 'cmx-result';

      const number = document.createElement('span');
      number.className = 'cmx-result-index';
      number.textContent = String(index + 1).padStart(2, '0');

      const content = document.createElement('div');
      const query = document.createElement('div');
      query.className = 'cmx-result-query';
      query.textContent = result.query;

      const meta = document.createElement('div');
      meta.className = 'cmx-result-meta';
      meta.append(
        chip(result.engine),
        chip(result.purpose),
        result.sensitive ? chip('Contains supplied PII', 'warn') : chip('No email or phone token')
      );
      content.append(query, meta);

      const actions = document.createElement('div');
      actions.className = 'cmx-result-actions';
      actions.append(
        actionButton('Open', 'open', () => openExternal(result.url)),
        actionButton('Copy', '', () => copyText(result.query, 'Query copied.')),
        actionButton('Save', '', () => saveResult(result))
      );

      row.append(number, content, actions);
      output.appendChild(row);
    });

    setResultsActions(true);
  }

  function setResultsActions(enabled) {
    ['copyQueries', 'openNext', 'clearResults'].forEach((id) => {
      const button = $(`#${id}`);
      if (button) button.disabled = !enabled;
    });
  }

  function chip(text, tone = '') {
    const element = document.createElement('span');
    element.className = 'cmx-chip';
    if (tone === 'warn') element.style.borderColor = '#66552c';
    element.textContent = text;
    return element;
  }

  function actionButton(label, className, handler) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `cmx-mini-button ${className}`.trim();
    button.textContent = label;
    button.addEventListener('click', handler);
    return button;
  }

  function emptyState(message) {
    const empty = document.createElement('div');
    empty.className = 'cmx-empty';
    empty.textContent = message;
    return empty;
  }

  function openExternal(url) {
    if (!/^https:\/\//i.test(url)) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  function copyQueries() {
    if (!state.results.length) return;
    copyText(state.results.map((result) => `[${result.engine}] ${result.query}`).join('\n'), 'All queries copied.');
  }

  function openNextBatch() {
    if (!state.results.length) return;
    const requested = Math.min(6, Math.max(1, Number.parseInt(value('batchSize'), 10) || 4));
    const batch = state.results.slice(state.nextIndex, state.nextIndex + requested);
    if (!batch.length) {
      notify('No unopened queries remain.');
      return;
    }
    const sensitiveCount = batch.filter((result) => result.sensitive).length;
    const warning = sensitiveCount
      ? ` ${sensitiveCount} selected quer${sensitiveCount === 1 ? 'y contains' : 'ies contain'} an email or phone value.`
      : '';
    if (!window.confirm(`Open ${batch.length} external search${batch.length === 1 ? '' : 'es'}?${warning}`)) return;
    batch.forEach((result) => openExternal(result.url));
    state.nextIndex += batch.length;
    notify(`Opened ${batch.length}. ${state.results.length - state.nextIndex} remain.`);
  }

  function clearResults() {
    state.results = [];
    state.nextIndex = 0;
    renderResults();
    notify('Generated queries cleared.');
  }

  function clearInputs() {
    ['fullName', 'aliases', 'usernames', 'locations', 'keywords', 'age', 'email', 'phone'].forEach((id) => {
      const input = $(`#${id}`);
      if (input) input.value = '';
    });
    $$('[data-pack]').forEach((button) => button.setAttribute('aria-pressed', 'false'));
    notify('Input fields cleared.');
  }

  function saveResult(result) {
    if (state.saved.some((item) => item.id === result.id)) {
      notify('That query is already in the session log.');
      return;
    }
    state.saved.push({ ...result, savedAt: new Date().toISOString() });
    renderLog();
    notify('Saved to the session research log.');
  }

  function renderLog() {
    const body = $('#logBody');
    const count = $('#logCount');
    body.replaceChildren();
    count.textContent = `${state.saved.length} saved`;

    if (!state.saved.length) {
      const row = document.createElement('tr');
      const cell = document.createElement('td');
      cell.colSpan = 6;
      cell.className = 'cmx-muted';
      cell.textContent = 'No saved queries in this browser session.';
      row.appendChild(cell);
      body.appendChild(row);
      setLogActions(false);
      return;
    }

    const mask = Boolean($('#maskSaved')?.checked);
    state.saved.forEach((item) => {
      const row = document.createElement('tr');
      row.append(
        tableCell(new Date(item.savedAt).toLocaleString()),
        tableCell(item.engine),
        tableCell(item.purpose),
        tableCell(mask ? maskPII(item.query) : item.query, 'cmx-code'),
        tableCell(item.sensitive ? 'Supplied PII' : 'Standard'),
        actionCell(item)
      );
      body.appendChild(row);
    });
    setLogActions(true);
  }

  function tableCell(text, className = '') {
    const cell = document.createElement('td');
    if (className) cell.className = className;
    cell.textContent = String(text);
    return cell;
  }

  function actionCell(item) {
    const cell = document.createElement('td');
    const copy = actionButton('Copy', '', () => {
      if (item.sensitive && !window.confirm('Copy the full query, including supplied email or phone values?')) return;
      copyText(item.query, 'Saved query copied.');
    });
    const remove = actionButton('Remove', '', () => {
      state.saved = state.saved.filter((saved) => saved.id !== item.id);
      renderLog();
    });
    cell.append(copy, document.createTextNode(' '), remove);
    return cell;
  }

  function setLogActions(enabled) {
    ['copyLog', 'exportLog', 'clearLog'].forEach((id) => {
      const button = $(`#${id}`);
      if (button) button.disabled = !enabled;
    });
  }

  function copyLog() {
    if (!state.saved.length) return;
    const includeSensitive = !state.saved.some((item) => item.sensitive)
      || window.confirm('Copy the full session log, including supplied email or phone values?');
    if (!includeSensitive) return;
    const header = ['Saved at', 'Engine', 'Purpose', 'Query', 'URL'];
    const lines = state.saved.map((item) => [item.savedAt, item.engine, item.purpose, item.query, item.url]
      .map(tsvValue).join('\t'));
    copyText([header.join('\t'), ...lines].join('\n'), 'Session log copied.');
  }

  function tsvValue(value) {
    return String(value).replace(/[\t\r\n]+/g, ' ');
  }

  function exportLog() {
    if (!state.saved.length) return;
    const includeSensitive = !state.saved.some((item) => item.sensitive)
      || window.confirm('Export the full session log, including supplied email or phone values?');
    if (!includeSensitive) return;

    const payload = {
      schema: 'cmx-search-session-v1',
      exportedAt: new Date().toISOString(),
      persistence: 'session-memory-only',
      entries: state.saved
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `cmx-search-session-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    notify('Session log exported.');
  }

  function clearLog() {
    if (!state.saved.length) return;
    if (!window.confirm('Clear the session research log?')) return;
    state.saved = [];
    renderLog();
    notify('Session research log cleared.');
  }

  function maskPII(text) {
    return String(text)
      .replace(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/g, maskEmail)
      .replace(/\+?\d[\d\s().-]{6,}\d/g, maskPhone);
  }

  function maskEmail(email) {
    const [local, domain] = email.split('@');
    if (!domain) return email;
    const visible = local.slice(0, Math.min(2, local.length));
    return `${visible}${'*'.repeat(Math.max(3, local.length - visible.length))}@${domain}`;
  }

  function maskPhone(phone) {
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 5) return phone;
    const suffix = digits.slice(-4);
    return `${phone.trim().startsWith('+') ? '+' : ''}${'*'.repeat(Math.max(4, digits.length - 4))}${suffix}`;
  }

  function copyText(text, message) {
    navigator.clipboard.writeText(text)
      .then(() => notify(message))
      .catch(() => notify('Clipboard access was blocked by the browser.'));
  }

  let toastTimer;
  function notify(message) {
    const toast = $('#toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2400);
  }

  document.addEventListener('change', (event) => {
    if (event.target?.id === 'maskSaved') renderLog();
  });
})();
