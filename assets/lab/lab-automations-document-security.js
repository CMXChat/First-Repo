(() => {
  "use strict";

  const ALLOWED = new Set(["P","BR","STRONG","B","EM","I","U","S","STRIKE","H1","H2","H3","UL","OL","LI","BLOCKQUOTE","A","HR","PRE","CODE","DIV"]);
  const BLOCKED = new Set(["SCRIPT","STYLE","IFRAME","OBJECT","EMBED","SVG","MATH","FORM","INPUT","BUTTON"]);

  function safeHref(value) {
    const href=String(value||"").trim();
    if(!href)return"";
    try { const url=new URL(href); return ["https:","http:"].includes(url.protocol)?url.href:""; } catch { return ""; }
  }

  function sanitize(html) {
    const template=document.createElement("template");template.innerHTML=String(html||"");
    const clean=node=>{
      [...node.children].forEach(child=>{
        if(BLOCKED.has(child.tagName)){child.remove();return;}
        if(!ALLOWED.has(child.tagName)){clean(child);child.replaceWith(...child.childNodes);return;}
        const href=child.tagName==="A"?child.getAttribute("href"):"";
        [...child.attributes].forEach(attr=>child.removeAttribute(attr.name));
        if(child.tagName==="A"){const safe=safeHref(href);if(safe){child.setAttribute("href",safe);child.setAttribute("rel","noopener noreferrer");}}
        clean(child);
      });
    };
    clean(template.content);return template.innerHTML;
  }

  function sanitizeOpenDocument() {
    const body=document.querySelector("[data-document-body]");
    if(body)body.innerHTML=sanitize(body.innerHTML);
  }

  document.addEventListener("paste",event=>{
    const body=event.target.closest?.("[data-document-body]");if(!body)return;
    event.preventDefault();
    const html=event.clipboardData?.getData("text/html")||"";
    const text=event.clipboardData?.getData("text/plain")||"";
    body.focus();
    if(html)document.execCommand("insertHTML",false,sanitize(html));else document.execCommand("insertText",false,text);
    body.dispatchEvent(new Event("input",{bubbles:true}));
  });

  document.addEventListener("drop",event=>{
    if(!event.target.closest?.("[data-document-body]"))return;
    if(event.dataTransfer?.files?.length){event.preventDefault();}
  });

  document.addEventListener("click",event=>{
    if(event.target.closest("[data-library-doc-open],[data-library-new-document]"))requestAnimationFrame(()=>requestAnimationFrame(sanitizeOpenDocument));
    if(event.target.closest("[data-document-save-version],[data-document-done],[data-document-close]"))sanitizeOpenDocument();
  },true);
})();