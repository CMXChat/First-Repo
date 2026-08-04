(() => {
  'use strict';

  if ((window.location.pathname.replace(/\/index\.html$/i, '/').replace(/\/+$/, '') || '/') !== '/cases') return;

  const DENSITY_KEY = 'cmx_cases_density_v1';
  const VIEWS = [
    ['overview', 'Overview'],
    ['timeline', 'Timeline'],
    ['entities', 'Entities'],
    ['sources', 'Sources'],
    ['evidence', 'Evidence'],
    ['relationships', 'Relationships'],
    ['notes', 'Notes'],
    ['audit', 'Audit']
  ];

  const state = {
    detail: null,
    audit: [],
    activeView: validView(window.location.hash.slice(1)) || 'overview',
    auditRequest: 0
  };

  window.setTimeout(initialize, 0);

  function initialize() {
    const detail = document.getElementById('caseDetail');
    const raw = document.getElementById('caseRawJson');
    if (!detail || !raw || detail.dataset.operatorWorkspace === 'true') return;
    detail.dataset.operatorWorkspace = 'true';

    installDensityControl();
    installCreateDrawer();
    installCaseFilter();
    const workspace = buildWorkspace(detail);
    bindWorkspace(workspace);

    new MutationObserver(() => synchronize(workspace)).observe(raw, {
      childList: true,
      characterData: true,
      subtree: true
    });
    new MutationObserver(() => applyCaseFilter()).observe(document.getElementById('caseList'), {
      childList: true,
      subtree: true
    });

    synchronize(workspace);
  }

  function buildWorkspace(detail) {
    const head = detail.querySelector('.cases-detail-head');
    const nav = document.createElement('nav');
    nav.className = 'cases-view-tabs';
    nav.setAttribute('aria-label', 'Case workspace views');

    const panels = new Map();
    const panelRoot = document.createElement('div');
    panelRoot.className = 'cases-view-root';

    VIEWS.forEach(([id, label]) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'cases-view-tab';
      button.dataset.caseView = id;
      button.textContent = label;
      nav.appendChild(button);

      const panel = document.createElement('section');
      panel.className = 'cases-view-panel cases-hidden';
      panel.dataset.casePanel = id;
      panel.setAttribute('aria-label', `${label} view`);
      panels.set(id, panel);
      panelRoot.appendChild(panel);
    });

    if (head?.nextSibling) detail.insertBefore(nav, head.nextSibling);
    else detail.appendChild(nav);
    detail.appendChild(panelRoot);

    const overview = panels.get('overview');
    const timeline = panels.get('timeline');
    const entities = panels.get('entities');
    const sources = panels.get('sources');
    const evidence = panels.get('evidence');
    const relationships = panels.get('relationships');
    const notes = panels.get('notes');
    const audit = panels.get('audit');

    const stateGrid = document.getElementById('detailStatus')?.closest('.cases-form-grid');
    const saveActions = document.getElementById('saveCaseState')?.closest('.cmx-actions');
    const summary = document.getElementById('detailType')?.closest('.cases-summary');
    const authorization = document.getElementById('detailAuthorization')?.closest('.cases-kv');
    const caseSummary = document.getElementById('detailSummary')?.closest('.cases-kv');
    const counts = document.getElementById('countEntities')?.closest('.cases-counts');
    const countsHeading = counts?.previousElementSibling?.matches('h3') ? counts.previousElementSibling : null;
    const importPanel = document.getElementById('importDrop')?.closest('section');
    const noteComposer = document.getElementById('noteInput')?.closest('section');
    const rawDetails = document.getElementById('caseRawJson')?.closest('details');

    const overviewState = section('Case state', 'Operational status and urgency.');
    appendExisting(overviewState.body, stateGrid, saveActions);
    overview.appendChild(overviewState.root);

    const overviewDetails = section('Case details', 'Authorization, scope, retention, and record totals.');
    appendExisting(overviewDetails.body, summary, authorization, caseSummary, countsHeading, counts);
    overview.appendChild(overviewDetails.root);

    const overviewColumns = document.createElement('div');
    overviewColumns.className = 'cases-operator-columns';
    const recentSection = section('Recent activity', 'Chronological display only. Ordering does not imply causation.');
    recentSection.body.id = 'operatorRecentActivity';
    const flagSection = section('Review flags', 'Automated prompts for operator review.');
    flagSection.body.id = 'operatorReviewFlags';
    overviewColumns.append(recentSection.root, flagSection.root);
    overview.appendChild(overviewColumns);
    if (importPanel) overview.appendChild(importPanel);

    const timelineTools = toolbar();
    timelineTools.append(
      field('Record type', select('operatorTimelineType', [
        ['all', 'All activity'], ['observation', 'Observations'], ['source', 'Sources'],
        ['query', 'Queries'], ['evidence', 'Evidence'], ['relationship', 'Relationships'],
        ['note', 'Notes'], ['audit', 'Audit']
      ])),
      field('Search timeline', input('operatorTimelineSearch', 'search', 'Record text, source, provider'))
    );
    const timelineNotice = document.createElement('p');
    timelineNotice.className = 'cmx-notice';
    timelineNotice.textContent = 'Timeline timestamps reflect observation, capture, execution, creation, or audit time. They do not establish identity, cause, or real-world sequence.';
    const timelineList = document.createElement('div');
    timelineList.id = 'operatorTimeline';
    timelineList.className = 'cases-operator-timeline';
    timeline.append(timelineTools, timelineNotice, timelineList);

    const entityTools = toolbar();
    entityTools.append(
      field('Search normalized value', input('operatorEntitySearch', 'search', 'Domain, username, IP, email, phone')),
      field('Entity type', select('operatorEntityType', [['all', 'All types']])),
      field('Confidence', select('operatorEntityConfidence', [
        ['all', 'All confidence'], ['confirmed', 'Confirmed'], ['high', 'High'], ['strong', 'Strong'],
        ['medium', 'Medium'], ['limited', 'Limited'], ['low', 'Low'], ['unrated', 'Unrated']
      ])),
      checkbox('operatorEntityDuplicates', 'Duplicate review only')
    );
    entities.appendChild(entityTools);
    moveRecordPanel('entityRecords', entities);

    const sourceColumns = document.createElement('div');
    sourceColumns.className = 'cases-operator-columns';
    moveRecordPanel('sourceRecords', sourceColumns);
    moveRecordPanel('queryRecords', sourceColumns);
    sources.appendChild(sourceColumns);

    moveRecordPanel('evidenceRecords', evidence);

    const relationshipComposer = buildRelationshipComposer();
    relationships.appendChild(relationshipComposer);
    moveRecordPanel('relationshipRecords', relationships);

    if (noteComposer) notes.appendChild(noteComposer);
    moveRecordPanel('noteRecords', notes);

    const auditHeader = document.createElement('div');
    auditHeader.className = 'cases-operator-section-head';
    const auditCopy = document.createElement('div');
    const auditTitle = document.createElement('h3');
    auditTitle.textContent = 'Audit history';
    const auditDescription = document.createElement('p');
    auditDescription.textContent = 'Operational events and redacted summaries. Research content is not copied into audit details.';
    auditCopy.append(auditTitle, auditDescription);
    const auditRefresh = document.createElement('button');
    auditRefresh.type = 'button';
    auditRefresh.className = 'cmx-button';
    auditRefresh.id = 'operatorRefreshAudit';
    auditRefresh.textContent = 'Refresh audit';
    auditHeader.append(auditCopy, auditRefresh);
    const auditList = document.createElement('div');
    auditList.id = 'operatorAuditRecords';
    auditList.className = 'cases-record-list cases-operator-tall';
    audit.append(auditHeader, auditList);
    if (rawDetails) audit.appendChild(rawDetails);

    const observationPanel = document.getElementById('observationRecords')?.closest('section');
    observationPanel?.remove();
    document.querySelector('.cases-record-grid:empty')?.remove();

    addAuditCount(counts);
    setActiveView(nav, panels, state.activeView);

    return { nav, panels, timelineList, auditList, recent: recentSection.body, flags: flagSection.body };
  }

  function bindWorkspace(workspace) {
    workspace.nav.addEventListener('click', (event) => {
      const button = event.target.closest('[data-case-view]');
      if (!button) return;
      openView(workspace, button.dataset.caseView);
    });

    document.querySelectorAll('[data-open-case-view]').forEach((button) => {
      button.addEventListener('click', () => openView(workspace, button.dataset.openCaseView));
    });

    ['operatorTimelineType', 'operatorTimelineSearch'].forEach((id) => {
      document.getElementById(id)?.addEventListener('input', () => renderTimeline(workspace));
    });
    ['operatorEntitySearch', 'operatorEntityType', 'operatorEntityConfidence', 'operatorEntityDuplicates'].forEach((id) => {
      document.getElementById(id)?.addEventListener('input', renderEntities);
    });

    document.getElementById('operatorCreateRelationship')?.addEventListener('click', createRelationship);
    document.getElementById('operatorRefreshAudit')?.addEventListener('click', () => loadAudit(workspace, true));
  }

  function synchronize(workspace) {
    const raw = document.getElementById('caseRawJson');
    try {
      const parsed = JSON.parse(raw?.textContent || '{}');
      if (!parsed?.id) {
        state.detail = null;
        state.audit = [];
        return;
      }
      const changedCase = state.detail?.id !== parsed.id;
      state.detail = parsed;
      populateEntityTypeFilter();
      populateRelationshipEntities();
      renderEntities();
      renderOverview(workspace);
      renderTimeline(workspace);
      if (changedCase) loadAudit(workspace, false);
    } catch {
      state.detail = null;
    }
  }

  function openView(workspace, view) {
    const next = validView(view) || 'overview';
    state.activeView = next;
    setActiveView(workspace.nav, workspace.panels, next);
    const url = `${window.location.pathname}${window.location.search}#${next}`;
    window.history.replaceState(null, '', url);
    if (next === 'audit') loadAudit(workspace, false);
  }

  function setActiveView(nav, panels, view) {
    nav.querySelectorAll('[data-case-view]').forEach((button) => {
      const active = button.dataset.caseView === view;
      button.classList.toggle('active', active);
      button.setAttribute('aria-current', active ? 'page' : 'false');
    });
    panels.forEach((panel, id) => panel.classList.toggle('cases-hidden', id !== view));
  }

  async function loadAudit(workspace, announce) {
    const caseId = state.detail?.id;
    if (!caseId) return;
    const requestId = ++state.auditRequest;
    if (announce) notify('Refreshing audit history.');
    try {
      const response = await fetch(`/api/cases/${encodeURIComponent(caseId)}/audit?limit=500`, {
        credentials: 'same-origin',
        cache: 'no-store',
        headers: { accept: 'application/json' }
      });
      if (!response.ok) throw new Error(`Audit service returned HTTP ${response.status}`);
      const records = await response.json();
      if (requestId !== state.auditRequest || caseId !== state.detail?.id) return;
      state.audit = Array.isArray(records) ? records : [];
      renderAudit(workspace);
      renderTimeline(workspace);
      renderOverview(workspace);
      const count = document.getElementById('countAudit');
      if (count) count.textContent = String(state.audit.length);
    } catch (error) {
      if (requestId !== state.auditRequest) return;
      state.audit = [];
      renderEmpty(workspace.auditList, error instanceof Error ? error.message : 'Audit history unavailable.');
    }
  }

  function renderOverview(workspace) {
    if (!state.detail) return;
    const timeline = buildTimeline();
    workspace.recent.replaceChildren();
    if (!timeline.length) renderEmpty(workspace.recent, 'No case activity yet.');
    timeline.slice(0, 5).forEach((item) => workspace.recent.appendChild(recordCard(item.title, item.copy, item.meta)));

    const flags = buildFlags();
    workspace.flags.replaceChildren();
    if (!flags.length) renderEmpty(workspace.flags, 'No automated flags. Manual review is still required.');
    flags.forEach((flag) => workspace.flags.appendChild(recordCard(flag.title, flag.copy, flag.meta || 'Review prompt')));
  }

  function buildFlags() {
    const detail = state.detail;
    const entities = detail.entities || [];
    const sources = detail.sources || [];
    const notes = detail.notes || [];
    const evidence = detail.evidence_items || [];
    const flags = [];
    const weak = entities.filter((record) => ['unrated', 'low', 'limited'].includes(record.confidence));
    const duplicates = duplicateEntityIds(entities);
    const retention = detail.retention_until ? new Date(detail.retention_until) : null;

    if (weak.length) flags.push({ title: `${weak.length} low-confidence or unrated entities`, copy: 'Review before using these records as pivots or conclusions.' });
    if (duplicates.size) flags.push({ title: `${duplicates.size} entities need duplicate review`, copy: 'The same normalized value appears in more than one entity record or type.' });
    if (!sources.length) flags.push({ title: 'No source registrations', copy: 'Add source context before treating findings as supportable.' });
    if (!notes.length) flags.push({ title: 'No analyst notes', copy: 'Record limitations, contradictions, or the next action.' });
    if (retention && retention.getTime() <= Date.now()) flags.push({ title: 'Retention review is due', copy: retention.toLocaleString(), meta: 'Lifecycle' });
    if (evidence.length && evidence.every((record) => !record.storage_key)) flags.push({ title: 'Evidence is registration-only', copy: 'Hashes and metadata are present, but no storage key is recorded.' });
    return flags;
  }

  function renderTimeline(workspace) {
    const type = document.getElementById('operatorTimelineType')?.value || 'all';
    const query = (document.getElementById('operatorTimelineSearch')?.value || '').trim().toLowerCase();
    const records = buildTimeline().filter((item) => {
      if (type !== 'all' && item.type !== type) return false;
      if (!query) return true;
      return `${item.title} ${item.copy} ${item.meta}`.toLowerCase().includes(query);
    });

    workspace.timelineList.replaceChildren();
    if (!records.length) return renderEmpty(workspace.timelineList, 'No timeline records match the current filters.');
    records.slice(0, 500).forEach((item) => {
      const row = document.createElement('article');
      row.className = 'cases-timeline-row';
      const marker = document.createElement('span');
      marker.className = `cases-timeline-marker type-${item.type}`;
      marker.textContent = item.type;
      const body = document.createElement('div');
      const title = document.createElement('strong');
      title.textContent = truncate(item.title, 1000);
      const copy = document.createElement('p');
      copy.textContent = truncate(item.copy, 2400);
      const meta = document.createElement('small');
      meta.textContent = item.meta;
      body.append(title, copy, meta);
      row.append(marker, body);
      workspace.timelineList.appendChild(row);
    });
  }

  function buildTimeline() {
    const detail = state.detail;
    if (!detail) return [];
    const entityMap = new Map((detail.entities || []).map((record) => [record.id, entityLabel(record)]));
    const sourceMap = new Map((detail.sources || []).map((record) => [record.id, record.label]));
    const records = [];

    (detail.observations || []).forEach((record) => records.push(timelineItem(
      'observation', `${record.kind}: ${record.value_text}`,
      [record.note, record.entity_id ? `Entity: ${entityMap.get(record.entity_id) || record.entity_id}` : '', record.source_id ? `Source: ${sourceMap.get(record.source_id) || record.source_id}` : ''].filter(Boolean).join(' · '),
      record.observed_at || record.created_at, `${record.confidence} confidence`
    )));
    (detail.sources || []).forEach((record) => records.push(timelineItem(
      'source', record.label, [record.source_type, record.url, record.notes].filter(Boolean).join(' · '),
      record.accessed_at || record.created_at, 'Source registration'
    )));
    (detail.queries || []).forEach((record) => records.push(timelineItem(
      'query', `${record.provider}: ${record.query_text}`, [record.purpose, record.result_url].filter(Boolean).join(' · '),
      record.executed_at || record.created_at, 'Query record'
    )));
    (detail.evidence_items || []).forEach((record) => records.push(timelineItem(
      'evidence', record.filename, `${record.media_type} · ${formatBytes(record.size_bytes)} · SHA-256 ${record.sha256}`,
      record.captured_at || record.created_at, record.storage_key ? 'Stored evidence' : 'Evidence registration'
    )));
    (detail.relationships || []).forEach((record) => records.push(timelineItem(
      'relationship', record.relationship_type,
      `${entityMap.get(record.from_entity_id) || record.from_entity_id} → ${entityMap.get(record.to_entity_id) || record.to_entity_id}${record.note ? ` · ${record.note}` : ''}`,
      record.created_at, `${record.confidence} confidence`
    )));
    (detail.notes || []).forEach((record) => records.push(timelineItem(
      'note', record.note, '', record.created_at, 'Analyst note'
    )));
    state.audit.forEach((record) => records.push(timelineItem(
      'audit', record.action, auditSummary(record.details), record.created_at, `${record.object_type} · ${record.request_id}`
    )));

    return records.sort((a, b) => b.timeValue - a.timeValue);
  }

  function timelineItem(type, title, copy, time, meta) {
    const parsed = new Date(time || 0);
    const valid = Number.isFinite(parsed.getTime());
    return {
      type,
      title: String(title || 'Untitled record'),
      copy: String(copy || ''),
      meta: `${valid ? parsed.toLocaleString() : 'Unknown time'} · ${meta}`,
      timeValue: valid ? parsed.getTime() : 0
    };
  }

  function renderEntities() {
    const detail = state.detail;
    const container = document.getElementById('entityRecords');
    if (!detail || !container) return;
    const query = (document.getElementById('operatorEntitySearch')?.value || '').trim().toLowerCase();
    const type = document.getElementById('operatorEntityType')?.value || 'all';
    const confidence = document.getElementById('operatorEntityConfidence')?.value || 'all';
    const duplicateOnly = document.getElementById('operatorEntityDuplicates')?.checked === true;
    const duplicates = duplicateEntityIds(detail.entities || []);

    const records = (detail.entities || []).filter((record) => {
      if (type !== 'all' && record.entity_type !== type) return false;
      if (confidence !== 'all' && record.confidence !== confidence) return false;
      if (duplicateOnly && !duplicates.has(record.id)) return false;
      if (!query) return true;
      return `${record.normalized_value} ${record.display_value} ${record.entity_type}`.toLowerCase().includes(query);
    });

    container.replaceChildren();
    if (!records.length) return renderEmpty(container, 'No entities match the current filters.');
    records.forEach((record) => {
      const card = document.createElement('article');
      card.className = 'cases-entity-card';
      const header = document.createElement('div');
      header.className = 'cases-entity-head';
      const copy = document.createElement('div');
      const title = document.createElement('strong');
      title.textContent = record.display_value || record.normalized_value;
      const normalized = document.createElement('p');
      normalized.textContent = record.normalized_value;
      copy.append(title, normalized);
      const badges = document.createElement('div');
      badges.className = 'cases-entity-badges';
      badges.append(statusBadge(record.entity_type), statusBadge(record.confidence), statusBadge(entityState(record)));
      if (duplicates.has(record.id)) badges.append(statusBadge('duplicate review'));
      header.append(copy, badges);

      const actions = document.createElement('div');
      actions.className = 'cases-record-actions';
      const toolUrl = entityToolUrl(record, detail.id);
      if (toolUrl) actions.appendChild(actionLink('Open tool', toolUrl));
      const copyButton = document.createElement('button');
      copyButton.type = 'button';
      copyButton.className = 'cmx-button';
      copyButton.textContent = 'Copy value';
      copyButton.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(record.normalized_value);
          notify('Entity value copied.');
        } catch {
          notify('Clipboard access was unavailable.');
        }
      });
      actions.appendChild(copyButton);
      card.append(header, actions);
      container.appendChild(card);
    });
  }

  function populateEntityTypeFilter() {
    const selectElement = document.getElementById('operatorEntityType');
    if (!selectElement || !state.detail) return;
    const current = selectElement.value;
    const types = Array.from(new Set((state.detail.entities || []).map((record) => record.entity_type))).sort();
    selectElement.replaceChildren(option('all', 'All types'));
    types.forEach((type) => selectElement.appendChild(option(type, type)));
    selectElement.value = types.includes(current) ? current : 'all';
  }

  function populateRelationshipEntities() {
    const from = document.getElementById('operatorRelationshipFrom');
    const to = document.getElementById('operatorRelationshipTo');
    if (!from || !to || !state.detail) return;
    const records = state.detail.entities || [];
    from.replaceChildren(option('', records.length ? 'Select entity' : 'No entities available'));
    to.replaceChildren(option('', records.length ? 'Select entity' : 'No entities available'));
    records.forEach((record) => {
      from.appendChild(option(record.id, entityLabel(record)));
      to.appendChild(option(record.id, entityLabel(record)));
    });
    const create = document.getElementById('operatorCreateRelationship');
    if (create) create.disabled = records.length < 2;
  }

  async function createRelationship() {
    const detail = state.detail;
    const from = document.getElementById('operatorRelationshipFrom')?.value || '';
    const to = document.getElementById('operatorRelationshipTo')?.value || '';
    const relationshipType = slug(document.getElementById('operatorRelationshipType')?.value || '');
    const confidence = document.getElementById('operatorRelationshipConfidence')?.value || 'unrated';
    const note = (document.getElementById('operatorRelationshipNote')?.value || '').trim();
    if (!detail) return;
    if (!from || !to) return notify('Select both entities.');
    if (from === to) return notify('A relationship requires two different entities.');
    if (!relationshipType) return notify('Add a relationship type.');

    const button = document.getElementById('operatorCreateRelationship');
    button.disabled = true;
    button.textContent = 'Creating…';
    try {
      const response = await fetch(`/api/cases/${encodeURIComponent(detail.id)}/relationships`, {
        method: 'POST',
        credentials: 'same-origin',
        cache: 'no-store',
        headers: { accept: 'application/json', 'content-type': 'application/json' },
        body: JSON.stringify({
          from_entity_id: from,
          to_entity_id: to,
          relationship_type: relationshipType,
          confidence,
          note
        })
      });
      if (!response.ok) throw await responseError(response, 'Relationship could not be created');
      document.getElementById('operatorRelationshipType').value = '';
      document.getElementById('operatorRelationshipNote').value = '';
      notify('Relationship created.');
      document.getElementById('refreshCases')?.click();
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Relationship could not be created.');
    } finally {
      button.textContent = 'Create relationship';
      button.disabled = (state.detail?.entities || []).length < 2;
    }
  }

  function renderAudit(workspace) {
    workspace.auditList.replaceChildren();
    if (!state.audit.length) return renderEmpty(workspace.auditList, 'No audit events are available for this case.');
    state.audit.forEach((record) => {
      workspace.auditList.appendChild(recordCard(
        record.action,
        auditSummary(record.details),
        `${new Date(record.created_at).toLocaleString()} · ${record.object_type} · ${record.request_id}`
      ));
    });
  }

  function installDensityControl() {
    const topbar = document.querySelector('.cmx-tool-topbar');
    if (!topbar || document.getElementById('operatorDensity')) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.id = 'operatorDensity';
    button.className = 'cases-density-toggle';
    const saved = safeSessionGet(DENSITY_KEY);
    if (saved === 'compact') document.body.classList.add('cases-density-compact');
    updateDensityLabel(button);
    button.addEventListener('click', () => {
      document.body.classList.toggle('cases-density-compact');
      safeSessionSet(DENSITY_KEY, document.body.classList.contains('cases-density-compact') ? 'compact' : 'comfortable');
      updateDensityLabel(button);
    });
    topbar.appendChild(button);
  }

  function installCreateDrawer() {
    const createButton = document.getElementById('createCase');
    const panel = createButton?.closest('.cmx-card');
    const hero = document.querySelector('.cmx-hero');
    if (!panel || !hero || panel.dataset.operatorDrawer === 'true') return;
    panel.dataset.operatorDrawer = 'true';
    panel.classList.add('cases-create-drawer', 'cases-hidden');
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'cmx-button primary cases-create-toggle';
    toggle.textContent = 'New case';
    toggle.addEventListener('click', () => {
      panel.classList.toggle('cases-hidden');
      toggle.textContent = panel.classList.contains('cases-hidden') ? 'New case' : 'Close case form';
      if (!panel.classList.contains('cases-hidden')) document.getElementById('caseTitle')?.focus();
    });
    hero.appendChild(toggle);

    const message = document.getElementById('caseFormMessage');
    new MutationObserver(() => {
      if (/case created/i.test(message?.textContent || '')) {
        panel.classList.add('cases-hidden');
        toggle.textContent = 'New case';
      }
    }).observe(message, { childList: true, characterData: true, subtree: true });
  }

  function installCaseFilter() {
    const list = document.getElementById('caseList');
    const card = list?.closest('.cmx-card');
    const head = card?.querySelector('.cases-detail-head');
    if (!list || !card || document.getElementById('operatorCaseFilter')) return;
    card.classList.add('cases-operator-sidebar');
    const label = field('Filter cases', input('operatorCaseFilter', 'search', 'Title, type, status'));
    label.classList.add('cases-case-filter');
    label.querySelector('input').addEventListener('input', applyCaseFilter);
    if (head?.nextSibling) card.insertBefore(label, head.nextSibling);
    else card.prepend(label);
  }

  function applyCaseFilter() {
    const list = document.getElementById('caseList');
    const query = (document.getElementById('operatorCaseFilter')?.value || '').trim().toLowerCase();
    if (!list) return;
    let visible = 0;
    list.querySelectorAll('.cases-item').forEach((item) => {
      const show = !query || (item.textContent || '').toLowerCase().includes(query);
      item.classList.toggle('cases-filtered-out', !show);
      visible += Number(show);
    });
    const empty = document.getElementById('caseListEmpty');
    if (query && empty) {
      empty.classList.toggle('cases-hidden', visible > 0);
      if (!visible) empty.textContent = 'No cases match the current filter.';
    }
  }

  function buildRelationshipComposer() {
    const wrapper = section('Create a relationship', 'Connect two entities in this case and record the claim conservatively.');
    const grid = document.createElement('div');
    grid.className = 'cases-form-grid';
    grid.append(
      field('From entity', select('operatorRelationshipFrom', [['', 'Select entity']])),
      field('To entity', select('operatorRelationshipTo', [['', 'Select entity']])),
      field('Relationship type', input('operatorRelationshipType', 'text', 'same_operator, resolves_to, mentioned_by')),
      field('Confidence', select('operatorRelationshipConfidence', [
        ['unrated', 'Unrated'], ['low', 'Low'], ['limited', 'Limited'], ['medium', 'Medium'],
        ['strong', 'Strong'], ['high', 'High'], ['confirmed', 'Confirmed']
      ]))
    );
    const note = document.createElement('textarea');
    note.className = 'cmx-textarea';
    note.id = 'operatorRelationshipNote';
    note.maxLength = 10000;
    note.placeholder = 'Evidence, limitation, contradiction, or reason for this relationship';
    const noteField = field('Relationship note', note);
    const actions = document.createElement('div');
    actions.className = 'cmx-actions';
    const create = document.createElement('button');
    create.type = 'button';
    create.id = 'operatorCreateRelationship';
    create.className = 'cmx-button primary';
    create.textContent = 'Create relationship';
    create.disabled = true;
    actions.appendChild(create);
    wrapper.body.append(grid, noteField, actions);
    return wrapper.root;
  }

  function moveRecordPanel(recordId, target) {
    const panel = document.getElementById(recordId)?.closest('section');
    if (!panel) return;
    panel.classList.add('cases-operator-record-panel');
    target.appendChild(panel);
  }

  function addAuditCount(counts) {
    if (!counts || document.getElementById('countAudit')) return;
    const box = document.createElement('button');
    box.type = 'button';
    box.className = 'cases-count';
    box.dataset.openCaseView = 'audit';
    const value = document.createElement('strong');
    value.id = 'countAudit';
    value.textContent = '0';
    const label = document.createElement('span');
    label.textContent = 'Audit events';
    box.append(value, label);
    counts.appendChild(box);
    box.addEventListener('click', () => {
      const workspace = document.querySelector('[data-operator-workspace]');
      document.querySelector('[data-case-view="audit"]')?.click();
    });
    counts.querySelectorAll('.cases-count').forEach((item) => {
      const labelText = item.querySelector('span')?.textContent || '';
      const map = { Entities: 'entities', Observations: 'timeline', Sources: 'sources', Queries: 'sources', Evidence: 'evidence', Relationships: 'relationships', Notes: 'notes' };
      const view = map[labelText];
      if (view && !item.dataset.operatorBound) {
        item.dataset.operatorBound = 'true';
        item.addEventListener('click', () => document.querySelector(`[data-case-view="${view}"]`)?.click());
      }
    });
  }

  function section(titleText, copyText) {
    const root = document.createElement('section');
    root.className = 'cases-operator-section';
    const head = document.createElement('div');
    head.className = 'cases-operator-section-head';
    const copy = document.createElement('div');
    const title = document.createElement('h3');
    title.textContent = titleText;
    const description = document.createElement('p');
    description.textContent = copyText;
    copy.append(title, description);
    head.appendChild(copy);
    const body = document.createElement('div');
    body.className = 'cases-operator-section-body';
    root.append(head, body);
    return { root, head, body };
  }

  function toolbar() {
    const element = document.createElement('div');
    element.className = 'cases-operator-toolbar';
    return element;
  }

  function field(labelText, control) {
    const label = document.createElement('label');
    label.className = 'cmx-field';
    const text = document.createElement('span');
    text.textContent = labelText;
    label.append(text, control);
    return label;
  }

  function input(id, type, placeholder) {
    const element = document.createElement('input');
    element.id = id;
    element.type = type;
    element.className = 'cmx-input';
    element.placeholder = placeholder;
    return element;
  }

  function select(id, entries) {
    const element = document.createElement('select');
    element.id = id;
    element.className = 'cmx-select';
    entries.forEach(([value, label]) => element.appendChild(option(value, label)));
    return element;
  }

  function checkbox(id, labelText) {
    const label = document.createElement('label');
    label.className = 'cases-operator-checkbox';
    const control = document.createElement('input');
    control.id = id;
    control.type = 'checkbox';
    const text = document.createElement('span');
    text.textContent = labelText;
    label.append(control, text);
    return label;
  }

  function option(value, label) {
    const element = document.createElement('option');
    element.value = value;
    element.textContent = label;
    return element;
  }

  function appendExisting(target, ...nodes) {
    nodes.filter(Boolean).forEach((node) => target.appendChild(node));
  }

  function recordCard(titleText, copyText, metaText) {
    const card = document.createElement('article');
    card.className = 'cases-record cases-operator-record';
    const title = document.createElement('strong');
    title.textContent = truncate(titleText, 1000);
    const copy = document.createElement('p');
    copy.textContent = truncate(copyText, 2400);
    const meta = document.createElement('small');
    meta.textContent = metaText;
    card.append(title, copy, meta);
    return card;
  }

  function renderEmpty(container, message) {
    container.replaceChildren();
    const empty = document.createElement('div');
    empty.className = 'cmx-empty';
    empty.textContent = message;
    container.appendChild(empty);
  }

  function statusBadge(text) {
    const badge = document.createElement('span');
    badge.className = 'cases-badge';
    badge.textContent = String(text);
    return badge;
  }

  function actionLink(label, href) {
    const link = document.createElement('a');
    link.className = 'cmx-button';
    link.href = href;
    link.textContent = label;
    return link;
  }

  function entityToolUrl(record, caseId) {
    const value = encodeURIComponent(record.normalized_value || record.display_value || '');
    const caseParam = encodeURIComponent(caseId);
    if (!value) return '';
    if (record.entity_type === 'phone') return `/phone?n=${value}&case=${caseParam}`;
    if (record.entity_type === 'email' || record.entity_type === 'username' || record.entity_type === 'name') {
      return `/search?type=${encodeURIComponent(record.entity_type)}&entity=${value}&case=${caseParam}`;
    }
    return `/osint?type=${encodeURIComponent(record.entity_type)}&value=${value}&case=${caseParam}`;
  }

  function entityLabel(record) {
    return `${record.entity_type}: ${record.display_value || record.normalized_value}`;
  }

  function entityState(record) {
    const explicit = String(record.attributes?.analyst_state || '').toLowerCase();
    if (['verified', 'inferred', 'conflicting', 'ruled-out', 'ruled_out', 'unverified'].includes(explicit)) {
      return explicit.replace('_', '-');
    }
    if (record.confidence === 'confirmed') return 'verified';
    if (['unrated', 'low', 'limited'].includes(record.confidence)) return 'unverified';
    return 'inferred';
  }

  function duplicateEntityIds(records) {
    const groups = new Map();
    records.forEach((record) => {
      const key = String(record.normalized_value || '').trim().toLowerCase();
      if (!key) return;
      const values = groups.get(key) || [];
      values.push(record.id);
      groups.set(key, values);
    });
    const ids = new Set();
    groups.forEach((values) => {
      if (values.length > 1) values.forEach((id) => ids.add(id));
    });
    return ids;
  }

  function auditSummary(details) {
    if (!details || typeof details !== 'object') return 'No audit summary.';
    return Object.entries(details)
      .slice(0, 20)
      .map(([key, value]) => `${key}: ${typeof value === 'object' ? JSON.stringify(value) : String(value)}`)
      .join(' · ') || 'No audit summary.';
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

  function slug(value) {
    return String(value).toLowerCase().replace(/[^a-z0-9_-]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 120);
  }

  function truncate(value, limit) {
    const text = String(value || '');
    return text.length > limit ? `${text.slice(0, limit)}…` : text;
  }

  function formatBytes(value) {
    const number = Number(value);
    if (!Number.isFinite(number) || number < 0) return 'Unknown size';
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = number;
    let index = 0;
    while (size >= 1024 && index < units.length - 1) {
      size /= 1024;
      index += 1;
    }
    return `${size.toFixed(index && size < 10 ? 1 : 0)} ${units[index]}`;
  }

  function validView(value) {
    return VIEWS.some(([id]) => id === value) ? value : '';
  }

  function updateDensityLabel(button) {
    button.textContent = document.body.classList.contains('cases-density-compact') ? 'Comfortable density' : 'Compact density';
  }

  function safeSessionGet(key) {
    try {
      return sessionStorage.getItem(key) || '';
    } catch {
      return '';
    }
  }

  function safeSessionSet(key, value) {
    try {
      sessionStorage.setItem(key, value);
    } catch {
      // Density preference is optional.
    }
  }

  function notify(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(notify.timer);
    notify.timer = window.setTimeout(() => toast.classList.remove('show'), 2800);
  }
})();
