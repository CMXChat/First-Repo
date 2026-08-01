(() => {
  "use strict";

  const data = window.CMX_BACKEND_BLUEPRINT;
  if (!data || !data.aiPlan) return;

  data.infrastructure.push(
    {
      order: 12,
      name: "Model gateway",
      status: "Later",
      purpose: "Routes approved AI requests to configured model profiles while enforcing provider, cost, timeout and data policies.",
      controls: ["Server-held credentials", "Model profiles", "Cost limits", "Timeouts", "Fallback policy"]
    },
    {
      order: 13,
      name: "AI policy and tool runtime",
      status: "Later",
      purpose: "Classifies risk, checks capabilities, validates typed tool arguments and requires confirmation for protected actions.",
      controls: ["Risk tiers", "Tool allowlist", "Typed schemas", "Approvals", "Emergency stop"]
    },
    {
      order: 14,
      name: "GitHub and MCP adapters",
      status: "Later",
      purpose: "Expose narrowly scoped repository and integration capabilities without giving prompts raw credentials or unrestricted provider access.",
      controls: ["Repository allowlist", "Tool allowlist", "Scoped tokens", "Confirmation", "Audit"]
    },
    {
      order: 15,
      name: "Sandbox and preview service",
      status: "Later",
      purpose: "Runs approved code checks in short-lived containers and deploys protected preview revisions with separate data and secrets.",
      controls: ["No host socket", "Restricted network", "Resource limits", "Expiry", "Staging isolation"]
    },
    {
      order: 16,
      name: "Automation scheduler",
      status: "Deferred",
      purpose: "Runs approved scheduled or condition-polled workflows through the same typed tool and permission system.",
      controls: ["Disabled by default", "Quotas", "Cancellation", "Per-step policy", "Ownership"]
    },
    {
      order: 17,
      name: "AI telemetry and cost ledger",
      status: "Required before rollout",
      purpose: "Tracks model usage, tool calls, latency, errors, cost and outcomes without storing full prompt contents by default.",
      controls: ["Redaction", "Budgets", "Alerts", "Retention", "Administrator review"]
    }
  );

  data.controls.push(
    "AI instructions are treated as requests, never as authorization.",
    "Every AI tool is registered with a typed schema, risk tier, capability requirement and confirmation rule.",
    "Repository writes occur only on approved feature branches from immutable base commits.",
    "Sandbox checks use fixed profiles and never accept a prompt-supplied shell command.",
    "AI cannot approve its own production deployment, disable audit logging or reverse the emergency stop.",
    "Model, MCP and provider credentials remain outside prompts, browser code, logs and repository content."
  );

  data.permissionLayers.push(
    {
      title: "5. Action approval",
      text: "The server confirms the exact versioned plan, target and effect before a protected write or external action."
    },
    {
      title: "6. Environment boundary",
      text: "Development, sandbox, staging and production have separate credentials, data and deployment authority."
    }
  );

  data.readiness.push(
    "AI policy, model and tool registries are versioned and testable",
    "Repository scopes and protected paths are documented",
    "Sandbox images, resource limits and network rules are approved",
    "Preview and staging deployments cannot access production secrets",
    "Production approval is separate from AI and staging credentials",
    "Usage budgets, cancellation and emergency stop are tested",
    "Prompt-injection and cross-workspace isolation tests pass",
    "Every assistant has a purpose, audience, context scope, tool allowlist and retention rule"
  );

  data.roadmap.push(
    {
      phase: "Phase 6",
      name: "AI control foundation",
      state: "Planned",
      objective: "Introduce normal-language requests without allowing the model to bypass identity, policy or approval controls.",
      deliverables: ["Model gateway", "AI sessions", "Tracked requests", "Context retrieval", "Risk classification", "Tool catalog", "Approvals", "Emergency stop"]
    },
    {
      phase: "Phase 7",
      name: "AI-assisted development",
      state: "Planned",
      objective: "Connect approved GitHub development actions to isolated checks, protected previews and reviewable pull requests.",
      deliverables: ["Project handbook", "Repository adapter", "Feature branches", "Changesets", "Docker sandboxes", "Check profiles", "Preview deployments", "Draft pull requests"]
    },
    {
      phase: "Phase 8",
      name: "User assistants and automation",
      state: "Deferred",
      objective: "Add authorized user-facing intelligence and repeatable workflows after the control plane is proven.",
      deliverables: ["Assistant profiles", "Page copilots", "Workspace context", "Typed site actions", "Automation scheduler", "Usage budgets", "Feedback", "Operational review"]
    }
  );

  data.applicationTree = `app/
├── main.py                         # Python ASGI application entry
├── core/
│   ├── config.py                   # environment and feature configuration
│   ├── security.py                 # sessions, CSRF, roles and ownership
│   ├── capabilities.py             # user and tool capability policy
│   ├── ai_policy.py                # AI risk tiers and approval rules
│   ├── logging.py                  # structured logs and audit events
│   └── errors.py                   # consistent safe API errors
├── routers/
│   ├── pages.py                    # static and Jinja pages
│   ├── core.py                     # health, version and environment
│   ├── routes.py                   # registry and allowlisted checks
│   ├── identity.py                 # current user and sessions
│   ├── workspaces.py               # permissioned workspaces
│   ├── jobs.py                     # approved background work
│   ├── files.py                    # controlled file lifecycle
│   ├── reports.py                  # reports and exports
│   ├── ai.py                       # sessions, requests and approvals
│   ├── assistants.py               # approved user-facing assistants
│   ├── tools.py                    # typed application tool runtime
│   ├── development.py              # GitHub tasks, branches and previews
│   ├── mcp.py                      # approved MCP servers and tools
│   ├── automations.py              # approved recurring workflows
│   └── admin.py                    # restricted operations and emergency stop
├── services/
│   ├── model_gateway.py            # approved providers and model profiles
│   ├── context_service.py          # handbook and repository retrieval
│   ├── repository_service.py       # scoped GitHub operations
│   ├── sandbox_service.py          # isolated checks
│   ├── deployment_service.py       # preview, staging and release requests
│   ├── tool_service.py             # typed tool validation and invocation
│   ├── mcp_service.py              # MCP client and policy enforcement
│   └── approval_service.py         # versioned scoped approvals
├── models/                         # PostgreSQL records
├── schemas/                        # request, response and tool contracts
├── workers/                        # allowlisted jobs and automation steps
├── templates/                      # Jinja pages when needed
└── static/                         # existing CSS, JS and images
handbook/                           # versioned project rules and learning notes
sandbox/                            # approved images and check profiles
migrations/                         # database migrations
scripts/                            # controlled maintenance tasks
tests/                              # unit, integration, policy and security tests
Dockerfile
compose.yaml
pyproject.toml
README.md`;
})();
