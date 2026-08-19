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
    effectLabel,
    reviewLabel
  });

  document.documentElement.dataset.labPlannerContract = "v1";
})();