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
// Categories: site, tools, research, infrastructure, general.
// Common statuses: planned, in-progress, complete, paused.

window.CMX_UPDATES = {
  status: {
    timestamp: '2026-08-01T11:35:00-04:00',
    headline: 'Linux and FastAPI environment setup in progress',
    lines: [
      'Current static pages remain live until protected staging is ready.',
      'All website changes continue to be managed through GitHub.'
    ]
  },

  categories: [
    { id: 'all', label: 'ALL' },
    { id: 'site', label: 'SITE' },
    { id: 'tools', label: 'TOOLS' },
    { id: 'research', label: 'RESEARCH' },
    { id: 'infrastructure', label: 'INFRA' },
    { id: 'general', label: 'GENERAL' }
  ],

  entries: [
    {
      id: '2026-08-01-platform-direction',
      timestamp: '2026-08-01T14:01:00-04:00',
      category: 'infrastructure',
      status: 'complete',
      title: 'Platform direction clarified',
      summary: 'Paused further OSINT expansion and set the next major focus on backend preparation, staging and real access control.',
      details: [
        'The existing OSINT pages are considered sufficient for the current static phase.',
        'Future work should prioritize intentional operational tools and the FastAPI foundation.',
        'The current frontend should be preserved and improved instead of expanded with random routes.'
      ],
      pinned: true
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
      ],The feed now loads only after authorization.',
        'The route registry marks /updates as gated and direct-link-only.'
      ],
      pinned: false
    }
  ]
};
