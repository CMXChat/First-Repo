(() => {
  'use strict';

  if ((window.location.pathname.replace(/\/index\.html$/i, '/').replace(/\/+$/, '') || '/') !== '/osint') return;
  if (window.__cmxOsintRouting) return;
  window.__cmxOsintRouting = true;

  const state = {
    controller: null,
    serial: 0,
    payload: null,
    observation: null,
    protected: false,
    saving: false
  };

  window.setTimeout(initialize, 0);

  function initialize() {
    const enrichment = document.getElementById('enrichmentSection');
    if (!enrichment || document.getElementById('routingSection')) return;
    const section = buildSection();
    enrichment.insertAdjacentElement('afterend', section);
    bindControls();
    observeProtection();
    observeEntityPrefill();
    synchronizeAvailability();
  }

  function buildSection() {
    const section = document.createElement('section');
    section.className = 'cmx-card cmx-section';
    section.id = 'routingSection';

    const heading = document.createElement('div');
    heading.className = 'osint-section-title';
    const headingCopy = document.createElement('div');
    const title = document.createElement('h2');
    title.textContent = 'BGP and RPKI context';
    const copy = document.createElement('p');
    copy.textContent = 'Collect bounded public routing observations through fixed RIPEstat endpoints.';
    headingCopy.append(title, copy);
    heading.appendChild(headingCopy);

    const controls = document.createElement('div');
    controls.className = 'osint-routing-controls';
    const resourceField = field('Public IP or prefix', input('routingResource', '8.8.8.8 or 8.8.8.0/24'));
    const asnField = field('ASN', input('routingAsn', 'AS15169'));
    controls.append(resourceField, asnField);

    const actions = document.createElement('div');
    actions.className = 'osint-routing-actions cmx-section';
    actions.append(
      button('routingOrigin', 'Find origin', 'primary'),
      button('routingPrefixes', 'ASN prefixes'),
      button('routingVisibility', 'Route visibility'),
      button('routingRpki', 'Validate RPKI'),
      button('routingCancel', 'Cancel', 'danger', true)
    );

    const boundary = document.createElement('p');
    boundary.className = 'cmx-notice warn cmx-section';
    const boundaryStrong = document.createElement('strong');
    boundaryStrong.textContent = 'Interpretation boundary: ';
    boundary.append(
      boundaryStrong,
      document.createTextNode('RIPE RIS observations describe public routing visibility. RPKI states describe whether a prefix and origin ASN match a Route Origin Authorization. These results do not establish ownership, control, compromise, attribution, intent, or malicious activity.')
    );

    const status = document.createElement('p');
    status.className = 'osint-routing-status';
    status.id = 'routingStatus';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    status.textContent = 'Routing lookups require the protected FastAPI origin.';

    const result = document.createElement('div');
    result.className = 'osint-routing-result osint-hidden';
    result.id = 'routingResult';

    const provenance = document.createElement('div');
    provenance.className = 'osint-routing-provenance';
    provenance.id = 'routingProvenance';
    const summary = document.createElement('div');
    summary.className = 'osint-routing-summary';
    summary.id = 'routingSummary';
    const records = document.createElement('div');
    records.className = 'osint-routing-records';
    records.id = 'routingRecords';
    const suggestion = document.createElement('div');
    suggestion.className = 'osint-routing-suggestion osint-hidden';
    suggestion.id = 'routingSuggestion';

    const rawDetails = document.createElement('details');
    const rawSummary = document.createElement('summary');
    rawSummary.textContent = 'Normalized routing JSON';
    const raw = document.createElement('pre');
    raw.className = 'osint-routing-json';
    raw.id = 'routingRaw';
    rawDetails.append(rawSummary, raw);

    const save = document.createElement('section');
    save.className = 'osint-routing-save osint-hidden';
    save.id = 'routingSaveBox';
    save.setAttribute('aria-label', 'Save routing observation');
    const saveTitle = document.createElement('h3');
    saveTitle.textContent = 'Save normalized routing observation';
    const saveCopy = document.createElement('p');
    saveCopy.className = 'cmx-card-copy';
    saveCopy.textContent = 'Saving creates one owner-scoped observation in the selected case. Confidence remains unrated until an analyst reviews the routing evidence.';
    const disclosure = document.createElement('dl');
    disclosure.className = 'osint-routing-disclosure';
    disclosure.id = 'routingSaveDisclosure';
    const duplicate = document.createElement('div');
    duplicate.className = 'osint-routing-duplicate';
    duplicate.id = 'routingDuplicate';
    duplicate.hidden = true;
    const duplicateText = document.createElement('p');
    duplicateText.id = 'routingDuplicateText';
    const duplicateLabel = document.createElement('label');
    const duplicateCheck = document.createElement('input');
    duplicateCheck.type = 'checkbox';
    duplicateCheck.id = 'routingDuplicateReview';
    const duplicateCopy = document.createElement('span');
    duplicateCopy.textContent = 'I reviewed the existing observation and still want to create another record.';
    duplicateLabel.append(duplicateCheck, duplicateCopy);
    duplicate.append(duplicateText, duplicateLabel);
    const saveActions = document.createElement('div');
    saveActions.className = 'cmx-actions';
    saveActions.appendChild(button('routingSave', 'Save routing observation', 'good', true));
    save.append(saveTitle, saveCopy, disclosure, duplicate, saveActions);

    result.append(provenance, summary, records, suggestion, rawDetails, save);
    section.append(heading, controls, actions, boundary, status, result);
    return section;
  }

  function bindControls() {
    document.getElementById('routingOrigin')?.addEventListener('click', () => runRouting('origin'));
    document.getElementById('routingPrefixes')?.addEventListener('click', () => runRouting('prefixes'));
    document.getElementById('routingVisibility')?.addEventListener('click', () => runRouting('visibility'));
    document.getElementById('routingRpki')?.addEventListener('click', () => runRouting('rpki'));
    document.getElementById('routingCancel')?.addEventListener('click', cancelRouting);
    document.getElementById('routingSave')?.addEventListener('click', saveObservation);
    document.getElementById('routingDuplicateReview')?.addEventListener('change', synchronizeSaveButton);
    document.getElementById('routingResource')?.addEventListener('input', invalidateResult);
    document.getElementById('routingAsn')?.addEventListener('input', invalidateResult);
    document.addEventListener('change', (event) => {
      if (event.target?.classList?.contains('cmx-case-context-select')) {
        clearDuplicate();
        synchronizeSaveButton();
      }
    });
  }

  function observeProtection() {
    const update = () => {
      const badge = document.querySelector('.cmx-case-context-badge');
      state.protected = Boolean(badge?.classList.contains('protected'));
      synchronizeAvailability();
    };
    update();
    const target = document.querySelector('.cmx-case-context') || document.body;
    new MutationObserver(update).observe(target, { childList: true, subtree: true, attributes: true });
  }

  function observeEntityPrefill() {
    const summary = document.getElementById('summaryValue');
    const type = document.getElementById('summaryType');
    if (!summary || !type) return;
    const apply = () => {
      const value = (summary.textContent || '').trim();
      const entityType = (type.textContent || '').trim().toLowerCase();
      const resource = document.getElementById('routingResource');
      const asn = document.getElementById('routingAsn');
      if (!value) return;
      if (entityType === 'ip' && resource && !resource.value.trim()) resource.value = value;
      if (entityType === 'text' && /^as\d+$/i.test(value) && asn && !asn.value.trim()) asn.value = value;
    };
    new MutationObserver(apply).observe(summary, { childList: true, characterData: true, subtree: true });
    apply();
  }

  async function runRouting(kind) {
    if (!state.protected) return setStatus('Routing lookup is unavailable outside the protected FastAPI origin.', 'bad');
    const resource = document.getElementById('routingResource')?.value.trim() || '';
    const asn = document.getElementById('routingAsn')?.value.trim() || '';
    const request = routingRequest(kind, resource, asn);
    if (!request) return;

    cancelRouting(false);
    const serial = ++state.serial;
    const controller = new AbortController();
    state.controller = controller;
    state.payload = null;
    state.observation = null;
    clearDuplicate();
    setBusy(true);
    hideResult();
    setStatus(`Collecting ${request.label} from the protected routing gateway.`, 'warn');

    try {
      const response = await fetch(request.url, {
        credentials: 'same-origin',
        cache: 'no-store',
        headers: { accept: 'application/json' },
        signal: controller.signal
      });
      if (!response.ok) throw await responseError(response, `${request.label} failed`);
      const payload = await response.json();
      if (serial !== state.serial || controller.signal.aborted) return;
      state.payload = payload;
      state.observation = buildObservation(payload);
      renderResult(payload);
      setStatus(`${request.label} completed. Review provenance and limitations before saving.`, 'good');
      await reviewDuplicate();
    } catch (error) {
      if (serial !== state.serial) return;
      if (error?.name === 'AbortError') setStatus('Routing lookup cancelled. No result was saved.', 'warn');
      else setStatus(error instanceof Error ? error.message : 'Routing lookup failed.', 'bad');
    } finally {
      if (serial === state.serial) {
        state.controller = null;
        setBusy(false);
        synchronizeSaveButton();
      }
    }
  }

  function routingRequest(kind, resource, asn) {
    if (kind === 'origin') {
      if (!resource) return void setStatus('Enter a public IP address or prefix.', 'bad');
      return { label: 'origin lookup', url: `/api/routing/origin?resource=${encodeURIComponent(resource)}` };
    }
    if (kind === 'prefixes') {
      if (!asn) return void setStatus('Enter an ASN such as AS15169.', 'bad');
      return { label: 'announced-prefix lookup', url: `/api/routing/prefixes?asn=${encodeURIComponent(asn)}` };
    }
    if (kind === 'visibility') {
      if (!resource) return void setStatus('Enter a public IP address or exact prefix.', 'bad');
      return { label: 'route-visibility lookup', url: `/api/routing/visibility?resource=${encodeURIComponent(resource)}` };
    }
    if (!resource || !asn) {
      setStatus('RPKI validation requires both a public prefix and an ASN.', 'bad');
      return null;
    }
    return { label: 'RPKI validation', url: `/api/routing/rpki?prefix=${encodeURIComponent(resource)}&asn=${encodeURIComponent(asn)}` };
  }

  function cancelRouting(announce = true) {
    if (state.controller) state.controller.abort();
    state.controller = null;
    state.serial += 1;
    setBusy(false);
    if (announce) setStatus('Routing lookup cancelled. No result was saved.', 'warn');
  }

  function invalidateResult() {
    if (!state.payload) return;
    state.payload = null;
    state.observation = null;
    clearDuplicate();
    hideResult();
    setStatus('Routing inputs changed. Run a new lookup before saving.', 'warn');
  }

  function renderResult(payload) {
    const resultBox = document.getElementById('routingResult');
    resultBox?.classList.remove('osint-hidden');
    renderProvenance(payload);
    document.getElementById('routingSummary').textContent = summarize(payload);
    renderRecords(payload);
    document.getElementById('routingRaw').textContent = JSON.stringify(payload, null, 2);
    renderSuggestion(payload);
    renderDisclosure();
    document.getElementById('routingSaveBox')?.classList.remove('osint-hidden');
  }

  function renderProvenance(payload) {
    const container = document.getElementById('routingProvenance');
    container.replaceChildren();
    const entries = [
      ['Provider', payload.provider || 'Unknown provider'],
      ['Target', payload.target || 'Unknown target'],
      ['Collected', formatTime(payload.collected_at)],
      ['Cache', payload.cache_hit ? 'Cached result' : 'Fresh provider result'],
      ['Requester', payload.requested_by || 'Unknown identity']
    ];
    entries.forEach(([label, value]) => container.appendChild(provenanceItem(label, value)));
    const source = document.createElement('div');
    const sourceLabel = document.createElement('strong');
    sourceLabel.textContent = 'Provider source';
    const sourceValue = document.createElement('span');
    sourceValue.textContent = payload.source_url || 'Unavailable';
    source.append(sourceLabel, sourceValue);
    container.appendChild(source);
  }

  function renderRecords(payload) {
    const container = document.getElementById('routingRecords');
    container.replaceChildren();
    const result = payload.result || {};
    if (payload.adapter === 'announced_prefixes') {
      (result.prefixes || []).slice(0, 100).forEach((record) => {
        const periods = (record.timelines || []).map((item) => `${item.start || '?'} to ${item.end || '?'}`).join(' · ');
        container.appendChild(recordCard(record.prefix || 'Unknown prefix', periods || 'No timeline returned'));
      });
    } else if (payload.adapter === 'route_visibility') {
      (result.collectors || []).forEach((collector) => {
        (collector.peers || []).forEach((peer) => {
          const path = (peer.as_path || []).map((value) => `AS${value}`).join(' → ');
          container.appendChild(recordCard(
            `${collector.rrc || 'RIS collector'} · ${peer.peer || 'peer unavailable'}`,
            `${peer.prefix || 'prefix unavailable'} · origin ${peer.origin_asn ? `AS${peer.origin_asn}` : 'unknown'}${path ? ` · path ${path}` : ''}`
          ));
        });
      });
    } else {
      Object.entries(result).slice(0, 40).forEach(([key, value]) => {
        container.appendChild(recordCard(humanize(key), displayValue(value)));
      });
    }
    if (!container.childElementCount) container.appendChild(recordCard('No normalized records', 'The provider returned no displayable routing records.'));
  }

  function renderSuggestion(payload) {
    const box = document.getElementById('routingSuggestion');
    box.replaceChildren();
    const asns = originAsns(payload);
    const caseId = selectedCaseId();
    if (!asns.length || !caseId) {
      box.classList.add('osint-hidden');
      return;
    }
    const copy = document.createElement('p');
    copy.textContent = `Review-only suggestion: the routing result references ${asns.map((asn) => `AS${asn}`).join(', ')}. No relationship has been created.`;
    const link = document.createElement('a');
    link.className = 'cmx-button';
    link.href = `/cases?case=${encodeURIComponent(caseId)}#relationships`;
    link.textContent = 'Review relationships in Cases';
    box.append(copy, link);
    box.classList.remove('osint-hidden');
  }

  function renderDisclosure() {
    const disclosure = document.getElementById('routingSaveDisclosure');
    disclosure.replaceChildren();
    if (!state.observation) return;
    [
      ['Case', selectedCaseId() || 'No active case selected'],
      ['Kind', state.observation.kind],
      ['Value', state.observation.value_text],
      ['Confidence', 'unrated'],
      ['Analyst note', state.observation.note]
    ].forEach(([term, value]) => {
      const dt = document.createElement('dt');
      dt.textContent = term;
      const dd = document.createElement('dd');
      dd.textContent = value;
      disclosure.append(dt, dd);
    });
  }

  async function reviewDuplicate() {
    clearDuplicate();
    if (!state.observation || !selectedCaseId() || !state.protected) return;
    try {
      const response = await fetch(`/api/cases/${encodeURIComponent(selectedCaseId())}`, {
        credentials: 'same-origin',
        cache: 'no-store',
        headers: { accept: 'application/json' }
      });
      if (!response.ok) throw new Error(`Case service returned HTTP ${response.status}`);
      const detail = await response.json();
      const duplicate = (detail.observations || []).find((record) => (
        record.kind === state.observation.kind
        && record.value_text === state.observation.value_text
        && (record.note || '') === state.observation.note
      ));
      if (duplicate) {
        document.getElementById('routingDuplicateText').textContent = `Possible exact duplicate found: observation ${duplicate.id}.`;
        document.getElementById('routingDuplicate').hidden = false;
      }
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Duplicate review failed.', 'bad');
    }
    synchronizeSaveButton();
  }

  async function saveObservation() {
    const caseId = selectedCaseId();
    if (!state.protected || !caseId || !state.observation || state.saving) return;
    state.saving = true;
    setSaveLocked(true);
    setStatus(`Saving routing observation to case ${caseId}.`, 'warn');
    try {
      await reviewDuplicate();
      const duplicateVisible = !document.getElementById('routingDuplicate').hidden;
      const acknowledged = document.getElementById('routingDuplicateReview').checked;
      if (duplicateVisible && !acknowledged) {
        setStatus('Review and acknowledge the exact duplicate before saving another record.', 'bad');
        return;
      }
      const response = await fetch(`/api/cases/${encodeURIComponent(caseId)}/observations`, {
        method: 'POST',
        credentials: 'same-origin',
        cache: 'no-store',
        headers: { 'content-type': 'application/json', accept: 'application/json' },
        body: JSON.stringify(state.observation)
      });
      if (!response.ok) throw await responseError(response, 'Routing save failed');
      const saved = await response.json();
      setStatus(`Saved ${saved.kind} observation to case ${caseId}.`, 'good');
      document.getElementById('routingSave').disabled = true;
      document.getElementById('routingDuplicateReview').checked = false;
      await reviewDuplicate();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Routing save failed.', 'bad');
    } finally {
      state.saving = false;
      setSaveLocked(false);
      synchronizeSaveButton();
    }
  }

  function buildObservation(payload) {
    const adapter = String(payload.adapter || 'routing')
      .replace(/[^a-z0-9_-]+/gi, '_')
      .toLowerCase()
      .slice(0, 60);
    const notePayload = {
      provider: payload.provider || '',
      source_url: payload.source_url || '',
      target: payload.target || '',
      collected_at: payload.collected_at || '',
      cache_hit: payload.cache_hit === true,
      requested_by: payload.requested_by || '',
      limitation: payload.limitation || '',
      normalized_result: payload.result || {}
    };
    return {
      kind: `routing_${adapter}`.slice(0, 80),
      value_text: summarize(payload).slice(0, 20000),
      note: JSON.stringify(notePayload, null, 2).slice(0, 20000),
      confidence: 'unrated',
      observed_at: payload.collected_at || new Date().toISOString()
    };
  }

  function summarize(payload) {
    const result = payload.result || {};
    if (payload.adapter === 'network_info') {
      const asns = (result.origin_asns || []).map((asn) => `AS${asn}`).join(', ') || 'no origin ASN returned';
      return `${result.resource || payload.target} maps to ${result.matched_prefix || 'no routed prefix'} · ${asns}`;
    }
    if (payload.adapter === 'prefix_overview') {
      const asns = (result.origin_asns || []).map((item) => `AS${item.asn}`).join(', ') || 'no origin ASN returned';
      return `${result.resource || payload.target} · ${result.announced ? 'announced' : 'not announced'} · ${asns}`;
    }
    if (payload.adapter === 'announced_prefixes') {
      return `AS${result.asn || payload.target} · ${result.returned_records || 0} of ${result.provider_record_count || 0} announced prefixes returned`;
    }
    if (payload.adapter === 'route_visibility') {
      return `${result.resource || payload.target} · ${result.peer_records || 0} peer views across ${result.collector_count || 0} RIS collectors`;
    }
    const stateLabel = {
      valid: 'valid',
      invalid: 'invalid',
      not_found: 'ROA not found',
      unavailable: 'validation unavailable'
    }[result.state] || 'validation unavailable';
    return `${result.prefix || payload.target} AS${result.asn || '?'} · RPKI ${stateLabel}`;
  }

  function originAsns(payload) {
    const result = payload.result || {};
    if (payload.adapter === 'network_info') return (result.origin_asns || []).filter(Number.isInteger);
    if (payload.adapter === 'prefix_overview') return (result.origin_asns || []).map((item) => item.asn).filter(Number.isInteger);
    if (payload.adapter === 'rpki_validation') return result.asn ? [Number(result.asn)] : [];
    return [];
  }

  function synchronizeAvailability() {
    const disabled = !state.protected || Boolean(state.controller);
    ['routingOrigin', 'routingPrefixes', 'routingVisibility', 'routingRpki'].forEach((id) => {
      const control = document.getElementById(id);
      if (control) control.disabled = disabled;
    });
    const cancel = document.getElementById('routingCancel');
    if (cancel) cancel.disabled = !state.controller;
    if (!state.protected) setStatus('Routing lookups require the protected FastAPI origin.', 'warn');
    synchronizeSaveButton();
  }

  function synchronizeSaveButton() {
    const save = document.getElementById('routingSave');
    if (!save) return;
    const duplicateVisible = !document.getElementById('routingDuplicate').hidden;
    const acknowledged = document.getElementById('routingDuplicateReview').checked;
    save.disabled = !state.protected
      || !selectedCaseId()
      || !state.observation
      || state.saving
      || (duplicateVisible && !acknowledged);
    renderDisclosure();
    if (state.payload) renderSuggestion(state.payload);
  }

  function setBusy(busy) {
    ['routingOrigin', 'routingPrefixes', 'routingVisibility', 'routingRpki'].forEach((id) => {
      const control = document.getElementById(id);
      if (control) control.disabled = busy || !state.protected;
    });
    const cancel = document.getElementById('routingCancel');
    if (cancel) cancel.disabled = !busy;
  }

  function setSaveLocked(locked) {
    const caseSelect = document.querySelector('.cmx-case-context-select');
    const resource = document.getElementById('routingResource');
    const asn = document.getElementById('routingAsn');
    if (caseSelect) caseSelect.disabled = locked;
    if (resource) resource.disabled = locked;
    if (asn) asn.disabled = locked;
  }

  function clearDuplicate() {
    const duplicate = document.getElementById('routingDuplicate');
    if (duplicate) duplicate.hidden = true;
    const check = document.getElementById('routingDuplicateReview');
    if (check) check.checked = false;
    const text = document.getElementById('routingDuplicateText');
    if (text) text.textContent = '';
  }

  function hideResult() {
    document.getElementById('routingResult')?.classList.add('osint-hidden');
    document.getElementById('routingSaveBox')?.classList.add('osint-hidden');
  }

  function selectedCaseId() {
    return document.querySelector('.cmx-case-context-select')?.value || '';
  }

  function setStatus(message, tone = '') {
    const status = document.getElementById('routingStatus');
    if (!status) return;
    status.className = `osint-routing-status${tone ? ` ${tone}` : ''}`;
    status.textContent = message;
  }

  function field(labelText, control) {
    const label = document.createElement('label');
    label.className = 'cmx-field';
    const text = document.createElement('span');
    text.textContent = labelText;
    label.append(text, control);
    return label;
  }

  function input(id, placeholder) {
    const element = document.createElement('input');
    element.id = id;
    element.className = 'cmx-input';
    element.autocomplete = 'off';
    element.spellcheck = false;
    element.placeholder = placeholder;
    return element;
  }

  function button(id, label, tone = '', disabled = false) {
    const element = document.createElement('button');
    element.type = 'button';
    element.id = id;
    element.className = `cmx-button${tone ? ` ${tone}` : ''}`;
    element.textContent = label;
    element.disabled = disabled;
    return element;
  }

  function provenanceItem(label, value) {
    const item = document.createElement('div');
    const strong = document.createElement('strong');
    strong.textContent = label;
    const span = document.createElement('span');
    span.textContent = String(value);
    item.append(strong, span);
    return item;
  }

  function recordCard(title, copy) {
    const item = document.createElement('article');
    item.className = 'osint-routing-record';
    const heading = document.createElement('strong');
    heading.textContent = title;
    const paragraph = document.createElement('p');
    paragraph.textContent = copy;
    item.append(heading, paragraph);
    return item;
  }

  function displayValue(value) {
    if (Array.isArray(value)) return value.length ? value.map((item) => typeof item === 'object' ? JSON.stringify(item) : String(item)).join(' · ') : 'None returned';
    if (value && typeof value === 'object') return JSON.stringify(value);
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (value === null || value === undefined || value === '') return 'Not provided';
    return String(value);
  }

  function humanize(value) {
    return String(value).replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  function formatTime(value) {
    const parsed = new Date(value || 0);
    return Number.isFinite(parsed.getTime()) ? parsed.toLocaleString() : String(value || 'Unknown time');
  }

  async function responseError(response, fallback) {
    try {
      const payload = await response.json();
      const detail = typeof payload.detail === 'string' ? payload.detail : JSON.stringify(payload.detail || {});
      return new Error(`${fallback}: ${detail || `HTTP ${response.status}`}`);
    } catch {
      return new Error(`${fallback}: HTTP ${response.status}`);
    }
  }
})();
