(() => {
  "use strict";

  const root = document.documentElement;
  const editor = document.getElementById("richBodyInput");
  const source = document.getElementById("bodyInput");
  const preview = document.getElementById("bodyPreview");
  const count = document.getElementById("bodyCount");
  const themeToggle = document.getElementById("themeToggle");
  const toolbar = document.querySelector(".email-toolbar");
  const linkPanel = document.querySelector("[data-email-link-panel]");
  const linkInput = document.querySelector("[data-email-link-url]");
  if (!editor || !source || !preview) return;

  const allowedTags = new Set([
    "P","BR","STRONG","B","EM","I","U","S","STRIKE","H2","H3",
    "UL","OL","LI","BLOCKQUOTE","A","HR","PRE","CODE","DIV"
  ]);
  const blockedTags = new Set(["SCRIPT","STYLE","IFRAME","OBJECT","EMBED","SVG","MATH","FORM","INPUT","BUTTON"]);
  const safeAlign = new Set(["left","center","right"]);

  let savedRange = null;
  let lastValidHtml = editor.innerHTML;

  const esc = value => String(value ?? "").replace(/[&<>'"]/g, ch => ({
    "&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"
  }[ch]));

  function safeHref(value) {
    const href = String(value || "").trim();
    if (!href) return "";
    if (href.startsWith("#")) return href;
    if (href.startsWith("/") && !href.startsWith("//")) return href;
    try {
      const url = new URL(href);
      return ["https:","http:","mailto:"].includes(url.protocol) ? url.href : "";
    } catch {
      return "";
    }
  }

  function sanitizeHtml(html) {
    const template = document.createElement("template");
    template.innerHTML = String(html || "");

    const cleanNode = node => {
      [...node.children].forEach(child => {
        const tag = child.tagName;
        if (blockedTags.has(tag)) {
          child.remove();
          return;
        }
        if (!allowedTags.has(tag)) {
          cleanNode(child);
          child.replaceWith(...child.childNodes);
          return;
        }

        const rawHref = tag === "A" ? child.getAttribute("href") || "" : "";
        const rawAlign = child.style?.textAlign || child.getAttribute("align") || "";
        [...child.attributes].forEach(attr => child.removeAttribute(attr.name));

        if (tag === "A") {
          const href = safeHref(rawHref);
          if (href) {
            child.setAttribute("href", href);
            child.setAttribute("rel", "noopener noreferrer");
          }
        }
        if (rawAlign && safeAlign.has(rawAlign)) child.style.textAlign = rawAlign;
        cleanNode(child);
      });
    };

    cleanNode(template.content);
    return template.innerHTML;
  }

  function plainTextFromHtml(html) {
    const node = document.createElement("div");
    node.innerHTML = sanitizeHtml(html);
    return (node.innerText || node.textContent || "").replace(/\n{3,}/g, "\n\n").trim();
  }

  function setCount(length) {
    if (!count) return;
    count.textContent = `${length.toLocaleString()} character${length === 1 ? "" : "s"}`;
  }

  function syncSource() {
    const clean = sanitizeHtml(editor.innerHTML);
    const plain = plainTextFromHtml(clean);

    if (plain.length > 1_000_000) {
      editor.innerHTML = lastValidHtml;
      const restored = plainTextFromHtml(lastValidHtml);
      source.value = restored;
      setCount(restored.length);
      return;
    }

    lastValidHtml = clean;
    source.value = plain;
    setCount(plain.length);
  }

  function renderPreview() {
    preview.innerHTML = sanitizeHtml(editor.innerHTML);
  }

  function rememberRange() {
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount || !editor.contains(selection.anchorNode)) return;
    savedRange = selection.getRangeAt(0).cloneRange();
  }

  function restoreRange() {
    if (!savedRange) return;
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(savedRange);
  }

  function runCommand(command, value = null) {
    if (source.disabled) return;
    editor.focus();
    restoreRange();
    try { document.execCommand(command, false, value); } catch {}
    rememberRange();
    syncSource();
  }

  function openLinkPanel() {
    if (source.disabled || !linkPanel) return;
    rememberRange();
    linkPanel.hidden = false;
    if (linkInput) {
      linkInput.value = "";
      linkInput.focus();
    }
  }

  function closeLinkPanel() {
    if (linkPanel) linkPanel.hidden = true;
  }

  function applyLink() {
    const href = safeHref(linkInput?.value || "");
    if (!href) {
      linkInput?.focus();
      return;
    }
    restoreRange();
    runCommand("createLink", href);
    closeLinkPanel();
  }

  function setMode(mode) {
    const write = document.querySelector("[data-email-write-view]");
    const previewView = document.querySelector("[data-email-preview-view]");
    document.querySelectorAll("[data-email-mode]").forEach(button => {
      const active = button.dataset.emailMode === mode;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", String(active));
    });

    if (mode === "preview") {
      syncSource();
      renderPreview();
      if (write) write.hidden = true;
      if (previewView) previewView.hidden = false;
    } else {
      if (previewView) previewView.hidden = true;
      if (write) write.hidden = false;
      if (!source.disabled) editor.focus();
    }
  }

  function syncLockedState() {
    const locked = source.disabled;
    editor.contentEditable = locked ? "false" : "true";
    editor.classList.toggle("is-locked", locked);
    toolbar?.querySelectorAll("button").forEach(button => { button.disabled = locked; });
    if (locked) closeLinkPanel();
  }

  function applyTheme(theme) {
    const next = theme === "dark" ? "dark" : "light";
    root.dataset.theme = next;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", next === "dark" ? "#060708" : "#f5f7fa");
    if (themeToggle) {
      themeToggle.textContent = next === "dark" ? "Light" : "Dark";
      themeToggle.setAttribute("aria-pressed", String(next === "dark"));
    }
  }

  themeToggle?.addEventListener("click", () => {
    applyTheme(root.dataset.theme === "dark" ? "light" : "dark");
  });

  document.addEventListener("mousedown", event => {
    if (event.target.closest("[data-email-command], [data-email-link]")) {
      rememberRange();
      event.preventDefault();
    }
  });

  document.addEventListener("click", event => {
    const command = event.target.closest("[data-email-command]");
    if (command) {
      runCommand(command.dataset.emailCommand, command.dataset.emailValue || null);
      return;
    }

    if (event.target.closest("[data-email-link]")) { openLinkPanel(); return; }
    if (event.target.closest("[data-email-link-apply]")) { applyLink(); return; }
    if (event.target.closest("[data-email-link-remove]")) { restoreRange(); runCommand("unlink"); closeLinkPanel(); return; }
    if (event.target.closest("[data-email-link-cancel]")) { closeLinkPanel(); return; }

    const mode = event.target.closest("[data-email-mode]");
    if (mode) setMode(mode.dataset.emailMode);
  });

  editor.addEventListener("input", syncSource);
  editor.addEventListener("keyup", rememberRange);
  editor.addEventListener("mouseup", rememberRange);

  editor.addEventListener("paste", event => {
    if (source.disabled) return;
    event.preventDefault();
    const html = event.clipboardData?.getData("text/html") || "";
    const text = event.clipboardData?.getData("text/plain") || "";
    const insert = html ? sanitizeHtml(html) : `<p>${esc(text).replace(/\n/g, "<br>")}</p>`;
    try { document.execCommand("insertHTML", false, insert); } catch {
      document.execCommand("insertText", false, text);
    }
    syncSource();
  });

  linkInput?.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      event.preventDefault();
      applyLink();
    } else if (event.key === "Escape") {
      closeLinkPanel();
      editor.focus();
    }
  });

  new MutationObserver(syncLockedState).observe(source, {attributes: true, attributeFilter: ["disabled"]});

  applyTheme(root.dataset.theme || "light");
  syncSource();
  syncLockedState();
})();
