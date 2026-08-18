(() => {
  "use strict";
  const META_KEY = "cmx-lab-library-meta-v1";
  let savedRange = null;
  let templateBypass = null;

  const esc = value => String(value ?? "").replace(/[&<>'"]/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[ch]));
  const load = (key,fallback) => { try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; } };
  const save = (key,value) => localStorage.setItem(key,JSON.stringify(value));

  function showModal(title, html, actions="") {
    document.querySelector(".pro-modal")?.remove();
    document.body.insertAdjacentHTML("beforeend",`<div class="pro-modal" role="dialog" aria-modal="true"><div><small>PRIVATE LIBRARY</small><h2>${esc(title)}</h2>${html}<div class="pro-modal-actions">${actions}<button type="button" data-pro-modal-close>Cancel</button></div></div></div>`);
  }

  function linkPanel() {
    const main=document.querySelector(".pro-editor-main"); if(!main)return null;
    let panel=main.querySelector("[data-pro-link-panel]");
    if(!panel){
      panel=document.createElement("section");panel.className="pro-link-panel";panel.dataset.proLinkPanel="";
      panel.innerHTML=`<label><span>Link URL</span><input type="url" inputmode="url" placeholder="https://example.com" data-pro-link-url /></label><button type="button" data-pro-link-apply>Apply link</button><button type="button" data-pro-link-cancel>Cancel</button>`;
      const toolbar=main.querySelector(".pro-rich-toolbar"); toolbar?.after(panel);
    }
    return panel;
  }
  function safeHref(value){const href=String(value||"").trim();if(!href)return"";try{const url=new URL(href);return["https:","http:","mailto:"].includes(url.protocol)?url.href:"";}catch{return"";}}
  function openLinkPanel(){
    const body=document.querySelector("[data-pro-rich-body]");if(!body)return;
    const selection=window.getSelection();
    if(selection?.rangeCount){const range=selection.getRangeAt(0);if(body.contains(range.commonAncestorContainer))savedRange=range.cloneRange();}
    const panel=linkPanel();if(!panel)return;panel.hidden=false;const input=panel.querySelector("[data-pro-link-url]");input.value="";input.focus();
  }
  function closeLinkPanel(){const panel=document.querySelector("[data-pro-link-panel]");if(panel)panel.hidden=true;savedRange=null;}
  function applyLink(){
    const panel=document.querySelector("[data-pro-link-panel]");const input=panel?.querySelector("[data-pro-link-url]");const href=safeHref(input?.value);const body=document.querySelector("[data-pro-rich-body]");if(!href||!body)return;
    body.focus();if(savedRange){const sel=window.getSelection();sel.removeAllRanges();sel.addRange(savedRange);}document.execCommand("createLink",false,href);body.dispatchEvent(new Event("input",{bubbles:true}));closeLinkPanel();
  }

  function folderHasChildren(id){
    const meta=load(META_KEY,{folders:[],placements:{},archived:{}});if((meta.folders||[]).some(f=>f.parentId===id&&!meta.archived?.[`folder:${f.id}`]))return true;
    return Object.entries(meta.placements||{}).some(([ref,folderId])=>folderId===id&&!meta.archived?.[ref]);
  }

  function enhanceArchivedCards(){
    const archived=document.querySelector('[data-pro-filter="archived"].is-active');if(!archived)return;
    document.querySelectorAll(".library-pro-overlay [data-pro-archive]").forEach(button=>{
      const ref=button.dataset.proArchive;button.removeAttribute("data-pro-archive");button.dataset.proRestore=ref;button.textContent="Restore";
    });
  }
  function scheduleEnhance(){requestAnimationFrame(()=>requestAnimationFrame(enhanceArchivedCards));}

  function confirmTemplate(button){
    const body=document.querySelector(".content-editor-overlay [data-content-body]");const text=(body?.innerText||body?.textContent||"").trim();
    if(!text)return false;
    const id=button.dataset.templateUse;
    showModal("Replace current draft?",`<p class="pro-help">This content draft already has text. Using the template will replace the current body with the selected Template snapshot. The Template itself will not be edited.</p>`,`<button type="button" class="primary" data-template-confirm-use="${esc(id)}">Use template anyway</button>`);
    return true;
  }

  document.addEventListener("click",event=>{
    if(event.target.closest("[data-pro-rich-link]")){
      event.preventDefault();event.stopImmediatePropagation();openLinkPanel();return;
    }
    if(event.target.closest("[data-pro-link-apply]")){event.preventDefault();event.stopImmediatePropagation();applyLink();return;}
    if(event.target.closest("[data-pro-link-cancel]")){event.preventDefault();event.stopImmediatePropagation();closeLinkPanel();return;}

    const folderArchive=event.target.closest("[data-pro-folder-archive]");
    if(folderArchive&&folderHasChildren(folderArchive.dataset.proFolderArchive)){
      event.preventDefault();event.stopImmediatePropagation();showModal("Folder is not empty",`<p class="pro-help">Move or archive the items inside this folder first. The production backend will never silently orphan child folders or Library items.</p>`);return;
    }

    const restore=event.target.closest("[data-pro-restore]");
    if(restore){event.preventDefault();event.stopImmediatePropagation();const meta=load(META_KEY,{folders:[],placements:{},archived:{}});meta.archived=meta.archived||{};meta.archived[restore.dataset.proRestore]=false;save(META_KEY,meta);document.querySelector('[data-pro-filter="archived"]')?.click();scheduleEnhance();return;}

    const use=event.target.closest("[data-template-use]");
    if(use){
      if(templateBypass===use.dataset.templateUse){templateBypass=null;return;}
      if(confirmTemplate(use)){event.preventDefault();event.stopImmediatePropagation();return;}
    }
    const confirm=event.target.closest("[data-template-confirm-use]");
    if(confirm){event.preventDefault();event.stopImmediatePropagation();const id=confirm.dataset.templateConfirmUse;templateBypass=id;document.querySelector(".pro-modal")?.remove();document.querySelector(`[data-template-use="${CSS.escape(id)}"]`)?.click();return;}

    if(event.target.closest("[data-pro-filter],[data-pro-archive],[data-pro-move-target],[data-pro-rename-save],[data-pro-duplicate]"))scheduleEnhance();
  },true);

  document.addEventListener("keydown",event=>{if(event.key==="Escape"&&document.querySelector("[data-pro-link-panel]:not([hidden])")){event.preventDefault();event.stopImmediatePropagation();closeLinkPanel();}},true);
  window.addEventListener("pageshow",scheduleEnhance);
})();