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
        { type: "directory.match_or_create_people", detail: "Resolve close-family People", note: "Search existing stable identities before proposing creates." },
        { type: "directory.apply_label", detail: "Apply Family label", note: "Descriptive metadata only. No permission is implied." },
        { type: "directory.upsert_group", detail: "Create or update Family group", note: "Saved selectors resolve current People." },
        { type: "automation.reference_audience", detail: "Expose Family as an Audience selector", note: "Definition-only. No provider execution." }
      ],
      blockers: ["Real duplicate resolution and protected identity matching require server Directory services."]
    },
    {
      id: "business",
      label: "Business contacts",
      prompt: "Organize my accountant, lawyer and business partners, connect them to the right organizations, and create useful groups for operations.",
      operations: [
        { type: "directory.match_people", detail: "Match accountant, lawyer and partners", note: "Preserve existing stable Person identities." },
        { type: "directory.match_organizations", detail: "Resolve related Organizations", note: "Do not create duplicates from display-name matches alone." },
        { type: "directory.upsert_membership", detail: "Create Person-Organization memberships", note: "Typed membership records keep identity separate from organization." },
        { type: "directory.upsert_relationship", detail: "Record useful Person relationships", note: "Relationships remain descriptive and do not grant authority." },
        { type: "directory.upsert_group", detail: "Create operations Groups", note: "Groups become reusable saved audiences." }
      ],
      blockers: ["Ambiguous People or Organization matches would require explicit review before apply."]
    },
    {
      id: "continuity",
      label: "Continuity setup",
      prompt: "Set up my emergency contacts and create a missed Check In escalation that reaches family first and a backup contact later.",
      operations: [
        { type: "directory.match_or_create_people", detail: "Resolve emergency People", note: "Check identity and current contact readiness." },
        { type: "directory.upsert_group", detail: "Create primary and backup Groups", note: "Deduplicate resolved People by Person ID." },
        { type: "automation.create_draft", detail: "Create missed Check In escalation", note: "The same typed Draft a human edits." },
        { type: "automation.reference_audience", detail: "Attach primary and backup Audience selectors", note: "Stable Directory selectors, not copied email strings." },
        { type: "automation.add_wait", detail: "Add delayed backup escalation", note: "Inter-step WAIT requires future Runtime before execution." }
      ],
      blockers: [
        "Protected Audience identity and channel readiness require server Directory services.",
        "Inter-step WAIT requires future Runtime before anything can execute."
      ]
    },
    {
      id: "continuum",
      label: "Full Continuum setup",
      prompt: "Organize my family and emergency contacts, create a continuity folder with instructions, and build a missed Check In workflow that reaches family first and a backup contact later.",
      operations: [
        { type: "directory.match_or_create_people", detail: "Resolve family and emergency People", note: "Read before write and surface duplicate candidates." },
        { type: "directory.upsert_group", detail: "Create Family and Backup groups", note: "Saved audiences resolve current protected identities." },
        { type: "library.create_folder", detail: "Create Continuity folder", note: "Protected Library structure only." },
        { type: "library.create_document", detail: "Create continuity instructions Draft", note: "Mutable Draft until explicitly versioned/published." },
        { type: "automation.create_draft", detail: "Create missed Check In escalation", note: "Ordinary typed Automation Draft." },
        { type: "automation.reference_audience", detail: "Reference Family then Backup audiences", note: "Stable selector IDs, with future Run resolution." },
        { type: "automation.reference_content", detail: "Reference continuity instructions", note: "Publish later freezes an exact immutable ContentVersion." },
        { type: "automation.add_wait", detail: "Wait before backup escalation", note: "Runtime-required inter-step control." }
      ],
      blockers: [
        "Real People/Organization matching requires protected Directory services.",
        "Library mutations and immutable version references require protected Library services.",
        "Runtime/provider execution remains unavailable."
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
    document.documentElement.dataset.labDirectoryPlanner = "typed-v2";
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
      <header><div><span>CONTINUUM PLANNER · PREVIEW</span><h2 id="dir2AiTitle">Describe how you want Continuum organized.</h2><p>The future Planner will translate natural language into one reviewed typed Change Plan across Directory, Automations and Library. This Lab surface has no AI model or mutation authority.</p></div><button type="button" data-dir2-ai-close aria-label="Close">×</button></header>
      <div class="dir2-ai-body">
        <label class="dir2-ai-prompt"><span>WHAT SHOULD CONTINUUM SET UP?</span><textarea data-dir2-ai-prompt placeholder="Example: Add my accountant, connect her to my company, label her finance, create a Finance group, and build a monthly review Automation."></textarea></label>
        <div class="dir2-ai-examples"><span>TRY A TYPED PLAN EXAMPLE</span><div>${EXAMPLES.map(example => `<button type="button" data-dir2-ai-example="${esc(example.id)}">${esc(example.label)}</button>`).join("")}</div></div>
        <section class="dir2-ai-contract" data-dir2-ai-result>
          <span>TYPED CHANGE PLAN · PREVIEW</span>
          <div class="dir2-ai-flow"><b>1 · DESCRIBE</b><i>→</i><b>2 · PLAN</b><i>→</i><b>3 · PREFLIGHT</b><i>→</i><b>4 · REVIEW</b><i>→</i><b>5 · APPLY</b></div>
          <p>A real Planner will return allowlisted typed operations, stable references, conflicts and permission requirements before anything changes.</p>
        </section>
      </div>
      <footer><span>NO AI CALL · NO DATA MUTATION · NO HIDDEN AUTHORITY</span><div><button type="button" data-dir2-ai-close>Close</button><button type="button" class="primary" data-dir2-ai-preview>Preview Change Plan</button></div></footer>
    </section>`;
    document.body.append(modal);
    document.body.classList.add("dir2-ai-open");
  }

  function closePlanner() {
    modal?.remove();
    modal = null;
    document.body.classList.remove("dir2-ai-open");
  }

  function operationsMarkup(operations) {
    return `<div class="dir2-ai-ops">${operations.map((operation, index) => `<article><b>${String(index + 1).padStart(2, "0")}</b><span><small>${esc(operation.type)}</small><strong>${esc(operation.detail)}</strong><em>${esc(operation.note)}</em></span></article>`).join("")}</div>`;
  }

  function blockersMarkup(blockers = []) {
    if (!blockers.length) return `<div class="dir2-ai-gates"><div><b>PREFLIGHT</b><span>No fixed-example blocker is represented. Real server preflight still validates identity, scope, authority and dependencies.</span></div></div>`;
    return `<div class="dir2-ai-gates">${blockers.map(blocker => `<div><b>PREFLIGHT</b><span>${esc(blocker)}</span></div>`).join("")}</div>`;
  }

  function examplePlan(example) {
    return `<span>TYPED PLAN PREVIEW · LOCAL</span><h3>${esc(example.label)}</h3><p class="dir2-ai-intent">“${esc(example.prompt)}”</p>${operationsMarkup(example.operations)}${blockersMarkup(example.blockers)}<p>This is a fixed product example. Continuum did not interpret the text, call a model or mutate any domain.</p>`;
  }

  function genericContract() {
    const value = modal?.querySelector("[data-dir2-ai-prompt]")?.value.trim() || "Your natural-language setup request";
    return `<span>CHANGE PLAN CONTRACT · NO AI CALL</span><h3>Planner request</h3><p class="dir2-ai-intent">“${esc(value)}”</p><div class="dir2-ai-gates"><div><b>INTENT</b><span>Interpret the requested outcome without treating prompt text as authority.</span></div><div><b>TYPED PLAN</b><span>Propose allowlisted operations against known Directory, Automation and Library services.</span></div><div><b>PREFLIGHT</b><span>Resolve duplicates, stable IDs, stale revisions, missing fields, authority and cross-domain dependencies.</span></div><div><b>REVIEW</b><span>Show exact proposed changes, conflicts and which operations require explicit confirmation.</span></div><div><b>APPLY</b><span>Normal protected domain services perform approved mutations and return authoritative state.</span></div></div><p>This free-text Lab control does not interpret the request. Use a fixed example to inspect the current typed-plan vocabulary.</p>`;
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