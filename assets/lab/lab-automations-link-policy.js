(() => {
  "use strict";

  const LINK_INPUT_SELECTORS = ["[data-content-link-url]", "[data-pro-link-url]"];
  const LINK_APPLY_SELECTORS = ["[data-content-link-apply]", "[data-pro-link-apply]"];
  const EDITOR_SELECTORS = ["[data-content-body]", "[data-pro-rich-body]", "[data-document-body]"];

  function safeHref(value) {
    const href = String(value || "").trim();
    if (!href) return "";
    if (href.startsWith("#")) return href;
    if (href.startsWith("/") && !href.startsWith("//")) return href;
    try {
      const url = new URL(href);
      return ["https:", "mailto:"].includes(url.protocol) ? url.href : "";
    } catch {
      return "";
    }
  }

  function sanitizeLinks(root = document) {
    root.querySelectorAll?.(EDITOR_SELECTORS.join(",")).forEach(editor => {
      editor.querySelectorAll("a[href]").forEach(anchor => {
        const href = safeHref(anchor.getAttribute("href"));
        if (!href) {
          anchor.removeAttribute("href");
          anchor.removeAttribute("target");
          anchor.removeAttribute("rel");
          return;
        }
        anchor.setAttribute("href", href);
        anchor.setAttribute("rel", "noopener noreferrer");
        if (/^https:/i.test(href)) anchor.setAttribute("target", "_blank");
        else anchor.removeAttribute("target");
      });
    });
  }

  function rejectUnsafeLink(button) {
    const panel = button.closest("[data-content-link-panel],.pro-link-panel") || button.parentElement;
    const input = LINK_INPUT_SELECTORS.map(selector => panel?.querySelector(selector)).find(Boolean)
      || LINK_INPUT_SELECTORS.map(selector => document.querySelector(selector)).find(Boolean);
    if (!input) return false;
    const raw = input.value.trim();
    if (!raw || safeHref(raw)) {
      input.setCustomValidity("");
      return false;
    }
    input.setCustomValidity("Use an HTTPS, mailto, internal /path, or #anchor link.");
    input.reportValidity();
    input.focus();
    return true;
  }

  document.addEventListener("click", event => {
    const apply = event.target.closest(LINK_APPLY_SELECTORS.join(","));
    if (apply && rejectUnsafeLink(apply)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }

    if (event.target.closest("[data-content-save],[data-content-done],[data-pro-save-version],[data-pro-editor-done],[data-pro-editor-close]")) {
      sanitizeLinks();
    }
  }, true);

  document.addEventListener("input", event => {
    if (event.target.matches?.(LINK_INPUT_SELECTORS.join(","))) event.target.setCustomValidity("");
  }, true);

  document.addEventListener("paste", event => {
    if (!event.target.closest?.(EDITOR_SELECTORS.join(","))) return;
    setTimeout(() => sanitizeLinks(event.target.closest(EDITOR_SELECTORS.join(","))), 0);
  }, true);

  window.addEventListener("pageshow", () => requestAnimationFrame(() => sanitizeLinks()));
})();
