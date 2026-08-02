(() => {
  "use strict";

  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];
  const STORAGE_KEY = "cmx-eli-review-v1";
  const NOTES_KEY = "cmx-eli-notes-v1";

  const evidence = [
    {
      id: "approval",
      category: "planning",
      icon: "APP",
      title: "Development approval letter",
      status: "critical",
      summary: "Questionable agency identity, dates, authority, and contact details.",
      claims: ["Permission for five units", "Application and approval dates shown", "Government-style presentation"],
      concerns: ["The named office may not issue building approvals", "Application date predates the relationship by about a year", "Application reportedly fell on a Sunday", "Approval reportedly followed two days later", "Contact details and parcel identifiers were insufficient"],
      resolves: "Direct written authentication from the actual issuing authority and confirmation of the correct planning jurisdiction."
    },
    {
      id: "binder",
      category: "money",
      icon: "BIN",
      title: "Early binder agreement",
      status: "warning",
      summary: "Weak parcel description and limited buyer protections.",
      claims: ["US$1,000 binder deposit", "Agreement to purchase one parcel"],
      concerns: ["Visible copy appeared unsigned", "No reliable title, plan, coordinates, or detailed legal description", "Weak refund, due-diligence, warranty, and closing protections"],
      resolves: "A buyer-lawyer-approved agreement tied to independently verified title and survey records."
    },
    {
      id: "credentials",
      category: "credentials",
      icon: "LAW",
      title: "Attorney credentials",
      status: "critical",
      summary: "The only practising certificate supplied is expressly limited to 2024.",
      claims: ["Ghana Bar number 84374", "Claimed call date in 2010", "2024 active-member card"],
      concerns: ["No 2026 practising certificate", "No independent confirmation of current good standing", "No independent confirmation of the chamber or office", "Scanned credentials are not regulator authentication"],
      resolves: "Direct confirmation from the General Legal Council and Ghana Bar Association for 2026."
    },
    {
      id: "title",
      category: "land",
      icon: "TTL",
      title: "Land title certificate",
      status: "warning",
      summary: "Detailed title information is supplied, but the key date conflicts with the search report.",
      claims: ["Title GA 872195", "Parcel GA-376-4893", "Four acres", "Frimpong Akwasi", "2021 registration and issue"],
      concerns: ["The 2021 registration date conflicts with 2018 in the search report", "No direct Lands Commission authentication", "Historical no-encumbrance language is not current"],
      resolves: "A fresh official search and written Lands Commission explanation of the registration history."
    },
    {
      id: "survey",
      category: "land",
      icon: "SRV",
      title: "Survey / site plan",
      status: "critical",
      summary: "Coordinates are useful, but the claimed survey date follows the approval stamp by three years.",
      claims: ["UTM coordinates", "Four-acre boundary", "Named surveyor and licence number", "Road access shown"],
      concerns: ["Fieldwork stated as March 2024", "Approval stamp dated March 2021", "Plan references appear inconsistent across documents", "Surveyor and licence remain unconfirmed"],
      resolves: "Independent re-survey, surveyor verification, and direct Lands Commission authentication."
    },
    {
      id: "search",
      category: "land",
      icon: "SRC",
      title: "Official search report",
      status: "critical",
      summary: "The report expired around August 2024 and cannot establish the 2026 position.",
      claims: ["No encumbrances as of May 2024", "Frimpong Akwasi identified", "Four-acre parcel identified"],
      concerns: ["Valid for only three months", "Registration date conflicts with the title certificate", "Plan reference appears inconsistent", "No information about 2026 caveats, transfers, litigation, or liens"],
      resolves: "A new search ordered independently by buyer’s counsel."
    },
    {
      id: "indenture",
      category: "land",
      icon: "IND",
      title: "Indenture / conveyance",
      status: "plausible",
      summary: "It may explain the 2018 date, but the full chain still requires verification.",
      claims: ["2018 transfer from Kwame Mensah to Frimpong Akwasi", "Earlier 2012 chain reference", "Four acres at West Trasacco"],
      concerns: ["Prior ownership and authority remain unverified", "Certified-copy markings have not been authenticated", "The exact legal-interest match must be confirmed"],
      resolves: "Independent confirmation of every link in the chain through official records."
    },
    {
      id: "escrow",
      category: "money",
      icon: "ESC",
      title: "Escrow agreement",
      status: "critical",
      summary: "The seller-side lawyer controls the claimed client account and release conditions.",
      claims: ["Stanbic client account", "Refund and release language", "Buyer, seller, and escrow signatures"],
      concerns: ["Account not independently verified", "Firm and 2026 status unverified", "No independent buyer-counsel approval required", "Email on letterhead misspells ‘associates’", "Purchase-agreement date conflict"],
      resolves: "Direct bank confirmation and rewritten terms approved by independent buyer’s counsel."
    },
    {
      id: "purchase",
      category: "money",
      icon: "PSA",
      title: "Purchase and sale agreement",
      status: "critical",
      summary: "The agreement conflicts with the escrow route and contains date irregularities.",
      claims: ["US$400,000 price", "US$1,000 paid", "Two future instalments", "Seller and buyer identified"],
      concerns: ["Payment to seller conflicts with payment to escrow", "Agreement date conflicts with escrow agreement", "Signatures appear to predate the agreement", "Deposit movement remains undocumented"],
      resolves: "One corrected agreement with one date, one payment route, one deposit history, and buyer-counsel approval."
    },
    {
      id: "photos",
      category: "land",
      icon: "IMG",
      title: "Photos and videos",
      status: "plausible",
      summary: "They show plausible undeveloped land, but do not prove title or acreage.",
      claims: ["A substantial open parcel", "Residential surroundings", "Multiple angles appear consistent"],
      concerns: ["No independent GPS match", "No proof of boundaries or ownership", "No proof the visible land is one legal parcel", "No proof of legal access"],
      resolves: "A continuous GPS perimeter record matched to an independent licensed survey."
    },
    {
      id: "other-parcels",
      category: "land",
      icon: "2X",
      title: "One-acre and 1.5-acre parcels",
      status: "critical",
      summary: "The additional parcels do not have documentation equivalent to the four-acre file.",
      claims: ["Different named sellers", "Parcels said to adjoin", "Combined development vision"],
      concerns: ["No equivalent current title, search, chain, and survey package", "Rear access unresolved", "No independent combined survey"],
      resolves: "Separate full due diligence for each parcel and one independent combined survey."
    }
  ];

  const timeline = [
    { date: "2012", title: "Earlier ownership reference", text: "The indenture refers to a prior acquisition involving Nana Yaw Asante.", impact: "This may be part of a genuine chain, but the underlying instrument has not been independently authenticated." },
    { date: "12 Mar 2018", title: "Indenture / conveyance", text: "Kwame Mensah is shown transferring four acres to Frimpong Akwasi.", impact: "This could explain why the later search lists 2018, but the Lands Commission must confirm the sequence." },
    { date: "15 Mar 2021", title: "Title certificate", text: "The title certificate shows issue and registration in 2021.", impact: "The registration date conflicts with the 2018 date in the search report." },
    { date: "18 Mar 2021", title: "Survey approval stamp", text: "The supplied survey plan carries a 2021 approval stamp.", impact: "The same plan says fieldwork occurred in 2024, creating a chronology problem." },
    { date: "Mar 2024", title: "Claimed field survey", text: "The plan states that fieldwork was conducted in March 2024.", impact: "A 2024 survey cannot normally have been approved in 2021 without a clear re-survey explanation." },
    { date: "20 May 2024", title: "Search report issued", text: "The search reported no encumbrances and stated a three-month validity period.", impact: "It expired around August 2024 and says nothing reliable about the current 2026 position." },
    { date: "2025 / 2026", title: "Development letter", text: "The approval package contains a one-year date gap and an application reportedly made on a Sunday.", impact: "The authority, contact details, timing, and purpose require direct authentication." },
    { date: "24–29 Jun 2026", title: "Purchase agreement signatures", text: "The signatures appear dated before the agreement’s stated date.", impact: "This may reflect drafting or revision, but it must be corrected before relying on the contract." },
    { date: "29 Jul 2026", title: "Escrow agreement", text: "The escrow document references a purchase agreement dated in July, not June.", impact: "The payment route and governing contract remain unclear." },
    { date: "Aug–Sep 2026", title: "Large instalments scheduled", text: "The purchase agreement calls for two payments totaling US$399,000.", impact: "No instalment should move while the current title, legal authority, account, and contracts remain unverified." }
  ];

  const contradictions = [
    { title: "2024 legal authority presented for a 2026 transaction", impact: "A lawyer’s past status does not prove present authority to practise, advise, or control client funds.", resolve: "Direct 2026 confirmation from the regulator." },
    { title: "Seller-side counsel also controls the claimed escrow", impact: "One disputed party would influence both the sellers’ legal position and the buyer’s money route.", resolve: "Independent buyer’s counsel and bank-confirmed release controls." },
    { title: "Title registration shown as 2021 and 2018", impact: "The documents may describe different legal stages, or one may be wrong. Ownership history cannot be assumed.", resolve: "Fresh search and written Lands Commission explanation." },
    { title: "2024 survey with a 2021 approval stamp", impact: "The chronology is impossible without a documented re-survey or version history.", resolve: "Direct confirmation from the surveyor and Lands Commission." },
    { title: "Purchase contract and escrow use different payment routes", impact: "Sending money under conflicting instructions creates avoidable loss and dispute risk.", resolve: "One amended agreement approved by buyer’s counsel." },
    { title: "Purchase and escrow documents use different dates", impact: "It is unclear which contract version governs and whether the parties signed the same transaction.", resolve: "Complete version history and a single re-executed agreement." },
    { title: "The US$3,000 deposit story keeps changing", impact: "Funds said to be paid to sellers later became funds said to be held by the lawyer, without a full transfer trail.", resolve: "Three receipts, bank records, seller confirmations, and escrow ledger entries." },
    { title: "Only one parcel has a substantial document package", impact: "The four-acre file cannot validate the entire 6.5-acre development or the rear parcel’s access.", resolve: "Full separate due diligence and one combined independent survey." }
  ];

  const questions = [
    "Can the General Legal Council confirm that enrolment number 84374 belongs to the attorney and that he holds a valid 2026 practising licence?",
    "Can Stanbic confirm through official channels that the exact account is a genuine client account of the registered firm?",
    "Why does the title certificate show 2021 while the search report shows 2018, and what does the Lands Commission say the dates represent?",
    "Why does the survey say March 2024 while carrying a March 2021 approval stamp?",
    "Which plan number is correct, and can the Lands Commission authenticate the exact approved plan?",
    "Who paid, received, transferred, and currently owns each of the three US$1,000 deposits?",
    "Which payment instruction controls: payment to the seller or payment to the lawyer’s claimed escrow account?",
    "Who independently represents the buyer, and will that lawyer approve every release of funds?",
    "Do all three parcels actually adjoin, and does the rear parcel have permanent registered access?",
    "What does a fresh 2026 search show about caveats, liens, pending transfers, litigation, and current ownership?",
    "Which municipal authority has jurisdiction over the exact coordinates, and how many units can legally be built after roads, drainage, parking, setbacks, and utilities?"
  ];

  const strategies = {
    income: {
      eyebrow: "OPTION A // EXISTING INCOME PROPERTY",
      title: "Buy something that already exists.",
      body: "Investigate a completed multifamily property in the same broad acquisition range. Inspect the building, verify the title, review actual leases and bank deposits, confirm expenses, and negotiate based on the income that can be proven.",
      metrics: [["Primary advantage", "Earlier cash flow"], ["Main risk", "Hidden defects / weak yield"], ["Best tool", "Rent roll + inspection"], ["Decision style", "Measure before purchase"]],
      list: ["60–90 day conditional due-diligence period", "Fresh title search and independent valuation", "Structural, electrical, plumbing, drainage, and approval review", "Verified leases, collections, vacancy, taxes, utilities, and reserves", "Calculate the maximum price for a target return before negotiating"]
    },
    pilot: {
      eyebrow: "OPTION B // SMALLER PHASED DEVELOPMENT",
      title: "Prove two units before planning twenty.",
      body: "Acquire a smaller verified parcel or a few separately titled plots, obtain planning confirmation and a bill of quantities, build one or two units, then use the actual costs and market response to decide whether expansion is justified.",
      metrics: [["Primary advantage", "Controlled learning"], ["Main risk", "Construction execution"], ["Best tool", "Bill of quantities"], ["Decision style", "Stage-gated expansion"]],
      list: ["Clean title and planning confirmation before acquisition", "Independent architect, planner, surveyor, and quantity surveyor", "Hard cap on phase-one capital", "Milestone payments after independent inspections", "Expand only after real sale or rental evidence"]
    },
    preferred: {
      eyebrow: "OPTION C // PREFERRED OR SECURED CAPITAL",
      title: "Invest without owning every problem.",
      body: "Provide a defined amount to a verified project with priority repayment, collateral, inspection rights, and a fixed contribution cap instead of accepting equal responsibility for land, construction, financing, and every cost overrun.",
      metrics: [["Primary advantage", "Defined exposure"], ["Main risk", "Weak collateral / enforcement"], ["Best tool", "Independent valuation"], ["Decision style", "Downside first"]],
      list: ["Verified land and permits before funding", "Independent collateral valuation and loan-to-value limit", "Priority repayment and clear default rights", "No open-ended personal guarantees", "Funds released only after certified milestones"]
    }
  };

  let state = loadState();
  let currentQuestion = 0;
  let pipelineTimer = null;

  function loadState() {
    try {
      return Object.assign({ unlocks: [], checks: [], lastScene: "brief" }, JSON.parse(localStorage.getItem(STORAGE_KEY)) || {});
    } catch {
      return { unlocks: [], checks: [], lastScene: "brief" };
    }
  }

  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  }

  function escapeHtml(value = "") {
    const node = document.createElement("div");
    node.textContent = String(value);
    return node.innerHTML;
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
  }

  function showToast(message) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("show"), 2300);
  }

  function buildNavigator() {
    const nav = $("#navLinks");
    nav.innerHTML = $$(".scene").map((scene, index) => `<button type="button" data-nav="${escapeHtml(scene.id)}"><i>${String(index + 1).padStart(2, "0")}</i><span>${escapeHtml(scene.dataset.title || scene.id)}</span><small>↗</small></button>`).join("");
    $$('[data-nav]').forEach(button => button.addEventListener("click", () => {
      closeNavigator();
      jumpTo(button.dataset.nav);
    }));
  }

  function openNavigator() {
    $("#navigator").classList.add("open");
    $("#navScrim").classList.add("open");
  }
  function closeNavigator() {
    $("#navigator").classList.remove("open");
    $("#navScrim").classList.remove("open");
  }
  function jumpTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function renderEvidence(filter = "all") {
    const list = filter === "all" ? evidence : evidence.filter(item => item.category === filter);
    $("#evidenceGrid").innerHTML = list.map(item => `
      <article class="evidence-card reveal visible" tabindex="0" role="button" data-evidence="${escapeHtml(item.id)}">
        <span class="doc-status status-${escapeHtml(item.status)}">${escapeHtml(item.status)}</span>
        <div class="doc-icon">${escapeHtml(item.icon)}</div>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.summary)}</p>
      </article>`).join("");
    $("#documentCount").textContent = evidence.length;
    $$('[data-evidence]').forEach(card => {
      const open = () => openEvidence(card.dataset.evidence);
      card.addEventListener("click", open);
      card.addEventListener("keydown", event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); open(); } });
    });
  }

  function openEvidence(id) {
    const item = evidence.find(entry => entry.id === id);
    if (!item) return;
    $("#modalContent").innerHTML = `<div class="modal-body"><span class="modal-category">${escapeHtml(item.category.toUpperCase())} // ${escapeHtml(item.status.toUpperCase())}</span><h2>${escapeHtml(item.title)}</h2><p>${escapeHtml(item.summary)}</p><h3>What the document or evidence claims</h3><ul>${item.claims.map(value => `<li>${escapeHtml(value)}</li>`).join("")}</ul><h3>Why it remains unresolved</h3><ul>${item.concerns.map(value => `<li>${escapeHtml(value)}</li>`).join("")}</ul><h3>What would resolve it</h3><p>${escapeHtml(item.resolves)}</p></div>`;
    $("#detailModal").showModal();
  }

  function renderTimeline() {
    $("#timelineTrack").innerHTML = timeline.map((item, index) => `<button type="button" class="timeline-event ${index === 0 ? "active" : ""}" data-timeline="${index}"><strong>${escapeHtml(item.date)}</strong><span>${escapeHtml(item.title)}</span></button>`).join("");
    $$('[data-timeline]').forEach(button => button.addEventListener("click", () => selectTimeline(Number(button.dataset.timeline))));
    selectTimeline(0);
  }

  function selectTimeline(index) {
    const item = timeline[index];
    if (!item) return;
    $$('[data-timeline]').forEach((button, buttonIndex) => button.classList.toggle("active", buttonIndex === index));
    $("#timelineDetail").innerHTML = `<span class="timeline-date">${escapeHtml(item.date)}</span><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.text)}</p><div class="timeline-impact"><strong>Why it matters:</strong> ${escapeHtml(item.impact)}</div>`;
  }

  function renderContradictions() {
    $("#contradictionGrid").innerHTML = contradictions.map((item, index) => `<article class="conflict-card"><button type="button" aria-expanded="false"><i>${String(index + 1).padStart(2, "0")}</i><strong>${escapeHtml(item.title)}</strong><span>+</span></button><div class="conflict-body"><div><p>${escapeHtml(item.impact)}</p><p><strong>Resolution:</strong> ${escapeHtml(item.resolve)}</p></div></div></article>`).join("");
    $$(".conflict-card button").forEach(button => button.addEventListener("click", () => {
      const card = button.closest(".conflict-card");
      card.classList.toggle("open");
      button.setAttribute("aria-expanded", String(card.classList.contains("open")));
      $("span", button).textContent = card.classList.contains("open") ? "−" : "+";
    }));
  }

  function renderStrategy(key = "income") {
    const item = strategies[key];
    $("#strategyStage").innerHTML = `<article class="strategy-card"><div><p class="kicker">${escapeHtml(item.eyebrow)}</p><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.body)}</p><ul class="strategy-list">${item.list.map(value => `<li>${escapeHtml(value)}</li>`).join("")}</ul></div><div class="strategy-metrics">${item.metrics.map(metric => `<div><span>${escapeHtml(metric[0])}</span><strong>${escapeHtml(metric[1])}</strong></div>`).join("")}</div></article>`;
  }

  function updateCalculator() {
    const units = Number($("#unitsInput").value);
    const rent = Number($("#rentInput").value);
    const occupancy = Number($("#occupancyInput").value) / 100;
    const opex = Number($("#opexInput").value) / 100;
    const gross = units * rent * 12;
    const noi = gross * occupancy * (1 - opex);
    $("#unitsOutput").textContent = units;
    $("#rentOutput").textContent = formatCurrency(rent);
    $("#occupancyOutput").textContent = `${Math.round(occupancy * 100)}%`;
    $("#opexOutput").textContent = `${Math.round(opex * 100)}%`;
    $("#grossRent").textContent = formatCurrency(gross);
    $("#noiValue").textContent = formatCurrency(noi);
  }

  function applyUnlocks() {
    $$('[data-lock]').forEach(scene => scene.classList.toggle("unlocked", state.unlocks.includes(scene.dataset.lock)));
  }

  function setupPhraseForms() {
    $$(".phrase-form").forEach(form => {
      form.addEventListener("submit", event => {
        event.preventDefault();
        const input = $("input", form);
        const message = $(".form-message", form);
        const expected = form.dataset.phrase || "";
        const submitted = input.value.trim().replace(/\s+/g, " ").toUpperCase();
        if (submitted !== expected) {
          message.className = "form-message error";
          message.textContent = "Phrase does not match. Slow down and enter it exactly.";
          return;
        }
        const unlock = form.dataset.unlock;
        if (!state.unlocks.includes(unlock)) state.unlocks.push(unlock);
        saveState();
        applyUnlocks();
        message.className = "form-message success";
        message.textContent = "Checkpoint accepted. The next section is unlocked.";
        showToast("Section unlocked");
        setTimeout(() => jumpTo(unlock), 650);
      });
    });
  }

  function updateChecks() {
    $$("[data-check]").forEach(card => {
      const checked = state.checks.includes(card.dataset.check);
      card.classList.toggle("checked", checked);
      $(".check-button", card).textContent = checked ? "Understood ✓" : "Mark understood";
    });
    const count = state.checks.length;
    $("#checkCount").textContent = `${count} / 3`;
    $("#readinessFill").style.width = `${(count / 3) * 100}%`;
    $("#readinessMessage").textContent = count === 3 ? "You understand the three decisive checks. They still must be completed by real institutions and professionals." : "No deal is ready until all three checks are completed in the real world.";
  }

  function setupChecks() {
    $$("[data-check]").forEach(card => $(".check-button", card).addEventListener("click", () => {
      const key = card.dataset.check;
      state.checks = state.checks.includes(key) ? state.checks.filter(item => item !== key) : [...state.checks, key];
      saveState();
      updateChecks();
    }));
  }

  function renderQuestion() {
    $("#questionDisplay").textContent = questions[currentQuestion];
  }

  function runPipeline() {
    clearInterval(pipelineTimer);
    const steps = $$("#pipelineSteps > div");
    steps.forEach(step => step.classList.remove("active"));
    let index = 0;
    steps[index].classList.add("active");
    pipelineTimer = setInterval(() => {
      index += 1;
      if (index >= steps.length) {
        clearInterval(pipelineTimer);
        showToast("Demonstration complete");
        return;
      }
      steps[index].classList.add("active");
    }, 520);
  }

  function copyText(text, successMessage) {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(() => showToast(successMessage)).catch(() => showToast("Copy failed"));
      return;
    }
    const area = document.createElement("textarea");
    area.value = text;
    document.body.appendChild(area);
    area.select();
    document.execCommand("copy");
    area.remove();
    showToast(successMessage);
  }

  function setupNotes() {
    try { $("#eliNotes").value = localStorage.getItem(NOTES_KEY) || ""; } catch {}
    $("#saveNotes").addEventListener("click", () => {
      try {
        localStorage.setItem(NOTES_KEY, $("#eliNotes").value);
        $("#notesStatus").textContent = `Saved ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
        showToast("Notes saved in this browser");
      } catch {
        $("#notesStatus").textContent = "Save unavailable";
      }
    });
  }

  function observeScenes() {
    const scenes = $$(".scene");
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) $$(".reveal", entry.target).forEach((node, index) => setTimeout(() => node.classList.add("visible"), index * 60));
      });
    }, { threshold: .12 });
    scenes.forEach(scene => revealObserver.observe(scene));

    const sceneObserver = new IntersectionObserver(entries => {
      const active = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!active) return;
      state.lastScene = active.target.id;
      saveState();
      const index = scenes.indexOf(active.target);
      const progress = Math.round(((index + 1) / scenes.length) * 100);
      $("#progressLabel").textContent = `${progress}% reviewed`;
      $("#progressFill").style.width = `${progress}%`;
      $$('[data-nav]').forEach(button => button.classList.toggle("active", button.dataset.nav === active.target.id));
    }, { threshold: [.35, .55, .75] });
    scenes.forEach(scene => sceneObserver.observe(scene));
  }

  function setupEvents() {
    $("#openNavigator").addEventListener("click", openNavigator);
    $("#closeNavigator").addEventListener("click", closeNavigator);
    $("#navScrim").addEventListener("click", closeNavigator);
    $$('[data-jump]').forEach(button => button.addEventListener("click", () => jumpTo(button.dataset.jump)));
    $("#resumeButton").addEventListener("click", () => jumpTo(state.lastScene || "brief"));
    $("#closeModal").addEventListener("click", () => $("#detailModal").close());
    $("#detailModal").addEventListener("click", event => { if (event.target === $("#detailModal")) $("#detailModal").close(); });
    $$(".filter-button").forEach(button => button.addEventListener("click", () => {
      $$(".filter-button").forEach(item => item.classList.remove("active"));
      button.classList.add("active");
      renderEvidence(button.dataset.filter);
    }));
    ["#unitsInput", "#rentInput", "#occupancyInput", "#opexInput"].forEach(selector => $(selector).addEventListener("input", updateCalculator));
    $$(".strategy-tab").forEach(button => button.addEventListener("click", () => {
      $$(".strategy-tab").forEach(item => item.classList.remove("active"));
      button.classList.add("active");
      renderStrategy(button.dataset.strategy);
    }));
    $("#shuffleQuestion").addEventListener("click", () => { currentQuestion = (currentQuestion + 1) % questions.length; renderQuestion(); });
    $("#copyQuestion").addEventListener("click", () => copyText(questions[currentQuestion], "Question copied"));
    $("#runPipeline").addEventListener("click", runPipeline);
    $("#copyDecision").addEventListener("click", () => copyText("Pause all payments. Retain unrelated buyer’s counsel. Order a fresh official Lands Commission search. Verify the attorney, chamber, and bank account directly. Reconcile the contracts and deposit trail. Proceed only if every material fact is independently confirmed outside the transaction.", "Recommendation copied"));
    $("#resetExperience").addEventListener("click", () => {
      state = { unlocks: [], checks: [], lastScene: "brief" };
      saveState();
      applyUnlocks();
      updateChecks();
      showToast("Review progress reset");
      jumpTo("brief");
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") { closeNavigator(); if ($("#detailModal").open) $("#detailModal").close(); }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); openNavigator(); }
    });
  }

  function init() {
    buildNavigator();
    renderEvidence();
    renderTimeline();
    renderContradictions();
    renderStrategy();
    renderQuestion();
    updateCalculator();
    applyUnlocks();
    setupPhraseForms();
    setupChecks();
    updateChecks();
    setupNotes();
    setupEvents();
    observeScenes();
    setTimeout(() => $$("#brief .reveal").forEach(node => node.classList.add("visible")), 80);
  }

  document.addEventListener("DOMContentLoaded", init, { once: true });
})();
