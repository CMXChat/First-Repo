(() => {
  "use strict";

  const CONTENT_KEY = "cmx-lab-content-assets-v1";
  const FILE_KEY = "cmx-lab-file-assets-v1";
  let state = {tab:"all",query:"",contextContentId:null,docId:null,linkRange:null};
  let saveTimer = null;

  const esc = value => String(value ?? "").replace(/[&<>'"]/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[ch]));
  const makeId = prefix => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,7)}`;
  const now = () => new Date().toISOString();

  function loadContent() {
    try {
      const parsed = JSON.parse(localStorage.getItem(CONTENT_KEY));
      if (parsed?.version === 1 && Array.isArray(parsed.assets)) return parsed;
    } catch {}
    return {version:1,assets:[],links:{}};
  }
  function saveContent(store) { localStorage.setItem(CONTENT_KEY,JSON.stringify(store)); }
  function loadFiles() {
    try {
      const parsed=JSON.parse(localStorage.getItem(FILE_KEY));
      if(parsed?.version===1&&Array.isArray(parsed.assets)) return parsed;
    } catch {}
    return {version:1,assets:[]};
  }
  function plainText(html) { const n=document.createElement("div");n.innerHTML=String(html||"");return(n.innerText||n.textContent||"").replace(/\n{3,}/g,"\n\n").trim(); }

  function ensureSeedDocument() {
    const store=loadContent();
    if (!store.assets.some(a=>a.kind==="document")) {
      store.assets.push({
        id:"content-doc-continuity-plan",kind:"document",title:"Continuity Plan",createdAt:"2026-08-17T18:00:00Z",updatedAt:"2026-08-17T18:00:00Z",
        draft:{revision:1,labFormat:"sanitized_html_v1",subject:"",html:"<h1>Continuity Plan</h1><p>This native Check In document is editable in the private Library.</p><h2>What matters first</h2><ul><li>Verify the trigger</li><li>Contact the approved audience</li><li>Use the protected records attached to the plan</li></ul>",plainText:"Continuity Plan\n\nThis native Check In document is editable in the private Library.",linkedDocuments:[],attachments:[],updatedAt:"2026-08-17T18:00:00Z"},
        versions:[{id:"cv-doc-continuity-v1",number:1,createdAt:"2026-08-17T18:00:00Z",html:"<h1>Continuity Plan</h1><p>This native Check In document is editable in the private Library.</p>",plainText:"Continuity Plan\n\nThis native Check In document is editable in the private Library."}]
      });
      saveContent(store);
    }
  }

  function fileVersion(file){return file?.versions?.find(v=>v.id===file.currentVersionId)||file?.versions?.[0]||null;}
  function formatSize(bytes){const size=Number(bytes)||0;if(size<1024)return`${size} B`;if(size<1024**2)return`${(size/1024).toFixed(1)} KB`;if(size<1024**3)return`${(size/1024**2).toFixed(1)} MB`;return`${(size/1024**3).toFixed(1)} GB`;}
  function iconForFile(kind){return{pdf:"PDF",image:"IMG",video:"VID",audio:"AUD",spreadsheet:"XLS",text:"TXT"}[kind]||"FILE";}

  function currentContextId(){
    const overlay=document.querySelector(".content-editor-overlay");
    const stepId=overlay?.dataset.contentEditor;
    if(!stepId)return null;
    const store=loadContent(); return store.links?.[stepId]||null;
  }

  function enhanceLibraryButtons(){
    const top=document.querySelector(".top-actions");
    if(top&&!top.querySelector("[data-library-open-global]")){
      const button=document.createElement("button");button.type="button";button.className="library-top-button";button.dataset.libraryOpenGlobal="";button.textContent="Library";top.insertBefore(button,top.firstChild);
    }
    const editor=document.querySelector(".content-editor-overlay .content-editor-main");
    const attachment=editor?.querySelector(".content-attachments-card");
    if(editor&&attachment&&!editor.querySelector("[data-library-shortcut]")){
      const node=document.createElement("section");node.className="content-library-shortcut";node.dataset.libraryShortcut="";
      node.innerHTML=`<div><small>PRIVATE LIBRARY</small><strong>Documents + files</strong><span>Create a native document or reuse protected material without provider drafts.</span></div><button type="button" data-library-open-context>Open Library</button>`;
      attachment.before(node);
    }
    enhanceDocumentAttachmentSummary();
  }

  function linkedDocumentRefs(content){return Array.isArray(content?.draft?.linkedDocuments)?content.draft.linkedDocuments:[];}
  function enhanceDocumentAttachmentSummary(){
    const attachment=document.querySelector(".content-editor-overlay .content-attachments-card"); if(!attachment)return;
    const contextId=currentContextId(); if(!contextId)return;
    const store=loadContent(); const context=store.assets.find(a=>a.id===contextId); if(!context)return;
    let node=attachment.querySelector("[data-attached-document-summary]");
    if(!node){node=document.createElement("div");node.className="attached-document-summary";node.dataset.attachedDocumentSummary="";attachment.append(node);}
    const refs=linkedDocumentRefs(context);
    node.innerHTML=refs.length?refs.map(ref=>{const doc=store.assets.find(a=>a.id===ref.contentAssetId);return doc?`<button type="button" data-library-doc-open="${esc(doc.id)}"><span>DOC</span><strong>${esc(doc.title)}</strong><small>draft r${ref.draftRevision||doc.draft?.revision||1} · linked</small></button>`:"";}).join(""):`<span class="document-link-empty">No native Check In documents linked yet.</span>`;
  }

  function attachDocument(docId){
    if(!state.contextContentId)return;
    const store=loadContent(); const context=store.assets.find(a=>a.id===state.contextContentId); const doc=store.assets.find(a=>a.id===docId); if(!context||!doc)return;
    context.draft={...(context.draft||{})};
    const refs=linkedDocumentRefs(context).filter(ref=>ref.contentAssetId!==docId);
    refs.push({contentAssetId:doc.id,draftRevision:doc.draft?.revision||1,attachedAt:now()});
    context.draft.linkedDocuments=refs;context.draft.updatedAt=now();context.updatedAt=now();saveContent(store);rerenderLibrary();
  }
  function detachDocument(docId){
    if(!state.contextContentId)return;
    const store=loadContent(); const context=store.assets.find(a=>a.id===state.contextContentId); if(!context)return;
    context.draft={...(context.draft||{}),linkedDocuments:linkedDocumentRefs(context).filter(ref=>ref.contentAssetId!==docId),updatedAt:now()};context.updatedAt=now();saveContent(store);rerenderLibrary();
  }
  function attachFile(fileId){
    if(!state.contextContentId)return;
    const content=loadContent(); const context=content.assets.find(a=>a.id===state.contextContentId); const file=loadFiles().assets.find(f=>f.id===fileId); const version=fileVersion(file); if(!context||!file||!version)return;
    context.draft={...(context.draft||{})}; const refs=Array.isArray(context.draft.attachments)?context.draft.attachments.filter(r=>r.fileAssetId!==fileId):[]; refs.push({fileAssetId:file.id,fileVersionId:version.id,attachedAt:now()});context.draft.attachments=refs;context.draft.updatedAt=now();context.updatedAt=now();saveContent(content);rerenderLibrary();
  }

  function documentUsage(docId){
    const store=loadContent();const uses=[];store.assets.forEach(asset=>linkedDocumentRefs(asset).forEach(ref=>{if(ref.contentAssetId===docId)uses.push(asset);}));return uses;
  }

  function libraryItems(){
    const content=loadContent();const files=loadFiles();const docs=content.assets.filter(a=>a.kind==="document").map(doc=>({type:"document",item:doc}));const fileItems=files.assets.map(file=>({type:"file",item:file}));let items=state.tab==="documents"?docs:state.tab==="files"?fileItems:[...docs,...fileItems];const q=state.query.trim().toLowerCase();if(q)items=items.filter(({type,item})=>`${type} ${item.title||item.name} ${item.kind||""} ${item.mime||""}`.toLowerCase().includes(q));return items;
  }

  function docCard(doc){
    const context=state.contextContentId?loadContent().assets.find(a=>a.id===state.contextContentId):null;const linked=Boolean(linkedDocumentRefs(context).find(ref=>ref.contentAssetId===doc.id));const uses=documentUsage(doc.id).length;
    return `<article class="library-card"><button type="button" class="library-card-main" data-library-doc-open="${esc(doc.id)}"><span class="library-kind doc">DOC</span><span><strong>${esc(doc.title||"Untitled document")}</strong><small>Native Check In document · draft r${doc.draft?.revision||1}</small><em>${doc.versions?.length||0} saved version${(doc.versions?.length||0)===1?"":"s"} · used by ${uses}</em></span><b>Open</b></button><div class="library-card-actions"><button type="button" data-library-doc-details="${esc(doc.id)}">Details</button>${state.contextContentId?(linked?`<button type="button" data-library-doc-detach="${esc(doc.id)}">Remove link</button>`:`<button type="button" class="accent" data-library-doc-attach="${esc(doc.id)}">Attach document</button>`):""}</div></article>`;
  }
  function fileCard(file){const version=fileVersion(file);const context=state.contextContentId?loadContent().assets.find(a=>a.id===state.contextContentId):null;const attached=Boolean((context?.draft?.attachments||[]).find(r=>r.fileAssetId===file.id));return `<article class="library-card"><button type="button" class="library-card-main" data-file-quick-view="${esc(file.id)}"><span class="library-kind file">${iconForFile(file.kind)}</span><span><strong>${esc(file.name)}</strong><small>${esc(file.mime||file.kind)} · ${formatSize(version?.size)}</small><em>Current v${version?.number||1} · protected file asset</em></span><b>Preview</b></button><div class="library-card-actions"><button type="button" data-file-details="${esc(file.id)}">Details</button>${state.contextContentId?(attached?`<span>Attached</span>`:`<button type="button" class="accent" data-library-file-attach="${esc(file.id)}">Attach current version</button>`):""}</div></article>`;}

  function libraryMarkup(){const items=libraryItems();const docs=loadContent().assets.filter(a=>a.kind==="document").length;const files=loadFiles().assets.length;return `<div class="library-overlay" role="dialog" aria-modal="true" aria-label="Private Library"><div class="library-app"><header class="library-topbar"><div><button type="button" data-library-close>←</button><span><small>PRIVATE LIBRARY · LAB</small><strong>Documents & files</strong><em>${state.contextContentId?"Choose something to use in this content draft.":"Create, organize and inspect protected content."}</em></span></div><div><button type="button" class="secondary" data-library-upload>＋ Upload file</button><button type="button" class="primary" data-library-new-document>＋ New document</button></div></header><main class="library-main"><section class="library-hero"><div><strong>One private library</strong><p>Native Documents are editable inside Check In. Files are uploaded binaries such as PDFs, images, video, Word files and spreadsheets.</p></div><div><span><b>${docs}</b> Documents</span><span><b>${files}</b> Files</span></div></section><div class="library-controls"><nav><button type="button" data-library-tab="all" class="${state.tab==="all"?"is-active":""}">All</button><button type="button" data-library-tab="documents" class="${state.tab==="documents"?"is-active":""}">Documents</button><button type="button" data-library-tab="files" class="${state.tab==="files"?"is-active":""}">Files</button></nav><label><span>⌕</span><input type="search" data-library-search value="${esc(state.query)}" placeholder="Search Library" /></label></div><section class="library-list">${items.length?items.map(entry=>entry.type==="document"?docCard(entry.item):fileCard(entry.item)).join(""):`<div class="library-empty"><strong>No matches</strong><span>Create a document or try another search.</span></div>`}</section><section class="library-boundary"><b>Lab boundary</b><span>Native document text is browser-local prototype data. Binary file bytes still are not stored here. Production will move both metadata and content into the protected backend.</span></section></main></div></div>`;}

  function openLibrary(context=false){ensureSeedDocument();state={tab:"all",query:"",contextContentId:context?currentContextId():null,docId:null,linkRange:null};document.querySelector(".library-overlay")?.remove();document.body.insertAdjacentHTML("beforeend",libraryMarkup());document.body.classList.add("library-open");}
  function rerenderLibrary(){const old=document.querySelector(".library-overlay");if(old)old.outerHTML=libraryMarkup();enhanceDocumentAttachmentSummary();}
  function closeLibrary(){document.querySelector(".library-overlay")?.remove();document.body.classList.remove("library-open");enhanceDocumentAttachmentSummary();}

  function createDocument(){const store=loadContent();const doc={id:makeId("content-doc"),kind:"document",title:"Untitled document",createdAt:now(),updatedAt:now(),draft:{revision:1,labFormat:"sanitized_html_v1",subject:"",html:"<p><br></p>",plainText:"",linkedDocuments:[],attachments:[],updatedAt:now()},versions:[]};store.assets.unshift(doc);saveContent(store);openDocument(doc.id);}
  function getDocument(id){return loadContent().assets.find(a=>a.id===id&&a.kind==="document")||null;}

  function docToolbar(){return `<div class="content-toolbar library-doc-toolbar" role="toolbar" aria-label="Document formatting"><div class="content-tool-group"><button type="button" data-doc-command="undo" title="Undo">↶</button><button type="button" data-doc-command="redo" title="Redo">↷</button></div><div class="content-tool-group"><button type="button" data-doc-command="formatBlock" data-doc-value="P" title="Paragraph">P</button><button type="button" data-doc-command="formatBlock" data-doc-value="H1" title="Heading 1">H1</button><button type="button" data-doc-command="formatBlock" data-doc-value="H2" title="Heading 2">H2</button><button type="button" data-doc-command="formatBlock" data-doc-value="H3" title="Heading 3">H3</button></div><div class="content-tool-group"><button type="button" data-doc-command="bold" title="Bold"><b>B</b></button><button type="button" data-doc-command="italic" title="Italic"><i>I</i></button><button type="button" data-doc-command="underline" title="Underline"><u>U</u></button><button type="button" data-doc-command="strikeThrough" title="Strikethrough"><s>S</s></button></div><div class="content-tool-group"><button type="button" data-doc-command="insertUnorderedList" title="Bulleted list">•≡</button><button type="button" data-doc-command="insertOrderedList" title="Numbered list">1≡</button><button type="button" data-doc-command="formatBlock" data-doc-value="BLOCKQUOTE" title="Quote">❞</button><button type="button" data-doc-link title="Insert link">🔗</button><button type="button" data-doc-command="insertHorizontalRule" title="Divider">—</button></div></div>`;}

  function documentMarkup(doc){return `<div class="document-editor-overlay" role="dialog" aria-modal="true" aria-label="Document editor"><div class="document-editor-app"><header class="document-editor-topbar"><div><button type="button" data-document-close>←</button><span><small>NATIVE DOCUMENT · LAB</small><strong>${esc(doc.title||"Untitled document")}</strong><em data-document-save-state>Saved locally</em></span></div><div><button type="button" data-document-save-version>Save version</button><button type="button" data-document-save-as>Save as ▾</button><button type="button" class="primary" data-document-done>Done</button></div></header><main class="document-editor-main"><section class="document-meta"><label><span>Document title</span><input type="text" data-document-title value="${esc(doc.title||"")}" maxlength="120" /></label><div><small>EDITABLE DRAFT</small><strong>Revision ${doc.draft?.revision||1}</strong><span>Saved versions are immutable snapshots. Production Automations will pin an exact ContentVersion.</span></div></section>${docToolbar()}<div class="document-link-panel" hidden><label><span>Link URL</span><input type="url" data-document-link-url placeholder="https://example.com" /></label><button type="button" data-document-link-apply>Apply</button><button type="button" data-document-link-cancel>Cancel</button></div><article class="content-paper document-paper"><div class="content-page-kicker">CHECK IN DOCUMENT · PRIVATE DRAFT</div><div class="content-rich-body" contenteditable="true" spellcheck="true" data-document-body>${doc.draft?.html||"<p><br></p>"}</div></article><section class="document-native-note"><b>Native document</b><span>This is editable Check In content. PDF, DOCX, Markdown, HTML and text are export formats, not the canonical editable source.</span></section></main></div></div>`;}
  function openDocument(docId){const doc=getDocument(docId);if(!doc)return;state.docId=docId;document.querySelector(".document-editor-overlay")?.remove();document.body.insertAdjacentHTML("beforeend",documentMarkup(doc));document.body.classList.add("document-editor-open");document.querySelector("[data-document-body]")?.focus();}
  function closeDocument(){clearTimeout(saveTimer);saveDocument(false);document.querySelector(".document-editor-overlay")?.remove();document.body.classList.remove("document-editor-open");state.docId=null;if(document.querySelector(".library-overlay"))rerenderLibrary();}

  function documentFingerprint(doc,title,html){return`${title}\n${html}`;}
  function saveDocument(announce=true){if(!state.docId)return;const store=loadContent();const doc=store.assets.find(a=>a.id===state.docId);if(!doc)return;const title=document.querySelector("[data-document-title]")?.value.trim()||"Untitled document";const html=document.querySelector("[data-document-body]")?.innerHTML||doc.draft?.html||"<p><br></p>";const old=documentFingerprint(doc,doc.title,doc.draft?.html||"");const next=documentFingerprint(doc,title,html);if(old!==next){doc.title=title;doc.updatedAt=now();doc.draft={...(doc.draft||{}),revision:(Number(doc.draft?.revision)||1)+1,html,plainText:plainText(html),updatedAt:now()};saveContent(store);}const label=document.querySelector("[data-document-save-state]");if(label)label.textContent=announce?"Saved document":"Saved locally";}
  function scheduleDocumentSave(){const label=document.querySelector("[data-document-save-state]");if(label)label.textContent="Unsaved changes";clearTimeout(saveTimer);saveTimer=setTimeout(()=>saveDocument(false),650);}
  function saveVersion(){saveDocument(false);const store=loadContent();const doc=store.assets.find(a=>a.id===state.docId);if(!doc)return;doc.versions=Array.isArray(doc.versions)?doc.versions:[];const number=Math.max(0,...doc.versions.map(v=>Number(v.number)||0))+1;doc.versions.push({id:makeId("cv-doc"),number,createdAt:now(),html:doc.draft?.html||"",plainText:doc.draft?.plainText||""});doc.updatedAt=now();saveContent(store);const label=document.querySelector("[data-document-save-state]");if(label)label.textContent=`Saved immutable v${number}`;}

  function showSaveAs(){document.querySelector(".document-save-as-menu")?.remove();document.body.insertAdjacentHTML("beforeend",`<div class="document-save-as-menu" role="dialog" aria-modal="true"><div><small>SAVE / EXPORT</small><h2>Choose a format</h2><button type="button" data-export-native><strong>Native Check In Document</strong><span>Editable source · already saved</span></button><button type="button" data-export-pending="PDF"><strong>PDF</strong><span>Generated server-side later</span></button><button type="button" data-export-pending="DOCX"><strong>Word DOCX</strong><span>Generated server-side later</span></button><button type="button" data-export-pending="Markdown"><strong>Markdown</strong><span>Generated server-side later</span></button><button type="button" data-export-pending="HTML"><strong>HTML</strong><span>Sanitized export later</span></button><button type="button" data-export-pending="Plain text"><strong>Plain text</strong><span>Generated server-side later</span></button><button type="button" class="close" data-save-as-close>Close</button></div></div>`);}
  function exportPending(format){const menu=document.querySelector(".document-save-as-menu>div");if(!menu)return;let note=menu.querySelector(".export-note");if(!note){note=document.createElement("p");note.className="export-note";menu.append(note);}note.textContent=`${format} export is locked into the backend plan. Lab does not fake a durable generated file.`;}

  function docDetails(docId){const doc=getDocument(docId);if(!doc)return;const uses=documentUsage(doc.id);document.querySelector(".document-details-overlay")?.remove();document.body.insertAdjacentHTML("beforeend",`<div class="document-details-overlay" role="dialog" aria-modal="true"><div><header><span><small>DOCUMENT ASSET</small><strong>${esc(doc.title)}</strong><em>Editable native content</em></span><button type="button" data-document-details-close>×</button></header><main><section class="document-detail-grid"><div><small>DRAFT REVISION</small><strong>r${doc.draft?.revision||1}</strong></div><div><small>SAVED VERSIONS</small><strong>${doc.versions?.length||0}</strong></div><div><small>USED BY</small><strong>${uses.length}</strong></div></section><section><small>USED BY</small>${uses.length?uses.map(a=>`<div class="document-use-row"><strong>${esc(a.title||"Private content")}</strong><span>${esc(a.kind||"content")}</span></div>`).join(""):`<p>No current Lab content draft links this document.</p>`}</section><section><small>VERSION HISTORY</small>${(doc.versions||[]).slice().reverse().map(v=>`<div class="document-version-row"><b>v${v.number}</b><span>${new Date(v.createdAt).toLocaleString()}</span><em>IMMUTABLE</em></div>`).join("")||"<p>No immutable version saved yet.</p>"}</section></main></div></div>`);}

  function uploadInfo(){document.querySelector(".library-upload-info")?.remove();document.body.insertAdjacentHTML("beforeend",`<div class="library-upload-info" role="dialog" aria-modal="true"><div><small>UPLOAD FILE</small><h2>Real upload stays backend-owned</h2><p>The UI is ready for private object storage, immutable FileVersion creation, malware scanning and protected viewers. Lab still stores metadata only.</p><button type="button" data-library-upload-close>Got it</button></div></div>`);}

  document.addEventListener("click",event=>{
    if(event.target.closest("[data-library-open-global]")){openLibrary(false);return;}
    if(event.target.closest("[data-library-open-context]")){openLibrary(true);return;}
    if(event.target.closest("[data-library-close]")){closeLibrary();return;}
    const tab=event.target.closest("[data-library-tab]");if(tab){state.tab=tab.dataset.libraryTab;state.query="";rerenderLibrary();return;}
    if(event.target.closest("[data-library-new-document]")){createDocument();return;}
    if(event.target.closest("[data-library-upload]")){uploadInfo();return;}
    if(event.target.closest("[data-library-upload-close]")){document.querySelector(".library-upload-info")?.remove();return;}
    const openDoc=event.target.closest("[data-library-doc-open]");if(openDoc){openDocument(openDoc.dataset.libraryDocOpen);return;}
    const details=event.target.closest("[data-library-doc-details]");if(details){docDetails(details.dataset.libraryDocDetails);return;}
    const attach=event.target.closest("[data-library-doc-attach]");if(attach){attachDocument(attach.dataset.libraryDocAttach);return;}
    const detach=event.target.closest("[data-library-doc-detach]");if(detach){detachDocument(detach.dataset.libraryDocDetach);return;}
    const fileAttach=event.target.closest("[data-library-file-attach]");if(fileAttach){attachFile(fileAttach.dataset.libraryFileAttach);return;}
    if(event.target.closest("[data-document-close],[data-document-done]")){closeDocument();return;}
    if(event.target.closest("[data-document-save-version]")){saveVersion();return;}
    if(event.target.closest("[data-document-save-as]")){showSaveAs();return;}
    if(event.target.closest("[data-save-as-close],[data-export-native]")){document.querySelector(".document-save-as-menu")?.remove();return;}
    const pending=event.target.closest("[data-export-pending]");if(pending){exportPending(pending.dataset.exportPending);return;}
    if(event.target.closest("[data-document-details-close]")){document.querySelector(".document-details-overlay")?.remove();return;}
    const cmd=event.target.closest("[data-doc-command]");if(cmd){event.preventDefault();document.querySelector("[data-document-body]")?.focus();document.execCommand(cmd.dataset.docCommand,false,cmd.dataset.docValue||null);scheduleDocumentSave();return;}
    if(event.target.closest("[data-doc-link]")){const panel=document.querySelector(".document-link-panel");if(panel){panel.hidden=false;state.linkRange=window.getSelection()?.rangeCount?window.getSelection().getRangeAt(0).cloneRange():null;panel.querySelector("input")?.focus();}return;}
    if(event.target.closest("[data-document-link-cancel]")){const panel=document.querySelector(".document-link-panel");if(panel)panel.hidden=true;return;}
    if(event.target.closest("[data-document-link-apply]")){const input=document.querySelector("[data-document-link-url]");const href=input?.value.trim();if(href&&/^https?:\/\//i.test(href)){const sel=window.getSelection();if(state.linkRange&&sel){sel.removeAllRanges();sel.addRange(state.linkRange);}document.querySelector("[data-document-body]")?.focus();document.execCommand("createLink",false,href);scheduleDocumentSave();}const panel=document.querySelector(".document-link-panel");if(panel)panel.hidden=true;return;}
    if(event.target.closest("[data-content-open]"))requestAnimationFrame(()=>requestAnimationFrame(enhanceLibraryButtons));
    requestAnimationFrame(()=>requestAnimationFrame(enhanceLibraryButtons));
  },true);

  document.addEventListener("input",event=>{
    const search=event.target.closest("[data-library-search]");if(search){state.query=search.value;const caret=search.selectionStart;rerenderLibrary();const next=document.querySelector("[data-library-search]");if(next){next.focus();next.setSelectionRange(caret,caret);}return;}
    if(event.target.closest("[data-document-title],[data-document-body]"))scheduleDocumentSave();
  });

  document.addEventListener("keydown",event=>{if(event.key!=="Escape")return;if(document.querySelector(".document-save-as-menu")){document.querySelector(".document-save-as-menu")?.remove();return;}if(document.querySelector(".document-details-overlay")){document.querySelector(".document-details-overlay")?.remove();return;}if(document.querySelector(".document-editor-overlay")){closeDocument();return;}if(document.querySelector(".library-upload-info")){document.querySelector(".library-upload-info")?.remove();return;}if(document.querySelector(".library-overlay"))closeLibrary();},true);

  window.addEventListener("pageshow",()=>requestAnimationFrame(()=>requestAnimationFrame(enhanceLibraryButtons)));
  requestAnimationFrame(()=>requestAnimationFrame(()=>{ensureSeedDocument();enhanceLibraryButtons();}));
})();