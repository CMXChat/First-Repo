(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);

  const exactReplacements = new Map([
    ["Every CMX page she can explore.", "Explore the complete CMX platform."],
    ["The map below matches the larger platform map used elsewhere, with private personal briefings removed. Finished tools, plans and experiments are labeled honestly.", "Start with the recommended path, then reveal the complete project map. Each page opens a different part of the tools, infrastructure, research, AI planning and experiments behind the platform."],
    ["The best product ideas often come from the person asking, “Why would anyone want that?” and then improving the answer.", "The best product ideas often begin when you ask, “Why would I want this?” and then improve the answer."],
    ["The real product could compare sleep, mood, spending, appointments, habits or stress only when the user chooses to track them.", "You could choose to compare sleep, mood, spending, appointments, habits or stress, and nothing would be tracked without your approval."],
    ["Move behind a real server login so each person sees only their own briefing and private data.", "Move behind a real server login so your briefing and private data stay yours."],
    ["Store preferences, corrections, goals, past editions and approved pattern data in an organized way.", "Store your preferences, corrections, goals, past editions and approved pattern data in an organized way."],
    ["Let the user opt into calendar, email, Spotify, finances and other services with precise permissions.", "Choose whether to connect your calendar, email, Spotify, finances or other services with precise permissions."],
    ["The page can eventually become quieter, smarter and more personal. The important part is that the person stays in control of what it knows, what it remembers and what it is allowed to do.", "This can eventually become quieter, smarter and more personal. The important part is that you stay in control of what it knows, what it remembers and what it is allowed to do."],
    ["The personal Logan and Crystal briefings are intentionally excluded from Debbie's map.", ""]
  ]);

  function setText(selector, value) {
    const element = $(selector);
    if (element && element.textContent !== value) element.textContent = value;
  }

  function applyVoice() {
    if (document.title !== "Your Brooklyn Brief | August 2, 2026") {
      document.title = "Your Brooklyn Brief | August 2, 2026";
    }
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle && ogTitle.content !== "Your Brooklyn Brief") ogTitle.content = "Your Brooklyn Brief";

    setText(".brand strong", "YOUR BROOKLYN BRIEF");
    setText(".gate-card .eyebrow", "YOUR RESTRICTED BRIEF");
    setText("footer > span", "Your Brooklyn Brief · private concept edition");
    setText("#explore .section-head h2", "Explore the complete CMX platform.");
    setText("#explore .section-head > p", "Start with the recommended path, then reveal the complete project map. Each page opens a different part of the tools, infrastructure, research, AI planning and experiments behind the platform.");
    setText("#brainstorm .section-head h2", "Help shape something you would actually use.");

    const walkerRoot = document.getElementById("app") || document.body;
    const walker = document.createTreeWalker(walkerRoot, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const trimmed = node.nodeValue.trim();
      if (exactReplacements.has(trimmed)) {
        node.nodeValue = node.nodeValue.replace(trimmed, exactReplacements.get(trimmed));
      }
    }
  }

  function start() {
    applyVoice();
    let scheduled = false;
    const observer = new MutationObserver(() => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        applyVoice();
      });
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    window.setTimeout(() => observer.disconnect(), 20000);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();