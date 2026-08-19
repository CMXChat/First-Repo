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

  const PREFLIGHT_ISSUES = Object.freeze({
    "directory.ambiguous_match": Object.freeze({
      domain: "Directory", severity: "check", label: "Ambiguous identity match", resolution: "preview-choice",
      options: Object.freeze([
        { id: "use-existing", label: "Use existing match" },
        { id: "create-separate", label: "Keep separate" }
      ])
    }),
    "directory.identity_check_required": Object.freeze({
      domain: "Directory", severity: "blocked", label: "Protected identity check required", resolution: "server"
    }),
    "directory.audience_required": Object.freeze({
      domain: "Directory", severity: "check", label: "Audience still required", resolution: "draft"
    }),
    "automation.schedule_unconfirmed": Object.freeze({
      domain: "Automations", severity: "check", label: "Timing needs confirmation", resolution: "draft"
    }),
    "runtime.required": Object.freeze({
      domain: "Runtime", severity: "blocked", label: "Runtime required", resolution: "locked"
    }),
    "library.service_required": Object.freeze({
      domain: "Library", severity: "blocked", label: "Protected Library service required", resolution: "server"
    }),
    "connections.required": Object.freeze({
      domain: "Connections", severity: "blocked", label: "Connection required", resolution: "locked"
    }),
    "authority.approval_required": Object.freeze({
      domain: "Authority", severity: "approval", label: "Explicit approval required", resolution: "approval"
    }),
    "planner.dependency_invalid": Object.freeze({
      domain: "Planner", severity: "blocked", label: "Invalid plan dependency", resolution: "locked"
    }),
    "planner.review_required": Object.freeze({
      domain: "Planner", severity: "check", label: "Review required", resolution: "server"
    })
  });

  const knownTypes = Object.freeze(Object.keys(OPERATIONS));
  const knownIssueCodes = Object.freeze(Object.keys(PREFLIGHT_ISSUES));
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
  const ISSUE_SEVERITY_LABELS = Object.freeze({
    check: "CHECK REQUIRED",
    blocked: "BLOCKED",
    approval: "APPROVAL REQUIRED"
  });

  const asList = value => Array.isArray(value) ? value.filter(Boolean).map(String) : [];
  const isTempRef = value => String(value || "").startsWith("temp:");

  function get(type) {
    return OPERATIONS[String(type || "")] || null;
  }

  function getIssue(code) {
    return PREFLIGHT_ISSUES[String(code || "")] || null;
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

  function classifyIssue(message) {
    const text = String(message || "").trim();
    const q = text.toLowerCase();
    let code = "planner.review_required";

    if (/dependency validation|plan dependency/.test(q)) code = "planner.dependency_invalid";
    else if (/ambiguous people|ambiguous organization|ambiguous .*match/.test(q)) code = "directory.ambiguous_match";
    else if (/audience.*still need|audiences.*still need|needs a protected directory selection|need protected directory selections/.test(q)) code = "directory.audience_required";
    else if (/exact schedule|exact .*time.*confirmation|schedule\/time.*confirmation/.test(q)) code = "automation.schedule_unconfirmed";
    else if (/inter-step wait.*runtime|requires future runtime|runtime.*before execution|runtime.*unavailable|runtime\/provider execution/.test(q)) code = "runtime.required";
    else if (/library mutations|protected library services|library service/.test(q)) code = "library.service_required";
    else if (/connection.*required|missing connection/.test(q)) code = "connections.required";
    else if (/approval required|explicit approval/.test(q)) code = "authority.approval_required";
    else if (/duplicate resolution|identity matching|people\/organization matching|protected audience identity|server directory services|real people.*matching/.test(q)) code = "directory.identity_check_required";

    return describeIssue(code, text);
  }

  function validateIssues(issues) {
    const list = Array.isArray(issues) ? issues : [];
    const unknown = list.map(issue => String(issue?.code || "")).filter(code => !PREFLIGHT_ISSUES[code]);
    return { ok: unknown.length === 0, count: list.length, unknown: [...new Set(unknown)] };
  }

  function effectLabel(effect) {
    return EFFECT_LABELS[String(effect || "")] || "CHANGE";
  }

  function reviewLabel(review) {
    return REVIEW_LABELS[String(review || "")] || "REVIEW";
  }

  function issueSeverityLabel(severity) {
    return ISSUE_SEVERITY_LABELS[String(severity || "")] || "REVIEW";
  }

  function describe(type) {
    const meta = get(type);
    if (!meta) return {
      type: String(type || ""), domain: "Unknown", family: "unknown", label: "Unknown operation",
      effect: "unknown", effectLabel: "UNKNOWN", review: "blocked", reviewLabel: "BLOCKED"
    };
    return { type: String(type), ...meta, effectLabel: effectLabel(meta.effect), reviewLabel: reviewLabel(meta.review) };
  }

  function describeIssue(code, message = "") {
    const meta = getIssue(code);
    if (!meta) return {
      code: String(code || "planner.review_required"), domain: "Planner", severity: "check",
      severityLabel: "CHECK REQUIRED", label: "Review required", resolution: "server", options: [], message: String(message || "")
    };
    return {
      code: String(code),
      ...meta,
      options: Array.isArray(meta.options) ? meta.options.map(option => ({ ...option })) : [],
      severityLabel: issueSeverityLabel(meta.severity),
      message: String(message || "")
    };
  }

  window.CMXContinuumPlannerContractV1 = Object.freeze({
    version: 1,
    operations: OPERATIONS,
    preflightIssues: PREFLIGHT_ISSUES,
    knownTypes,
    knownIssueCodes,
    get,
    getIssue,
    describe,
    describeIssue,
    classifyIssue,
    validateOperations,
    validatePlan,
    validateIssues,
    effectLabel,
    reviewLabel,
    issueSeverityLabel,
    isTempRef
  });

  document.documentElement.dataset.labPlannerContract = "v1";
})();