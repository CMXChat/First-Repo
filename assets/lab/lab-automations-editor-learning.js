(() => {
  "use strict";

  const LABELS = {
    undo:"Undo",redo:"Redo",bold:"Bold",italic:"Italic",underline:"Underline",strikeThrough:"Strikethrough",
    insertUnorderedList:"Bulleted list",insertOrderedList:"Numbered list",justifyLeft:"Align left",justifyCenter:"Align center",justifyRight:"Align right",
    insertHorizontalRule:"Divider",removeFormat:"Clear formatting"
  };
  const MARKDOWN_LABELS = {
    heading:"Heading",bold:"Bold",italic:"Italic",strike:"Strikethrough",list:"Bulleted list",quote:"Quote",link:"Insert link",code:"Inline code"
  };

  function labelFor(button) {
    if (!button) return "";
    if (button.matches("[data-rich-link],[data-doc-link],[data-pro-rich-link]")) return "Insert link";
    if (button.matches("[data-md-insert]")) return MARKDOWN_LABELS[button.dataset.mdInsert] || button.getAttribute("title") || "Markdown formatting";
    const command = button.dataset.richCommand || button.dataset.docCommand || button.dataset.proCommand;
    const value = button.dataset.richValue || button.dataset.docValue || button.dataset.proValue;
    if (command === "formatBlock") {
      if (value === "P") return "Paragraph";
      if (value === "H1") return "Heading 1";
      if (value === "H2") return "Heading 2";
      if (value === "H3") return "Heading 3";
      if (value === "BLOCKQUOTE") return "Quote";
      if (value === "PRE") return "Code block";
    }
    return LABELS[command] || button.getAttribute("aria-label") || button.getAttribute("title") || "Formatting";
  }

  function teach(button) {
    const label = labelFor(button);
    if (!label) return;

    button.classList.remove("is-learning-flash");
    void button.offsetWidth;
    button.classList.add("is-learning-flash");
    clearTimeout(button._learningFlashTimer);
    button._learningFlashTimer = setTimeout(() => button.classList.remove("is-learning-flash"), 300);

    document.querySelector(".editor-learning-tip")?.remove();
    const tip = document.createElement("div");
    tip.className = "editor-learning-tip";
    tip.setAttribute("role","status");
    tip.setAttribute("aria-live","polite");
    tip.textContent = label;
    document.body.append(tip);
    const rect = button.getBoundingClientRect();
    requestAnimationFrame(() => {
      const width = tip.offsetWidth || 90;
      const left = Math.min(window.innerWidth - width - 10, Math.max(10, rect.left + rect.width / 2 - width / 2));
      const above = rect.top - tip.offsetHeight - 8;
      tip.style.left = `${left}px`;
      tip.style.top = `${above > 8 ? above : rect.bottom + 8}px`;
      tip.classList.add("is-visible");
    });
    clearTimeout(teach.timer);
    teach.timer = setTimeout(() => tip.remove(), 900);
  }

  document.addEventListener("click", event => {
    const button = event.target.closest("[data-rich-command],[data-rich-link],[data-doc-command],[data-doc-link],[data-pro-command],[data-pro-rich-link],[data-md-insert]");
    if (button) teach(button);
  }, true);
})();