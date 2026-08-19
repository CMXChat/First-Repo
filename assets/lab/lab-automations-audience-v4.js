(() => {
  "use strict";

  const AUTOMATIONS_KEY = "cmx-lab-automations-v1";
  const CRM_KEY = "cmx-lab-crm-v1";
  const COMMUNICATION_TYPES = new Set(["notify", "email"]);
  let modal = null;
  let queued = false;

  const esc = value => String(value ?? "").replace(/[&<>'"]/g, ch => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  }[ch]));
  const uniq = values => [...new Set((values || []).filter(Boolean))];

  function readAutomations() {
    try {
      const store = JSON.parse(localStorage.getItem(AUTOMATIONS_KEY) || "null");
      return store && Array.isArray(store.automations) ? store : { version: 1, automations: [] };
    } catch {
      return { version: 1, automations: [] };
    }
  }

  function readDirectory() {
    try {
      const store = JSON.parse(localStorage.getItem(CRM_KEY) || "null");
      return store && Array.isArray(store.people) && Array.isArray(store.organizations)
        ? { ...store, groups: Array.isArray(store.groups) ? store.groups : [] }
        : { people: [], organizations: [], groups: [] };
    } catch {
      return { people: [], organizations: [], groups: [] };
    }
  }

  function actionLocation(actionId) {
    const store = readAutomations();
    for (const automation of store.automations) {
      const index = (automation.actions || []).findIndex(action => action.id === actionId);
      if (index >= 0) return { store, automation, action: automation.actions[index], index };
    }
    return null;
  }

  function labels(directory) {
    return uniq(directory.people.flatMap(person => [...(person.labels || []), ...(person.tags || [])].map(value => String(value).trim().toLowerCase()))).sort();
  }

  function methods(person) {
    const values = Array.isArray(person.contactMethods) ? person.contactMethods.filter(item => item?.active !== false && item?.value) : [];
    if (!values.length) {
      if (person.email) values.push({ type: "email", value: person.email });
      if (person.phone) values.push({ type: "phone", value: person.phone });
    }
    return values;
  }

  function ready(person, type) {
    return methods(person).some(item => item.type === type && item.value);
  }

  function peopleForOrganization(directory, orgId) {
    return directory.people.filter(person => (person.organizationIds || []).includes(orgId) || person.orgId === orgId);
  }

  function peopleForLabel(directory, label) {
    const key = String(label || "").toLowerCase();
    return directory.people.filter(person => [...(person.labels || []), ...(person.tags || [])].map(value => String(value).toLowerCase()).includes(key));
  }

  function resolveGroup(directory, group) {
    const ids = new Set();
    (group?.selectors || []).forEach(selector => {
      if (selector.type === "person" && directory.people.some(person => person.id === selector.ref)) ids.add(selector.ref);
      if (selector.type === "organization") peopleForOrganization(directory, selector.ref).forEach(person => ids.add(person.id));
      if (selector.type === "label") peopleForLabel(directory, selector.ref).forEach(person => ids.add(person.id));
    });
    return [...ids].map(id => directory.people.find(person => person.id === id)).filter(Boolean);
  }

  function resolveSelectors(directory, selectors) {
    const ids = new Set();
    (selectors || []).forEach(selector => {
      if (selector.type === "person" && directory.people.some(person => person.id === selector.ref)) ids.add(selector.ref);
      if (selector.type === "organization") peopleForOrganization(directory, selector.ref).forEach(person => ids.add(person.id));
      if (selector.type === "label") peopleForLabel(directory, selector.ref).forEach(person => ids.add(person.id));
      if (selector.type === "group") resolveGroup(directory, directory.groups.find(group => group.id === selector.ref)).forEach(person => ids.add(person.id));
    });
    return [...ids].map(id => directory.people.find(person => person.id === id)).filter(Boolean);
  }

  function selectorsFor(action) {
    if (Array.isArray(action?.audienceSelectors) && action.audienceSelectors.length) return action.audienceSelectors;
    if (action?.targetRef?.kind && action?.targetRef?.id && ["person", "organization"].includes(action.targetRef.kind)) {
      return [{ type: action.targetRef.kind, ref: action.targetRef.id }];
    }
    return [];
  }

  function selectorLabel(directory, selector) {
    if (selector.type === "person") return directory.people.find(item => item.id === selector.ref)?.name || selector.ref;
    if (selector.type === "organization") return directory.organizations.find(item => item.id === selector.ref)?.name || selector.ref;
    if (selector.type === "group") return directory.groups.find(item => item.id === selector.ref)?.name || selector.ref;
    return selector.ref;
  }

  function audienceSummary(directory, selectors) {
    if (!selectors.length) return "Choose audience";
    if (selectors.length === 1) return selectorLabel(directory, selectors[0]);
    const people = resolveSelectors(directory, selectors);
    return `${selectors.length} selectors · ${people.length} people`;
  }

  function readinessSummary(directory, selectors, actionType) {
    const people = resolveSelectors(directory, selectors);
    const email = people.filter(person => ready(person, "email")).length;
    const phone = people.filter(person => ready(person, "phone")).length;
    const required = actionType === "email" ? email : people.length;
    return { people, email, phone, required };
  }

  function patchActionCard(card, directory) {
    const actionId = card.dataset.actionCard;
    const found = actionLocation(actionId);
    if (!found || !COMMUNICATION_TYPES.has(found.action.type)) return;

    const button = card.querySelector(`[data-pick-target="${CSS.escape(actionId)}"]`);
    if (!button) return;
    const selectors = selectorsFor(found.action);
    const readiness = readinessSummary(directory, selectors, found.action.type);
    const label = button.querySelector(":scope > span");
    const strong = button.querySelector(":scope > strong");
    const change = button.querySelector(":scope > b");
    if (label) label.textContent = "AUDIENCE";
    if (strong) strong.textContent = audienceSummary(directory, selectors);
    if (change) change.textContent = selectors.length ? "Manage" : "Choose";
    button.dataset.v4Audience = "true";

    let meta = card.querySelector(".v4-audience-readiness");
    if (!meta) {
      meta = document.createElement("div");
      meta.className = "v4-audience-readiness";
      button.after(meta);
    }
    if (!selectors.length) {
      meta.innerHTML = `<span>NO AUDIENCE YET</span><small>Select People, Organizations, Groups or Labels.</small>`;
    } else {
      meta.innerHTML = `<span>${readiness.people.length} PEOPLE RESOLVED</span><small>${readiness.email} email-ready · ${readiness.phone} phone-ready · duplicates removed</small>`;
    }
  }

  function patchReview(directory) {
    const review = document.querySelector(".v3-review-side");
    if (!review) return;
    const cards = [...document.querySelectorAll("[data-action-card]")];
    const communication = cards.map(card => actionLocation(card.dataset.actionCard)).filter(found => found && COMMUNICATION_TYPES.has(found.action.type));
    if (!communication.length) return;

    let block = review.querySelector(".v4-audience-preflight");
    if (!block) {
      block = document.createElement("section");
      block.className = "v4-audience-preflight";
      const directoryCard = review.querySelector(".v4-directory-preflight");
      (directoryCard || review.firstElementChild)?.after(block);
    }
    const rows = communication.map(found => {
      const selectors = selectorsFor(found.action);
      const readyState = readinessSummary(directory, selectors, found.action.type);
      const label = found.action.type === "email" ? "Email" : "Notify";
      const state = !selectors.length ? "NEEDS AUDIENCE" : found.action.type === "email" && readyState.email === 0 ? "NO EMAIL-READY PEOPLE" : `${readyState.people.length} PEOPLE`;
      return `<div><span><strong>${label}</strong><small>${esc(audienceSummary(directory, selectors))}</small></span><b class="${!selectors.length || found.action.type === "email" && readyState.email === 0 ? "warn" : "good"}">${state}</b></div>`;
    }).join("");
    block.innerHTML = `<span>AUDIENCE PREFLIGHT</span>${rows}`;
  }

  function patch() {
    queued = false;
    const directory = readDirectory();
    document.querySelectorAll("[data-action-card]").forEach(card => patchActionCard(card, directory));
    patchReview(directory);
    document.documentElement.dataset.labAutomationsAudience = "v4-1";
  }

  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => requestAnimationFrame(patch));
  }

  function interceptTargetPicker(event) {
    const button = event.target.closest?.("[data-pick-target]");
    if (!button) return;
    const actionId = button.dataset.pickTarget;
    const found = actionLocation(actionId);
    if (!found || !COMMUNICATION_TYPES.has(found.action.type)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    openAudience(actionId);
  }

  function openAudience(actionId) {
    closeAudience();
    const found = actionLocation(actionId);
    if (!found) return;
    const directory = readDirectory();
    const selected = new Set(selectorsFor(found.action).map(selector => `${selector.type}:${selector.ref}`));

    modal = document.createElement("div");
    modal.className = "v4-audience-modal-backdrop";
    modal.innerHTML = `
      <section class="v4-audience-modal" role="dialog" aria-modal="true" aria-labelledby="v4AudienceTitle">
        <header>
          <div><span>AUDIENCE</span><h2 id="v4AudienceTitle">Who should this reach?</h2><p>Select one or more protected Directory references. Lab resolves the current unique People before showing readiness.</p></div>
          <button type="button" data-v4-audience-close aria-label="Close">×</button>
        </header>
        <div class="v4-audience-modal-body">
          <aside class="v4-audience-picker-list">
            ${pickerSection("People", "person", directory.people, selected, item => item.name, item => [item.role, ready(item,"email") ? "email" : "", ready(item,"phone") ? "phone" : ""].filter(Boolean).join(" · "))}
            ${pickerSection("Organizations", "organization", directory.organizations, selected, item => item.name, item => `${peopleForOrganization(directory,item.id).length} current people`)}
            ${pickerSection("Groups", "group", directory.groups, selected, item => item.name, item => `${resolveGroup(directory,item).length} people resolved`)}
            ${pickerSection("Labels", "label", labels(directory).map(label => ({ id: label, name: label })), selected, item => item.name, item => `${peopleForLabel(directory,item.id).length} matching people`)}
          </aside>
          <aside class="v4-audience-preview-panel">
            <span>LIVE LAB PREVIEW</span>
            <div data-v4-audience-preview></div>
          </aside>
        </div>
        <footer><button type="button" data-v4-audience-close>Cancel</button><button type="button" class="primary" data-v4-audience-save>Use audience</button></footer>
      </section>`;
    document.body.append(modal);

    modal.querySelectorAll("[data-v4-audience-close]").forEach(button => button.addEventListener("click", closeAudience));
    modal.addEventListener("click", event => {
      if (event.target === modal) closeAudience();
    });
    modal.querySelectorAll("[data-v4-selector]").forEach(input => input.addEventListener("change", () => renderModalPreview(found.action.type)));
    modal.querySelector("[data-v4-audience-save]")?.addEventListener("click", () => saveAudience(actionId));
    renderModalPreview(found.action.type);
    document.body.classList.add("v4-audience-open");
  }

  function pickerSection(title, type, items, selected, labelFn, noteFn) {
    return `<section><h3>${title}<b>${items.length}</b></h3><div>${items.map(item => {
      const key = `${type}:${item.id}`;
      return `<label><input type="checkbox" data-v4-selector data-selector-type="${type}" value="${esc(item.id)}" ${selected.has(key) ? "checked" : ""}><span><strong>${esc(labelFn(item))}</strong><small>${esc(noteFn(item))}</small></span><i>✓</i></label>`;
    }).join("") || `<p>No ${title.toLowerCase()} available.</p>`}</div></section>`;
  }

  function modalSelectors() {
    return [...modal.querySelectorAll("[data-v4-selector]:checked")].map(input => ({ type: input.dataset.selectorType, ref: input.value }));
  }

  function renderModalPreview(actionType) {
    if (!modal) return;
    const directory = readDirectory();
    const selectors = modalSelectors();
    const readiness = readinessSummary(directory, selectors, actionType);
    const preview = modal.querySelector("[data-v4-audience-preview]");
    const people = readiness.people;
    preview.innerHTML = `
      <div class="v4-audience-preview-metrics">
        <div><strong>${people.length}</strong><span>Unique people</span></div>
        <div><strong>${readiness.email}</strong><span>Email ready</span></div>
        <div><strong>${readiness.phone}</strong><span>Phone ready</span></div>
      </div>
      <div class="v4-audience-resolved">
        ${people.length ? people.slice(0, 10).map(person => `<div><b>${esc(person.name)}</b><span>${ready(person,"email") ? "Email" : "No email"} · ${ready(person,"phone") ? "Phone" : "No phone"}</span></div>`).join("") : `<p>Select Directory references to preview the resolved People.</p>`}
        ${people.length > 10 ? `<small>+ ${people.length - 10} more people</small>` : ""}
      </div>
      <p>${selectors.length} selector${selectors.length === 1 ? "" : "s"}. Overlapping People are counted once.</p>`;
  }

  function compatibilityTarget(directory, selectors) {
    if (selectors.length === 1 && ["person", "organization"].includes(selectors[0].type)) {
      return {
        ref: { kind: selectors[0].type, id: selectors[0].ref },
        label: selectorLabel(directory, selectors[0])
      };
    }
    if (!selectors.length) return { ref: null, label: "" };
    const people = resolveSelectors(directory, selectors);
    return { ref: null, label: `Audience · ${selectors.length} selectors · ${people.length} people` };
  }

  function saveAudience(actionId) {
    const selectors = modalSelectors();
    const directory = readDirectory();
    const saveButton = document.querySelector("[data-save]");
    saveButton?.click();

    const found = actionLocation(actionId);
    if (!found) return closeAudience();
    const compatibility = compatibilityTarget(directory, selectors);
    found.action.audienceSelectors = selectors;
    found.action.audienceResolution = { mode: "live_membership", dedupe: "person_id" };
    found.action.targetRef = compatibility.ref;
    found.action.targetLabel = compatibility.label;
    found.automation.updatedAt = new Date().toISOString();
    localStorage.setItem(AUTOMATIONS_KEY, JSON.stringify(found.store));

    closeAudience();
    const url = new URL(location.href);
    url.search = "";
    url.searchParams.set("automation", found.automation.id);
    url.searchParams.set("from", "audience");
    location.assign(`${url.pathname}?${url.searchParams.toString()}${url.hash}`);
  }

  function closeAudience() {
    modal?.remove();
    modal = null;
    document.body.classList.remove("v4-audience-open");
  }

  document.addEventListener("click", interceptTargetPicker, true);
  document.addEventListener("click", schedule, false);
  document.addEventListener("input", schedule, false);
  document.addEventListener("change", schedule, false);
  window.addEventListener("pageshow", schedule);
  window.addEventListener("storage", event => {
    if ([AUTOMATIONS_KEY, CRM_KEY].includes(event.key)) schedule();
  });
  window.addEventListener("cmx:lab-directory-updated", schedule);

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", schedule, { once: true });
  else schedule();
})();