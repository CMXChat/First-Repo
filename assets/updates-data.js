// /updates is managed only from this file.
//
// To maintain the feed, tell ChatGPT things like:
// - "Add an update about the new page."
// - "Revise the Crystal entry."
// - "Delete the environment update."
// - "Change the current status."
//
// New entries belong at the top of the entries array.
// Keep each id unique. Use Eastern Time in the timestamp.
// Categories: site, tools, research, infrastructure, general.
// Common statuses: planned, in-progress, complete, paused.
//
// COPY-PASTE ENTRY TEMPLATE:
// {
//   id: '2026-08-01-short-name',
//   timestamp: '2026-08-01T00:00:00-04:00',
//   category: 'site',
//   status: 'complete',
//   title: 'Short update title',
//   summary: 'One clear sentence.',
//   details: [
//     'Optional detail.',
//     'Optional detail.'
//   ],
//   link: '/page/',
//   linkLabel: 'OPEN /PAGE',
//   pinned: false
// },

window.CMX_UPDATES = {
  status: {
    timestamp: '2026-08-01T00:35:00-04:00',
    headline: 'Protected environment being prepared',
    lines: [
      'CRZA is setting up the new Linux environment for db.cmxchat.com.',
      'FastAPI, Docker, Cloudflare Access, and protected staging are the planned foundation.',
      'The current static pages remain live while the new environment is prepared.'
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
      id: '2026-08-01-environment-setup',
      timestamp: '2026-08-01T00:35:00-04:00',
      category: 'infrastructure',
      status: 'in-progress',
      title: 'New server environment setup',
      summary: 'CRZA is preparing the protected Linux environment that will eventually run the Python and FastAPI version of db.cmxchat.com.',
      details: [
        'GitHub remains the source of truth.',
        'Changes will move through staging before production.',
        'Cloudflare Access and Tunnel will sit in front of the server.'
      ],
      pinned: true
    },
    {
      id: '2026-08-01-crystal-page',
      timestamp: '2026-08-01T00:10:00-04:00',
      category: 'site',
      status: 'complete',
      title: 'Crystal page created',
      summary: 'Built /crystal as a short three-question terminal that opens into an interactive page about Crystal.',
      details: [
        'The terminal answers stay visible before the next question loads.',
        'The page includes the Crystal profile, animals, jewelry, dreams, and flower sections.',
        'The page remains excluded from search indexing.'
      ],
      link: '/crystal/',
      linkLabel: 'OPEN /CRYSTAL',
      pinned: false
    }
  ]
};
