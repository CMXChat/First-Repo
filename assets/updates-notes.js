// DAILY NOTE EDITING
//
// Add the newest note at the top of window.CMX_DAILY_NOTES.
// Copy the example object below, change its values, add a comma after it,
// then commit the file. The /updates page will render it automatically.
//
// {
//   id: '2026-08-02-short-name',
//   timestamp: '2026-08-02T09:00:00-04:00',
//   title: 'What changed today',
//   status: 'in-progress',
//   body: [
//     'First note line.',
//     'Second note line.'
//   ],
//   links: [
//     { url: '/backend/', label: 'Open Backend Blueprint' }
//   ],
//   tags: ['backend', 'ai'],
//   pinned: false
// }

window.CMX_DAILY_NOTES = [
  {
    id: '2026-08-02-sara-hebrew-personal-brief',
    timestamp: '2026-08-02T22:15:00-04:00',
    title: 'Hebrew personal briefing created for Sara',
    status: 'complete',
    body: [
      'Created the new protected /brief route as a fully right-to-left Hebrew experience personalized around Sara’s interests and daily needs.',
      'The page includes live New York and Jerusalem clocks, weather summaries, current Israel and Middle East coverage, a Tuesday Brooklyn beach plan, 1980s music after login, Hebrew read-aloud controls, step tracking, strength and gentle yoga exercises, and healthy food ideas.',
      'The briefing explains the larger personalized briefing product and why Python is being learned, while keeping future calendar, email and finance connections clearly marked as not connected.',
      'The page uses the password requested for Sara and is registered as a direct-link-only protected briefing.'
    ],
    links: [
      { url: '/brief/', label: 'Open Sara Brief' },
      { url: '/plans/', label: 'Open Product Plans' },
      { url: '/updates/', label: 'Open Platform Notes' }
    ],
    tags: ['briefing', 'hebrew', 'sara', 'personalization'],
    pinned: true
  },
  {
    id: '2026-08-02-personal-os-plan-entry',
    timestamp: '2026-08-02T21:00:00-04:00',
    title: 'Personal OS product plan added as a protected plan entry',
    status: 'complete',
    body: [
      'Created the new gated /plans route using the same terminal notebook language as /updates.',
      'Added the first plan entry, Personal OS, covering the scheduled briefing, alarm-style music and narration, personalized dashboard, structured memory, private and shared spaces, connected services, relationship and business use cases, and the Python development path.',
      'The plans page is structured as a dated entry feed so additional product and platform plans can be added later without redesigning the route.',
      'The entry describes the intended product direction honestly and does not present planned backend, connector, memory or alarm features as already live.'
    ],
    links: [
      { url: '/plans/', label: 'Open Plans' },
      { url: '/news/', label: 'Open Current Briefing Prototype' },
      { url: '/updates/', label: 'Open Platform Notes' }
    ],
    tags: ['plans', 'personal-os', 'briefing', 'product'],
    pinned: true
  },
  {
    id: '2026-08-01-ai-backend-terminal-completion',
    timestamp: '2026-08-01T19:57:00-04:00',
    title: 'AI and Backend blueprints completed in the terminal notebook system',
    status: 'complete',
    body: [
      'AI Control Blueprint was reviewed end to end and retained in the shared black-and-white terminal design because its content and layout already matched the new direction.',
      'Backend Blueprint now uses the same terminal foundation across the overview, tabs, API filters, endpoint registry, page map, infrastructure, data models, permissions, roadmap and decisions.',
      'Endpoint dialogs, search fields, tables, status labels and mobile layouts were restyled so the blue dashboard does not appear underneath the terminal theme.',
      'All API contracts, AI plans, route connections, security controls and interactive functionality remain intact.'
    ],
    links: [
      { url: '/ai/', label: 'Open AI Blueprint' },
      { url: '/backend/', label: 'Open Backend Blueprint' },
      { url: '/updates/', label: 'Open Platform Notes' }
    ],
    tags: ['ai', 'backend', 'design'],
    pinned: true
  },
  {
    id: '2026-08-01-build-ai-terminal-design',
    timestamp: '2026-08-01T19:48:00-04:00',
    title: 'Build Lab and AI Blueprint moved to the terminal notebook design system',
    status: 'complete',
    body: [
      'Build Lab and AI Control Blueprint now use the same black, white and gray terminal language as Platform Notes.',
      'The glossy blue dashboard backgrounds, rounded cards, gradients and colored status panels were removed.',
      'Restrained blue remains only for links and clickable controls so navigation is still easy to identify.',
      'All route checks, tables, workflows, AI planning details and security information remain intact.'
    ],
    links: [
      { url: '/build/', label: 'Open Build Lab' },
      { url: '/ai/', label: 'Open AI Blueprint' },
      { url: '/updates/', label: 'Open Platform Notes' }
    ],
    tags: ['build', 'ai', 'design'],
    pinned: false
  },
  {
    id: '2026-08-01-terminal-notes-restored',
    timestamp: '2026-08-01T19:38:00-04:00',
    title: 'Terminal notes layout restored without removing the platform plan',
    status: 'complete',
    body: [
      'The updates page is returning to a black-and-white terminal notebook style with restrained blue links.',
      'The complete backend, AI, MCP, sandbox, staging, security and implementation information remains available below the notes.',
      'Daily updates now live in this separate file so new notes can be added without editing the full project briefing.',
      'A browser helper can generate a ready-to-paste note object and open this file in the GitHub editor.'
    ],
    links: [
      { url: '/updates/', label: 'Open Platform Notes' },
      { url: '/ai/', label: 'Open AI Blueprint' },
      { url: '/backend/', label: 'Open Backend Blueprint' }
    ],
    tags: ['updates', 'design', 'workflow'],
    pinned: false
  },
  {
    id: '2026-08-01-platform-planning-layer',
    timestamp: '2026-08-01T18:48:00-04:00',
    title: 'Backend, AI and operations planning layer completed',
    status: 'complete',
    body: [
      'Backend Blueprint documents the core and AI API contracts, infrastructure, page connections, data models, permissions and delivery phases.',
      'AI Control Blueprint documents normal-language commands, project context, GitHub development, MCP, user assistants, sandboxes, staging, approvals, automation and emergency controls.',
      'Build Lab is the operational view for route checks now and application health, deployment, logs, incidents and rollback later.',
      'The platform is still static. No Python backend, database, AI service, MCP server or production automation is active yet.'
    ],
    links: [
      { url: '/build/', label: 'Open Build Lab' },
      { url: '/backend/', label: 'Open Backend Blueprint' },
      { url: '/ai/', label: 'Open AI Blueprint' }
    ],
    tags: ['backend', 'ai', 'infrastructure'],
    pinned: false
  }
];