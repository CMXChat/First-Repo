(() => {
  'use strict';

  const $ = (selector) => document.querySelector(selector);
  const state = {
    caseInfo: null,
    facts: [],
    leads: [],
    sources: [],
    timeline: []
  };

  const els = {
    session: $('#sessionId'),
    caseId: $('#caseId'),
    subject: $('#subjectLabel'),
    urgency: $('#urgency'),
    officialStatus: $('#officialStatus'),
    authorization: $('#authorizationBasis'),
    lastSeenAt: $('#lastSeenAt'),
    lastSeenLocation: $('#lastSeenLocation'),
    coordinator: $('#caseCoordinator'),
    saveCase: $('#saveCase'),
    clearCase: $('#clearCase'),
    summaryEmpty: $('#caseSummaryEmpty'),
    summary: $('#caseSummary'),
    sumId: $('#sumCaseId'),
    sumSubject: $('#sumSubject'),
    sumUrgency: $('#sumUrgency'),
    sumOfficial: $('#sumOfficial'),
    sumLastSeen: $('#sumLastSeen'),
    sumLocation: $('#sumLocation'),
    factText: $('#factText'),
    factSource: $('#factSource'),
    factConfidence: $('#factConfidence'),
    addFact: $('#addFact'),
    facts: $('#factList'),
    factEmpty: $('#factEmpty'),
    leadText: $('#leadText'),
    leadSource: $('#leadSource'),
    leadStatus: $('#leadStatus'),
    addLead: $('#addLead'),
    leads: $('#leadList'),
    leadEmpty: $('#leadEmpty'),
    sourceLabel: $('#sourceLabel'),
    sourceUrl: $('#sourceUrl'),
    sourceNotes: $('#sourceNotes'),
    addSource: $('#addSource'),
    sources: $('#sourceList'),
    sourceEmpty: $('#sourceEmpty'),
    eventAt: $('#eventAt'),
    eventLocation: $('#eventLocation'),
    eventDescription: $('#eventDescription'),
    eventSource: $('#eventSource'),
    addEvent: $('#addEvent'),
    timeline: $('#timelineList'),
    timelineEmpty: $('#timelineEmpty'),
    copy: $('#copyCase'),
    export: $('#exportCase'),
    report: $('#exportReport'),
    clearRecords: $('#clearRecords'),
    json: $('#caseJson'),
    searchTool: $('#searchTool'),
    osintTool: $('#osintTool'),
    metadataTool: $('#metadataTool'),
    resourcesTool: $('#resourcesTool'),
    toast: $('#toast')
  };

  init();

  function init() {
    els.session.textContent = randomId();
    els.caseId.value = `CMX-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${randomId().slice(0, 4)}`;
    els.saveCase.addEventListener('click', saveCaseInfo);
    els.clearCase.addEventListener('click', clearCaseInfo);
    els.addFact.addEventListener('click', addFact);
    els.addLead.addEventListener('click', addLead);
    els.addSource.addEventListener('click', addSource);
    els.addEvent.addEventListener('click', addTimelineEvent);
    els.copy.addEventListener('click', () => copyText(JSON.stringify(payload(), null, 2), 'Case JSON copied.'));
    els.export.addEventListener('click', exportJson);
    els.report.addEventListener('click', exportReport);
    els.clearRecords.addEventListener('click', clearRecords);
    document.querySelectorAll('[data-checklist]').forEach((input) => input.addEventListener('change', updateJson));
    renderAll();
  }

  function saveCaseInfo() {
    const subject = els.subject.value.trim().slice(0, 200);
    const authorization = els.authorization.value.trim().slice(0, 1000);
    if (!subject) return toast('Add a minimal case label or subject reference.');
    if (!authorization) return toast('Record the authorization or legitimate basis for the work.');

    state.caseInfo = {
      caseId: els.caseId.value.trim().slice(0, 100) || `CMX-${randomId()}`,
      subjectLabel: subject,
      urgency: els.urgency.value,
      officialReportStatus: els.officialStatus.value,
      authorizationBasis: authorization,
      lastSeenAt: els.lastSeenAt.value || '',
      lastSeenLocation: els.lastSeenLocation.value.trim().slice(0, 300),
      coordinator: els.coordinator.value.trim().slice(0, 300),
      createdAt: state.caseInfo?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    renderAll();
    toast('Case header saved in this browser tab.');
  }

  function clearCaseInfo() {
    if (state.caseInfo && !window.confirm('Clear the saved case header? Records will remain unless separately cleared.')) return;
    state.caseInfo = null;
    els.subject.value = '';
    els.authorization.value = '';
    els.lastSeenAt.value = '';
    els.lastSeenLocation.value = '';
    els.coordinator.value = '';
    els.urgency.value = 'standard';
    els.officialStatus.value = 'unknown';
    renderAll();
  }

  function addFact() {
    const text = els.factText.value.trim().slice(0, 2000);
    if (!text) return toast('Add the fact statement.');
    state.facts.unshift(record('fact', {
      text,
      sourceReference: els.factSource.value.trim().slice(0, 500),
      confidence: els.factConfidence.value
    }));
    state.facts = state.facts.slice(0, 250);
    els.factText.value = '';
    els.factSource.value = '';
    renderAll();
  }

  function addLead() {
    const text = els.leadText.value.trim().slice(0, 2000);
    if (!text) return toast('Add the lead or hypothesis.');
    state.leads.unshift(record('lead', {
      text,
      sourceReference: els.leadSource.value.trim().slice(0, 500),
      status: els.leadStatus.value
    }));
    state.leads = state.leads.slice(0, 250);
    els.leadText.value = '';
    els.leadSource.value = '';
    renderAll();
  }

  function addSource() {
    const label = els.sourceLabel.value.trim().slice(0, 300);
    const url = els.sourceUrl.value.trim().slice(0, 2000);
    const notes = els.sourceNotes.value.trim().slice(0, 2000);
    if (!label) return toast('Add a source label.');
    if (url && !safeHttpUrl(url)) return toast('Source URLs must use HTTP or HTTPS.');
    state.sources.unshift(record('source', {
      label,
      url,
      notes,
      accessedAt: new Date().toISOString()
    }));
    state.sources = state.sources.slice(0, 250);
    els.sourceLabel.value = '';
    els.sourceUrl.value = '';
    els.sourceNotes.value = '';
    renderAll();
  }

  function addTimelineEvent() {
    const description = els.eventDescription.value.trim().slice(0, 2000);
    if (!description) return toast('Add a timeline description.');
    state.timeline.push(record('timeline', {
      occurredAt: els.eventAt.value || '',
      location: els.eventLocation.value.trim().slice(0, 300),
      description,
      sourceReference: els.eventSource.value.trim().slice(0, 500)
    }));
    state.timeline = state.timeline.slice(0, 500).sort((a, b) => String(a.occurredAt).localeCompare(String(b.occurredAt)));
    els.eventAt.value = '';
    els.eventLocation.value = '';
    els.eventDescription.value = '';
    els.eventSource.value = '';
    renderAll();
  }

  function record(kind, fields) {
    return {
      id: crypto.randomUUID ? crypto.randomUUID() : randomId(),
      kind,
      recordedAt: new Date().toISOString(),
      ...fields
    };
  }

  function renderAll() {
    renderSummary();
    renderRecords(els.facts, els.factEmpty, state.facts, 'fact');
    renderRecords(els.leads, els.leadEmpty, state.leads, 'lead');
    renderRecords(els.sources, els.sourceEmpty, state.sources, 'source');
    renderRecords(els.timeline, els.timelineEmpty, state.timeline, 'timeline');
    updateLinks();
    updateJson();
  }

  function renderSummary() {
    const info = state.caseInfo;
    els.summaryEmpty.classList.toggle('missing-hidden', Boolean(info));
    els.summary.classList.toggle('missing-hidden', !info);
    if (!info) return;
    els.sumId.textContent = info.caseId;
    els.sumSubject.textContent = info.subjectLabel;
    els.sumUrgency.textContent = titleCase(info.urgency);
    els.sumOfficial.textContent = officialLabel(info.officialReportStatus);
    els.sumLastSeen.textContent = info.lastSeenAt ? new Date(info.lastSeenAt).toLocaleString() : 'Not recorded';
    els.sumLocation.textContent = info.lastSeenLocation || 'Not recorded';
  }

  function renderRecords(container, empty, records, kind) {
    container.replaceChildren();
    empty.classList.toggle('missing-hidden', records.length > 0);
    records.forEach((item) => container.appendChild(recordCard(item, kind)));
  }

  function recordCard(item, kind) {
    const card = document.createElement('article');
    card.className = 'missing-record';
    const content = document.createElement('div');
    const title = document.createElement('h3');
    const primary = primaryText(item, kind);
    title.textContent = primary.title;
    content.appendChild(title);
    primary.lines.forEach((line) => {
      if (!line) return;
      const paragraph = document.createElement('p');
      paragraph.textContent = line;
      content.appendChild(paragraph);
    });
    const meta = document.createElement('div');
    meta.className = 'missing-record-meta';
    const badge = document.createElement('span');
    badge.className = `missing-badge ${kind === 'timeline' ? 'source' : kind}`;
    badge.textContent = titleCase(kind);
    const timestamp = document.createElement('span');
    timestamp.className = 'missing-badge';
    timestamp.textContent = new Date(item.recordedAt).toLocaleString();
    meta.append(badge, timestamp);
    content.appendChild(meta);

    const actions = document.createElement('div');
    actions.appendChild(miniButton('Remove', () => removeRecord(kind, item.id)));
    card.append(content, actions);
    return card;
  }

  function primaryText(item, kind) {
    if (kind === 'fact') return {
      title: item.text,
      lines: [`Confidence: ${titleCase(item.confidence)}`, item.sourceReference ? `Source reference: ${item.sourceReference}` : 'Source reference not recorded']
    };
    if (kind === 'lead') return {
      title: item.text,
      lines: [`Status: ${titleCase(item.status.replace(/-/g, ' '))}`, item.sourceReference ? `Source reference: ${item.sourceReference}` : 'Source reference not recorded']
    };
    if (kind === 'source') return {
      title: item.label,
      lines: [item.url || 'No URL recorded', item.notes, `Accessed: ${new Date(item.accessedAt).toLocaleString()}`]
    };
    return {
      title: item.occurredAt ? new Date(item.occurredAt).toLocaleString() : 'Time not confirmed',
      lines: [item.description, item.location ? `Location: ${item.location}` : '', item.sourceReference ? `Source reference: ${item.sourceReference}` : 'Source reference not recorded']
    };
  }

  function removeRecord(kind, id) {
    const key = kind === 'timeline' ? 'timeline' : `${kind}s`;
    state[key] = state[key].filter((item) => item.id !== id);
    renderAll();
  }

  function clearRecords() {
    const count = state.facts.length + state.leads.length + state.sources.length + state.timeline.length;
    if (!count) return;
    if (!window.confirm(`Clear ${count} case record${count === 1 ? '' : 's'} from this tab?`)) return;
    state.facts = [];
    state.leads = [];
    state.sources = [];
    state.timeline = [];
    renderAll();
  }

  function checklist() {
    return [...document.querySelectorAll('[data-checklist]')].map((input) => ({
      id: input.dataset.checklist,
      label: input.closest('label')?.textContent.trim() || input.dataset.checklist,
      completed: input.checked
    }));
  }

  function payload() {
    return {
      schema: 'cmx-missing-case-v1',
      exportedAt: new Date().toISOString(),
      sessionId: els.session.textContent,
      case: state.caseInfo,
      officialFirstChecklist: checklist(),
      facts: state.facts,
      leads: state.leads,
      sources: state.sources,
      timeline: state.timeline,
      safeguards: {
        purposeLimitation: 'Use only for an authorized welfare, safety, legal, journalistic, or official-support purpose.',
        factLeadSeparation: true,
        publicDisclosureMinimized: true,
        minorsAndAbuseRisk: 'Do not publish sensitive locations, contacts, health details, or shelter information. Coordinate with the relevant authority or recognized organization.'
      }
    };
  }

  function updateJson() {
    els.json.textContent = JSON.stringify(payload(), null, 2);
  }

  function exportJson() {
    download(JSON.stringify(payload(), null, 2), `${fileBase()}.json`, 'application/json');
    toast('Case JSON exported.');
  }

  function exportReport() {
    download(buildReport(), `${fileBase()}-handoff.txt`, 'text/plain');
    toast('Handoff report exported.');
  }

  function buildReport() {
    const info = state.caseInfo;
    const lines = [
      'CMX MISSING-PERSON RESEARCH HANDOFF',
      `Exported: ${new Date().toISOString()}`,
      `Case ID: ${info?.caseId || 'Not recorded'}`,
      `Subject label: ${info?.subjectLabel || 'Not recorded'}`,
      `Urgency: ${info?.urgency || 'Not recorded'}`,
      `Official report status: ${officialLabel(info?.officialReportStatus || 'unknown')}`,
      `Authorization basis: ${info?.authorizationBasis || 'Not recorded'}`,
      `Last seen: ${info?.lastSeenAt || 'Not recorded'}`,
      `Last seen location: ${info?.lastSeenLocation || 'Not recorded'}`,
      `Coordinator: ${info?.coordinator || 'Not recorded'}`,
      '',
      'CONFIRMED FACTS'
    ];
    state.facts.forEach((item, index) => lines.push(`${index + 1}. ${item.text} [${item.confidence}] Source: ${item.sourceReference || 'not recorded'}`));
    lines.push('', 'LEADS AND HYPOTHESES');
    state.leads.forEach((item, index) => lines.push(`${index + 1}. ${item.text} [${item.status}] Source: ${item.sourceReference || 'not recorded'}`));
    lines.push('', 'TIMELINE');
    state.timeline.forEach((item, index) => lines.push(`${index + 1}. ${item.occurredAt || 'time unknown'} | ${item.location || 'location unknown'} | ${item.description} | Source: ${item.sourceReference || 'not recorded'}`));
    lines.push('', 'SOURCES');
    state.sources.forEach((item, index) => lines.push(`${index + 1}. ${item.label} | ${item.url || 'no URL'} | ${item.notes || ''}`));
    lines.push('', 'OFFICIAL-FIRST CHECKLIST');
    checklist().forEach((item) => lines.push(`[${item.completed ? 'x' : ' '}] ${item.label}`));
    lines.push('', 'Safeguard: Leads are unverified until corroborated. Minimize public disclosure and coordinate sensitive information through the relevant authority or recognized organization.');
    return lines.join('\n');
  }

  function updateLinks() {
    const subject = state.caseInfo?.subjectLabel || '';
    els.searchTool.href = subject ? `/search?type=text&entity=${encodeURIComponent(subject)}` : '/search';
    els.osintTool.href = subject ? `/osint?type=text&entity=${encodeURIComponent(subject)}` : '/osint';
    els.metadataTool.href = '/metadata';
    els.resourcesTool.href = '/resources';
  }

  function fileBase() {
    const id = state.caseInfo?.caseId || `CMX-${randomId()}`;
    return id.replace(/[^a-z0-9._-]+/gi, '-').slice(0, 100);
  }

  function download(content, name, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function safeHttpUrl(value) {
    try {
      return ['http:', 'https:'].includes(new URL(value).protocol);
    } catch {
      return false;
    }
  }

  function officialLabel(value) {
    const labels = {
      unknown: 'Unknown',
      'not-filed': 'Not filed',
      filed: 'Filed with authority',
      'ngo-active': 'Recognized organization involved',
      closed: 'Closed or resolved'
    };
    return labels[value] || value;
  }

  function titleCase(value) {
    return String(value).charAt(0).toUpperCase() + String(value).slice(1);
  }

  function miniButton(label, action) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'cmx-mini-button';
    button.textContent = label;
    button.addEventListener('click', action);
    return button;
  }

  async function copyText(text, success) {
    try {
      await navigator.clipboard.writeText(text);
      toast(success);
    } catch {
      toast('Clipboard access is unavailable.');
    }
  }

  function randomId() {
    return crypto.getRandomValues(new Uint32Array(2)).reduce((value, number) => value + number.toString(36), '').slice(0, 10).toUpperCase();
  }

  let toastTimer;
  function toast(message) {
    els.toast.textContent = message;
    els.toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => els.toast.classList.remove('show'), 2300);
  }
})();
