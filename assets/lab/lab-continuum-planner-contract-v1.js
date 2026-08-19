(() => {
  "use strict";

  const OPERATIONS = Object.freeze({
    "directory.match_or_create_people": Object.freeze({ domain: "Directory", family: "identity", label: "Match or create People", review: "conditional" }),
    "directory.match_people": Object.freeze({ domain: "Directory", family: "identity", label: "Match People", review: "conditional" }),
    "directory.match_organizations": Object.freeze({ domain: "Directory", family: "identity", label: "Match Organizations", review: "conditional" }),
    "directory.apply_label": Object.freeze({ domain: "Directory", family: "organization", label: "Apply Label", review: "low-risk" }),
    "directory.upsert_group": Object.freeze({ domain: "Directory", family: "audience", label: "Create or update Group", review: "low-risk" }),
    "directory.upsert_membership": Object.freeze({ domain: "Directory", family: "relationship", label: "Create or update membership", review: "conditional" }),
    "directory.upsert_relationship": Object.freeze({ domain: "Directory", family: "relationship", label: "Create or update relationship", review: "conditional" }),

    "library.create_folder": Object.freeze({ domain: "Library", family: "structure", label: "Create folder", review: "low-risk" }),
    "library.create_document": Object.freeze({ domain: "Library", family: "content", label: "Create document Draft", review: "low-risk" }),

    "automation.create_draft": Object.freeze({ domain: "Automations", family: "definition", label: "Create Automation Draft", review: "low-risk" }),
    "automation.set_trigger": Object.freeze({ domain: "Automations", family: "definition", label: "Set Trigger", review: "low-risk" }),
    "automation.set_preconditions": Object.freeze({ domain: "Automations", family: "definition", label: "Set pre-action Conditions", review: "low-risk" }),
    "automation.add_action": Object.freeze({ domain: "Automations", family: "definition", label: "Add Action", review: "conditional" }),
    "automation.add_condition": Object.freeze({ domain: "Automations", family: "sequence", label: "Add inter-step Condition", review: "conditional" }),
    "automation.add_wait": Object.freeze({ domain: "Automations", family: "sequence", label: "Add inter-step WAIT", review: "conditional" }),
    "automation.set_finish": Object.freeze({ domain: "Automations", family: "definition", label: "Set Finish policy", review: "low-risk" }),
    "automation.reference_audience": Object.freeze({ domain: "Automations", family: "reference", label: "Reference Directory Audience", review: "conditional" }),
    "automation.reference_content": Object.freeze({ domain: "Automations", family: "reference", label: "Reference Library content", review: "conditional" })
  });

  const knownTypes = Object.freeze(Object.keys(OPERATIONS));

  function get(type) {
    return OPERATIONS[String(type || "")] || null;
  }

  function validateOperations(operations) {
    const list = Array.isArray(operations) ? operations : [];
    const unknown = list
      .map(operation => String(operation?.type || ""))
      .filter(type => !type || !OPERATIONS[type]);
    return {
      ok: unknown.length === 0,
      count: list.length,
      unknown: [...new Set(unknown)]
    };
  }

  function describe(type) {
    const meta = get(type);
    if (!meta) return { type: String(type || ""), domain: "Unknown", family: "unknown", label: "Unknown operation", review: "blocked" };
    return { type: String(type), ...meta };
  }

  window.CMXContinuumPlannerContractV1 = Object.freeze({
    version: 1,
    operations: OPERATIONS,
    knownTypes,
    get,
    describe,
    validateOperations
  });

  document.documentElement.dataset.labPlannerContract = "v1";
})();