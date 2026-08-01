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
    pinned: true
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
