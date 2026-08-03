window.BRIEF_DAILY_CONTENT = {
  schemaVersion: 3,
  edition: {
    date: '2026-08-03',
    timezone: 'America/New_York',
    dailyRefresh: '08:00',
    mode: 'public-live-plus-fictional-demo'
  },
  entryDefaults: {
    music: false,
    narration: false,
    requireScenario: true
  },
  updateBoundary: {
    dailyFiles: [
      'assets/brief/brief-live-data.js',
      'assets/brief/brief-daily-content.js'
    ],
    permanentFiles: [
      'brief/index.html',
      'assets/brief/brief.css',
      'assets/brief/brief-music.css',
      'assets/brief/brief-scenarios.css',
      'assets/brief/brief-upgrade.css',
      'assets/brief/brief-live.css',
      'assets/brief/brief-daily.css',
      'assets/brief/brief-experience.css',
      'assets/brief/brief-core.js',
      'assets/brief/brief-scenario-renderer.js',
      'assets/brief/brief-upgrade.js',
      'assets/brief/brief-live.js',
      'assets/brief/brief-live-patch.js',
      'assets/brief/brief-daily.js',
      'assets/brief/brief-experience.js',
      'assets/brief/brief-team-data.js',
      'assets/brief/brief-team-renderer.js',
      'assets/brief/brief-workspace.js',
      'assets/brief/brief-workspace.css'
    ]
  },
  music: {
    featured: {
      title: 'Everywhere',
      artist: 'Fleetwood Mac',
      spotify: '1prZ0pr6XoRCxcrC3MCL0M',
      purpose: 'Optional opening track'
    },
    personal: [
      { title: 'The Recipe', artist: 'Kendrick Lamar feat. Dr. Dre', spotify: '4i0ioe6BC6qvV6FOm6nf7K', note: 'Morning momentum' },
      { title: 'Dreams', artist: 'The Cranberries', spotify: '1IFSa6KKHLeSwRe8mDlz6k', note: 'Clear focus' },
      { title: 'A Sky Full of Stars', artist: 'Coldplay', spotify: '0FDzzruyVECATHXKHFs9eJ', note: 'Afternoon lift' },
      { title: 'Best Day Of My Life', artist: 'American Authors', spotify: '5Hroj5K7vLpIG4FNCRIjbP', note: 'Reset track' }
    ],
    couple: [
      { title: 'Yellow', artist: 'Coldplay', spotify: '3AJwUDP919kvQ9QcozQPxg', note: 'Shared favorite' },
      { title: 'Dreams', artist: 'Fleetwood Mac', spotify: '0ofHAoxe9vBkTCp2UQIavz', note: 'Slow the room down' },
      { title: 'Just the Two of Us', artist: 'Grover Washington, Jr. feat. Bill Withers', spotify: '6pLE8VbtyEEF8LXa3g7vSc', note: 'Reconnect' }
    ],
    partners: [
      { title: 'On Top Of The World', artist: 'Imagine Dragons', spotify: '213x4gsFDm04hSqIUkg88w', note: 'Operating review' },
      { title: 'Lose Yourself', artist: 'Eminem', spotify: '5Z01UMMf7V1o0MzF86s6WJ', note: 'Deep work' },
      { title: 'Midnight City', artist: 'M83', spotify: '1eyzqe2QqGZUmfcPZtrIyt', note: 'Late build' }
    ],
    trainer: [
      { title: 'POWER', artist: 'Kanye West', spotify: '2gZUPNdnz5Y45eiGxpHGSc', note: 'Working sets' },
      { title: 'Till I Collapse', artist: 'Eminem feat. Nate Dogg', spotify: '4xkOaSrkexMciUUogZKVTS', note: 'Final effort' },
      { title: 'Sunflower', artist: 'Post Malone and Swae Lee', spotify: '0RiRZpuVRbi7oqRdSMwhQY', note: 'Cooldown' }
    ],
    team: [
      { title: 'Midnight City', artist: 'M83', spotify: '1eyzqe2QqGZUmfcPZtrIyt', note: 'Build focus' },
      { title: 'On Top Of The World', artist: 'Imagine Dragons', spotify: '213x4gsFDm04hSqIUkg88w', note: 'Team lift' },
      { title: 'A Sky Full of Stars', artist: 'Coldplay', spotify: '0FDzzruyVECATHXKHFs9eJ', note: 'Release moment' }
    ]
  },
  dailyQuotes: {
    individual: 'A useful day begins when the next honest action becomes visible.',
    couple: 'Care becomes practical when both people can see the next kind action.',
    partners: 'Clarity compounds when every decision has evidence, an owner and a date.',
    trainer: 'Consistency becomes easier when the plan fits the person.',
    team: 'A strong team sees the same mission without exposing every private detail.'
  },
  personalDashboard: {
    headline: 'A personal command center that changes with the day.',
    summary: 'Public information can be real. Private-looking records remain fictional until a protected backend and explicit permissions exist.',
    quote: 'A useful day begins when the next honest action becomes visible.',
    scorecards: [
      { label: 'Useful focus window', value: '3:30–5:15 PM', detail: 'Fictional calendar example', tone: 'blue' },
      { label: 'Open actions', value: '3', detail: 'One should be finished before the afternoon fragments', tone: 'amber' },
      { label: 'Inbox attention', value: '2', detail: 'Fictional messages selected for action', tone: 'violet' },
      { label: 'Knowledge quality', value: 'Growing', detail: 'Corrections and completed actions improve future briefs', tone: 'blue' }
    ],
    reportRows: [
      { area: 'Client work', status: 'Needs action', owner: 'You', next: 'Send revised scope', due: 'Today', confidence: 94 },
      { area: 'Personal admin', status: 'Waiting', owner: 'External', next: 'Review reply when received', due: 'This week', confidence: 72 },
      { area: 'Learning', status: 'On track', owner: 'You', next: 'Complete one Python concept', due: '25 min', confidence: 86 },
      { area: 'Movement', status: 'Suggested', owner: 'You', next: 'Use safest weather window', due: 'Weather dependent', confidence: 78 }
    ],
    fakeInbox: [
      { sender: 'Morgan Lee', subject: 'Prototype review notes', state: 'Reply today', reason: 'Blocks the next client decision' },
      { sender: 'Billing Platform', subject: 'Invoice payment confirmation', state: 'Information', reason: 'Changes the fictional cash picture' },
      { sender: 'Course reminder', subject: 'Python module ready', state: 'Optional', reason: 'Matches the saved learning goal' }
    ],
    projects: [
      { name: 'Website launch', health: 82, state: 'On track', next: 'Close two review notes' },
      { name: 'Personal finance cleanup', health: 58, state: 'Watch', next: 'Assign the two uncategorized expenses' },
      { name: 'Python learning path', health: 71, state: 'Building', next: 'Practice API response parsing' }
    ]
  },
  relationshipSpace: {
    labels: { left: 'Partner A', right: 'Partner B', shared: 'Couple space' },
    colors: { left: 'blue', right: 'pink' },
    left: {
      name: 'Maya',
      privateUpdates: [
        'Needs reassurance before solving logistics',
        'Saved a private note about the weekend conversation',
        'Celebrity and culture updates are part of her briefing'
      ],
      approvedShared: [
        'Dinner plan can move to 8:00 PM',
        'Wants ten calm minutes before making a decision'
      ]
    },
    right: {
      name: 'Jordan',
      privateUpdates: [
        'Focused on solving the travel plan',
        'Has a private reminder to slow down before responding',
        'Financial planning stays private until deliberately shared'
      ],
      approvedShared: [
        'Can handle the booking after work',
        'Agrees to reassurance first, logistics second'
      ]
    },
    shared: [
      { label: 'Approved plan', text: 'Review weekend travel together at 8:15 PM' },
      { label: 'Shared promise', text: 'No late-night ultimatums' },
      { label: 'Needs both', text: 'Move £300 into the trip fund' }
    ]
  },
  businessSpace: {
    labels: { left: 'London partner', right: 'New York partner', shared: 'Northstar operating space' },
    left: {
      name: 'Amina',
      private: [
        { label: 'Private concern', value: 'Team capacity', note: 'Two London projects may overlap next week' },
        { label: 'Private decision', value: 'Hold hiring', note: 'Wait for collections before approving another contractor' },
        { label: 'Private inbox', value: '4 selected', note: 'Two client replies and two internal approvals' }
      ],
      approved: [
        'Share London delivery capacity risk',
        'Escalate the at-risk client to both partners'
      ]
    },
    right: {
      name: 'Eli',
      private: [
        { label: 'Private concern', value: 'US collections', note: 'Two invoices are more than 14 days late' },
        { label: 'Private decision', value: 'Call today', note: 'Own the overdue US invoice follow-up' },
        { label: 'Private inbox', value: '3 selected', note: 'One sales reply and two payment threads' }
      ],
      approved: [
        'Share expected collection dates',
        'Own the US cash-recovery actions'
      ]
    },
    shared: [
      { label: 'Revenue MTD', value: '£82.4k', note: 'Fictional company record' },
      { label: 'Cash collected', value: '62%', note: 'Below the fictional 75% operating target' },
      { label: 'Decision', value: 'Contractor paused', note: 'Review after £18k in receivables clears' },
      { label: 'Legal watch', value: '2 items', note: 'Fictional contract renewal and data-processing review' }
    ],
    process: [
      'Public market update',
      'Approved company records',
      'Partner-private interpretation',
      'Shared operating decision',
      'Owner and deadline'
    ],
    allocation: [
      { label: 'Delivery', value: 44 },
      { label: 'Payroll', value: 28 },
      { label: 'Growth', value: 12 },
      { label: 'Tools', value: 8 },
      { label: 'Reserve', value: 8 }
    ],
    advice: [
      { kind: 'Financial', title: 'Collect before expanding fixed cost', text: 'The fictional pipeline is healthy, but cash conversion is weak. Tie contractor approval to collected receivables.' },
      { kind: 'Legal', title: 'Turn repeated exceptions into policy', text: 'Pricing and scope exceptions should become a written approval rule. This is an operational example, not legal advice.' },
      { kind: 'Strategic', title: 'Use market news only when it changes a decision', text: 'Connect public stock, energy or technology changes to actual company exposure instead of adding generic headlines.' }
    ]
  },
  trainerAccountability: {
    quote: 'Consistency becomes easier when the plan fits the person.',
    questions: [
      { id: 'movement', question: 'Did you complete today’s planned movement?', yes: 'Log the session and prepare the next progression.', no: 'Choose a smaller recovery action instead of pretending the day is lost.' },
      { id: 'protein', question: 'Did you reach the agreed protein target?', yes: 'Keep the meal pattern that worked.', no: 'Identify which meal created the gap and plan one practical correction.' },
      { id: 'sleep', question: 'Did you get at least seven hours of sleep?', yes: 'Normal training guidance can remain.', no: 'Reduce intensity if warm-up quality or coordination feels poor.' },
      { id: 'pain', question: 'Did any movement cause unusual pain?', yes: 'Stop the affected exercise and share the specific movement and sensation with the trainer.', no: 'Continue tracking without inventing a problem.' }
    ],
    week: [
      { day: 'Mon', done: true },
      { day: 'Tue', done: true },
      { day: 'Wed', done: false },
      { day: 'Thu', done: true },
      { day: 'Fri', done: null },
      { day: 'Sat', done: null },
      { day: 'Sun', done: null }
    ]
  },
  footerViews: [
    { id: 'individual', title: 'Personal', text: 'Live Brooklyn information, priorities, learning and private-life possibilities.' },
    { id: 'couple', title: 'Relationship', text: 'Two private perspectives, approved shared memory and neutral guidance.' },
    { id: 'partners', title: 'Business', text: 'KPIs, finances, projects, inboxes, decisions and ownership.' },
    { id: 'trainer', title: 'Trainer + student', text: 'Habits, goals, evidence, notes, privacy and coaching actions.' },
    { id: 'team', title: 'Team + project', text: 'Role-based member views, shared project truth, handoffs, procedures, finance and security.' }
  ]
};

(() => {
  'use strict';
  const content = window.BRIEF_DAILY_CONTENT;
  const scenarios = window.BRIEF_SCENARIOS;
  const song = window.CMX_DAILY_SONG;
  if (song) {
    song.recommendations = content.music.personal.slice(1).map(track => ({
      title: track.title,
      artist: track.artist,
      displayTitle: `${track.title} · ${track.artist}`,
      spotifyUrl: `https://open.spotify.com/track/${track.spotify}`,
      status: track.note,
      text: `A different option for ${track.note.toLowerCase()}.`
    }));
  }
  if (scenarios) {
    ['individual', 'couple', 'partners', 'trainer', 'team'].forEach(id => {
      const tracks = content.music[id === 'individual' ? 'personal' : id] || [];
      if (scenarios[id]) scenarios[id].songs = tracks.map(track => ({ ...track }));
    });
  }
})();
