(() => {
  'use strict';

  const $ = (selector) => document.querySelector(selector);
  const state = {
    current: null,
    dns: [],
    observations: [],
    extracted: [],
    dnsRun: null,
    dnsSources: new Set()
  };

  const DNS_TYPES = ['A', 'AAAA', 'CNAME', 'MX', 'NS', 'TXT', 'CAA', 'SOA'];
  const DNS_STATUS = {
    0: 'NOERROR',
    1: 'FORMERR',
    2: 'SERVFAIL',
    3: 'NXDOMAIN',
    4: 'NOTIMP',
    5: 'REFUSED'
  };
  const STATIC_FALLBACK_STATUSES = new Set([404, 405, 501]);

  const els = {
    session: $('#sessionId'),
    type: $('#entityType'),
    value: $('#entityValue'),
    notes: $('#entityNotes'),
    analyze: $('#analyzeEntity'),
    clear: $('#clearEntity'),
    summaryEmpty: $('#summaryEmpty'),
    summary: $('#entitySummary'),
    summaryType: $('#summaryType'),
    summaryValue: $('#summaryValue'),
    summaryScope: $('#summaryScope'),
    summaryConfidence: $('#summaryConfidence'),
    entityNotice: $('#entityNotice'),
    dnsSection: $('#dnsSection'),
    dnsDomain: $('#dnsDomain'),
    dnsStatus: $('#dnsStatus'),
    dnsBody: $('#dnsBody'),
    dnsRefresh: $('#dnsRefresh'),
    dnsSave: $('#dnsSave'),
    dnsRaw: $('#dnsRaw'),
    mailPosture: $('#mailPosture'),
    ipSection: $('#ipSection'),
    ipClassification: $('#ipClassification'),
    ipExplanation: $('#ipExplanation'),
    pivotEmpty: $('#pivotEmpty'),
    pivotList: $('#pivotList'),
    textInput: $('#textInput'),
    extract: $('#extractEntities'),
    extracted: $('#extractedEntities'),
    observationEmpty: $('#observationEmpty'),
    observationBody: $('#observationBody'),
    exportCase: $('#exportCase'),
    copyCase: $('#copyCase'),
    clearLog: $('#clearLog'),
    caseJson: $('#caseJson'),
    searchTool: $('#searchTool'),
    phoneTool: $('#phoneTool'),
    metadataTool: $('#metadataTool'),
    missingTool: $('#missingTool'),
    resourcesTool: $('#resourcesTool'),
    toast: $('#toast')
  };

  initialize();

  function initialize() {
    els.session.textContent = randomId();
    els.analyze.addEventListener('click', analyzeFromForm);
    els.clear.addEventListener('click', clearEntity);
    els.value.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') analyzeFromForm();
    });
    els.dnsRefresh.addEventListener('click', () => {
      const domain = domainForCurrent();
      if (domain) runDns(domain);
    });
    els.dnsSave.addEventListener('click', saveDnsSummary);
    els.extract.addEventListener('click', extractFromText);
    els.exportCase.addEventListener('click', exportCase);
    els.copyCase.addEventListener('click', copyCase);
    els.clearLog.addEventListener('click', clearObservationLog);

    const params = new URLSearchParams(window.location.search);
    const requestedEntity = (params.get('entity') || '').slice(0, 500);
    const requestedType = params.get('type') || 'auto';
    if (requestedEntity) {
      if ([...els.type.options].some((option) => option.value === requestedType)) {
        els.type.value = requestedType;
      }
      els.value.value = requestedEntity;
      analyzeFromForm();
    }

    updateCaseJson();
    updateToolLinks();
  }

  function randomId() {
    return crypto.getRandomValues(new Uint32Array(2))
      .reduce((value, number) => value + number.toString(36), '')
      .slice(0, 10)
      .toUpperCase();
  }

  function analyzeFromForm() {
    const raw = els.value.value.trim();
    if (!raw) return showToast('Enter an entity to analyze.');

    const result = normalizeEntity(raw, els.type.value);
    if (!result.ok) return showToast(result.error);

    cancelDnsRun();
    state.current = {
      type: result.type,
      value: result.value,
      input: raw,
      scope: result.scope,
      confidence: result.confidence,
      notes: els.notes.value.trim().slice(0, 2000),
      analyzedAt: new Date().toISOString()
    };
    state.dns = [];
    state.dnsSources = new Set();

    renderSummary();
    renderPivots(buildPivots(state.current));
    renderIpClassification();
    updateToolLinks();
    addObservation(
      'analysis',
      state.current.value,
      'CMX local analyzer',
      `${state.current.type} normalized with ${state.current.confidence.toLowerCase()} confidence.`
    );

    const domain = domainForCurrent();
    if (domain) runDns(domain);
    else hideDns();

    showToast(`${titleCase(state.current.type)} entity prepared.`);
  }

  function normalizeEntity(raw, requestedType) {
    const type = requestedType === 'auto' ? detectType(raw) : requestedType;

    if (type === 'email') {
      const value = raw.trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u.test(value)) {
        return invalid('Enter a valid email address.');
      }
      return valid(type, value, 'Email syntax and domain are normalized locally.', 'High');
    }

    if (type === 'domain') {
      const value = normalizeDomain(raw);
      if (!value) return invalid('Enter a valid domain name.');
      return valid(type, value, 'Public DNS name. Ownership and control are not inferred.', 'High');
    }

    if (type === 'url') {
      const value = normalizeUrl(raw);
      if (!value) return invalid('Enter a complete HTTP or HTTPS URL.');
      return valid(type, value, 'URL structure is normalized. Page content is not fetched automatically.', 'High');
    }

    if (type === 'ip') {
      const value = raw.trim().toLowerCase();
      if (!isIPv4(value) && !isIPv6(value)) {
        return invalid('Enter a valid IPv4 or IPv6 address.');
      }
      return valid(type, value, 'Address class is evaluated locally. Reputation and ownership require external sources.', 'High');
    }

    if (type === 'phone') {
      const value = normalizePhone(raw);
      if (!value) return invalid('Enter a phone number with at least seven digits.');
      return valid(type, value, 'Only basic formatting is normalized here. Numbering-plan analysis belongs in the Phone tool.', 'Medium');
    }

    if (type === 'username') {
      const value = raw.trim().replace(/^@/, '');
      if (!/^[\p{L}\p{N}._-]{2,80}$/u.test(value)) {
        return invalid('Use a username containing letters, numbers, dots, underscores, or hyphens.');
      }
      return valid(type, value, 'A handle can belong to different people across services.', 'Medium');
    }

    return valid(
      'text',
      raw.trim().slice(0, 5000),
      'Unstructured text. Extracted identifiers remain hypotheses until verified.',
      'Low'
    );
  }

  function valid(type, value, scope, confidence) {
    return { ok: true, type, value, scope, confidence };
  }

  function invalid(error) {
    return { ok: false, error };
  }

  function detectType(raw) {
    const value = raw.trim();
    if (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u.test(value)) return 'email';
    if (isIPv4(value) || isIPv6(value)) return 'ip';
    if (/^https?:\/\//i.test(value)) return 'url';
    if (normalizePhone(value) && /[+()\s-]/.test(value)) return 'phone';
    if (normalizeDomain(value)) return 'domain';
    if (/^[\p{L}\p{N}._-]{2,80}$/u.test(value.replace(/^@/, ''))) return 'username';
    return 'text';
  }

  function normalizeDomain(value) {
    const candidate = value
      .trim()
      .replace(/^https?:\/\//i, '')
      .split(/[/?#]/)[0]
      .replace(/\.$/, '')
      .toLowerCase();
    if (!candidate || candidate.length > 253 || candidate.includes(':')) return '';

    try {
      const hostname = new URL(`https://${candidate}`).hostname.toLowerCase();
      if (!/^(?=.{1,253}$)(?!-)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i.test(hostname)) {
        return '';
      }
      return hostname;
    } catch {
      return '';
    }
  }

  function normalizeUrl(value) {
    try {
      const url = new URL(value.trim());
      if (!['http:', 'https:'].includes(url.protocol)) return '';
      url.hash = '';
      return url.toString();
    } catch {
      return '';
    }
  }

  function normalizePhone(value) {
    const raw = value.trim();
    const digits = raw.replace(/\D/g, '');
    if (digits.length < 7 || digits.length > 15) return '';
    return `${raw.startsWith('+') ? '+' : ''}${digits}`;
  }

  function isIPv4(value) {
    const parts = value.split('.');
    return parts.length === 4 && parts.every((part) =>
      /^\d{1,3}$/.test(part)
      && Number(part) >= 0
      && Number(part) <= 255
      && String(Number(part)) === part
    );
  }

  function isIPv6(value) {
    if (!value.includes(':') || /[^0-9a-f:]/i.test(value)) return false;
    try {
      const hostname = new URL(`http://[${value}]/`).hostname;
      return hostname.startsWith('[') && hostname.endsWith(']');
    } catch {
      return false;
    }
  }

  function renderSummary() {
    if (!state.current) {
      els.summaryEmpty.classList.remove('osint-hidden');
      els.summary.classList.add('osint-hidden');
      return;
    }

    els.summaryEmpty.classList.add('osint-hidden');
    els.summary.classList.remove('osint-hidden');
    els.summaryType.textContent = titleCase(state.current.type);
    els.summaryValue.textContent = state.current.value;
    els.summaryScope.textContent = state.current.scope;
    els.summaryConfidence.textContent = state.current.confidence;
    els.entityNotice.textContent = disclosureForType(state.current.type);
  }

  function disclosureForType(type) {
    if (['email', 'phone'].includes(type)) {
      return 'Opening external pivots may disclose the complete identifier to the selected provider.';
    }
    if (type === 'ip') {
      return 'Opening reputation or routing pivots discloses the address to the selected provider.';
    }
    if (type === 'url') {
      return 'Opening scanners or archives discloses the URL to the selected provider.';
    }
    return 'External pivots disclose the selected entity or search term to the selected provider.';
  }

  function domainForCurrent() {
    if (!state.current) return '';
    if (state.current.type === 'domain') return state.current.value;
    if (state.current.type === 'email') return state.current.value.split('@')[1] || '';
    if (state.current.type === 'url') {
      try {
        return new URL(state.current.value).hostname;
      } catch {
        return '';
      }
    }
    return '';
  }

  function cancelDnsRun() {
    if (state.dnsRun?.controller) state.dnsRun.controller.abort();
    state.dnsRun = null;
  }

  async function runDns(domain) {
    cancelDnsRun();

    const run = {
      id: crypto.randomUUID ? crypto.randomUUID() : randomId(),
      domain,
      controller: new AbortController(),
      completed: 0,
      total: DNS_TYPES.length + 2
    };
    state.dnsRun = run;
    state.dns = [];
    state.dnsSources = new Set();

    els.dnsSection.classList.remove('osint-hidden');
    els.dnsDomain.textContent = domain;
    els.dnsStatus.textContent = 'Starting authenticated DNS analysis…';
    els.dnsRefresh.disabled = true;
    els.dnsSave.disabled = true;
    els.dnsBody.replaceChildren();
    els.mailPosture.replaceChildren();
    els.dnsRaw.textContent = '';

    const queries = DNS_TYPES.map((type) => ({ name: domain, type }));
    queries.push({ name: `_dmarc.${domain}`, type: 'TXT' });
    queries.push({ name: `_mta-sts.${domain}`, type: 'TXT' });

    renderDnsProgress(run);
    await Promise.allSettled(queries.map((query) => resolveDnsQuestion(run, query)));

    if (!isCurrentDnsRun(run)) return;

    els.dnsRefresh.disabled = false;
    els.dnsSave.disabled = state.dns.length === 0;
    els.dnsStatus.textContent = `${state.dns.length} DNS questions completed through ${dnsSourceLabel()} at ${new Date().toLocaleTimeString()}.`;
    updateCaseJson();
  }

  async function resolveDnsQuestion(run, query) {
    try {
      const resolved = await fetchDns(query.name, query.type, run.controller.signal);
      if (!isCurrentDnsRun(run)) return;

      state.dnsSources.add(resolved.source);
      state.dns.push(normalizeDnsResponse(query, resolved.data, resolved.source));
    } catch (error) {
      if (error?.name === 'AbortError' || !isCurrentDnsRun(run)) return;
      state.dns.push({
        query,
        source: 'CMX DNS request',
        status: null,
        statusLabel: 'NETWORK_ERROR',
        authenticatedData: false,
        truncated: false,
        recursionAvailable: false,
        answers: [],
        error: error instanceof Error ? error.message : String(error)
      });
    } finally {
      if (!isCurrentDnsRun(run)) return;
      run.completed += 1;
      sortDnsResults();
      renderDns(state.dns, run);
      updateCaseJson();
    }
  }

  function isCurrentDnsRun(run) {
    return state.dnsRun?.id === run.id
      && state.dnsRun.domain === run.domain
      && domainForCurrent() === run.domain
      && !run.controller.signal.aborted;
  }

  async function fetchDns(name, type, signal) {
    const sameOriginParams = new URLSearchParams({ name, type });
    try {
      const response = await fetch(`/api/dns?${sameOriginParams.toString()}`, {
        method: 'GET',
        cache: 'no-store',
        credentials: 'same-origin',
        headers: { accept: 'application/json' },
        signal
      });

      if (response.ok) {
        return {
          source: 'CMX authenticated DNS gateway',
          data: await response.json()
        };
      }

      if (!STATIC_FALLBACK_STATUSES.has(response.status)) {
        throw new Error(`CMX DNS gateway returned HTTP ${response.status}`);
      }
    } catch (error) {
      if (error?.name === 'AbortError') throw error;
      if (!(error instanceof TypeError)) throw error;
    }

    const directParams = new URLSearchParams({ name, type, cd: 'false', do: 'true' });
    const response = await fetch(`https://dns.google/resolve?${directParams.toString()}`, {
      method: 'GET',
      mode: 'cors',
      cache: 'no-store',
      credentials: 'omit',
      headers: { accept: 'application/dns-json' },
      signal
    });
    if (!response.ok) throw new Error(`Google Public DNS returned HTTP ${response.status}`);

    return {
      source: 'Google Public DNS direct fallback',
      data: await response.json()
    };
  }

  function normalizeDnsResponse(query, data, source) {
    const rawAnswers = Array.isArray(data.Answer)
      ? data.Answer
      : Array.isArray(data.answers)
        ? data.answers.map((answer) => ({
          name: answer.name,
          type: answer.type,
          TTL: answer.ttl,
          data: answer.data
        }))
        : [];

    const answers = rawAnswers.map((answer) => ({
      name: String(answer.name || query.name),
      type: Number(answer.type || 0),
      typeLabel: dnsTypeLabel(Number(answer.type || 0), query.type),
      ttl: Number.isFinite(Number(answer.TTL)) ? Number(answer.TTL) : null,
      data: String(answer.data ?? '')
    }));

    const statusValue = data.Status ?? data.status;
    return {
      query,
      source,
      queriedAt: data.queried_at || new Date().toISOString(),
      cacheHit: data.cache_hit === true,
      status: Number.isFinite(Number(statusValue)) ? Number(statusValue) : null,
      statusLabel: DNS_STATUS[statusValue] || `STATUS_${statusValue}`,
      authenticatedData: (data.AD ?? data.authenticated_data) === true,
      truncated: (data.TC ?? data.truncated) === true,
      recursionAvailable: (data.RA ?? data.recursion_available) === true,
      answers,
      comment: String(data.Comment ?? data.comment ?? '')
    };
  }

  function dnsTypeLabel(number, fallback) {
    const map = { 1: 'A', 2: 'NS', 5: 'CNAME', 6: 'SOA', 15: 'MX', 16: 'TXT', 28: 'AAAA', 257: 'CAA' };
    return map[number] || fallback || String(number);
  }

  function sortDnsResults() {
    const order = new Map(DNS_TYPES.map((type, index) => [type, index]));
    state.dns.sort((left, right) => {
      const leftSpecial = left.query.name.startsWith('_dmarc.') ? 100 : left.query.name.startsWith('_mta-sts.') ? 101 : order.get(left.query.type) ?? 99;
      const rightSpecial = right.query.name.startsWith('_dmarc.') ? 100 : right.query.name.startsWith('_mta-sts.') ? 101 : order.get(right.query.type) ?? 99;
      return leftSpecial - rightSpecial;
    });
  }

  function renderDns(results, run = state.dnsRun) {
    els.dnsBody.replaceChildren();
    let rowCount = 0;

    results.forEach((result) => {
      if (result.answers.length) {
        result.answers.forEach((answer) => {
          rowCount += 1;
          els.dnsBody.appendChild(dnsRow(result, answer));
        });
      } else {
        rowCount += 1;
        els.dnsBody.appendChild(dnsRow(result, null));
      }
    });

    if (run && run.completed < run.total) {
      els.dnsBody.appendChild(emptyTableRow(7, `${run.completed} of ${run.total} questions completed…`));
      els.dnsStatus.textContent = `${run.completed} of ${run.total} DNS questions completed through ${dnsSourceLabel()}.`;
    }

    renderMailPosture(results);
    els.dnsRaw.textContent = JSON.stringify(results, null, 2);
    if (!rowCount && (!run || run.completed >= run.total)) {
      els.dnsBody.appendChild(emptyTableRow(7, 'No DNS responses were returned.'));
    }
  }

  function renderDnsProgress(run) {
    els.dnsBody.replaceChildren(emptyTableRow(7, `0 of ${run.total} questions completed…`));
  }

  function dnsRow(result, answer) {
    const row = document.createElement('tr');
    appendCell(row, result.query.name, 'cmx-code');
    appendCell(row, answer?.typeLabel || result.query.type);
    appendCell(row, result.statusLabel);
    appendCell(row, answer?.ttl == null ? '—' : `${answer.ttl}s`);
    appendCell(row, answer?.data || result.error || result.comment || 'No answer');
    appendCell(row, result.authenticatedData ? 'Yes' : 'No');
    appendCell(row, result.truncated ? 'Yes' : 'No');
    row.title = `${result.source}${result.cacheHit ? ' · cache hit' : ''}`;
    return row;
  }

  function dnsSourceLabel() {
    if (!state.dnsSources.size) return 'CMX DNS gateway';
    if (state.dnsSources.size === 1) return [...state.dnsSources][0];
    return 'mixed gateway and fallback sources';
  }

  function renderMailPosture(results) {
    els.mailPosture.replaceChildren();
    const domain = domainForCurrent();
    if (!domain) return;

    const mx = answersFor(results, domain, 'MX').map((answer) => answer.data);
    const rootTxt = answersFor(results, domain, 'TXT').map((answer) => stripOuterQuotes(answer.data));
    const dmarc = answersFor(results, `_dmarc.${domain}`, 'TXT').map((answer) => stripOuterQuotes(answer.data));
    const mtaSts = answersFor(results, `_mta-sts.${domain}`, 'TXT').map((answer) => stripOuterQuotes(answer.data));
    const caa = answersFor(results, domain, 'CAA').map((answer) => answer.data);
    const adSeen = results.some((result) => result.authenticatedData);

    addMailItem('Mail provider', inferMailProvider(mx), mx.length ? mx.join(' | ') : 'No MX answer observed.', mx.length ? 'info' : 'warn');
    addMailItem('SPF', rootTxt.some((value) => /^v=spf1\b/i.test(value)) ? 'Present' : 'Not observed', firstMatching(rootTxt, /^v=spf1\b/i) || 'No SPF TXT record observed.', rootTxt.some((value) => /^v=spf1\b/i.test(value)) ? 'good' : 'warn');
    addMailItem('DMARC', dmarc.some((value) => /^v=dmarc1\b/i.test(value)) ? 'Present' : 'Not observed', firstMatching(dmarc, /^v=dmarc1\b/i) || 'No DMARC TXT record observed.', dmarc.some((value) => /^v=dmarc1\b/i.test(value)) ? 'good' : 'warn');
    addMailItem('MTA-STS', mtaSts.some((value) => /^v=stsv1\b/i.test(value)) ? 'Present' : 'Not observed', firstMatching(mtaSts, /^v=stsv1\b/i) || 'No _mta-sts TXT record observed.', mtaSts.some((value) => /^v=stsv1\b/i.test(value)) ? 'good' : 'warn');
    addMailItem('CAA', caa.length ? 'Present' : 'Not observed', caa.length ? caa.join(' | ') : 'No CAA answer observed.', caa.length ? 'good' : 'info');
    addMailItem('DNSSEC signal', adSeen ? 'Authenticated data observed' : 'Not confirmed', adSeen ? 'The resolver set AD on at least one response.' : 'AD was not set. This does not prove DNSSEC is absent.', adSeen ? 'good' : 'info');
    addMailItem('Resolver path', dnsSourceLabel(), 'Use the row title or exported JSON to review the source for each DNS question.', 'info');
    addMailItem('DKIM', 'Selector required', 'DKIM cannot be tested reliably without one or more selector names.', 'info');
  }

  function answersFor(results, name, type) {
    const normalizedName = `${name.replace(/\.$/, '')}.`;
    return results
      .filter((result) =>
        result.query.type === type
        && `${result.query.name.replace(/\.$/, '')}.` === normalizedName
      )
      .flatMap((result) => result.answers);
  }

  function addMailItem(label, status, detail, tone) {
    const item = document.createElement('div');
    item.className = 'osint-mail-item';
    const strong = document.createElement('strong');
    strong.textContent = label;
    const badge = document.createElement('span');
    badge.className = `osint-badge ${tone}`;
    badge.textContent = status;
    const copy = document.createElement('span');
    copy.textContent = detail;
    item.append(strong, badge, copy);
    els.mailPosture.appendChild(item);
  }

  function inferMailProvider(mxRecords) {
    const joined = mxRecords.join(' ').toLowerCase();
    if (!joined) return 'Unknown';
    if (/google\.com|googlemail\.com|aspmx/.test(joined)) return 'Google Workspace or Gmail';
    if (/outlook\.com|protection\.outlook\.com|office365/.test(joined)) return 'Microsoft 365';
    if (/zoho/.test(joined)) return 'Zoho Mail';
    if (/protonmail|proton\.ch/.test(joined)) return 'Proton Mail';
    if (/mimecast/.test(joined)) return 'Mimecast gateway';
    if (/ppe-hosted|proofpoint/.test(joined)) return 'Proofpoint gateway';
    if (/icloud/.test(joined)) return 'Apple iCloud Mail';
    if (/mailgun/.test(joined)) return 'Mailgun';
    return 'Custom or unrecognized MX';
  }

  function stripOuterQuotes(value) {
    return value.replace(/^"|"$/g, '');
  }

  function firstMatching(values, pattern) {
    return values.find((value) => pattern.test(value)) || '';
  }

  function saveDnsSummary() {
    const domain = domainForCurrent();
    if (!domain || !state.dns.length) return showToast('Run DNS analysis first.');
    const answerCount = state.dns.reduce((total, result) => total + result.answers.length, 0);
    const failures = state.dns
      .filter((result) => result.statusLabel !== 'NOERROR')
      .map((result) => `${result.query.type}:${result.statusLabel}`);
    addObservation(
      'dns',
      domain,
      dnsSourceLabel(),
      `${answerCount} answers across ${state.dns.length} questions.${failures.length ? ` Non-NOERROR: ${failures.join(', ')}.` : ''}`
    );
    showToast('DNS summary saved to the session log.');
  }

  function hideDns() {
    cancelDnsRun();
    els.dnsSection.classList.add('osint-hidden');
    els.dnsBody.replaceChildren();
    els.mailPosture.replaceChildren();
    els.dnsRaw.textContent = '';
    els.dnsRefresh.disabled = false;
    els.dnsSave.disabled = true;
  }

  function renderIpClassification() {
    if (!state.current || state.current.type !== 'ip') {
      els.ipSection.classList.add('osint-hidden');
      return;
    }
    els.ipSection.classList.remove('osint-hidden');
    const classification = classifyIp(state.current.value);
    els.ipClassification.textContent = classification.label;
    els.ipExplanation.textContent = classification.explanation;
  }

  function classifyIp(value) {
    if (isIPv4(value)) return classifyIPv4(value);
    const lower = value.toLowerCase();
    if (lower === '::') return ipClass('Unspecified IPv6', 'This address cannot identify a host.');
    if (lower === '::1') return ipClass('Loopback IPv6', 'This address refers to the local machine.');
    if (/^f[cd][0-9a-f]{2}:/i.test(lower)) return ipClass('Unique-local IPv6', 'Private IPv6 space. Public reputation lookups are not meaningful.');
    if (/^fe[89ab][0-9a-f]:/i.test(lower)) return ipClass('Link-local IPv6', 'Valid only on the local network segment.');
    if (/^ff/i.test(lower)) return ipClass('Multicast IPv6', 'A multicast group address, not a single host.');
    if (/^2001:0?db8:/i.test(lower)) return ipClass('Documentation IPv6', 'Reserved for examples and documentation.');
    return ipClass('Global or unclassified IPv6', 'Use RDAP and routing sources to confirm allocation and context.');
  }

  function classifyIPv4(value) {
    const number = ipv4Number(value);
    const ranges = [
      ['Unspecified or this-network IPv4', 'This address is not a normal public host address.', '0.0.0.0', '0.255.255.255'],
      ['Private IPv4', 'RFC 1918 private space. Public reputation lookups are not meaningful.', '10.0.0.0', '10.255.255.255'],
      ['Shared carrier-grade NAT IPv4', 'RFC 6598 space used between subscribers and carriers.', '100.64.0.0', '100.127.255.255'],
      ['Loopback IPv4', 'This address refers to the local machine.', '127.0.0.0', '127.255.255.255'],
      ['Link-local IPv4', 'Automatic private address used on a local link.', '169.254.0.0', '169.254.255.255'],
      ['Private IPv4', 'RFC 1918 private space. Public reputation lookups are not meaningful.', '172.16.0.0', '172.31.255.255'],
      ['Benchmark IPv4', 'Reserved for network benchmark testing.', '198.18.0.0', '198.19.255.255'],
      ['Private IPv4', 'RFC 1918 private space. Public reputation lookups are not meaningful.', '192.168.0.0', '192.168.255.255'],
      ['Documentation IPv4', 'Reserved for examples and documentation.', '192.0.2.0', '192.0.2.255'],
      ['Documentation IPv4', 'Reserved for examples and documentation.', '198.51.100.0', '198.51.100.255'],
      ['Documentation IPv4', 'Reserved for examples and documentation.', '203.0.113.0', '203.0.113.255'],
      ['Multicast IPv4', 'A multicast group address, not a single host.', '224.0.0.0', '239.255.255.255'],
      ['Reserved IPv4', 'Reserved or limited-use address space.', '240.0.0.0', '255.255.255.254']
    ];
    if (value === '255.255.255.255') {
      return ipClass('Limited broadcast IPv4', 'Broadcast address for the local network.');
    }
    const match = ranges.find((range) =>
      number >= ipv4Number(range[2]) && number <= ipv4Number(range[3])
    );
    return match
      ? ipClass(match[0], match[1])
      : ipClass('Public IPv4', 'Use RDAP and routing sources to confirm allocation, network, and context.');
  }

  function ipv4Number(value) {
    return value.split('.').reduce((total, part) => total * 256 + Number(part), 0);
  }

  function ipClass(label, explanation) {
    return { label, explanation };
  }

  function buildPivots(entity) {
    const value = entity.value;
    const exact = `"${value.replace(/"/g, '')}"`;
    const google = (query) => `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    const bing = (query) => `https://www.bing.com/search?q=${encodeURIComponent(query)}`;
    const ddg = (query) => `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;

    if (entity.type === 'email') {
      return [
        pivot('Exact web search', 'Google', 'Find exact public mentions.', google(exact), true),
        pivot('Exact web search', 'Bing', 'Compare another public index.', bing(exact), true),
        pivot('Exact web search', 'DuckDuckGo', 'Compare another public index.', ddg(exact), true),
        pivot('GitHub search', 'GitHub', 'Find exact mentions in public code and profiles.', `https://github.com/search?q=${encodeURIComponent(value)}&type=code`, true),
        pivot('Breach notification check', 'Have I Been Pwned', 'Check whether the address appears in disclosed breach data.', `https://haveibeenpwned.com/account/${encodeURIComponent(value)}`, true),
        pivot('Domain analysis', 'CMX', 'Continue with the email domain in this console.', `/osint?type=domain&entity=${encodeURIComponent(value.split('@')[1])}`, false)
      ];
    }

    if (entity.type === 'username') {
      return [
        pivot('GitHub profile', 'GitHub', 'Open the exact public profile path.', `https://github.com/${encodeURIComponent(value)}`, true),
        pivot('Reddit profile', 'Reddit', 'Open the exact public profile path.', `https://www.reddit.com/user/${encodeURIComponent(value)}`, true),
        pivot('X profile', 'X', 'Open the exact public profile path.', `https://x.com/${encodeURIComponent(value)}`, true),
        pivot('Instagram profile', 'Instagram', 'Open the exact public profile path.', `https://www.instagram.com/${encodeURIComponent(value)}/`, true),
        pivot('TikTok profile', 'TikTok', 'Open the exact public profile path.', `https://www.tiktok.com/@${encodeURIComponent(value)}`, true),
        pivot('YouTube handle', 'YouTube', 'Open the exact public handle path.', `https://www.youtube.com/@${encodeURIComponent(value)}`, true),
        pivot('Exact web search', 'Google', 'Find cross-platform public mentions.', google(exact), true),
        pivot('Exact web search', 'DuckDuckGo', 'Compare another public index.', ddg(exact), true)
      ];
    }

    if (entity.type === 'domain') return domainPivots(value);
    if (entity.type === 'ip') return ipPivots(value);

    if (entity.type === 'url') {
      const domain = new URL(value).hostname;
      return [
        pivot('Exact URL search', 'Google', 'Find indexed references to the complete URL.', google(exact), true),
        pivot('Archived captures', 'Internet Archive', 'Review historical public captures.', `https://web.archive.org/web/*/${encodeURIComponent(value)}`, true),
        pivot('URL scan search', 'urlscan.io', 'Find public scan records for the URL.', `https://urlscan.io/search/#${encodeURIComponent(`page.url:"${value}"`)}`, true),
        pivot('URL intelligence search', 'VirusTotal', 'Search public URL intelligence.', `https://www.virustotal.com/gui/search/${encodeURIComponent(value)}`, true),
        pivot('Domain analysis', 'CMX', 'Analyze the URL hostname.', `/osint?type=domain&entity=${encodeURIComponent(domain)}`, false)
      ];
    }

    if (entity.type === 'phone') {
      return [
        pivot('Phone intelligence', 'CMX', 'Open the specialized phone workflow.', `/phone?n=${encodeURIComponent(value)}`, false),
        pivot('Exact web search', 'Google', 'Search the complete normalized number.', google(exact), true),
        pivot('Exact web search', 'Bing', 'Compare another public index.', bing(exact), true)
      ];
    }

    return [
      pivot('Focused search workbench', 'CMX', 'Build provider-specific public searches.', `/search?type=text&entity=${encodeURIComponent(value.slice(0, 500))}`, false),
      pivot('Exact web search', 'Google', 'Search the complete supplied text.', google(exact), true),
      pivot('Exact web search', 'DuckDuckGo', 'Compare another public index.', ddg(exact), true)
    ];
  }

  function domainPivots(domain) {
    const encoded = encodeURIComponent(domain);
    return [
      pivot('Certificate transparency', 'crt.sh', 'Find public certificates and observed subdomains.', `https://crt.sh/?q=${encoded}`, true),
      pivot('Public scan history', 'urlscan.io', 'Review public scans associated with the domain.', `https://urlscan.io/domain/${encoded}`, true),
      pivot('Domain intelligence', 'VirusTotal', 'Review public detections and relationships.', `https://www.virustotal.com/gui/domain/${encoded}`, true),
      pivot('Archived captures', 'Internet Archive', 'Review public historical snapshots.', `https://web.archive.org/web/*/${encoded}`, true),
      pivot('Registration data', 'RDAP', 'Review current public registration records.', `https://rdap.org/domain/${encoded}`, true),
      pivot('DNSSEC analysis', 'DNSViz', 'Inspect the public DNSSEC chain.', `https://dnsviz.net/d/${encoded}/dnssec/`, true),
      pivot('Technology profile', 'BuiltWith', 'Review observed public web technology.', `https://builtwith.com/${encoded}`, true),
      pivot('Internet exposure search', 'Shodan', 'Search public indexed services referencing the domain.', `https://www.shodan.io/search?query=${encoded}`, true)
    ];
  }

  function ipPivots(ip) {
    const encoded = encodeURIComponent(ip);
    return [
      pivot('Registration data', 'RDAP', 'Review allocation and network ownership records.', `https://rdap.org/ip/${encoded}`, true),
      pivot('Routing context', 'RIPEstat', 'Review routing, ASN, and related public datasets.', `https://stat.ripe.net/${encoded}`, true),
      pivot('BGP context', 'Hurricane Electric', 'Review public routing context.', `https://bgp.he.net/ip/${encoded}`, true),
      pivot('Internet exposure', 'Shodan', 'Review indexed public services for the address.', `https://www.shodan.io/host/${encoded}`, true),
      pivot('Internet noise context', 'GreyNoise', 'Review public scanner and noise context.', `https://viz.greynoise.io/ip/${encoded}`, true),
      pivot('Abuse reports', 'AbuseIPDB', 'Review public abuse reports.', `https://www.abuseipdb.com/check/${encoded}`, true),
      pivot('Address intelligence', 'VirusTotal', 'Review public detections and relationships.', `https://www.virustotal.com/gui/ip-address/${encoded}`, true)
    ];
  }

  function pivot(title, provider, purpose, url, disclosure) {
    return { title, provider, purpose, url, disclosure };
  }

  function renderPivots(pivots) {
    els.pivotList.replaceChildren();
    els.pivotEmpty.classList.toggle('osint-hidden', pivots.length > 0);

    pivots.forEach((item) => {
      const card = document.createElement('article');
      card.className = 'osint-pivot';

      const head = document.createElement('div');
      head.className = 'osint-pivot-head';
      const titleBox = document.createElement('div');
      const title = document.createElement('div');
      title.className = 'osint-pivot-title';
      title.textContent = item.title;
      const provider = document.createElement('div');
      provider.className = 'osint-pivot-provider';
      provider.textContent = item.provider;
      titleBox.append(title, provider);
      const badge = document.createElement('span');
      badge.className = `osint-badge ${item.disclosure ? 'warn' : 'good'}`;
      badge.textContent = item.disclosure ? 'External disclosure' : 'Internal';
      head.append(titleBox, badge);

      const copy = document.createElement('div');
      copy.className = 'osint-pivot-copy';
      copy.textContent = item.purpose;

      const actions = document.createElement('div');
      actions.className = 'osint-pivot-actions';
      const open = document.createElement('a');
      open.className = 'cmx-mini-button open';
      open.textContent = 'Open';
      open.href = item.url;
      if (isExternalUrl(item.url)) {
        open.target = '_blank';
        open.rel = 'noopener noreferrer';
      }

      const absoluteUrl = new URL(item.url, window.location.href).href;
      const copyButton = miniButton('Copy URL', () => copyText(absoluteUrl, 'URL copied.'));
      const saveButton = miniButton('Save', () => {
        addObservation(
          'pivot',
          state.current?.value || '',
          item.provider,
          `${item.title}: ${item.purpose} ${absoluteUrl}`
        );
        showToast('Pivot saved to the session log.');
      });
      actions.append(open, copyButton, saveButton);

      card.append(head, copy, actions);
      els.pivotList.appendChild(card);
    });
  }

  function isExternalUrl(value) {
    try {
      return new URL(value, window.location.href).origin !== window.location.origin;
    } catch {
      return false;
    }
  }

  function extractFromText() {
    const text = els.textInput.value.slice(0, 20000);
    if (!text.trim()) return showToast('Paste text to extract identifiers.');

    const findings = [];
    addFindings(findings, 'email', text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) || []);
    addFindings(findings, 'url', text.match(/https?:\/\/[^\s"'<>]+/gi) || []);
    addFindings(findings, 'ip', text.match(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g) || [], isIPv4);
    addFindings(findings, 'domain', text.match(/\b(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}\b/gi) || [], (value) => Boolean(normalizeDomain(value)));
    addFindings(findings, 'phone', text.match(/\+?\d[\d\s().-]{5,}\d/g) || [], (value) => Boolean(normalizePhone(value)));

    state.extracted = dedupeFindings(findings).slice(0, 150);
    renderExtracted();
    showToast(`${state.extracted.length} candidate identifier${state.extracted.length === 1 ? '' : 's'} extracted.`);
  }

  function addFindings(target, type, values, predicate = () => true) {
    values.forEach((value) => {
      const cleaned = value.trim().replace(/[),.;]+$/, '');
      if (predicate(cleaned)) target.push({ type, value: cleaned });
    });
  }

  function dedupeFindings(findings) {
    const seen = new Set();
    return findings.filter((finding) => {
      const key = `${finding.type}:${finding.value.toLowerCase()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function renderExtracted() {
    els.extracted.replaceChildren();
    if (!state.extracted.length) {
      const empty = document.createElement('div');
      empty.className = 'cmx-empty';
      empty.textContent = 'No candidate identifiers found.';
      els.extracted.appendChild(empty);
      return;
    }

    state.extracted.forEach((finding) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'osint-entity-chip';
      button.textContent = `${titleCase(finding.type)}: ${finding.value}`;
      button.addEventListener('click', () => {
        els.type.value = finding.type;
        els.value.value = finding.value;
        analyzeFromForm();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      els.extracted.appendChild(button);
    });
  }

  function addObservation(kind, value, source, note) {
    state.observations.unshift({
      id: crypto.randomUUID ? crypto.randomUUID() : randomId(),
      timestamp: new Date().toISOString(),
      kind: String(kind).slice(0, 40),
      value: String(value).slice(0, 1000),
      source: String(source).slice(0, 200),
      note: String(note).slice(0, 4000)
    });
    state.observations = state.observations.slice(0, 250);
    renderObservations();
    updateCaseJson();
  }

  function renderObservations() {
    els.observationBody.replaceChildren();
    els.observationEmpty.classList.toggle('osint-hidden', state.observations.length > 0);

    state.observations.forEach((observation) => {
      const row = document.createElement('tr');
      appendCell(row, new Date(observation.timestamp).toLocaleString());
      appendCell(row, observation.kind);
      appendCell(row, observation.value, 'cmx-code');
      appendCell(row, observation.source);
      appendCell(row, observation.note);
      const actions = document.createElement('td');
      actions.appendChild(miniButton('Remove', () => {
        state.observations = state.observations.filter((item) => item.id !== observation.id);
        renderObservations();
        updateCaseJson();
      }));
      row.appendChild(actions);
      els.observationBody.appendChild(row);
    });
  }

  function clearObservationLog() {
    if (!state.observations.length) return;
    if (!window.confirm('Clear the current session observation log?')) return;
    state.observations = [];
    renderObservations();
    updateCaseJson();
    showToast('Session observation log cleared.');
  }

  function casePayload() {
    return {
      schema: 'cmx-osint-session-v1',
      exportedAt: new Date().toISOString(),
      sessionId: els.session.textContent,
      entity: state.current,
      dns: state.dns,
      dnsSource: dnsSourceLabel(),
      observations: state.observations
    };
  }

  function updateCaseJson() {
    els.caseJson.textContent = JSON.stringify(casePayload(), null, 2);
  }

  function exportCase() {
    const payload = JSON.stringify(casePayload(), null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const entity = state.current?.value.replace(/[^a-z0-9.-]+/gi, '-').slice(0, 60) || 'session';
    link.href = url;
    link.download = `cmx-osint-${entity}-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showToast('Session JSON exported.');
  }

  function copyCase() {
    copyText(JSON.stringify(casePayload(), null, 2), 'Session JSON copied.');
  }

  function clearEntity() {
    cancelDnsRun();
    els.value.value = '';
    els.notes.value = '';
    els.type.value = 'auto';
    state.current = null;
    state.dns = [];
    state.dnsSources = new Set();
    renderSummary();
    hideDns();
    renderIpClassification();
    renderPivots([]);
    updateToolLinks();
    updateCaseJson();
    els.value.focus();
  }

  function updateToolLinks() {
    const entity = state.current?.value || '';
    const type = state.current?.type || 'auto';
    els.searchTool.href = entity
      ? `/search?type=${encodeURIComponent(type)}&entity=${encodeURIComponent(entity)}`
      : '/search';
    els.phoneTool.href = type === 'phone' ? `/phone?n=${encodeURIComponent(entity)}` : '/phone';
    els.metadataTool.href = '/metadata';
    els.missingTool.href = '/missing';
    els.resourcesTool.href = '/resources';
  }

  function appendCell(row, text, className = '') {
    const cell = document.createElement('td');
    if (className) cell.className = className;
    cell.textContent = text;
    row.appendChild(cell);
  }

  function emptyTableRow(columns, text) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = columns;
    cell.className = 'cmx-muted';
    cell.textContent = text;
    row.appendChild(cell);
    return row;
  }

  function miniButton(label, action) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'cmx-mini-button';
    button.textContent = label;
    button.addEventListener('click', action);
    return button;
  }

  function titleCase(value) {
    return String(value).charAt(0).toUpperCase() + String(value).slice(1);
  }

  async function copyText(text, successMessage) {
    try {
      await navigator.clipboard.writeText(text);
      showToast(successMessage);
    } catch {
      showToast('Clipboard access is unavailable.');
    }
  }

  let toastTimer;
  function showToast(message) {
    els.toast.textContent = message;
    els.toast.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => els.toast.classList.remove('show'), 2400);
  }
})();
