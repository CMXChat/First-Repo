(() => {
  "use strict";

  if (document.body?.dataset.labMode !== "true") return;

  /**
   * BACKEND HANDOFF — AUDIT / VERSION / INCIDENT SNAPSHOTS (PHASE 7)
   * ----------------------------------------------------------------
   * This module is a Lab-only browser adapter. Production audit/version state
   * must be append-only and server-authoritative.
   *
   * Production rules:
   * - PostgreSQL owns definition revisions, audit events, incident snapshots,
   *   execution attempts, actor/source metadata, and immutable incident events.
   * - Opening an incident snapshots the exact policy/action/decision/document
   *   versions used by that incident. Later definition edits never rewrite it.
   * - Restoring an older definition creates a NEW revision. Never rewind/delete
   *   later revisions.
   * - Event timestamps, actors, version numbers, fingerprints/checksums, and
   *   incident state come from the server, never the browser.
   * - Deletes of operational definitions should become archive/tombstone events.
   * - Integrity fingerprints shown here are Lab convenience fingerprints only;
   *   production should use cryptographic hashes over canonical payloads.
   *
   * See assets/lab/AUDIT-BACKEND-HANDOFF.md.
   */

  const KEYS = Object.freeze({
    crm: "cmx-lab-crm-v1",
    inventory: "cmx-lab-inventory-v1",
    actions: "cmx-lab-actions-v1",
    policy: "cmx-lab-switch-policy-v1",
    simulations: "cmx-lab-simulations-v1",
    decisions: "cmx-lab-decisions-v1",
    decisionRuntime: "cmx-lab-decision-runtime-v1",
    audit: "cmx-lab-audit-v1",
    versions: "cmx-lab-versions-v1",
    incidents: "cmx-lab-incidents-v1"
  });

  const DEFINITION_KEYS = new Set([KEYS.crm, KEYS.inventory, KEYS.actions, KEYS.policy, KEYS.decisions]);
  const RUNTIME_KEYS = new Set([KEYS.simulations, KEYS.decisionRuntime]);
  const INTERNAL_KEYS = new Set([KEYS.audit, KEYS.versions, KEYS.incidents]);
  const nativeSetItem = Storage.prototype.setItem;
  const nativeRemoveItem = Storage.prototype.removeItem;
  const $ = (selector, root = document) => root?.querySelector(selector) || null;
  const $$ = (selector, root = document) => root ? [...root.querySelectorAll(selector)] : [];
  const esc = value => String(value ?? "").replace(/[&<>'\"]/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[char]));
  const clone = value => JSON.parse(JSON.stringify(value ?? null));
  const now = () => new Date().toISOString();
  const uid = prefix => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
  const MAX_AUDIT_EVENTS = 600;
  const MAX_INCIDENT_EVENTS = 300;

  const TYPE_META = {
    "switch-policy": { label:"Switch policy", mark:"SW", category:"Policy" },
    action: { label:"Action", mark:"ACT", category:"Automation" },
    decision: { label:"Decision policy", mark:"LOG", category:"Automation" },
    document: { label:"Document", mark:"DOC", category:"Records" },
    asset: { label:"Digital asset", mark:"WEB", category:"Records" },
    organization: { label:"Organization", mark:"ORG", category:"Records" }
  };

  let auditStore = load(KEYS.audit, { version:1, events:[] });
  let versionStore = load(KEYS.versions, { version:1, objects:{} });
  let incidentStore = load(KEYS.incidents, { version:1, incidents:{}, order:[] });
  let activityRoot = null;
  let ui = {
    tab:"audit",
    query:"",
    category:"all",
    severity:"all",
    selectedEventId:"",
    selectedIncidentId:"",
    selectedObjectKey:"",
    selectedRevisionId:"",
    compareFrom:"",
    compareTo:"",
    replayStep:null
  };

  function load(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return value ?? clone(fallback);
    } catch { return clone(fallback); }
  }

  function writeInternal(key, value) {
    nativeSetItem.call(localStorage, key, JSON.stringify(value));
  }

  function canonical(value) {
    if (Array.isArray(value)) return value.map(canonical);
    if (value && typeof value === "object") {
      return Object.keys(value).sort().reduce((out, key) => {
        out[key] = canonical(value[key]);
        return out;
      }, {});
    }
    return value;
  }

  function fingerprint(value) {
    const text = JSON.stringify(canonical(value));
    let hash = 2166136261;
    for (let i = 0; i < text.length; i += 1) {
      hash ^= text.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return `lab-${(hash >>> 0).toString(16).padStart(8,"0")}`;
  }

  function stableEqual(a, b) {
    return JSON.stringify(canonical(a)) === JSON.stringify(canonical(b));
  }

  function actor() {
    return { id:"lab-operator", label:"Operator", source:"Lab browser" };
  }

  function objectKey(type, id) { return `${type}:${id}`; }
  function splitObjectKey(key) {
    const index = key.indexOf(":");
    return index < 0 ? { type:key, id:key } : { type:key.slice(0,index), id:key.slice(index+1) };
  }

  function objectLabel(type, payload, id="") {
    if (type === "switch-policy") return "Check-in switch policy";
    if (type === "action") return payload?.name || id;
    if (type === "decision") {
      const action = load(KEYS.actions,{actions:[]}).actions?.find(item => item.id === id);
      return action ? `${action.name} logic` : `Decision policy ${id}`;
    }
    if (type === "document") return payload?.title || id;
    if (type === "asset" || type === "organization") return payload?.name || id;
    return id || type;
  }

  function addAuditEvent(input) {
    const event = {
      id: input.id || uid("aud"),
      at: input.at || now(),
      type: input.type || "LAB_EVENT",
      category: input.category || "System",
      severity: input.severity || "Info",
      title: input.title || input.type || "Lab event",
      detail: input.detail || "",
      objectType: input.objectType || "",
      objectId: input.objectId || "",
      objectLabel: input.objectLabel || "",
      incidentId: input.incidentId || "",
      revisionId: input.revisionId || "",
      actor: input.actor || actor(),
      metadata: clone(input.metadata || {})
    };
    auditStore.events.unshift(event);
    auditStore.events = auditStore.events.slice(0, MAX_AUDIT_EVENTS);
    writeInternal(KEYS.audit, auditStore);
    return event;
  }

  function revisionsFor(key) { return versionStore.objects[key] || []; }
  function latestRevision(key) { return revisionsFor(key).at(-1) || null; }

  function recordVersion(type, id, payload, reason="Definition updated", source="Lab UI", { silent=false } = {}) {
    if (!payload) return null;
    const key = objectKey(type,id);
    const list = revisionsFor(key);
    const fp = fingerprint(payload);
    const previous = list.at(-1);
    if (previous?.fingerprint === fp) return previous;
    const revision = {
      id: uid("rev"),
      number: (previous?.number || 0) + 1,
      objectKey:key,
      objectType:type,
      objectId:id,
      label:objectLabel(type,payload,id),
      at:now(),
      actor:actor(),
      source,
      reason,
      fingerprint:fp,
      payload:clone(payload)
    };
    if (!versionStore.objects[key]) versionStore.objects[key] = [];
    versionStore.objects[key].push(revision);
    writeInternal(KEYS.versions, versionStore);
    if (!silent) {
      const meta = TYPE_META[type] || TYPE_META.action;
      addAuditEvent({
        type:`${type.replace(/-/g,"_").toUpperCase()}_VERSION_CREATED`,
        category:meta.category,
        severity:type === "switch-policy" || type === "decision" ? "Important" : "Info",
        title:`${meta.label} v${revision.number} created`,
        detail:`${revision.label} was saved as a new Lab revision. ${reason}`,
        objectType:type, objectId:id, objectLabel:revision.label, revisionId:revision.id,
        metadata:{ version:revision.number, fingerprint:revision.fingerprint, source }
      });
    }
    return revision;
  }

  function seedVersions() {
    const p = load(KEYS.policy, null);
    if (p) recordVersion("switch-policy","primary",p,"Initial Lab baseline","Baseline",{silent:true});
    const actions = load(KEYS.actions,{actions:[]}).actions || [];
    actions.forEach(item => recordVersion("action",item.id,item,"Initial Lab baseline","Baseline",{silent:true}));
    const decisions = load(KEYS.decisions,{policies:{}}).policies || {};
    Object.entries(decisions).forEach(([id,item]) => recordVersion("decision",id,item,"Initial Lab baseline","Baseline",{silent:true}));
    const inventory = load(KEYS.inventory,{documents:[],assets:[]});
    (inventory.documents || []).forEach(item => recordVersion("document",item.id,item,"Initial Lab baseline","Baseline",{silent:true}));
    (inventory.assets || []).forEach(item => recordVersion("asset",item.id,item,"Initial Lab baseline","Baseline",{silent:true}));
    const crm = load(KEYS.crm,{organizations:[]});
    (crm.organizations || []).forEach(item => recordVersion("organization",item.id,item,"Initial Lab baseline","Baseline",{silent:true}));
  }

  function mapById(items=[]) { return new Map(items.map(item => [item.id,item])); }

  function diffCollection(type, beforeItems=[], afterItems=[], sourceLabel) {
    const before = mapById(beforeItems), after = mapById(afterItems);
    after.forEach((payload,id) => {
      const prior = before.get(id);
      if (!prior || !stableEqual(prior,payload)) {
        const reason = prior ? inferReason(type,prior,payload,sourceLabel) : `${TYPE_META[type]?.label || type} created`;
        recordVersion(type,id,payload,reason,sourceLabel);
      }
    });
    before.forEach((payload,id) => {
      if (after.has(id)) return;
      const label = objectLabel(type,payload,id);
      addAuditEvent({
        type:`${type.toUpperCase()}_REMOVED`, category:TYPE_META[type]?.category || "Records", severity:"Warning",
        title:`${TYPE_META[type]?.label || type} removed`,
        detail:`${label} was removed from current Lab storage. Historical revisions remain available.`,
        objectType:type, objectId:id, objectLabel:label, metadata:{ tombstone:true }
      });
    });
  }

  function inferReason(type, before, after, source="Lab UI") {
    if (type === "action") {
      if (before.status !== after.status) return `State changed ${before.status || "—"} → ${after.status || "—"}`;
      if (!stableEqual(before.trigger,after.trigger)) return "Execution trigger changed";
      if (!stableEqual(before.targets,after.targets)) return "Linked targets changed";
      if (!stableEqual(before.guardrails,after.guardrails)) return "Guardrails changed";
      return source === "reset" ? "Sample definition reset" : "Action definition edited";
    }
    if (type === "decision") {
      if (!stableEqual(before.routes,after.routes)) return "Outcome routing changed";
      if (!stableEqual(before.conditions,after.conditions)) return "Decision conditions changed";
      if (!stableEqual(before.acknowledgement,after.acknowledgement)) return "Acknowledgement policy changed";
      return "Decision policy edited";
    }
    if (type === "document") return before.status !== after.status ? `Document status changed ${before.status} → ${after.status}` : "Document metadata edited";
    if (type === "asset") return before.status !== after.status ? `Asset status changed ${before.status} → ${after.status}` : "Digital asset edited";
    if (type === "organization") return "Organization record edited";
    return "Definition edited";
  }

  function processDefinitionChange(key, beforeRaw, afterRaw) {
    let before, after;
    try { before = beforeRaw ? JSON.parse(beforeRaw) : null; } catch { before = null; }
    try { after = afterRaw ? JSON.parse(afterRaw) : null; } catch { after = null; }
    if (key === KEYS.policy && after) {
      const previous = before || {};
      if (!stableEqual(previous,after)) recordVersion("switch-policy","primary",after,"Switch timing/cycle policy changed","Lab UI");
    }
    if (key === KEYS.actions) diffCollection("action",before?.actions || [],after?.actions || [],"Lab UI");
    if (key === KEYS.decisions) {
      const beforePolicies = before?.policies || {}, afterPolicies = after?.policies || {};
      Object.entries(afterPolicies).forEach(([id,payload]) => {
        if (!beforePolicies[id] || !stableEqual(beforePolicies[id],payload)) recordVersion("decision",id,payload,inferReason("decision",beforePolicies[id] || {},payload),"Lab UI");
      });
      Object.entries(beforePolicies).forEach(([id,payload]) => {
        if (afterPolicies[id]) return;
        addAuditEvent({type:"DECISION_POLICY_REMOVED",category:"Automation",severity:"Warning",title:"Decision policy removed",detail:`${objectLabel("decision",payload,id)} was removed from current Lab storage.`,objectType:"decision",objectId:id,objectLabel:objectLabel("decision",payload,id)});
      });
    }
    if (key === KEYS.inventory) {
      diffCollection("document",before?.documents || [],after?.documents || [],"Lab UI");
      diffCollection("asset",before?.assets || [],after?.assets || [],"Lab UI");
    }
    if (key === KEYS.crm) {
      diffCollection("organization",before?.organizations || [],after?.organizations || [],"Lab UI");
      const bp = mapById(before?.people || []), ap = mapById(after?.people || []);
      ap.forEach((person,id) => {
        const prior = bp.get(id);
        if (!prior || !stableEqual(prior,person)) addAuditEvent({type:prior?"PERSON_UPDATED":"PERSON_CREATED",category:"Records",severity:"Info",title:prior?"Person updated":"Person created",detail:`${person.name || id} changed in Lab records.`,objectType:"person",objectId:id,objectLabel:person.name || id});
      });
    }
  }

  function currentPlanKeys() {
    const actions = load(KEYS.actions,{actions:[]}).actions || [];
    const enabled = actions.filter(item => item.status === "Enabled");
    const keys = new Set([objectKey("switch-policy","primary")]);
    const inventory = load(KEYS.inventory,{documents:[],assets:[]});
    enabled.forEach(action => {
      keys.add(objectKey("action",action.id));
      if (load(KEYS.decisions,{policies:{}}).policies?.[action.id]) keys.add(objectKey("decision",action.id));
      (action.targets || []).forEach(target => {
        if (target.kind === "document" && inventory.documents?.some(item => item.id === target.id)) keys.add(objectKey("document",target.id));
        if (target.kind === "asset" && inventory.assets?.some(item => item.id === target.id)) keys.add(objectKey("asset",target.id));
      });
    });
    return [...keys];
  }

  function currentVersionMap() {
    const map = {};
    currentPlanKeys().forEach(key => {
      const rev = latestRevision(key);
      if (rev) map[key] = { revisionId:rev.id, number:rev.number, fingerprint:rev.fingerprint };
    });
    return map;
  }

  function resolveTarget(target) {
    const crm = load(KEYS.crm,{people:[],organizations:[]});
    const inventory = load(KEYS.inventory,{documents:[],assets:[]});
    if (target.kind === "person") {
      const record = crm.people?.find(item => item.id === target.id);
      return { kind:"person", id:target.id, label:record?.name || target.id };
    }
    if (target.kind === "organization") {
      const record = crm.organizations?.find(item => item.id === target.id);
      return { kind:"organization", id:target.id, label:record?.name || target.id };
    }
    if (target.kind === "document") {
      const record = inventory.documents?.find(item => item.id === target.id);
      return { kind:"document", id:target.id, label:record?.title || target.id };
    }
    if (target.kind === "asset") {
      const record = inventory.assets?.find(item => item.id === target.id);
      return { kind:"asset", id:target.id, label:record?.name || target.id };
    }
    return { kind:target.kind || "record", id:target.id || "", label:target.id || "Record" };
  }

  function buildIncidentSnapshot(sim) {
    const actions = load(KEYS.actions,{actions:[]}).actions || [];
    const decisions = load(KEYS.decisions,{policies:{}}).policies || {};
    const p = load(KEYS.policy,{});
    const enabled = actions.filter(item => item.status === "Enabled");
    const versionRefs = currentVersionMap();
    const targets = [];
    enabled.forEach(action => (action.targets || []).forEach(target => targets.push(resolveTarget(target))));
    const uniqueTargets = [...new Map(targets.map(item => [`${item.kind}:${item.id}`,item])).values()];
    return {
      id:sim.id,
      openedAt:sim.startedAt || now(),
      capturedAt:now(),
      status:"OPEN",
      legacy:false,
      policySnapshot:clone(sim.policySnapshot || p),
      versionRefs,
      actionSnapshots:enabled.map(action => ({ id:action.id, name:action.name, revision:versionRefs[objectKey("action",action.id)] || null, payload:clone(action) })),
      decisionSnapshots:enabled.filter(action => decisions[action.id]).map(action => ({ actionId:action.id, revision:versionRefs[objectKey("decision",action.id)] || null, payload:clone(decisions[action.id]) })),
      targetSnapshot:uniqueTargets,
      events:[],
      seenEventKeys:[],
      runtimeSummary:{},
      fingerprint:""
    };
  }

  function legacyIncident(run) {
    return {
      id:run.id,
      openedAt:run.startedAt || now(),
      capturedAt:now(),
      archivedAt:run.completedAt || "",
      status:"ARCHIVED",
      legacy:true,
      policySnapshot:clone(run.policySnapshot || {}),
      versionRefs:{},
      actionSnapshots:[], decisionSnapshots:[], targetSnapshot:[], events:[], seenEventKeys:[], runtimeSummary:{}, fingerprint:"legacy-no-definition-snapshot"
    };
  }

  function ensureIncident(run,{legacy=false}={}) {
    if (!run?.id) return null;
    let incident = incidentStore.incidents[run.id];
    if (!incident) {
      incident = legacy ? legacyIncident(run) : buildIncidentSnapshot(run);
      if (!legacy) incident.fingerprint = fingerprint({policy:incident.policySnapshot,versions:incident.versionRefs,actions:incident.actionSnapshots.map(item=>item.payload),decisions:incident.decisionSnapshots.map(item=>item.payload)});
      incidentStore.incidents[run.id] = incident;
      incidentStore.order = [run.id,...incidentStore.order.filter(id => id !== run.id)];
      if (!legacy) addAuditEvent({type:"INCIDENT_SNAPSHOT_CREATED",category:"Incident",severity:"Important",title:"Incident snapshot captured",detail:`${run.id.toUpperCase()} captured ${incident.actionSnapshots.length} enabled action definitions and their decision policies.`,incidentId:run.id,metadata:{fingerprint:incident.fingerprint,versionCount:Object.keys(incident.versionRefs).length}});
    }
    return incident;
  }

  function normalizeIncidentEvent(event, source, incidentId) {
    const code = event.code || event.type || "INCIDENT_EVENT";
    const severity = /FAIL|DENIED|TIMEOUT|CANCEL/.test(code) ? "Warning" : /TRIGGER|APPROVAL|ROUTE|ACK/.test(code) ? "Important" : "Info";
    return {
      id:event.id || uid("iev"),
      at:event.at || now(),
      code,
      source,
      severity,
      detail:event.detail || code,
      actionId:event.actionId || "",
      targetActionId:event.targetActionId || "",
      hour:Number(event.hour || 0),
      incidentId
    };
  }

  function appendIncidentEvent(incident, event) {
    const key = `${event.source}|${event.id || ""}|${event.code}|${event.at}|${event.actionId}|${event.hour}`;
    if (incident.seenEventKeys.includes(key)) return false;
    incident.seenEventKeys.push(key);
    incident.seenEventKeys = incident.seenEventKeys.slice(-MAX_INCIDENT_EVENTS * 2);
    incident.events.push(event);
    incident.events = incident.events.slice(-MAX_INCIDENT_EVENTS);
    return true;
  }

  function syncSimulationStore(rawStore=null) {
    const store = rawStore || load(KEYS.simulations,{current:null,history:[]});
    const current = store.current;
    if (current?.id) {
      const incident = ensureIncident(current,{legacy:false});
      (current.trace || []).slice().reverse().forEach(event => appendIncidentEvent(incident,normalizeIncidentEvent(event,"Sequence",current.id)));
      incident.status = current.completed ? "ARCHIVED" : "OPEN";
      incident.runtimeSummary.sequenceStates = clone(current.states || {});
      incident.runtimeSummary.hour = Number(current.hour || 0);
    }
    (store.history || []).forEach(run => {
      const incident = ensureIncident(run,{legacy:!incidentStore.incidents[run.id]});
      (run.trace || []).slice().reverse().forEach(event => appendIncidentEvent(incident,normalizeIncidentEvent(event,"Sequence",run.id)));
      incident.status = "ARCHIVED";
      incident.archivedAt = run.completedAt || incident.archivedAt || now();
      incident.runtimeSummary.sequenceStates = clone(run.states || {});
      incident.runtimeSummary.hour = Number(run.hour || 0);
    });
    writeInternal(KEYS.incidents,incidentStore);
  }

  function syncDecisionRuntime(rawRuntime=null) {
    const store = rawRuntime || load(KEYS.decisionRuntime,{bySimulation:{}});
    Object.entries(store.bySimulation || {}).forEach(([simId,rt]) => {
      const incident = incidentStore.incidents[simId];
      if (!incident) return;
      (rt.trace || []).slice().reverse().forEach(event => appendIncidentEvent(incident,normalizeIncidentEvent(event,"Decision",simId)));
      Object.entries(rt.routeSignals || {}).forEach(([targetActionId,signal]) => {
        const synthetic = normalizeIncidentEvent({id:`route-${targetActionId}-${signal.sourceId}-${signal.event}-${signal.at || signal.atHour}`,code:"ROUTE_SIGNAL",detail:`${signal.event} route activated ${signal.sourceId} → ${targetActionId}.`,actionId:signal.sourceId,targetActionId,hour:signal.atHour || 0,at:signal.at || now()},"Decision",simId);
        appendIncidentEvent(incident,synthetic);
      });
      incident.runtimeSummary.decisionStates = clone(rt.states || {});
      incident.runtimeSummary.attempts = clone(rt.attempts || {});
      incident.runtimeSummary.acknowledgement = clone(rt.acknowledgement || {});
      incident.runtimeSummary.approvals = clone(rt.approvals || {});
      incident.runtimeSummary.routeSignals = clone(rt.routeSignals || {});
    });
    writeInternal(KEYS.incidents,incidentStore);
  }

  function syncIncidents() {
    syncSimulationStore();
    syncDecisionRuntime();
  }

  function patchStorage() {
    if (Storage.prototype.__cmxLabAuditPatched) return;
    const wrapper = function(key,value) {
      const before = this === localStorage ? this.getItem(key) : null;
      const result = nativeSetItem.call(this,key,value);
      if (this === localStorage && !INTERNAL_KEYS.has(key) && (DEFINITION_KEYS.has(key) || RUNTIME_KEYS.has(key))) {
        const after = String(value);
        queueMicrotask(() => {
          if (DEFINITION_KEYS.has(key)) processDefinitionChange(key,before,after);
          if (key === KEYS.simulations) {
            try { syncSimulationStore(JSON.parse(after)); } catch { syncSimulationStore(); }
          }
          if (key === KEYS.decisionRuntime) {
            try { syncDecisionRuntime(JSON.parse(after)); } catch { syncDecisionRuntime(); }
          }
          render();
        });
      }
      return result;
    };
    Object.defineProperty(Storage.prototype,"__cmxLabAuditPatched",{value:true,configurable:true});
    Storage.prototype.setItem = wrapper;
  }

  function latestIncident() {
    return incidentStore.order.map(id => incidentStore.incidents[id]).filter(item => item && !item.legacy).sort((a,b)=>new Date(b.openedAt)-new Date(a.openedAt))[0] || null;
  }

  function changedSinceIncident(incident=latestIncident()) {
    if (!incident) return [];
    return currentPlanKeys().filter(key => {
      const current = latestRevision(key), snap = incident.versionRefs?.[key];
      if (!current) return false;
      return !snap || snap.revisionId !== current.id;
    }).map(key => ({ key, current:latestRevision(key), snapshot:incident.versionRefs?.[key] || null }));
  }

  function actionCoverage() {
    const actions = load(KEYS.actions,{actions:[]}).actions || [];
    const incidents = Object.values(incidentStore.incidents || {});
    return actions.map(action => {
      const events = incidents.flatMap(incident => incident.events || []).filter(event => event.actionId === action.id || event.targetActionId === action.id || String(event.detail || "").includes(action.name));
      const success = events.some(event => ["SIMULATED_SUCCESS","ACKNOWLEDGED","DELIVERED_AWAITING_ACK"].includes(event.code));
      const failure = events.some(event => ["SIMULATED_FAILURE","FINAL_FAILURE","RETRY_QUEUED","NO_ACKNOWLEDGEMENT","ACK_TIMEOUT"].includes(event.code));
      const acknowledgement = events.some(event => ["ACKNOWLEDGED","NO_ACKNOWLEDGEMENT","ACK_TIMEOUT","DELIVERED_AWAITING_ACK"].includes(event.code));
      const fallback = events.some(event => ["ROUTE_ACTIVATED","ROUTE_SIGNAL"].includes(event.code) && (event.targetActionId === action.id || String(event.detail || "").includes(`→ ${action.name}`)));
      const tested = [success,failure,acknowledgement,fallback].filter(Boolean).length;
      return {action,success,failure,acknowledgement,fallback,tested};
    });
  }

  function healthSummary() {
    const actions = load(KEYS.actions,{actions:[]}).actions || [];
    const coverage = actionCoverage();
    const latest = latestIncident();
    const changed = changedSinceIncident(latest);
    return {
      latest,
      changed,
      drafts:actions.filter(item => item.status === "Draft"),
      untested:coverage.filter(item => item.tested === 0),
      partial:coverage.filter(item => item.tested > 0 && item.tested < 4),
      coverage
    };
  }

  function dateTime(iso) {
    if (!iso) return "—";
    try { return new Intl.DateTimeFormat(undefined,{month:"short",day:"numeric",year:"numeric",hour:"numeric",minute:"2-digit"}).format(new Date(iso)); } catch { return iso; }
  }

  function relative(iso) {
    if (!iso) return "—";
    const ms = Date.now() - new Date(iso).getTime();
    if (ms < 60000) return "now";
    if (ms < 3600000) return `${Math.floor(ms/60000)}m`;
    if (ms < 86400000) return `${Math.floor(ms/3600000)}h`;
    return `${Math.floor(ms/86400000)}d`;
  }

  function severityClass(value) { return String(value || "Info").toLowerCase(); }
  function eventIcon(event) {
    if (event.category === "Incident") return "INC";
    if (event.category === "Automation") return "ACT";
    if (event.category === "Policy") return "POL";
    if (event.category === "Records") return "REC";
    return "LOG";
  }

  function filteredAudit() {
    let events = [...(auditStore.events || [])];
    if (ui.category !== "all") events = events.filter(event => event.category === ui.category);
    if (ui.severity !== "all") events = events.filter(event => event.severity === ui.severity);
    if (ui.query) {
      const q = ui.query.toLowerCase();
      events = events.filter(event => [event.type,event.title,event.detail,event.objectLabel,event.incidentId].join(" ").toLowerCase().includes(q));
    }
    return events;
  }

  function auditView() {
    const events = filteredAudit();
    if (!ui.selectedEventId || !events.some(event => event.id === ui.selectedEventId)) ui.selectedEventId = events[0]?.id || "";
    const selected = events.find(event => event.id === ui.selectedEventId);
    return `<div class="lab-audit-toolbar"><label><span class="sr-only">Search audit</span><input data-audit-search type="search" value="${esc(ui.query)}" placeholder="Search event, object, incident…" /></label><select data-audit-category><option value="all">All categories</option>${["Policy","Automation","Records","Incident","System"].map(value=>`<option${ui.category===value?" selected":""}>${value}</option>`).join("")}</select><select data-audit-severity><option value="all">All severity</option>${["Info","Important","Warning","Critical","Security"].map(value=>`<option${ui.severity===value?" selected":""}>${value}</option>`).join("")}</select></div><div class="lab-audit-split"><section class="lab-audit-stream"><div class="lab-audit-pane-head"><span>Audit timeline</span><strong>${events.length}</strong></div>${events.length?events.slice(0,100).map(event=>`<button type="button" class="lab-audit-event sev-${severityClass(event.severity)}${event.id===ui.selectedEventId?" is-active":""}" data-audit-event="${esc(event.id)}"><span class="lab-audit-event-mark">${eventIcon(event)}</span><span><small>${esc(event.type)}</small><strong>${esc(event.title)}</strong><em>${esc(event.objectLabel || event.incidentId || event.category)}</em></span><time>${relative(event.at)}</time></button>`).join(""):'<div class="lab-audit-empty"><strong>No matching events</strong><p>Change the filters or create/edit a Lab definition.</p></div>'}</section><aside class="lab-audit-detail">${selected?eventDetail(selected):'<div class="lab-audit-empty"><strong>Select an event</strong></div>'}</aside></div>`;
  }

  function eventDetail(event) {
    const revision = event.revisionId ? Object.values(versionStore.objects).flat().find(item => item.id === event.revisionId) : null;
    return `<header class="lab-audit-detail-head"><span class="lab-audit-event-mark sev-${severityClass(event.severity)}">${eventIcon(event)}</span><div><small>${esc(event.category.toUpperCase())} · ${esc(event.severity.toUpperCase())}</small><h3>${esc(event.title)}</h3><p>${esc(event.type)}</p></div></header><section class="lab-audit-detail-card"><span>WHAT HAPPENED</span><p>${esc(event.detail || "No additional detail.")}</p></section><div class="lab-audit-meta-grid"><div><small>ACTOR</small><strong>${esc(event.actor?.label || "Operator")}</strong><span>${esc(event.actor?.source || "Lab browser")}</span></div><div><small>TIME</small><strong>${dateTime(event.at)}</strong><span>${esc(event.at)}</span></div><div><small>OBJECT</small><strong>${esc(event.objectLabel || "—")}</strong><span>${esc(event.objectType || "System")}${event.objectId?` · ${esc(event.objectId)}`:""}</span></div><div><small>INCIDENT</small><strong>${esc(event.incidentId ? event.incidentId.toUpperCase() : "—")}</strong><span>${event.incidentId?"Linked incident":"Definition/global event"}</span></div></div>${revision?`<section class="lab-audit-detail-card"><span>REVISION</span><div class="lab-audit-revision-link"><strong>v${revision.number} · ${esc(revision.fingerprint)}</strong><button type="button" data-open-revision="${esc(revision.objectKey)}" data-revision-id="${esc(revision.id)}">Open version</button></div></section>`:""}`;
  }

  function incidentList() {
    return incidentStore.order.map(id => incidentStore.incidents[id]).filter(Boolean).sort((a,b)=>new Date(b.openedAt)-new Date(a.openedAt));
  }

  function incidentsView() {
    const incidents = incidentList();
    if (!ui.selectedIncidentId || !incidents.some(item => item.id===ui.selectedIncidentId)) ui.selectedIncidentId = incidents[0]?.id || "";
    const incident = incidentStore.incidents[ui.selectedIncidentId];
    return `<div class="lab-incidents-layout"><aside class="lab-incident-list"><div class="lab-audit-pane-head"><span>Incidents & simulations</span><strong>${incidents.length}</strong></div>${incidents.map(item=>`<button type="button" class="lab-incident-row${item.id===ui.selectedIncidentId?" is-active":""}" data-incident-id="${esc(item.id)}"><span class="lab-audit-event-mark">INC</span><span><small>${item.legacy?"LEGACY SIMULATION":item.status}</small><strong>${esc(item.id.toUpperCase())}</strong><em>${dateTime(item.openedAt)}</em></span><b>${(item.events||[]).length}</b></button>`).join("") || '<div class="lab-audit-empty"><strong>No incidents yet</strong></div>'}</aside><section class="lab-incident-detail">${incident?incidentDetail(incident):'<div class="lab-audit-empty"><strong>Select an incident</strong></div>'}</section></div>`;
  }

  function incidentDetail(incident) {
    const changed = incident.legacy ? [] : changedSinceIncident(incident);
    const events = [...(incident.events || [])].sort((a,b)=>new Date(a.at)-new Date(b.at));
    const maxStep = events.length;
    if (ui.replayStep === null || ui.replayStep > maxStep) ui.replayStep = maxStep;
    const visible = events.slice(0,ui.replayStep);
    const p = incident.policySnapshot || {};
    return `<header class="lab-incident-hero"><div><span>${incident.legacy?"LEGACY · NO DEFINITION SNAPSHOT":`${incident.status} · IMMUTABLE LAB SNAPSHOT`}</span><h2>${esc(incident.id.toUpperCase())}</h2><p>Opened ${dateTime(incident.openedAt)} · ${incident.actionSnapshots?.length || 0} snapshotted actions · ${(incident.events||[]).length} events</p></div><b>${incident.legacy?"LEGACY":"SNAP"}</b></header><div class="lab-incident-kpis"><div><small>POLICY</small><strong>${Number(p.intervalHours || 0)}h + ${Number(p.graceHours || 0)}h</strong><span>${p.repeat===false?"One-shot":"Rolling repeat"}</span></div><div><small>SNAPSHOT VERSIONS</small><strong>${Object.keys(incident.versionRefs || {}).length}</strong><span>${incident.legacy?"Unavailable for legacy run":"Definition refs locked"}</span></div><div class="${changed.length?"warn":"good"}"><small>CHANGED SINCE</small><strong>${changed.length}</strong><span>${changed.length?"Current plan differs":"Current plan matches snapshot"}</span></div><div><small>FINGERPRINT</small><strong>${esc(incident.fingerprint || "—")}</strong><span>Lab integrity preview</span></div></div>${!incident.legacy?`<section class="lab-incident-card"><div class="lab-audit-pane-head"><span>Snapshot provenance</span><strong>${incident.actionSnapshots.length} actions</strong></div><div class="lab-snapshot-grid">${incident.actionSnapshots.map(item=>`<button type="button" data-open-snapshot-action="${esc(item.id)}"><span>ACT</span><div><small>${esc(item.revision?`v${item.revision.number}`:"VERSION —")}</small><strong>${esc(item.name)}</strong><em>${esc(item.revision?.fingerprint || "No revision ref")}</em></div></button>`).join("")}</div></section>`:""}<section class="lab-incident-card"><div class="lab-audit-pane-head"><span>Read-only incident replay</span><strong>${ui.replayStep}/${maxStep}</strong></div><div class="lab-replay-control"><input type="range" min="0" max="${maxStep}" value="${ui.replayStep}" data-replay-step /><span>${ui.replayStep?`Through ${dateTime(visible.at(-1)?.at)}`:"Before first event"}</span></div><div class="lab-incident-trace">${visible.slice().reverse().map(event=>`<div class="lab-incident-event sev-${severityClass(event.severity)}"><span><i></i><strong>${esc(event.code)}</strong><small>${esc(event.source)}</small></span><p>${esc(event.detail)}</p><time>T+${Number(event.hour||0).toFixed(2)}h</time></div>`).join("") || '<div class="lab-audit-empty"><strong>Move the replay slider</strong><p>Incident snapshots are read-only.</p></div>'}</div></section>`;
  }

  function versionObjects() {
    return Object.entries(versionStore.objects).map(([key,revisions]) => ({key,revisions,latest:revisions.at(-1)})).filter(item=>item.latest).sort((a,b)=>new Date(b.latest.at)-new Date(a.latest.at));
  }

  function versionsView() {
    const objects = versionObjects();
    if (!ui.selectedObjectKey || !objects.some(item=>item.key===ui.selectedObjectKey)) ui.selectedObjectKey = objects[0]?.key || "";
    const selected = objects.find(item=>item.key===ui.selectedObjectKey);
    if (selected && (!ui.selectedRevisionId || !selected.revisions.some(item=>item.id===ui.selectedRevisionId))) ui.selectedRevisionId = selected.latest.id;
    return `<div class="lab-versions-layout"><aside class="lab-version-object-list"><div class="lab-audit-pane-head"><span>Versioned objects</span><strong>${objects.length}</strong></div>${objects.map(item=>{const meta=TYPE_META[item.latest.objectType]||TYPE_META.action;return `<button type="button" class="lab-version-object${item.key===ui.selectedObjectKey?" is-active":""}" data-version-object="${esc(item.key)}"><span>${meta.mark}</span><div><small>${esc(meta.label.toUpperCase())}</small><strong>${esc(item.latest.label)}</strong><em>v${item.latest.number} · ${relative(item.latest.at)}</em></div><b>${item.revisions.length}</b></button>`;}).join("")}</aside><section class="lab-version-history">${selected?revisionHistory(selected):'<div class="lab-audit-empty"><strong>Select a definition</strong></div>'}</section><aside class="lab-version-detail">${selected?revisionDetail(selected):""}</aside></div>`;
  }

  function revisionHistory(object) {
    return `<div class="lab-audit-pane-head"><span>${esc(object.latest.label)}</span><strong>${object.revisions.length} rev</strong></div><div class="lab-revision-list">${[...object.revisions].reverse().map(rev=>`<button type="button" class="lab-revision-row${rev.id===ui.selectedRevisionId?" is-active":""}" data-revision-id="${esc(rev.id)}"><span>v${rev.number}</span><div><strong>${esc(rev.reason)}</strong><small>${dateTime(rev.at)}</small></div><em>${esc(rev.fingerprint)}</em></button>`).join("")}</div>`;
  }

  function flatten(value,prefix="",out={}) {
    if (Array.isArray(value)) {
      out[prefix || "value"] = value.map(item => typeof item === "object" ? JSON.stringify(item) : String(item)).join(", ");
      return out;
    }
    if (value && typeof value === "object") {
      Object.entries(value).forEach(([key,item]) => flatten(item,prefix?`${prefix}.${key}`:key,out));
      return out;
    }
    out[prefix || "value"] = value;
    return out;
  }

  function diffRevisions(from,to) {
    const a = flatten(from?.payload || {}), b = flatten(to?.payload || {});
    return [...new Set([...Object.keys(a),...Object.keys(b)])].filter(key => String(a[key] ?? "") !== String(b[key] ?? "")).map(key => ({key,before:a[key],after:b[key]}));
  }

  function revisionDetail(object) {
    const selected = object.revisions.find(item=>item.id===ui.selectedRevisionId) || object.latest;
    const revisions = object.revisions;
    if (!ui.compareTo || !revisions.some(item=>item.id===ui.compareTo)) ui.compareTo = selected.id;
    if (!ui.compareFrom || !revisions.some(item=>item.id===ui.compareFrom) || ui.compareFrom===ui.compareTo) ui.compareFrom = revisions[Math.max(0,revisions.findIndex(item=>item.id===ui.compareTo)-1)]?.id || revisions[0]?.id || "";
    const from = revisions.find(item=>item.id===ui.compareFrom) || revisions[0];
    const to = revisions.find(item=>item.id===ui.compareTo) || selected;
    const diffs = diffRevisions(from,to);
    const restorable = ["switch-policy","action","decision","document","asset","organization"].includes(selected.objectType);
    return `<header class="lab-version-detail-head"><div><small>${esc((TYPE_META[selected.objectType]?.label || selected.objectType).toUpperCase())}</small><h3>${esc(selected.label)}</h3><p>v${selected.number} · ${esc(selected.fingerprint)}</p></div>${restorable?`<button type="button" data-restore-revision="${esc(selected.id)}">Restore as new version</button>`:""}</header><section class="lab-version-meta"><div><small>CREATED</small><strong>${dateTime(selected.at)}</strong></div><div><small>ACTOR</small><strong>${esc(selected.actor?.label || "Operator")}</strong></div><div><small>REASON</small><strong>${esc(selected.reason)}</strong></div><div><small>SOURCE</small><strong>${esc(selected.source || "Lab UI")}</strong></div></section><section class="lab-compare"><div class="lab-audit-pane-head"><span>Compare versions</span><strong>${diffs.length} changes</strong></div><div class="lab-compare-selects"><label>FROM<select data-compare-from>${revisions.map(rev=>`<option value="${esc(rev.id)}"${rev.id===from?.id?" selected":""}>v${rev.number}</option>`).join("")}</select></label><span>→</span><label>TO<select data-compare-to>${revisions.map(rev=>`<option value="${esc(rev.id)}"${rev.id===to?.id?" selected":""}>v${rev.number}</option>`).join("")}</select></label></div><div class="lab-diff-list">${diffs.length?diffs.slice(0,80).map(diff=>`<div class="lab-diff-row"><strong>${esc(diff.key)}</strong><span class="before">− ${esc(formatValue(diff.before))}</span><span class="after">+ ${esc(formatValue(diff.after))}</span></div>`).join(""):'<div class="lab-audit-empty"><strong>No field changes</strong><p>The selected revisions have identical flattened values.</p></div>'}</div></section>`;
  }

  function formatValue(value) {
    if (value === undefined || value === null || value === "") return "—";
    const text = String(value);
    return text.length > 180 ? `${text.slice(0,177)}…` : text;
  }

  function restoreRevision(revisionId) {
    const revision = Object.values(versionStore.objects).flat().find(item=>item.id===revisionId);
    if (!revision) return;
    if (!confirm(`Restore ${revision.label} v${revision.number} as a NEW current revision? Existing history will remain intact.`)) return;
    const payload = clone(revision.payload);
    const stamp = now();
    if (payload && typeof payload === "object" && "updatedAt" in payload) payload.updatedAt = stamp;
    if (revision.objectType === "switch-policy") {
      payload.updatedAt = stamp;
      localStorage.setItem(KEYS.policy,JSON.stringify(payload));
    } else if (revision.objectType === "action") {
      const store = load(KEYS.actions,{version:1,actions:[]});
      const index = store.actions.findIndex(item=>item.id===revision.objectId);
      if (index >= 0) store.actions[index] = payload; else store.actions.push(payload);
      localStorage.setItem(KEYS.actions,JSON.stringify(store));
    } else if (revision.objectType === "decision") {
      const store = load(KEYS.decisions,{version:1,policies:{}});
      store.policies[revision.objectId] = payload;
      localStorage.setItem(KEYS.decisions,JSON.stringify(store));
    } else if (["document","asset"].includes(revision.objectType)) {
      const store = load(KEYS.inventory,{version:1,documents:[],assets:[]});
      const list = revision.objectType === "document" ? store.documents : store.assets;
      const index = list.findIndex(item=>item.id===revision.objectId);
      if (index >= 0) list[index] = payload; else list.push(payload);
      localStorage.setItem(KEYS.inventory,JSON.stringify(store));
    } else if (revision.objectType === "organization") {
      const store = load(KEYS.crm,{version:1,people:[],organizations:[]});
      const index = store.organizations.findIndex(item=>item.id===revision.objectId);
      if (index >= 0) store.organizations[index] = payload; else store.organizations.push(payload);
      localStorage.setItem(KEYS.crm,JSON.stringify(store));
    }
    addAuditEvent({type:"REVISION_RESTORED",category:TYPE_META[revision.objectType]?.category || "System",severity:"Important",title:"Historical revision restored",detail:`${revision.label} v${revision.number} was copied into a new current revision. History was not rewound.`,objectType:revision.objectType,objectId:revision.objectId,objectLabel:revision.label,metadata:{restoredFrom:revision.id,restoredFromVersion:revision.number}});
    setTimeout(()=>location.reload(),120);
  }

  function healthView() {
    const health = healthSummary();
    const latest = health.latest;
    return `<section class="lab-health-hero"><div><small>CONFIGURATION ASSURANCE · LAB</small><h2>${health.changed.length?`${health.changed.length} definition${health.changed.length===1?"":"s"} changed since the latest snapshot`:"Current plan matches the latest incident snapshot"}</h2><p>${latest?`Baseline ${latest.id.toUpperCase()} · opened ${dateTime(latest.openedAt)}`:"Start a simulation to establish an incident snapshot baseline."}</p></div><span class="${health.changed.length?"warn":"good"}">${health.changed.length?"RETEST":"MATCH"}</span></section><div class="lab-health-kpis"><div class="${health.changed.length?"warn":"good"}"><small>CHANGED SINCE TEST</small><strong>${health.changed.length}</strong><span>${health.changed.length?"Full retest recommended":"No definition drift"}</span></div><div><small>DRAFT ACTIONS</small><strong>${health.drafts.length}</strong><span>Not in enabled plan</span></div><div class="${health.untested.length?"warn":"good"}"><small>UNTESTED ACTIONS</small><strong>${health.untested.length}</strong><span>No captured path yet</span></div><div><small>VERSIONED OBJECTS</small><strong>${Object.keys(versionStore.objects).length}</strong><span>${Object.values(versionStore.objects).flat().length} revisions retained</span></div></div>${health.changed.length?`<section class="lab-health-card"><div class="lab-audit-pane-head"><span>Changed since latest simulation</span><strong>${health.changed.length}</strong></div><div class="lab-changed-list">${health.changed.map(item=>`<button type="button" data-open-revision="${esc(item.key)}" data-revision-id="${esc(item.current?.id || "")}"><span>${esc((TYPE_META[splitObjectKey(item.key).type]?.mark || "REV"))}</span><div><strong>${esc(item.current?.label || item.key)}</strong><small>${item.snapshot?`Snapshot v${item.snapshot.number} → current v${item.current?.number}`:`Added after snapshot · current v${item.current?.number}`}</small></div><b>REVIEW</b></button>`).join("")}</div></section>`:""}<section class="lab-health-card"><div class="lab-audit-pane-head"><span>Action test coverage</span><strong>${health.coverage.length}</strong></div><div class="lab-coverage-table"><div class="lab-coverage-head"><span>Action</span><span>Success</span><span>Failure</span><span>Ack</span><span>Fallback</span><span>Coverage</span></div>${health.coverage.map(item=>`<div class="lab-coverage-row"><span><strong>${esc(item.action.name)}</strong><small>${esc(item.action.status)} · ${esc(item.action.risk)}</small></span>${[item.success,item.failure,item.acknowledgement,item.fallback].map(pass=>`<i class="${pass?"pass":"miss"}">${pass?"✓":"—"}</i>`).join("")}<b>${item.tested}/4</b></div>`).join("")}</div></section>`;
  }

  function topSummary() {
    const health = healthSummary();
    const incidents = incidentList();
    return `<div class="lab-audit-summary"><div><small>AUDIT EVENTS</small><strong>${auditStore.events.length}</strong><span>Definition/global history</span></div><div><small>INCIDENTS</small><strong>${incidents.length}</strong><span>${incidents.filter(item=>item.status==="OPEN").length} open · ${incidents.filter(item=>item.status==="ARCHIVED").length} archived</span></div><div><small>REVISIONS</small><strong>${Object.values(versionStore.objects).flat().length}</strong><span>${Object.keys(versionStore.objects).length} versioned objects</span></div><div class="${health.changed.length?"warn":"good"}"><small>PLAN HEALTH</small><strong>${health.changed.length?"RETEST":"MATCH"}</strong><span>${health.changed.length} changed since latest snapshot</span></div></div>`;
  }

  function render() {
    if (!activityRoot) return;
    syncIncidents();
    const tabs = [
      ["audit","Audit"],["incidents","Incidents"],["versions","Versions"],["health","Health"]
    ];
    activityRoot.innerHTML = `<header class="lab-audit-topbar"><div><span class="lab-audit-topbar-mark">AUD</span><span><strong>Audit & assurance</strong><small>Definition history · incident snapshots · testing health</small></span></div><nav>${tabs.map(([id,label])=>`<button type="button" data-audit-tab="${id}" class="${ui.tab===id?"is-active":""}">${label}</button>`).join("")}</nav><b>LAB</b></header>${topSummary()}<div class="lab-audit-body">${ui.tab==="audit"?auditView():ui.tab==="incidents"?incidentsView():ui.tab==="versions"?versionsView():healthView()}</div>`;
  }

  function buildActivity() {
    const panel = $('[data-view-panel="activity"]');
    if (!panel) return false;
    panel.innerHTML = '<div class="view-heading"><div><p class="eyebrow">AUDIT · VERSION CONTROL · LAB</p><h1>Activity & assurance</h1></div><p>Track definition changes, inspect immutable incident snapshots, compare revisions, and see whether the current contingency plan has changed since it was tested.</p></div><section class="lab-audit-root"></section>';
    activityRoot = $(".lab-audit-root",panel);
    activityRoot.addEventListener("click",handleClick);
    activityRoot.addEventListener("input",handleInput);
    activityRoot.addEventListener("change",handleChange);
    render();
    return true;
  }

  function handleClick(event) {
    const tab = event.target.closest("[data-audit-tab]")?.dataset.auditTab;
    if (tab) { ui.tab=tab; ui.replayStep=null; render(); return; }
    const ev = event.target.closest("[data-audit-event]")?.dataset.auditEvent;
    if (ev) { ui.selectedEventId=ev; render(); return; }
    const inc = event.target.closest("[data-incident-id]")?.dataset.incidentId;
    if (inc) { ui.selectedIncidentId=inc; ui.replayStep=null; render(); return; }
    const object = event.target.closest("[data-version-object]")?.dataset.versionObject;
    if (object) { ui.selectedObjectKey=object; ui.selectedRevisionId=""; ui.compareFrom=""; ui.compareTo=""; render(); return; }
    const revisionButton = event.target.closest("[data-revision-id]");
    if (revisionButton && !revisionButton.matches("[data-open-revision]")) { ui.selectedRevisionId=revisionButton.dataset.revisionId; ui.compareFrom=""; ui.compareTo=revisionButton.dataset.revisionId; render(); return; }
    const openRevision = event.target.closest("[data-open-revision]");
    if (openRevision) { ui.tab="versions"; ui.selectedObjectKey=openRevision.dataset.openRevision; ui.selectedRevisionId=openRevision.dataset.revisionId || ""; ui.compareFrom=""; ui.compareTo=ui.selectedRevisionId; render(); return; }
    const restore = event.target.closest("[data-restore-revision]")?.dataset.restoreRevision;
    if (restore) { restoreRevision(restore); return; }
    const action = event.target.closest("[data-open-snapshot-action]")?.dataset.openSnapshotAction;
    if (action) { $('[data-view="actions"]')?.click(); setTimeout(()=>$(`[data-action-id="${CSS.escape(action)}"]`,$(".lab-actions"))?.click(),80); }
  }

  function handleInput(event) {
    if (event.target.matches("[data-audit-search]")) { ui.query=event.target.value.trim(); render(); }
    if (event.target.matches("[data-replay-step]")) { ui.replayStep=Number(event.target.value); render(); }
  }

  function handleChange(event) {
    if (event.target.matches("[data-audit-category]")) { ui.category=event.target.value; render(); }
    if (event.target.matches("[data-audit-severity]")) { ui.severity=event.target.value; render(); }
    if (event.target.matches("[data-compare-from]")) { ui.compareFrom=event.target.value; render(); }
    if (event.target.matches("[data-compare-to]")) { ui.compareTo=event.target.value; ui.selectedRevisionId=event.target.value; render(); }
  }

  function boot(attempt=0) {
    seedVersions();
    syncIncidents();
    patchStorage();
    if (!buildActivity() && attempt < 12) { requestAnimationFrame(()=>boot(attempt+1)); return; }
    ["cmx:lab-actions-updated","cmx:lab-decisions-updated","cmx:lab-crm-updated","cmx:lab-inventory-updated","cmx:lab-switch-policy-updated","cmx:lab-simulation-updated"].forEach(name=>document.addEventListener(name,()=>setTimeout(render,0)));
  }

  window.CMX_LAB_AUDIT = Object.freeze({
    recordEvent:event=>{const value=addAuditEvent(event);render();return clone(value);},
    latestRevision:key=>clone(latestRevision(key)),
    incident:id=>clone(incidentStore.incidents[id] || null),
    health:()=>clone(healthSummary()),
    sync:()=>{syncIncidents();render();}
  });

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded",()=>boot(),{once:true});
  else boot();
})();