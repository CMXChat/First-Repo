(() => {
  "use strict";

  const ep = (method, path, family, phase, access, status, purpose, pages, options = {}) => ({
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
    dependencies: options.dependencies || ["FastAPI route", "Typed request and response schema"],
    security: options.security || ["Authenticate where required", "Validate input", "Return safe errors", "Rate limit"]
  });

  const endpoints = [
    ep("GET", "/health", "Core", "Foundation", "Edge protected", "Approved", "Confirm that the FastAPI process is responding without exposing sensitive system details.", ["/build/", "/backend/"], {
      response: { status: "ok", service: "cmx-backend", version: "server-defined" },
      dependencies: ["FastAPI application", "Cloudflare Tunnel", "Structured logging"],
      security: ["Return minimal information", "Rate limit", "Do not expose hostnames, secrets or dependency versions"]
    }),
    ep("GET", "/api/version", "Core", "Foundation", "Viewer", "Approved", "Return the deployed application version, build reference and API contract version.", ["/build/", "/updates/", "/backend/"], {
      response: { application: "cmx-backend", release: "2026.x", contract: "v1", environment: "staging" },
      dependencies: ["Build metadata", "Environment configuration"],
      security: ["Do not expose internal paths", "Use approved release identifiers"]
    }),
    ep("GET", "/api/environment", "Core", "Foundation", "Operator", "Approved", "Report the current environment and safe capability flags.", ["/build/", "/backend/"], {
      response: { environment: "staging", features: { database: false, jobs: false, connectors: false } },
      dependencies: ["Typed configuration", "Feature flag policy"],
      security: ["Expose capabilities, not secrets", "Keep detailed diagnostics administrator-only"]
    }),
    ep("GET", "/api/routes", "Routes", "Foundation", "Viewer", "Approved", "Return the official CMX route registry through a validated API contract.", ["/", "/directory/", "/build/", "/backend/"], {
      database: "No initially",
      request: "Optional category, status and visibility filters.",
      response: { version: 1, routes: [{ path: "/directory/", status: "Active", visibility: "Directory-visible" }] },
      dependencies: ["Route schema", "Current JSON registry", "Validation tests"],
      security: ["Never return hidden server paths", "Validate every registry entry"]
    }),
    ep("POST", "/api/routes/check", "Routes", "Core application", "Operator", "Approved", "Check allowlisted CMX routes and return availability, response time and redirects.", ["/build/", "/backend/"], {
      database: "Optional audit record",
      background: "Optional",
      request: { routes: ["/directory/", "/metadata/"], checks: ["status", "redirects", "timing"] },
      response: { checked: 2, available: 2, failed: 0, results: [] },
      dependencies: ["Allowlisted route service", "Timeout policy", "Audit logging"],
      security: ["Only registered CMX paths", "No arbitrary URL fetching", "Limit concurrency and redirects"]
    }),
    ep("GET", "/api/me", "Identity", "Foundation", "Authenticated", "Approved", "Return the current CMX identity, role and safe session information.", ["/", "/directory/", "/build/", "/backend/", "Future authenticated pages"], {
      database: "User profile optional",
      request: "Identity comes from trusted access headers and the application session.",
      response: { id: "user_id", email: "operator@example.com", role: "operator", permissions: [] },
      dependencies: ["Cloudflare Access", "Session middleware", "User and role policy"],
      security: ["Validate trusted proxy headers", "Secure HTTP-only cookies", "Never trust a browser-supplied role"]
    }),
    ep("POST", "/api/session/logout", "Identity", "Foundation", "Authenticated", "Approved", "End the application session and clear server-managed state.", ["All authenticated pages"], {
      database: "Session store optional",
      request: "CSRF-protected request.",
      response: { logged_out: true },
      dependencies: ["Session middleware", "CSRF protection"],
      security: ["Invalidate server session", "Clear cookies with matching security attributes"]
    }),
    ep("GET", "/api/updates", "Operations", "Core application", "Viewer", "Approved", "Return approved platform updates, deployment notes and milestones.", ["/updates/", "/build/"], {
      database: "Optional initially",
      request: "Optional type, date and environment filters.",
      response: { updates: [{ id: "update_id", title: "Release note", published_at: "ISO-8601" }] },
      dependencies: ["Update schema", "Editorial approval workflow"],
      security: ["Separate general notes from administrator notes", "Escape rendered content"]
    }),
    ep("GET", "/api/deployments", "Operations", "Operations", "Operator", "Approved", "Show approved staging and production deployment records.", ["/build/", "/backend/"], {
      database: "Yes",
      request: "Optional environment and date filters.",
      response: { deployments: [{ environment: "staging", release: "sha", status: "succeeded" }] },
      dependencies: ["Deployment records", "Release workflow integration"],
      security: ["Read-only for operators", "No credentials, raw secrets or runner details"]
    }),
    ep("GET", "/api/workspaces", "Workspaces", "Persistence", "Viewer", "Approved", "List only workspaces the current user may view.", ["Future workspace interface", "/internal/", "/project/", "/callmax/", "/ovaro/"], {
      database: "Yes",
      request: "Pagination, status and ownership filters.",
      response: { items: [{ id: "workspace_id", name: "Workspace", role: "owner" }], next_cursor: null },
      dependencies: ["PostgreSQL", "Workspace model", "Ownership checks"],
      security: ["Filter at query level", "Do not rely on hidden frontend links"]
    }),
    ep("POST", "/api/workspaces", "Workspaces", "Persistence", "Operator", "Approved", "Create a controlled workspace for related notes, jobs, files and reports.", ["Future workspace interface"], {
      database: "Yes",
      request: { name: "Workspace name", description: "Purpose", classification: "internal" },
      response: { id: "workspace_id", created_at: "ISO-8601", owner_id: "user_id" },
      dependencies: ["PostgreSQL", "Workspace schema", "Audit events"],
      security: ["Validate classification", "Record creator", "Apply default ownership"]
    }),
    ep("GET", "/api/workspaces/{workspace_id}", "Workspaces", "Persistence", "Viewer", "Approved", "Return one permitted workspace and safe summary data.", ["Future workspace interface"], {
      database: "Yes",
      request: "Workspace identifier in the path.",
      response: { id: "workspace_id", name: "Workspace", counts: { jobs: 0, files: 0, reports: 0 } },
      dependencies: ["Workspace query service", "Ownership policy"],
      security: ["Return 404 for inaccessible records", "Avoid leaking record existence"]
    }),
    ep("PATCH", "/api/workspaces/{workspace_id}", "Workspaces", "Persistence", "Operator or owner", "Approved", "Update approved workspace fields.", ["Future workspace interface"], {
      database: "Yes",
      request: { name: "Optional", description: "Optional", status: "Optional" },
      response: { id: "workspace_id", updated_at: "ISO-8601" },
      dependencies: ["Workspace service", "Audit events", "Concurrency policy"],
      security: ["Field validation", "Ownership check", "Safe change record"]
    }),
    ep("GET", "/api/jobs", "Jobs", "Persistence", "Viewer", "Approved", "List permitted processing jobs and their real status.", ["Future operations interface", "/build/"], {
      database: "Yes",
      background: "Yes",
      request: "Pagination and filters for workspace, type, status and date.",
      response: { items: [{ id: "job_id", type: "route_check", status: "complete" }] },
      dependencies: ["Job model", "Worker queue", "Ownership checks"],
      security: ["Do not expose secret job payloads", "Filter by user or workspace"]
    }),
    ep("POST", "/api/jobs", "Jobs", "Persistence", "Operator", "Approved", "Submit an allowlisted server operation with a typed payload.", ["Future operations interface", "Connected tool pages"], {
      database: "Yes",
      background: "Yes",
      request: { workspace_id: "optional", type: "allowlisted_job_type", input: {} },
      response: { id: "job_id", status: "queued", created_at: "ISO-8601" },
      dependencies: ["Worker queue", "Job registry", "Payload schemas", "Quotas"],
      security: ["No arbitrary commands", "No arbitrary Python", "Validate job type", "Per-user limits"]
    }),
    ep("GET", "/api/jobs/{job_id}", "Jobs", "Persistence", "Viewer", "Approved", "Return the safe state and output summary for one job.", ["Future operations interface", "Connected tool pages"], {
      database: "Yes",
      background: "Yes",
      request: "Job identifier in the path.",
      response: { id: "job_id", status: "running", progress: 40, result: null, error: null },
      dependencies: ["Job store", "Result serializer"],
      security: ["Ownership check", "Redact provider data", "Limit result size"]
    }),
    ep("POST", "/api/jobs/{job_id}/cancel", "Jobs", "Persistence", "Operator or owner", "Future", "Request safe cancellation of a queued or cancellable job.", ["Future operations interface"], {
      database: "Yes",
      background: "Yes",
      request: { reason: "Optional operator note" },
      response: { id: "job_id", cancellation_requested: true },
      dependencies: ["Worker cancellation policy", "Idempotency"],
      security: ["Ownership check", "Do not kill shared processes", "Audit cancellation"]
    }),
    ep("POST", "/api/files", "Files", "Tool connections", "Operator", "Future", "Accept an approved file for temporary processing or controlled workspace storage.", ["/metadata/", "Future workspace interface"], {
      database: "Metadata record",
      background: "Optional",
      request: "Multipart upload plus purpose and optional workspace ID.",
      response: { id: "file_id", status: "accepted", expires_at: "ISO-8601 or null" },
      dependencies: ["Upload limits", "Malware scanning", "Private storage", "Retention policy"],
      security: ["Allowlist types", "Verify content", "Rename server-side", "Never execute uploads", "Delete temporary files"]
    }),
    ep("GET", "/api/files/{file_id}", "Files", "Tool connections", "Viewer or owner", "Future", "Return safe file metadata and processing state.", ["/metadata/", "Future workspace interface"], {
      database: "Yes",
      background: "Optional",
      request: "File identifier in the path.",
      response: { id: "file_id", name: "safe-name.ext", size: 0, status: "processed" },
      dependencies: ["File record", "Storage adapter", "Ownership policy"],
      security: ["Ownership check", "Signed downloads only", "No disk paths"]
    }),
    ep("POST", "/api/metadata/analyze", "Tool APIs", "Tool connections", "Operator", "Future", "Run deeper server-side metadata extraction when browser processing is insufficient.", ["/metadata/"], {
      database: "Optional job and audit records",
      background: "Optional",
      request: { file_id: "uploaded file ID", profile: "safe_metadata" },
      response: { job_id: "job_id", status: "queued" },
      dependencies: ["File service", "Sandboxed workers", "Result schema"],
      security: ["Isolate processing", "CPU, memory and time limits", "No default file retention"]
    }),
    ep("POST", "/api/phone/validate", "Tool APIs", "Tool connections", "Operator", "Future", "Normalize and validate phone numbers consistently.", ["/phone/"], {
      request: { phone: "+1...", default_region: "US" },
      response: { valid: true, e164: "+1...", country: "US", type: "mobile_or_fixed" },
      dependencies: ["Phone parsing library", "Input schema"],
      security: ["Do not save by default", "Rate limit bulk validation"]
    }),
    ep("POST", "/api/phone/enrich", "Integrations", "Approved integrations", "Operator", "Deferred", "Query an approved phone intelligence provider using server-held credentials.", ["/phone/"], {
      database: "Audit required",
      background: "Optional",
      request: { phone: "+1...", provider: "approved_provider", workspace_id: "required" },
      response: { job_id: "job_id", status: "queued" },
      dependencies: ["Approved provider", "Cost controls", "Connector service", "Audit log"],
      security: ["Explicit purpose", "Provider allowlist", "PII retention controls", "No silent bulk enrichment"]
    }),
    ep("GET", "/api/research/sessions", "Research", "Persistence", "Viewer", "Future", "List authorized research sessions with minimal summaries.", ["/search/", "/osint/", "/missing/"], {
      database: "Yes",
      request: "Pagination plus workspace and status filters.",
      response: { items: [{ id: "session_id", title: "Research session", status: "open" }] },
      dependencies: ["Research session model", "Workspace ownership"],
      security: ["Treat contents as sensitive", "Default private", "No indexed or public share URLs"]
    }),
    ep("POST", "/api/research/sessions", "Research", "Persistence", "Operator", "Future", "Create an authorized record for research notes, queries and evidence references.", ["/search/", "/osint/", "/missing/"], {
      database: "Yes",
      request: { workspace_id: "required", title: "Session title", purpose: "Lawful purpose" },
      response: { id: "session_id", created_at: "ISO-8601" },
      dependencies: ["Workspace service", "Research schema", "Audit logging"],
      security: ["Require purpose", "Restrict sharing", "Minimize PII", "Deletion and retention policy"]
    }),
    ep("POST", "/api/research/sessions/{session_id}/queries", "Research", "Persistence", "Operator or owner", "Future", "Save a query definition and notes without pretending the backend performed an external search.", ["/search/", "/missing/"], {
      database: "Yes",
      request: { label: "Query label", query: "Search expression", notes: "Optional" },
      response: { id: "query_id", saved_at: "ISO-8601" },
      dependencies: ["Research session service", "PII policy"],
      security: ["Ownership check", "Escape content", "Do not auto-execute external searches"]
    }),
    ep("POST", "/api/reports", "Reports", "Reporting", "Operator", "Future", "Create a structured report from approved workspace records.", ["Future workspace interface", "/project/", "/callmax/", "/ovaro/"], {
      database: "Yes",
      background: "Optional",
      request: { workspace_id: "required", title: "Report title", sections: [] },
      response: { id: "report_id", status: "draft" },
      dependencies: ["Report model", "Template renderer", "Workspace permissions"],
      security: ["Only permitted records", "Audit exports", "Sanitize rendered content"]
    }),
    ep("GET", "/api/reports/{report_id}", "Reports", "Reporting", "Viewer", "Future", "Return an authorized report draft or final report.", ["Future workspace interface"], {
      database: "Yes",
      request: "Report identifier in the path.",
      response: { id: "report_id", title: "Report", status: "draft", sections: [] },
      dependencies: ["Report service", "Ownership policy"],
      security: ["Permission check", "No predictable public links", "Track sensitive access"]
    }),
    ep("POST", "/api/reports/{report_id}/exports", "Reports", "Reporting", "Operator or owner", "Deferred", "Generate an approved export such as PDF.", ["Future workspace interface"], {
      database: "Yes",
      background: "Yes",
      request: { format: "pdf", classification: "internal" },
      response: { job_id: "job_id", status: "queued" },
      dependencies: ["Export worker", "PDF renderer", "Temporary storage"],
      security: ["Classification label", "Signed temporary download", "Audit export"]
    }),
    ep("GET", "/api/connectors", "Integrations", "Approved integrations", "Operator", "Deferred", "List configured integrations and capabilities without credentials.", ["Future integrations interface", "/backend/"], {
      database: "Yes",
      request: "Optional type and status filters.",
      response: { items: [{ id: "connector_id", name: "Provider", status: "available", capabilities: [] }] },
      dependencies: ["Connector registry", "Secret manager", "Health policy"],
      security: ["Never return tokens", "Separate configured from authorized", "Limit health detail"]
    }),
    ep("POST", "/api/connectors/{connector_id}/invoke", "Integrations", "Approved integrations", "Operator", "Deferred", "Invoke one allowlisted connector capability through a typed contract.", ["Future integrations interface", "Connected tool pages"], {
      database: "Audit required",
      background: "Optional",
      request: { capability: "allowlisted_action", input: {}, workspace_id: "when saved" },
      response: { job_id: "job_id", status: "queued_or_complete" },
      dependencies: ["Connector adapter", "Secret manager", "Capability schemas", "Quotas"],
      security: ["No arbitrary methods", "Per-capability permissions", "Audit outcome", "Redact provider response"]
    }),
    ep("GET", "/api/mcp/servers", "MCP", "MCP and AI", "Administrator", "Deferred", "List administrator-approved MCP servers and exposed tool names.", ["Future MCP administration interface", "/backend/"], {
      database: "Yes",
      response: { items: [{ id: "mcp_id", name: "Server", status: "disabled", tools: [] }] },
      dependencies: ["MCP client service", "Server allowlist", "Credential storage", "Tool policy"],
      security: ["Administrator-only configuration", "Disable unknown servers", "Review every tool"]
    }),
    ep("POST", "/api/mcp/servers/{server_id}/tools/{tool_name}", "MCP", "MCP and AI", "Capability-specific", "Deferred", "Call a specifically approved MCP tool after server, tool, user and input validation.", ["Future controlled assistant or operations interface"], {
      database: "Audit required",
      background: "Optional",
      request: { arguments: {}, workspace_id: "optional", confirmation_token: "for sensitive actions" },
      response: { job_id: "job_id", status: "queued_or_complete" },
      dependencies: ["MCP policy engine", "Confirmation workflow", "Tool schemas", "Audit log"],
      security: ["No unrestricted discovery", "Confirm writes", "No prompt-controlled privilege changes", "Limit output and time"]
    }),
    ep("GET", "/api/admin/system", "Administration", "Operations", "Administrator", "Approved", "Return restricted dependency health and safe operational diagnostics.", ["/build/", "Future administration interface"], {
      database: "Optional",
      response: { application: "healthy", database: "connected", worker: "healthy", storage: "healthy" },
      dependencies: ["Dependency health checks", "Administrator role"],
      security: ["Administrator only", "No environment variables", "No raw stack traces"]
    }),
    ep("GET", "/api/admin/audit-events", "Administration", "Operations", "Administrator", "Approved", "Search append-only audit events for security and operational review.", ["Future administration interface", "/build/"], {
      database: "Yes",
      request: "Actor, action, workspace, outcome and time filters.",
      response: { items: [{ id: "event_id", actor_id: "user_id", action: "workspace.created", outcome: "success" }] },
      dependencies: ["Audit event model", "Retention policy", "Indexed queries"],
      security: ["Administrator only", "Append-only policy", "Redact payload fields", "Monitor audit access"]
    })
  ];

  const pagePlans = {
    "/": ["Optional backend connection", "Keep the terminal lightweight. Replace browser password logic with real identity and use the server only for safe status, route and user information.", ["GET /api/me", "GET /api/routes", "GET /api/version"]],
    "/directory/": ["Core backend connection", "Read the validated route registry from FastAPI while retaining a static fallback.", ["GET /api/routes", "GET /api/me"]],
    "/osint/": ["Mostly browser-only", "Keep local workflows in the browser. Add server support only for saved research or approved integrations.", ["GET /api/research/sessions", "POST /api/research/sessions", "POST /api/connectors/{connector_id}/invoke"]],
    "/phone/": ["Hybrid later", "Local parsing remains useful. Server validation and provider enrichment become separate audited capabilities.", ["POST /api/phone/validate", "POST /api/phone/enrich"]],
    "/metadata/": ["Hybrid later", "Browser extraction stays the default. Server processing is reserved for approved files and sandboxed deeper analysis.", ["POST /api/files", "GET /api/files/{file_id}", "POST /api/metadata/analyze", "GET /api/jobs/{job_id}"]],
    "/resources/": ["Static only", "A curated reference library does not need a backend unless editorial management is added.", []],
    "/missing/": ["Optional backend connection", "The workflow remains static. Authorized sessions and notes may be stored later with strict privacy controls.", ["POST /api/research/sessions", "POST /api/research/sessions/{session_id}/queries"]],
    "/search/": ["Optional backend connection", "Query building stays local. Persistence is useful only inside approved workspaces.", ["GET /api/research/sessions", "POST /api/research/sessions", "POST /api/research/sessions/{session_id}/queries"]],
    "/build/": ["Core backend connection", "This becomes the view for real health, releases, deployments, route checks and restricted system status.", ["GET /health", "GET /api/version", "GET /api/environment", "POST /api/routes/check", "GET /api/deployments", "GET /api/admin/system"]],
    "/architecture/": ["Static only", "Keep the architecture explanation as documentation. It may read release information but should not administer the system.", ["GET /api/version"]],
    "/backend/": ["Static source of truth", "Documents contracts and reads the current route registry. Later it may show read-only implementation status.", ["GET /api/version", "GET /api/environment", "GET /api/routes", "GET /api/connectors", "GET /api/mcp/servers"]],
    "/updates/": ["Core backend connection", "Move approved update entries from a JavaScript file to a controlled read API.", ["GET /api/updates", "GET /api/version"]],
    "/internal/": ["Workspace migration candidate", "Internal planning belongs in permissioned workspaces before sensitive data is added.", ["GET /api/workspaces", "GET /api/workspaces/{workspace_id}"]],
    "/project/": ["Workspace migration candidate", "Client project material should move behind real authorization and ownership.", ["GET /api/workspaces/{workspace_id}", "POST /api/reports"]],
    "/callmax/": ["Workspace migration candidate", "Treat this as a future client workspace with audit records and controlled reports.", ["GET /api/workspaces/{workspace_id}", "POST /api/reports", "GET /api/reports/{report_id}"]],
    "/ovaro/": ["Workspace migration candidate", "Internal Ovaro planning can become a permissioned workspace when persistence exists.", ["GET /api/workspaces/{workspace_id}", "POST /api/reports"]],
    "/collab1/": ["Static experiment", "No backend connection while this remains an experimental agency concept.", []],
    "/collab2/": ["Static experiment", "No backend connection while this remains an experimental agency concept.", []],
    "/collab3/": ["Static experiment", "No backend connection while this remains an experimental agency concept.", []],
    "/services/": ["Static only", "Service positioning is content. Commercial lead handling belongs on the main CMX site.", []],
    "/seo/": ["Browser-only unless approved", "Keep calculations local. Saving quotes or client records requires a separate business data decision.", []],
    "/entry/": ["Legacy", "Retain only for compatibility until links are removed. Do not invest in backend connections.", []],
    "/404.html": ["Static only", "The fallback remains static. FastAPI should later return it without exposing application errors.", []]
  };

  Object.keys(pagePlans).forEach(path => {
    const [mode, summary, linkedEndpoints] = pagePlans[path];
    pagePlans[path] = { mode, summary, endpoints: linkedEndpoints };
  });

  window.CMX_BACKEND_BLUEPRINT = {
    version: "1.0.0",
    updated: "2026-08-01",
    state: {
      frontend: "Active static site",
      backend: "Not deployed",
      fastapi: "Planned",
      linux: "Environment setup planned",
      database: "Not connected",
      cloudflareAccess: "Planned",
      staging: "Planned",
      productionApi: "Offline"
    },
    capabilities: [
      { title: "Identity", text: "Verify users through Cloudflare Access and server-side sessions." },
      { title: "Persistence", text: "Save approved workspaces, jobs, notes, reports and audit records in PostgreSQL." },
      { title: "Controlled processing", text: "Run Python services for work that cannot or should not happen in the browser." },
      { title: "Approved integrations", text: "Connect external APIs and MCP servers through server-held credentials and permissions." },
      { title: "Background work", text: "Handle longer operations through a worker queue without exposing a shell." },
      { title: "Accountability", text: "Record who requested an action, what changed and whether it succeeded." }
    ],
    endpoints,
    pagePlans,
    infrastructure: [
      { order: 1, name: "Browser", status: "Current", purpose: "Renders HTML, CSS and JavaScript. Keeps local-only tools local.", controls: ["No secrets", "CSP", "No sensitive localStorage"] },
      { order: 2, name: "Cloudflare edge", status: "Planned", purpose: "Provides DNS, TLS, WAF and rate controls.", controls: ["HTTPS", "WAF", "Rate controls"] },
      { order: 3, name: "Cloudflare Access", status: "Planned", purpose: "Confirms approved identity before private traffic reaches the origin.", controls: ["Identity policy", "MFA", "Short-lived assertions"] },
      { order: 4, name: "Cloudflare Tunnel", status: "Planned", purpose: "Connects the edge to the private Linux service without a public inbound origin port.", controls: ["Restricted routes", "Health monitoring", "Private origin"] },
      { order: 5, name: "Linux host and Docker", status: "Planned", purpose: "Runs isolated application, worker and support services with automatic restarts.", controls: ["Non-root", "Resource limits", "Updates", "Backups"] },
      { order: 6, name: "FastAPI application", status: "Planned", purpose: "Serves pages, validates APIs, applies permissions and coordinates services.", controls: ["Typed schemas", "Secure sessions", "CSRF", "Logs"] },
      { order: 7, name: "Worker service", status: "Later", purpose: "Runs allowlisted longer jobs outside the web request process.", controls: ["Job allowlist", "Limits", "Retries", "Cancellation"] },
      { order: 8, name: "PostgreSQL", status: "Later", purpose: "Stores users, workspaces, jobs, reports, routes and audit events.", controls: ["Least privilege", "Migrations", "Backups", "Retention"] },
      { order: 9, name: "Redis or queue", status: "Optional later", purpose: "Supports sessions, rate limits, caching and job coordination if justified.", controls: ["Private network", "Authentication", "Eviction policy"] },
      { order: 10, name: "Object storage", status: "Optional later", purpose: "Stores approved files and generated reports outside the application container.", controls: ["Private buckets", "Signed access", "Scanning", "Deletion"] },
      { order: 11, name: "Logs and backups", status: "Required", purpose: "Makes failures, access and recovery visible without exposing raw sensitive data.", controls: ["Central logs", "Audit events", "Restore tests", "Rollback"] }
    ],
    environments: [
      { name: "Development", purpose: "Codespaces or Dev Container work on branches.", deploy: "Manual local start", data: "Synthetic or non-sensitive", access: "Developer only" },
      { name: "Staging", purpose: "Protected preview for tests and approval.", deploy: "Approved staging workflow", data: "Separate test database", access: "Cloudflare Access" },
      { name: "Production", purpose: "Approved live restricted node.", deploy: "Production approval required", data: "Production database and storage", access: "Access plus app roles" }
    ],
    controls: [
      "Secrets live in environment variables or a secret manager, never in public HTML or JavaScript.",
      "Production deployments require approval and a documented rollback path.",
      "Every API validates input through typed schemas and returns consistent errors.",
      "Sensitive actions create audit events with actor, action, outcome and time.",
      "Arbitrary URLs, commands, Python code and filesystem paths are not accepted from users.",
      "Uploads are limited, scanned, isolated and deleted according to retention rules.",
      "Database access is scoped by role and record ownership, not hidden links.",
      "Backups are encrypted and restore procedures are tested."
    ],
    applicationTree: `app/
├── main.py                 # FastAPI entry
├── core/
│   ├── config.py           # environment configuration
│   ├── security.py         # sessions, roles and CSRF
│   ├── logging.py          # structured logs
│   └── errors.py           # consistent API errors
├── routers/
│   ├── pages.py            # static and Jinja pages
│   ├── core.py             # health, version, environment
│   ├── routes.py           # registry and route checks
│   ├── identity.py         # current user and logout
│   ├── workspaces.py       # permissioned workspaces
│   ├── jobs.py             # approved background work
│   ├── files.py            # controlled file lifecycle
│   ├── reports.py          # reports and exports
│   └── admin.py            # restricted operations
├── services/               # business logic and adapters
├── models/                 # database tables
├── schemas/                # API contracts
├── workers/                # allowlisted jobs
├── templates/              # Jinja pages when needed
└── static/                 # CSS, JS and images
migrations/
scripts/
tests/
Dockerfile
compose.yaml
pyproject.toml
README.md`,
    models: [
      { name: "User", purpose: "Application identity linked to an approved access identity.", fields: ["id", "email", "display_name", "status", "created_at", "last_seen_at"] },
      { name: "Role", purpose: "Permission group such as viewer, operator or administrator.", fields: ["id", "name", "permissions", "created_at"] },
      { name: "Workspace", purpose: "Permissioned container for related work, jobs, files and reports.", fields: ["id", "name", "description", "classification", "owner_id", "status", "created_at", "updated_at"] },
      { name: "WorkspaceMember", purpose: "Connects users to workspaces with a workspace-specific role.", fields: ["workspace_id", "user_id", "role", "created_at"] },
      { name: "Job", purpose: "Tracks an approved operation from request through completion.", fields: ["id", "workspace_id", "type", "status", "requested_by", "input_reference", "result_reference", "started_at", "completed_at"] },
      { name: "FileRecord", purpose: "Stores safe metadata and lifecycle information for an approved file.", fields: ["id", "workspace_id", "owner_id", "safe_name", "content_type", "size", "storage_key", "retention_until", "status"] },
      { name: "ResearchSession", purpose: "Groups authorized research notes and saved query definitions.", fields: ["id", "workspace_id", "title", "purpose", "status", "created_by", "created_at"] },
      { name: "Report", purpose: "Structured draft or final output linked to a workspace.", fields: ["id", "workspace_id", "title", "status", "content", "created_by", "created_at", "updated_at"] },
      { name: "Connector", purpose: "Approved API or MCP configuration without exposed credentials.", fields: ["id", "name", "type", "status", "capabilities", "secret_reference", "created_at"] },
      { name: "RouteRecord", purpose: "Validated server representation of the CMX route registry.", fields: ["path", "name", "category", "status", "visibility", "gated", "updated_at"] },
      { name: "Deployment", purpose: "Records an approved release to staging or production.", fields: ["id", "environment", "release", "status", "approved_by", "deployed_at", "rollback_release"] },
      { name: "AuditEvent", purpose: "Append-only security and operational record.", fields: ["id", "actor_id", "action", "resource_type", "resource_id", "outcome", "safe_metadata", "created_at"] }
    ],
    relationships: ["User → Role", "User → WorkspaceMember → Workspace", "Workspace → Jobs", "Workspace → FileRecords", "Workspace → ResearchSessions", "Workspace → Reports", "Job → approved service or connector", "Deployment → approving User", "Every sensitive action → AuditEvent"],
    permissionLayers: [
      { title: "1. Cloudflare Access", text: "Blocks unapproved identities before the private origin is reached." },
      { title: "2. Application session", text: "FastAPI establishes the user with secure cookies and trusted identity assertions." },
      { title: "3. Capability permission", text: "The endpoint checks whether the role may perform this class of action." },
      { title: "4. Record ownership", text: "Database queries confirm access to the specific workspace, file, job or report." }
    ],
    roleMatrix: [
      { capability: "View approved directory and documentation", viewer: true, operator: true, admin: true },
      { capability: "View owned or shared workspaces", viewer: true, operator: true, admin: true },
      { capability: "Create and update workspaces", viewer: false, operator: true, admin: true },
      { capability: "Run approved processing jobs", viewer: false, operator: true, admin: true },
      { capability: "Upload approved files", viewer: false, operator: true, admin: true },
      { capability: "Use approved external connectors", viewer: false, operator: "By capability", admin: true },
      { capability: "Create report exports", viewer: false, operator: "By workspace", admin: true },
      { capability: "View system health and deployments", viewer: false, operator: "Limited", admin: true },
      { capability: "Manage users, roles and connectors", viewer: false, operator: false, admin: true },
      { capability: "Read audit events", viewer: false, operator: false, admin: true }
    ],
    roadmap: [
      { phase: "Phase 0", name: "Static preparation", state: "Current", objective: "Clean and define the platform before server work begins.", deliverables: ["Backend Blueprint", "One route registry", "Production-only deploy directory", "README and environment docs", "Archive unsafe experiments"] },
      { phase: "Phase 1", name: "Secure runtime", state: "Next", objective: "Put a minimal FastAPI service on a protected Linux environment.", deliverables: ["Dockerized FastAPI", "Cloudflare Access and Tunnel", "Health, version and environment APIs", "Staging deployment", "Production approval"] },
      { phase: "Phase 2", name: "Core application", state: "Planned", objective: "Connect identity, route data and operational status.", deliverables: ["Current user API", "Route registry API", "Allowlisted route checks", "Updates API", "Structured logs", "Consistent errors"] },
      { phase: "Phase 3", name: "Persistence", state: "Planned", objective: "Introduce PostgreSQL after data and ownership rules are approved.", deliverables: ["Users and roles", "Workspaces", "Jobs", "Research sessions", "Audit events", "Migrations and backups"] },
      { phase: "Phase 4", name: "Tool connections", state: "Later", objective: "Connect selected pages where server processing creates clear value.", deliverables: ["Controlled files", "Sandboxed metadata", "Phone validation", "Reports", "Worker queue", "Retention controls"] },
      { phase: "Phase 5", name: "Approved integrations", state: "Deferred", objective: "Add external APIs, MCP and AI behind explicit permissions.", deliverables: ["Connector registry", "Secret manager", "Cost controls", "MCP policy", "Write confirmation", "Provider review"] }
    ],
    readiness: ["Purpose and owning page are defined", "Request schema is documented", "Response and error schemas are documented", "Access and ownership are approved", "Retention and audit rules are decided", "Abuse cases and rate limits are reviewed", "Tests exist before production", "Staging validation and rollback are complete"],
    decisions: {
      approved: ["FastAPI is the first backend foundation.", "GitHub remains the source of truth.", "Branches and protected staging come before production.", "Production deployment requires approval.", "Cloudflare Access and Tunnel protect the origin.", "Secrets remain server-side.", "Static pages migrate gradually.", "Every server operation is allowlisted and validated.", "Sensitive actions create audit events."],
      blocked: ["Browser-only passwords for sensitive pages.", "Unrestricted Linux shell or arbitrary commands.", "Endpoints that fetch any user-supplied URL.", "Arbitrary Python execution from the browser or AI chat.", "Credentials in public JavaScript, HTML or the repository.", "Sensitive data in localStorage.", "Automatic production deployment of every push.", "MCP tools without server and tool allowlists."],
      deferred: ["Astro after the backend foundation is stable.", "Redis when sessions, queues or caching justify it.", "Object storage when approved files require it.", "AI workflows after identity and tool permissions exist.", "MCP connectors after security and business review.", "Advanced automation after jobs, quotas, logging and cancellation are reliable."]
    }
  };
})();
