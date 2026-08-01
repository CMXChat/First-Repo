window.CMX_UPDATES = {
  status: {
    timestamp: '2026-08-01T00:05:00-04:00',
    headline: 'Static environment active',
    lines: [
      'GitHub remains the source of truth.',
      'New pages are shipping through the current static setup.',
      'FastAPI and protected staging remain the next major build phase.'
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
      id: '2026-08-01-updates-node',
      timestamp: '2026-08-01T00:05:00-04:00',
      category: 'site',
      status: 'building',
      title: 'CMX Update Node started',
      summary: 'A dedicated daily feed is being added at /updates.',
      details: [
        'Entries live in one small data file.',
        'The feed supports filters, search, commands, date links, and expandable notes.',
        'New entries appear first.'
      ],
      link: '/updates/',
      linkLabel: 'OPEN PAGE',
      pinned: true
    },
    {
      id: '2026-08-01-crystal-final',
      timestamp: '2026-08-01T00:01:00-04:00',
      category: 'site',
      status: 'complete',
      title: 'Crystal page finalized',
      summary: 'The terminal was shortened, the jokes were cut down, and the pacing was fixed.',
      details: [
        'Three questions remain.',
        'Answers stay visible before the next question loads.',
        'The main page keeps the interactive sections without the extra copy.'
      ],
      link: '/crystal/',
      linkLabel: 'OPEN /CRYSTAL',
      pinned: false
    },
    {
      id: '2026-07-31-fastapi-direction',
      timestamp: '2026-07-31T21:40:00-04:00',
      category: 'infrastructure',
      status: 'planned',
      title: 'Backend direction confirmed',
      summary: 'FastAPI on a protected Linux server remains the preferred foundation.',
      details: [
        'Dockerized FastAPI application.',
        'Cloudflare Access and Tunnel in front.',
        'Staging first. Production approval required.',
        'Astro can be added later if the frontend needs it.'
      ],
      pinned: false
    },
    {
      id: '2026-07-31-route-cleanup',
      timestamp: '2026-07-31T18:25:00-04:00',
      category: 'site',
      status: 'complete',
      title: 'Route cleanup continued',
      summary: 'Old test pages were removed and the current page structure was tightened.',
      details: [
        'Python test page removed until the backend exists.',
        'Collab routes were reorganized.',
        'The custom 404 page stayed in place.'
      ],
      pinned: false
    },
    {
      id: '2026-07-31-root-share-data',
      timestamp: '2026-07-31T16:10:00-04:00',
      category: 'site',
      status: 'complete',
      title: 'Root share data set',
      summary: 'The restricted-node title and description were finalized for shared links.',
      details: [
        'Title: CMX Restricted Node.',
        'Description: Private access to CMX research and internal tools.',
        'Google indexing remains disabled.'
      ],
      pinned: false
    }
  ]
};
