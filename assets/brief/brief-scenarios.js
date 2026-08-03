window.BRIEF_SCENARIOS = {
  individual: {
    kicker: 'PERSONAL OPERATING BRIEF',
    title: 'One person, one organized day.',
    summary: 'The page can quietly combine time, weather, work, messages, money, habits, music and advice, then change emphasis as the day changes.',
    tabs: ['day-cycle', 'personal-intelligence', 'soundtrack'],
    dayCycle: [
      { time: 'Morning', title: 'Wake up informed', text: 'A selected song starts after permission. A chosen voice reads weather, schedule, urgent messages and the first useful action.' },
      { time: 'During the day', title: 'Update only what changed', text: 'A delayed meeting, new email, rain alert or completed task can change the brief without forcing the user to select a new mode.' },
      { time: 'Evening', title: 'Close the loop', text: 'A shorter review can show what was completed, what moved, what should be remembered and what belongs tomorrow.' }
    ],
    intelligence: [
      { label: 'Personalized news', title: 'Only the topics Alex follows', value: '3 useful stories', note: 'Each item explains why it matters and separates reporting from analysis.' },
      { label: 'Important email', title: 'Client approved the revised scope', value: 'Reply suggested', note: 'The briefing can summarize the thread and prepare a draft without sending it.' },
      { label: 'Money', title: 'Two bills due this week', value: '$486 total', note: 'Financial data would appear only after an approved connection.' },
      { label: 'Preferred tone', title: 'Direct, practical and low-noise', value: 'Remembered', note: 'The presentation adapts without changing facts.' }
    ],
    songs: [
      { title: 'Everywhere', artist: 'Fleetwood Mac', spotify: '1prZ0pr6XoRCxcrC3MCL0M', note: 'Daily lift' },
      { title: 'A Sky Full of Stars', artist: 'Coldplay', spotify: '0FDzzruyVECATHXKHFs9eJ', note: 'Focus energy' },
      { title: 'Best Day Of My Life', artist: 'American Authors', spotify: '5Hroj5K7vLpIG4FNCRIjbP', note: 'Reset track' }
    ]
  },
  couple: {
    kicker: 'COUPLE BRIEF + NEUTRAL MEDIATOR',
    title: 'Helpful between two people, loyal to neither side.',
    summary: 'The AI can organize approved shared history, reflect both perspectives, remember promises and suggest calmer next steps without diagnosing, judging or declaring a winner.',
    perspectives: [
      { person: 'Maya', label: 'Private perspective', text: 'I wanted reassurance before we moved on to logistics. When the conversation changed topics, I felt dismissed.', privacy: 'Shared only after Maya approves this summary.' },
      { person: 'Jordan', label: 'Private perspective', text: 'I thought solving the weekend plan would reduce stress. I did not understand that reassurance needed to come first.', privacy: 'Shared only after Jordan approves this summary.' }
    ],
    mediator: [
      { step: '1', title: 'Reflect both views', text: 'Maya wanted emotional acknowledgement. Jordan tried to reduce stress by solving the practical problem. Both intentions can be true.' },
      { step: '2', title: 'Check the summary', text: 'Each person can correct the wording before it is stored or added to the shared space.' },
      { step: '3', title: 'Suggest a small repair', text: 'Jordan gives one clear reassurance. Maya confirms whether it landed. Then both return to the weekend decision.' },
      { step: '4', title: 'Remember the agreement', text: 'Only after both approve it: reassurance first, logistics second when the same pattern appears again.' }
    ],
    promises: [
      { title: 'No late-night ultimatums', status: 'Confirmed by both', review: 'Review in 30 days' },
      { title: 'Ten calm minutes before problem-solving', status: 'Shared ritual', review: 'Next reminder tonight' },
      { title: 'Ask before sharing private notes', status: 'Privacy boundary', review: 'Always active' }
    ],
    friendActions: [
      'Translate a heated message into calmer language without changing its meaning',
      'Summarize what each person said and flag where they actually agree',
      'Remember approved promises and surface them at the right time',
      'Suggest a pause, a smaller question or a practical next step',
      'Help plan dates, travel, budgets, rituals and shared goals',
      'Keep private processing separate from the shared relationship space'
    ],
    songs: [
      { title: 'Everywhere', artist: 'Fleetwood Mac', spotify: '1prZ0pr6XoRCxcrC3MCL0M', note: 'Shared daily song' },
      { title: 'Dreams', artist: 'The Cranberries', spotify: '3W486X36Id1ChRaLhseMBj', note: 'Maya favorite' },
      { title: 'Yellow', artist: 'Coldplay', spotify: '3AJwUDP919kvQ9QcozQPxg', note: 'Jordan favorite' }
    ]
  },
  partners: {
    kicker: 'BUSINESS PARTNER OPERATING BRIEF',
    title: 'A calm operating room for New York and London.',
    summary: 'The shared brief turns financial records, calendars, email, client work and decisions into one view with owners, deadlines and evidence.',
    clocks: [
      { city: 'London', zone: 'Europe/London', person: 'Amina', note: 'Primary office' },
      { city: 'New York', zone: 'America/New_York', person: 'Eli', note: 'US partner' }
    ],
    kpis: [
      { label: 'Revenue MTD', value: '£82.4k', delta: '+12.8%', tone: 'positive' },
      { label: 'Gross margin', value: '58%', delta: '+3 pts', tone: 'positive' },
      { label: 'Open pipeline', value: '£146k', delta: '41% weighted', tone: 'neutral' },
      { label: 'Receivables', value: '£31k', delta: '3 overdue', tone: 'risk' },
      { label: 'Client retention', value: '94%', delta: '1 account at risk', tone: 'risk' }
    ],
    charts: {
      revenue: {
        label: 'Six-month revenue',
        values: [54, 61, 58, 70, 74, 82],
        labels: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
        prefix: '£',
        suffix: 'k'
      },
      cash: {
        label: 'Cash collected vs due',
        values: [68, 76, 72, 81, 65, 62],
        labels: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
        prefix: '',
        suffix: '%'
      }
    },
    actions: [
      { owner: 'Amina', title: 'Book executive recovery call', due: 'Today · 7 PM UK', status: 'Client risk' },
      { owner: 'Eli', title: 'Collect two overdue US invoices', due: 'Today · 3 PM NY', status: 'Cash' },
      { owner: 'Both', title: 'Approve contractor start date', due: 'Operating review', status: 'Decision' },
      { owner: 'Unassigned', title: 'Document pricing exception rule', due: 'Before Friday', status: 'Needs owner' }
    ],
    advice: [
      { title: 'Do not hire from pipeline alone', text: 'The work is likely, but the cash is not collected. Approve the contractor only with a receivables owner and a cash threshold.' },
      { title: 'The at-risk client needs executive contact', text: 'Delivery fixes are already underway. The missing piece is confidence and ownership at the partner level.' },
      { title: 'One decision is being repeated', text: 'Pricing exceptions appeared in three meetings. Turn the repeated debate into a written rule.' }
    ],
    news: [
      { label: 'DEMO INDUSTRY NEWS', title: 'Two competitors moved toward outcome-based retainers', text: 'The briefing could watch pricing changes and explain whether they affect Northstar’s positioning.' },
      { label: 'DEMO CLIENT INTELLIGENCE', title: 'A major client announced a UK expansion', text: 'This could become a timely account-growth conversation for the London partner.' },
      { label: 'DEMO OPERATING SIGNAL', title: 'Support response time improved for a third week', text: 'Internal performance can be treated as news when it changes a decision.' }
    ],
    songs: [
      { title: 'A Sky Full of Stars', artist: 'Coldplay', spotify: '0FDzzruyVECATHXKHFs9eJ', note: 'Operating review energy' },
      { title: 'Everywhere', artist: 'Fleetwood Mac', spotify: '1prZ0pr6XoRCxcrC3MCL0M', note: 'UK–US shared pick' },
      { title: 'Best Day Of My Life', artist: 'American Authors', spotify: '5Hroj5K7vLpIG4FNCRIjbP', note: 'Post-review reset' }
    ]
  },
  trainer: {
    kicker: 'TRAINER + STUDENT PROGRESS SPACE',
    title: 'The plan learns from completed work, not motivational speeches.',
    summary: 'Approved workouts, notes, sleep, nutrition and schedule patterns can help the coach adapt the plan while the student controls private health context.',
    people: [
      { role: 'Trainer', name: 'Nina', sees: 'Approved workouts, shared goals, pain flags and plan feedback', private: 'Draft programming notes and other clients remain private' },
      { role: 'Student', name: 'Sam', sees: 'Plan, progress, explanations, goals and every shared conclusion', private: 'Journal entries, body-image notes and unshared health context remain private' }
    ],
    habits: [
      { label: 'Sessions', value: 75, display: '3 of 4', insight: 'Completion is highest when the session starts before 6:30 PM.' },
      { label: 'Sleep', value: 68, display: '6.8 hours', insight: 'Lower sleep has matched weaker lower-body sessions twice this month.' },
      { label: 'Protein', value: 82, display: '82% target', insight: 'The gap is usually at dinner, not breakfast.' },
      { label: 'Steps', value: 81, display: '8.1k average', insight: 'Walking stays consistent even when gym sessions move.' }
    ],
    patterns: [
      { status: 'PATTERN', title: 'Late sessions are skipped more often', evidence: '4 of the last 5 completed sessions began before 6:30 PM.', action: 'Move Thursday to 6 PM after confirmation.' },
      { status: 'POSSIBLE PATTERN', title: 'Sleep may affect squat performance', evidence: 'Only two matching examples exist.', action: 'Track two more weeks before treating this as reliable.' },
      { status: 'CORRECTION SAVED', title: 'Knee discomfort is not constant', evidence: 'Sam corrected an earlier broad note.', action: 'Keep the specific movement trigger, delete the inaccurate generalization.' }
    ],
    notes: [
      { source: 'Student note', text: 'Knee felt tight during stairs, fine during the warm-up.', state: 'TEMPORARY · 48 HOURS' },
      { source: 'Coach input', text: 'Use the last session weights only if the warm-up remains pain-free.', state: 'SHARED PLAN' },
      { source: 'AI suggestion', text: 'Ask before changing the program because the evidence is incomplete.', state: 'SUGGESTED' }
    ],
    songs: [
      { title: 'Best Day Of My Life', artist: 'American Authors', spotify: '5Hroj5K7vLpIG4FNCRIjbP', note: 'Warm-up' },
      { title: 'A Sky Full of Stars', artist: 'Coldplay', spotify: '0FDzzruyVECATHXKHFs9eJ', note: 'Working sets' },
      { title: 'Dreams', artist: 'The Cranberries', spotify: '3W486X36Id1ChRaLhseMBj', note: 'Cooldown' }
    ]
  },
  education: {
    dailyRhythm: [
      { label: 'MORNING', title: 'Wake up to the useful version of today', text: 'Music, voice, weather, schedule, important messages and the first action can arrive together.' },
      { label: 'DAYTIME', title: 'The same page updates when circumstances change', text: 'A meeting moves, rain arrives, an invoice is paid or a task is completed. The page adjusts without asking the user to rebuild it.' },
      { label: 'EVENING', title: 'A shorter review prepares tomorrow', text: 'The system can summarize progress, unresolved items and memory questions before the day closes.' }
    ],
    learning: [
      { id: 'onboarding', label: '1', title: 'Onboarding questions', text: 'The user chooses goals, interests, tone, routines, boundaries and what services may be connected.' },
      { id: 'conversation', label: '2', title: 'Normal conversations', text: 'The AI can notice preferences or context, but sensitive conclusions do not silently become permanent.' },
      { id: 'actions', label: '3', title: 'Completed actions', text: 'Finishing, postponing or correcting items creates better evidence than guesses about personality.' },
      { id: 'connections', label: '4', title: 'Approved accounts', text: 'Calendar, email, Spotify, finances, tasks, workouts and notes provide structured information with permission.' },
      { id: 'patterns', label: '5', title: 'Patterns over time', text: 'The system can suggest a pattern, show the evidence and ask whether it should be saved, corrected or ignored.' }
    ],
    memoryChoices: [
      { action: 'Remember', text: 'Keep an approved fact or preference for future briefings.' },
      { action: 'Temporary', text: 'Use the context for hours or days, then let it expire.' },
      { action: 'Correct', text: 'Replace an inaccurate conclusion and preserve the correction history.' },
      { action: 'Delete', text: 'Remove the record from future use.' },
      { action: 'Share', text: 'Move only the approved summary into a specific shared space.' }
    ],
    capabilities: [
      { group: 'day', title: 'Weather and timing', text: 'Current conditions, alerts, activity windows, travel impact and multiple locations.' },
      { group: 'day', title: 'Schedule and reminders', text: 'Meetings, appointments, free windows, conflicts, alarms and follow-ups.' },
      { group: 'communication', title: 'Email and messages', text: 'Important threads, reply needs, suggested drafts and unresolved promises.' },
      { group: 'intelligence', title: 'Personalized news', text: 'Topics the user follows, why each story matters and what changed since yesterday.' },
      { group: 'money', title: 'Personal finances', text: 'Bills, balances, cash flow, subscriptions and risks after an approved connection.' },
      { group: 'business', title: 'Business numbers', text: 'Revenue, expenses, receivables, pipeline, KPIs, clients, risks and owners.' },
      { group: 'health', title: 'Health and workouts', text: 'Plans, habits, progress, symptoms, sleep, nutrition and safety boundaries.' },
      { group: 'relationships', title: 'Relationships and shared plans', text: 'Memories, promises, travel, budgets, rituals, conversations and neutral summaries.' },
      { group: 'media', title: 'Music and voice', text: 'Favorite songs, playlists, mood-based selections, provider playback and chosen narration.' },
      { group: 'work', title: 'Tasks and projects', text: 'Priorities, deadlines, blockers, completed actions and the smallest useful next step.' },
      { group: 'preferences', title: 'Tone and personality', text: 'Direct, gentle, funny, detailed, brief, visual or highly structured presentation.' },
      { group: 'actions', title: 'Approved actions', text: 'Create reminders, add events, draft messages, log workouts, save notes or update shared plans.' }
    ],
    comparison: [
      { side: 'Normal AI chat', items: ['Starts mostly from the current prompt', 'Context may be unstructured or temporary', 'Usually one user and one conversation', 'User must repeatedly ask for updates', 'Actions and permissions are limited or separate'] },
      { side: 'Personal briefing platform', items: ['Receives approved structured memory', 'Knows which facts are private, temporary or shared', 'Supports individual profiles and shared spaces', 'Updates on a schedule and when connected data changes', 'Can turn briefing items into approved actions'] }
    ],
    backendFlow: [
      'The briefing page',
      'FastAPI and authentication',
      'Profile, memory and permission services',
      'Approved accounts and public data',
      'Database, scheduled updates and action log'
    ]
  }
};
