(() => {
  "use strict";

  const OPERATIONS = Object.freeze({
    "directory.match_or_create_people": Object.freeze({ domain: "Directory", family: "identity", label: "Match or create People", effect: "resolve", review: "conditional" }),
    "directory.match_people": Object.freeze({ domain: "Directory", family: "identity", label: "Match People", effect: "resolve", review: "conditional" }),
    "directory.match_organizations": Object.freeze({ domain: "Directory", family: "identity", label: "Match Organizations", effect: "resolve", review: "conditional" }),
    "directory.apply_label": Object.freeze({ domain: "Directory", family: "organization", label: "Apply Label", effect: "link", review: "low-risk" }),
    "directory.upsert_group": Object.freeze({ domain: "Directory", family: "audience", label: "Create or update Group", effect: "create-update", review: "low-risk" }),
    "directory.upsert_membership": Object.freeze({ domain: "Directory", family: "relationship", label: "Create or update membership", effect: "link-update", review: "conditional" }),
    "directory.upsert_relationship": Object.freeze({ domain: "Directory", family: "relationship", label: "Create or update relationship", effect: "link-update", review: "conditional" }),

    "library.create_folder": Object.freeze({ domain: "Library", family: "structure", label: "Create folder", effect: "create", review: "low-risk" }),
    "library.create_document": Object.freeze({ domain: "Library", family: "content", label: "Create document Draft", effect: "create", review: "low-risk" }),

    "automation.create_draft": Object.freeze({ domain: "Automations", family: "definition", label: "Create Automation Draft", effect: "create", review: "low-risk" }),
    "automation.set_trigger": Object.freeze({ domain: "Automations", family: "definition", label: "Set Trigger", effect: "update", review: "low-risk" }),
    "automation.set_preconditions": Object.freeze({ domain: "Automations", family: "definition", label: "Set pre-action Conditions", effect: "update", review: "low-risk" }),
    "automation.add_action": Object.freeze({ domain: "Automations", family: "definition", label: "Add Action", effect: "update", review: "conditional" }),
    "automation.add_condition": Object.freeze({ domain: "Automations", family: "sequence", label: "Add inter-step Condition", effect: "update", review: "conditional" }),
    "automation.add_wait": Object.freeze({ domain: "Automations", family: "sequence", label: "Add inter-step WAIT", effect: "update", review: "conditional" }),
    "automation.set_finish": Object.freeze({ domain: "Automations", family: "definition", label: "Set Finish policy", effect: "update", review: "low-risk" }),
    "automation.reference_audience": Object.freeze({ domain: "Automations", family: "reference", label: "Reference Directory Audience", effect: "link", review: "conditional" }),
    "automation.reference_content": Object.freeze({ domain: "Automations", family: "reference", label: "Reference Library content", effect: "link", review: "conditional" })
  });

  const knownTypes = Object.freeze(Object.keys(OPERATIONS));
  const EFFECT_LABELS = Object.freeze({
    resolve: "RESOLVE",
    create: "CREATE",
    update: "UPDATE",
    link: "LINK",
    "create-update": "CREATE / UPDATE",
    "link-update": "LINK / UPDATE"
  });
  const REVIEW_LABELS = Object.freeze({
    "low-risk": "STANDARD REVIEW",
    conditional: "CHECK REQUIRED",
    required: "APPROVAL REQUIRED",
    blocked: "BLOCKED"
  });

  const asList = value => Array.isArray(value) ? value.filter(Boolean).map(String) : [];
  const isTempRef = value => String(value || "").startsWith("temp:");

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

  function validatePlan(operations) {
    const list = Array.isArray(operations) ? operations : [];
    const errors = [];
    const seenIds = new Set();
    const produced = new Map();

    list.forEach((operation, index) => {
      const id = String(operation?.id || `op-${index + 1}`);
      const type = String(operation?.type || "");
      const dependsOn = asList(operation?.dependsOn);
      const uses = asList(operation?.uses);
      const produces = operation?.produces ? String(operation.produces) : "";

      if (!OPERATIONS[type]) errors.push({ code: "unknown_operation", operationId: id, type });
      if (seenIds.has(id)) errors.push({ code: "duplicate_operation_id", operationId: id });

      dependsOn.forEach(dependencyId => {
        if (!seenIds.has(dependencyId)) errors.push({ code: "dependency_not_earlier", operationId: id, dependencyId });
      });

      uses.filter(isTempRef).forEach(ref => {
        if (!produced.has(ref)) errors.push({ code: "temp_ref_not_available", operationId: id, ref });
      });

      if (produces) {
        if (!isTempRef(produces)) errors.push({ code: "plan_ref_must_be_temporary", operationId: id, ref: produces });
        else if (produced.has(produces)) errors.push({ code: "duplicate_temp_ref", operationId: id, ref: produces });
        else produced.set(produces, id);
      }

      seenIds.add(id);
    });

    return {
      ok: errors.length === 0,
      count: list.length,
      errors,
      produced: Object.fromEntries(produced)
    };
  }

  function effectLabel(effect) {
    return EFFECT_LABELS[String(effect || "")] || "CHANGE";
  }

  function reviewLabel(review) {
    return REVIEW_LABELS[String(review || "")] || "REVIEW";
  }

  function describe(type) {
    const meta = get(type);
    if (!meta) return {
      type: String(type || ""),
      domain: "Unknown",
      family: "unknown",
      label: "Unknown operation",
      effect: "unknown",
      effectLabel: "UNKNOWN",
      review: "blocked",
      reviewLabel: "BLOCKED"
    };
    return {
      type: String(type),
      ...meta,
      effectLabel: effectLabel(meta.effect),
      reviewLabel: reviewLabel(meta.review)
    };
  }

  window.CMXContinuumPlannerContractV1 = Object.freeze({
    version: 1,
    operations: OPERATIONS,
    knownTypes,
    get,
    describe,
    validateOperations,
    validatePlan,
    effectLabel,
    reviewLabel,
    isTempRef
  });

  document.documentElement.dataset.labPlannerContract = "v1";
})();