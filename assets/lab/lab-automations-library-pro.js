(() => {
  "use strict";

  const CONTENT_KEY = "cmx-lab-content-assets-v1";
  const FILE_KEY = "cmx-lab-file-assets-v1";
  const META_KEY = "cmx-lab-library-meta-v1";
  const app = document.getElementById("automationApp");
  if (!app) return;

  const esc = value => String(value ?? "").replace(/[&<>'"]/g, ch => ({
    "&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"
  }[ch]));
  const now = () => new Date().toISOString();
  const makeId = prefix => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const slug = value => String(value || "untitled").trim().toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"") || "untitled";

  let state = { folderId: null, filter: "all", query: "", contextContentId: null, createOpen: false };
  let editorState = null;
  let templateState = null;
  let saveTimer = null;

  function loadJson(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; }
  }
  function loadContent() {
    const data = loadJson(CONTENT_KEY, {version:1, assets:[], links:{}});
    if (!Array.isArray(data.assets)) data.assets = [];
    if (!data.links || typeof data.links !== "object") data.links = {};
    return data;
  }
  function saveContent(data) { localStorage.setItem(CONTENT_KEY, JSON.stringify(data)); }
  function loadFiles() {
    const data = loadJson(FILE_KEY, {version:1, assets:[]});
    if (!Array.isArray(data.assets)) data.assets = [];
    return data;
  }
  function saveFiles(data) { localStorage.setItem(FILE_KEY, JSON.stringify(data)); }
  function defaultMeta() {
    return {
      version: 1,
      folders: [
        {id:"folder-continuity",name:"Continuity",parentId:null,createdAt:now()},
        {id:"folder-personal",name:"Personal",parentId:null,createdAt:now()},
        {id:"folder-business",name:"Business",parentId:null,createdAt:now()},
        {id:"folder-templates",name:"Templates",parentId:null,createdAt:now()}
      ],
      placements: {},
      archived: {}
    };
  }
  function loadMeta() {
    const data = loadJson(META_KEY, defaultMeta());
    if (!Array.isArray(data.folders)) data.folders = [];
    if (!data.placements || typeof data.placements !== "object") data.placements = {};
    if (!data.archived || typeof data.archived !== "object") data.archived = {};
    return data;
  }
  function saveMeta(data) { localStorage.setItem(META_KEY, JSON.stringify(data)); }

  function itemRef(type, id) { return `${type}:${id}`; }
  function folderFor(type, id) { return loadMeta().placements[itemRef(type,id)] || null; }
  function isArchived(type, id) { return Boolean(loadMeta().archived[itemRef(type,id)]); }
  function currentContentContextId() {
    const overlay = document.querySelector(".content-editor-overlay");
    const stepId = overlay?.dataset.contentEditor;
    if (!stepId) return null;
    return loadContent().links?.[stepId] || null;
  }

  const ALLOWED = new Set(["P","BR","STRONG","B","EM","I","U","S","STRIKE","H1","H2","H3","UL","OL","LI","BLOCKQUOTE","A","HR","PRE","CODE","DIV"]);
  const BLOCKED = new Set(["SCRIPT","STYLE","IFRAME","OBJECT","EMBED","SVG","MATH","FORM","INPUT","BUTTON"]);
  function safeHref(value) {
    const href = String(value || "").trim();
    if (!href) return "";
    if (href.startsWith("#")) return href;
    if (href.startsWith("/") && !href.startsWith("//")) return href;
    try {
      const url = new URL(href);
      return ["https:","http:","mailto:"].includes(url.protocol) ? url.href : "";
    } catch { return ""; }
  }
  function sanitizeHtml(html) {
    const template = document.createElement("template");
    template.innerHTML = String(html || "");
    const clean = node => {
      [...node.children].forEach(child => {
        if (BLOCKED.has(child.tagName)) { child.remove(); return; }
        if (!ALLOWED.has(child.tagName)) {
          clean(child);
          child.replaceWith(...child.childNodes);
          return;
        }
        const href = child.tagName === "A" ? child.getAttribute("href") : "";
        [...child.attributes].forEach(attr => child.removeAttribute(attr.name));
        if (child.tagName === "A") {
          const safe = safeHref(href);
          if (safe) { child.setAttribute("href",safe); child.setAttribute("rel","noopener noreferrer"); }
        }
        clean(child);
      });
    };
    clean(template.content);
    return template.innerHTML;
  }
  function textFromHtml(html) {
    const node = document.createElement("div"); node.innerHTML = sanitizeHtml(html);
    return (node.innerText || node.textContent || "").replace(/\n{3,}/g,"\n\n").trim();
  }

  function seedProContent() {
    const content = loadContent();
    if (!content.assets.some(a => a.kind === "markdown")) {
      content.assets.push({
        id:"content-md-ai-notes",kind:"markdown",title:"AI Context Notes",fileName:"ai-context-notes.md",createdAt:now(),updatedAt:now(),
        draft:{revision:1,sourceText:"# AI Context Notes\n\nThis is a native editable Markdown item stored as Check In content.\n\n- Humans can edit it.\n- AI can later read an authorized immutable version.\n- Automations should pin exact versions when reproducibility matters.\n",updatedAt:now()},
        versions:[]
      });
    }
    if (!content.assets.some(a => a.kind === "template")) {
      content.assets.push({
        id:"template-emergency-message",kind:"template",templateType:"message",title:"Emergency notification",fileName:"emergency-notification.template",createdAt:now(),updatedAt:now(),
        draft:{revision:1,subject:"",html:"<p>Hi {{recipient_name}},</p><p>I’m sharing an important update and the protected instructions attached to this message.</p>",plainText:"Hi {{recipient_name}},\n\nI’m sharing an important update and the protected instructions attached to this message.",updatedAt:now()},
        versions:[{id:"tv-emergency-message-v1",number:1,createdAt:now(),html:"<p>Hi {{recipient_name}},</p><p>I’m sharing an important update and the protected instructions attached to this message.</p>",plainText:"Hi {{recipient_name}},\n\nI’m sharing an important update and the protected instructions attached to this message."}]
      });
    }
    saveContent(content);

    const meta = loadMeta();
    if (!meta.placements["content:content-md-ai-notes"]) meta.placements["content:content-md-ai-notes"] = "folder-continuity";
    if (!meta.placements["content:template-emergency-message"]) meta.placements["content:template-emergency-message"] = "folder-templates";
    saveMeta(meta);
  }

  function foldersIn(parentId) {
    const meta = loadMeta();
    return meta.folders.filter(folder => (folder.parentId || null) === (parentId || null) && !meta.archived[`folder:${folder.id}`]);
  }
  function folderName(id) { return id ? loadMeta().folders.find(f=>f.id===id)?.name || "Folder" : "Library"; }
  function folderPath(id) {
    const meta=loadMeta(), parts=[]; let cursor=id, guard=0;
    while(cursor && guard++<20){ const folder=meta.folders.find(f=>f.id===cursor); if(!folder)break; parts.unshift(folder); cursor=folder.parentId||null; }
    return parts;
  }
  function contentLabel(asset) {
    if (asset.kind === "markdown") return "MD";
    if (asset.kind === "text") return "TXT";
    if (asset.kind === "template") return asset.templateType === "email" ? "EMAIL TPL" : asset.templateType === "message" ? "MSG TPL" : "DOC TPL";
    if (asset.kind === "document") return "DOC";
    return "CONTENT";
  }
  function contentSubtitle(asset) {
    if (asset.kind === "markdown") return `${asset.fileName || "untitled.md"} · native Markdown`;
    if (asset.kind === "text") return `${asset.fileName || "untitled.txt"} · native text`;
    if (asset.kind === "template") return `${asset.templateType || "content"} template · reusable`;
    return `Native Check In document · draft r${asset.draft?.revision || 1}`;
  }
  function currentFileVersion(file){return file?.versions?.find(v=>v.id===file.currentVersionId)||file?.versions?.[0]||null;}
  function size(bytes){const n=Number(bytes)||0;if(n<1024)return`${n} B`;if(n<1024**2)return`${(n/1024).toFixed(1)} KB`;if(n<1024**3)return`${(n/1024**2).toFixed(1)} MB`;return`${(n/1024**3).toFixed(1)} GB`;}

  function libraryItems() {
    const content = loadContent(); const files = loadFiles(); const meta = loadMeta();
    const entries = [];
    foldersIn(state.folderId).forEach(folder => entries.push({type:"folder",item:folder}));
    content.assets.forEach(asset => {
      if ((meta.placements[itemRef("content",asset.id)] || null) !== (state.folderId || null)) return;
      if (meta.archived[itemRef("content",asset.id)] && state.filter !== "archived") return;
      if (!meta.archived[itemRef("content",asset.id)] && state.filter === "archived") return;
      if (state.filter === "documents" && !["document","markdown","text"].includes(asset.kind)) return;
      if (state.filter === "templates" && asset.kind !== "template") return;
      if (state.filter === "files") return;
      entries.push({type:"content",item:asset});
    });
    files.assets.forEach(file => {
      if ((meta.placements[itemRef("file",file.id)] || null) !== (state.folderId || null)) return;
      if (meta.archived[itemRef("file",file.id)] && state.filter !== "archived") return;
      if (!meta.archived[itemRef("file",file.id)] && state.filter === "archived") return;
      if (["documents","templates"].includes(state.filter)) return;
      entries.push({type:"file",item:file});
    });
    const q=state.query.trim().toLowerCase();
    return q ? entries.filter(entry => {
      const item=entry.item; return `${entry.type} ${item.name||item.title||""} ${item.fileName||""} ${item.kind||""} ${item.mime||""}`.toLowerCase().includes(q);
    }) : entries;
  }

  function breadcrumbMarkup() {
    const path=folderPath(state.folderId);
    return `<button type="button" data-pro-folder="">Library</button>${path.map(folder=>`<span>›</span><button type="button" data-pro-folder="${esc(folder.id)}">${esc(folder.name)}</button>`).join("")}`;
  }
  function folderCard(folder){return `<article class="pro-card folder-card"><button type="button" class="pro-main" data-pro-folder="${esc(folder.id)}"><span class="pro-icon folder">DIR</span><span><strong>${esc(folder.name)}</strong><small>Folder</small></span><b>Open</b></button><div class="pro-actions"><button type="button" data-pro-folder-rename="${esc(folder.id)}">Rename</button><button type="button" data-pro-folder-move="${esc(folder.id)}">Move</button><button type="button" data-pro-folder-archive="${esc(folder.id)}">Archive</button></div></article>`;}
  function contentCard(asset){return `<article class="pro-card"><button type="button" class="pro-main" data-pro-content-open="${esc(asset.id)}"><span class="pro-icon content">${contentLabel(asset)}</span><span><strong>${esc(asset.title||asset.fileName||"Untitled")}</strong><small>${esc(contentSubtitle(asset))}</small></span><b>Edit</b></button><div class="pro-actions"><button type="button" data-pro-rename="content:${esc(asset.id)}">Rename</button><button type="button" data-pro-move="content:${esc(asset.id)}">Move</button><button type="button" data-pro-duplicate="content:${esc(asset.id)}">Duplicate</button><button type="button" data-pro-details="content:${esc(asset.id)}">Details</button><button type="button" data-pro-archive="content:${esc(asset.id)}">Archive</button></div></article>`;}
  function fileCard(file){const v=currentFileVersion(file);return `<article class="pro-card"><button type="button" class="pro-main" data-file-quick-view="${esc(file.id)}"><span class="pro-icon file">FILE</span><span><strong>${esc(file.name)}</strong><small>${esc(file.mime||file.kind||"file")} · ${size(v?.size)} · v${v?.number||1}</small></span><b>View</b></button><div class="pro-actions"><button type="button" data-pro-rename="file:${esc(file.id)}">Rename</button><button type="button" data-pro-move="file:${esc(file.id)}">Move</button><button type="button" data-file-details="${esc(file.id)}">Details</button><button type="button" data-pro-archive="file:${esc(file.id)}">Archive</button></div></article>`;}

  function libraryMarkup() {
    const items=libraryItems(); const meta=loadMeta();
    const content=loadContent(); const files=loadFiles();
    const templates=content.assets.filter(a=>a.kind==="template"&&!meta.archived[itemRef("content",a.id)]).length;
    return `<div class="library-pro-overlay" role="dialog" aria-modal="true" aria-label="Private Library">
      <div class="library-pro-app">
        <header class="library-pro-topbar"><div><button type="button" data-pro-close>←</button><span><small>PRIVATE LIBRARY · LAB</small><strong>${esc(folderName(state.folderId))}</strong><em>Folders, editable content, templates and protected files.</em></span></div><button type="button" class="primary" data-pro-create-toggle>＋ New</button></header>
        <main class="library-pro-main">
          <section class="pro-stats"><div><strong>${content.assets.length}</strong><span>Native content</span></div><div><strong>${files.assets.length}</strong><span>Files</span></div><div><strong>${templates}</strong><span>Templates</span></div><div><strong>${meta.folders.length}</strong><span>Folders</span></div></section>
          <div class="pro-breadcrumb">${breadcrumbMarkup()}</div>
          <section class="pro-toolbar"><nav>${["all","documents","files","templates","archived"].map(filter=>`<button type="button" data-pro-filter="${filter}" class="${state.filter===filter?"is-active":""}">${filter[0].toUpperCase()+filter.slice(1)}</button>`).join("")}</nav><label><span>⌕</span><input type="search" data-pro-search value="${esc(state.query)}" placeholder="Search this folder" /></label></section>
          ${state.createOpen ? createMenuMarkup() : ""}
          <section class="pro-grid">${items.length?items.map(entry=>entry.type==="folder"?folderCard(entry.item):entry.type==="content"?contentCard(entry.item):fileCard(entry.item)).join(""):`<div class="pro-empty"><strong>This folder is empty</strong><span>Create a document, Markdown file, template or folder.</span></div>`}</section>
          <section class="pro-boundary"><b>Storage rule</b><span>Markdown/text/template content is native DB-shaped Lab content. Binary files remain metadata-only until the private object-storage backend exists.</span></section>
        </main>
      </div>
    </div>`;
  }
  function createMenuMarkup(){return `<section class="pro-create-menu"><div><small>CREATE IN ${esc(folderName(state.folderId).toUpperCase())}</small><strong>What do you want to create?</strong></div><div class="pro-create-grid"><button type="button" data-pro-create="folder"><b>Folder</b><span>Organize Library items</span></button><button type="button" data-pro-create="document"><b>Rich document</b><span>Docs-style editable content</span></button><button type="button" data-pro-create="markdown"><b>Markdown file</b><span>Native editable .md for humans + AI</span></button><button type="button" data-pro-create="text"><b>Text file</b><span>Native editable .txt</span></button><button type="button" data-pro-create="email-template"><b>Email template</b><span>Reusable subject + rich body</span></button><button type="button" data-pro-create="message-template"><b>Message template</b><span>Reusable notification/message body</span></button><button type="button" data-pro-create="document-template"><b>Document template</b><span>Reusable starting document</span></button><button type="button" data-pro-upload-info><b>Upload file</b><span>PDF, image, video, DOCX, XLSX…</span></button></div></section>`;}

  function openLibrary(context=false){
    seedProContent();
    state={folderId:null,filter:"all",query:"",contextContentId:context?currentContentContextId():null,createOpen:false};
    document.querySelector(".library-overlay")?.remove(); document.querySelector(".library-pro-overlay")?.remove();
    document.body.insertAdjacentHTML("beforeend",libraryMarkup()); document.body.classList.add("library-pro-open");
  }
  function rerender(){const old=document.querySelector(".library-pro-overlay");if(old)old.outerHTML=libraryMarkup();}
  function closeLibrary(){document.querySelector(".library-pro-overlay")?.remove();document.body.classList.remove("library-pro-open");}

  function modal(title, body, buttons="") {
    document.querySelector(".pro-modal")?.remove();
    document.body.insertAdjacentHTML("beforeend",`<div class="pro-modal" role="dialog" aria-modal="true"><div><small>PRIVATE LIBRARY</small><h2>${esc(title)}</h2>${body}<div class="pro-modal-actions">${buttons}<button type="button" data-pro-modal-close>Cancel</button></div></div></div>`);
  }
  function createFolder() {
    modal("New folder",`<label class="pro-field"><span>Folder name</span><input type="text" maxlength="80" data-pro-folder-name placeholder="Continuity" /></label>`,`<button type="button" class="primary" data-pro-folder-save>Create folder</button>`);
    requestAnimationFrame(()=>document.querySelector("[data-pro-folder-name]")?.focus());
  }
  function saveNewFolder() {
    const name=document.querySelector("[data-pro-folder-name]")?.value.trim(); if(!name)return;
    const meta=loadMeta(); meta.folders.push({id:makeId("folder"),name,parentId:state.folderId||null,createdAt:now()}); saveMeta(meta); document.querySelector(".pro-modal")?.remove(); rerender();
  }

  function createContent(type) {
    const content=loadContent(); const id=makeId("content"); const timestamp=now(); let asset;
    if(type==="markdown")asset={id,kind:"markdown",title:"Untitled Markdown",fileName:"untitled.md",createdAt:timestamp,updatedAt:timestamp,draft:{revision:1,sourceText:"# Untitled\n\nStart writing…\n",updatedAt:timestamp},versions:[]};
    else if(type==="text")asset={id,kind:"text",title:"Untitled text",fileName:"untitled.txt",createdAt:timestamp,updatedAt:timestamp,draft:{revision:1,sourceText:"",updatedAt:timestamp},versions:[]};
    else if(type.endsWith("template")){const templateType=type.replace("-template","");asset={id,kind:"template",templateType,title:`Untitled ${templateType} template`,fileName:`untitled-${templateType}.template`,createdAt:timestamp,updatedAt:timestamp,draft:{revision:1,subject:"",html:"<p><br></p>",plainText:"",updatedAt:timestamp},versions:[]};}
    else asset={id,kind:"document",title:"Untitled document",createdAt:timestamp,updatedAt:timestamp,draft:{revision:1,html:"<p><br></p>",plainText:"",updatedAt:timestamp},versions:[]};
    content.assets.unshift(asset); saveContent(content);
    const meta=loadMeta(); meta.placements[itemRef("content",id)] = state.folderId || null; saveMeta(meta);
    state.createOpen=false; openEditor(id);
  }

  function currentAsset(id){return loadContent().assets.find(a=>a.id===id)||null;}
  function saveEditor({snapshot=false}={}) {
    if(!editorState)return; const content=loadContent(); const asset=content.assets.find(a=>a.id===editorState.id); if(!asset)return;
    const overlay=document.querySelector(".pro-editor-overlay"); if(!overlay)return;
    const title=overlay.querySelector("[data-pro-editor-title]")?.value.trim() || "Untitled";
    const fileNameInput=overlay.querySelector("[data-pro-editor-filename]");
    asset.title=title; if(fileNameInput)asset.fileName=fileNameInput.value.trim()||asset.fileName;
    asset.updatedAt=now(); asset.draft={...(asset.draft||{}),updatedAt:now()};
    if(["markdown","text"].includes(asset.kind)) asset.draft.sourceText=overlay.querySelector("[data-pro-source]")?.value || "";
    else {
      const body=overlay.querySelector("[data-pro-rich-body]"); const html=sanitizeHtml(body?.innerHTML||"<p><br></p>");
      asset.draft.html=html; asset.draft.plainText=textFromHtml(html);
      if(asset.kind==="template")asset.draft.subject=overlay.querySelector("[data-pro-template-subject]")?.value.trim()||"";
    }
    asset.draft.revision=Math.max(1,Number(asset.draft.revision)||1);
    if(snapshot){
      const versions=Array.isArray(asset.versions)?asset.versions:[]; const number=(versions[0]?.number||0)+1;
      const version={id:makeId("cv"),number,createdAt:now(),title:asset.title};
      if(["markdown","text"].includes(asset.kind))version.sourceText=asset.draft.sourceText||""; else {version.html=asset.draft.html||"";version.plainText=asset.draft.plainText||"";if(asset.kind==="template")version.subject=asset.draft.subject||"";}
      asset.versions=[version,...versions];
    } else asset.draft.revision += 1;
    saveContent(content); setEditorSaveState(snapshot?"Saved immutable version":"Saved just now");
  }
  function setEditorSaveState(text){const el=document.querySelector("[data-pro-save-state]");if(el)el.textContent=text;}
  function scheduleEditorSave(){setEditorSaveState("Unsaved changes");clearTimeout(saveTimer);saveTimer=setTimeout(()=>saveEditor(),650);}

  function editorToolbar() {return `<div class="content-toolbar pro-rich-toolbar" role="toolbar" aria-label="Formatting"><div class="content-tool-group"><button type="button" data-pro-command="undo" title="Undo">↶</button><button type="button" data-pro-command="redo" title="Redo">↷</button></div><div class="content-tool-group"><button type="button" data-pro-command="formatBlock" data-pro-value="P" title="Paragraph">P</button><button type="button" data-pro-command="formatBlock" data-pro-value="H1" title="Heading 1">H1</button><button type="button" data-pro-command="formatBlock" data-pro-value="H2" title="Heading 2">H2</button><button type="button" data-pro-command="formatBlock" data-pro-value="H3" title="Heading 3">H3</button></div><div class="content-tool-group"><button type="button" data-pro-command="bold" title="Bold"><b>B</b></button><button type="button" data-pro-command="italic" title="Italic"><i>I</i></button><button type="button" data-pro-command="underline" title="Underline"><u>U</u></button><button type="button" data-pro-command="strikeThrough" title="Strikethrough"><s>S</s></button></div><div class="content-tool-group"><button type="button" data-pro-command="insertUnorderedList" title="Bulleted list">•≡</button><button type="button" data-pro-command="insertOrderedList" title="Numbered list">1≡</button><button type="button" data-pro-command="formatBlock" data-pro-value="BLOCKQUOTE" title="Quote">❞</button><button type="button" data-pro-rich-link title="Insert link">🔗</button><button type="button" data-pro-command="insertHorizontalRule" title="Divider">—</button></div></div>`;}
  function markdownToolbar(){return `<div class="pro-md-toolbar"><button type="button" data-md-insert="heading">H1 <span>Heading</span></button><button type="button" data-md-insert="bold"><b>B</b> <span>Bold</span></button><button type="button" data-md-insert="italic"><i>I</i> <span>Italic</span></button><button type="button" data-md-insert="strike"><s>S</s> <span>Strike</span></button><button type="button" data-md-insert="list">• <span>List</span></button><button type="button" data-md-insert="quote">❞ <span>Quote</span></button><button type="button" data-md-insert="link">🔗 <span>Link</span></button><button type="button" data-md-insert="code">&lt;/&gt; <span>Code</span></button></div>`;}

  function markdownToHtml(source){
    const lines=String(source||"").split(/\r?\n/); let inCode=false, list=null, html=[];
    const inline=text=>{
      let s=esc(text);
      s=s.replace(/`([^`]+)`/g,"<code>$1</code>");
      s=s.replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>");
      s=s.replace(/~~([^~]+)~~/g,"<s>$1</s>");
      s=s.replace(/\*([^*]+)\*/g,"<em>$1</em>");
      s=s.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,'<a href="$2" rel="noopener noreferrer">$1</a>');
      return s;
    };
    const closeList=()=>{if(list){html.push(`</${list}>`);list=null;}};
    for(const raw of lines){
      if(raw.trim().startsWith("```")){closeList(); if(!inCode){html.push("<pre><code>");inCode=true;}else{html.push("</code></pre>");inCode=false;}continue;}
      if(inCode){html.push(`${esc(raw)}\n`);continue;}
      let m;
      if((m=raw.match(/^(#{1,3})\s+(.*)$/))){closeList();html.push(`<h${m[1].length}>${inline(m[2])}</h${m[1].length}>`);continue;}
      if((m=raw.match(/^\s*[-*]\s+(.*)$/))){if(list!=="ul"){closeList();list="ul";html.push("<ul>");}html.push(`<li>${inline(m[1])}</li>`);continue;}
      if((m=raw.match(/^\s*\d+\.\s+(.*)$/))){if(list!=="ol"){closeList();list="ol";html.push("<ol>");}html.push(`<li>${inline(m[1])}</li>`);continue;}
      closeList(); if(raw.startsWith("> "))html.push(`<blockquote>${inline(raw.slice(2))}</blockquote>`); else if(!raw.trim())html.push("<br>"); else html.push(`<p>${inline(raw)}</p>`);
    }
    closeList(); if(inCode)html.push("</code></pre>"); return html.join("");
  }

  function editorMarkup(asset){
    const isSource=["markdown","text"].includes(asset.kind); const isMarkdown=asset.kind==="markdown"; const isTemplate=asset.kind==="template";
    return `<div class="pro-editor-overlay" role="dialog" aria-modal="true" aria-label="Library editor"><div class="pro-editor-app"><header class="pro-editor-topbar"><div><button type="button" data-pro-editor-close>←</button><span><small>${esc(asset.kind.toUpperCase())} · LAB</small><strong>${esc(asset.title||"Untitled")}</strong><em data-pro-save-state>Saved locally</em></span></div><div><button type="button" data-pro-save-version>Save version</button><button type="button" class="primary" data-pro-editor-done>Done</button></div></header><main class="pro-editor-main"><section class="pro-editor-meta"><label><span>Name</span><input type="text" data-pro-editor-title value="${esc(asset.title||"")}" /></label>${(isSource||isTemplate)?`<label><span>${isSource?"File name":"Template file name"}</span><input type="text" data-pro-editor-filename value="${esc(asset.fileName||"")}" /></label>`:""}${isTemplate&&asset.templateType==="email"?`<label class="wide"><span>Email subject</span><input type="text" data-pro-template-subject value="${esc(asset.draft?.subject||"")}" placeholder="Important information" /></label>`:""}</section>${isSource?`${isMarkdown?markdownToolbar():""}<section class="pro-source-layout ${isMarkdown?"with-preview":""}"><article class="pro-code-paper"><small>${isMarkdown?"MARKDOWN SOURCE":"PLAIN TEXT"} · NATIVE CONTENT</small><textarea spellcheck="true" data-pro-source>${esc(asset.draft?.sourceText||"")}</textarea></article>${isMarkdown?`<article class="pro-preview-paper"><small>SAFE PREVIEW</small><div data-pro-md-preview>${markdownToHtml(asset.draft?.sourceText||"")}</div></article>`:""}</section>`:`${editorToolbar()}<article class="content-paper pro-doc-paper"><div class="content-page-kicker">${isTemplate?"TEMPLATE DRAFT · REUSABLE":"NATIVE DOCUMENT · EDITABLE"}</div><div class="content-rich-body" contenteditable="true" spellcheck="true" data-pro-rich-body>${sanitizeHtml(asset.draft?.html||"<p><br></p>")}</div></article>${isTemplate?`<section class="pro-template-vars"><small>INSERT VARIABLE</small><div><button type="button" data-pro-variable="{{recipient_name}}">Recipient name</button><button type="button" data-pro-variable="{{organization_name}}">Organization</button><button type="button" data-pro-variable="{{current_date}}">Current date</button></div><p>Variables are placeholders only in Lab. Production will use an allowlisted typed variable registry.</p></section>`:""}`}<section class="pro-version-note"><b>${asset.versions?.length||0} immutable version${(asset.versions?.length||0)===1?"":"s"}</b><span>Autosave changes the draft. Save version creates a frozen snapshot for review/reuse.</span></section></main></div></div>`;
  }
  function openEditor(id){const asset=currentAsset(id);if(!asset)return;editorState={id};document.querySelector(".pro-editor-overlay")?.remove();document.body.insertAdjacentHTML("beforeend",editorMarkup(asset));document.body.classList.add("pro-editor-open");requestAnimationFrame(()=>document.querySelector("[data-pro-rich-body],[data-pro-source]")?.focus());}
  function closeEditor(){clearTimeout(saveTimer);saveEditor();document.querySelector(".pro-editor-overlay")?.remove();document.body.classList.remove("pro-editor-open");editorState=null;rerender();}

  function insertMarkdown(type){const ta=document.querySelector("[data-pro-source]");if(!ta)return;const start=ta.selectionStart,end=ta.selectionEnd,selected=ta.value.slice(start,end);const rules={heading:["# ",""],bold:["**","**"],italic:["*","*"],strike:["~~","~~"],list:["- ",""],quote:["> ",""],link:["[",`](https://example.com)`],code:["`","`"]};const [before,after]=rules[type]||["",""];ta.setRangeText(before+(selected||({heading:"Heading",bold:"bold",italic:"italic",strike:"text",list:"Item",quote:"Quote",link:"link",code:"code"}[type]||""))+after,start,end,"end");ta.dispatchEvent(new Event("input",{bubbles:true}));ta.focus();}
  function insertVariable(token){const body=document.querySelector("[data-pro-rich-body]");if(!body)return;body.focus();document.execCommand("insertText",false,token);body.dispatchEvent(new Event("input",{bubbles:true}));}

  function openRename(ref){const [type,id]=ref.split(":");const item=type==="content"?loadContent().assets.find(a=>a.id===id):loadFiles().assets.find(f=>f.id===id);if(!item)return;modal("Rename item",`<label class="pro-field"><span>${type==="file"?"File display name":"Name"}</span><input type="text" data-pro-rename-value value="${esc(item.title||item.name||"")}" /></label>${type==="file"?`<p class="pro-help">Production rename changes the FileAsset display name. Historical FileVersion original filenames stay immutable.</p>`:""}`,`<button type="button" class="primary" data-pro-rename-save="${esc(ref)}">Save name</button>`);}
  function saveRename(ref){const value=document.querySelector("[data-pro-rename-value]")?.value.trim();if(!value)return;const [type,id]=ref.split(":");if(type==="content"){const data=loadContent();const item=data.assets.find(a=>a.id===id);if(item){item.title=value;if(item.kind==="markdown"&&!item.fileName)item.fileName=`${slug(value)}.md`;if(item.kind==="text"&&!item.fileName)item.fileName=`${slug(value)}.txt`;item.updatedAt=now();saveContent(data);}}else{const data=loadFiles();const item=data.assets.find(f=>f.id===id);if(item){item.name=value;saveFiles(data);}}document.querySelector(".pro-modal")?.remove();rerender();}

  function openMove(ref,isFolder=false){const meta=loadMeta();const options=[`<button type="button" data-pro-move-target="" data-pro-move-ref="${esc(ref)}" data-pro-move-folder="${isFolder?"1":"0"}">Library root</button>`,...meta.folders.filter(f=>!isFolder||`folder:${f.id}`!==ref).map(f=>`<button type="button" data-pro-move-target="${esc(f.id)}" data-pro-move-ref="${esc(ref)}" data-pro-move-folder="${isFolder?"1":"0"}">${esc(folderPath(f.id).map(x=>x.name).join(" / "))}</button>`)].join("");modal("Move",`<div class="pro-folder-choices">${options}</div>`);}
  function moveRef(ref,target,isFolder){const meta=loadMeta();if(isFolder){const id=ref.replace(/^folder:/,"");const folder=meta.folders.find(f=>f.id===id);if(folder){if(target===id)return;const descendants=new Set();const collect=parent=>meta.folders.filter(f=>f.parentId===parent).forEach(f=>{descendants.add(f.id);collect(f.id);});collect(id);if(target&&descendants.has(target))return;folder.parentId=target||null;}}else meta.placements[ref]=target||null;saveMeta(meta);document.querySelector(".pro-modal")?.remove();rerender();}

  function duplicateContent(ref){const id=ref.replace(/^content:/,"");const content=loadContent();const source=content.assets.find(a=>a.id===id);if(!source)return;const copy=JSON.parse(JSON.stringify(source));copy.id=makeId("content");copy.title=`${source.title||"Untitled"} copy`;if(copy.fileName){const dot=copy.fileName.lastIndexOf(".");copy.fileName=dot>0?`${copy.fileName.slice(0,dot)}-copy${copy.fileName.slice(dot)}`:`${copy.fileName}-copy`;}copy.createdAt=now();copy.updatedAt=now();copy.versions=[];copy.draft={...(copy.draft||{}),revision:1,updatedAt:now()};content.assets.unshift(copy);saveContent(content);const meta=loadMeta();meta.placements[itemRef("content",copy.id)]=meta.placements[ref]||state.folderId||null;saveMeta(meta);rerender();}
  function archiveRef(ref){const meta=loadMeta();meta.archived[ref]=true;saveMeta(meta);rerender();}
  function archiveFolder(id){const meta=loadMeta();meta.archived[`folder:${id}`]=true;saveMeta(meta);rerender();}

  function openDetails(ref){const [type,id]=ref.split(":");if(type!=="content")return;const asset=currentAsset(id);if(!asset)return;const meta=loadMeta();const versions=asset.versions||[];modal("Content details",`<div class="pro-detail-grid"><div><small>TYPE</small><strong>${esc(asset.kind)}</strong></div><div><small>FILE NAME</small><strong>${esc(asset.fileName||"Native document")}</strong></div><div><small>DRAFT</small><strong>r${asset.draft?.revision||1}</strong></div><div><small>VERSIONS</small><strong>${versions.length}</strong></div><div><small>FOLDER</small><strong>${esc(folderName(meta.placements[ref]||null))}</strong></div><div><small>AI READY</small><strong>${["markdown","text","document","template"].includes(asset.kind)?"Protected text":"No"}</strong></div></div><section class="pro-version-list"><small>IMMUTABLE VERSION HISTORY</small>${versions.length?versions.map(v=>`<div><b>v${v.number}</b><span>${new Date(v.createdAt).toLocaleString()}</span><em>${esc(v.id)}</em></div>`).join(""):`<p>No frozen version yet.</p>`}</section><p class="pro-help">Production AI access will use authorized content/version IDs. Folder placement never grants AI permission by itself.</p>`);}

  function templatePickerMarkup(){const templates=loadContent().assets.filter(a=>a.kind==="template"&&!isArchived("content",a.id));return `<div class="template-picker-overlay" role="dialog" aria-modal="true"><div><header><button type="button" data-template-close>←</button><span><small>PRIVATE TEMPLATES · LAB</small><strong>Start from a template</strong><em>Creates content from a reusable template snapshot.</em></span></header><main>${templates.length?templates.map(t=>`<article><span class="template-kind">${contentLabel(t)}</span><div><strong>${esc(t.title)}</strong><small>${t.versions?.length||0} saved version${(t.versions?.length||0)===1?"":"s"} · ${esc(t.templateType||"content")}</small></div><button type="button" data-template-use="${esc(t.id)}">Use template</button></article>`).join(""):`<p>No templates yet. Create one from Library.</p>`}<button type="button" class="secondary" data-template-open-library>Manage templates in Library</button></main></div></div>`;}
  function enhanceContentEditor(){const main=document.querySelector(".content-editor-overlay .content-editor-main");if(!main)return;const shortcut=main.querySelector("[data-library-shortcut]")||main.querySelector(".content-library-shortcut");if(shortcut&&!main.querySelector("[data-template-shortcut]")){const card=document.createElement("section");card.className="content-template-shortcut";card.dataset.templateShortcut="";card.innerHTML=`<div><small>REUSABLE TEMPLATES</small><strong>Start from a saved template</strong><span>Use an email, message or document template without exposing a provider draft.</span></div><button type="button" data-template-picker-open>Use template</button>`;shortcut.after(card);}}
  function openTemplatePicker(){templateState={contextContentId:currentContentContextId()};if(!templateState.contextContentId)return;document.querySelector(".template-picker-overlay")?.remove();document.body.insertAdjacentHTML("beforeend",templatePickerMarkup());}
  function useTemplate(id){if(!templateState?.contextContentId)return;const content=loadContent();const template=content.assets.find(a=>a.id===id&&a.kind==="template");const target=content.assets.find(a=>a.id===templateState.contextContentId);if(!template||!target)return;const version=template.versions?.[0]||null;target.draft={...(target.draft||{}),html:sanitizeHtml(version?.html||template.draft?.html||"<p><br></p>"),plainText:version?.plainText||template.draft?.plainText||"",subject:version?.subject||template.draft?.subject||"",templateSource:{contentAssetId:template.id,contentVersionId:version?.id||null,draftRevision:template.draft?.revision||1},updatedAt:now()};target.updatedAt=now();saveContent(content);const overlay=document.querySelector(".content-editor-overlay");const body=overlay?.querySelector("[data-content-body]");if(body)body.innerHTML=target.draft.html;const subject=overlay?.querySelector("[data-content-subject]");if(subject&&target.draft.subject)subject.value=target.draft.subject;body?.dispatchEvent(new Event("input",{bubbles:true}));document.querySelector(".template-picker-overlay")?.remove();}

  function showUploadInfo(){modal("Upload file",`<p class="pro-help">Binary upload remains backend pending. Production will create a short-lived upload intent, store bytes privately, validate type/size/checksum, scan the file, then create an immutable FileVersion.</p><p class="pro-help"><b>Markdown exception:</b> when someone uploads a .md file, Check In should offer <b>Import as editable Markdown</b> so its source text can live natively in PostgreSQL for humans and authorized AI.</p>`);}

  document.addEventListener("click", event => {
    const openGlobal=event.target.closest("[data-library-open-global], .library-top-button");
    const openContext=event.target.closest("[data-library-open-context]");
    if(openGlobal||openContext){event.preventDefault();event.stopImmediatePropagation();openLibrary(Boolean(openContext));return;}
    if(event.target.closest("[data-pro-close]")){closeLibrary();return;}
    const folder=event.target.closest("[data-pro-folder]");if(folder){state.folderId=folder.dataset.proFolder||null;state.query="";state.createOpen=false;rerender();return;}
    const filter=event.target.closest("[data-pro-filter]");if(filter){state.filter=filter.dataset.proFilter;rerender();return;}
    if(event.target.closest("[data-pro-create-toggle]")){state.createOpen=!state.createOpen;rerender();return;}
    const create=event.target.closest("[data-pro-create]");if(create){const type=create.dataset.proCreate;if(type==="folder")createFolder();else createContent(type);return;}
    if(event.target.closest("[data-pro-upload-info]")){showUploadInfo();return;}
    if(event.target.closest("[data-pro-modal-close]")){document.querySelector(".pro-modal")?.remove();return;}
    if(event.target.closest("[data-pro-folder-save]")){saveNewFolder();return;}
    const open=event.target.closest("[data-pro-content-open]");if(open){openEditor(open.dataset.proContentOpen);return;}
    if(event.target.closest("[data-pro-editor-close],[data-pro-editor-done]")){closeEditor();return;}
    if(event.target.closest("[data-pro-save-version]")){saveEditor({snapshot:true});return;}
    const cmd=event.target.closest("[data-pro-command]");if(cmd){document.querySelector("[data-pro-rich-body]")?.focus();document.execCommand(cmd.dataset.proCommand,false,cmd.dataset.proValue||null);scheduleEditorSave();return;}
    if(event.target.closest("[data-pro-rich-link]")){const url=window.prompt("Link URL");const safe=safeHref(url);if(safe){document.querySelector("[data-pro-rich-body]")?.focus();document.execCommand("createLink",false,safe);scheduleEditorSave();}return;}
    const md=event.target.closest("[data-md-insert]");if(md){insertMarkdown(md.dataset.mdInsert);return;}
    const variable=event.target.closest("[data-pro-variable]");if(variable){insertVariable(variable.dataset.proVariable);return;}
    const rename=event.target.closest("[data-pro-rename]");if(rename){openRename(rename.dataset.proRename);return;}
    const renameSave=event.target.closest("[data-pro-rename-save]");if(renameSave){saveRename(renameSave.dataset.proRenameSave);return;}
    const move=event.target.closest("[data-pro-move]");if(move){openMove(move.dataset.proMove,false);return;}
    const folderMove=event.target.closest("[data-pro-folder-move]");if(folderMove){openMove(`folder:${folderMove.dataset.proFolderMove}`,true);return;}
    const moveTarget=event.target.closest("[data-pro-move-target]");if(moveTarget){moveRef(moveTarget.dataset.proMoveRef,moveTarget.dataset.proMoveTarget||null,moveTarget.dataset.proMoveFolder==="1");return;}
    const dup=event.target.closest("[data-pro-duplicate]");if(dup){duplicateContent(dup.dataset.proDuplicate);return;}
    const archive=event.target.closest("[data-pro-archive]");if(archive){archiveRef(archive.dataset.proArchive);return;}
    const folderArchive=event.target.closest("[data-pro-folder-archive]");if(folderArchive){archiveFolder(folderArchive.dataset.proFolderArchive);return;}
    const folderRename=event.target.closest("[data-pro-folder-rename]");if(folderRename){const id=folderRename.dataset.proFolderRename,meta=loadMeta(),folderObj=meta.folders.find(f=>f.id===id);if(!folderObj)return;modal("Rename folder",`<label class="pro-field"><span>Folder name</span><input type="text" data-pro-folder-rename-value value="${esc(folderObj.name)}" /></label>`,`<button type="button" class="primary" data-pro-folder-rename-save="${esc(id)}">Save</button>`);return;}
    const folderRenameSave=event.target.closest("[data-pro-folder-rename-save]");if(folderRenameSave){const value=document.querySelector("[data-pro-folder-rename-value]")?.value.trim(),meta=loadMeta(),folderObj=meta.folders.find(f=>f.id===folderRenameSave.dataset.proFolderRenameSave);if(value&&folderObj){folderObj.name=value;saveMeta(meta);}document.querySelector(".pro-modal")?.remove();rerender();return;}
    const details=event.target.closest("[data-pro-details]");if(details){openDetails(details.dataset.proDetails);return;}
    if(event.target.closest("[data-template-picker-open]")){openTemplatePicker();return;}
    if(event.target.closest("[data-template-close]")){document.querySelector(".template-picker-overlay")?.remove();return;}
    const use=event.target.closest("[data-template-use]");if(use){useTemplate(use.dataset.templateUse);return;}
    if(event.target.closest("[data-template-open-library]")){document.querySelector(".template-picker-overlay")?.remove();openLibrary(false);state.filter="templates";rerender();return;}
    if(event.target.closest("[data-content-open]")){requestAnimationFrame(()=>requestAnimationFrame(enhanceContentEditor));}
  }, true);

  document.addEventListener("input", event => {
    const search=event.target.closest("[data-pro-search]");if(search){state.query=search.value;const caret=search.selectionStart;rerender();const next=document.querySelector("[data-pro-search]");if(next){next.focus();next.setSelectionRange(caret,caret);}return;}
    if(event.target.closest("[data-pro-editor-title],[data-pro-editor-filename],[data-pro-template-subject],[data-pro-rich-body],[data-pro-source]")){
      if(event.target.matches("[data-pro-source]")&&currentAsset(editorState?.id)?.kind==="markdown"){const preview=document.querySelector("[data-pro-md-preview]");if(preview)preview.innerHTML=markdownToHtml(event.target.value);}
      scheduleEditorSave();
    }
  });

  document.addEventListener("keydown", event => {
    if(event.key!=="Escape")return;
    if(document.querySelector(".pro-modal")){document.querySelector(".pro-modal")?.remove();return;}
    if(document.querySelector(".template-picker-overlay")){document.querySelector(".template-picker-overlay")?.remove();return;}
    if(document.querySelector(".pro-editor-overlay")){closeEditor();return;}
    if(document.querySelector(".library-pro-overlay")){closeLibrary();return;}
  }, true);

  window.addEventListener("pageshow",()=>requestAnimationFrame(()=>requestAnimationFrame(enhanceContentEditor)));
  requestAnimationFrame(()=>requestAnimationFrame(enhanceContentEditor));
})();