window.CMX_BRIEF_CONCEPT = {
  meta: {
    label: 'PERSONAL BRIEFING CONCEPT',
    title: 'One place for the day ahead',
    description: 'A flexible example of how a private daily briefing can combine personal context, live information, connected services and approved actions.',
    updated: 'Concept framework · ready for customization'
  },
  status: [
    { label: 'Profile', value: 'Demo profile' },
    { label: 'Privacy', value: 'Private by default' },
    { label: 'Connections', value: 'Not connected' }
  ],
  sections: [
    {
      id: 'overview',
      eyebrow: 'START HERE',
      title: 'Today at a glance',
      intro: 'The first screen should answer what matters, what changed and what needs attention.',
      cards: [
        { tag: 'Priority', title: 'Three decisions, clearly ranked', text: 'Surface the most important personal, practical and professional items without turning the page into a task dump.' },
        { tag: 'Context', title: 'What changed since yesterday', text: 'Summarize new developments, updates, risks and useful opportunities.' },
        { tag: 'Action', title: 'Move from reading to doing', text: 'Future approved actions can include replies, reminders, calendar changes and follow-up tasks.' }
      ]
    },
    {
      id: 'live',
      eyebrow: 'LIVE LAYER',
      title: 'Weather, time and movement',
      intro: 'Fresh external information can sit beside personal plans and location-aware recommendations.',
      cards: [
        { tag: 'Weather', title: 'Local forecast card', text: 'Current conditions, alerts, best activity window and practical preparation.' },
        { tag: 'Calendar', title: 'Schedule and free windows', text: 'Meetings, appointments, travel time, conflicts and realistic focus blocks.' },
        { tag: 'Health', title: 'Gentle accountability', text: 'Steps, workouts, sleep or routines can appear only when connected and approved.' }
      ]
    },
    {
      id: 'personal',
      eyebrow: 'PERSONAL LAYER',
      title: 'A briefing that remembers the right things',
      intro: 'Structured memory can make each edition more useful while keeping control with the person using it.',
      cards: [
        { tag: 'Preferences', title: 'Interests, tone and routines', text: 'The page can adapt to preferred music, topics, language, reading style and daily rhythm.' },
        { tag: 'Boundaries', title: 'Clear memory controls', text: 'People decide what is remembered, what is temporary and what should never be stored.' },
        { tag: 'Questions', title: 'One useful prompt at a time', text: 'A small daily question can improve future editions without demanding a full activity log.' }
      ]
    },
    {
      id: 'shared',
      eyebrow: 'SHARED SPACES',
      title: 'Private profiles with approved collaboration',
      intro: 'Individuals keep personal information separate while choosing what can enter a shared space.',
      cards: [
        { tag: 'Couples', title: 'Separate private views plus one shared view', text: 'Plans, trips, goals and agreed reminders can be shared without exposing unrelated private details.' },
        { tag: 'Families', title: 'Appointments and household coordination', text: 'A family view can track schedules, responsibilities and follow-up items.' },
        { tag: 'Partners', title: 'Meetings, decisions and money', text: 'Business partners can share responsibilities, revenue, expenses, decisions and next actions.' }
      ]
    },
    {
      id: 'connections',
      eyebrow: 'CONNECTIONS',
      title: 'Services that could power the briefing',
      intro: 'Every connector remains off until a person explicitly authorizes it.',
      cards: [
        { tag: 'Email', title: 'Important messages and reply needs', text: 'Not connected in this concept.' },
        { tag: 'Calendar', title: 'Appointments, meetings and reminders', text: 'Not connected in this concept.' },
        { tag: 'Finance', title: 'Balances, bills and cash-flow context', text: 'Not connected in this concept.' }
      ]
    }
  ]
};