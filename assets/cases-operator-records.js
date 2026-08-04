(() => {
  'use strict';

  if ((window.location.pathname.replace(/\/index\.html$/i, '/').replace(/\/+$/, '') || '/') !== '/cases') return;

  window.setTimeout(initialize, 0);

  function initialize() {
    const source = document.getElementById('caseRawJson');
    if (!source || source.dataset.operatorRecords === 'true') return;
    source.dataset.operatorRecords = 'true';

    new MutationObserver(render).observe(source, {
      childList: true,
      characterData: true,
      subtree: true
    });
    render();
  }

  function render() {
    const source = document.getElementById('caseRawJson');
    const container = document.getElementById('relationshipRecords');
    if (!source || !container) return;

    let detail;
    try {
      detail = JSON.parse(source.textContent || '{}');
    } catch {
      return;
    }
    if (!detail?.id) return;

    const entities = new Map((detail.entities || []).map((record) => [record.id, entityLabel(record)]));
    const relationships = Array.isArray(detail.relationships) ? detail.relationships : [];
    container.replaceChildren();

    if (!relationships.length) {
      const empty = document.createElement('div');
      empty.className = 'cmx-empty';
      empty.textContent = 'No records.';
      container.appendChild(empty);
      return;
    }

    relationships.slice(0, 300).forEach((record) => {
      const card = document.createElement('article');
      card.className = 'cases-record cases-operator-record';

      const title = document.createElement('strong');
      title.textContent = String(record.relationship_type || 'relationship');

      const endpoints = document.createElement('p');
      endpoints.textContent = `${entities.get(record.from_entity_id) || record.from_entity_id} → ${entities.get(record.to_entity_id) || record.to_entity_id}`;

      const note = document.createElement('p');
      note.textContent = record.note || 'No relationship note recorded.';

      const meta = document.createElement('small');
      const created = new Date(record.created_at || 0);
      const time = Number.isFinite(created.getTime()) ? created.toLocaleString() : 'Unknown time';
      meta.textContent = `${record.confidence || 'unrated'} confidence · ${time}`;

      card.append(title, endpoints, note, meta);
      container.appendChild(card);
    });

    if (relationships.length > 300) {
      const notice = document.createElement('p');
      notice.className = 'cmx-muted';
      notice.textContent = `Showing 300 of ${relationships.length} relationships.`;
      container.appendChild(notice);
    }
  }

  function entityLabel(record) {
    return `${record.entity_type || 'entity'}: ${record.display_value || record.normalized_value || record.id}`;
  }
})();
