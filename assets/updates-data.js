// /updates is the readable source for current CMX platform direction and progress.
// Keep the durable plan here. Keep implementation truth explicit.

window.CMX_UPDATES = {
  summary: 'db.cmxchat.com is being prepared to evolve from a collection of static GitHub Pages into a secure private Python-powered development and operations platform. GitHub remains the permanent source of truth, while approved AI can eventually understand the project, propose changes, build on feature branches, test inside isolated sandboxes, deploy protected previews, help users through authorized tools, and request production release only after human approval.',

  pages: [
    {
      route: '/build/',
      name: 'Build Lab',
      role: 'Operate and observe',
      description: 'The operational control room. It currently reads the route registry and performs browser-observed route checks. Later it should show real API health, workers, deployments, previews, logs, incidents, AI usage, approvals and rollback state.',
      status: 'Static now · live operations later'
    },
    {
      route: '/backend/',
      name: 'Backend Blueprint',
      role: 'Define the platform',
      description: 'The technical source of truth for core APIs, AI APIs, page connections, Python services, infrastructure, data models, permissions, security controls and implementation phases.',
      status: 'Complete planning source'
    },
    {
      route: '/ai/',
      name: 'AI Control Blueprint',
      role: 'Define AI behavior',
      description: 'The focused plan for normal-language commands, project context, GitHub development, MCP integrations, user assistants, page copilots, sandboxes, staging, approvals, automation, usage controls and emergency shutdown.',
      status: 'Complete AI planning source'
    },
    {
      route: '/architecture/',
      name: 'Architecture & Learning Center',
      role: 'Explain and teach',
      description: 'The technical learning map showing how HTML, JavaScript, Python, FastAPI or another compatible ASGI framework, Linux, Docker, PostgreSQL, GitHub, Cloudflare and AI fit together.',
      status: 'Learning and architecture reference'
    },
    {
      route: '/updates/',
      name: 'Platform Brief & Updates',
      role: 'Explain the whole project',
      description: 'The readable master briefing. It summarizes the mission, the AI plan, frontend and backend connection, infrastructure, security boundaries, implementation order and current progress.',
      status: 'Current page'
    }
  ],

  mission: [
    {
      title: 'Preserve the current frontend',
      text: 'Existing active routes and the terminal-style root should remain available during migration. The project should gain a backend in stages without discarding useful HTML, CSS and JavaScript pages.'
    },
    {
      title: 'Add a real private Python application',
      text: 'A Dockerized Python ASGI application on a protected Linux server should eventually serve the current pages, Jinja pages where useful, typed APIs, authentication, file processing, jobs, integrations, databases and automation under the same domain.'
    },
    {
      title: 'Keep GitHub authoritative',
      text: 'Code, documentation, route definitions and reviewed changes stay in GitHub. Development uses feature branches, checks, previews, pull requests and release history. Production should never depend on invisible edits made outside source control.'
    },
    {
      title: 'Build through normal language',
      text: 'The long-term workflow lets an authorized person describe a feature in plain English, review the AI plan, approve a controlled scope, preview the result on staging and approve production only after the work has passed checks.'
    },
    {
      title: 'Use the same platform to learn',
      text: 'Each phase should help explain Python, APIs, FastAPI or a compatible framework, Linux, Git, Docker, authentication, databases, deployment, AI tools and MCP connectors through actual project work.'
    },
    {
      title: 'Keep the framework decision practical',
      text: 'FastAPI is the preferred starting point because it fits typed APIs, async services, Jinja, automatic documentation, Docker and the Python learning goal. A different Python ASGI framework may be selected if it preserves the documented contracts, security boundaries, tests and deployment controls.'
    }
  ],

  aiCapabilities: [
    {
      title: 'Natural-language control',
      text: 'Convert an ordinary-language goal into a tracked request, structured intent, visible plan, risk tier and proposed actions. Parsing never grants permission and never becomes unrestricted command execution.'
    },
    {
      title: 'Project understanding',
      text: 'Search a versioned project handbook, route registry, architecture notes and approved repository files at known Git revisions. Context retrieval excludes secrets, protected paths and unrelated user data.'
    },
    {
      title: 'AI-assisted coding',
      text: 'Write or revise approved Python, HTML, CSS, JavaScript, tests and documentation after plan approval. Changes occur on feature branches from immutable base commits.'
    },
    {
      title: 'GitHub development workflow',
      text: 'Create branches, produce reviewable changesets, run checks, prepare previews and open draft pull requests. AI does not write directly to main, merge itself or deploy production.'
    },
    {
      title: 'Sandboxed testing',
      text: 'Run fixed test, lint, build and security profiles in short-lived isolated Docker sandboxes with restricted networks, resource limits and no host Docker socket or interactive shell.'
    },
    {
      title: 'Preview and staging',
      text: 'Deploy approved revisions to protected previews or staging with separate credentials, data and retention. Show results before any production request is created.'
    },
    {
      title: 'Commands inside the site',
      text: 'The root terminal or a future command palette may accept requests such as checking route health, creating a report or preparing a code change. The server maps the request to registered typed tools.'
    },
    {
      title: 'Page copilots',
      text: 'Selected pages may have assistants that understand the current page and authorized workspace context. Each page receives only its approved tools and data scopes.'
    },
    {
      title: 'User-facing assistants',
      text: 'Authorized users may ask questions, summarize permitted files and records, generate drafts, create reports and propose actions. Every assistant has a defined purpose, audience, model profile, context boundary and retention rule.'
    },
    {
      title: 'MCP and system integrations',
      text: 'Private MCP connectors and standard API adapters may expose approved GitHub, file, data or business capabilities. Credentials stay server-side and every tool is registered, scoped, testable, auditable and disableable.'
    },
    {
      title: 'Automation',
      text: 'Approved scheduled or condition-polled workflows may use the same typed tools with ownership, quotas, concurrency limits, cancellation and per-step policy checks.'
    },
    {
      title: 'AI operations and recovery',
      text: 'Track model usage, tool calls, latency, cost, errors and outcomes. Administrators receive policy tests, provider controls, budgets, alerts and an emergency stop that AI cannot reverse.'
    }
  ],

  apiFamilies: [
    {
      name: 'AI control',
      examples: 'Capabilities, policies, model profiles, sessions, messages, requests, progress events, approvals, cancellation and feedback.',
      link: '/backend/#apis'
    },
    {
      name: 'Context and handbook',
      examples: 'Handbook version, handbook search, approved repository search, source revisions and safe context excerpts.',
      link: '/backend/#ai'
    },
    {
      name: 'AI development',
      examples: 'Repositories, trees, files, development tasks, plans, branches, changesets, protected paths and task state.',
      link: '/backend/#apis'
    },
    {
      name: 'Sandbox and deployment',
      examples: 'Sandbox creation, fixed checks, filtered logs, previews, staging deployments, draft pull requests and production deployment requests.',
      link: '/backend/#infrastructure'
    },
    {
      name: 'Tools and commands',
      examples: 'Tool catalog, typed invocation, normal-language intent parsing, confirmation rules, quotas, timeouts and safe results.',
      link: '/backend/#permissions'
    },
    {
      name: 'MCP and connectors',
      examples: 'Approved servers, tool discovery, connection tests, scoped provider actions, disable controls and connector audits.',
      link: '/backend/#apis'
    },
    {
      name: 'User AI',
      examples: 'Assistant profiles, conversations, messages, page copilots, workspace context and approvals for user-facing actions.',
      link: '/ai/'
    },
    {
      name: 'Automation and administration',
      examples: 'Automations, manual runs, schedule state, usage summaries, policy tests, budgets and emergency shutdown.',
      link: '/build/'
    }
  ],

  workflow: [
    { step: '01', title: 'Describe the goal', text: 'Explain the desired feature, fix, integration or site action in plain English.' },
    { step: '02', title: 'Create a tracked request', text: 'Record the original request, owner, environment and requested scope before any tool runs.' },
    { step: '03', title: 'Classify intent and risk', text: 'Identify the capability, target, protected areas and required approval tier.' },
    { step: '04', title: 'Retrieve approved context', text: 'Read only permitted handbook sections, routes, files, page data or workspace records.' },
    { step: '05', title: 'Present the plan', text: 'Show affected files, API contracts, tools, tests, risks, expected effect and rollback considerations.' },
    { step: '06', title: 'Approve the scope', text: 'Approve a specific version of the plan and only the actions that should proceed.' },
    { step: '07', title: 'Create a feature branch', text: 'Start from an approved immutable base commit. Main remains untouched.' },
    { step: '08', title: 'Build the change', text: 'Write the approved code, tests and documentation as a reviewable changeset.' },
    { step: '09', title: 'Run isolated checks', text: 'Execute fixed validation profiles inside a short-lived Docker sandbox.' },
    { step: '10', title: 'Deploy a protected preview', text: 'Publish the reviewed revision to preview or staging using separate data and secrets.' },
    { step: '11', title: 'Open a draft pull request', text: 'Attach the plan, diff, checks, risks, preview and review notes.' },
    { step: '12', title: 'Request production approval', text: 'After staging validation, present the release revision and rollback revision to a human approver.' },
    { step: '13', title: 'Deploy and observe', text: 'Deploy only after approval, then watch health, errors and rollback readiness through Build Lab.' }
  ],

  connection: {
    flow: [
      'Existing HTML, CSS and JavaScript pages remain the user interface.',
      'Frontend JavaScript sends typed HTTPS requests to approved /api endpoints.',
      'The Python application validates the session, role, capability, ownership and request schema.',
      'Approved services run the operation, queue a job, access PostgreSQL, process a file or call an integration.',
      'The API returns typed JSON, a safe download or server-sent progress events.',
      'The frontend updates the page without receiving server secrets or unrestricted commands.',
      'AI uses the same approved APIs and tools under the current user identity and additional AI policy checks.',
      'Changes to the frontend or backend return to GitHub through branches, tests, previews and pull requests.'
    ],
    examples: [
      {
        title: 'Normal-language site command',
        code: 'POST /api/commands/parse\n→ POST /api/ai/requests\n→ approval when needed\n→ POST /api/tools/{tool_id}/invoke',
        text: 'A user request becomes structured intent and a visible action plan before any site tool runs.'
      },
      {
        title: 'AI development request',
        code: 'POST /api/dev/tasks\n→ plan\n→ branch\n→ changeset\n→ sandbox checks\n→ preview\n→ draft pull request',
        text: 'The AI builds through GitHub and isolated services without direct main or production authority.'
      },
      {
        title: 'Page assistant',
        code: 'POST /api/assistants/{id}/conversations\n→ message\n→ approved page tools\n→ action confirmation',
        text: 'A user-facing assistant receives only the context and tools assigned to that page and user.'
      }
    ]
  },

  security: {
    allowed: [
      'Read approved handbook and repository context.',
      'Explain architecture, code and implementation choices.',
      'Create plans, drafts and proposed changesets.',
      'Create feature branches after the required approval.',
      'Run allowlisted checks inside isolated sandboxes.',
      'Deploy protected previews or staging revisions after approval.',
      'Open draft pull requests with evidence and review notes.',
      'Invoke typed site tools allowed for the current user.',
      'Request production deployment with staging evidence and rollback prepared.',
      'Use scoped MCP tools and connectors through server-held credentials.'
    ],
    blocked: [
      'Unrestricted shell access or interactive terminal control.',
      'sudo, host filesystem access or the Docker host socket.',
      'Production secrets, raw environment variables, database credentials or provider keys in AI context.',
      'Prompt-supplied arbitrary Python, JavaScript, commands, URLs, MCP servers or provider methods.',
      'Direct writes to main or silent edits outside GitHub review.',
      'Automatic pull request merge or AI self-approval.',
      'Direct production deployment by AI.',
      'Cross-user or cross-workspace context without explicit server permission.',
      'Sensitive information stored in browser localStorage.',
      'Disabling audit logs, policy checks, quotas or the administrator emergency stop.'
    ]
  },

  phases: [
    { number: '01', name: 'Static preparation', state: 'In progress', text: 'Preserve active routes, centralize route data, improve planning pages, limit deployment scope and validate the static repository.' },
    { number: '02', name: 'Protected Python foundation', state: 'Planned', text: 'Deploy the Dockerized Python application behind Cloudflare Access and Tunnel with health, version, environment and route endpoints.' },
    { number: '03', name: 'Identity and application data', state: 'Planned', text: 'Add secure sessions, roles, capabilities, ownership, PostgreSQL migrations, workspaces, jobs, files, audit events, backups and restore tests.' },
    { number: '04', name: 'Connect existing pages', state: 'Planned', text: 'Move selected operations behind typed APIs while preserving current designs and route paths.' },
    { number: '05', name: 'Staging and operations', state: 'Planned', text: 'Add preview environments, workers, structured logs, monitoring, deployment records, rollback and real Build Lab status.' },
    { number: '06', name: 'AI control foundation', state: 'Planned', text: 'Add model profiles, project handbook retrieval, tracked requests, tool registry, risk classification, approvals, budgets and emergency stop.' },
    { number: '07', name: 'AI-assisted development', state: 'Planned', text: 'Add GitHub adapters, branches, changesets, Docker sandboxes, checks, previews, draft pull requests and deployment requests.' },
    { number: '08', name: 'User AI and automation', state: 'Deferred until controls are proven', text: 'Add approved assistants, page copilots, MCP integrations, typed user actions, recurring workflows, feedback and operational review.' }
  ],

  status: [
    {
      title: 'Available now',
      state: 'Current',
      items: [
        'Static HTML, CSS and JavaScript pages',
        'GitHub as source of truth',
        'Central route registry',
        'Backend Blueprint',
        'AI Control Blueprint',
        'Build Lab static route checks',
        'Architecture and learning documentation',
        'Static validation, privacy and secret checks'
      ]
    },
    {
      title: 'Documented but not operating',
      state: 'Planned',
      items: [
        'Python API server',
        'Cloudflare Access and Tunnel origin protection',
        'Server authentication and authorization',
        'PostgreSQL and private storage',
        'Background workers and job queue',
        'AI model gateway and context retrieval',
        'MCP servers and integration tools',
        'Docker sandbox service',
        'Protected preview and staging deployment',
        'User-facing assistants and automations'
      ]
    },
    {
      title: 'Next implementation focus',
      state: 'Next',
      items: [
        'Review and merge the planning layer',
        'Define the production deployment boundary',
        'Create the minimal Dockerized Python application',
        'Add health, version, environment and route APIs',
        'Protect the server through Cloudflare Access and Tunnel',
        'Create a separate staging environment',
        'Add secure server sessions before private data or AI tools'
      ]
    }
  ],

  changes: [
    {
      timestamp: '2026-08-01T19:28:00-04:00',
      category: 'Platform',
      title: 'Platform Brief rebuilt around the complete project plan',
      summary: 'Moved the mission, linked platform map, AI capabilities, API groups, development workflow, frontend and backend connection, security boundaries, phases and current status ahead of the change history.',
      links: [
        { url: '/build/', label: 'Open Build Lab' },
        { url: '/backend/', label: 'Open Backend Blueprint' },
        { url: '/ai/', label: 'Open AI Blueprint' }
      ]
    },
    {
      timestamp: '2026-08-01T18:44:00-04:00',
      category: 'AI',
      title: 'Complete AI control architecture documented',
      summary: 'Added the contracts and controls for normal-language requests, context retrieval, GitHub development, sandboxes, previews, MCP tools, assistants, automations, usage and emergency shutdown.',
      links: [
        { url: '/ai/', label: 'Review the AI plan' },
        { url: '/backend/#ai', label: 'Review AI backend contracts' }
      ]
    },
    {
      timestamp: '2026-08-01T18:40:00-04:00',
      category: 'Backend',
      title: 'Backend Blueprint expanded into the technical source of truth',
      summary: 'Connected the core application plan with AI APIs, data models, infrastructure, permissions, page responsibilities and implementation phases.',
      links: [
        { url: '/backend/', label: 'Review the complete backend plan' },
        { url: '/backend/#apis', label: 'Open the API Registry' }
      ]
    },
    {
      timestamp: '2026-08-01T18:36:00-04:00',
      category: 'Operations',
      title: 'Build Lab redesigned in blue',
      summary: 'Reframed Build Lab as the future operational control room for route health, backend services, deployments, AI operations, incidents, approvals and rollback.',
      links: [
        { url: '/build/', label: 'Review Build Lab' }
      ]
    }
  ]
};
