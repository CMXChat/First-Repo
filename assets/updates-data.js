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
    timestamp: '2026-08-01T11:31:00-04:00',
    headline: 'Linux and FastAPI environment setup in progress',
    lines: [
      'Current static pages remain live until protected staging is ready.',
      'GitHub remains the source of truth.'
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
      id: '2026-08-01-updates-gated',
      timestamp: '2026-08-01T11:19:00-04:00',
      category: 'site',
      status: 'complete',
      title: 'Updates route protected',
      summary: 'Moved /updates behind the shared CMX authorization gate and removed a retired project.',
      details: [
        'The feed now loads only after operator authorization.',
        'The route registry marks /updates as gated and direct-link-only.'
      ],
      pinned: false
    }
  ]
};
