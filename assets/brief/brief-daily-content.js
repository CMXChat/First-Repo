window.BRIEF_DAILY_CONTENT = {
  schemaVersion: 1,
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
      'assets/brief/brief-core.js',
      'assets/brief/brief-scenario-renderer.js',
      'assets/brief/brief-upgrade.js',
      'assets/brief/brief-live.js',
      'assets/brief/brief-live-patch.js',
      'assets/brief/brief-daily.js'
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
    ]
  },
  personalDashboard: {
    headline: 'A personal command center that changes with the day.',
    summary: 'Public information can be real. Private-looking records remain fictional until a protected backend and explicit permissions exist.',
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
  footerViews: [
    { id: 'individual', title: 'Personal', text: 'Live Brooklyn information, priorities, learning and private-life possibilities.' },
    { id: 'couple', title: 'Relationship', text: 'Two private perspectives, approved shared memory and neutral guidance.' },
    { id: 'partners', title: 'Business', text: 'KPIs, finances, projects, inboxes, decisions and ownership.' },
    { id: 'trainer', title: 'Trainer + student', text: 'Habits, goals, evidence, notes, privacy and coaching actions.' }
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
    ['individual', 'couple', 'partners', 'trainer'].forEach(id => {
      const tracks = content.music[id === 'individual' ? 'personal' : id] || [];
      if (scenarios[id]) scenarios[id].songs = tracks.map(track => ({ ...track }));
    });
  }
})();
