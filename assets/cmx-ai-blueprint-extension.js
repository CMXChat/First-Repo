(() => {
  "use strict";

  const data = window.CMX_BACKEND_BLUEPRINT;
  if (!data) return;

  const ep = (method, path, family, phase, access, status, purpose, pages = [], options = {}) => ({
    id: `${method}-${path}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    method,
    path,
    family,
    phase,
    access,
    status,
    purpose,
    pages,
    database: options.database || "No",
    background: options.background || "No",
    request: options.request || "No request body.",
    response: options.response || { status: "server-defined" },
    dependencies: options.dependencies || ["Python API route", "Typed request and response schema", "Policy checks"],
    security: options.security || ["Authenticate where required", "Validate typed input", "Rate limit", "Return safe errors", "Audit state-changing actions"]
  });

  const specs = [
    ["GET", "/api/ai/capabilities", "AI Control", "AI foundation", "Authenticated", "Approved", "Return only the AI capabilities available to the current user and environment.", ["/ai/", "/", "Future assistant surfaces"]],
    ["GET", "/api/ai/policies", "AI Control", "AI foundation", "Authenticated", "Approved", "Return readable AI action, approval, retention and blocked-behavior rules.", ["/ai/", "/backend/"]],
    ["GET", "/api/ai/models", "AI Control", "AI foundation", "Operator", "Future", "List approved model profiles and permitted purposes without exposing provider credentials.", ["/ai/", "Future AI settings"]],
    ["POST", "/api/ai/sessions", "AI Control", "AI foundation", "Authenticated", "Future", "Create a controlled AI conversation for development, operations or an approved user feature.", ["/ai/", "Future assistant surfaces"], { database: "Yes", request: { purpose: "development_or_user_assistance", workspace_id: "optional", mode: "approved_mode" }, response: { id: "session_id", status: "active", policy_version: "version" } }],
    ["GET", "/api/ai/sessions/{session_id}", "AI Control", "AI foundation", "Owner or administrator", "Future", "Return one permitted AI session and safe transcript state.", ["/ai/", "Future assistant surfaces"], { database: "Yes" }],
    ["POST", "/api/ai/sessions/{session_id}/messages", "AI Control", "AI foundation", "Owner", "Future", "Accept a normal-language instruction and return an answer, plan or proposed action.", ["/ai/", "/", "Future page copilots"], { database: "Yes", background: "Optional", request: { message: "Plain-language request", attachments: [], context_scope: "approved" }, response: { message_id: "message_id", response_type: "answer_or_plan", request_id: "optional" }, security: ["Classify intent before tools", "Prompt text is never permission", "Limit content and tokens", "Defend against prompt injection", "Audit proposed tools"] }],
    ["POST", "/api/ai/sessions/{session_id}/cancel", "AI Control", "AI foundation", "Owner", "Future", "Stop active generation and request cancellation of cancellable child work.", ["/ai/"], { database: "Yes", background: "Optional" }],
    ["POST", "/api/ai/requests", "AI Orchestration", "AI foundation", "Authenticated", "Approved", "Turn a normal-language goal into a tracked request before any tool or repository action occurs.", ["/ai/", "/", "Future assistant surfaces"], { database: "Yes", request: { goal: "Requested outcome", scope: "site_or_workspace", attachments: [] }, response: { id: "request_id", status: "classifying", risk_tier: "pending" }, security: ["Record the original request", "Do not execute during creation", "Apply identity, scope and size limits"] }],
    ["GET", "/api/ai/requests/{request_id}", "AI Orchestration", "AI foundation", "Owner or administrator", "Approved", "Return the plan, actions, approvals, progress and safe results for one AI request.", ["/ai/", "Future assistant surfaces"], { database: "Yes" }],
    ["GET", "/api/ai/requests/{request_id}/events", "AI Orchestration", "AI foundation", "Owner", "Future", "Stream safe progress events for planning, checks, previews and approved actions.", ["/ai/", "Future assistant surfaces"], { background: "Yes", response: "Server-sent events with allowlisted event types.", security: ["Ownership check", "No raw command output", "Limit event size and rate"] }],
    ["POST", "/api/ai/requests/{request_id}/approve", "AI Orchestration", "AI foundation", "Owner with required capability", "Approved", "Approve a specific versioned plan or action set after its targets and effects are displayed.", ["/ai/", "Future approval dialogs"], { database: "Yes", request: { plan_version: 1, approved_actions: ["action_id"], confirmation_text: "required_when_sensitive" }, response: { approval_id: "approval_id", status: "approved" }, security: ["Approval is scoped, versioned and temporary", "Show exact target or diff", "Production approval stays separate", "Audit actor and decision"] }],
    ["POST", "/api/ai/requests/{request_id}/cancel", "AI Orchestration", "AI foundation", "Owner or administrator", "Approved", "Cancel a planned or active AI request and its cancellable child jobs.", ["/ai/"], { database: "Yes", background: "Optional" }],
    ["POST", "/api/ai/context/search", "AI Context", "AI foundation", "Capability-specific", "Approved", "Search the approved handbook, route registry, documentation and permitted repository files.", ["/ai/", "/backend/", "Development assistant"], { database: "Retrieval index optional", request: { query: "Context question", scopes: ["handbook", "repo:first-repo"], limit: 10 }, response: { results: [{ source_id: "source_id", excerpt: "safe excerpt", revision: "sha" }] }, security: ["Scope allowlist", "Exclude secrets and environment files", "Cite source revision", "Limit returned content"] }],
    ["POST", "/api/ai/feedback", "AI Control", "User-facing AI", "Authenticated", "Future", "Record feedback about an AI answer, plan or completed action.", ["/ai/", "Future assistant surfaces"], { database: "Yes" }],

    ["GET", "/api/handbook/version", "Project Handbook", "AI foundation", "Authenticated", "Approved", "Return the handbook revision and indexing state used by AI.", ["/ai/", "/architecture/", "/backend/"]],
    ["POST", "/api/handbook/search", "Project Handbook", "AI foundation", "Authenticated", "Approved", "Search approved handbook sections covering architecture, routes, standards, workflows and learning notes.", ["/ai/", "/architecture/", "Development assistant"], { database: "Search index optional", request: { query: "How should staging work?", sections: ["architecture", "deployment"] } }],
    ["POST", "/api/handbook/refresh", "Project Handbook", "AI development", "Administrator", "Deferred", "Re-index the handbook after an approved Git commit changes it.", ["/ai/", "Future administration interface"], { database: "Index metadata", background: "Yes", security: ["Approved repository only", "Commit must exist", "No arbitrary URL imports", "Audit refresh"] }],

    ["GET", "/api/dev/repositories", "AI Development", "AI development", "Developer capability", "Approved", "List repositories approved for AI-assisted development and the operations allowed for each.", ["/ai/", "Development assistant"], { database: "Configuration" }],
    ["GET", "/api/dev/repositories/{repository_id}/tree", "AI Development", "AI development", "Developer capability", "Approved", "Return a safe repository tree for an approved immutable revision.", ["/ai/", "Development assistant"], { security: ["Repository allowlist", "Exclude secrets, binaries and protected paths", "Read limits", "Immutable revision"] }],
    ["GET", "/api/dev/repositories/{repository_id}/files/{file_id}", "AI Development", "AI development", "Developer capability", "Approved", "Read one allowlisted text file by server-issued identifier and revision.", ["/ai/", "Development assistant"], { security: ["No user-supplied filesystem path", "Text allowlist", "Maximum file size", "Audit protected reads"] }],
    ["POST", "/api/dev/tasks", "AI Development", "AI development", "Developer capability", "Approved", "Create a tracked development task from a normal-language feature request without changing code.", ["/ai/", "Development assistant"], { database: "Yes", request: { repository_id: "first-repo", goal: "Feature request", base_ref: "main" }, response: { id: "task_id", status: "planning", base_sha: "sha" }, security: ["Approved repository only", "Record immutable base SHA", "No writes during creation"] }],
    ["POST", "/api/dev/tasks/{task_id}/plan", "AI Development", "AI development", "Developer capability", "Approved", "Generate a versioned implementation plan, affected files, checks and risks for review.", ["/ai/", "Development assistant"], { database: "Yes", background: "Optional", security: ["Planning cannot execute tools", "Cite source files", "Flag protected paths"] }],
    ["POST", "/api/dev/branches", "AI Development", "AI development", "Developer capability with approval", "Approved", "Create a feature branch from the approved immutable base commit.", ["/ai/", "Development assistant"], { database: "Task record", request: { task_id: "task_id", base_sha: "sha", branch_name: "agent/description", plan_version: 1 }, security: ["Never write to main", "Base SHA must match approval", "Repository allowlist", "Audit branch creation"] }],
    ["POST", "/api/dev/changesets", "AI Development", "AI development", "Developer capability with approval", "Approved", "Write a proposed and reviewable file changeset to the approved feature branch.", ["/ai/", "Development assistant"], { database: "Yes", background: "Optional", security: ["Branch-only writes", "Elevated approval for workflow, deployment and policy files", "Diff limits", "Audit every file"] }],
    ["POST", "/api/dev/sandboxes", "AI Development", "AI development", "Developer capability", "Approved", "Create a short-lived isolated Docker sandbox for an approved task revision.", ["/ai/", "Development assistant"], { database: "Yes", background: "Yes", security: ["No host Docker socket", "No sudo", "Restricted network", "CPU, memory and time limits", "Automatic deletion"] }],
    ["POST", "/api/dev/sandboxes/{sandbox_id}/checks", "AI Development", "AI development", "Developer capability", "Approved", "Run only approved test, lint, build and security profiles inside the sandbox.", ["/ai/", "Development assistant"], { database: "Yes", background: "Yes", request: { checks: ["html", "javascript", "python", "security"], revision: "sha" }, security: ["No arbitrary command strings", "Allowlisted check profiles", "Output limits", "No production network"] }],
    ["GET", "/api/dev/sandboxes/{sandbox_id}/logs", "AI Development", "AI development", "Task owner or administrator", "Approved", "Return filtered sandbox logs and check results for debugging.", ["/ai/", "Development assistant"], { database: "Log references", security: ["Redact tokens and internal paths", "No interactive terminal", "Ownership check", "Retention limit"] }],
    ["POST", "/api/dev/previews", "AI Development", "AI development", "Developer capability with approval", "Approved", "Deploy an approved branch revision to a protected preview or staging slot.", ["/ai/", "Development assistant"], { database: "Yes", background: "Yes", security: ["Protected URL", "Separate data and secrets", "Automatic preview expiry", "No production credentials"] }],
    ["POST", "/api/dev/pull-requests", "AI Development", "AI development", "Developer capability with approval", "Approved", "Open a draft pull request containing the plan, checks, risks and review notes.", ["/ai/", "Development assistant"], { database: "Task and pull request reference", security: ["Draft by default", "No automatic merge", "Approved base branch", "Audit provider action"] }],
    ["POST", "/api/dev/deployment-requests", "AI Development", "AI development", "Production approver", "Approved", "Create a production deployment request after review and staging validation without deploying directly.", ["/ai/", "/build/", "Development assistant"], { database: "Yes", request: { release_sha: "reviewed_sha", staging_deployment_id: "deployment_id", rollback_sha: "known_good_sha" }, response: { id: "deployment_request_id", status: "awaiting_human_approval" }, security: ["AI cannot approve itself", "Separate production credential boundary", "Explicit human approval", "Audit and rollback"] }],

    ["GET", "/api/tools/catalog", "AI Tool Runtime", "AI foundation", "Authenticated", "Approved", "Return allowlisted tools, schemas, risk tiers and confirmation requirements for the current user.", ["/ai/", "Future assistant surfaces"]],
    ["POST", "/api/tools/{tool_id}/invoke", "AI Tool Runtime", "User-facing AI", "Capability-specific", "Future", "Invoke one typed and allowlisted application tool for an AI session or authenticated user.", ["/ai/", "Future page copilots", "Connected pages"], { database: "Audit required", background: "Optional", security: ["Tool ID allowlist", "Typed arguments", "Record ownership", "Confirm writes", "Quotas and timeouts"] }],
    ["POST", "/api/commands/parse", "AI Tool Runtime", "User-facing AI", "Authenticated", "Future", "Translate a normal-language command into a non-executing structured intent and proposed tool plan.", ["/ai/", "/", "Future command palette"], { request: { text: "Check registered routes and show failures", context: "current_page" }, response: { intent: "routes.check", proposed_actions: [], executes: false }, security: ["Parsing never executes", "Unknown intents fail closed", "Show interpreted scope"] }],

    ["GET", "/api/mcp/servers/{server_id}/tools", "MCP", "MCP and AI", "Administrator", "Deferred", "Return the reviewed tools exposed by one approved MCP server.", ["/ai/", "/backend/", "Future MCP administration"]],
    ["POST", "/api/mcp/servers/{server_id}/test", "MCP", "MCP and AI", "Administrator", "Deferred", "Test an approved MCP server connection without invoking a business action.", ["/ai/", "Future MCP administration"], { database: "Audit required", security: ["Administrator only", "Approved server only", "No arbitrary endpoint", "Safe diagnostic output"] }],
    ["POST", "/api/mcp/servers/{server_id}/disable", "MCP", "MCP and AI", "Administrator with reauthentication", "Deferred", "Disable one MCP server and prevent new tool invocations.", ["/ai/", "Future MCP administration"], { database: "Audit required" }],

    ["POST", "/api/assistants", "User AI", "User-facing AI", "Administrator", "Deferred", "Create a configured assistant profile for an approved site use case and tool set.", ["/ai/", "Future administration interface"], { database: "Yes", security: ["Administrator configuration", "No embedded secrets", "Tool allowlist", "Disabled until reviewed"] }],
    ["POST", "/api/assistants/{assistant_id}/conversations", "User AI", "User-facing AI", "Authenticated", "Deferred", "Start a user-facing conversation with an approved assistant profile.", ["Future assistant page", "Future page copilots"], { database: "Yes" }],
    ["POST", "/api/assistants/{assistant_id}/conversations/{conversation_id}/messages", "User AI", "User-facing AI", "Conversation owner", "Deferred", "Send a message to an approved assistant and receive an answer or proposed tool action.", ["Future assistant page", "Future page copilots"], { database: "Yes", background: "Optional", security: ["Assistant-specific tools", "Prompt-injection defenses", "No cross-workspace context", "Confirm state changes"] }],
    ["POST", "/api/assistants/actions/{action_id}/approve", "User AI", "User-facing AI", "Action owner", "Deferred", "Approve a clearly displayed assistant action before it changes data or invokes an external system.", ["Future assistant page", "Future page copilots"], { database: "Yes", security: ["Show exact effect", "Expire approvals", "Ownership and capability check", "Audit result"] }],

    ["GET", "/api/automations", "AI Automation", "Automation", "Authenticated", "Deferred", "List only automations the current user may view or manage.", ["/ai/", "Future automation interface"], { database: "Yes" }],
    ["POST", "/api/automations", "AI Automation", "Automation", "Operator", "Deferred", "Create an approved scheduled or condition-polled workflow from a structured plan.", ["/ai/", "Future automation interface"], { database: "Yes", security: ["No arbitrary code", "Allowlisted triggers and tools", "Disabled by default", "Budgets, quotas and cancellation"] }],
    ["POST", "/api/automations/{automation_id}/run", "AI Automation", "Automation", "Owner with capability", "Deferred", "Run one approved automation manually with a recorded trigger and safe execution plan.", ["/ai/", "Future automation interface"], { database: "Yes", background: "Yes", security: ["Ownership check", "Concurrency limits", "Policy check every step", "Emergency stop"] }],

    ["GET", "/api/admin/ai/usage", "AI Administration", "AI operations", "Administrator", "Deferred", "Return model, tool, latency, error and cost summaries by approved profile and capability.", ["/ai/", "/build/", "Future administration interface"], { database: "Yes", security: ["Administrator only", "No prompt contents by default", "Redact user data"] }],
    ["POST", "/api/admin/ai/policy-tests", "AI Administration", "AI operations", "Administrator", "Deferred", "Run approved regression tests against AI policies and tool permissions using synthetic staging data.", ["/ai/", "/build/", "Future administration interface"], { background: "Optional", security: ["Staging only", "Synthetic data", "No provider writes"] }],
    ["POST", "/api/admin/ai/emergency-stop", "AI Administration", "AI operations", "Administrator with reauthentication", "Approved", "Disable AI tool execution and automations while preserving read-only documentation and manual administration.", ["/ai/", "/build/", "Future administration interface"], { database: "Audit required", request: { reason: "Required incident reason", scope: "all_tools_or_selected" }, security: ["Strong reauthentication", "Immediate server enforcement", "AI cannot reverse it", "Audit and alert"] }]
  ];

  const aiEndpoints = specs.map(spec => ep(...spec));
  data.endpoints.push(...aiEndpoints);

  data.pagePlans["/ai/"] = {
    mode: "AI control blueprint",
    summary: "Focused plan for normal-language development, controlled tool use, user-facing assistants, sandboxed changes, approvals, previews, automations and AI operations.",
    endpoints: ["GET /api/ai/capabilities", "POST /api/ai/requests", "POST /api/ai/sessions/{session_id}/messages", "POST /api/dev/tasks", "POST /api/tools/{tool_id}/invoke"]
  };

  data.capabilities.push(
    { title: "AI orchestration", text: "Convert normal-language goals into tracked plans, approvals and safe actions." },
    { title: "AI-assisted development", text: "Read approved repository context, create branches, propose changes, run sandbox checks and prepare previews and pull requests." },
    { title: "User-facing assistants", text: "Give authorized users answers and typed site actions through reviewed assistant profiles." }
  );

  data.models.push(
    { name: "AISession", purpose: "Controlled conversation linked to a user, purpose, model profile and optional workspace.", fields: ["id", "user_id", "workspace_id", "mode", "policy_version", "status", "created_at", "expires_at"] },
    { name: "AIRequest", purpose: "Tracks a normal-language goal, risk classification, versioned plan, actions and outcome.", fields: ["id", "session_id", "goal", "risk_tier", "plan_version", "status", "created_at", "completed_at"] },
    { name: "AIApproval", purpose: "Time-limited approval for a specific versioned plan or action set.", fields: ["id", "request_id", "approved_by", "scope", "plan_version", "expires_at", "used_at"] },
    { name: "DevelopmentTask", purpose: "Connects a feature request to its repository, branch, checks, preview and pull request.", fields: ["id", "request_id", "repository_id", "base_sha", "branch", "head_sha", "status"] },
    { name: "SandboxRun", purpose: "Records an isolated check environment, revision, results and expiration.", fields: ["id", "task_id", "revision", "profile", "status", "result_reference", "expires_at"] },
    { name: "AssistantProfile", purpose: "Defines a reviewed user assistant purpose, audience, instructions and tool allowlist.", fields: ["id", "name", "purpose", "audience", "model_profile", "tool_ids", "status"] },
    { name: "Automation", purpose: "Stores an approved trigger, typed steps, quotas, ownership and enabled state.", fields: ["id", "owner_id", "workspace_id", "trigger", "steps", "status", "next_run_at"] },
    { name: "AIUsageEvent", purpose: "Tracks model, tool, latency, token, cost and outcome data without prompt contents by default.", fields: ["id", "user_id", "profile", "capability", "tokens", "cost", "latency_ms", "outcome", "created_at"] }
  );

  data.relationships.push(
    "User → AISessions → AIRequests",
    "AIRequest → AIApprovals → approved actions",
    "AIRequest → DevelopmentTask → branch, sandbox, preview and pull request",
    "AssistantProfile → approved tools",
    "Automation → allowlisted tool steps",
    "Every AI action → AuditEvent and AIUsageEvent"
  );

  data.roleMatrix.push(
    { capability: "Ask approved AI for answers and plans", viewer: true, operator: true, admin: true },
    { capability: "Approve AI actions affecting owned records", viewer: "By action", operator: true, admin: true },
    { capability: "Create development branches and changesets", viewer: false, operator: "Developer capability", admin: true },
    { capability: "Deploy protected previews or staging", viewer: false, operator: "Deployment capability", admin: true },
    { capability: "Approve production deployment", viewer: false, operator: false, admin: "Separate approver" },
    { capability: "Configure assistants, models, MCP and AI policies", viewer: false, operator: false, admin: true },
    { capability: "Use AI emergency stop", viewer: false, operator: false, admin: "Reauthentication" }
  );

  data.decisions.approved.push(
    "Normal-language requests become tracked and versioned plans before tools run.",
    "AI development uses approved repositories, feature branches, isolated sandboxes, protected previews and draft pull requests.",
    "User-facing assistants receive separate purposes, audiences, context scopes and tool allowlists.",
    "AI production deployment always requires separate human approval and rollback preparation."
  );
  data.decisions.blocked.push(
    "AI self-approval, direct main-branch writes, automatic merge or production deployment.",
    "Interactive shell access, Docker socket access, sudo or prompt-supplied arbitrary commands."
  );
  data.decisions.deferred.push(
    "User-facing assistant rollout after identity, permissions, tool runtime and audit controls are proven.",
    "AI automation after quotas, cancellation, emergency stop and usage accounting are reliable."
  );

  data.aiPlan = {
    framework: {
      preferred: "FastAPI",
      position: "Preferred initial backend, subject to implementation review before server work begins.",
      reason: "It matches the Python learning goal, typed APIs, Jinja migration path, async services, automatic API documentation and Docker deployment plan.",
      substitutionRule: "A different Python ASGI framework may replace it only when the same API contracts, security boundaries, testing, staging workflow and deployment controls are preserved."
    },
    pillars: [
      { title: "Natural-language control", text: "A user describes a feature, question or operation in ordinary language. The AI converts it into a visible plan before requesting tools." },
      { title: "Project understanding", text: "The AI reads an approved handbook, route registry and allowlisted repository files at known Git revisions." },
      { title: "Controlled development", text: "The AI creates feature branches, proposes changes and opens draft pull requests. It never edits the production branch directly." },
      { title: "Sandboxed verification", text: "Tests, builds, linting and security checks run through fixed profiles inside short-lived Docker sandboxes." },
      { title: "Human approval", text: "Writes, external actions, staging previews and production requests require the approval tier defined for that action." },
      { title: "User-facing intelligence", text: "Approved assistants may answer questions, use site context and call typed backend tools for authorized users." },
      { title: "Integration layer", text: "External APIs and MCP servers are exposed through capability-specific adapters with server-held credentials." },
      { title: "Operations and recovery", text: "Usage limits, logs, health checks, cancellation, emergency stop, backups and rollback keep the system controllable." }
    ],
    workflow: [
      "Describe the goal in plain English.",
      "Create a tracked AI request and classify its intent and risk.",
      "Retrieve only approved handbook and repository context.",
      "Show a versioned plan, affected files, tools, risks and tests.",
      "Request scoped approval when the plan includes a write or external action.",
      "Create a feature branch from an immutable base commit.",
      "Write a reviewable changeset on that branch.",
      "Run approved checks in an isolated Docker sandbox.",
      "Deploy a protected preview or staging revision.",
      "Open a draft pull request with checks and review notes.",
      "Create a production deployment request only after staging validation.",
      "Deploy production only after explicit human approval, with rollback prepared."
    ],
    surfaces: [
      { name: "AI Control Center", route: "/ai/", purpose: "Planning, sessions, requests, approvals, development tasks, previews, usage and policy status." },
      { name: "Root terminal launcher", route: "/", purpose: "Open approved pages and submit structured normal-language requests. It is never a real shell." },
      { name: "Page copilots", route: "Selected pages", purpose: "Use current-page context and only the tools approved for that page and user." },
      { name: "Development assistant", route: "/ai/#development", purpose: "Plan code, branch, edit, check, preview and prepare pull requests." },
      { name: "User assistants", route: "Future assistant page", purpose: "Help authenticated users through approved conversations and site actions." },
      { name: "Administration", route: "/build/ and future admin", purpose: "Health, providers, policy tests, usage, emergency stop, deployments and rollback." }
    ],
    riskTiers: [
      { tier: "Tier 0", label: "Answer", examples: "Explain code, architecture or documentation.", approval: "No action approval" },
      { tier: "Tier 1", label: "Read", examples: "Search handbook, inspect approved files, view status.", approval: "Capability and ownership checks" },
      { tier: "Tier 2", label: "Draft", examples: "Create a plan, report draft or proposed changeset.", approval: "Review before persistence or provider write" },
      { tier: "Tier 3", label: "Controlled write", examples: "Create branch, save workspace data, open draft pull request.", approval: "Explicit scoped approval" },
      { tier: "Tier 4", label: "External or deployment action", examples: "Invoke connector write, deploy staging, request production.", approval: "Strong confirmation and audit" },
      { tier: "Tier 5", label: "Blocked", examples: "Unrestricted shell, sudo, raw production secrets, arbitrary code, direct production deployment.", approval: "Unavailable" }
    ],
    userCapabilities: [
      "Ask questions using approved site and workspace context.",
      "Summarize authorized records, files, reports and activity.",
      "Generate drafts, checklists, reports and structured plans.",
      "Run typed site tools through permissions and confirmations.",
      "Save work to an authorized workspace.",
      "Create approved recurring workflows with limits and cancellation.",
      "Receive progress from real jobs without seeing hidden infrastructure.",
      "Provide feedback and review every proposed state-changing action."
    ],
    hardBoundaries: [
      "No unrestricted shell, sudo, Docker socket or host filesystem access.",
      "No production secrets, raw environment variables or database credentials in AI context.",
      "No arbitrary Python, JavaScript, command strings, URLs, MCP servers or provider methods supplied by prompts.",
      "No direct writes to main and no automatic pull request merge.",
      "No direct production deployment or self-approval by AI.",
      "No cross-user or cross-workspace context without explicit permission.",
      "No sensitive information in browser localStorage.",
      "Every tool call is typed, allowlisted, rate-limited, attributable and cancellable where possible."
    ]
  };

  function escapeHtml(value = "") {
    const node = document.createElement("div");
    node.textContent = String(value);
    return node.innerHTML;
  }

  function injectAISection() {
    const tabs = document.querySelector(".section-tabs");
    const decisions = document.querySelector('[data-section="decisions"]');
    if (!tabs || !decisions || document.querySelector('[data-target="ai"]')) return;

    const tab = document.createElement("button");
    tab.type = "button";
    tab.className = "tab";
    tab.dataset.target = "ai";
    tab.textContent = "AI Control";
    tabs.insertBefore(tab, tabs.querySelector('[data-target="decisions"]'));

    const section = document.createElement("section");
    section.className = "blueprint-section";
    section.id = "ai";
    section.dataset.section = "ai";
    section.hidden = true;
    section.innerHTML = `
      <div class="section-heading"><div><p class="eyebrow">Natural-language operations</p><h2>AI control plane and development workflow</h2><p>The AI layer is a controlled client of approved APIs, GitHub actions, MCP tools and sandbox services. It does not receive a shell or production authority.</p></div></div>
      <div class="overview-grid">
        <article class="panel emphasis-card"><span class="card-kicker">Preferred foundation</span><h3>${escapeHtml(data.aiPlan.framework.preferred)}</h3><p>${escapeHtml(data.aiPlan.framework.position)}</p></article>
        <article class="panel"><span class="card-kicker">Why</span><h3>Python-first learning and delivery</h3><p>${escapeHtml(data.aiPlan.framework.reason)}</p></article>
        <article class="panel"><span class="card-kicker">Framework flexibility</span><h3>Contracts come first</h3><p>${escapeHtml(data.aiPlan.framework.substitutionRule)}</p></article>
        <article class="panel"><span class="card-kicker">Current truth</span><h3>Planning only</h3><p>No AI control endpoint, sandbox, MCP server or deployment service is active yet.</p></article>
      </div>
      <article class="panel" style="margin-top:14px;padding:24px"><div class="panel-heading"><div><p class="eyebrow">Core architecture</p><h3>Eight AI pillars</h3></div></div><div class="capability-grid">${data.aiPlan.pillars.map(item => `<article class="capability-card"><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.text)}</p></article>`).join("")}</div></article>
      <article class="panel" style="margin-top:14px;padding:24px"><div class="panel-heading"><div><p class="eyebrow">End-to-end delivery</p><h3>Plain English to reviewed production</h3></div></div><div class="roadmap-timeline">${data.aiPlan.workflow.map((step, index) => `<article class="roadmap-phase"><div class="phase-number">${String(index + 1).padStart(2, "0")}</div><div class="phase-main"><h3>${escapeHtml(step)}</h3></div><div class="deliverables"><span class="deliverable">Tracked, permissioned and auditable</span></div></article>`).join("")}</div></article>
      <div class="two-column">
        <article class="panel"><div class="panel-heading"><div><p class="eyebrow">Interfaces</p><h3>Where AI appears</h3></div></div><div class="status-list">${data.aiPlan.surfaces.map(item => `<div class="status-row"><span>${escapeHtml(item.name)}<br><small>${escapeHtml(item.route)}</small></span><strong>${escapeHtml(item.purpose)}</strong></div>`).join("")}</div></article>
        <article class="panel"><div class="panel-heading"><div><p class="eyebrow">Risk model</p><h3>Approval tiers</h3></div></div><div class="status-list">${data.aiPlan.riskTiers.map(item => `<div class="status-row"><span>${escapeHtml(item.tier)} · ${escapeHtml(item.label)}<br><small>${escapeHtml(item.examples)}</small></span><strong>${escapeHtml(item.approval)}</strong></div>`).join("")}</div></article>
      </div>
      <div class="decision-columns" style="margin-top:14px">
        <article class="panel approved"><div class="panel-heading"><div><p class="eyebrow">User value</p><h3>What approved AI can do</h3></div></div><div class="decision-list">${data.aiPlan.userCapabilities.map(item => `<div class="decision-item">${escapeHtml(item)}</div>`).join("")}</div></article>
        <article class="panel blocked"><div class="panel-heading"><div><p class="eyebrow">Hard boundaries</p><h3>What remains unavailable</h3></div></div><div class="decision-list">${data.aiPlan.hardBoundaries.map(item => `<div class="decision-item">${escapeHtml(item)}</div>`).join("")}</div></article>
        <article class="panel deferred"><div class="panel-heading"><div><p class="eyebrow">Focused page</p><h3>AI Control Center</h3></div></div><p>The dedicated <code>/ai/</code> page explains the AI experience and control model. The complete endpoint contracts remain here in the Backend Blueprint.</p><a class="secondary-button" href="/ai/">Open AI Blueprint</a></article>
      </div>`;
    decisions.parentNode.insertBefore(section, decisions);
  }

  document.addEventListener("DOMContentLoaded", injectAISection);
})();
