window.BRIEF_DEMO_DATA = {
  meta: {
    product: 'Spaces',
    title: 'A clear view of what matters today',
    description: 'A working daily briefing that organizes approved information around clear Spaces, permissions, goals, and next steps.',
    defaultScenario: 'personal'
  },
  navigation: [
    { id: 'today', label: 'Today' },
    { id: 'workspace', label: 'Explore' },
    { id: 'spaces', label: 'Spaces' },
    { id: 'how', label: 'How it works' }
  ],
  scenarios: {
    personal: {
      id: 'personal',
      label: 'Personal',
      short: 'One person, one useful day',
      entryPreview: {
        badge: 'Start here',
        kicker: 'PERSONAL BRIEF',
        title: 'Your day is already sorted by what matters next',
        copy: 'Calendar, money, weather, work, and habits form one current view. Everything begins private, and you choose what another Space can receive.',
        metrics: [{ label: 'Next', value: '2:30 PM' }, { label: 'Actions', value: '3' }, { label: 'Default', value: 'Private' }],
        privateLabel: 'Personal records stay private',
        sharedLabel: 'Only chosen details can leave this Space'
      },
      greeting: 'Good afternoon, Alex.',
      headline: 'Here’s what your day looks like',
      summary: 'Schedule, priorities, money, movement and useful context are organized around what matters next.',
      next: {
        time: '2:30 PM',
        title: 'Website review with Morgan',
        detail: 'Use the 45-minute review to open the prototype and leave with one clear owner.'
      },
      recommendation: {
        label: 'Recommended next move',
        title: 'Send the revised scope before the afternoon fills up',
        detail: 'This clears the main work blocker and protects the later focus window.',
        targetTab: 'work'
      },
      priority: {
        label: 'Money review',
        title: 'Two charges still need a category',
        detail: 'A short confirmation keeps the weekly cash view accurate.',
        tone: 'info',
        targetTab: 'money'
      },
      checkIn: {
        question: 'Did you complete today’s movement plan?',
        choices: ['Done', 'Shorter session', 'Later today'],
        placeholder: 'Add one short correction or detail'
      },
      weather: {
        location: 'Brooklyn, New York',
        temperature: 82,
        condition: 'Mostly sunny',
        high: 84,
        low: 71,
        advice: 'Best outdoor window: 5:30 to 7:30 PM.',
        hourly: [
          { time: 'Now', temp: 82, rain: 8 },
          { time: '3 PM', temp: 84, rain: 10 },
          { time: '5 PM', temp: 81, rain: 12 },
          { time: '7 PM', temp: 77, rain: 9 }
        ]
      },
      stats: [
        { label: 'Focus window', value: '3:30-5:15', note: 'Calendar example' },
        { label: 'Open actions', value: '3', note: 'One blocks progress' },
        { label: 'Cash watch', value: '$486', note: 'Fictional bills due' },
        { label: 'Movement', value: '30 min', note: 'Suggested today' }
      ],
      flow: [
        { time: '2:30', title: 'Website review', meta: 'Client work' },
        { time: '3:30', title: 'Protected focus', meta: 'Send revised scope' },
        { time: '5:30', title: 'Movement window', meta: 'Weather supported' },
        { time: '8:00', title: 'Daily close', meta: 'Prepare tomorrow' }
      ],
      highlights: [
        { tab: 'habits', label: 'Private habits', detail: 'Weekly rhythm, streak records, and approved sharing' },
        { tab: 'money', label: 'Money review', detail: 'Bills, open categories, and approval boundaries' },
        { tab: 'day', label: 'Day plan', detail: 'Timing, conditions, and useful open windows' }
      ],
      tabs: [
        { id: 'day', label: 'Day' },
        { id: 'work', label: 'Work' },
        { id: 'money', label: 'Money' },
        { id: 'habits', label: 'Habits' },
        { id: 'wellness', label: 'Wellness' },
        { id: 'connections', label: 'Connections' }
      ],
      details: {
        day: {
          layout: 'personal-day',
          title: 'Your day in one practical view',
          summary: 'Time, conditions and the next useful windows stay in one view.',
          calendar: {
            label: 'August 2026', days: 31, startOffset: 5, selected: 8, note: '3 fixed days',
            markers: [{ day: 4, tone: 'personal' }, { day: 7, tone: 'shared' }, { day: 8, tone: 'care' }, { day: 12, tone: 'personal' }, { day: 18, tone: 'shared' }, { day: 24, tone: 'personal' }]
          },
          schedule: [
            { time: '2:30 PM', title: 'Website review', context: 'Client work · prototype and questions', duration: '45m', tone: 'blue' },
            { time: '3:30 PM', title: 'Protected focus', context: 'Send the revised scope', duration: '1h 45m', tone: 'violet' },
            { time: '5:30 PM', title: 'Movement window', context: 'Weather supported', duration: '30m', tone: 'green' },
            { time: '8:00 PM', title: 'Daily close', context: 'Place open work on tomorrow', duration: '15m', tone: 'amber' }
          ],
          capacity: [
            { day: 'M', value: 82, label: 'Full' }, { day: 'T', value: 64, label: 'Good' }, { day: 'W', value: 91, label: 'Full' }, { day: 'T', value: 58, label: 'Open' }, { day: 'F', value: 73, label: 'Today', current: true }, { day: 'S', value: 32, label: 'Light' }, { day: 'S', value: 24, label: 'Light' }
          ],
          cards: [
            { label: 'Next', title: 'Website review', detail: 'Prepare the prototype and two launch questions.' },
            { label: 'Later', title: 'Protected focus', detail: 'Keep 3:30 to 5:15 clear for the revised scope.' },
            { label: 'Evening', title: 'Reset the day', detail: 'Place remaining work on tomorrow’s plan before closing the day.' }
          ]
        },
        work: {
          layout: 'status-board',
          title: 'Projects, messages and ownership',
          summary: 'Only the work that changes the next decision appears here.',
          cards: [
            { label: 'Needs action', title: 'Website launch', detail: 'Close two review notes and send the revised scope.' },
            { label: 'Waiting', title: 'Hosting access', detail: 'Review the reply when it arrives.' },
            { label: 'Learning', title: 'Python path', detail: 'Complete one API response parsing exercise.' }
          ]
        },
        money: {
          layout: 'metric-bars',
          title: 'Enough financial context to notice what needs attention',
          summary: 'The demonstration uses fictional records until protected financial connections exist.',
          cards: [
            { label: 'Bills', title: '$486 due this week', detail: 'Two fictional scheduled expenses.' },
            { label: 'Review', title: 'Two uncategorized items', detail: 'A real system should ask before categorizing.' },
            { label: 'Boundary', title: 'Approval required', detail: 'Every payment waits for explicit approval.' }
          ]
        },
        habits: {
          layout: 'habits',
          title: 'Private progress you can understand at a glance',
          summary: 'The habit record shows what happened, the current rhythm, and the next useful check-in. A shared Space receives only the progress you choose to share.',
          cards: [
            { label: 'Gym', title: '4 sessions this week', detail: 'The weekly target is complete, and the best recorded streak is 16 days.', scope: 'Private' },
            { label: 'Morning reset', title: '6-day streak', detail: 'Six short check-ins were completed before the workday started.', scope: 'Private' },
            { label: 'Shared plan', title: 'Friday walk at 5:30 PM', detail: 'Only the agreed time and activity appear in the Relationship Space.', scope: 'Shared' }
          ],
          habits: [
            { name: 'Gym', current: '4 this week', best: '16-day record', target: '4 days', note: 'Weekly target complete', days: [true, true, true, false, true, false, false] },
            { name: 'Morning reset', current: '6 days', best: '11-day record', target: 'Daily', note: 'One check-in remains this week', days: [true, true, true, true, true, true, false] },
            { name: 'Evening walk', current: '3 this week', best: '9-day record', target: '5 days', note: 'Two useful windows remain', days: [true, false, true, false, true, false, false] }
          ]
        },
        wellness: {
          layout: 'readiness-dial',
          title: 'Movement, energy and a realistic next step',
          summary: 'The plan can become smaller and still preserve the habit.',
          cards: [
            { label: 'Movement', title: '30 minutes outside', detail: 'Use the safer weather window after 5:30 PM.' },
            { label: 'Energy', title: 'Moderate', detail: 'Keep the workout simple and finish it.' },
            { label: 'Correction', title: 'Protect consistency', detail: 'A shorter session still counts as useful evidence.' }
          ]
        },
        connections: {
          layout: 'connection-map',
          title: 'Honest connection status',
          summary: 'Every provider states what is live, fictional, disconnected or planned.',
          cards: [
            { label: 'Demo', title: 'Calendar', detail: 'Fictional schedule data in this prototype.' },
            { label: 'Public', title: 'Weather', detail: 'Designed for a live public data source.' },
            { label: 'Planned', title: 'Email and finance', detail: 'Protected access and explicit permissions required.' }
          ]
        }
      },
      space: {
        title: 'Personal Space',
        private: ['Goals and routines', 'Private notes and reflections', 'Financial context and personal history'],
        shared: ['One approved project update', 'A calendar plan shared with someone else', 'A task assigned to a collaborator']
      },
      soundtrack: {
        title: 'You Get What You Give',
        artist: 'New Radicals',
        spotifyTrackId: '64JjHOHdwlJ0O4JiesvmW0',
        previewUrl: '',
        note: 'A bright track for getting one real task done.',
        alternates: [
          { title: 'Everywhere', artist: 'Fleetwood Mac', spotifyTrackId: '1prZ0pr6XoRCxcrC3MCL0M', note: 'A lighter start to the day.' },
          { title: 'A Sky Full of Stars', artist: 'Coldplay', spotifyTrackId: '0FDzzruyVECATHXKHFs9eJ', note: 'A focused afternoon lift.' }
        ]
      }
    },
    relationship: {
      id: 'relationship',
      label: 'Relationship',
      short: 'Two private profiles, one approved shared Space',
      entryPreview: {
        badge: 'Two people',
        kicker: 'RELATIONSHIP BRIEF',
        title: 'One shared plan built from what both people approved',
        copy: 'Plans, commitments, and decisions meet here. Maya and Jordan keep separate private profiles beside the shared Space.',
        metrics: [{ label: 'Shared plans', value: '3' }, { label: 'Needs both', value: '1' }, { label: 'Check-in', value: '8:15 PM' }],
        privateLabel: 'Each person keeps a private profile',
        sharedLabel: 'Approved plans appear for both'
      },
      greeting: 'Good evening, Maya and Jordan.',
      headline: 'Start with reassurance, then work through the plan',
      summary: 'Each person keeps a private profile while the shared Space holds plans, promises and approved context.',
      next: { time: '8:15 PM', title: 'Weekend travel check-in', detail: 'Ten calm minutes, then decide the booking owner.' },
      recommendation: { label: 'Recommended next move', title: 'Confirm the plan and keep the discussion focused.', detail: 'Use the shared facts, name what still needs approval, and leave private processing private.', targetTab: 'plans' },
      priority: { label: 'Needs both', title: 'The $300 trip transfer still needs approval', detail: 'The transfer remains prepared and untouched until both people confirm it.', tone: 'shared', targetTab: 'plans' },
      checkIn: { question: 'Is tonight’s 8:15 check-in still a good time?', choices: ['Yes', 'Move it', 'Skip tonight'], placeholder: 'Add a short timing update' },
      weather: { location: 'Shared trip context', temperature: 76, condition: 'Clear evening', high: 78, low: 65, advice: 'A short walk could make the check-in easier.', hourly: [{ time: 'Now', temp: 76, rain: 4 }, { time: '8 PM', temp: 73, rain: 5 }, { time: '10 PM', temp: 69, rain: 7 }, { time: 'Late', temp: 66, rain: 8 }] },
      stats: [
        { label: 'Shared plans', value: '3', note: 'Two approved' },
        { label: 'Needs both', value: '1', note: 'Trip budget' },
        { label: 'Next check-in', value: '8:15', note: 'Ten minutes' },
        { label: 'Private profiles', value: '2', note: 'Separate by default' }
      ],
      flow: [
        { time: '6:30', title: 'Personal decompression', meta: 'Private time' },
        { time: '8:15', title: 'Shared check-in', meta: 'Travel plan' },
        { time: '8:30', title: 'Booking decision', meta: 'Needs both' },
        { time: 'Later', title: 'Shared media', meta: 'Optional ritual' }
      ],
      highlights: [
        { tab: 'plans', label: 'Shared plans', detail: 'Owners, timing, and decisions that need both people' },
        { tab: 'profiles', label: 'Private profiles', detail: 'Separate personal context with one approved shared layer' },
        { tab: 'reflection', label: 'Practical reflection', detail: 'Repair, appreciation, and one useful change' }
      ],
      tabs: [{ id: 'together', label: 'Together' }, { id: 'profiles', label: 'Profiles' }, { id: 'plans', label: 'Plans' }, { id: 'reflection', label: 'Reflection' }, { id: 'connections', label: 'Connections' }],
      details: {
        together: { layout: 'shared-orbit', title: 'One shared priority and one small repair', summary: 'Approved information stays separate from private processing.', cards: [{ label: 'Approved plan', title: 'Review travel at 8:15 PM', detail: 'Both people can see and change this item.' }, { label: 'Shared promise', title: 'Pause difficult decisions after 10 PM', detail: 'A clear rule for difficult evenings.' }, { label: 'Needs both', title: 'Move $300 into the trip fund', detail: 'The transfer waits for both approvals.' }] },
        profiles: { layout: 'shared-orbit', title: 'Two people remain two people', summary: 'Private memories remain in each person’s individual profile.', cards: [{ label: 'Maya private', title: 'Needs reassurance before logistics', detail: 'Visible only inside Maya’s private profile.' }, { label: 'Jordan private', title: 'Wants a clear booking plan', detail: 'Visible only inside Jordan’s private profile.' }, { label: 'Shared', title: 'Dinner can move to 8 PM', detail: 'Approved for the couple Space.' }] },
        plans: { layout: 'handoff-flow', title: 'Shared decisions with owners and timing', summary: 'Plans stay useful when each decision has an owner and approval state.', cards: [{ label: 'Travel', title: 'Choose the hotel', detail: 'Jordan prepares the options, and both people approve the final choice.' }, { label: 'Budget', title: 'Confirm trip fund', detail: 'Needs both before any transfer.' }, { label: 'Ritual', title: 'Sunday planning call', detail: 'Recurring shared check-in.' }] },
        reflection: { layout: 'guided-steps', title: 'Practical reflection', summary: 'The Brief can support repair, appreciation, and clearer communication while each person keeps responsibility for their own interpretation.', cards: [{ label: 'Notice', title: 'Both want the relationship protected', detail: 'Different methods can still serve the shared goal.' }, { label: 'Repair', title: 'Name the hurt clearly', detail: 'Then agree on one practical change.' }, { label: 'Appreciation', title: 'Record what worked', detail: 'Useful patterns deserve memory too.' }] },
        connections: { layout: 'connection-map', title: 'Shared services, scoped permissions', summary: 'Each connection can be limited to the couple Space and a clear purpose.', cards: [{ label: 'Planned', title: 'Shared calendar', detail: 'Only approved events enter the Space.' }, { label: 'Optional', title: 'Music', detail: 'A shared playlist can remain separate from private listening.' }, { label: 'Restricted', title: 'Finance', detail: 'Only agreed trip records belong here.' }] }
      },
      space: { title: 'Relationship Space', private: ['Maya private context', 'Jordan private context', 'Individual memories and messages'], shared: ['Approved plans', 'Promises and decisions', 'Joint routines and responsibilities'] },
      soundtrack: {
        title: 'Yellow', artist: 'Coldplay', spotifyTrackId: '3AJwUDP919kvQ9QcozQPxg', previewUrl: '', note: 'A familiar shared favorite.',
        alternates: [
          { title: 'Dreams', artist: 'Fleetwood Mac', spotifyTrackId: '0ofHAoxe9vBkTCp2UQIavz', note: 'A calmer shared choice.' },
          { title: 'Just the Two of Us', artist: 'Grover Washington, Jr. feat. Bill Withers', spotifyTrackId: '6pLE8VbtyEEF8LXa3g7vSc', note: 'A warm reconnecting track.' }
        ]
      }
    },
    family: {
      id: 'family',
      label: 'Family',
      short: 'One household Brief with clear owners and private boundaries',
      entryPreview: {
        badge: 'Household',
        kicker: 'FAMILY BRIEF',
        title: 'The household sees what changed and who owns it',
        copy: 'Appointments, rides, chores, shopping, and approved availability become one family briefing with clear owners.',
        metrics: [{ label: 'Appointments', value: '3' }, { label: 'Shopping', value: 'Milk low' }, { label: 'Pickup', value: 'Covered' }],
        privateLabel: 'Covered events keep their details private',
        sharedLabel: 'Household plans show the agreed details'
      },
      greeting: 'Good afternoon, Rivera family.',
      headline: 'The household plan is clear before everyone starts moving',
      summary: 'Appointments, pickups, chores, shopping, meals, and approved calendar changes are organized in one shared view while private events stay private.',
      next: {
        time: '3:35 PM',
        title: 'Leave for Zoe’s appointment',
        detail: 'Marcus has pickup coverage, the bag is packed, and the route allows twenty-five minutes.'
      },
      recommendation: {
        label: 'Household priority',
        title: 'Confirm the school pickup change before 2:45 PM',
        detail: 'Once Elena accepts the handoff, both routes have clear coverage.',
        targetTab: 'calendar'
      },
      priority: {
        label: 'Shopping watch',
        title: 'Milk is down to the last carton',
        detail: 'Elena claimed it for the 5:30 grocery stop, so the household knows it is covered.',
        tone: 'household',
        targetTab: 'shopping'
      },
      checkIn: {
        question: 'Is the school pickup change confirmed?',
        choices: ['Confirmed', 'Change owner', 'Still open'],
        placeholder: 'Add one short household update'
      },
      weather: {
        location: 'Brooklyn, New York',
        temperature: 79,
        condition: 'Bright with late clouds',
        high: 82,
        low: 69,
        advice: 'The school and appointment routes stay dry. Bring a light layer for the evening activity.',
        hourly: [
          { time: 'Now', temp: 79, rain: 8 },
          { time: '3 PM', temp: 82, rain: 10 },
          { time: '5 PM', temp: 78, rain: 18 },
          { time: '7 PM', temp: 73, rain: 24 }
        ]
      },
      stats: [
        { label: 'Shared events', value: '5', note: 'Across four calendars' },
        { label: 'Chores open', value: '4', note: 'Every item has an owner' },
        { label: 'Shopping', value: '7', note: 'Two already checked' },
        { label: 'Needs approval', value: '1', note: 'Pickup change' }
      ],
      flow: [
        { time: '2:45', title: 'Confirm pickup change', meta: 'Elena and Marcus' },
        { time: '3:10', title: 'School pickup', meta: 'Elena' },
        { time: '3:35', title: 'Leave for appointment', meta: 'Marcus and Zoe' },
        { time: '5:45', title: 'Dinner and household reset', meta: 'Shared routine' }
      ],
      highlights: [
        { tab: 'calendar', label: 'Shared calendar', detail: 'Appointments, rides, and private availability blocks' },
        { tab: 'chores', label: 'Chore board', detail: 'Clear owners, due times, and completed work' },
        { tab: 'shopping', label: 'Shopping list', detail: 'Claimed items and a shared household checkoff' }
      ],
      tabs: [
        { id: 'home', label: 'Home' },
        { id: 'calendar', label: 'Calendar' },
        { id: 'chores', label: 'Chores' },
        { id: 'shopping', label: 'Shopping' },
        { id: 'access', label: 'People & access' }
      ],
      details: {
        home: {
          layout: 'family-command',
          title: 'One household view with a clear next move',
          summary: 'The family Brief combines approved plans and responsibilities while each person keeps a separate private profile.',
          calendar: {
            label: 'August 2026', days: 31, startOffset: 5, selected: 8, note: '7 shared events',
            markers: [{ day: 7, tone: 'shared' }, { day: 8, tone: 'care' }, { day: 9, tone: 'shared' }, { day: 12, tone: 'personal' }, { day: 16, tone: 'shared' }, { day: 21, tone: 'care' }, { day: 28, tone: 'personal' }]
          },
          timeline: [
            { time: '2:45', label: 'Approval', title: 'Confirm pickup change', owner: 'Elena + Marcus', tone: 'amber' },
            { time: '3:10', label: 'School', title: 'Pickup at the north entrance', owner: 'Elena', tone: 'blue' },
            { time: '3:35', label: 'Care', title: 'Leave for Zoe’s pediatric appointment', owner: 'Marcus + Zoe', tone: 'rose' },
            { time: '5:45', label: 'Home', title: 'Dinner and household reset', owner: 'Everyone', tone: 'green' }
          ],
          signals: [
            { symbol: '+', label: 'CARE', title: 'Appointment bag is ready', detail: 'Insurance card, water, and the approved question list are packed for Zoe’s pediatric appointment at 4:00 PM.', status: 'Ready', tone: 'care' },
            { symbol: '⌂', label: 'HOME SEARCH', title: '3 homes saved for adult review', detail: 'Two fit the commute and school-zone goals. Prices and private notes stay in the adult profile.', status: 'New', tone: 'home' },
            { symbol: '✓', label: 'HOUSEHOLD', title: '4 chores remain open', detail: 'Every task has an owner, and two are already scheduled for the weekend.', status: 'Owned', tone: 'task' }
          ],
          cards: [
            { label: 'Needs approval', title: 'School pickup change', detail: 'Elena can accept the handoff before 2:45 PM.', scope: 'Shared' },
            { label: 'Ready', title: 'Appointment bag packed', detail: 'Insurance card, water, and the question list are together.', scope: 'Shared' },
            { label: 'Private boundary', title: 'One evening event appears as busy', detail: 'The time affects coordination, while the title and notes remain hidden.', scope: 'Availability only' }
          ]
        },
        calendar: {
          layout: 'calendar',
          title: 'A shared calendar that keeps private event details covered',
          summary: 'Approved events show the time, owner, location, and responsibility. A private event can contribute a busy block while its title and notes remain in the owner’s profile.',
          cards: [
            { label: 'Today', title: 'Three shared commitments', detail: 'Pickup, an appointment, and dinner preparation already have owners.' },
            { label: 'Tomorrow', title: 'Two family events', detail: 'Soccer and groceries use the same route window.' },
            { label: 'Boundary', title: 'One availability-only block', detail: 'The household can plan around the time while private details remain covered.' }
          ],
          days: [
            {
              day: 'Today',
              date: 'Fri 7',
              events: [
                { time: '3:10 PM', title: 'School pickup', owner: 'Elena', kind: 'Shared' },
                { time: '4:00 PM', title: 'Zoe’s pediatric appointment', owner: 'Marcus + Zoe', kind: 'Shared care' },
                { time: '6:30 PM', title: 'Busy block', owner: 'Private event', kind: 'Availability only' }
              ]
            },
            {
              day: 'Tomorrow',
              date: 'Sat 8',
              events: [
                { time: '9:30 AM', title: 'Soccer practice', owner: 'Marcus + Leo', kind: 'Shared' },
                { time: '11:15 AM', title: 'Grocery pickup', owner: 'Elena', kind: 'Shared' }
              ]
            },
            {
              day: 'Sunday',
              date: 'Sun 9',
              events: [
                { time: '10:00 AM', title: 'Family planning check-in', owner: 'Everyone', kind: 'Shared' },
                { time: '5:30 PM', title: 'Dinner with grandparents', owner: 'Family', kind: 'Shared' }
              ]
            }
          ]
        },
        chores: {
          layout: 'board',
          title: 'A simple household board with owners and status',
          summary: 'Each item has one owner, a useful deadline, and a visible status, which reduces repeated reminders.',
          cards: [
            { label: 'Today', title: '2 assigned', detail: 'Unload the dishwasher and take recycling downstairs.' },
            { label: 'This week', title: '2 scheduled', detail: 'Laundry and the hallway reset already have owners.' },
            { label: 'Done', title: '3 completed', detail: 'Completed work stays visible long enough for the household to notice it.' }
          ],
          columns: [
            { title: 'Today', tone: 'today', items: [{ title: 'Unload dishwasher', owner: 'Leo', due: 'Before 5 PM' }, { title: 'Take recycling down', owner: 'Marcus', due: 'After dinner' }] },
            { title: 'This week', tone: 'week', items: [{ title: 'Fold clean laundry', owner: 'Elena + Zoe', due: 'Saturday' }, { title: 'Reset the hallway shelf', owner: 'Leo', due: 'Sunday' }] },
            { title: 'Done', tone: 'done', items: [{ title: 'Pack appointment bag', owner: 'Marcus', due: 'Completed 1:10 PM' }, { title: 'Add milk to the list', owner: 'Zoe', due: 'Completed 8:20 AM' }] }
          ]
        },
        shopping: {
          layout: 'checklist',
          title: 'One shopping list that can be claimed and updated',
          summary: 'Items stay grouped by purpose, and the family can see what is still needed, what is claimed, and what has already been picked up.',
          cards: [
            { label: 'Groceries', title: '4 items', detail: 'Milk and berries are already checked.' },
            { label: 'Household', title: '2 items', detail: 'Trash bags are claimed for Saturday pickup.' },
            { label: 'Pharmacy', title: '1 item', detail: 'Bandages remain open and visible to adults.' }
          ],
          groups: [
            { title: 'Groceries', items: [{ title: 'Milk', owner: 'Elena', checked: false }, { title: 'Berries', owner: 'Picked up', checked: true }, { title: 'Pasta', owner: 'Elena', checked: false }, { title: 'Lunch fruit', owner: 'Unclaimed', checked: false }] },
            { title: 'Household', items: [{ title: 'Trash bags', owner: 'Marcus', checked: false }, { title: 'Dish soap', owner: 'Picked up', checked: true }] },
            { title: 'Pharmacy', items: [{ title: 'Bandages', owner: 'Unclaimed', checked: false }] }
          ]
        },
        access: {
          layout: 'connection-map',
          title: 'Useful family access with age-appropriate limits',
          summary: 'Adults can coordinate the household, while younger members see the tasks, events, and reminders that belong to them.',
          cards: [
            { label: 'Adults', title: 'Household coordination', detail: 'Shared appointments, calendar approvals, costs, rides, and care responsibilities.', scope: 'Role controlled' },
            { label: 'Teen', title: 'Own schedule and assigned work', detail: 'Personal tasks, approved family events, chores, and shopping claims.', scope: 'Limited' },
            { label: 'Child', title: 'Simple routines and reminders', detail: 'Today’s events and age-appropriate responsibilities appear here, while adult notes remain in the adult role.', scope: 'Guided' }
          ]
        }
      },
      space: {
        title: 'Family Space',
        private: ['Adult notes and private calendar details', 'Age-specific personal records', 'Passwords, private messages, and unrelated finances'],
        shared: ['Approved appointments, rides, and calendar commitments', 'Chores, shopping, meals, and household reminders', 'Family decisions, routines, and important dates']
      },
      soundtrack: {
        title: 'You Get What You Give',
        artist: 'New Radicals',
        spotifyTrackId: '64JjHOHdwlJ0O4JiesvmW0',
        previewUrl: '',
        note: 'A bright shared track for getting the household moving.',
        alternates: [
          { title: 'Best Day Of My Life', artist: 'American Authors', spotifyTrackId: '5Hroj5K7vLpIG4FNCRIjbP', note: 'A lively household reset.' },
          { title: 'A Sky Full of Stars', artist: 'Coldplay', spotifyTrackId: '0FDzzruyVECATHXKHFs9eJ', note: 'A bright weekend choice.' }
        ]
      }
    },
    business: {
      id: 'business',
      label: 'Business partners',
      short: 'Two time zones, one shared operating view',
      entryPreview: {
        badge: 'Remote partners',
        kicker: 'BUSINESS PARTNER BRIEF',
        title: 'New York and Sydney share one operating picture',
        copy: 'Priorities, teams, deals, concerns, and prepared decisions meet in the company Space across both workdays.',
        metrics: [{ label: 'New York', value: '4:00 PM' }, { label: 'Sydney', value: '6:00 AM' }, { label: 'Waiting', value: '2 decisions' }],
        privateLabel: 'Each partner keeps private preparation',
        sharedLabel: 'Company facts and approved concerns meet here'
      },
      greeting: 'Good afternoon, Amina. Good morning, Eli.',
      headline: 'Run the same company from New York and Sydney',
      summary: 'Two remote partners see the shared operating picture, each partner’s approved concerns, and the work their teams need to move next.',
      next: { time: '4:00 PM ET · 6:00 AM AEST', title: 'Partner operating review', detail: 'Confirm cash timing, delivery capacity, and the two meetings affected by Tuesday’s beach day.' },
      recommendation: { label: 'Shared operating priority', title: 'Protect the cash buffer before approving the new contractor', detail: 'The renewal and delayed receivable reduce the buffer below the partners’ ten-week rule.', targetTab: 'concerns' },
      priority: { label: 'Operating buffer', title: 'Friday’s $6,400 renewal lowers the cash buffer to 9.4 weeks', detail: 'Review the renewal and receivable timing together before either partner approves new fixed cost.', tone: 'warning', targetTab: 'concerns' },
      checkIn: { question: 'Did the $18,000 client payment arrive?', choices: ['Received', 'Partial', 'Still waiting'], placeholder: 'Add the amount or one short correction' },
      weather: {
        location: 'New York and Sydney', temperature: 78, condition: 'Two workdays with one shared window', high: 81, low: 64,
        advice: 'The best shared review window is 4:00 to 6:00 PM in New York and 6:00 to 8:00 AM in Sydney.',
        hourly: [
          { time: 'NY now', temp: 78, label: '4:00 PM ET' },
          { time: 'Sydney', temp: 64, label: '6:00 AM AEST' },
          { time: 'NY close', temp: 75, label: '6:00 PM ET' },
          { time: 'Sydney start', temp: 67, label: '8:00 AM AEST' }
        ]
      },
      stats: [
        { label: 'Cash buffer', value: '9.4 wks', note: '10-week rule' },
        { label: 'Active projects', value: '4', note: 'One at risk' },
        { label: 'Open pipeline', value: '$146k', note: 'Unconfirmed' },
        { label: 'Shared overlap', value: '2 hrs', note: 'New York + Sydney' }
      ],
      flow: [
        { time: '4:00 ET', title: 'Partner operating review', meta: '6:00 AEST' },
        { time: '4:35 ET', title: 'Collections decision', meta: 'Amina owns follow-up' },
        { time: '5:00 ET', title: 'Delivery and staffing', meta: 'Eli owns capacity' },
        { time: '5:35 ET', title: 'Tuesday calendar draft', meta: 'Needs both partners' }
      ],
      highlights: [
        { tab: 'calendar', label: 'Tuesday beach plan', detail: 'Two time zones, UV guidance, and prepared meeting changes' },
        { tab: 'projects', label: 'Team projects', detail: 'Owners, progress, blockers, and next evidence' },
        { tab: 'deals', label: 'Deal pipeline', detail: 'Forecast stages, values, and collection boundaries' }
      ],
      tabs: [
        { id: 'executive', label: 'Partner view' },
        { id: 'projects', label: 'Projects' },
        { id: 'deals', label: 'Deals' },
        { id: 'calendar', label: 'Calendar' },
        { id: 'concerns', label: 'Concerns' }
      ],
      details: {
        executive: {
          layout: 'partner-operations',
          title: 'Two local days with one agreed operating picture',
          summary: 'Each partner gets local timing and role context while shared cash, delivery, deals, and decisions stay synchronized.',
          cards: [
            { label: 'Shared window', title: '4:00-6:00 PM ET', detail: 'The same review runs from 6:00-8:00 AM in Sydney.' },
            { label: 'Cash rule', title: 'Protect ten weeks', detail: 'New fixed cost waits until the operating buffer recovers.' },
            { label: 'Decision', title: 'Contractor remains paused', detail: 'Both partners review again after the receivable lands.' }
          ],
          partners: [
            { name: 'Amina', role: 'US partner', place: 'New York', localTime: '4:00 PM ET', focus: 'Clients, pipeline, and collections', concern: 'The delayed receivable could compress September hiring.', tone: 'owner' },
            { name: 'Eli', role: 'Australia partner', place: 'Sydney', localTime: '6:00 AM AEST', focus: 'Delivery, quality, and team capacity', concern: 'Two launches overlap during the same delivery week.', tone: 'partner' }
          ],
          sharedWindow: 'Two protected hours for decisions that need both partners',
          operations: { label: 'Operations concern', title: 'The support team has no owner after 5:00 PM ET', detail: 'Choose an interim handoff before the next client launch.', tone: 'operations' },
          connections: ['CRM pipeline', 'Project board', 'Read-only accounting summary', 'Approved partner calendar']
        },
        projects: {
          layout: 'project-dashboard',
          title: 'Teams, projects, progress, and the next risk',
          summary: 'Each project shows the team, accountable partner, current evidence, and the next useful move.',
          cards: [
            { label: 'At risk', title: 'Harbor Health launch', detail: 'Client approval is two days late.' },
            { label: 'Watch', title: 'Atlas onboarding', detail: 'Support ownership needs a decision.' },
            { label: 'On track', title: 'Retainer reporting', detail: 'Automation review is scheduled.' }
          ],
          projects: [
            { name: 'Harbor Health launch', team: 'Design + Development', owner: 'Amina', progress: 78, status: 'At risk', next: 'Approve mobile revisions', tone: 'owner' },
            { name: 'Atlas onboarding', team: 'Operations + Client Success', owner: 'Eli', progress: 92, status: 'Watch', next: 'Assign support handoff', tone: 'partner' },
            { name: 'Retainer reporting', team: 'Analytics', owner: 'Shared', progress: 61, status: 'On track', next: 'Review automated summary', tone: 'operations' },
            { name: 'Sydney partner portal', team: 'Product + QA', owner: 'Eli', progress: 46, status: 'On track', next: 'Finish account states', tone: 'partner' }
          ]
        },
        deals: {
          layout: 'deal-pipeline',
          title: 'The pipeline with values, owners, and evidence',
          summary: 'Pipeline supports planning after the stage, next step, and confidence are visible. Forecast totals remain separate from collected cash.',
          cards: [
            { label: 'Qualified', title: '$42k', detail: 'Two opportunities with confirmed need.' },
            { label: 'Proposal', title: '$68k', detail: 'Three proposals need follow-up.' },
            { label: 'Decision', title: '$36k', detail: 'One procurement review remains.' }
          ],
          stages: [
            { name: 'Qualified', value: '$42k', deals: [{ name: 'Northline platform', value: '$24k', owner: 'Amina', next: 'Discovery Friday', tone: 'owner' }, { name: 'Field team portal', value: '$18k', owner: 'Eli', next: 'Scope review', tone: 'partner' }] },
            { name: 'Proposal', value: '$68k', deals: [{ name: 'Clinic network rollout', value: '$38k', owner: 'Amina', next: 'Pricing reply', tone: 'owner' }, { name: 'Operations redesign', value: '$30k', owner: 'Eli', next: 'Security answers', tone: 'partner' }] },
            { name: 'Decision', value: '$36k', deals: [{ name: 'Retail data workspace', value: '$36k', owner: 'Shared', next: 'Procurement review', tone: 'operations' }] }
          ]
        },
        calendar: {
          layout: 'partner-calendar',
          title: 'One calendar across New York and Sydney',
          summary: 'Local times, partner colors, travel, focus windows, and prepared calendar changes stay clear before anything is sent.',
          cards: [
            { label: 'Monday', title: 'Decision window', detail: 'Collections, delivery, and pipeline review.' },
            { label: 'Tuesday', title: 'Amina beach day', detail: 'UV 8, dry weather, and two meetings need a draft change.' },
            { label: 'Wednesday', title: 'Sydney delivery start', detail: 'Eli owns the morning client handoff.' }
          ],
          timezones: [
            { name: 'Amina', place: 'New York', time: '4:00 PM ET', tone: 'owner' },
            { name: 'Eli', place: 'Sydney', time: '6:00 AM AEST', tone: 'partner' }
          ],
          days: [
            { day: 'Monday', date: '10', events: [{ time: '4:00 PM ET', title: 'Partner operating review', owner: 'Shared', tone: 'operations' }, { time: '5:15 PM ET', title: 'Harbor approval call', owner: 'Amina', tone: 'owner' }] },
            { day: 'Tuesday', date: '11', highlighted: true, label: 'BEACH DAY', weather: '81°F · UV 8 · Bring SPF 50, water, hat, and a light cover', events: [{ time: '10:30 AM ET', title: 'Optional vendor intro', owner: 'Amina', tone: 'owner', change: 'Decline draft' }, { time: '4:30 PM ET', title: 'Delivery review', owner: 'Shared', tone: 'operations', change: 'Move draft' }] },
            { day: 'Wednesday', date: '12', events: [{ time: '8:30 AM AEST', title: 'Client delivery handoff', owner: 'Eli', tone: 'partner' }, { time: '4:00 PM ET', title: 'Pipeline follow-up', owner: 'Amina', tone: 'owner' }] }
          ],
          action: { label: 'Prepare Tuesday calendar changes', result: 'Draft ready: move the delivery review, decline the optional vendor intro, and protect Amina’s beach day. Both partners still need to approve before any calendar changes are sent.' }
        },
        concerns: {
          layout: 'partner-concerns',
          title: 'Approved partner concerns and one operations concern',
          summary: 'Each partner chooses what enters the shared Brief. Private preparation remains private, while approved concerns gain an owner and review date.',
          cards: [
            { label: 'Amina shared', title: 'September hiring pressure', detail: 'Protect cash until the delayed payment clears.', scope: 'Blue partner lane' },
            { label: 'Eli shared', title: 'Launch overlap', detail: 'Move one QA review or add temporary coverage.', scope: 'Coral partner lane' },
            { label: 'Operations', title: 'Late support handoff', detail: 'Assign interim ownership before launch.', scope: 'Shared company record' }
          ],
          concerns: [
            { owner: 'Amina', label: 'US partner concern', title: 'September hiring could tighten the buffer', detail: 'Review after the $18,000 receivable clears.', next: 'Amina updates the cash forecast Friday', tone: 'owner' },
            { owner: 'Eli', label: 'Australia partner concern', title: 'Two launches compete for the same QA week', detail: 'Move one review or add temporary capacity.', next: 'Eli brings two options Monday', tone: 'partner' },
            { owner: 'Operations', label: 'Shared concern', title: 'Support coverage ends before the US client day closes', detail: 'The client launch needs an interim owner from 5:00 to 8:00 PM ET.', next: 'Both partners decide during the review', tone: 'operations' }
          ],
          decision: 'New contractor approval remains paused until the receivable lands and launch coverage has an owner.'
        }
      },
      space: { title: 'Business Partner Space', private: ['Each partner’s private preparation and unshared concerns', 'Individual inboxes and personal calendars', 'Personal financial information outside the company'], shared: ['Company cash rules, projects, deals, and approved concerns', 'Cross-time-zone calendar commitments and prepared changes', 'Owners, decisions, deadlines, and operating history'] },
      soundtrack: {
        title: 'On Top Of The World', artist: 'Imagine Dragons', spotifyTrackId: '213x4gsFDm04hSqIUkg88w', previewUrl: '', note: 'Bright operating-review energy.',
        alternates: [
          { title: 'Lose Yourself', artist: 'Eminem', spotifyTrackId: '5Z01UMMf7V1o0MzF86s6WJ', note: 'A focused deep-work choice.' },
          { title: 'Midnight City', artist: 'M83', spotifyTrackId: '1eyzqe2QqGZUmfcPZtrIyt', note: 'Built for the time-zone handoff.' }
        ]
      }
    },
    accounting: {
      id: 'accounting',
      label: 'Accountant and client',
      short: 'A shared money review with professional boundaries',
      entryPreview: {
        badge: 'Professional',
        kicker: 'ACCOUNTANT AND CLIENT BRIEF',
        title: 'The money review shows what changed and what needs approval',
        copy: 'Income, expenses, taxes, assets, deadlines, and the accountant’s guidance form one reviewable plan.',
        metrics: [{ label: 'Free cash', value: '$1,420' }, { label: 'Tax reserve', value: '82%' }, { label: 'Next review', value: '3:30 PM' }],
        privateLabel: 'Unshared records remain with their owner',
        sharedLabel: 'Approved financial records support the review'
      },
      greeting: 'Good afternoon, Daniel and Priya.',
      headline: 'See the whole money picture before deciding what moves next',
      summary: 'Daniel’s salary, side business, bills, taxes, savings, investing, and goals become one reviewable plan with his accountant, Priya.',
      next: { time: '3:30 PM', title: 'Monthly money review', detail: 'Confirm the client payment, protect the tax reserve, and review the card autopay before Monday.' },
      recommendation: { label: 'Accountant priority', title: 'Move $380 into the tax reserve after the client payment clears', detail: 'That restores the agreed set-aside without using the personal emergency fund.', targetTab: 'cash' },
      priority: { label: 'Budget floor', title: 'Monday’s $1,250 card autopay puts flexible spending $310 below plan', detail: 'Review two charges and move the payment date only if the card issuer and Daniel approve it.', tone: 'warning', targetTab: 'cash' },
      checkIn: { question: 'Did the $840 startup client payment arrive?', choices: ['Received', 'Partial', 'Still waiting'], placeholder: 'Add the received amount or a short correction' },
      weather: {
        location: 'Daniel’s financial month', temperature: 82, condition: 'Tax reserve nearly funded', high: 100, low: 76,
        advice: 'The useful condition is 82% of the monthly tax set-aside funded before the next business withdrawal.',
        hourly: [
          { time: 'Cash', temp: 94, label: '% of plan' },
          { time: 'Tax', temp: 82, label: '% funded' },
          { time: 'Invest', temp: 76, label: '% funded' },
          { time: 'Startup', temp: 92, label: '% of goal' }
        ]
      },
      stats: [
        { label: 'Free cash', value: '$1,420', note: 'After planned costs' },
        { label: 'Tax reserve', value: '82%', note: '$380 remaining' },
        { label: 'Startup MTD', value: '$4.6k', note: '$5k goal' },
        { label: 'Runway', value: '5.2 mo', note: 'Personal reserve' }
      ],
      flow: [
        { time: '3:30', title: 'Confirm income and open charges', meta: 'Daniel + Priya' },
        { time: '3:45', title: 'Protect tax and bill reserves', meta: 'Prepared transfer' },
        { time: '4:00', title: 'Review investing and startup spend', meta: 'Rules first' },
        { time: '4:15', title: 'Record decisions and owners', meta: 'Shared review history' }
      ],
      highlights: [
        { tab: 'cash', label: 'Cash plan', detail: 'A spreadsheet view of planned, actual, and remaining money' },
        { tab: 'portfolio', label: 'Asset dashboard', detail: 'Allocation, illustrative market movement, and review notes' },
        { tab: 'deadlines', label: 'Tax and bills', detail: 'Amounts, dates, owners, and approval states' }
      ],
      tabs: [
        { id: 'overview', label: 'Advisor view' },
        { id: 'cash', label: 'Cash plan' },
        { id: 'portfolio', label: 'Portfolio' },
        { id: 'deadlines', label: 'Tax & bills' },
        { id: 'rules', label: 'Goals & rules' }
      ],
      details: {
        overview: {
          layout: 'financial-overview',
          title: 'The client and accountant review the same priorities',
          summary: 'The Brief leads with cash safety, deadlines, and agreed rules, then keeps deeper records available for review.',
          cards: [
            { label: 'Income', title: '$11,450 this month', detail: 'Salary and side-business revenue remain separate in the ledger.' },
            { label: 'Protection', title: '$2,140 reserved', detail: 'Taxes, insurance, and known bills already have assignments.' },
            { label: 'Choice', title: '$1,420 free cash', detail: 'Daniel decides how much moves to investing, goals, or flexible spending.' }
          ],
          quote: { text: 'Fund the tax reserve first, keep the emergency fund intact, and let the startup earn the next expansion.', by: 'Priya Shah, accountant', when: 'Shared yesterday' },
          people: [
            { name: 'Daniel', role: 'Client', focus: 'Full-time job + Northline Studio', tone: 'client' },
            { name: 'Priya', role: 'Accountant', focus: 'Cash plan, records, taxes, and decision rules', tone: 'advisor' }
          ],
          money: [
            { label: 'Salary take-home', value: '$6,850', note: 'Personal income' },
            { label: 'Startup revenue', value: '$4,600', note: 'Northline Studio' },
            { label: 'Committed costs', value: '$7,890', note: 'Personal + business' },
            { label: 'Free cash', value: '$1,420', note: 'Before final choice' }
          ]
        },
        cash: {
          layout: 'spreadsheet',
          title: 'A monthly plan that reads like a clean working sheet',
          summary: 'Planned and actual amounts stay visible in one scrollable ledger, with exceptions called out before the totals become misleading.',
          cards: [
            { label: 'Income', title: '$11,450', detail: 'Salary and startup revenue received or expected.' },
            { label: 'Planned outflow', title: '$10,030', detail: 'Bills, reserves, investing, and business costs.' },
            { label: 'Remaining', title: '$1,420', detail: 'Available after the current plan.' }
          ],
          caption: 'August shared cash plan · fictional demo records',
          columns: ['Category', 'Planned', 'Actual', 'Remaining', 'Status'],
          rows: [
            { category: 'Salary take-home', planned: '$6,850', actual: '$6,850', remaining: '$0', status: 'Received', tone: 'good' },
            { category: 'Northline Studio revenue', planned: '$5,000', actual: '$4,600', remaining: '$400', status: 'Watch', tone: 'watch' },
            { category: 'Housing + utilities', planned: '$3,120', actual: '$3,120', remaining: '$0', status: 'On plan', tone: 'good' },
            { category: 'Living + flexible', planned: '$1,900', actual: '$2,210', remaining: '-$310', status: 'Over', tone: 'risk' },
            { category: 'Tax reserve', planned: '$2,100', actual: '$1,720', remaining: '$380', status: 'Fund next', tone: 'watch' },
            { category: 'Investing', planned: '$900', actual: '$684', remaining: '$216', status: 'Open', tone: 'neutral' },
            { category: 'Startup operations', planned: '$1,260', actual: '$1,180', remaining: '$80', status: 'On plan', tone: 'good' },
            { category: 'Startup growth', planned: '$750', actual: '$430', remaining: '$320', status: 'Rule check', tone: 'neutral' }
          ],
          total: { category: 'Current plan', planned: '$11,450', actual: '$10,030', remaining: '$1,420', status: 'Balanced' }
        },
        portfolio: {
          layout: 'portfolio',
          title: 'Assets, allocation, and market context in one compact dashboard',
          summary: 'The market rail is illustrative. Allocation, contributions, and risk rules matter more than a single day’s movement.',
          cards: [
            { label: 'Invested assets', title: '$48,620', detail: 'Retirement and taxable accounts in this fictional example.' },
            { label: 'Monthly contribution', title: '$684 of $900', detail: 'The remaining contribution waits until the tax reserve is complete.' },
            { label: 'Allocation review', title: 'Within range', detail: 'Allocation stays inside the agreed range today.' }
          ],
          ticker: [
            { symbol: 'VTI', value: '282.40', change: '+0.6%', tone: 'up' },
            { symbol: 'VXUS', value: '68.15', change: '+0.3%', tone: 'up' },
            { symbol: 'BND', value: '74.10', change: '-0.1%', tone: 'down' },
            { symbol: 'MSFT', value: '512.80', change: '+0.8%', tone: 'up' }
          ],
          assets: [
            { name: 'US broad market', symbol: 'VTI', value: '$28,200', share: 58, change: '+4.1% quarter', points: [18, 22, 20, 27, 25, 31, 36, 34, 42], tone: 'blue' },
            { name: 'International', symbol: 'VXUS', value: '$9,720', share: 20, change: '+1.7% quarter', points: [28, 25, 26, 24, 29, 31, 30, 33, 35], tone: 'green' },
            { name: 'Bonds', symbol: 'BND', value: '$7,290', share: 15, change: '-0.2% quarter', points: [31, 31, 30, 29, 30, 29, 28, 29, 28], tone: 'amber' },
            { name: 'Investment cash', symbol: 'CASH', value: '$3,410', share: 7, change: 'Ready for plan', points: [20, 20, 20, 20, 20, 20, 20, 20, 20], tone: 'violet' }
          ],
          note: 'Illustrative delayed figures for interface demonstration. Investment decisions stay with the user and qualified professionals.'
        },
        deadlines: {
          layout: 'deadline-ledger',
          title: 'Bills, tax preparation, and approval dates',
          summary: 'The shared timeline separates a due date, an internal preparation date, an owner, and the action that still needs approval.',
          cards: [
            { label: 'Monday', title: '$1,250 card autopay', detail: 'Review two charges before the payment runs.' },
            { label: 'September 8', title: 'Tax estimate preparation', detail: 'Priya prepares the calculation and source list.' },
            { label: 'September 10', title: 'Client approval target', detail: 'Daniel reviews the prepared estimate and payment plan.' }
          ],
          deadlines: [
            { date: 'Aug 10', label: 'Bill', title: 'Credit card autopay', amount: '$1,250', owner: 'Daniel', status: 'Review', tone: 'risk' },
            { date: 'Aug 14', label: 'Business', title: 'Software renewals', amount: '$420', owner: 'Daniel', status: 'Ready', tone: 'neutral' },
            { date: 'Sep 8', label: 'Tax prep', title: 'Estimated-tax source review', amount: 'Documents', owner: 'Priya', status: 'Scheduled', tone: 'advisor' },
            { date: 'Sep 10', label: 'Approval', title: 'Review prepared tax estimate', amount: 'User approval', owner: 'Daniel + Priya', status: 'Planned', tone: 'client' }
          ],
          boundary: 'This fictional demo organizes records and preparation. Actual filing, tax, legal, and investment decisions require verified records and qualified advice.'
        },
        rules: {
          layout: 'financial-rules',
          title: 'Goals and rules that keep the plan personal',
          summary: 'Rules come from Daniel’s priorities and Priya’s professional guidance. Daniel can revise them, pause them, or approve a one-time exception.',
          cards: [
            { label: 'Personal reserve', title: '5.2 of 6 months', detail: 'Keep the emergency fund separate from startup growth.' },
            { label: 'Startup goal', title: '$4.6k of $5k', detail: 'Finish the month before expanding software spend.' },
            { label: 'Investing rule', title: '$900 monthly', detail: 'Complete the tax reserve before the final contribution.' }
          ],
          goals: [
            { name: 'Six-month personal reserve', current: '$26,100', target: '$30,000', progress: 87, tone: 'client' },
            { name: 'Monthly startup revenue', current: '$4,600', target: '$5,000', progress: 92, tone: 'business' },
            { name: 'Monthly investing', current: '$684', target: '$900', progress: 76, tone: 'advisor' }
          ],
          rules: [
            { title: 'Protect taxes first', detail: 'Move the planned tax percentage before owner draws or new growth spending.', status: 'Active' },
            { title: 'Review purchases above $500', detail: 'Check tax reserve, cash runway, and expected return before approval.', status: 'Active' },
            { title: 'Keep personal and startup records separate', detail: 'Shared reporting can compare both while each account keeps its own ledger.', status: 'Active' },
            { title: 'Ask before recategorizing', detail: 'The accountant or AI can prepare a suggestion, and Daniel confirms the record.', status: 'User controlled' }
          ]
        }
      },
      space: { title: 'Accountant and Client Space', private: ['Daniel’s unrelated personal records and private goals', 'Priya’s firm notes and other client records', 'Credentials, account access, and unshared documents'], shared: ['Approved income, expenses, bills, tax preparation, and asset summaries', 'Accountant notes, questions, corrections, and user-approved rules', 'Prepared transfers, deadlines, goals, and confirmed decisions'] },
      soundtrack: {
        title: 'Midnight City', artist: 'M83', spotifyTrackId: '1eyzqe2QqGZUmfcPZtrIyt', previewUrl: '', note: 'A clean background track for the monthly review.',
        alternates: [
          { title: 'The Recipe', artist: 'Kendrick Lamar feat. Dr. Dre', spotifyTrackId: '4i0ioe6BC6qvV6FOm6nf7K', note: 'A sharper working-session choice.' },
          { title: 'Dreams', artist: 'The Cranberries', spotifyTrackId: '1IFSa6KKHLeSwRe8mDlz6k', note: 'A calmer review option.' }
        ]
      }
    },
    trainer: {
      id: 'trainer', label: 'Trainer and student', short: 'Goals, evidence and coaching boundaries',
      entryPreview: {
        badge: 'Coaching',
        kicker: 'TRAINER AND STUDENT BRIEF',
        title: 'The plan adapts to recovery and verified progress',
        copy: 'Training, readiness, habits, and coach feedback stay current while protected health context keeps its own boundary.',
        metrics: [{ label: 'Week', value: '3 of 4' }, { label: 'Readiness', value: 'Check first' }, { label: 'Pain flags', value: '0' }],
        privateLabel: 'Protected health context stays scoped',
        sharedLabel: 'Approved progress supports coaching'
      },
      greeting: 'Good afternoon, Nina and Sam.', headline: 'The plan should adapt while keeping accountability.', summary: 'Training, recovery, habits, and check-ins stay useful because the system records evidence and respects health boundaries.',
      next: { time: '6:00 PM', title: 'Upper-body session', detail: 'Complete the warm-up check before choosing normal or reduced volume.' },
      recommendation: { label: 'Recommended next move', title: 'Use the smaller plan if readiness is low.', detail: 'Recording each adaptation improves future recommendations.', targetTab: 'recovery' },
      priority: { label: 'Readiness check', title: 'Sleep is below the preferred range', detail: 'Use the warm-up check before choosing normal or reduced volume.', tone: 'info', targetTab: 'recovery' },
      checkIn: { question: 'How does your readiness feel right now?', choices: ['Ready', 'Reduce volume', 'Rest today'], placeholder: 'Add one short note about energy or pain' },
      weather: { location: 'Training window', temperature: 79, condition: 'Warm and dry', high: 81, low: 68, advice: 'Indoor training should be comfortable, but hydrate before the session.', hourly: [{ time: 'Now', temp: 79, rain: 5 }, { time: '6 PM', temp: 78, rain: 6 }, { time: '8 PM', temp: 73, rain: 8 }, { time: 'Late', temp: 69, rain: 9 }] },
      stats: [{ label: 'Week complete', value: '3/4', note: 'One planned today' }, { label: 'Sleep', value: '6.5h', note: 'Reduce if needed' }, { label: 'Pain flags', value: '0', note: 'Check again' }, { label: 'Protein', value: '72%', note: 'Target progress' }],
      flow: [{ time: '5:45', title: 'Readiness check', meta: 'Student' }, { time: '6:00', title: 'Training session', meta: 'Adaptive plan' }, { time: '7:10', title: 'Log evidence', meta: 'Sets and notes' }, { time: 'Tomorrow', title: 'Coach review', meta: 'Adjust next step' }],
      highlights: [
        { tab: 'today', label: 'Readiness plan', detail: 'One workout, one check-in, and a realistic choice' },
        { tab: 'habits', label: 'Habit rhythm', detail: 'Patterns that can start a useful coaching conversation' },
        { tab: 'recovery', label: 'Recovery view', detail: 'Sleep, pain, and signals that can change the plan' }
      ],
      tabs: [{ id: 'today', label: 'Today' }, { id: 'habits', label: 'Habits' }, { id: 'progress', label: 'Progress' }, { id: 'recovery', label: 'Recovery' }, { id: 'connections', label: 'Connections' }],
      details: {
        today: { layout: 'decision-timeline', title: 'One workout, one check-in, one adaptive decision', summary: 'The plan can change while the goal stays in view.', cards: [{ label: 'Warm-up', title: 'Check coordination and pain', detail: 'Choose normal or reduced volume after the check.' }, { label: 'Main work', title: 'Upper-body session', detail: 'Keep the progression simple.' }, { label: 'Close', title: 'Log what happened', detail: 'Evidence improves the next recommendation.' }] },
        habits: { layout: 'metric-bars', title: 'Patterns support a conversation', summary: 'Each pattern remains reviewable and open to correction.', cards: [{ label: 'Movement', title: '3 completed days', detail: 'Strongest current pattern.' }, { label: 'Sleep', title: 'Below target twice', detail: 'Ask what caused it before changing the plan.' }, { label: 'Nutrition', title: 'Improving', detail: 'One meal still creates the gap.' }] },
        progress: { layout: 'progress-trend', title: 'Evidence before confidence', summary: 'Completed work, corrections and repeated outcomes matter more than motivational language.', cards: [{ label: 'Strength', title: 'Two lifts progressed', detail: 'Fictional training evidence.' }, { label: 'Consistency', title: 'Three weeks active', detail: 'One reduced session still counted.' }, { label: 'Next block', title: 'Ready after review', detail: 'Coach approval required.' }] },
        recovery: { layout: 'readiness-dial', title: 'Sleep, pain and readiness can change the plan', summary: 'Unusual pain requires an appropriate pause and professional guidance when needed.', cards: [{ label: 'Sleep', title: '6.5 hours', detail: 'Watch warm-up quality.' }, { label: 'Pain', title: 'Clear check-in', detail: 'The latest report shows no unusual pain, with another check during movement.' }, { label: 'Recovery', title: 'Moderate', detail: 'Reduced volume remains available.' }] },
        connections: { layout: 'connection-map', title: 'Fitness connections need health boundaries', summary: 'Data supports coaching, while qualified care remains with a professional.', cards: [{ label: 'Planned', title: 'Workout history', detail: 'Sets, reps and completion.' }, { label: 'Optional', title: 'Wearable data', detail: 'Readiness signals with user permission.' }, { label: 'Boundary', title: 'Medical records', detail: 'Separate protected access and professional oversight.' }] }
      },
      space: { title: 'Training Space', private: ['Student-private health context', 'Trainer-private coaching preparation', 'Personal notes outside the plan'], shared: ['Approved training plan', 'Check-ins and evidence', 'Coach feedback and next actions'] },
      soundtrack: {
        title: 'POWER', artist: 'Kanye West', spotifyTrackId: '2gZUPNdnz5Y45eiGxpHGSc', previewUrl: '', note: 'A high-energy training option.',
        alternates: [
          { title: 'Till I Collapse', artist: 'Eminem feat. Nate Dogg', spotifyTrackId: '4xkOaSrkexMciUUogZKVTS', note: 'A final-effort option.' },
          { title: 'Sunflower', artist: 'Post Malone and Swae Lee', spotifyTrackId: '0RiRZpuVRbi7oqRdSMwhQY', note: 'A lighter cooldown choice.' }
        ]
      }
    },
    team: {
      id: 'team', label: 'Team and project', short: 'Roles, handoffs and shared project truth',
      entryPreview: {
        badge: 'Project team',
        kicker: 'TEAM AND PROJECT BRIEF',
        title: 'Ownership, blockers, and handoffs stay visible to the right roles',
        copy: 'The team sees one current project record, while leads and members receive the details their roles allow.',
        metrics: [{ label: 'Projects', value: '4' }, { label: 'Blockers', value: '2' }, { label: 'Release', value: 'Today' }],
        privateLabel: 'Restricted lead context stays scoped',
        sharedLabel: 'Role approved work reaches the team'
      },
      greeting: 'Good afternoon, Atlas team.', headline: 'Give everyone the same goal with access matched to their role', summary: 'Members receive role-relevant work, while project leads keep the broader operating picture and restricted context.',
      next: { time: '3:00 PM', title: 'Release readiness review', detail: 'Confirm the final blocker, handoff owner and rollback decision.' },
      recommendation: { label: 'Recommended next move', title: 'Resolve the unowned handoff before adding more work.', detail: 'A visible dependency with no receiver is the highest operational risk.', targetTab: 'handoffs' },
      priority: { label: 'Release warning', title: 'The QA-to-release handoff still has no receiver', detail: 'Assign the owner before the readiness review so the release decision uses a complete chain.', tone: 'warning', targetTab: 'handoffs' },
      checkIn: { question: 'Is the final handoff owner confirmed?', choices: ['Confirmed', 'Choose owner', 'Still blocked'], placeholder: 'Add the owner or one short blocker update' },
      weather: { location: 'Project conditions', temperature: 74, condition: 'Release window open', high: 76, low: 63, advice: 'The meaningful condition is blocker status and owner clarity.', hourly: [{ time: 'Now', temp: 74, rain: 11 }, { time: 'Review', temp: 75, rain: 12 }, { time: 'Release', temp: 72, rain: 10 }, { time: 'Close', temp: 68, rain: 9 }] },
      stats: [{ label: 'Project health', value: '82%', note: 'Fictional' }, { label: 'Open blockers', value: '2', note: 'One unowned' }, { label: 'Handoffs', value: '4', note: 'Three accepted' }, { label: 'Release', value: 'Today', note: 'Approval pending' }],
      flow: [{ time: '1:30', title: 'Member work', meta: 'Role view' }, { time: '3:00', title: 'Readiness review', meta: 'Project Space' }, { time: '4:00', title: 'Release decision', meta: 'Lead approval' }, { time: '5:00', title: 'Record outcome', meta: 'Shared history' }],
      highlights: [
        { tab: 'project', label: 'Project dashboard', detail: 'Progress, blockers, workload, and next evidence' },
        { tab: 'handoffs', label: 'Handoffs', detail: 'Sender, receiver, timing, and proof of completion' },
        { tab: 'procedures', label: 'Launch procedures', detail: 'Readiness steps with role-based visibility' }
      ],
      tabs: [{ id: 'mywork', label: 'My work' }, { id: 'project', label: 'Project' }, { id: 'handoffs', label: 'Handoffs' }, { id: 'procedures', label: 'Procedures' }, { id: 'connections', label: 'Connections' }],
      details: {
        mywork: { layout: 'status-board', title: 'Your role-specific work', summary: 'A member sees what they own, what blocks it, and the approved context they need.', cards: [{ label: 'Next', title: 'Finish responsive review', detail: 'Sam owns this task, which is due before the readiness review.' }, { label: 'Dependency', title: 'Content approval', detail: 'Waiting on Jordan.' }, { label: 'Context', title: 'Release goal', detail: 'Protect the mobile experience.' }] },
        project: {
          layout: 'project-dashboard',
          title: 'One shared timeline with visible blockers',
          summary: 'Status follows the evidence, and each workstream shows its owner, progress, and next proof.',
          cards: [{ label: 'Complete', title: 'Core build', detail: 'Accepted by the project lead.' }, { label: 'Watch', title: 'Mobile review', detail: 'Two issues remain.' }, { label: 'Blocked', title: 'Final handoff', detail: 'Awaiting receiver confirmation.' }],
          projects: [
            { name: 'Core experience', team: 'Product + Development', owner: 'Sam', progress: 100, status: 'Complete', next: 'Hold release state', tone: 'blue' },
            { name: 'Mobile validation', team: 'QA + Design', owner: 'Jordan', progress: 82, status: 'Watch', next: 'Close two visual issues', tone: 'amber' },
            { name: 'Launch handoff', team: 'QA + Release', owner: 'Unassigned', progress: 54, status: 'Blocked', next: 'Confirm receiver', tone: 'risk' },
            { name: 'Support readiness', team: 'Operations', owner: 'Mika', progress: 76, status: 'On track', next: 'Finish response guide', tone: 'green' }
          ]
        },
        handoffs: { layout: 'handoff-flow', title: 'Every transfer names sender, receiver and missing evidence', summary: 'Handoffs work for delivery, operations, care coordination and field work.', cards: [{ label: 'Accepted', title: 'Design to development', detail: 'Files and notes complete.' }, { label: 'Waiting', title: 'Development to QA', detail: 'Mobile evidence missing.' }, { label: 'Unowned', title: 'QA to release', detail: 'Receiver must be assigned.' }] },
        procedures: { layout: 'guided-steps', title: 'Preparation before a launch or operation', summary: 'Restricted information can support readiness while remaining in lead-access records.', cards: [{ label: 'Ready', title: 'Rollback plan', detail: 'Lead and engineer can access.' }, { label: 'Needed', title: 'Final checklist', detail: 'One approval remains.' }, { label: 'Restricted', title: 'Infrastructure credentials', detail: 'Credentials stay in the protected administration layer.' }] },
        connections: { layout: 'connection-map', title: 'Tools connect by role and purpose', summary: 'A project Space should receive only the records needed for the work.', cards: [{ label: 'Planned', title: 'GitHub', detail: 'Issues, pull requests and release status.' }, { label: 'Planned', title: 'Calendar and chat', detail: 'Meetings and approved decisions.' }, { label: 'Restricted', title: 'Admin systems', detail: 'Least-privilege access only.' }] }
      },
      space: { title: 'Project Space', private: ['Member-private notes', 'Leadership preparation', 'Restricted credentials and HR context'], shared: ['Project goals and timeline', 'Role assignments and handoffs', 'Approved decisions and release history'] },
      soundtrack: {
        title: 'Midnight City', artist: 'M83', spotifyTrackId: '1eyzqe2QqGZUmfcPZtrIyt', previewUrl: '', note: 'A focused build and release track.',
        alternates: [
          { title: 'On Top Of The World', artist: 'Imagine Dragons', spotifyTrackId: '213x4gsFDm04hSqIUkg88w', note: 'A team lift before review.' },
          { title: 'A Sky Full of Stars', artist: 'Coldplay', spotifyTrackId: '0FDzzruyVECATHXKHFs9eJ', note: 'A release-moment choice.' }
        ]
      }
    }
  }
};
