(() => {
  'use strict';

  const path = normalizePath(window.location.pathname);
  const bulkLimit = 6;
  const sensitiveStorage = {
    '/osint': ['cmx_last_email', 'cmx_last_user', 'cmx_last_domain', 'cmx_last_ip'],
    '/phone': ['cmx_phone_last']
  };

  injectCompatibilityStyles();
  clearSensitiveStorage();
  window.addEventListener('pagehide', clearSensitiveStorage);
  removeTrailingArtifacts();
  installBulkOpenCaps();

  if (path === '/osint') hardenOsint();
  if (path === '/phone') hardenPhone();
  if (path === '/metadata') hardenMetadata();
  if (path === '/search') hardenSearch();
  if (path === '/missing') hardenMissing();

  function normalizePath(value) {
    if (!value) return '/';
    const normalized = value.replace(/\/index\.html$/i, '/');
    return normalized === '/' ? '/' : normalized.replace(/\/+$/, '');
  }

  function injectCompatibilityStyles() {
    if (document.getElementById('cmx-hardening-styles')) return;
    const style = document.createElement('style');
    style.id = 'cmx-hardening-styles';
    style.textContent = [
      '.pill.danger{color:var(--bad,#ff5a5f)}',
      '.cmx-hardening-note{margin-top:8px;padding:9px 11px;border:1px solid var(--line,#2f3336);border-radius:10px;color:var(--muted,#8b98a5);font-size:12px}',
      '.cmx-hardening-note strong{color:var(--ink,#e7e9ea)}',
      'button[disabled]{opacity:.55;cursor:not-allowed}'
    ].join('');
    document.head.appendChild(style);
  }

  function clearSensitiveStorage() {
    (sensitiveStorage[path] || []).forEach((key) => localStorage.removeItem(key));
  }

  function removeTrailingArtifacts() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const removals = [];
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (/```||/.test(node.nodeValue || '')) removals.push(node);
    }
    removals.forEach((node) => {
      if (/^\s*(?:```||)+\s*$/.test(node.nodeValue || '')) node.remove();
    });
  }

  function installBulkOpenCaps() {
    const selectors = {
      openEmailLinks: '#emailLinks a[href]',
      openUserLinks: '#userLinks a[href]',
      openDomainLinks: '#domainLinks a[href]',
      openIpLinks: '#ipLinks a[href]',
      openAll: '#pivotLinks a[href]',
      openAllUrl: '#urlLinks a[href]'
    };

    document.addEventListener('click', (event) => {
      const button = event.target.closest('button[id]');
      if (!button || !selectors[button.id]) return;

      const links = [...document.querySelectorAll(selectors[button.id])]
        .map((anchor) => anchor.href)
        .filter((href) => /^https?:\/\//i.test(href));
      if (!links.length) return;

      event.preventDefault();
      event.stopImmediatePropagation();

      const selected = links.slice(0, bulkLimit);
      const omitted = links.length - selected.length;
      const detail = omitted > 0 ? ` The remaining ${omitted} link${omitted === 1 ? '' : 's'} will stay closed.` : '';
      if (!window.confirm(`Open ${selected.length} external research link${selected.length === 1 ? '' : 's'}?${detail}`)) return;
      selected.forEach((href) => window.open(href, '_blank', 'noopener,noreferrer'));
    }, true);
  }

  function hardenOsint() {
    const keyInput = document.getElementById('pcKey');
    if (keyInput) {
      keyInput.value = '';
      keyInput.disabled = true;
      keyInput.placeholder = 'Server-side integration required';
      const container = keyInput.closest('.small');
      if (container) {
        container.firstChild.textContent = 'Proxy provider credentials: ';
        const note = document.createElement('span');
        note.textContent = 'API keys must be stored in the future FastAPI backend, not the browser.';
        container.appendChild(note);
      }
    }

    const card = document.getElementById('ipCard');
    addNote(card, 'External disclosure', 'IP lookups send the entered address to third-party providers. A server-side provider gateway is planned.');
  }

  function hardenPhone() {
    const analyzeButton = document.getElementById('analyze');
    const numberInput = document.getElementById('num');
    const message = document.getElementById('msg');
    const timeOutput = document.getElementById('outTime');

    const requestedNumber = new URLSearchParams(window.location.search).get('n');
    if (requestedNumber && numberInput) numberInput.value = requestedNumber.slice(0, 80);

    if (analyzeButton) {
      analyzeButton.disabled = true;
      analyzeButton.setAttribute('aria-disabled', 'true');
      if (message) message.textContent = 'Loading the phone-number parser…';

      let attempts = 0;
      const readyTimer = window.setInterval(() => {
        attempts += 1;
        if (typeof window._parsePN === 'function') {
          window.clearInterval(readyTimer);
          analyzeButton.disabled = false;
          analyzeButton.removeAttribute('aria-disabled');
          if (message?.textContent === 'Loading the phone-number parser…') message.textContent = '';
        } else if (attempts >= 100) {
          window.clearInterval(readyTimer);
          if (message) message.textContent = 'Phone parser unavailable. Reload the page or check the dependency status.';
        }
      }, 100);
    }

    if (timeOutput) {
      const observer = new MutationObserver(() => {
        if (timeOutput.textContent && timeOutput.textContent !== '—' && timeOutput.textContent !== 'Not inferred from country code') {
          timeOutput.textContent = 'Not inferred from country code';
          timeOutput.title = 'A country code does not identify a reliable local timezone.';
        }
      });
      observer.observe(timeOutput, { childList: true, characterData: true, subtree: true });
    }

    addNote(document.querySelector('main .card'), 'Privacy', 'Parsing is local. Search, social, carrier, and reverse-lookup links disclose the number to the selected external provider.');
  }

  function hardenMetadata() {
    const typeFilter = document.getElementById('typeFilter');
    if (typeFilter) {
      const csvOption = [...typeFilter.options].find((option) => option.value.toLowerCase() === 'csv');
      const textOption = [...typeFilter.options].find((option) => option.value.toLowerCase() === 'text');
      if (csvOption) csvOption.remove();
      if (textOption) textOption.textContent = 'text / csv / config';
    }

    const maxBytes = 50 * 1024 * 1024;
    const fileInput = document.getElementById('fileInput');
    const drop = document.getElementById('drop');
    const sizeCopy = drop?.querySelector('small.muted');
    if (sizeCopy) sizeCopy.textContent = 'Max 50 MB per file in browser mode';

    const invalidFiles = (files) => [...files].filter((file) =>
      file.size > maxBytes || /[<>&"']/.test(file.name)
    );

    if (fileInput) {
      fileInput.addEventListener('change', (event) => {
        const invalid = invalidFiles(event.target.files || []);
        if (!invalid.length) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        event.target.value = '';
        showNotice(`Blocked ${invalid.length} file${invalid.length === 1 ? '' : 's'} because of browser size limits or an unsafe filename.`);
      }, true);
    }

    if (drop) {
      drop.addEventListener('drop', (event) => {
        const invalid = invalidFiles(event.dataTransfer?.files || []);
        if (!invalid.length) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        showNotice(`Blocked ${invalid.length} file${invalid.length === 1 ? '' : 's'} because of browser size limits or an unsafe filename.`);
      }, true);
    }

    addNote(document.querySelector('.hero'), 'Browser mode', 'The current parser is a best-effort local inspector. Deep PDF, Office, XMP, IPTC, and media extraction will move to isolated FastAPI workers.');
  }

  function hardenSearch() {
    const heroCopy = document.querySelector('.hero .sub');
    if (heroCopy) heroCopy.textContent = 'Build focused searches and save useful queries for this browser session. Search engines receive the full query you choose to open.';

    const mask = document.getElementById('maskPII');
    const badge = mask?.closest('label')?.querySelector('.badge');
    if (badge) badge.textContent = 'Mask PII in saved session entries';
    addNote(mask?.closest('.panel') || mask?.closest('section'), 'Disclosure', 'Masking changes the saved Session Locker display only. Generated queries, copied queries, and opened search engines still receive the original values.');

    const lockerHeading = document.querySelector('#locker h2');
    if (lockerHeading) lockerHeading.textContent = 'Session Locker';
    document.querySelectorAll('#help li').forEach((item) => {
      item.textContent = item.textContent.replace(/Evidence Locker|Locker/g, 'Session Locker');
    });
  }

  function hardenMissing() {
    const resources = document.querySelector('#resources .links');
    if (resources) {
      resources.replaceChildren();
      const box = document.createElement('div');
      box.className = 'link-group';
      const title = document.createElement('h4');
      title.textContent = 'Maintained library';
      const copy = document.createElement('p');
      copy.className = 'small';
      copy.textContent = 'Use the central resource library so external tools are maintained in one place.';
      const link = document.createElement('a');
      link.href = '/resources';
      link.textContent = 'Open OSINT Resource Library';
      box.append(title, copy, link);
      resources.appendChild(box);
    }

    const buildButton = document.getElementById('buildSite');
    if (buildButton) buildButton.onclick = buildSupportedSiteQueries;

    addNote(document.getElementById('official'), 'Urgent cases', 'Contact the relevant authority or recognized missing-person organization first. Keep public research minimized, sourced, and suitable for formal handoff.');
  }

  function buildSupportedSiteQueries() {
    const domainInput = document.getElementById('siteDom');
    const textInput = document.getElementById('siteText');
    const filesInput = document.getElementById('siteFiles');
    const operatorsInput = document.getElementById('siteOps');
    const output = document.getElementById('siteOut');
    const openButton = document.getElementById('openSite');

    if (!domainInput || !textInput || !output || !openButton) return;

    const domain = domainInput.value.trim().replace(/^https?:\/\//i, '').replace(/\/.*$/, '').toLowerCase();
    const text = textInput.value.trim();
    const operators = operatorsInput?.value.trim() || '';
    const files = (filesInput?.value || '')
      .split(',')
      .map((value) => value.trim().replace(/[^a-z0-9]/gi, '').toLowerCase())
      .filter(Boolean)
      .slice(0, 8);

    output.replaceChildren();
    openButton.disabled = true;
    openButton.dataset.urls = '[]';

    if (!isValidDomain(domain) || !text) {
      const error = document.createElement('div');
      error.className = 'small';
      error.textContent = 'Add a valid domain and the text you want to find.';
      output.appendChild(error);
      return;
    }

    const base = [`site:${domain}`, text, operators].filter(Boolean).join(' ');
    const queries = [['All indexed pages', base]];
    if (files.length) queries.push(['Selected file types', `${base} (${files.map((file) => `filetype:${file}`).join(' OR ')})`]);

    const urls = [];
    queries.forEach(([label, query]) => {
      const href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
      urls.push(href);

      const row = document.createElement('div');
      row.className = 'row';
      row.style.alignItems = 'center';

      const tag = document.createElement('span');
      tag.className = 'pill';
      tag.style.minWidth = '140px';
      tag.textContent = label;

      const link = document.createElement('a');
      link.className = 'linklist';
      link.style.padding = '0';
      link.href = href;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = 'Open';

      const queryText = document.createElement('span');
      queryText.className = 'small';
      queryText.style.flex = '1';
      queryText.textContent = query;

      const copy = document.createElement('button');
      copy.className = 'btn ghost';
      copy.type = 'button';
      copy.textContent = 'Copy';
      copy.onclick = () => navigator.clipboard.writeText(query).then(() => showNotice('Query copied'));

      row.append(tag, link, queryText, copy);
      output.appendChild(row);
    });

    openButton.dataset.urls = JSON.stringify(urls);
    openButton.disabled = false;
  }

  function isValidDomain(value) {
    return /^(?=.{1,253}$)(?!-)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i.test(value);
  }

  function addNote(container, title, message) {
    if (!container || container.querySelector(':scope > .cmx-hardening-note')) return;
    const note = document.createElement('div');
    note.className = 'cmx-hardening-note';
    const strong = document.createElement('strong');
    strong.textContent = `${title}: `;
    note.append(strong, document.createTextNode(message));
    container.appendChild(note);
  }

  function showNotice(message) {
    const existingToast = document.getElementById('toast');
    if (existingToast) {
      existingToast.textContent = message;
      existingToast.classList.add('show');
      window.setTimeout(() => existingToast.classList.remove('show'), 2200);
      return;
    }
    window.alert(message);
  }
})();
