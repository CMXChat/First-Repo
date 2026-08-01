// /updates is managed only from this file.
//
// To maintain the feed, tell ChatGPT things like:
// - "Add an update about the new page."
// - "Revise an existing update."
// - "Delete an update."
// - "Change the current status."
//
// Use status only for what is happening now.
// Use entries only for completed or historical changes.
// New entries belong at the top of the entries array.
// Keep each id unique. Use Eastern Time in the timestamp.
// Categories: site, tools, research, infrastructure, ai, general.
// Common statuses: planned, in-progress, complete, paused.

window.CMX_UPDATES = {
  status: {
    timestamp: '2026-08-01T18:48:00-04:00',
    headline: 'Backend and AI control blueprints prepared for review',
    lines: [
      '/backend now maps the proposed backend, API, infrastructure, permission and AI-assisted development contracts.',
      '/ai documents the natural-language development workflow, user-facing assistants, tool approvals, sandboxes, staging and production controls.',
      '/build remains the future operational control room for real health, checks, deployments, logs and rollback status.',
      'No Python backend, AI service, MCP server or production automation is live yet.'
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
      id: '2026-08-01-ai-control-blueprint',
      timestamp: '2026-08-01T18:48:00-04:00',
      category: 'ai',
      status: 'complete',
      title: 'AI-assisted development and operations plan documented',
      summary: 'Added a complete static architecture for controlling development, approved tools and future user-facing AI through natural-language requests without giving AI unrestricted server access.',
      details: [
        'Created /ai as a focused AI Control Blueprint and added the full AI endpoint contracts to /backend.',
        'Mapped AI sessions, tracked requests, context retrieval, project handbook search, model profiles, approvals and feedback.',
        'Mapped GitHub repository reads, development tasks, feature branches, reviewable changesets, Docker sandboxes, fixed checks, protected previews and draft pull requests.',
        'Mapped production deployment requests that require separate human approval and a prepared rollback release.',
        'Mapped typed site tools, capability-specific MCP tools, user-facing assistants, page copilots, automations, AI usage reporting, policy tests and an emergency stop.',
        'Blocked unrestricted shell, sudo, arbitrary Python or commands, direct writes to main, automatic merges, exposed production secrets and direct AI production deployment.'
      ],
      pinned: true
    },
    {
      id: '2026-08-01-backend-blueprint',
      timestamp: '2026-08-01T18:39:00-04:00',
      category: 'infrastructure',
      status: 'complete',
      title: 'Backend and API source of truth created',
      summary: 'Created /backend as the central registry for proposed APIs, page connections, infrastructure, data models, permissions, development phases and architecture decisions.',
      details: [
        'The registry covers core platform APIs, identity, routes, workspaces, jobs, files, reports, integrations, MCP, AI control, AI development, user assistants and automation.',
        'Each contract documents purpose, owning pages, request and response shape, dependencies, access level and security requirements.',
        'The page loads the live route registry and flags any registered page that lacks a backend decision.',
        'FastAPI is documented as the preferred initial backend because it supports the Python learning and deployment goals.',
        'The framework choice remains reviewable as long as any substitute preserves the same Python ASGI, API, security, staging, testing and approval requirements.'
      ],
      pinned: true
    },
    {
      id: '2026-08-01-build-backend-relationship',
      timestamp: '2026-08-01T18:32:00-04:00',
      category: 'infrastructure',
      status: 'complete',
      title: 'Build Lab and backend planning roles clarified',
      summary: 'Defined /build as the future operational control room while /backend remains the detailed technical and API source of truth.',
      details: [
        '/build should eventually display real health checks, route checks, deployments, worker status, logs, approvals, incidents and rollback information.',
        '/backend documents what must be built, how pages connect to it and which APIs and controls are required.',
        '/ai explains the AI experience and workflow while its complete API contracts remain searchable inside /backend.',
        '/updates records completed planning decisions and the current implementation state.'
      ],
      pinned: false
    },
    {
      id: '2026-08-01-platform-direction',
      timestamp: '2026-08-01T14:01:00-04:00',
      category: 'infrastructure',
      status: 'complete',
      title: 'Platform direction clarified',
      summary: 'Paused further OSINT expansion and set the next major focus on backend preparation, staging and real access control.',
      details: [
        'The existing OSINT pages are considered sufficient for the current static phase.',
        'Future work should prioritize intentional operational tools and the Python backend foundation.',
        'The current frontend should be preserved and improved instead of expanded with random routes.'
      ],
      pinned: false
    },
    {
      id: '2026-08-01-projects-experiment-removed',
      timestamp: '2026-08-01T13:58:00-04:00',
      category: 'site',
      status: 'complete',
      title: 'Projects hub experiment removed',
      summary: 'Created and reviewed a gated /projects concept, then removed it after the direction did not fit the intended workflow.',
      details: [
        'The /projects route and its separate page asset were deleted.',
        'The route registry and privacy audit were cleaned up afterward.',
        'A new project hub should not be rebuilt until its exact purpose and structure are clearly defined.'
      ],
      pinned: false
    },
    {
      id: '2026-08-01-security-build-hardening',
      timestamp: '2026-08-01T13:50:00-04:00',
      category: 'infrastructure',
      status: 'complete',
      title: 'Security and Build Lab hardening completed',
      summary: 'Protected sensitive routes, reduced metadata exposure and strengthened the static Build Lab controls.',
      details: [
        'Added temporary gated access for /build, /callmax and /project.',
        'Added generic restricted metadata, noindex rules, no-referrer behavior and cache-control hints.',
        'Added privacy auditing and secret scanning for future repository changes.',
        'Upgraded Build Lab with notes, security and deployment checklists, and clearer route-check language.',
        'The browser gate remains a temporary deterrent until real server-side authentication is available.'
      ],
      pinned: false
    },
    {
      id: '2026-08-01-updates-gated',
      timestamp: '2026-08-01T11:19:00-04:00',
      category: 'site',
      status: 'complete',
      title: 'Updates route protected',
      summary: 'Moved /updates behind the shared CMX authorization gate and removed a retired project.',
      details: [
        'The feed now loads only after authorization.',
        'The route registry marks /updates as gated and direct-link-only.'
      ],
      pinned: false
    }
  ]
};
