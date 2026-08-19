(() => {
  "use strict";

  if (document.body?.dataset.labMode !== "true") return;

  let modal = null;
  let queued = false;

  const esc = value => String(value ?? "").replace(/[&<>'"]/g, ch => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  }[ch]));

  const EXAMPLES = Object.freeze([
    {
      id: "family",
      label: "Family setup",
      prompt: "Add my close family, label them family, create a Family group, and make it easy for Automations to target them.",
      operations: [
        ["Directory", "Create or match People", "Resolve names before creating duplicates"],
        ["Directory", "Apply family Label", "Descriptive metadata only"],
        ["Directory", "Create or update Family Group", "Group resolves current People"],
        ["Automations", "Expose Family as an Audience selector", "No provider execution"]
      ]
    },
    {
      id: "business",
      label: "Business contacts",
      prompt: "Organize my accountant, lawyer and business partners, connect them to the right organizations, and create useful groups for operations.",
      operations: [
        ["Directory", "Match People and Organizations", "Preserve stable identities"],
        ["Directory", "Create memberships and relationships", "Typed relationship records"],
        ["Directory", "Apply useful Labels", "No permission is implied"],
        ["Directory", "Create operations Groups", "Saved audience selectors"]
      ]
    },
    {
      id: "continuity",
      label: "Continuity setup",
      prompt: "Set up my emergency contacts and create a missed Check In escalation that reaches family first and a backup contact later.",
      operations: [
        ["Directory", "Match emergency People", "Check channel readiness"],
        ["Directory", "Create primary and backup Groups", "Deduplicate by Person ID"],
        ["Automations", "Create a Draft escalation workflow", "Same typed Draft as human UI"],
        ["Automations", "Run preflight", "Runtime and providers remain unavailable in Lab"]
      ]
    }
  ]);

  function patch() {
    queued = false;
    const command = document.querySelector(".lab-directory-v2 .dir2-command");
    if (!command) return;
    if (!command.querySelector("[data-dir2-ai-setup]")) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "dir2-ai-setup";
      button.dataset.dir2AiSetup = "true";
      button.innerHTML = `<span>✦</span> AI setup`;
      const create = command.querySelector('[data-dir2-action="new"]');
      if (create) create.before(button); else command.append(button);
    }
    document.documentElement.dataset.labDirectoryPlanner = "preview-v1";
  }

  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => requestAnimationFrame(patch));
  }

  function openPlanner() {
    closePlanner();
    modal = document.createElement("div");
    modal.className = "dir2-ai-backdrop";
    modal.innerHTML = `<section class="dir2-ai-modal" role="dialog" aria-modal="true" aria-labelledby="dir2AiTitle">
      <header><div><span>AI SETUP · PREVIEW</span><h2 id="dir2AiTitle">Describe how you want Directory organized.</h2><p>The future Continuum Planner will translate natural language into a reviewed typed Change Plan across Directory, Automations and Library. No AI model is connected in this Lab preview.</p></div><button type="button" data-dir2-ai-close aria-label="Close">×</button></header>
      <div class="dir2-ai-body">
        <label class="dir2-ai-prompt"><span>WHAT SHOULD CONTINUUM SET UP?</span><textarea data-dir2-ai-prompt placeholder="Example: Add my accountant, connect her to my company, label her finance, and create a Finance group."></textarea></label>
        <div class="dir2-ai-examples"><span>TRY A PRODUCT EXAMPLE</span><div>${EXAMPLES.map(example => `<button type="button" data-dir2-ai-example="${esc(example.id)}">${esc(example.label)}</button>`).join("")}</div></div>
        <section class="dir2-ai-contract" data-dir2-ai-result>
          <span>CHANGE PLAN CONTRACT</span>
          <div class="dir2-ai-flow"><b>1 · DESCRIBE</b><i>→</i><b>2 · PLAN</b><i>→</i><b>3 · PREFLIGHT</b><i>→</i><b>4 · REVIEW</b><i>→</i><b>5 · APPLY</b></div>
          <p>A real Planner will return typed operations with stable references, conflicts and permission requirements before anything is changed.</p>
        </section>
      </div>
      <footer><span>No model call · no data mutation · no hidden AI authority</span><div><button type="button" data-dir2-ai-close>Close</button><button type="button" class="primary" data-dir2-ai-preview>Show change-plan contract</button></div></footer>
    </section>`;
    document.body.append(modal);
    document.body.classList.add("dir2-ai-open");
  }

  function closePlanner() {
    modal?.remove();
    modal = null;
    document.body.classList.remove("dir2-ai-open");
  }

  function examplePlan(example) {
    return `<span>EXAMPLE CHANGE PLAN · NO MODEL CALL</span><h3>${esc(example.label)}</h3><p class="dir2-ai-intent">“${esc(example.prompt)}”</p><div class="dir2-ai-ops">${example.operations.map((operation, index) => `<article><b>${String(index + 1).padStart(2, "0")}</b><span><small>${esc(operation[0])}</small><strong>${esc(operation[1])}</strong><em>${esc(operation[2])}</em></span></article>`).join("")}</div><p>This is a fixed product example showing the shape of a future Planner result. Continuum did not interpret the text or mutate Directory.</p>`;
  }

  function genericContract() {
    const value = modal?.querySelector("[data-dir2-ai-prompt]")?.value.trim() || "Your natural-language setup request";
    return `<span>CHANGE PLAN CONTRACT · PREVIEW ONLY</span><h3>Planner request</h3><p class="dir2-ai-intent">“${esc(value)}”</p><div class="dir2-ai-gates"><div><b>INTENT</b><span>AI interprets the requested outcome.</span></div><div><b>TYPED PLAN</b><span>Propose create/update/link/archive operations against known domain services.</span></div><div><b>PREFLIGHT</b><span>Resolve duplicates, stable IDs, missing fields, authority and cross-domain dependencies.</span></div><div><b>REVIEW</b><span>Show exact proposed changes and which ones need explicit confirmation.</span></div><div><b>APPLY</b><span>Normal protected services perform approved mutations and return authoritative state.</span></div></div><p>No model is connected here, so the Lab does not attempt to interpret or execute this request.</p>`;
  }

  document.addEventListener("click", event => {
    const open = event.target.closest?.("[data-dir2-ai-setup]");
    if (open) {
      event.preventDefault();
      openPlanner();
      return;
    }
    const close = event.target.closest?.("[data-dir2-ai-close]");
    if (close || event.target === modal) {
      event.preventDefault();
      closePlanner();
      return;
    }
    const exampleButton = event.target.closest?.("[data-dir2-ai-example]");
    if (exampleButton && modal) {
      event.preventDefault();
      const example = EXAMPLES.find(item => item.id === exampleButton.dataset.dir2AiExample);
      if (!example) return;
      const prompt = modal.querySelector("[data-dir2-ai-prompt]");
      if (prompt) prompt.value = example.prompt;
      const result = modal.querySelector("[data-dir2-ai-result]");
      if (result) result.innerHTML = examplePlan(example);
      return;
    }
    const preview = event.target.closest?.("[data-dir2-ai-preview]");
    if (preview && modal) {
      event.preventDefault();
      const result = modal.querySelector("[data-dir2-ai-result]");
      if (result) result.innerHTML = genericContract();
      return;
    }
    schedule();
  }, true);

  document.addEventListener("cmx:lab-crm-updated", schedule);
  window.addEventListener("cmx:lab-directory-updated", schedule);
  window.addEventListener("pageshow", schedule);
  schedule();
})();