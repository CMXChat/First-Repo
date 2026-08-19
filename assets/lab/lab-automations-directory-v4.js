(() => {
  "use strict";

  const CRM_KEY = "cmx-lab-crm-v1";
  let queued = false;

  const esc = value => String(value ?? "").replace(/[&<>'"]/g, ch => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  }[ch]));

  function readDirectory() {
    try {
      const value = JSON.parse(localStorage.getItem(CRM_KEY) || "null");
      return value && Array.isArray(value.people) && Array.isArray(value.organizations)
        ? { ...value, groups: Array.isArray(value.groups) ? value.groups : [] }
        : { people: [], organizations: [], groups: [] };
    } catch {
      return { people: [], organizations: [], groups: [] };
    }
  }

  function methods(person) {
    const out = Array.isArray(person.contactMethods) ? person.contactMethods.filter(item => item?.active !== false && item?.value) : [];
    if (!out.length) {
      if (person.email) out.push({ type: "email", value: person.email });
      if (person.phone) out.push({ type: "phone", value: person.phone });
    }
    return out;
  }

  function ready(person, type) {
    return methods(person).some(item => item.type === type && item.value);
  }

  function peopleForOrg(directory, orgId) {
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
      if (selector.type === "organization") peopleForOrg(directory, selector.ref).forEach(person => ids.add(person.id));
      if (selector.type === "label") peopleForLabel(directory, selector.ref).forEach(person => ids.add(person.id));
    });
    return [...ids].map(id => directory.people.find(person => person.id === id)).filter(Boolean);
  }

  function summary(directory) {
    return {
      people: directory.people.length,
      organizations: directory.organizations.length,
      groups: directory.groups.length,
      email: directory.people.filter(person => ready(person, "email")).length,
      phone: directory.people.filter(person => ready(person, "phone")).length
    };
  }

  function patchDashboard(directory) {
    const deck = document.querySelector(".v3-system-deck");
    if (!deck) return;
    const target = [...deck.querySelectorAll(".v3-system-stat")].find(card => card.querySelector(":scope > span")?.textContent.trim() === "CONNECTED RECORDS");
    if (!target) return;
    const stats = summary(directory);
    const value = target.querySelector(":scope > strong");
    const note = target.querySelector(":scope > small");
    if (value) value.textContent = String(stats.people + stats.organizations + stats.groups);
    if (note) note.textContent = `${stats.people} people · ${stats.organizations} orgs · ${stats.groups} groups`;
    target.dataset.directoryV2 = "ready";
  }

  function patchActionsStage(directory) {
    const stage = document.querySelector(".v3-actions-stage");
    if (!stage) return;
    let strip = stage.querySelector(".v4-directory-strip");
    const stats = summary(directory);
    if (!strip) {
      strip = document.createElement("section");
      strip.className = "v4-directory-strip";
      const stack = stage.querySelector(".v3-action-stack");
      (stack || stage.firstElementChild)?.before(strip);
    }
    strip.innerHTML = `
      <div>
        <span>DIRECTORY</span>
        <strong>${stats.people} People · ${stats.organizations} Organizations · ${stats.groups} Groups</strong>
        <small>${stats.email} email-ready · ${stats.phone} phone-ready</small>
      </div>
      <a href="/lab/#lab=view%3Arecords">Open Directory →</a>`;
  }

  function annotateTarget(button, directory) {
    const raw = button.dataset.chooseTarget || "";
    const [kind, ...rest] = raw.split(":");
    const id = rest.join(":");
    const copy = button.querySelector("span");
    const small = copy?.querySelector("small");
    if (!small || small.dataset.directoryAnnotated === "true") return;

    if (kind === "person") {
      const person = directory.people.find(item => item.id === id);
      if (!person) return;
      const tags = [];
      tags.push(ready(person, "email") ? "Email ready" : "No email");
      tags.push(ready(person, "phone") ? "Phone ready" : "No phone");
      const groupCount = directory.groups.filter(group => resolveGroup(directory, group).some(member => member.id === id)).length;
      if (groupCount) tags.push(`${groupCount} group${groupCount === 1 ? "" : "s"}`);
      small.textContent = `${small.textContent.trim()} · ${tags.join(" · ")}`;
      small.dataset.directoryAnnotated = "true";
      return;
    }

    if (kind === "organization") {
      const org = directory.organizations.find(item => item.id === id);
      if (!org) return;
      const people = peopleForOrg(directory, id);
      const email = people.filter(person => ready(person, "email")).length;
      const phone = people.filter(person => ready(person, "phone")).length;
      small.textContent = `${small.textContent.trim()} · ${people.length} people · ${email} email · ${phone} phone`;
      small.dataset.directoryAnnotated = "true";
    }
  }

  function patchTargetPicker(directory) {
    const picker = document.querySelector(".v3-picker");
    const results = picker?.querySelector("[data-picker-results]");
    if (!picker || !results || !picker.querySelector("[data-choose-target]")) return;

    results.querySelectorAll("[data-choose-target]").forEach(button => annotateTarget(button, directory));

    if (results.querySelector(".v4-audience-preview")) return;
    const section = document.createElement("section");
    section.className = "v4-audience-preview";
    section.innerHTML = `
      <h3>Groups & audiences <span>${directory.groups.length}</span></h3>
      <div class="v4-audience-preview-grid">
        ${directory.groups.slice(0, 4).map(group => {
          const people = resolveGroup(directory, group);
          const email = people.filter(person => ready(person, "email")).length;
          const phone = people.filter(person => ready(person, "phone")).length;
          return `<article><b>GRP</b><span><strong>${esc(group.name)}</strong><small>${people.length} people · ${email} email · ${phone} phone</small></span></article>`;
        }).join("") || `<p>No saved Groups yet.</p>`}
      </div>
      <div class="v4-audience-boundary">
        <strong>Typed Audience available</strong>
        <span>Communication Actions now use the v4.1 Audience manager for People, Organizations, Groups and Labels. This legacy picker remains available only where an older non-communication target field still needs it.</span>
        <a href="/lab/#lab=view%3Arecords">Manage Directory →</a>
      </div>`;
    results.append(section);
  }

  function patchReview(directory) {
    const side = document.querySelector(".v3-review-side");
    if (!side) return;
    let card = side.querySelector(".v4-directory-preflight");
    const stats = summary(directory);
    if (!card) {
      card = document.createElement("section");
      card.className = "v4-directory-preflight";
      side.prepend(card);
    }
    card.innerHTML = `<span>DIRECTORY READINESS</span><strong>${stats.people} people available</strong><small>${stats.email} email-ready · ${stats.phone} phone-ready · ${stats.groups} saved groups</small>`;
  }

  function patch() {
    queued = false;
    const directory = readDirectory();
    patchDashboard(directory);
    patchActionsStage(directory);
    patchTargetPicker(directory);
    patchReview(directory);
    document.documentElement.dataset.labAutomationsDirectory = "v4";
  }

  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => requestAnimationFrame(patch));
  }

  document.addEventListener("click", schedule, false);
  document.addEventListener("input", schedule, false);
  document.addEventListener("change", schedule, false);
  window.addEventListener("pageshow", schedule);
  window.addEventListener("storage", event => {
    if (event.key === CRM_KEY) schedule();
  });
  window.addEventListener("cmx:lab-directory-updated", schedule);

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", schedule, { once: true });
  else schedule();
})();