(() => {
  'use strict';

  const MAX_BOOT_ATTEMPTS = 120;
  const CONFIDENCE_LEVELS = ['unrated', 'low', 'limited', 'medium', 'strong', 'high', 'confirmed'];
  const ENDPOINTS = {
    source: 'sources',
    finding: 'observations',
    query: 'queries'
  };
  const RECORD_COLLECTIONS = {
    source: 'sources',
    finding: 'observations',
    query: 'queries'
  };

  const state = {
    activeCaseId: '',
    backend: false,
    caseDetail: null,
    caseDetailId: '',
    kind: 'source',
    saving: false,
    detailRequest: 0,
    duplicateSignature: '',
    bootAttempts: 0
  };

  let ui = null;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }

  function boot() {
    const context = document.querySelector('.cmx-case-context');
    const controls = context?.querySelector('.cmx-case-context-controls');
    const caseSelect = context?.querySelector('.cmx-case-context-select');
    const badge = context?.querySelector('.cmx-case-context-badge');

    if (!context || !controls || !caseSelect || !badge) {
      state.bootAttempts += 1;
      if (state.bootAttempts < MAX_BOOT_ATTEMPTS) window.setTimeout(boot, 25);
      return;
    }
    if (document.getElementById('cmxCaptureDrawer')) return;

    ui = buildCaptureUi(context, controls, caseSelect, badge);
    bindCaptureUi();
    observeContext();
    syncContext(true);
  }

  function buildCaptureUi(context, controls, caseSelect, badge) {
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.id = 'cmxCaptureToggle';
    toggle.className = 'cmx-case-context-button quiet';
    toggle.textContent = 'Capture record';
    toggle.disabled = true;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', 'cmxCaptureDrawer');
    controls.appendChild(toggle);

    const drawer = document.createElement('section');
    drawer.id = 'cmxCaptureDrawer';
    drawer.className = 'cmx-case-capture';
    drawer.hidden = true;
    drawer.setAttribute('aria-label', 'Direct case capture');

    const head = document.createElement('div');
    head.className = 'cmx-case-capture-head';
    const headCopy = document.createElement('div');
    const title = document.createElement('h2');
    title.textContent = 'Direct case capture';
    const intro = document.createElement('p');
    intro.textContent = 'Write one source, finding, or query-provenance record to the selected case. The browser will not fetch, archive, screenshot, or copy third-party page contents.';
    headCopy.append(title, intro);
    const close = document.createElement('button');
    close.type = 'button';
    close.id = 'cmxCaptureClose';
    close.className = 'cmx-case-context-button quiet';
    close.textContent = 'Close';
    head.append(headCopy, close);

    const selectorRow = document.createElement('div');
    selectorRow.className = 'cmx-case-capture-selector';
    const kind = createSelect('cmxCaptureKind', [
      ['source', 'Source registration'],
      ['finding', 'Finding or observation'],
      ['query', 'Query result provenance']
    ]);
    selectorRow.append(
      field('Record type', kind),
      infoField('Selected case', 'cmxCaptureTarget', 'No case selected')
    );

    const form = document.createElement('div');
    form.id = 'cmxCaptureForm';
    form.className = 'cmx-case-capture-form';

    const disclosureSection = document.createElement('section');
    disclosureSection.className = 'cmx-case-capture-disclosure';
    const disclosureTitle = document.createElement('h3');
    disclosureTitle.textContent = 'Fields that will enter the case';
    const disclosureCopy = document.createElement('p');
    disclosureCopy.textContent = 'Only the values displayed below are submitted. Empty optional fields remain empty.';
    const disclosure = document.createElement('dl');
    disclosure.id = 'cmxCaptureDisclosure';
    disclosureSection.append(disclosureTitle, disclosureCopy, disclosure);

    const duplicate = document.createElement('div');
    duplicate.id = 'cmxCaptureDuplicate';
    duplicate.className = 'cmx-case-capture-duplicate';
    duplicate.hidden = true;
    const duplicateText = document.createElement('p');
    duplicateText.id = 'cmxCaptureDuplicateText';
    const duplicateLabel = document.createElement('label');
    duplicateLabel.className = 'cmx-case-capture-review';
    const duplicateReview = document.createElement('input');
    duplicateReview.id = 'cmxCaptureDuplicateReview';
    duplicateReview.type = 'checkbox';
    const duplicateReviewText = document.createElement('span');
    duplicateReviewText.textContent = 'I reviewed the possible duplicate and still want to create another record.';
    duplicateLabel.append(duplicateReview, duplicateReviewText);
    duplicate.append(duplicateText, duplicateLabel);

    const actions = document.createElement('div');
    actions.className = 'cmx-case-capture-actions';
    const save = document.createElement('button');
    save.type = 'button';
    save.id = 'cmxCaptureSave';
    save.className = 'cmx-case-context-button primary';
    save.textContent = 'Save source';
    save.disabled = true;
    const clear = document.createElement('button');
    clear.type = 'button';
    clear.id = 'cmxCaptureClear';
    clear.className = 'cmx-case-context-button quiet';
    clear.textContent = 'Clear fields';
    actions.append(save, clear);

    const status = document.createElement('p');
    status.id = 'cmxCaptureStatus';
    status.className = 'cmx-case-capture-status';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    status.textContent = 'Select an active case, then enter one record.';

    drawer.append(head, selectorRow, form, disclosureSection, duplicate, actions, status);
    context.appendChild(drawer);

    return {
      context,
      controls,
      caseSelect,
      badge,
      toggle,
      drawer,
      close,
      kind,
      target: drawer.querySelector('#cmxCaptureTarget'),
      form,
      disclosure,
      duplicate,
      duplicateText,
      duplicateReview,
      save,
      clear,
      status,
      fields: {}
    };
  }

  function bindCaptureUi() {
    ui.toggle.addEventListener('click', toggleDrawer);
    ui.close.addEventListener('click', closeDrawer);
    ui.kind.addEventListener('change', () => {
      state.kind = ui.kind.value;
      renderForm();
      setStatus(defaultStatus(), '');
    });
    ui.clear.addEventListener('click', () => {
      renderForm();
      setStatus('Capture fields cleared. Nothing was written.', '');
    });
    ui.save.addEventListener('click', saveCapture);
    ui.duplicateReview.addEventListener('change', updateSaveState);
    ui.caseSelect.addEventListener('change', () => syncContext(false));

    ui.drawer.addEventListener('input', (event) => {
      if (event.target === ui.duplicateReview) return;
      clearDuplicateReview();
      renderDisclosure();
      updateSaveState();
    });
    ui.drawer.addEventListener('change', (event) => {
      if (event.target === ui.kind || event.target === ui.duplicateReview) return;
      clearDuplicateReview();
      renderDisclosure();
      updateSaveState();
    });

    renderForm();
  }

  function observeContext() {
    const observer = new MutationObserver(() => syncContext(false));
    observer.observe(ui.caseSelect, { attributes: true, childList: true, subtree: true });
    observer.observe(ui.badge, { attributes: true, childList: true, characterData: true, subtree: true });
  }

  function syncContext(initial) {
    const nextBackend = ui.badge.classList.contains('protected');
    const nextCaseId = nextBackend ? ui.caseSelect.value : '';
    const caseChanged = nextCaseId !== state.activeCaseId;

    state.backend = nextBackend;
    state.activeCaseId = nextCaseId;
    ui.toggle.disabled = !state.backend || !state.activeCaseId;
    ui.target.textContent = selectedCaseLabel();

    if (caseChanged) {
      state.caseDetail = null;
      state.caseDetailId = '';
      state.duplicateSignature = '';
      clearDuplicateReview();
      renderForm();
      if (!initial && !ui.drawer.hidden) {
        setStatus(state.activeCaseId
          ? 'Active case changed. Capture fields were cleared before loading the new case.'
          : 'No active case is selected. Capture is disabled.', '');
      }
      if (!ui.drawer.hidden && state.activeCaseId) loadCaseDetail(false);
    }

    if (!state.backend || !state.activeCaseId) closeDrawer();
    updateSaveState();
  }

  function toggleDrawer() {
    if (ui.toggle.disabled) return;
    if (ui.drawer.hidden) openDrawer();
    else closeDrawer();
  }

  function openDrawer() {
    if (!state.backend || !state.activeCaseId) return;
    ui.drawer.hidden = false;
    ui.toggle.textContent = 'Close capture';
    ui.toggle.setAttribute('aria-expanded', 'true');
    loadCaseDetail(false);
    ui.kind.focus();
  }

  function closeDrawer() {
    if (!ui) return;
    ui.drawer.hidden = true;
    ui.toggle.textContent = 'Capture record';
    ui.toggle.setAttribute('aria-expanded', 'false');
  }

  function renderForm() {
    if (!ui) return;
    ui.form.replaceChildren();
    ui.fields = {};
    clearDuplicateReview();

    if (state.kind === 'source') renderSourceForm();
    else if (state.kind === 'finding') renderFindingForm();
    else renderQueryForm();

    renderDisclosure();
    updateSaveState();
  }

  function renderSourceForm() {
    const label = createInput('cmxCaptureSourceLabel', 'text', 300, 'Source title or neutral reference');
    const url = createInput('cmxCaptureSourceUrl', 'url', 2000, 'https://example.com/page');
    const type = createSelect('cmxCaptureSourceType', [
      ['web', 'Web page'],
      ['official', 'Official source'],
      ['document', 'Document'],
      ['database', 'Database'],
      ['social', 'Social platform'],
      ['person', 'Person or interview'],
      ['other', 'Other']
    ]);
    const accessedAt = createInput('cmxCaptureAccessedAt', 'datetime-local', 0, '');
    const notes = createTextarea('cmxCaptureSourceNotes', 10000, 'Reliability, access limits, relevant section, or handling notes');

    ui.fields = { label, url, type, accessedAt, notes };
    ui.form.append(
      field('Source label', label, 'Required. Use a neutral internal label.'),
      field('Source URL', url, 'Optional. Only HTTP and HTTPS URLs are accepted.'),
      field('Source type', type),
      field('Accessed at', accessedAt),
      field('Source notes', notes, 'Optional. This text enters the case record.')
    );
  }

  function renderFindingForm() {
    const kind = createInput('cmxCaptureFindingKind', 'text', 80, 'finding');
    kind.value = 'finding';
    kind.pattern = '[a-z0-9_-]+';
    const value = createTextarea('cmxCaptureFindingValue', 20000, 'State the observed value or finding without adding unsupported conclusions');
    const entity = referenceSelect('cmxCaptureFindingEntity', 'No linked entity', state.caseDetail?.entities || [], entityLabel);
    const source = referenceSelect('cmxCaptureFindingSource', 'No linked source', state.caseDetail?.sources || [], sourceLabel);
    const confidence = createSelect('cmxCaptureFindingConfidence', CONFIDENCE_LEVELS.map((item) => [item, titleCase(item)]));
    const observedAt = createInput('cmxCaptureObservedAt', 'datetime-local', 0, '');
    const note = createTextarea('cmxCaptureFindingNote', 20000, 'Context, limitation, contradiction, or analyst note');

    ui.fields = { kind, value, entity, source, confidence, observedAt, note };
    ui.form.append(
      field('Finding type', kind, 'Required lowercase identifier such as finding, fact, lead, or observation.'),
      field('Observed value', value, 'Required. Keep fact and interpretation separate.'),
      field('Linked entity', entity),
      field('Linked source', source),
      field('Confidence', confidence),
      field('Observed at', observedAt),
      field('Analyst note', note, 'Optional. Record limitations and provenance here.')
    );
  }

  function renderQueryForm() {
    const provider = createInput('cmxCaptureQueryProvider', 'text', 120, 'Google, Bing, GitHub, internal index');
    const queryText = createTextarea('cmxCaptureQueryText', 20000, 'Exact query or lookup expression');
    const resultUrl = createInput('cmxCaptureQueryUrl', 'url', 4000, 'https://provider.example/search?...');
    const purpose = createTextarea('cmxCaptureQueryPurpose', 4000, 'Why this query was executed and what it was intended to test');
    const entity = referenceSelect('cmxCaptureQueryEntity', 'No linked entity', state.caseDetail?.entities || [], entityLabel);
    const executedAt = createInput('cmxCaptureExecutedAt', 'datetime-local', 0, '');

    ui.fields = { provider, queryText, resultUrl, purpose, entity, executedAt };
    ui.form.append(
      field('Provider', provider, 'Required. Name the service or index used.'),
      field('Exact query', queryText, 'Required. The query text enters the case.'),
      field('Result URL', resultUrl, 'Optional. This records provenance only and does not fetch the page.'),
      field('Purpose', purpose),
      field('Linked entity', entity),
      field('Executed at', executedAt)
    );
  }

  function refreshReferenceOptions() {
    if (!ui || state.kind === 'source') return;
    if (state.kind === 'finding') {
      replaceReferenceOptions(ui.fields.entity, 'No linked entity', state.caseDetail?.entities || [], entityLabel);
      replaceReferenceOptions(ui.fields.source, 'No linked source', state.caseDetail?.sources || [], sourceLabel);
    } else {
      replaceReferenceOptions(ui.fields.entity, 'No linked entity', state.caseDetail?.entities || [], entityLabel);
    }
    renderDisclosure();
  }

  async function loadCaseDetail(force) {
    const caseId = state.activeCaseId;
    if (!state.backend || !caseId) return null;
    if (!force && state.caseDetail && state.caseDetailId === caseId) return state.caseDetail;

    const requestId = ++state.detailRequest;
    setStatus('Loading case references and duplicate checks…', 'pending');
    try {
      const response = await fetch(`/api/cases/${encodeURIComponent(caseId)}`, {
        credentials: 'same-origin',
        cache: 'no-store',
        headers: { accept: 'application/json' }
      });
      if (!response.ok) throw await responseError(response, 'Case detail could not be loaded');
      const detail = await response.json();
      if (requestId !== state.detailRequest || caseId !== state.activeCaseId) return null;
      state.caseDetail = detail;
      state.caseDetailId = caseId;
      refreshReferenceOptions();
      setStatus(defaultStatus(), '');
      return detail;
    } catch (error) {
      if (requestId !== state.detailRequest) return null;
      state.caseDetail = null;
      state.caseDetailId = '';
      setStatus(error instanceof Error ? error.message : 'Case detail could not be loaded.', 'failed');
      throw error;
    }
  }

  async function saveCapture() {
    if (!state.backend || !state.activeCaseId || state.saving) return;

    const kind = state.kind;
    const caseId = state.activeCaseId;
    const draft = readDraft();
    const validationError = validateDraft(draft);
    if (validationError) {
      setStatus(validationError, 'failed');
      updateSaveState();
      return;
    }

    state.saving = true;
    updateSaveState();
    setStatus('Checking the latest case records for exact duplicates…', 'pending');

    try {
      const detail = await loadCaseDetail(true);
      if (!detail) throw new Error('The latest case detail was not available for duplicate review.');

      if (caseId !== state.activeCaseId || kind !== state.kind) throw new Error('Capture context changed before the write. Review the selected case and fields, then save again.');

      const duplicate = findDuplicate(kind, draft.payload, detail);
      const duplicateSignature = duplicate
        ? JSON.stringify([kind, draft.payload, duplicate.id || duplicate.label || duplicate.value_text || duplicate.query_text || 'duplicate'])
        : '';

      if (duplicate && (state.duplicateSignature !== duplicateSignature || !ui.duplicateReview.checked)) {
        state.duplicateSignature = duplicateSignature;
        showDuplicateWarning(kind, duplicate);
        setStatus('Potential duplicate found. Review the existing record and confirm before writing another.', 'warning');
        return;
      }

      clearDuplicateReview();
      setStatus(`Saving one ${recordName(kind)} record in a protected case transaction…`, 'pending');
      const saved = await postJson(
        `/api/cases/${encodeURIComponent(caseId)}/${ENDPOINTS[kind]}`,
        draft.payload,
        `${titleCase(recordName(kind))} could not be saved`
      );
      if (caseId !== state.activeCaseId || kind !== state.kind) throw new Error('Capture context changed after the write. Open the selected case to review the saved record.');
      appendSavedRecord(kind, saved);
      const savedLabel = savedRecordLabel(kind, saved);
      renderForm();
      setStatus(`Saved ${savedLabel} to ${selectedCaseLabel()}.`, 'saved');
      document.dispatchEvent(new CustomEvent('cmx-case-record-saved', {
        detail: {
          caseId,
          kind,
          recordId: saved.id || ''
        }
      }));
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'The record could not be saved.', 'failed');
    } finally {
      state.saving = false;
      updateSaveState();
    }
  }

  function readDraft() {
    if (state.kind === 'source') {
      const payload = {
        label: ui.fields.label.value.trim().slice(0, 300),
        source_type: ui.fields.type.value,
        url: ui.fields.url.value.trim().slice(0, 2000),
        notes: ui.fields.notes.value.trim().slice(0, 10000)
      };
      const accessedAt = isoDate(ui.fields.accessedAt.value);
      if (accessedAt) payload.accessed_at = accessedAt;
      return { payload };
    }

    if (state.kind === 'finding') {
      const payload = {
        kind: ui.fields.kind.value.trim().toLowerCase().slice(0, 80),
        value_text: ui.fields.value.value.trim().slice(0, 20000),
        note: ui.fields.note.value.trim().slice(0, 20000),
        confidence: ui.fields.confidence.value
      };
      if (ui.fields.entity.value) payload.entity_id = ui.fields.entity.value;
      if (ui.fields.source.value) payload.source_id = ui.fields.source.value;
      const observedAt = isoDate(ui.fields.observedAt.value);
      if (observedAt) payload.observed_at = observedAt;
      return { payload };
    }

    const payload = {
      provider: ui.fields.provider.value.trim().slice(0, 120),
      query_text: ui.fields.queryText.value.trim().slice(0, 20000),
      result_url: ui.fields.resultUrl.value.trim().slice(0, 4000),
      purpose: ui.fields.purpose.value.trim().slice(0, 4000)
    };
    if (ui.fields.entity.value) payload.entity_id = ui.fields.entity.value;
    const executedAt = isoDate(ui.fields.executedAt.value);
    if (executedAt) payload.executed_at = executedAt;
    return { payload };
  }

  function validateDraft(draft) {
    const payload = draft.payload;
    if (state.kind === 'source') {
      if (!payload.label) return 'Add a source label before saving.';
      if (payload.url && !isSafeHttpUrl(payload.url)) return 'Source URLs must use HTTP or HTTPS.';
      return '';
    }
    if (state.kind === 'finding') {
      if (!/^[a-z0-9_-]+$/.test(payload.kind)) return 'Finding type must use lowercase letters, numbers, underscores, or hyphens.';
      if (!payload.value_text) return 'Add the observed value or finding before saving.';
      if (!CONFIDENCE_LEVELS.includes(payload.confidence)) return 'Choose a supported confidence level.';
      return '';
    }
    if (!payload.provider) return 'Add the query provider before saving.';
    if (!payload.query_text) return 'Add the exact query before saving.';
    if (payload.result_url && !isSafeHttpUrl(payload.result_url)) return 'Result URLs must use HTTP or HTTPS.';
    return '';
  }

  function findDuplicate(kind, payload, detail) {
    if (kind === 'source') {
      const url = normalizeText(payload.url);
      const label = normalizeText(payload.label);
      return (detail.sources || []).find((record) => {
        if (url) return normalizeText(record.url) === url;
        return !record.url
          && normalizeText(record.label) === label
          && normalizeText(record.source_type) === normalizeText(payload.source_type);
      }) || null;
    }

    if (kind === 'finding') {
      return (detail.observations || []).find((record) =>
        normalizeText(record.kind) === normalizeText(payload.kind)
        && normalizeText(record.value_text) === normalizeText(payload.value_text)
        && String(record.entity_id || '') === String(payload.entity_id || '')
        && String(record.source_id || '') === String(payload.source_id || '')
      ) || null;
    }

    return (detail.queries || []).find((record) =>
      normalizeText(record.provider) === normalizeText(payload.provider)
      && normalizeText(record.query_text) === normalizeText(payload.query_text)
      && normalizeText(record.result_url) === normalizeText(payload.result_url)
      && String(record.entity_id || '') === String(payload.entity_id || '')
    ) || null;
  }

  function showDuplicateWarning(kind, record) {
    ui.duplicate.hidden = false;
    ui.duplicateReview.checked = false;
    ui.duplicateText.textContent = duplicateDescription(kind, record);
    updateSaveState();
  }

  function clearDuplicateReview() {
    if (!ui) return;
    state.duplicateSignature = '';
    ui.duplicate.hidden = true;
    ui.duplicateReview.checked = false;
    ui.duplicateText.textContent = '';
  }

  function duplicateDescription(kind, record) {
    if (kind === 'source') {
      return record.url
        ? `An existing source already uses this URL: ${truncate(record.label || record.url, 240)}`
        : `An existing source already uses this label and source type: ${truncate(record.label, 240)}`;
    }
    if (kind === 'finding') {
      return `An existing ${record.kind || 'observation'} record has the same value and linked references: ${truncate(record.value_text, 240)}`;
    }
    return `An existing query record has the same provider, query, result URL, and linked entity: ${truncate(record.query_text, 240)}`;
  }

  function renderDisclosure() {
    if (!ui || !ui.fields) return;
    const rows = disclosureRows();
    ui.disclosure.replaceChildren();
    rows.forEach(([label, value]) => {
      const term = document.createElement('dt');
      term.textContent = label;
      const description = document.createElement('dd');
      description.textContent = truncate(value || 'Not provided', 500);
      ui.disclosure.append(term, description);
    });
  }

  function disclosureRows() {
    if (!ui.fields || !Object.keys(ui.fields).length) return [['Record', 'No fields loaded']];
    const draft = readDraft().payload;
    const caseLabel = selectedCaseLabel();

    if (state.kind === 'source') {
      return [
        ['Active case', caseLabel],
        ['Source label', draft.label],
        ['Source URL', draft.url],
        ['Source type', draft.source_type],
        ['Accessed at', draft.accessed_at || 'Not provided'],
        ['Source notes', draft.notes]
      ];
    }
    if (state.kind === 'finding') {
      return [
        ['Active case', caseLabel],
        ['Finding type', draft.kind],
        ['Observed value', draft.value_text],
        ['Linked entity ID', draft.entity_id || 'Not provided'],
        ['Linked source ID', draft.source_id || 'Not provided'],
        ['Confidence', draft.confidence],
        ['Observed at', draft.observed_at || 'Not provided'],
        ['Analyst note', draft.note]
      ];
    }
    return [
      ['Active case', caseLabel],
      ['Provider', draft.provider],
      ['Exact query', draft.query_text],
      ['Result URL', draft.result_url],
      ['Purpose', draft.purpose],
      ['Linked entity ID', draft.entity_id || 'Not provided'],
      ['Executed at', draft.executed_at || 'Not provided']
    ];
  }

  function updateSaveState() {
    if (!ui) return;
    ui.toggle.disabled = !state.backend || !state.activeCaseId;
    ui.target.textContent = selectedCaseLabel();
    ui.save.textContent = state.saving ? 'Saving…' : `Save ${recordName(state.kind)}`;

    let ready = false;
    try {
      ready = !validateDraft(readDraft());
    } catch {
      ready = false;
    }
    const duplicateNeedsReview = !ui.duplicate.hidden && !ui.duplicateReview.checked;
    ui.kind.disabled = state.saving;
    ui.clear.disabled = state.saving;
    ui.duplicateReview.disabled = state.saving;
    Object.values(ui.fields || {}).forEach((control) => {
      control.disabled = state.saving;
    });
    ui.save.disabled = !state.backend
      || !state.activeCaseId
      || !ready
      || state.saving
      || duplicateNeedsReview;
  }

  function appendSavedRecord(kind, record) {
    if (!state.caseDetail || state.caseDetailId !== state.activeCaseId) return;
    const collection = RECORD_COLLECTIONS[kind];
    if (!Array.isArray(state.caseDetail[collection])) state.caseDetail[collection] = [];
    state.caseDetail[collection].unshift(record);
    refreshReferenceOptions();
  }

  function selectedCaseLabel() {
    const selected = ui?.caseSelect?.selectedOptions?.[0];
    return state.activeCaseId && selected
      ? selected.textContent || state.activeCaseId
      : 'No case selected';
  }

  function defaultStatus() {
    if (!state.backend) return 'Protected case persistence is unavailable on this hostname.';
    if (!state.activeCaseId) return 'Select an active case before capturing a record.';
    return 'No record is written until you press the save button.';
  }

  function setStatus(message, tone) {
    if (!ui) return;
    ui.status.className = 'cmx-case-capture-status';
    if (tone) ui.status.classList.add(tone);
    ui.status.textContent = message;
  }

  function recordName(kind) {
    if (kind === 'finding') return 'finding';
    return kind;
  }

  function savedRecordLabel(kind, record) {
    if (kind === 'source') return `source “${truncate(record.label, 120)}”`;
    if (kind === 'finding') return `${record.kind || 'finding'} “${truncate(record.value_text, 120)}”`;
    return `query “${truncate(record.query_text, 120)}”`;
  }

  function createInput(id, type, maxLength, placeholder) {
    const input = document.createElement('input');
    input.id = id;
    input.type = type;
    input.className = 'cmx-case-capture-input';
    if (maxLength) input.maxLength = maxLength;
    if (placeholder) input.placeholder = placeholder;
    input.autocomplete = 'off';
    return input;
  }

  function createTextarea(id, maxLength, placeholder) {
    const textarea = document.createElement('textarea');
    textarea.id = id;
    textarea.className = 'cmx-case-capture-textarea';
    textarea.maxLength = maxLength;
    textarea.placeholder = placeholder;
    return textarea;
  }

  function createSelect(id, entries) {
    const select = document.createElement('select');
    select.id = id;
    select.className = 'cmx-case-capture-select';
    entries.forEach(([value, label]) => select.appendChild(option(value, label)));
    return select;
  }

  function referenceSelect(id, placeholder, records, labeler) {
    const select = document.createElement('select');
    select.id = id;
    select.className = 'cmx-case-capture-select';
    replaceReferenceOptions(select, placeholder, records, labeler);
    return select;
  }

  function replaceReferenceOptions(select, placeholder, records, labeler) {
    if (!select) return;
    const current = select.value;
    select.replaceChildren(option('', placeholder));
    records.forEach((record) => select.appendChild(option(record.id, labeler(record))));
    if (current && records.some((record) => record.id === current)) select.value = current;
  }

  function field(labelText, control, helpText = '') {
    const label = document.createElement('label');
    label.className = 'cmx-case-capture-field';
    const title = document.createElement('span');
    title.textContent = labelText;
    label.append(title, control);
    if (helpText) {
      const help = document.createElement('small');
      help.textContent = helpText;
      label.appendChild(help);
    }
    return label;
  }

  function infoField(labelText, id, value) {
    const wrapper = document.createElement('div');
    wrapper.className = 'cmx-case-capture-field';
    const title = document.createElement('span');
    title.textContent = labelText;
    const output = document.createElement('output');
    output.id = id;
    output.className = 'cmx-case-capture-output';
    output.textContent = value;
    wrapper.append(title, output);
    return wrapper;
  }

  function option(value, label) {
    const item = document.createElement('option');
    item.value = value;
    item.textContent = label;
    return item;
  }

  function entityLabel(record) {
    return `${record.entity_type || 'entity'} · ${truncate(record.display_value || record.normalized_value || record.id, 160)}`;
  }

  function sourceLabel(record) {
    return `${record.source_type || 'source'} · ${truncate(record.label || record.url || record.id, 160)}`;
  }

  async function postJson(path, payload, fallback) {
    const response = await fetch(path, {
      method: 'POST',
      credentials: 'same-origin',
      cache: 'no-store',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw await responseError(response, fallback);
    return response.json();
  }

  async function responseError(response, fallback) {
    try {
      const payload = await response.json();
      const detail = typeof payload.detail === 'string'
        ? payload.detail
        : JSON.stringify(payload.detail || {});
      return new Error(`${fallback}: ${detail || `HTTP ${response.status}`}`);
    } catch {
      return new Error(`${fallback}: HTTP ${response.status}`);
    }
  }

  function isSafeHttpUrl(value) {
    try {
      const url = new URL(value);
      return url.protocol === 'https:' || url.protocol === 'http:';
    } catch {
      return false;
    }
  }

  function isoDate(value) {
    if (!value) return '';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? '' : date.toISOString();
  }

  function normalizeText(value) {
    return String(value || '').trim().replace(/\s+/g, ' ').toLowerCase();
  }

  function truncate(value, limit) {
    const text = String(value || '');
    return text.length > limit ? `${text.slice(0, limit - 1)}…` : text;
  }

  function titleCase(value) {
    return String(value || '')
      .replace(/[-_]+/g, ' ')
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }
})();
