(() => {
  "use strict";

  const STORE_KEY = "cmx-lab-automations-v1";
  const PROGRESS_KEY = "cmx-lab-automation-progress-v1";
  const BLANK_PROGRESS = Object.freeze({ trigger:false, rules:false, actions:false, timing:false, finish:false });

  let active = { mode:"existing", id:null, baseline:[], progress:{ ...BLANK_PROGRESS } };
  let queued = false;

  function readStore() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY) || "null"); } catch { return null; }
  }

  function readProgressMap() {
    try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}") || {}; } catch { return {}; }
  }

  function saveProgressMap() {
    if (!active.id || active.mode === "existing") return;
    const map = readProgressMap();
    map[active.id] = { ...active.progress };
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(map));
  }

  function storeIds() {
    const store = readStore();
    return Array.isArray(store?.automations) ? store.automations.map(item => item.id).filter(Boolean) : [];
  }

  function beginNew() {
    active = { mode:"new", id:null, baseline:storeIds(), progress:{ ...BLANK_PROGRESS } };
    queuePatch();
  }

  function openExisting(id) {
    const saved = readProgressMap()[id];
    if (saved) {
      active = { mode:"tracked", id, baseline:[], progress:{ ...BLANK_PROGRESS, ...saved } };
    } else {
      active = { mode:"existing", id, baseline:[], progress:{ trigger:true, rules:true, actions:true, timing:true, finish:true } };
    }
    queuePatch();
  }

  function openTemplate() {
    active = { mode:"existing", id:null, baseline:storeIds(), progress:{ trigger:true, rules:true, actions:true, timing:true, finish:true } };
    queuePatch();
  }

  function adoptNewId() {
    if (active.mode !== "new" || active.id) return;
    const store = readStore();
    if (!Array.isArray(store?.automations)) return;
    const candidate = store.automations
      .filter(item => item?.id && !active.baseline.includes(item.id))
      .sort((a,b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0))[0];
    if (!candidate) return;
    active.id = candidate.id;
    active.mode = "tracked";
    saveProgressMap();
  }

  function mark(key) {
    if (active.mode === "existing" || !(key in active.progress)) return;
    active.progress[key] = true;
    saveProgressMap();
    setTimeout(() => { adoptNewId(); saveProgressMap(); }, 560);
    queuePatch();
  }

  function currentStage() {
    const buttons = [...document.querySelectorAll(".v3-stage-rail [data-stage]")];
    return Math.max(0, buttons.findIndex(button => button.classList.contains("is-current")));
  }

  function maxAllowedStage() {
    const p = active.progress;
    if (!p.trigger) return 0;
    if (!p.rules) return 1;
    if (!p.actions) return 2;
    if (!p.timing) return 3;
    return 4;
  }

  function flashRequired(message) {
    const section = document.querySelector(".v3-stage-section");
    if (!section) return;
    section.querySelector(".v3-progress-hint")?.remove();
    const note = document.createElement("div");
    note.className = "v3-progress-hint";
    note.innerHTML = `<strong>Finish this step first.</strong> ${message}`;
    section.append(note);
    note.scrollIntoView({ block:"nearest", behavior:"smooth" });
  }

  function flowNode(flow, prefix) {
    return [...flow.querySelectorAll(".v3-flow-node")].find(node => node.querySelector(":scope > span")?.textContent.trim().startsWith(prefix));
  }

  function makePending(node, title, detail) {
    if (!node) return;
    node.classList.add("is-pending");
    const strong = node.querySelector("strong");
    const small = node.querySelector("small");
    if (strong) strong.textContent = title;
    if (small) small.textContent = detail;
  }

  function clearPending(node) {
    node?.classList.remove("is-pending");
  }

  function patchFlow(flow) {
    const p = active.progress;
    const when = flowNode(flow,"WHEN");
    const rule = flowNode(flow,"IF");
    const waits = flowNode(flow,"WAIT");
    const finish = flowNode(flow,"FINISH");
    const actionNodes = [...flow.querySelectorAll(".v3-flow-node")].filter(node => node.querySelector(":scope > span")?.textContent.trim().startsWith("DO"));

    if (!p.trigger) makePending(when,"Choose a trigger","Nothing selected yet"); else clearPending(when);
    if (!p.rules) makePending(rule,"Not set yet","Optional rule step"); else clearPending(rule);
    if (!p.actions) {
      actionNodes.forEach((node,index) => makePending(node,index === 0 ? "Choose an action" : "Not set yet",index === 0 ? "Nothing selected yet" : "Action step"));
    } else actionNodes.forEach(clearPending);
    if (!p.timing) makePending(waits,"Not set yet","Confirm when actions may start"); else clearPending(waits);
    if (!p.finish) makePending(finish,"Not set yet","Choose what happens at the end"); else clearPending(finish);
  }

  function readableProgress() {
    const p = active.progress;
    const flow = document.querySelector(".v3-live-panel .v3-flow") || document.querySelector(".v3-mobile-flow .v3-flow");
    const text = prefix => flowNode(flow,prefix)?.querySelector("strong")?.textContent.trim() || "Not set yet";
    return [
      p.trigger ? text("WHEN") : "Choose a trigger",
      p.rules ? text("IF") : "Rule not set",
      p.actions ? text("DO") : "Action not set",
      p.timing ? text("WAIT") : "Timing not set",
      p.finish ? text("FINISH") : "Finish not set"
    ].join(" → ");
  }

  function patchSelections() {
    const p = active.progress;
    if (!p.trigger) {
      document.querySelectorAll("[data-trigger]").forEach(button => {
        button.classList.remove("is-selected");
        button.classList.add("is-progress-pending");
        const check = button.querySelector("i"); if (check) check.textContent = "";
      });
    }

    const stack = document.querySelector(".v3-action-stack");
    const add = document.querySelector(".v3-add-action");
    if (stack && add && !p.actions) {
      stack.classList.add("is-progress-placeholder");
      if (!document.querySelector(".v3-progress-empty")) {
        const empty = document.createElement("div");
        empty.className = "v3-progress-empty";
        empty.innerHTML = `<b>＋</b><span><strong>No action selected yet</strong><small>Use Add action to choose the first step. The preview will fill it in after you choose.</small></span>`;
        add.before(empty);
      }
    }

    if (!p.timing) {
      document.querySelectorAll("[data-timing-mode]").forEach(button => {
        button.classList.remove("is-selected");
        button.classList.add("is-progress-pending");
        const check = button.querySelector("i"); if (check) check.textContent = "";
      });
    }

    if (!p.finish) {
      document.querySelectorAll("[data-outcome]").forEach(button => {
        button.classList.remove("is-selected");
        button.classList.add("is-progress-pending");
      });
    }
  }

  function patchNavigation() {
    const stage = currentStage();
    const max = maxAllowedStage();
    document.querySelectorAll(".v3-stage-rail [data-stage]").forEach(button => {
      const target = Number(button.dataset.stage);
      button.disabled = Number.isFinite(target) && target > max;
    });

    const next = document.querySelector("[data-next]");
    if (next) {
      const blocked = (stage === 0 && !active.progress.trigger)
        || (stage === 2 && !active.progress.actions)
        || (stage === 4 && !active.progress.finish);
      next.disabled = blocked;
      if (blocked) next.dataset.progressDisabled = "true"; else delete next.dataset.progressDisabled;
    }

    const simulate = document.querySelector("[data-simulate]");
    if (simulate && (!active.progress.trigger || !active.progress.actions || !active.progress.finish)) {
      simulate.disabled = true;
      simulate.dataset.progressDisabled = "true";
    }
  }

  function patchLabels() {
    document.querySelectorAll(".v3-live-head span,.v3-mobile-flow-toggle small").forEach(node => { node.textContent = "FLOW PREVIEW"; });
    const hint = document.querySelector(".v3-live-head small"); if (hint) hint.textContent = "Builds as you choose";

    document.querySelectorAll(".v3-flow").forEach(patchFlow);
    const readable = readableProgress();
    const mobile = document.querySelector(".v3-mobile-flow-toggle strong"); if (mobile) mobile.textContent = readable;
    const summary = document.querySelector(".v3-live-summary p"); if (summary) summary.textContent = readable;

    if (!active.progress.actions) {
      const title = document.querySelector(".v3-title-button > strong");
      if (title) title.textContent = active.progress.trigger ? "Choose the first action" : "New automation";
    }
  }

  function patch() {
    queued = false;
    if (!document.querySelector(".v3-editor-page")) return;
    if (active.mode === "existing") {
      document.querySelectorAll(".v3-live-head span,.v3-mobile-flow-toggle small").forEach(node => { node.textContent = "FLOW PREVIEW"; });
      const hint = document.querySelector(".v3-live-head small"); if (hint) hint.textContent = "Current saved draft";
      return;
    }
    document.querySelector(".v3-editor-page")?.setAttribute("data-progressive-preview","true");
    patchSelections();
    patchLabels();
    patchNavigation();
  }

  function queuePatch() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(patch)));
  }

  document.addEventListener("click", event => {
    const target = event.target.closest("button,a");
    if (!target) return;

    if (target.matches("[data-new]")) beginNew();
    else if (target.matches("[data-open]")) openExisting(target.dataset.open);
    else if (target.matches("[data-template]")) openTemplate();

    if (active.mode !== "existing") {
      if (target.matches("[data-trigger]")) mark("trigger");
      if (target.matches("[data-add-rule],[data-remove-rule],[data-rule-mode]")) mark("rules");
      if (target.matches("[data-choose-inline],[data-choose-saved]")) mark("actions");
      if (target.matches("[data-timing-mode],[data-delay-preset],[data-repeat-mode]")) mark("timing");
      if (target.matches("[data-outcome]")) mark("finish");

      if (target.matches("[data-stage]")) {
        const requested = Number(target.dataset.stage);
        if (Number.isFinite(requested) && requested > maxAllowedStage()) {
          event.preventDefault();
          event.stopImmediatePropagation();
          flashRequired("Complete the current choices before jumping ahead.");
          queuePatch();
          return;
        }
      }

      if (target.matches("[data-next]")) {
        const stage = currentStage();
        if (stage === 0 && !active.progress.trigger) {
          event.preventDefault(); event.stopImmediatePropagation(); flashRequired("Choose what starts the Automation."); queuePatch(); return;
        }
        if (stage === 1) mark("rules");
        if (stage === 2 && !active.progress.actions) {
          event.preventDefault(); event.stopImmediatePropagation(); flashRequired("Add at least one action."); queuePatch(); return;
        }
        if (stage === 3) mark("timing");
        if (stage === 4 && !active.progress.finish) {
          event.preventDefault(); event.stopImmediatePropagation(); flashRequired("Choose the finish behavior before closing the draft."); queuePatch(); return;
        }
      }

      if (target.matches("[data-save],[data-close]")) {
        setTimeout(() => { adoptNewId(); saveProgressMap(); }, 80);
      }
    }

    queuePatch();
  }, true);

  document.addEventListener("input", event => {
    if (active.mode === "existing") return;
    if (event.target.matches("[data-delay-field],[data-exact-date],[data-exact-time],[data-repeat-every]")) mark("timing");
    queuePatch();
  }, true);

  document.addEventListener("change", event => {
    if (active.mode === "existing") return;
    if (event.target.matches("[data-exact-zone],[data-repeat-unit],[data-repeat-zone]")) mark("timing");
    queuePatch();
  }, true);

  window.addEventListener("pageshow", queuePatch);
  window.addEventListener("storage", event => { if ([STORE_KEY,PROGRESS_KEY].includes(event.key)) queuePatch(); });

  queuePatch();
})();
