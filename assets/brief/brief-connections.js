window.BRIEF_CONNECTIONS = [
  { id: 'calendar', label: 'Google Calendar', status: 'demo', description: 'Fictional schedule and free-window data demonstrate the connected experience.', permission: 'read-calendar / create-event with confirmation' },
  { id: 'email', label: 'Gmail', status: 'not-connected', description: 'A connected version could summarize important threads and prepare drafts without sending them automatically.', permission: 'read-email / draft-email' },
  { id: 'music', label: 'Spotify', status: 'demo', description: 'An authorized preview and real Spotify embeds demonstrate daily songs, favorites and shared playlists.', permission: 'read-music / play-music' },
  { id: 'weather', label: 'Weather services', status: 'demo', description: 'The concept uses demonstration conditions. A production version would refresh verified location forecasts.', permission: 'read-location-weather' },
  { id: 'finance', label: 'Financial accounts', status: 'requires-approval', description: 'Personal or business balances, transactions and KPIs would require an explicit protected connection.', permission: 'read-finances' },
  { id: 'health', label: 'Workout and health apps', status: 'requires-approval', description: 'Training, sleep and health context remain private unless the user approves specific sharing.', permission: 'read-health / log-workout' },
  { id: 'tasks', label: 'Task systems', status: 'planned', description: 'Briefing items could become tasks, completed actions or owner updates after confirmation.', permission: 'read-tasks / update-task' },
  { id: 'memory', label: 'Structured memory database', status: 'planned', description: 'Approved facts would include source, confidence, sensitivity, expiry and sharing rules.', permission: 'remember / correct / delete / share' },
  { id: 'actions', label: 'Approved actions', status: 'planned', description: 'Buttons explain future reminders, events, drafts, logs and shared updates without pretending they already execute.', permission: 'action-specific confirmation' }
];
