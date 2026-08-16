(() => {
  "use strict";

  if (document.body?.dataset.labMode !== "true") return;

  /*
   * PHASE 7 PROVENANCE BOOTSTRAP
   * ----------------------------
   * On the very first Phase 7 load, a simulation may already be in progress
   * from the older Sequence layer. We cannot truthfully reconstruct the exact
   * definition versions that existed when that run began.
   *
   * If no Phase 7 version ledger exists yet, seed that preexisting current run
   * as LEGACY before lab-audit.js boots. New simulations created after Phase 7
   * is active receive proper immutable definition-version snapshots.
   */

  const VERSION_KEY = "cmx-lab-versions-v1";
  const INCIDENT_KEY = "cmx-lab-incidents-v1";
  const SIM_KEY = "cmx-lab-simulations-v1";

  if (localStorage.getItem(VERSION_KEY) || localStorage.getItem(INCIDENT_KEY)) return;

  let simulations;
  try { simulations = JSON.parse(localStorage.getItem(SIM_KEY) || "null"); } catch { simulations = null; }
  const current = simulations?.current;
  if (!current?.id) return;

  const incident = {
    id: current.id,
    openedAt: current.startedAt || new Date().toISOString(),
    capturedAt: new Date().toISOString(),
    status: current.completed ? "ARCHIVED" : "OPEN",
    legacy: true,
    policySnapshot: current.policySnapshot || {},
    versionRefs: {},
    actionSnapshots: [],
    decisionSnapshots: [],
    targetSnapshot: [],
    events: [],
    seenEventKeys: [],
    runtimeSummary: {},
    fingerprint: "legacy-no-definition-snapshot"
  };

  localStorage.setItem(INCIDENT_KEY, JSON.stringify({
    version: 1,
    incidents: { [current.id]: incident },
    order: [current.id]
  }));
})();