(() => {
  'use strict';

  const CONTENT_KEY = 'cmx-lab-content-assets-v1';
  const FILE_KEY = 'cmx-lab-file-assets-v1';
  const META_KEY = 'cmx-lab-library-meta-v1';
  const UI_KEY = 'cmx-lab-library-ui-v1';
  const THEME_KEY = 'continuum-library-theme-v1';
  const AUTOMATIONS_KEY = 'cmx-lab-automations-v1';

  const root = document.documentElement;
  const body = document.body;
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const esc = value => String(value ?? '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const now = () => new Date().toISOString();
  const makeId = prefix => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;

  function load(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || 'null');
      return value ?? fallback;
    } catch (_) {
      return fallback;
    }
  }

  function save(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) {}
  }

  const seedFolders = [
    {id:'folder-continuity',name:'Continuity',parentId:null,createdAt:'2026-08-10T14:00:00Z'},
    {id:'folder-cmx',name:'CMX',parentId:null,createdAt:'2026-08-10T14:05:00Z'},
    {id:'folder-personal',name:'Personal',parentId:null,createdAt:'2026-08-10T14:10:00Z'},
    {id:'folder-family',name:'Family',parentId:null,createdAt:'2026-08-10T14:15:00Z'},
    {id:'folder-media',name:'Media',parentId:null,createdAt:'2026-08-10T14:20:00Z'},
    {id:'folder-imports',name:'Imports',parentId:null,createdAt:'2026-08-10T14:25:00Z'},
    {id:'folder-cmx-architecture',name:'Architecture',parentId:'folder-cmx',createdAt:'2026-08-11T10:00:00Z'},
    {id:'folder-family-messages',name:'Messages',parentId:'folder-family',createdAt:'2026-08-11T10:10:00Z'}
  ];

  const seedContent = [
    {
      id:'content-continuity-md',title:'continuity.md',kind:'markdown',libraryVisible:true,libraryRole:'document',createdAt:'2026-08-16T14:00:00Z',updatedAt:'2026-08-19T20:08:00Z',sensitivity:'Sensitive',sourceKind:'native_content',
      draft:{sourceText:'# Continuity\n\nOwner continuity instructions and recovery context live here.\n\n## Current direction\n\nKeep exact versions available to published workflows. Changes to this Draft do not rewrite historical versions.',updatedAt:'2026-08-19T20:08:00Z',attachments:[]},
      versions:[
        {id:'cv-continuity-v3',number:3,createdAt:'2026-08-19T15:40:00Z',sourceText:'# Continuity\n\nOwner continuity instructions and recovery context live here.\n\n## Current direction\n\nKeep exact versions available to published workflows.',note:'Clarified version pinning'},
        {id:'cv-continuity-v2',number:2,createdAt:'2026-08-18T16:15:00Z',sourceText:'# Continuity\n\nOwner continuity instructions and recovery context live here.',note:'Expanded continuity context'},
        {id:'cv-continuity-v1',number:1,createdAt:'2026-08-16T14:05:00Z',sourceText:'# Continuity\n\nInitial protected continuity document.',note:'Initial saved version'}
      ],
      usedBy:['Grace escalation · Automation Draft','Afterlife continuity plan · future configuration'],
      knowledgePreview:{facts:8,decisions:3,dates:2,conflicts:0}
    },
    {
      id:'content-morning-template',title:'Morning Brief Template',kind:'template',templateType:'document',libraryVisible:true,libraryRole:'template',createdAt:'2026-08-15T12:00:00Z',updatedAt:'2026-08-19T13:12:00Z',sensitivity:'Standard',sourceKind:'native_content',
      draft:{sourceText:'Morning brief\n\nToday\n\nNeeds attention\n\nUpcoming\n\nContext worth remembering',updatedAt:'2026-08-19T13:12:00Z',attachments:[]},
      versions:[{id:'cv-brief-v1',number:1,createdAt:'2026-08-15T12:05:00Z',sourceText:'Morning brief\n\nToday\n\nNeeds attention\n\nUpcoming',note:'Template baseline'}],
      usedBy:['Morning briefing · Lab sample'],knowledgePreview:{facts:0,decisions:0,dates:0,conflicts:0}
    },
    {
      id:'content-architecture-notes',title:'Continuum Architecture Notes',kind:'document',libraryVisible:true,libraryRole:'document',createdAt:'2026-08-17T18:00:00Z',updatedAt:'2026-08-19T18:32:00Z',sensitivity:'Standard',sourceKind:'native_content',
      draft:{sourceText:'Continuum architecture notes\n\nDirectory knows who. Library knows what information. Automations define what should happen. Runtime records what actually happened.\n\nAI remains replaceable while Continuum owns durable context, policy and history.',updatedAt:'2026-08-19T18:32:00Z',attachments:[]},
      versions:[{id:'cv-architecture-v1',number:1,createdAt:'2026-08-18T09:00:00Z',sourceText:'Continuum architecture notes\n\nDirectory knows who. Library knows what information.',note:'Initial architecture note'}],
      usedBy:['Continuum product documentation'],knowledgePreview:{facts:11,decisions:4,dates:1,conflicts:1}
    },
    {
      id:'content-personal-note',title:'Things to remember',kind:'text',libraryVisible:true,libraryRole:'document',createdAt:'2026-08-18T08:20:00Z',updatedAt:'2026-08-19T11:21:00Z',sensitivity:'Local-only',sourceKind:'native_content',
      draft:{sourceText:'Keep important personal reminders here. This sample item demonstrates a local-only AI privacy label.',updatedAt:'2026-08-19T11:21:00Z',attachments:[]},versions:[],usedBy:[],knowledgePreview:{facts:2,decisions:0,dates:0,conflicts:0}
    },
    {
      id:'content-ai-handoff',title:'AI Context Handoff · Aug 19',kind:'text',libraryVisible:true,libraryRole:'import',createdAt:'2026-08-19T17:20:00Z',updatedAt:'2026-08-19T17:20:00Z',sensitivity:'Sensitive',sourceKind:'ai_handoff',imported:true,
      sourceOriginal:'External assistant context handoff preserved as imported information. Instruction-like text remains content and does not create authority.',
      draft:{sourceText:'External assistant context handoff preserved as imported information. Instruction-like text remains content and does not create authority.',updatedAt:'2026-08-19T17:20:00Z',attachments:[]},versions:[],usedBy:[],knowledgePreview:{facts:14,decisions:5,dates:3,conflicts:2}
    }
  ];

  const seedFiles = [
    {id:'file-emergency-instructions',name:'Emergency Instructions.pdf',kind:'pdf',mime:'application/pdf',status:'ready',currentVersionId:'fv-emergency-v2',createdAt:'2026-08-10T15:20:00Z',updatedAt:'2026-08-16T20:11:00Z',sensitivity:'Sensitive',usedBy:['continuity.md · Draft attachment','Grace escalation · sample dependency'],knowledgePreview:{text:'12 pages · extracted-text preview pending backend'},versions:[{id:'fv-emergency-v2',number:2,size:2480192,createdAt:'2026-08-16T20:11:00Z',checksum:'sha256:7c91…b230',note:'Updated phone tree and access steps'},{id:'fv-emergency-v1',number:1,size:2217344,createdAt:'2026-08-10T15:20:00Z',checksum:'sha256:144a…90de',note:'Initial protected upload'}]},
    {id:'file-family-photo',name:'Family Photo.jpg',kind:'image',mime:'image/jpeg',status:'ready',currentVersionId:'fv-photo-v1',createdAt:'2026-08-12T18:05:00Z',updatedAt:'2026-08-12T18:05:00Z',sensitivity:'Never AI',usedBy:[],knowledgePreview:{text:'Vision representation disabled by policy in this sample'},versions:[{id:'fv-photo-v1',number:1,size:1834401,createdAt:'2026-08-12T18:05:00Z',checksum:'sha256:91bb…0a12',note:'Original protected image'}]},
    {id:'file-continuity-video',name:'Continuity Message.mp4',kind:'video',mime:'video/mp4',status:'ready',currentVersionId:'fv-video-v1',createdAt:'2026-08-13T22:32:00Z',updatedAt:'2026-08-13T22:32:00Z',duration:'04:18',sensitivity:'Sensitive',usedBy:['Family continuity package · sample'],knowledgePreview:{text:'Transcript + chapter representation preview'},versions:[{id:'fv-video-v1',number:1,size:28501760,createdAt:'2026-08-13T22:32:00Z',checksum:'sha256:faae…8871',note:'Private continuity video'}]},
    {id:'file-account-list',name:'Account Inventory.xlsx',kind:'spreadsheet',mime:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',status:'ready',currentVersionId:'fv-sheet-v3',createdAt:'2026-08-08T12:00:00Z',updatedAt:'2026-08-17T12:45:00Z',sensitivity:'Never AI',usedBy:['Recovery readiness · sample'],knowledgePreview:{text:'Spreadsheet extraction disabled in current Lab'},versions:[{id:'fv-sheet-v3',number:3,size:184921,createdAt:'2026-08-17T12:45:00Z',checksum:'sha256:029e…9911',note:'Added recovery ownership columns'},{id:'fv-sheet-v2',number:2,size:169500,createdAt:'2026-08-14T09:20:00Z',checksum:'sha256:fe21…03a8',note:'Updated providers'},{id:'fv-sheet-v1',number:1,size:152112,createdAt:'2026-08-08T12:00:00Z',checksum:'sha256:2a8c…72ba',note:'Initial inventory'}]},
    {id:'file-voice-note',name:'Voice Note.m4a',kind:'audio',mime:'audio/mp4',status:'ready',currentVersionId:'fv-audio-v1',createdAt:'2026-08-14T07:12:00Z',updatedAt:'2026-08-14T07:12:00Z',duration:'02:46',sensitivity:'Sensitive',usedBy:[],knowledgePreview:{text:'Transcript representation preview · not generated in Lab'},versions:[{id:'fv-audio-v1',number:1,size:3928440,createdAt:'2026-08-14T07:12:00Z',checksum:'sha256:bb17…ad23',note:'Private audio message'}]},
    {id:'file-continuity-notes',name:'Continuity Notes.md',kind:'text',mime:'text/markdown',status:'ready',currentVersionId:'fv-notes-v2',createdAt:'2026-08-09T16:40:00Z',updatedAt:'2026-08-17T15:33:00Z',sensitivity:'Standard',usedBy:[],knowledgePreview:{text:'Imported file text representation preview'},versions:[{id:'fv-notes-v2',number:2,size:19320,createdAt:'2026-08-17T15:33:00Z',checksum:'sha256:4410…c19d',note:'Expanded recovery notes'},{id:'fv-notes-v1',number:1,size:14880,createdAt:'2026-08-09T16:40:00Z',checksum:'sha256:9ca0…12d1',note:'Initial notes'}]}
  ];

  function ensureStores() {
    const content = load(CONTENT_KEY,{version:1,assets:[],links:{}});
    content.version = content.version || 1;
    content.assets = Array.isArray(content.assets) ? content.assets : [];
    content.links = content.links && typeof content.links === 'object' ? content.links : {};
    seedContent.forEach(item => { if (!content.assets.some(existing => existing.id === item.id)) content.assets.push(item); });
    save(CONTENT_KEY,content);

    const files = load(FILE_KEY,{version:1,assets:[]});
    files.version = files.version || 1;
    files.assets = Array.isArray(files.assets) ? files.assets : [];
    seedFiles.forEach(item => { if (!files.assets.some(existing => existing.id === item.id)) files.assets.push(item); });
    save(FILE_KEY,files);

    const meta = load(META_KEY,{version:1,folders:[],placements:{},archived:{}});
    meta.version = meta.version || 1;
    meta.folders = Array.isArray(meta.folders) ? meta.folders : [];
    meta.placements = meta.placements && typeof meta.placements === 'object' ? meta.placements : {};
    meta.archived = meta.archived && typeof meta.archived === 'object' ? meta.archived : {};
    seedFolders.forEach(folder => { if (!meta.folders.some(existing => existing.id === folder.id)) meta.folders.push(folder); });
    const placements = {
      'content:content-continuity-md':'folder-continuity','content:content-morning-template':'folder-personal','content:content-architecture-notes':'folder-cmx-architecture','content:content-personal-note':'folder-personal','content:content-ai-handoff':'folder-imports',
      'file:file-emergency-instructions':'folder-continuity','file:file-family-photo':'folder-family','file:file-continuity-video':'folder-media','file:file-account-list':'folder-continuity','file:file-voice-note':'folder-media','file:file-continuity-notes':'folder-continuity'
    };
    Object.entries(placements).forEach(([ref,folder]) => { if (!(ref in meta.placements)) meta.placements[ref] = folder; });
    save(META_KEY,meta);
  }

  ensureStores();

  function loadUi() {
    const stored = load(UI_KEY,{});
    return {
      version:1,
      scope:['all','recent','favorites','templates','imports'].includes(stored.scope) ? stored.scope : 'all',
      view:['list','grid'].includes(stored.view) ? stored.view : 'list',
      sort:['updated','name','type'].includes(stored.sort) ? stored.sort : 'updated',
      filter:['all','native','files','media','templates','imports'].includes(stored.filter) ? stored.filter : 'all',
      favorites:Array.isArray(stored.favorites) ? stored.favorites : [],
      recent:Array.isArray(stored.recent) ? stored.recent : [],
      currentFolderId:stored.currentFolderId || null,
      selectedRef:stored.selectedRef || null,
      inspectorTab:stored.inspectorTab || 'preview',
      query:''
    };
  }

  const ui = loadUi();
  let editorAssetId = null;
  let importMode = 'text';
  let commandOverlay = null;

  function saveUi() { save(UI_KEY,{...ui,query:''}); }
  function contentStore() { return load(CONTENT_KEY,{version:1,assets:[],links:{}}); }
  function fileStore() { return load(FILE_KEY,{version:1,assets:[]}); }
  function metaStore() { return load(META_KEY,{version:1,folders:[],placements:{},archived:{}}); }
  function automationsStore() { return load(AUTOMATIONS_KEY,{automations:[]}); }
  function folder(id) { return metaStore().folders.find(item => item.id === id) || null; }
  function content(id) { return contentStore().assets.find(item => item.id === id) || null; }
  function file(id) { return fileStore().assets.find(item => item.id === id) || null; }
  function currentFileVersion(item) { return item?.versions?.find(version => version.id === item.currentVersionId) || item?.versions?.[0] || null; }
  function refParts(ref) { const [type,...rest] = String(ref || '').split(':'); return {type,id:rest.join(':')}; }
  function itemForRef(ref) {
    const {type,id} = refParts(ref);
    if (type === 'folder') { const item = folder(id); return item ? {type,item,ref} : null; }
    if (type === 'content') { const item = content(id); return item ? {type,item,ref} : null; }
    if (type === 'file') { const item = file(id); return item ? {type,item,ref} : null; }
    return null;
  }

  function visibleContent() {
    return contentStore().assets.filter(item => item.libraryVisible === true || ['document','markdown','text','template'].includes(item.kind) || item.libraryRole === 'import');
  }

  function itemName(found) { return found?.item?.name || found?.item?.title || 'Library item'; }
  function updatedAt(found) {
    if (!found) return 0;
    const item = found.item;
    const value = item.updatedAt || item.draft?.updatedAt || currentFileVersion(item)?.createdAt || item.createdAt;
    return Date.parse(value || 0) || 0;
  }
  function relative(timestamp) {
    const time = typeof timestamp === 'number' ? timestamp : Date.parse(timestamp || 0);
    if (!time) return 'Unknown';
    const delta = Math.max(0,Date.now()-time), minute=60000,hour=3600000,day=86400000;
    if (delta < minute) return 'just now';
    if (delta < hour) return `${Math.floor(delta/minute)}m ago`;
    if (delta < day) return `${Math.floor(delta/hour)}h ago`;
    if (delta < day*7) return `${Math.floor(delta/day)}d ago`;
    return new Intl.DateTimeFormat(undefined,{month:'short',day:'numeric'}).format(new Date(time));
  }
  function formatSize(bytes) {
    const size = Number(bytes)||0;
    if (size < 1024) return `${size} B`;
    if (size < 1024**2) return `${(size/1024).toFixed(1)} KB`;
    if (size < 1024**3) return `${(size/1024**2).toFixed(1)} MB`;
    return `${(size/1024**3).toFixed(1)} GB`;
  }

  function visual(found) {
    if (!found) return {label:'ITEM',kind:'item'};
    if (found.type === 'folder') return {label:'DIR',kind:'folder'};
    if (found.type === 'content') {
      if (found.item.kind === 'markdown') return {label:'MD',kind:'markdown'};
      if (found.item.kind === 'text' && found.item.imported) return {label:'SRC',kind:'import'};
      if (found.item.kind === 'text') return {label:'TXT',kind:'text'};
      if (found.item.kind === 'template') return {label:'TPL',kind:'template'};
      return {label:'DOC',kind:'document'};
    }
    const kind = found.item.kind || 'file';
    return {label:{pdf:'PDF',image:'IMG',video:'VID',audio:'AUD',spreadsheet:'XLS',text:'TXT'}[kind] || 'FILE',kind};
  }

  function typeLabel(found) {
    if (found.type === 'folder') return 'Folder';
    if (found.type === 'file') return found.item.kind === 'spreadsheet' ? 'Spreadsheet' : `${found.item.kind || 'File'} file`;
    if (found.item.imported) return 'Imported source';
    if (found.item.kind === 'template') return 'Template';
    if (found.item.kind === 'markdown') return 'Markdown';
    if (found.item.kind === 'text') return 'Plain text';
    return 'Document';
  }

  function snippet(found) {
    if (found.type === 'folder') {
      const count = directItems(found.item.id).length;
      return `${count} item${count===1?'':'s'} · protected organization only`;
    }
    if (found.type === 'file') {
      const version = currentFileVersion(found.item);
      return `${found.item.mime || found.item.kind} · ${formatSize(version?.size)} · v${version?.number || 1}${found.item.duration ? ` · ${found.item.duration}` : ''}`;
    }
    const source = found.item.draft?.sourceText || found.item.draft?.plainText || found.item.sourceOriginal || '';
    return source.replace(/[#*_>`~\[\]()]/g,' ').replace(/\s+/g,' ').trim().slice(0,145) || 'Private native content';
  }

  function folderPath(id) {
    const path=[];
    let current=id ? folder(id) : null;
    const seen=new Set();
    while (current && !seen.has(current.id)) { seen.add(current.id); path.unshift(current); current=current.parentId ? folder(current.parentId) : null; }
    return path;
  }

  function directItems(folderId) {
    const meta = metaStore();
    const rows=[];
    meta.folders.filter(item => (item.parentId || null)===(folderId||null) && !meta.archived[`folder:${item.id}`]).forEach(item => rows.push({type:'folder',item,ref:`folder:${item.id}`}));
    visibleContent().filter(item => (meta.placements[`content:${item.id}`] || null)===(folderId||null) && !meta.archived[`content:${item.id}`]).forEach(item => rows.push({type:'content',item,ref:`content:${item.id}`}));
    fileStore().assets.filter(item => (meta.placements[`file:${item.id}`] || null)===(folderId||null) && !meta.archived[`file:${item.id}`]).forEach(item => rows.push({type:'file',item,ref:`file:${item.id}`}));
    return rows;
  }

  function allItems() {
    const meta=metaStore();
    return [
      ...meta.folders.filter(item => !meta.archived[`folder:${item.id}`]).map(item=>({type:'folder',item,ref:`folder:${item.id}`})),
      ...visibleContent().filter(item => !meta.archived[`content:${item.id}`]).map(item=>({type:'content',item,ref:`content:${item.id}`})),
      ...fileStore().assets.filter(item => !meta.archived[`file:${item.id}`]).map(item=>({type:'file',item,ref:`file:${item.id}`}))
    ];
  }

  function recordRecent(ref) {
    if (!itemForRef(ref)) return;
    ui.recent=[{ref,at:Date.now()},...ui.recent.filter(entry=>entry?.ref!==ref)].slice(0,40);
    saveUi();
  }

  function setScope(scope) {
    ui.scope=scope;
    ui.currentFolderId=null;
    ui.selectedRef=null;
    ui.inspectorTab='preview';
    saveUi();
    render();
  }

  function setFolder(id) {
    ui.scope='all';
    ui.currentFolderId=id || null;
    ui.selectedRef=null;
    ui.inspectorTab='preview';
    saveUi();
    render();
  }

  function filteredRows() {
    let rows;
    if (ui.scope === 'all') rows=directItems(ui.currentFolderId);
    else if (ui.scope === 'recent') rows=ui.recent.map(entry=>itemForRef(entry.ref)).filter(Boolean);
    else if (ui.scope === 'favorites') rows=ui.favorites.map(itemForRef).filter(Boolean);
    else if (ui.scope === 'templates') rows=allItems().filter(found=>found.type==='content' && found.item.kind==='template');
    else rows=allItems().filter(found=>found.type==='content' && (found.item.imported || found.item.libraryRole==='import'));

    const query=ui.query.trim().toLowerCase();
    if (query) rows=rows.filter(found=>`${itemName(found)} ${typeLabel(found)} ${snippet(found)}`.toLowerCase().includes(query));
    if (ui.filter !== 'all') rows=rows.filter(found=>{
      if (ui.filter==='native') return found.type==='content' && !found.item.imported && found.item.kind!=='template';
      if (ui.filter==='files') return found.type==='file';
      if (ui.filter==='media') return found.type==='file' && ['image','video','audio'].includes(found.item.kind);
      if (ui.filter==='templates') return found.type==='content' && found.item.kind==='template';
      if (ui.filter==='imports') return found.type==='content' && found.item.imported;
      return true;
    });

    const unique=new Map(rows.map(found=>[found.ref,found]));
    rows=[...unique.values()];
    rows.sort((a,b)=>{
      if (ui.scope==='all' && a.type!==b.type && (a.type==='folder'||b.type==='folder')) return a.type==='folder'?-1:1;
      if (ui.sort==='name') return itemName(a).localeCompare(itemName(b),undefined,{sensitivity:'base'});
      if (ui.sort==='type') return typeLabel(a).localeCompare(typeLabel(b)) || itemName(a).localeCompare(itemName(b));
      return updatedAt(b)-updatedAt(a) || itemName(a).localeCompare(itemName(b));
    });
    return rows;
  }

  function renderFolderTree() {
    const meta=metaStore();
    const renderLevel=(parentId,depth=0)=>meta.folders.filter(item=>(item.parentId||null)===(parentId||null) && !meta.archived[`folder:${item.id}`]).sort((a,b)=>a.name.localeCompare(b.name)).map(item=>{
      const children=renderLevel(item.id,depth+1);
      return `<div class="lib-folder-node"><button type="button" class="lib-folder-button ${ui.currentFolderId===item.id&&ui.scope==='all'?'is-active':''}" data-folder-open="${esc(item.id)}"><span>▸</span><strong>${esc(item.name)}</strong><small>${directItems(item.id).length}</small></button>${children?`<div class="lib-folder-children">${children}</div>`:''}</div>`;
    }).join('');
    $('#folderTree').innerHTML=renderLevel(null);
  }

  function renderBreadcrumb() {
    const path=folderPath(ui.currentFolderId);
    const pieces=[`<button type="button" data-folder-open="">Library</button>`];
    path.forEach(item=>pieces.push(`<i>/</i><button type="button" data-folder-open="${esc(item.id)}">${esc(item.name)}</button>`));
    $('#breadcrumb').innerHTML=pieces.join('');
    $('#folderUp').disabled=!ui.currentFolderId;
    const parent=ui.currentFolderId ? folder(folder(ui.currentFolderId)?.parentId) : null;
    $('#parentRow').hidden=!ui.currentFolderId;
    $('#parentButton').textContent=`← Back to ${parent?.name || 'Library'}`;
  }

  function renderContext() {
    const rows=filteredRows();
    const current=folder(ui.currentFolderId);
    const titles={all:current?.name || 'Everything',recent:'Recent',favorites:'Favorites',templates:'Templates',imports:'Imports'};
    const descriptions={all:current ? `Items organized inside ${current.name}. Folder placement does not create permission.` : 'Documents, files, media, templates and imported knowledge in one private information layer.',recent:'Recently opened stable Library references.',favorites:'Items you marked for faster access. Favorite status does not change ownership or authority.',templates:'Reusable native starting points that create independent working content.',imports:'Preserved external information and handoffs kept distinguishable from accepted Continuum truth.'};
    $('#contextTitle').textContent=titles[ui.scope];
    $('#contextDescription').textContent=descriptions[ui.scope];
    $('#contextKicker').textContent=ui.scope==='all' ? (current ? 'Folder · browser-local sample' : 'Protected information · sample data') : 'Smart Library view · browser-local';
    const all=allItems();
    $('#documentStat').textContent=all.filter(item=>item.type==='content').length;
    $('#fileStat').textContent=all.filter(item=>item.type==='file').length;
    $('#versionStat').textContent=all.reduce((sum,found)=>sum+(Array.isArray(found.item.versions)?found.item.versions.length:0),0);
    $('#rootItemCount').textContent=`${all.length} items`;
    $('#allCount').textContent=all.length;
    $('#peopleCount');
    return rows;
  }

  function renderItems(rows) {
    const container=$('#libraryItems');
    container.dataset.view=ui.view;
    container.innerHTML=rows.map(found=>{
      const v=visual(found), favorite=ui.favorites.includes(found.ref), version=found.type==='file'?currentFileVersion(found.item):found.item.versions?.[0];
      const chip=found.type==='folder'?'Folder':found.type==='content'?(found.item.imported?'Import':found.item.kind==='template'?'Template':found.item.kind):`v${version?.number||1}`;
      return `<article class="lib-item ${ui.selectedRef===found.ref?'is-selected':''}" data-item-ref="${esc(found.ref)}" tabindex="0" role="button"><span class="lib-item-icon" data-kind="${esc(v.kind)}">${esc(v.label)}</span><span class="lib-item-copy"><strong>${esc(itemName(found))}</strong><small>${esc(snippet(found))}</small><em>${esc(typeLabel(found))}${found.item.sensitivity?` · ${esc(found.item.sensitivity)}`:''}</em></span><span class="lib-item-meta"><span class="lib-chip">${esc(chip)}</span><time>${esc(relative(updatedAt(found)))}</time></span><button class="lib-favorite ${favorite?'is-active':''}" type="button" data-favorite="${esc(found.ref)}" aria-label="${favorite?'Remove from Favorites':'Add to Favorites'}">${favorite?'★':'☆'}</button></article>`;
    }).join('');
    $('#emptyState').hidden=rows.length>0;
  }

  function previewMarkup(found) {
    if (found.type==='folder') return `<div class="lib-file-stage"><div><span class="lib-file-symbol">DIR</span><strong>${esc(itemName(found))}</strong><small>${directItems(found.item.id).length} direct items · open to browse</small></div></div>`;
    if (found.type==='content') {
      const source=found.item.draft?.sourceText || found.item.sourceOriginal || '';
      return `<div class="lib-preview-body"><div class="lib-doc-preview"><h3>${esc(itemName(found))}</h3><p>${esc(source.slice(0,900))}${source.length>900?'…':''}</p></div></div>`;
    }
    const item=found.item;
    if (item.kind==='video') return `<div class="lib-file-stage lib-video-stage"><div class="lib-video-poster"><span class="lib-play">▶</span></div><div class="lib-video-bar"><span>0:00</span><span class="lib-video-progress"><i></i></span><span>${esc(item.duration||'--:--')}</span></div></div>`;
    if (item.kind==='audio') return `<div class="lib-file-stage lib-audio-stage"><div class="lib-wave">${'<i></i>'.repeat(36)}</div><div class="lib-audio-controls"><button type="button" aria-label="Preview play button">▶</button><span>Metadata preview only · ${esc(item.duration||'--:--')} · no audio bytes stored in Lab</span></div></div>`;
    if (item.kind==='image') return `<div class="lib-file-stage lib-image-stage"><div><span class="lib-file-symbol">IMG</span><strong>${esc(item.name)}</strong><small>Protected image preview shell · actual bytes are not stored in Lab</small></div></div>`;
    if (item.kind==='pdf') return `<div class="lib-file-stage lib-pdf-stage"><div class="lib-pdf-page">${'<i></i>'.repeat(10)}</div></div>`;
    if (item.kind==='spreadsheet') return `<div class="lib-file-stage lib-sheet-stage">${'<i></i>'.repeat(20)}</div>`;
    return `<div class="lib-file-stage"><div><span class="lib-file-symbol">${esc(visual(found).label)}</span><strong>${esc(item.name)}</strong><small>Exact-version viewer shell · binary bytes not stored in Lab</small></div></div>`;
  }

  function computedUses(found) {
    const uses=[...(found.item.usedBy || [])];
    if (found.type==='file') {
      contentStore().assets.forEach(asset=>(asset.draft?.attachments||[]).forEach(ref=>{ if (ref.fileAssetId===found.item.id) uses.push(`${asset.title || 'Private content'} · Draft attachment`); }));
    }
    if (found.type==='content') {
      const serialized=JSON.stringify(automationsStore());
      if (serialized.includes(found.item.id)) uses.push('Automation Lab · local reference');
    }
    return [...new Set(uses)];
  }

  function inspectorSection(found,tab) {
    if (tab==='preview') return `<section class="lib-inspector-section"><div class="lib-preview"><div class="lib-preview-head"><span>${esc(typeLabel(found).toUpperCase())} · LAB PREVIEW</span><span>${found.item.sensitivity?esc(found.item.sensitivity):'Private'}</span></div>${previewMarkup(found)}</div>${found.type==='content'&&!found.item.imported?`<div class="lib-inspector-actions"><button class="accent" type="button" data-edit-content="${esc(found.item.id)}">Edit Draft</button><button type="button" data-save-version="${esc(found.item.id)}">Save version</button></div>`:''}${found.type==='folder'?`<div class="lib-inspector-actions"><button class="accent" type="button" data-folder-open="${esc(found.item.id)}">Open folder</button><button type="button" data-favorite="${esc(found.ref)}">${ui.favorites.includes(found.ref)?'Remove favorite':'Favorite'}</button></div>`:''}</section>`;
    if (tab==='details') {
      const version=found.type==='file'?currentFileVersion(found.item):found.item.versions?.[0];
      const placed=metaStore().placements[found.ref];
      return `<section class="lib-inspector-section"><div class="lib-detail-grid"><div><small>Type</small><strong>${esc(typeLabel(found))}</strong></div><div><small>Privacy</small><strong>${esc(found.item.sensitivity||'Private')}</strong></div><div><small>Folder</small><strong>${esc(folder(placed)?.name||'Library root')}</strong></div><div><small>Updated</small><strong>${esc(relative(updatedAt(found)))}</strong></div>${found.type==='file'?`<div><small>Media type</small><strong>${esc(found.item.mime||'Unknown')}</strong></div><div><small>Current version</small><strong>v${version?.number||1}</strong></div>`:`<div><small>Source</small><strong>${esc(found.item.sourceKind||'native_content')}</strong></div><div><small>Versions</small><strong>${found.item.versions?.length||0}</strong></div>`}</div><div class="lib-section-card"><header><strong>Identity</strong><span>LAB REFERENCE</span></header><div class="lib-used-list"><div class="lib-used-row"><b>ID</b><span>${esc(found.item.id)}</span><em></em></div>${version?.id?`<div class="lib-used-row"><b>Current version</b><span>${esc(version.id)}</span><em></em></div>`:''}</div></div></section>`;
    }
    if (tab==='versions') {
      const versions=Array.isArray(found.item.versions)?found.item.versions:[];
      return `<section class="lib-inspector-section"><div class="lib-section-card"><header><strong>Version history</strong><span>${versions.length} SAVED</span></header><div class="lib-version-list">${versions.length?versions.map((version,index)=>`<div class="lib-version-row"><b>v${esc(version.number||versions.length-index)}</b><span>${esc(version.note||'Saved immutable sample version')} · ${esc(relative(version.createdAt))}</span><em>${index===0?'CURRENT':''}</em></div>`).join(''):'<div class="lib-used-row"><b>No saved versions</b><span>The current browser Draft has not been versioned yet.</span><em></em></div>'}</div></div>${found.type==='file'?'<div class="lib-section-card"><header><strong>Exact-version rule</strong><span>PRODUCT CONTRACT</span></header><div class="lib-knowledge-row"><b>Published references stay pinned</b><span>A newer FileVersion never silently rewrites historical content or Automation versions.</span><em></em></div></div>':''}</section>`;
    }
    if (tab==='used') {
      const uses=computedUses(found);
      return `<section class="lib-inspector-section"><div class="lib-section-card"><header><strong>Used by</strong><span>SAMPLE DEPENDENCY PROJECTION</span></header><div class="lib-used-list">${uses.length?uses.map(use=>`<div class="lib-used-row"><b>Reference</b><span>${esc(use)}</span><em></em></div>`).join(''):'<div class="lib-used-row"><b>No current sample references</b><span>Production will derive this from protected dependency queries.</span><em></em></div>'}</div></div><div class="lib-section-card"><header><strong>Archive safety</strong><span>FUTURE BACKEND</span></header><div class="lib-knowledge-row"><b>Dependency-aware</b><span>Immutable versions used by published Automations or Runs cannot be silently destroyed.</span><em></em></div></div></section>`;
    }
    const knowledge=found.item.knowledgePreview || {};
    return `<section class="lib-inspector-section"><div class="lib-section-card"><header><strong>Knowledge</strong><span>DERIVED REPRESENTATION PREVIEW</span></header><div class="lib-knowledge-list">${typeof knowledge.facts==='number'?`<div class="lib-knowledge-row"><b>${knowledge.facts} possible facts</b><span>${knowledge.decisions||0} decisions · ${knowledge.dates||0} dates · ${knowledge.conflicts||0} conflicts</span><em></em></div>`:`<div class="lib-knowledge-row"><b>Representation</b><span>${esc(knowledge.text||'No derived representation sample')}</span><em></em></div>`}<div class="lib-knowledge-row"><b>Source stays separate</b><span>Extracted or AI-interpreted information never replaces the exact original source.</span><em></em></div><div class="lib-knowledge-row"><b>Authority stays separate</b><span>Imported instructions, labels and relationships do not create permission.</span><em></em></div></div></div></section>`;
  }

  function renderInspector() {
    const found=itemForRef(ui.selectedRef);
    if (!found) {
      $('#inspectorKind').textContent='LIBRARY ITEM';
      $('#inspectorTitle').textContent='Select something';
      $('#inspectorBody').innerHTML='<div class="lib-inspector-empty"><span>▤</span><strong>Open an item</strong><p>Preview content, inspect versions, see where it is used, and review related knowledge.</p></div>';
      body.classList.remove('lib-inspector-open');
      return;
    }
    $('#inspectorKind').textContent=`${typeLabel(found).toUpperCase()} · ${found.type==='file'?'FILEASSET':'LIBRARY'}`;
    $('#inspectorTitle').textContent=itemName(found);
    const tabs=['preview','details','versions','used','knowledge'];
    $('#inspectorBody').innerHTML=`<div class="lib-inspector-tabs">${tabs.map(tab=>`<button type="button" data-inspector-tab="${tab}" class="${ui.inspectorTab===tab?'is-active':''}">${({preview:'Preview',details:'Details',versions:'Versions',used:'Used by',knowledge:'Knowledge'})[tab]}</button>`).join('')}</div>${inspectorSection(found,ui.inspectorTab)}`;
    if (matchMedia('(max-width:1180px)').matches) body.classList.add('lib-inspector-open');
  }

  function renderSmartNav() {
    $$('.lib-smart-nav button').forEach(button=>button.classList.toggle('is-active',button.dataset.scope===ui.scope));
    $$('.lib-view-toggle button').forEach(button=>button.classList.toggle('is-active',button.dataset.view===ui.view));
    $('#sortSelect').value=ui.sort;
    $('#filterLabel').textContent=({all:'All types',native:'Native',files:'Files',media:'Media',templates:'Templates',imports:'Imports'})[ui.filter];
  }

  function render() {
    renderFolderTree();
    renderBreadcrumb();
    const rows=renderContext();
    renderSmartNav();
    renderItems(rows);
    renderInspector();
    saveUi();
  }

  function selectItem(ref) {
    const found=itemForRef(ref);
    if (!found) return;
    if (found.type==='folder') { setFolder(found.item.id); return; }
    ui.selectedRef=ref;
    ui.inspectorTab='preview';
    recordRecent(ref);
    renderItems(filteredRows());
    renderInspector();
    saveUi();
  }

  function toggleFavorite(ref) {
    if (!itemForRef(ref)) return;
    ui.favorites=ui.favorites.includes(ref)?ui.favorites.filter(item=>item!==ref):[ref,...ui.favorites];
    saveUi();
    render();
  }

  function openDialog(id) { const dialog=$(`#${id}`); if (dialog && !dialog.open) dialog.showModal(); }
  function closeDialog(id) { const dialog=$(`#${id}`); if (dialog?.open) dialog.close(); }

  function captureName(type,callback) {
    const dialog=document.createElement('dialog');
    dialog.className='lib-dialog';
    dialog.innerHTML=`<form method="dialog" class="lib-dialog-shell"><header><div><span>LIBRARY · LAB</span><h2>${type==='folder'?'New folder':'New content'}</h2></div><button type="button" data-name-close>×</button></header><div class="lib-import-body"><label class="lib-import-label">Name<input type="text" data-name-input autocomplete="off" placeholder="${type==='folder'?'Folder name':'Untitled'}" /></label><button type="submit" class="lib-primary lib-import-save">Continue</button></div></form>`;
    document.body.append(dialog);
    const form=$('form',dialog),input=$('[data-name-input]',dialog);
    $('[data-name-close]',dialog).addEventListener('click',()=>dialog.close());
    form.addEventListener('submit',event=>{event.preventDefault();const name=input.value.trim();if(!name)return;dialog.close();callback(name);});
    dialog.addEventListener('close',()=>dialog.remove());
    dialog.showModal();
    requestAnimationFrame(()=>input.focus());
  }

  function createFolder(name) {
    const meta=metaStore();
    const sibling=meta.folders.some(item=>(item.parentId||null)===(ui.currentFolderId||null) && item.name.trim().toLowerCase()===name.toLowerCase());
    if (sibling) { window.alert('A folder with that name already exists here in the Lab.'); return; }
    const item={id:makeId('folder'),name,parentId:ui.currentFolderId||null,createdAt:now(),updatedAt:now()};
    meta.folders.push(item); save(META_KEY,meta); closeDialog('newDialog'); setFolder(item.id);
  }

  function createContent(kind,name) {
    const store=contentStore();
    const item={id:makeId('content'),title:name,kind,libraryVisible:true,libraryRole:kind==='template'?'template':'document',createdAt:now(),updatedAt:now(),sensitivity:'Standard',sourceKind:'native_content',draft:{sourceText:'',updatedAt:now(),attachments:[]},versions:[],usedBy:[],knowledgePreview:{facts:0,decisions:0,dates:0,conflicts:0}};
    store.assets.push(item); save(CONTENT_KEY,store);
    const meta=metaStore(); meta.placements[`content:${item.id}`]=ui.currentFolderId||null; save(META_KEY,meta);
    closeDialog('newDialog'); ui.selectedRef=`content:${item.id}`; saveUi(); openEditor(item.id); render();
  }

  function openEditor(id) {
    const item=content(id); if (!item) return;
    editorAssetId=id;
    $('#editorKicker').textContent=`${item.kind.toUpperCase()} · BROWSER-LOCAL DRAFT`;
    $('#editorTitle').textContent=item.title || 'Untitled';
    $('#editorName').value=item.title || '';
    $('#editorSource').value=item.draft?.sourceText || item.draft?.plainText || '';
    $('#editorPreview').hidden=true; $('#editorSource').hidden=false; $('#editorPreviewToggle').textContent='Preview';
    $('#editorStatus').textContent=`Browser-local Draft · ${item.versions?.length||0} saved version${item.versions?.length===1?'':'s'}`;
    openDialog('editorDialog');
  }

  function persistEditor(saveVersion=false) {
    const store=contentStore(); const item=store.assets.find(asset=>asset.id===editorAssetId); if(!item)return;
    const title=$('#editorName').value.trim() || 'Untitled'; const source=$('#editorSource').value;
    item.title=title; item.draft={...(item.draft||{}),sourceText:source,updatedAt:now()}; item.updatedAt=now(); item.libraryVisible=true;
    item.versions=Array.isArray(item.versions)?item.versions:[];
    if (saveVersion) {
      const next=Math.max(0,...item.versions.map(version=>Number(version.number)||0))+1;
      item.versions.unshift({id:makeId('cv'),number:next,createdAt:now(),sourceText:source,note:'Saved from standalone Library Lab'});
    }
    save(CONTENT_KEY,store); $('#editorTitle').textContent=title; $('#editorStatus').textContent=saveVersion?`Saved immutable sample v${item.versions[0].number}`:'Draft saved in this browser'; ui.selectedRef=`content:${item.id}`; saveUi(); render();
  }

  function storeImport() {
    if (importMode==='files') { closeDialog('importDialog'); openDialog('uploadDialog'); return; }
    const source=$('#importSource').value; if (!source.trim()) return;
    if (importMode==='json') { try { JSON.parse(source); } catch (_) { window.alert('This Lab preview expects valid JSON in JSON mode. Nothing was stored.'); return; } }
    const title=$('#importName').value.trim() || `${importMode==='markdown'?'Markdown':importMode==='json'?'JSON':'Text'} import · ${new Intl.DateTimeFormat(undefined,{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}).format(new Date())}`;
    const store=contentStore(); const item={id:makeId('import'),title,kind:importMode==='markdown'?'markdown':'text',libraryVisible:true,libraryRole:'import',createdAt:now(),updatedAt:now(),sensitivity:'Sensitive',sourceKind:importMode==='json'?'json':importMode==='markdown'?'markdown':'direct_text',imported:true,sourceOriginal:source,draft:{sourceText:source,updatedAt:now(),attachments:[]},versions:[],usedBy:[],knowledgePreview:{facts:0,decisions:0,dates:0,conflicts:0}};
    store.assets.push(item); save(CONTENT_KEY,store); const meta=metaStore(); meta.placements[`content:${item.id}`]='folder-imports'; save(META_KEY,meta);
    $('#importSource').value=''; $('#importName').value=''; closeDialog('importDialog'); ui.scope='imports'; ui.currentFolderId=null; ui.selectedRef=`content:${item.id}`; recordRecent(ui.selectedRef); render();
  }

  function filterMenu() {
    $('.lib-filter-menu')?.remove();
    const menu=document.createElement('div'); menu.className='lib-filter-menu';
    const choices=[['all','All types'],['native','Native content'],['files','All files'],['media','Media'],['templates','Templates'],['imports','Imports']];
    menu.innerHTML=choices.map(([key,label])=>`<button type="button" data-filter-choice="${key}" class="${ui.filter===key?'is-active':''}">${label}</button>`).join('');
    document.body.append(menu); $('#filterButton').setAttribute('aria-expanded','true');
  }

  const commandItems=[
    {group:'Library',title:'Search Library',desc:'Focus the current Library search',action:()=>$('#librarySearch').focus()},
    {group:'Library',title:'New document',desc:'Create browser-local native content',action:()=>captureName('content',name=>createContent('document',name))},
    {group:'Library',title:'Import knowledge',desc:'Paste text, Markdown or JSON',action:()=>openDialog('importDialog')},
    {group:'Library',title:'Recent',desc:'Recently opened Library items',action:()=>setScope('recent')},
    {group:'Library',title:'Favorites',desc:'Your favorite stable references',action:()=>setScope('favorites')},
    {group:'Continuum',title:'Control Center',desc:'Operational home',href:'/lab/control/'},
    {group:'Continuum',title:'Directory',desc:'People, organizations and groups',href:'/lab/directory/'},
    {group:'Continuum',title:'Automations',desc:'Automation authoring Lab',href:'/lab/automations/'},
    {group:'Continuum',title:'Check In',desc:'LIVE protected Check In',href:'/checkin/'},
    {group:'Continuum',title:'Spaces',desc:'Briefing and context experience',href:'/spaces/'},
    {group:'Appearance',title:'Toggle theme',desc:'Switch light / rich-black dark',action:()=>toggleTheme()}
  ];

  function closeCommand() {
    if (!commandOverlay) return;
    commandOverlay.remove(); commandOverlay=null; $('.lib-shell').inert=false; $('.lib-mobile-nav').inert=false; body.classList.remove('lib-command-open'); $('#commandButton')?.focus({preventScroll:true});
  }

  function renderCommandResults(query='') {
    if (!commandOverlay) return;
    const list=$('.lib-command-results',commandOverlay); const q=query.trim().toLowerCase(); const items=commandItems.filter(item=>`${item.group} ${item.title} ${item.desc}`.toLowerCase().includes(q));
    let group=''; list.innerHTML=items.map((item,index)=>{const heading=item.group!==group?(group=item.group,`<div class="lib-command-group">${esc(item.group)}</div>`):'';return `${heading}<button type="button" class="lib-command-result ${index===0?'is-active':''}" data-command-index="${commandItems.indexOf(item)}"><span><strong>${esc(item.title)}</strong><small>${esc(item.desc)}</small></span><kbd>↵</kbd></button>`;}).join('') || '<div class="lib-command-group">No matches</div>';
  }

  function openCommand() {
    if (commandOverlay) return;
    commandOverlay=document.createElement('div'); commandOverlay.className='lib-command-overlay'; commandOverlay.innerHTML='<div class="lib-command-palette" role="dialog" aria-modal="true" aria-label="Continuum command palette"><div class="lib-command-input"><input type="search" placeholder="Search commands" aria-label="Search commands" /></div><div class="lib-command-results"></div></div>';
    document.body.append(commandOverlay); $('.lib-shell').inert=true; $('.lib-mobile-nav').inert=true; body.classList.add('lib-command-open'); renderCommandResults(); const input=$('input',commandOverlay); requestAnimationFrame(()=>input.focus());
    input.addEventListener('input',()=>renderCommandResults(input.value));
    commandOverlay.addEventListener('click',event=>{if(event.target===commandOverlay){closeCommand();return;}const button=event.target.closest('[data-command-index]');if(!button)return;const item=commandItems[Number(button.dataset.commandIndex)];closeCommand();if(item.href)window.location.href=item.href;else item.action?.();});
  }

  function toggleTheme() {
    const next=root.dataset.theme==='dark'?'light':'dark'; root.dataset.theme=next; try{localStorage.setItem(THEME_KEY,next);}catch(_){}; $('meta[name="theme-color"]')?.setAttribute('content',next==='dark'?'#060708':'#f5f7fa');
  }

  document.addEventListener('click',event=>{
    const folderButton=event.target.closest('[data-folder-open]'); if(folderButton){event.preventDefault();setFolder(folderButton.dataset.folderOpen||null);return;}
    const favorite=event.target.closest('[data-favorite]'); if(favorite){event.stopPropagation();toggleFavorite(favorite.dataset.favorite);return;}
    const item=event.target.closest('[data-item-ref]'); if(item){selectItem(item.dataset.itemRef);return;}
    const scope=event.target.closest('[data-scope]'); if(scope){setScope(scope.dataset.scope);return;}
    const view=event.target.closest('[data-view]'); if(view){ui.view=view.dataset.view;saveUi();render();return;}
    const tab=event.target.closest('[data-inspector-tab]'); if(tab){ui.inspectorTab=tab.dataset.inspectorTab;saveUi();renderInspector();return;}
    const edit=event.target.closest('[data-edit-content]'); if(edit){openEditor(edit.dataset.editContent);return;}
    const saveVersion=event.target.closest('[data-save-version]'); if(saveVersion){editorAssetId=saveVersion.dataset.saveVersion;persistEditor(true);renderInspector();return;}
    const close=event.target.closest('[data-dialog-close]'); if(close){closeDialog(close.dataset.dialogClose);return;}
    const create=event.target.closest('[data-create]'); if(create){const type=create.dataset.create;if(type==='upload'){closeDialog('newDialog');openDialog('uploadDialog');return;}captureName(type==='folder'?'folder':'content',name=>type==='folder'?createFolder(name):createContent(type,name));return;}
    const filter=event.target.closest('[data-filter-choice]'); if(filter){ui.filter=filter.dataset.filterChoice;saveUi();$('.lib-filter-menu')?.remove();$('#filterButton').setAttribute('aria-expanded','false');render();return;}
  });

  document.addEventListener('keydown',event=>{
    if ((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==='k'){event.preventDefault();openCommand();return;}
    if (event.key==='Escape'&&commandOverlay){event.preventDefault();closeCommand();return;}
    if (['Enter',' '].includes(event.key)){const item=document.activeElement?.closest?.('[data-item-ref]');if(item){event.preventDefault();selectItem(item.dataset.itemRef);}}
  });

  $('#themeToggle').addEventListener('click',toggleTheme);
  $('#commandButton').addEventListener('click',openCommand);
  $('#librarySearch').addEventListener('input',event=>{ui.query=event.target.value;renderItems(filteredRows());});
  $('#sortSelect').addEventListener('change',event=>{ui.sort=event.target.value;saveUi();render();});
  $('#filterButton').addEventListener('click',()=>$('.lib-filter-menu')?($('.lib-filter-menu').remove(),$('#filterButton').setAttribute('aria-expanded','false')):filterMenu());
  $('#folderUp').addEventListener('click',()=>{const current=folder(ui.currentFolderId);setFolder(current?.parentId||null);});
  $('#parentButton').addEventListener('click',()=>{const current=folder(ui.currentFolderId);setFolder(current?.parentId||null);});
  $('#newButton').addEventListener('click',()=>openDialog('newDialog'));
  $('#newFolderQuick').addEventListener('click',()=>captureName('folder',createFolder));
  $('#importButton').addEventListener('click',()=>openDialog('importDialog'));
  $('#mobileMore').addEventListener('click',()=>openDialog('moreDialog'));
  $('#closeInspector').addEventListener('click',()=>body.classList.remove('lib-inspector-open'));
  $('#editorForm').addEventListener('submit',event=>{event.preventDefault();persistEditor(false);});
  $('#saveVersionButton').addEventListener('click',()=>persistEditor(true));
  $('#editorPreviewToggle').addEventListener('click',()=>{const preview=$('#editorPreview'),source=$('#editorSource'),show=preview.hidden;preview.hidden=!show;source.hidden=show;if(show){preview.textContent=source.value;$('#editorPreviewToggle').textContent='Write';}else $('#editorPreviewToggle').textContent='Preview';});
  $('#storeImport').addEventListener('click',storeImport);
  $$('.lib-import-tabs button').forEach(button=>button.addEventListener('click',()=>{importMode=button.dataset.importMode;$$('.lib-import-tabs button').forEach(item=>item.classList.toggle('is-active',item===button));const files=importMode==='files';$('#importSource').hidden=files;$('#importFilesPreview').hidden=!files;$('#storeImport').textContent=files?'Continue to upload preview':'Store local source';}));
  $('#collapseFolders').addEventListener('click',event=>{const tree=$('#folderTree');tree.hidden=!tree.hidden;event.currentTarget.textContent=tree.hidden?'Expand':'Collapse';});

  window.addEventListener('storage',event=>{if([CONTENT_KEY,FILE_KEY,META_KEY,UI_KEY].includes(event.key))render();});
  root.dataset.continuumLibrary='standalone-v1';
  render();
})();