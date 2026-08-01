// /updates is managed only from this file.
//
// Use status for what is happening now.
// Use brief for the durable project explanation.
// Use entries for completed or historical changes.
// New entries belong at the top of the entries array.
// Keep each id unique. Use Eastern Time in timestamps.
// Categories: site, tools, research, infrastructure, ai, general.

window.CMX_UPDATES = {
  brief: {
    summary: 'db.cmxchat.com is being prepared to move from a collection of static GitHub Pages into a secure private Python-powered development and operations platform that can be built and managed largely through normal-language instructions to AI.',
    sections: [
      {
        label: 'Current state',
        text: 'The live project is still static HTML, CSS and JavaScript served from GitHub. Existing active routes and the terminal-style root interface are being preserved while the architecture, API contracts and migration order are documented.'
      },
      {
        label: 'Target platform',
        text: 'GitHub remains the permanent source of truth. A Dockerized Python ASGI application on a protected Linux server should serve the existing pages, future APIs, authentication, databases, file processing, jobs and automation under the same domain. FastAPI is the preferred starting framework, while the documented contracts and controls remain more important than the framework name.'
      },
      {
        label: 'AI-assisted development',
        text: 'A normal-language feature request should become a tracked plan. After approval, AI may read approved project context, create a feature branch, revise Python, HTML, CSS or JavaScript, run fixed checks inside an isolated Docker sandbox, deploy a protected preview, open a draft pull request and request production deployment after staging validation.'
      },
      {
        label: 'User-facing AI',
        text: 'Approved assistants may eventually answer questions using authorized page or workspace context, generate drafts and reports, and call typed backend tools for users. Each assistant must have a defined purpose, audience, context boundary, tool allowlist, retention rule and confirmation policy.'
      },
      {
        label: 'Security boundary',
        text: 'AI, the website and the terminal never receive unrestricted shell access, sudo, the Docker host socket, production secrets, arbitrary code execution, direct writes to main, automatic merge authority or direct production deployment. State-changing actions remain typed, scoped, approved, logged, rate-limited and reversible where possible.'
      },
      {
        label: 'Infrastructure and learning',
        text: 'Cloudflare Access and Tunnel should protect the origin. Development, staging and production use separate secrets and data. The platform should include secure sessions, roles, capabilities, PostgreSQL when needed, logging, health checks, automatic restarts, backups and rollback support while serving as a practical way to learn Python, FastAPI, Linux, Git, Docker, APIs, authentication, databases and deployment.'
      }
    ],
    links: [
      { url: '/build/', label: 'open /build · operational control room' },
      { url: '/backend/', label: 'open /backend · complete API and infrastructure blueprint' },
      { url: '/ai/', label: 'open /ai · AI control and development workflow' },
      { url: '/architecture/', label: 'open /architecture · technical learning reference' },
      { url: '/directory/', label: 'open /directory · current registered tools' }
    ]
  },

  status: {
    timestamp: '2026-08-01T18:48:00-04:00',
    headline: 'The backend, AI and operations planning layer is prepared on a review branch',
    lines: [
      'Build Lab has been redesigned in blue as the future operational control room.',
      'Backend Blueprint now contains the core platform APIs plus the complete AI-assisted development, tool, MCP, assistant and automation contracts.',
      'AI Control Blueprint explains the normal-language workflow from request through branch, sandbox, preview, pull request, staging and human production approval.',
      'Updates now serves as the readable overall project brief and linked change log.',
      'These changes are still in a draft pull request and are not live on the main branch yet.',
      'No Python backend, AI model, MCP server, database, worker queue or production automation is operating yet.'
    ],
    links: [
      { url: '/build/', label: 'review Build Lab' },
      { url: '/backend/', label: 'review Backend Blueprint' },
      { url: '/ai/', label: 'review AI Blueprint' }
    ]
  },

  categories: [
    { id: 'all', label: 'ALL' },
    { id: 'site', label: 'SITE' },
    { id: 'tools', label: 'TOOLS' },
    { id: 'research', label: 'RESEARCH' },
    { id: 'infrastructure', label: 'INFRA' },
    { id: 'ai', label: 'AI' },
    { id: 'general', label: 'GENERAL' }
  ],

  entries: [
    {
      id: '2026-08-01-planning-layer-aligned',
      timestamp: '2026-08-01T18:48:00-04:00',
      category: 'general',
      status: 'complete',
      title: 'Build Lab, Backend Blueprint, AI Blueprint and Updates aligned',
      summary: 'The planning pages now explain one coherent platform instead of overlapping or presenting unrelated experiments.',
      details: [
        '/build is the operational control room for current route checks and future health, workers, deployments, logs, incidents, approvals and rollback.',
        '/backend is the technical source of truth for API contracts, infrastructure, data models, permissions, page connections and delivery phases.',
        '/ai is the focused explanation of natural-language development, user assistants, MCP tools, sandboxes, approvals and automation.',
        '/updates is the readable project brief, current status and historical change log.',
        '/architecture remains the technical learning reference.'
      ],
      links: [
        { url: '/build/', label: 'open /build' },
        { url: '/backend/', label: 'open /backend' },
        { url: '/ai/', label: 'open /ai' },
        { url: '/updates/', label: 'open /updates' }
      ],
      pinned: true
    },
    {
      id: '2026-08-01-ai-control-architecture',
      timestamp: '2026-08-01T18:44:00-04:00',
      category: 'ai',
      status: 'complete',
      title: 'Complete AI control architecture documented',
      summary: 'Expanded the platform plan beyond chat to cover AI-assisted development, approved site actions, MCP integrations, user assistants, automation and operational safety.',
      details: [
        'Documented AI capabilities, policies, model profiles, sessions, tracked requests, progress events, approvals, cancellation, feedback and context retrieval.',
        'Documented a versioned project handbook and approved search across handbook content, route data and permitted repository files.',
        'Documented repository trees, file reads, development tasks, implementation plans, feature branches and reviewable changesets.',
        'Documented isolated Docker sandboxes, fixed check profiles, filtered logs, protected previews, draft pull requests and production deployment requests.',
        'Documented typed tool invocation, normal-language command parsing, MCP server controls, user-facing assistants and approved automations.',
        'Documented usage accounting, policy regression tests and an administrator emergency stop that AI cannot reverse.',
        'Production deployment remains a separate human decision with staging evidence and a known rollback revision.'
      ],
      links: [
        { url: '/ai/', label: 'open AI Control Blueprint' },
        { url: '/backend/#ai', label: 'open AI contracts inside Backend Blueprint' },
        { url: '/backend/#apis', label: 'search the full API registry' }
      ],
      pinned: true
    },
    {
      id: '2026-08-01-backend-blueprint-expanded',
      timestamp: '2026-08-01T18:40:00-04:00',
      category: 'infrastructure',
      status: 'complete',
      title: 'Backend Blueprint expanded into the platform source of truth',
      summary: 'The backend page now covers both the core application and the AI control plane required to connect future Python services to the existing frontend.',
      details: [
        'Core contracts cover health, environment, identity, routes, workspaces, jobs, files, metadata, phone tools, research, reports, connectors, MCP and administration.',
        'AI contracts cover natural-language requests, development actions, user assistants, page copilots, automations, approvals and emergency controls.',
        'Every endpoint records its purpose, owning page, access level, request and response position, dependencies, persistence needs and security requirements.',
        'The page map loads the central route registry and highlights any route that has no documented backend position.',
        'FastAPI is marked as the preferred initial backend, subject to implementation review. Any alternative must preserve the same Python ASGI, API, security, testing, staging and deployment requirements.'
      ],
      links: [
        { url: '/backend/', label: 'open Backend Blueprint' },
        { url: '/backend/#apis', label: 'open API Registry' },
        { url: '/backend/#infrastructure', label: 'open Infrastructure' },
        { url: '/backend/#permissions', label: 'open Permissions' }
      ],
      pinned: true
    },
    {
      id: '2026-08-01-build-lab-v2',
      timestamp: '2026-08-01T18:36:00-04:00',
      category: 'infrastructure',
      status: 'complete',
      title: 'Build Lab redesigned as the future operations center',
      summary: 'Replaced the older green planning page and outdated mock endpoint list with a blue, truthful operational view tied to the actual platform plan.',
      details: [
        'Build Lab now explains the relationship between /build, /backend, /ai and /updates.',
        'It loads the central route registry and can perform browser-observed route checks without pretending to be server monitoring.',
        'It shows the current static state, the intended delivery pipeline and separate backend and AI readiness requirements.',
        'It defines future live panels for application health, deployments, AI operations, security events and rollback.',
        'The page clearly states that current browser gates are temporary and do not provide real server privacy.'
      ],
      links: [
        { url: '/build/', label: 'open Build Lab' },
        { url: '/backend/', label: 'open supporting Backend Blueprint' }
      ],
      pinned: false
    },
    {
      id: '2026-08-01-updates-project-brief',
      timestamp: '2026-08-01T18:30:00-04:00',
      category: 'site',
      status: 'complete',
      title: 'Updates converted into an overall project briefing',
      summary: 'Added a durable platform explanation, current status, direct planning-page links and a cleaner change log.',
      details: [
        'The project brief explains the current static site, target Python platform, AI-assisted development, user-facing AI, security boundary and learning goals.',
        'Status and change entries can now contain safe internal or HTTPS links.',
        'Terminal commands now include brief, AI filtering and direct open commands for the major project pages.',
        'Removed the discontinued projects-page experiment from the visible history to prevent confusion.'
      ],
      links: [
        { url: '/updates/', label: 'open platform brief and updates' }
      ],
      pinned: false
    },
    {
      id: '2026-08-01-platform-direction',
      timestamp: '2026-08-01T14:01:00-04:00',
      category: 'infrastructure',
      status: 'complete',
      title: 'Platform direction clarified',
      summary: 'Paused random route expansion and set the next major focus on backend preparation, protected staging, real access control and intentional AI integration.',
      details: [
        'The existing OSINT pages are sufficient for the current static phase.',
        'New work should strengthen the platform foundation or connect an existing page to an approved capability.',
        'The current frontend should be preserved during migration instead of being replaced all at once.'
      ],
      links: [
        { url: '/directory/', label: 'review current active tools' },
        { url: '/architecture/', label: 'review architecture and learning plan' }
      ],
      pinned: false
    },
    {
      id: '2026-08-01-security-build-hardening',
      timestamp: '2026-08-01T13:50:00-04:00',
      category: 'infrastructure',
      status: 'complete',
      title: 'Static security and repository checks added',
      summary: 'Reduced accidental exposure and added repository checks while documenting that real privacy still requires the future server architecture.',
      details: [
        'Added noindex, no-referrer and cache-control hints to sensitive static resources.',
        'Added privacy auditing and secret-pattern scanning for repository changes.',
        'Added temporary browser gates to selected routes as presentation deterrents only.',
        'Documented Cloudflare Access, server sessions, permissions, rate limits, logging, backups and rollback as required replacements.'
      ],
      links: [
        { url: '/build/', label: 'review current and planned controls' },
        { url: '/backend/#decisions', label: 'review approved and blocked patterns' }
      ],
      pinned: false
    }
  ]
};
