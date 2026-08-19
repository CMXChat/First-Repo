(() => {
  'use strict';

  const CONTENT_KEY = 'cmx-lab-content-assets-v1';
  const FILE_KEY = 'cmx-lab-file-assets-v1';
  const read = (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(key) || 'null') || fallback; } catch (_) { return fallback; }
  };
  const write = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) {} };
  const makeId = prefix => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;

  const files = read(FILE_KEY, {version:1,assets:[]});
  const enrichments = {
    'file-emergency-instructions': {updatedAt:'2026-08-16T20:11:00Z',sensitivity:'Sensitive',usedBy:['continuity.md · Draft attachment','Grace escalation · sample dependency'],knowledgePreview:{text:'12 pages · extracted-text preview pending backend'}},
    'file-family-photo': {updatedAt:'2026-08-12T18:05:00Z',sensitivity:'Never AI',usedBy:[],knowledgePreview:{text:'Vision representation disabled by policy in this sample'}},
    'file-continuity-video': {updatedAt:'2026-08-13T22:32:00Z',duration:'04:18',sensitivity:'Sensitive',usedBy:['Family continuity package · sample'],knowledgePreview:{text:'Transcript + chapter representation preview'}},
    'file-account-list': {updatedAt:'2026-08-17T12:45:00Z',sensitivity:'Never AI',usedBy:['Recovery readiness · sample'],knowledgePreview:{text:'Spreadsheet extraction disabled in current Lab'}},
    'file-voice-note': {updatedAt:'2026-08-14T07:12:00Z',duration:'02:46',sensitivity:'Sensitive',usedBy:[],knowledgePreview:{text:'Transcript representation preview · not generated in Lab'}},
    'file-continuity-notes': {updatedAt:'2026-08-17T15:33:00Z',sensitivity:'Standard',usedBy:[],knowledgePreview:{text:'Imported file text representation preview'}}
  };
  let changed = false;
  (files.assets || []).forEach(asset => {
    const extra = enrichments[asset.id];
    if (!extra) return;
    Object.entries(extra).forEach(([key,value]) => {
      if (asset[key] === undefined) { asset[key] = value; changed = true; }
    });
  });
  if (changed) write(FILE_KEY, files);

  document.addEventListener('click', event => {
    const button = event.target.closest('[data-save-version]');
    if (!button) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const store = read(CONTENT_KEY,{version:1,assets:[],links:{}});
    const asset = (store.assets || []).find(item => item.id === button.dataset.saveVersion);
    if (!asset) return;
    asset.versions = Array.isArray(asset.versions) ? asset.versions : [];
    const number = Math.max(0,...asset.versions.map(version => Number(version.number)||0)) + 1;
    asset.versions.unshift({
      id: makeId('cv'),
      number,
      createdAt: new Date().toISOString(),
      sourceText: asset.draft?.sourceText || asset.draft?.plainText || '',
      note: 'Saved from standalone Library detail rail'
    });
    asset.updatedAt = new Date().toISOString();
    write(CONTENT_KEY,store);
    button.textContent = `Saved v${number}`;
    button.disabled = true;
    window.setTimeout(() => { if (button.isConnected) { button.textContent = 'Save version'; button.disabled = false; } }, 1100);
  }, true);

  document.documentElement.dataset.continuumLibraryQa = 'v1';
})();