// /updates is the readable source for current CMX platform direction and progress.
// Keep durable plans in brief, current implementation truth in status, and completed work in entries.
// Use Eastern Time in timestamps.

window.CMX_UPDATES = {
  platformPages: [
    {
      route: '/build/',
      name: 'Build Lab',
      role: 'Operate and observe',
      current: 'Loads the central route registry, performs browser-observed route checks, and shows readiness requirements.',
      future: 'Application health, workers, deployments, logs, incidents, AI operations, approvals, release status, and rollback controls.'
    },
    {
      route: '/backend/',
      name: 'Backend Blueprint',
      role: 'Define the platform',
      current: 'The complete technical source of truth for core APIs, AI APIs, page connections, infrastructure, data, permissions, and delivery phases.',
      future: 'Its documented contracts become implemented Python endpoints and services.'
    },
    {
      route: '/ai/',
      name: 'AI Control Blueprint',
      role: 'Define AI behavior',
      current: 'Explains natural-language development, user-facing assistants, MCP tools, sandboxes, approvals, automations, and hard boundaries.',
      future: 'The visible AI control center for requests, plans, actions, previews, assistants, usage, and policy status.'
    },
    {
      route: '/architecture/',
      name: 'Architecture & Learning Center',
      role: 'Explain and teach',
      current: 'Documents how the static frontend, Python backend, database, Linux, Docker, GitHub, Cloudflare, APIs, and AI fit together.',
      future: 'A maintained technical handbook and learning reference used by both people and approved AI context retrieval.'
    },
    {
      route: '/updates/',
      name: 'Platform Brief & Updates',
      role: 'Brief the project',
      current: 'Provides the overall mission, page map, AI plan, implementation status, direct links, and change history.',
      future: 'A readable progress and release briefing backed by real platform status.'
    },
    {
      route: '/directory/',
      name: 'Operations Directory',
      role: 'Launch approved tools',
      current: 'Lists the current active browser tools and approved routes.',
      future: 'A permission-aware launcher for browser pages, backend tools, jobs, and approved AI capabilities.'
    }
  ],

  brief: {
    summary: 'CMX is preparing db.cmxchat.com to evolve from static GitHub Pages into a secure private Python-powered development and operations platform that can be built, extended, and managed largely through normal-language instructions to AI while keeping GitHub, permissions, testing, staging, and human approval in control.',
    sections: [
      {
        label: 'Mission',
        text: 'The objective is to preserve the current useful pages while adding a real backend that can authenticate users, run approved Python services, process files, store authorized data, coordinate jobs, connect external systems, and support controlled AI actions under the same domain.',
        bullets: [
          'Preserve active routes and the terminal-style root during migration.',
          'Connect existing frontend pages to typed backend APIs instead of rebuilding everything at once.',
          'Make the project understandable and manageable through normal-language instructions.',
          'Use the platform as a practical environment for learning Python and modern infrastructure.'
        ]
      },
      {
        label: 'Current implementation truth',
        text: 'The live site is currently static HTML, CSS, and JavaScript. GitHub Pages serves the frontend. Browser tools may process local information, but no private Python application, database, worker queue, AI model, MCP server, or production automation is currently operating.',
        bullets: [
          'Current browser password gates are temporary deterrents and do not provide server security.',
          'The new backend, AI, and operations pages are planning interfaces until their services are implemented.',
          'No page should present planned activity as a real server result.'
        ]
      },
      {
        label: 'Source of truth and development workflow',
        text: 'GitHub remains the permanent source of truth for application code, documentation, route definitions, and reviewed platform changes. Development should use feature branches and protected review instead of silent production edits.',
        bullets: [
          'Create a branch from an approved immutable base commit.',
          'Show the proposed file changes and checks.',
          'Run validation before a preview or pull request.',
          'Use staging before production.',
          'Require explicit production approval and a prepared rollback revision.'
        ]
      },
      {
        label: 'Python backend and frontend connection',
        text: 'A Dockerized Python ASGI application on a Linux server should eventually serve the existing static assets, Jinja-rendered pages where useful, and typed API endpoints under db.cmxchat.com. The frontend pages remain HTML, CSS, and JavaScript clients that call approved Python APIs through fetch requests.',
        bullets: [
          'FastAPI is the preferred initial framework because it fits typed APIs, async services, automatic documentation, Jinja, Docker, and the Python learning goal.',
          'A compatible Python ASGI framework may be selected during implementation if it preserves every documented API, security, test, staging, and deployment requirement.',
          'Frontend pages should never receive database credentials, provider secrets, or unrestricted server commands.',
          'The API contracts in /backend define how frontend and backend components communicate.'
        ]
      },
      {
        label: 'AI-assisted development',
        text: 'The development AI should understand an approved project handbook and permitted repository files, then convert a plain-English feature request into a visible, versioned implementation plan before requesting any action.',
        bullets: [
          'Read approved handbook sections, routes, architecture notes, and allowlisted repository files at known Git revisions.',
          'Explain the proposed files, APIs, risks, tests, and protected areas.',
          'Create feature branches and reviewable changesets only after the required approval.',
          'Write or revise approved Python, HTML, CSS, JavaScript, tests, and documentation.',
          'Run fixed test, lint, build, and security profiles inside a short-lived isolated Docker sandbox.',
          'Deploy protected previews or staging revisions with separate data and secrets.',
          'Open draft pull requests and request production deployment after staging evidence is available.',
          'Never approve its own production deployment.'
        ]
      },
      {
        label: 'Natural-language commands',
        text: 'Normal-language commands should be treated as requests that the server parses into structured intent. Parsing never grants permission or executes an unrestricted command.',
        bullets: [
          'The user describes a goal in ordinary language.',
          'The system identifies the intended capability, target, risk tier, and required confirmation.',
          'The system displays its interpretation and proposed actions.',
          'Only typed, registered tools may run.',
          'Unknown or unsafe instructions fail closed.',
          'The root terminal remains a controlled launcher and command-entry surface, never a real Linux shell.'
        ]
      },
      {
        label: 'AI inside the site for users',
        text: 'Approved user-facing assistants may eventually help authenticated users inside selected pages. Each assistant must have a documented purpose, audience, context boundary, model profile, tool allowlist, retention rule, and confirmation policy.',
        bullets: [
          'Answer questions using only authorized page, workspace, file, and handbook context.',
          'Summarize permitted records, files, reports, jobs, and activity.',
          'Generate drafts, checklists, research plans, structured data, and reports.',
          'Invoke typed site tools available to the current user.',
          'Show the exact effect before changing data or using an external integration.',
          'Keep users, roles, and workspaces isolated from unrelated context.',
          'Record feedback, usage, latency, cost, errors, and action outcomes without storing complete prompt contents by default.'
        ]
      },
      {
        label: 'MCP and external systems',
        text: 'Private MCP connectors and traditional API adapters may give AI limited authenticated access to approved project and business capabilities. The connection itself does not grant broad authority.',
        bullets: [
          'Every MCP server and tool is reviewed, registered, and scoped.',
          'Credentials remain server-side and never enter browser code or AI prompts.',
          'Repository access is limited to approved repositories, branches, paths, and actions.',
          'External writes require the capability and confirmation assigned to that tool.',
          'Administrators can test, disable, audit, and emergency-stop integrations.',
          'Prompts cannot add arbitrary MCP servers, URLs, provider methods, or credentials.'
        ]
      },
      {
        label: 'Infrastructure',
        text: 'Cloudflare Access and a Cloudflare Tunnel should protect the Linux origin. Docker should package the Python application and approved worker services. PostgreSQL and private object storage may be added when persistence is needed.',
        bullets: [
          'Separate development, sandbox, staging, and production credentials and data.',
          'Use secure sessions, hashed credentials, role and capability checks, record ownership, CSRF protection, validation, and rate limits.',
          'Add structured logs, audit events, health checks, metrics, automatic restarts, backups, restore tests, and rollback support.',
          'Isolate uploads, apply file limits and retention, and never expose raw storage paths.',
          'Track model and integration usage with budgets, quotas, alerts, cancellation, and emergency controls.'
        ]
      },
      {
        label: 'Authority and safety boundaries',
        text: 'AI remains useful because its authority stays narrow, visible, and reversible. The website, AI, and terminal interface must never become an unrestricted administration channel.',
        bullets: [
          'No unrestricted shell, sudo, Docker host socket, or host filesystem access.',
          'No production secrets, raw environment variables, database credentials, or provider keys in AI context.',
          'No prompt-supplied arbitrary Python, JavaScript, commands, URLs, MCP servers, or provider methods.',
          'No direct writes to main, automatic merge, direct production deployment, or AI self-approval.',
          'No cross-user or cross-workspace access without explicit server-side permission.',
          'Every state-changing action is typed, scoped, attributable, rate-limited, audited, and cancellable when possible.'
        ]
      },
      {
        label: 'Learning objective',
        text: 'The platform should also serve as a structured learning environment. Each implementation phase should explain what is being built, why it exists, how the frontend connects to it, and how it is secured and deployed.',
        bullets: [
          'Python and FastAPI or a compatible Python ASGI framework.',
          'HTML, CSS, JavaScript, Jinja, and browser-to-API communication.',
          'Git, GitHub branches, pull requests, reviews, and release history.',
          'Linux, Docker, environment configuration, services, logs, and restarts.',
          'Authentication, authorization, databases, migrations, files, and jobs.',
          'Cloudflare Access, Tunnel, staging, monitoring, backups, and rollback.',
          'AI models, context retrieval, tool calling, MCP connectors, approvals, and safe automation.'
        ]
      }
    ],
    links: [
      { url: '/build/', label: 'Open Build Lab: operations, readiness, deployments, and rollback' },
      { url: '/backend/', label: 'Open Backend Blueprint: complete core and AI API source of truth' },
      { url: '/backend/#apis', label: 'Open Backend API Registry' },
      { url: '/backend/#ai', label: 'Open AI contracts inside Backend Blueprint' },
      { url: '/backend/#infrastructure', label: 'Open infrastructure architecture' },
      { url: '/backend/#permissions', label: 'Open permissions and approval model' },
      { url: '/ai/', label: 'Open AI Control Blueprint: natural-language development and user AI' },
      { url: '/architecture/', label: 'Open Architecture & Learning Center' },
      { url: '/directory/', label: 'Open current Operations Directory' }
    ]
  },

  aiWorkflow: [
    { step: '01', title: 'Describe the goal', text: 'Explain the feature, problem, or desired result in plain English.' },
    { step: '02', title: 'Track and classify', text: 'Create an AI request, identify its target and classify the risk and required authority.' },
    { step: '03', title: 'Retrieve approved context', text: 'Read only authorized handbook, route, repository, page, file, or workspace context.' },
    { step: '04', title: 'Show the plan', text: 'Display the files, APIs, tools, tests, risks, expected effect, and approval requirements.' },
    { step: '05', title: 'Approve the scope', text: 'Approve a specific version of the plan and only the actions that should proceed.' },
    { step: '06', title: 'Create a feature branch', text: 'Start from an approved immutable base commit. Main remains untouched.' },
    { step: '07', title: 'Build the change', text: 'Write or revise the approved Python, HTML, CSS, JavaScript, tests, and documentation.' },
    { step: '08', title: 'Run sandbox checks', text: 'Use fixed profiles in an isolated short-lived Docker environment without unrestricted shell access.' },
    { step: '09', title: 'Deploy a preview', text: 'Publish the reviewed revision to a protected preview or staging environment with separate data and secrets.' },
    { step: '10', title: 'Open a draft pull request', text: 'Attach the plan, file changes, checks, risks, preview, and review notes.' },
    { step: '11', title: 'Validate staging', text: 'Review behavior, security, logs, and rollback readiness outside production.' },
    { step: '12', title: 'Approve production', text: 'A human approves the release. The AI cannot merge, approve, or deploy production by itself.' }
  ],

  apiCoverage: [
    {
      label: 'Core platform',
      text: 'Health, version, environment, identity, sessions, users, roles, capabilities, routes, page connections, workspaces, files, jobs, reports, notifications, audit, and administration.'
    },
    {
      label: 'AI control',
      text: 'Capabilities, policies, model profiles, sessions, messages, tracked requests, progress events, context retrieval, approvals, cancellation, feedback, usage, and emergency stop.'
    },
    {
      label: 'AI development',
      text: 'Approved repositories, trees, files, development tasks, implementation plans, branches, changesets, sandboxes, checks, logs, previews, pull requests, staging, and deployment requests.'
    },
    {
      label: 'Tool runtime and commands',
      text: 'Typed tool catalog, natural-language intent parsing, validated tool invocation, risk tiers, confirmation tokens, quotas, timeouts, safe results, and audit events.'
    },
    {
      label: 'MCP and integrations',
      text: 'Approved connectors, servers, tools, connection tests, scoped credentials, external reads and writes, tool disable controls, and provider-specific policy.'
    },
    {
      label: 'User assistants and automations',
      text: 'Assistant profiles, conversations, page copilots, user action approvals, workspace context, scheduled workflows, condition checks, manual runs, cancellation, budgets, and ownership.'
    }
  ],

  implementationPhases: [
    { phase: '1', title: 'Static preparation', text: 'Clean deployment boundaries, retain active routes, centralize route data, validate assets, and preserve the current frontend.' },
    { phase: '2', title: 'Protected Python foundation', text: 'Deploy the Dockerized Python ASGI application behind Cloudflare Access and Tunnel with health, version, environment, and route endpoints.' },
    { phase: '3', title: 'Identity and application data', text: 'Add secure sessions, roles, capabilities, ownership, PostgreSQL migrations, workspaces, files, jobs, audit logs, backups, and restore testing.' },
    { phase: '4', title: 'Connect existing pages', text: 'Move selected browser operations behind typed APIs while preserving the current page designs and route paths.' },
    { phase: '5', title: 'Staging and operations', text: 'Add isolated staging, preview deployments, workers, structured logs, monitoring, release records, rollback, and real Build Lab status.' },
    { phase: '6', title: 'AI control foundation', text: 'Add the model gateway, project handbook, context retrieval, tracked AI requests, tool registry, risk classification, approvals, quotas, and emergency stop.' },
    { phase: '7', title: 'AI-assisted development', text: 'Add approved GitHub adapters, feature branches, changesets, Docker sandboxes, fixed checks, previews, draft pull requests, and production deployment requests.' },
    { phase: '8', title: 'User AI and automation', text: 'Add approved assistants, page copilots, typed user actions, MCP integrations, recurring workflows, usage controls, feedback, and operational review.' }
  ],

  status: {
    timestamp: '2026-08-01T19:23:00-04:00',
    headline: 'The platform architecture is documented; implementation has not started',
    lines: [
      'The current production site remains static GitHub Pages.',
      'Build Lab, Backend Blueprint, AI Control Blueprint, the project README, route registry, and this platform brief are prepared on a review branch.',
      'The Backend Blueprint includes the planned core APIs and the AI control, development, MCP, assistant, automation, usage, approval, and emergency-control APIs.',
      'FastAPI is the preferred initial backend framework, but the final implementation may use another compatible Python ASGI framework if every documented requirement is preserved.',
      'The next implementation milestone is a protected Dockerized Python foundation with health, version, environment, and route endpoints behind Cloudflare Access and Tunnel.',
      'No AI service, MCP server, database, worker queue, protected staging environment, or production deployment automation is live yet.'
    ],
    links: [
      { url: '/build/', label: 'Review Build Lab' },
      { url: '/backend/', label: 'Review the complete Backend Blueprint' },
      { url: '/backend/#apis', label: 'Review all planned APIs' },
      { url: '/ai/', label: 'Review the complete AI plan' },
      { url: '/architecture/', label: 'Review the learning and architecture reference' }
    ]
  },

  categories: [
    { id: 'all', label: 'ALL' },
    { id: 'platform', label: 'PLATFORM' },
    { id: 'ai', label: 'AI' },
    { id: 'infrastructure', label: 'INFRA' },
    { id: 'security', label: 'SECURITY' },
    { id: 'site', label: 'SITE' }
  ],

  entries: [
    {
      id: '2026-08-01-complete-platform-brief',
      timestamp: '2026-08-01T19:23:00-04:00',
      category: 'platform',
      status: 'complete',
      title: 'Complete platform briefing and linked page map prepared',
      summary: 'Rebuilt /updates to provide the full project mission, architecture, page responsibilities, AI plan, API coverage, implementation order, current status, and direct navigation to every major planning page.',
      details: [
        'Placed linked cards for /build, /backend, /ai, /architecture, /updates, and /directory near the top of the page.',
        'Expanded the project explanation from a short summary into detailed sections covering the frontend, Python backend, GitHub workflow, AI development, user AI, MCP, infrastructure, security, and learning objectives.',
        'Added the complete twelve-step plain-English-to-production workflow.',
        'Added API coverage groups and an eight-phase implementation sequence.',
        'Removed outdated research-era entries and categories that distracted from the current platform direction.'
      ],
      links: [
        { url: '/build/', label: 'Open /build' },
        { url: '/backend/', label: 'Open /backend' },
        { url: '/ai/', label: 'Open /ai' },
        { url: '/architecture/', label: 'Open /architecture' }
      ],
      pinned: true
    },
    {
      id: '2026-08-01-ai-development-plan',
      timestamp: '2026-08-01T19:18:00-04:00',
      category: 'ai',
      status: 'complete',
      title: 'AI-assisted development and user AI plan documented',
      summary: 'Documented how normal-language requests can safely become plans, branches, code changes, sandbox checks, previews, pull requests, user actions, integrations, and approved automations.',
      details: [
        'The AI can retrieve only approved handbook, route, repository, page, file, and workspace context.',
        'Development actions use feature branches, immutable base commits, versioned plans, scoped approvals, reviewable diffs, and fixed sandbox checks.',
        'User-facing assistants remain purpose-specific, permission-aware, context-limited, and confirmation-driven.',
        'MCP and API integrations use server-held credentials and registered tools instead of unrestricted provider access.',
        'Production deployment remains a separate human approval with staging evidence and rollback prepared.'
      ],
      links: [
        { url: '/ai/', label: 'Open AI Control Blueprint' },
        { url: '/backend/#ai', label: 'Open AI architecture in Backend Blueprint' },
        { url: '/backend/#apis', label: 'Search AI and development APIs' }
      ],
      pinned: true
    },
    {
      id: '2026-08-01-api-platform-source',
      timestamp: '2026-08-01T19:12:00-04:00',
      category: 'infrastructure',
      status: 'complete',
      title: 'Core and AI API source of truth established',
      summary: 'Backend Blueprint now records the contracts required to connect existing frontend pages to the future Python application and controlled AI services.',
      details: [
        'Covers core platform, identity, routes, page connections, workspaces, files, jobs, reports, integrations, administration, and audit.',
        'Covers AI sessions, requests, messages, context, policies, approvals, tools, commands, development, MCP, assistants, automation, usage, and emergency stop.',
        'Documents access level, owning page, purpose, dependencies, persistence, request and response position, and security requirements for each endpoint.',
        'Treats FastAPI as the preferred starting framework while keeping the architecture portable across compatible Python ASGI implementations.'
      ],
      links: [
        { url: '/backend/', label: 'Open Backend Blueprint' },
        { url: '/backend/#apis', label: 'Open API Registry' },
        { url: '/backend/#infrastructure', label: 'Open Infrastructure' },
        { url: '/backend/#permissions', label: 'Open Permissions' }
      ],
      pinned: true
    },
    {
      id: '2026-08-01-build-lab-role',
      timestamp: '2026-08-01T19:07:00-04:00',
      category: 'site',
      status: 'complete',
      title: 'Build Lab defined as the operational control room',
      summary: 'Build Lab now has a specific role separate from documentation pages and clearly distinguishes current browser checks from future server operations.',
      details: [
        'Current functions include route-registry loading, browser-observed route checks, readiness requirements, and delivery-pipeline documentation.',
        'Future functions include application health, workers, deployments, logs, incidents, AI operations, approvals, releases, and rollback state.',
        'Build Lab links directly to Backend Blueprint, AI Control Blueprint, and Platform Brief & Updates.'
      ],
      links: [
        { url: '/build/', label: 'Open Build Lab' },
        { url: '/backend/', label: 'Open Backend Blueprint' },
        { url: '/ai/', label: 'Open AI Control Blueprint' }
      ],
      pinned: false
    },
    {
      id: '2026-08-01-security-delivery-controls',
      timestamp: '2026-08-01T19:02:00-04:00',
      category: 'security',
      status: 'complete',
      title: 'Security and release boundaries documented',
      summary: 'Documented the controls required before private backend services, AI tools, external integrations, or production automation are activated.',
      details: [
        'Cloudflare Access and Tunnel protect the origin, while application sessions, capabilities, ownership, CSRF protection, validation, and rate limits protect backend actions.',
        'Development, sandbox, staging, and production use separate authority, secrets, and data.',
        'AI receives no shell, sudo, Docker host socket, production secrets, arbitrary code authority, main-branch write authority, automatic merge, or direct production deployment.',
        'Structured logs, audit events, health checks, backups, restore testing, automatic restarts, cancellation, emergency stop, and rollback are required operational controls.'
      ],
      links: [
        { url: '/backend/#permissions', label: 'Open Permissions' },
        { url: '/backend/#decisions', label: 'Open Approved and Blocked Decisions' },
        { url: '/ai/', label: 'Open AI Safety Boundaries' }
      ],
      pinned: false
    }
  ]
};
