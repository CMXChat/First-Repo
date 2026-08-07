window.BRIEF_DEMO_DATA = {
  meta: {
    product: 'Spaces',
    title: 'A clear view of what matters today',
    description: 'A working daily briefing that organizes approved information around clear Spaces, permissions, goals, and next steps.',
    defaultScenario: 'personal'
  },
  navigation: [
    { id: 'today', label: 'Today' },
    { id: 'workspace', label: 'Workspace' },
    { id: 'spaces', label: 'Spaces' },
    { id: 'how', label: 'How it works' }
  ],
  scenarios: {
    personal: {
      id: 'personal',
      label: 'Personal',
      short: 'One person, one useful day',
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
        detail: 'This clears the main work blocker and protects the later focus window.'
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
          title: 'Your day in one practical view',
          summary: 'Time, conditions and the next useful windows stay in one view.',
          cards: [
            { label: 'Next', title: 'Website review', detail: 'Prepare the prototype and two launch questions.' },
            { label: 'Later', title: 'Protected focus', detail: 'Keep 3:30 to 5:15 clear for the revised scope.' },
            { label: 'Evening', title: 'Reset the day', detail: 'Place remaining work on tomorrow’s plan before closing the day.' }
          ]
        },
        work: {
          title: 'Projects, messages and ownership',
          summary: 'Only the work that changes the next decision appears here.',
          cards: [
            { label: 'Needs action', title: 'Website launch', detail: 'Close two review notes and send the revised scope.' },
            { label: 'Waiting', title: 'Hosting access', detail: 'Review the reply when it arrives.' },
            { label: 'Learning', title: 'Python path', detail: 'Complete one API response parsing exercise.' }
          ]
        },
        money: {
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
          title: 'Movement, energy and a realistic next step',
          summary: 'The plan can become smaller and still preserve the habit.',
          cards: [
            { label: 'Movement', title: '30 minutes outside', detail: 'Use the safer weather window after 5:30 PM.' },
            { label: 'Energy', title: 'Moderate', detail: 'Keep the workout simple and finish it.' },
            { label: 'Correction', title: 'Protect consistency', detail: 'A shorter session still counts as useful evidence.' }
          ]
        },
        connections: {
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
        note: 'A bright track for getting one real task done.'
      }
    },
    relationship: {
      id: 'relationship',
      label: 'Relationship',
      short: 'Two private profiles, one approved shared Space',
      greeting: 'Good evening, Maya and Jordan.',
      headline: 'Start with reassurance, then work through the plan',
      summary: 'Each person keeps a private profile while the shared Space holds plans, promises and approved context.',
      next: { time: '8:15 PM', title: 'Weekend travel check-in', detail: 'Ten calm minutes, then decide the booking owner.' },
      recommendation: { label: 'Recommended next move', title: 'Confirm the plan and keep the discussion focused.', detail: 'Use the shared facts, name what still needs approval, and leave private processing private.' },
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
      tabs: [{ id: 'together', label: 'Together' }, { id: 'profiles', label: 'Profiles' }, { id: 'plans', label: 'Plans' }, { id: 'reflection', label: 'Reflection' }, { id: 'connections', label: 'Connections' }],
      details: {
        together: { title: 'One shared priority and one small repair', summary: 'Approved information stays separate from private processing.', cards: [{ label: 'Approved plan', title: 'Review travel at 8:15 PM', detail: 'Both people can see and change this item.' }, { label: 'Shared promise', title: 'Pause difficult decisions after 10 PM', detail: 'A clear rule for difficult evenings.' }, { label: 'Needs both', title: 'Move $300 into the trip fund', detail: 'The transfer waits for both approvals.' }] },
        profiles: { title: 'Two people remain two people', summary: 'Private memories remain in each person’s individual profile.', cards: [{ label: 'Maya private', title: 'Needs reassurance before logistics', detail: 'Visible only inside Maya’s private profile.' }, { label: 'Jordan private', title: 'Wants a clear booking plan', detail: 'Visible only inside Jordan’s private profile.' }, { label: 'Shared', title: 'Dinner can move to 8 PM', detail: 'Approved for the couple Space.' }] },
        plans: { title: 'Shared decisions with owners and timing', summary: 'Plans stay useful when each decision has an owner and approval state.', cards: [{ label: 'Travel', title: 'Choose the hotel', detail: 'Jordan prepares the options, and both people approve the final choice.' }, { label: 'Budget', title: 'Confirm trip fund', detail: 'Needs both before any transfer.' }, { label: 'Ritual', title: 'Sunday planning call', detail: 'Recurring shared check-in.' }] },
        reflection: { title: 'Practical reflection', summary: 'The Brief can support repair, appreciation, and clearer communication while each person keeps responsibility for their own interpretation.', cards: [{ label: 'Notice', title: 'Both want the relationship protected', detail: 'Different methods can still serve the shared goal.' }, { label: 'Repair', title: 'Name the hurt clearly', detail: 'Then agree on one practical change.' }, { label: 'Appreciation', title: 'Record what worked', detail: 'Useful patterns deserve memory too.' }] },
        connections: { title: 'Shared services, scoped permissions', summary: 'Each connection can be limited to the couple Space and a clear purpose.', cards: [{ label: 'Planned', title: 'Shared calendar', detail: 'Only approved events enter the Space.' }, { label: 'Optional', title: 'Music', detail: 'A shared playlist can remain separate from private listening.' }, { label: 'Restricted', title: 'Finance', detail: 'Only agreed trip records belong here.' }] }
      },
      space: { title: 'Relationship Space', private: ['Maya private context', 'Jordan private context', 'Individual memories and messages'], shared: ['Approved plans', 'Promises and decisions', 'Joint routines and responsibilities'] },
      soundtrack: { title: 'Yellow', artist: 'Coldplay', spotifyTrackId: '3AJwUDP919kvQ9QcozQPxg', previewUrl: '', note: 'A familiar shared favorite.' }
    },
    family: {
      id: 'family',
      label: 'Family',
      short: 'One household Brief with clear owners and private boundaries',
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
        detail: 'Once Elena accepts the handoff, both routes have clear coverage.'
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
        { label: 'Shopping', value: '7', note: 'Three already checked' },
        { label: 'Needs approval', value: '1', note: 'Pickup change' }
      ],
      flow: [
        { time: '2:45', title: 'Confirm pickup change', meta: 'Elena and Marcus' },
        { time: '3:10', title: 'School pickup', meta: 'Elena' },
        { time: '3:35', title: 'Leave for appointment', meta: 'Marcus and Zoe' },
        { time: '5:45', title: 'Dinner and household reset', meta: 'Shared routine' }
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
          title: 'One household view with a clear next move',
          summary: 'The family Brief combines approved plans and responsibilities while each person keeps a separate private profile.',
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
                { time: '4:00 PM', title: 'Zoe’s appointment', owner: 'Marcus + Zoe', kind: 'Shared' },
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
            { title: 'Groceries', items: [{ title: 'Milk', owner: 'Picked up', checked: true }, { title: 'Berries', owner: 'Picked up', checked: true }, { title: 'Pasta', owner: 'Elena', checked: false }, { title: 'Lunch fruit', owner: 'Unclaimed', checked: false }] },
            { title: 'Household', items: [{ title: 'Trash bags', owner: 'Marcus', checked: false }, { title: 'Dish soap', owner: 'Picked up', checked: true }] },
            { title: 'Pharmacy', items: [{ title: 'Bandages', owner: 'Unclaimed', checked: false }] }
          ]
        },
        access: {
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
        note: 'A bright shared track for getting the household moving.'
      }
    },
    business: {
      id: 'business', label: 'Business partners', short: 'A shared operating view with private partner context', greeting: 'Good afternoon, Amina and Eli.', headline: 'The company needs one clear operating picture.', summary: 'Cash, projects, risks, and decisions become visible while each partner’s private notes remain separate.',
      next: { time: '4:00 PM', title: 'Collections and capacity review', detail: 'Confirm expected cash and decide whether contractor approval stays paused.' },
      recommendation: { label: 'Recommended next move', title: 'Collect the expected cash before adding fixed cost', detail: 'Tie contractor approval to received cash and treat pipeline value as unconfirmed.' },
      weather: { location: 'London and New York', temperature: 72, condition: 'Mixed operating day', high: 75, low: 61, advice: 'Cash timing drives this briefing.', hourly: [{ time: 'NY', temp: 72, rain: 18 }, { time: 'London', temp: 65, rain: 42 }, { time: 'Close', temp: 70, rain: 15 }, { time: 'Tomorrow', temp: 68, rain: 24 }] },
      stats: [{ label: 'Revenue MTD', value: '$82.4k', note: 'Fictional' }, { label: 'Cash collected', value: '62%', note: 'Below target' }, { label: 'At-risk work', value: '2', note: 'Needs owners' }, { label: 'Decision', value: 'Paused', note: 'Contractor' }],
      flow: [{ time: '10:00', title: 'Delivery review', meta: 'London' }, { time: '12:30', title: 'Collections call', meta: 'New York' }, { time: '4:00', title: 'Partner decision', meta: 'Shared' }, { time: '5:00', title: 'Owner updates', meta: 'Record outcome' }],
      tabs: [{ id: 'executive', label: 'Executive' }, { id: 'finance', label: 'Finance' }, { id: 'projects', label: 'Projects' }, { id: 'decisions', label: 'Decisions' }, { id: 'connections', label: 'Connections' }],
      details: {
        executive: { title: 'The operating picture in five signals', summary: 'Revenue matters, but cash, ownership and deadlines decide the day.', cards: [{ label: 'Cash', title: '62% collected', detail: 'Below the fictional 75% target.' }, { label: 'Delivery', title: 'Two overlapping projects', detail: 'Capacity risk begins next week.' }, { label: 'Decision', title: 'Contractor remains paused', detail: 'Review after receivables clear.' }] },
        finance: { title: 'Cash, margin and exposure', summary: 'Financial context becomes useful when tied to a decision.', cards: [{ label: 'Receivables', title: '$18k expected', detail: 'Confirm dates before committing cost.' }, { label: 'Allocation', title: '44% delivery', detail: 'Largest fictional operating category.' }, { label: 'Boundary', title: 'Approval required', detail: 'The demo prepares a decision and waits for approval before execution.' }] },
        projects: { title: 'Risks, owners and deadlines', summary: 'Unowned work is easy to miss.', cards: [{ label: 'Watch', title: 'London capacity', detail: 'Amina owns the mitigation plan.' }, { label: 'At risk', title: 'Client approval', detail: 'Eli owns the follow-up.' }, { label: 'On track', title: 'Website release', detail: 'Two review notes remain.' }] },
        decisions: { title: 'Evidence becomes an owner and a deadline', summary: 'Repeated debates can become written operating rules.', cards: [{ label: 'Approved', title: 'Pause contractor', detail: 'Review after cash collection.' }, { label: 'Needed', title: 'Pricing exception rule', detail: 'Turn repeated exceptions into policy.' }, { label: 'Owner', title: 'US collection calls', detail: 'Eli, today.' }] },
        connections: { title: 'Business connections with purpose limits', summary: 'The company Space receives approved company records while personal records stay in their original Spaces.', cards: [{ label: 'Planned', title: 'Accounting', detail: 'Read-only financial summaries first.' }, { label: 'Planned', title: 'Project tools', detail: 'Tasks, blockers and owners.' }, { label: 'Restricted', title: 'Partner-private notes', detail: 'Private notes stay in each partner’s individual profile.' }] }
      },
      space: { title: 'Business Space', private: ['Partner-private concerns', 'Individual inbox and preparation', 'Personal financial information'], shared: ['Company KPIs', 'Approved projects and decisions', 'Owners, deadlines and operating history'] },
      soundtrack: { title: 'On Top Of The World', artist: 'Imagine Dragons', spotifyTrackId: '213x4gsFDm04hSqIUkg88w', previewUrl: '', note: 'Bright operating-review energy.' }
    },
    trainer: {
      id: 'trainer', label: 'Trainer and student', short: 'Goals, evidence and coaching boundaries', greeting: 'Good afternoon, Nina and Sam.', headline: 'The plan should adapt while keeping accountability.', summary: 'Training, recovery, habits, and check-ins stay useful because the system records evidence and respects health boundaries.',
      next: { time: '6:00 PM', title: 'Upper-body session', detail: 'Complete the warm-up check before choosing normal or reduced volume.' },
      recommendation: { label: 'Recommended next move', title: 'Use the smaller plan if readiness is low.', detail: 'Recording each adaptation improves future recommendations.' },
      weather: { location: 'Training window', temperature: 79, condition: 'Warm and dry', high: 81, low: 68, advice: 'Indoor training should be comfortable, but hydrate before the session.', hourly: [{ time: 'Now', temp: 79, rain: 5 }, { time: '6 PM', temp: 78, rain: 6 }, { time: '8 PM', temp: 73, rain: 8 }, { time: 'Late', temp: 69, rain: 9 }] },
      stats: [{ label: 'Week complete', value: '3/4', note: 'One planned today' }, { label: 'Sleep', value: '6.5h', note: 'Reduce if needed' }, { label: 'Pain flags', value: '0', note: 'Check again' }, { label: 'Protein', value: '72%', note: 'Target progress' }],
      flow: [{ time: '5:45', title: 'Readiness check', meta: 'Student' }, { time: '6:00', title: 'Training session', meta: 'Adaptive plan' }, { time: '7:10', title: 'Log evidence', meta: 'Sets and notes' }, { time: 'Tomorrow', title: 'Coach review', meta: 'Adjust next step' }],
      tabs: [{ id: 'today', label: 'Today' }, { id: 'habits', label: 'Habits' }, { id: 'progress', label: 'Progress' }, { id: 'recovery', label: 'Recovery' }, { id: 'connections', label: 'Connections' }],
      details: {
        today: { title: 'One workout, one check-in, one adaptive decision', summary: 'The plan can change while the goal stays in view.', cards: [{ label: 'Warm-up', title: 'Check coordination and pain', detail: 'Choose normal or reduced volume after the check.' }, { label: 'Main work', title: 'Upper-body session', detail: 'Keep the progression simple.' }, { label: 'Close', title: 'Log what happened', detail: 'Evidence improves the next recommendation.' }] },
        habits: { title: 'Patterns support a conversation', summary: 'Each pattern remains reviewable and open to correction.', cards: [{ label: 'Movement', title: '3 completed days', detail: 'Strongest current pattern.' }, { label: 'Sleep', title: 'Below target twice', detail: 'Ask what caused it before changing the plan.' }, { label: 'Nutrition', title: 'Improving', detail: 'One meal still creates the gap.' }] },
        progress: { title: 'Evidence before confidence', summary: 'Completed work, corrections and repeated outcomes matter more than motivational language.', cards: [{ label: 'Strength', title: 'Two lifts progressed', detail: 'Fictional training evidence.' }, { label: 'Consistency', title: 'Three weeks active', detail: 'One reduced session still counted.' }, { label: 'Next block', title: 'Ready after review', detail: 'Coach approval required.' }] },
        recovery: { title: 'Sleep, pain and readiness can change the plan', summary: 'Unusual pain requires an appropriate pause and professional guidance when needed.', cards: [{ label: 'Sleep', title: '6.5 hours', detail: 'Watch warm-up quality.' }, { label: 'Pain', title: 'Clear check-in', detail: 'The latest report shows no unusual pain, with another check during movement.' }, { label: 'Recovery', title: 'Moderate', detail: 'Reduced volume remains available.' }] },
        connections: { title: 'Fitness connections need health boundaries', summary: 'Data supports coaching, while qualified care remains with a professional.', cards: [{ label: 'Planned', title: 'Workout history', detail: 'Sets, reps and completion.' }, { label: 'Optional', title: 'Wearable data', detail: 'Readiness signals with user permission.' }, { label: 'Boundary', title: 'Medical records', detail: 'Separate protected access and professional oversight.' }] }
      },
      space: { title: 'Training Space', private: ['Student-private health context', 'Trainer-private coaching preparation', 'Personal notes outside the plan'], shared: ['Approved training plan', 'Check-ins and evidence', 'Coach feedback and next actions'] },
      soundtrack: { title: 'POWER', artist: 'Kanye West', spotifyTrackId: '2gZUPNdnz5Y45eiGxpHGSc', previewUrl: '', note: 'A high-energy training option.' }
    },
    team: {
      id: 'team', label: 'Team and project', short: 'Roles, handoffs and shared project truth', greeting: 'Good afternoon, Atlas team.', headline: 'Give everyone the same goal with access matched to their role', summary: 'Members receive role-relevant work, while project leads keep the broader operating picture and restricted context.',
      next: { time: '3:00 PM', title: 'Release readiness review', detail: 'Confirm the final blocker, handoff owner and rollback decision.' },
      recommendation: { label: 'Recommended next move', title: 'Resolve the unowned handoff before adding more work.', detail: 'A visible dependency with no receiver is the highest operational risk.' },
      weather: { location: 'Project conditions', temperature: 74, condition: 'Release window open', high: 76, low: 63, advice: 'The meaningful condition is blocker status and owner clarity.', hourly: [{ time: 'Now', temp: 74, rain: 11 }, { time: 'Review', temp: 75, rain: 12 }, { time: 'Release', temp: 72, rain: 10 }, { time: 'Close', temp: 68, rain: 9 }] },
      stats: [{ label: 'Project health', value: '82%', note: 'Fictional' }, { label: 'Open blockers', value: '2', note: 'One unowned' }, { label: 'Handoffs', value: '4', note: 'Three accepted' }, { label: 'Release', value: 'Today', note: 'Approval pending' }],
      flow: [{ time: '1:30', title: 'Member work', meta: 'Role view' }, { time: '3:00', title: 'Readiness review', meta: 'Project Space' }, { time: '4:00', title: 'Release decision', meta: 'Lead approval' }, { time: '5:00', title: 'Record outcome', meta: 'Shared history' }],
      tabs: [{ id: 'mywork', label: 'My work' }, { id: 'project', label: 'Project' }, { id: 'handoffs', label: 'Handoffs' }, { id: 'procedures', label: 'Procedures' }, { id: 'connections', label: 'Connections' }],
      details: {
        mywork: { title: 'Your role-specific work', summary: 'A member sees what they own, what blocks it, and the approved context they need.', cards: [{ label: 'Next', title: 'Finish responsive review', detail: 'Sam owns this task, which is due before the readiness review.' }, { label: 'Dependency', title: 'Content approval', detail: 'Waiting on Jordan.' }, { label: 'Context', title: 'Release goal', detail: 'Protect the mobile experience.' }] },
        project: { title: 'One shared timeline with visible blockers', summary: 'Status should follow the evidence, even when the result is less flattering.', cards: [{ label: 'Complete', title: 'Core build', detail: 'Accepted by the project lead.' }, { label: 'Watch', title: 'Mobile review', detail: 'Two issues remain.' }, { label: 'Blocked', title: 'Final handoff', detail: 'Receiver not confirmed.' }] },
        handoffs: { title: 'Every transfer names sender, receiver and missing evidence', summary: 'Handoffs work for delivery, operations, care coordination and field work.', cards: [{ label: 'Accepted', title: 'Design to development', detail: 'Files and notes complete.' }, { label: 'Waiting', title: 'Development to QA', detail: 'Mobile evidence missing.' }, { label: 'Unowned', title: 'QA to release', detail: 'Receiver must be assigned.' }] },
        procedures: { title: 'Preparation before a launch or operation', summary: 'Restricted information can support readiness while remaining in lead-access records.', cards: [{ label: 'Ready', title: 'Rollback plan', detail: 'Lead and engineer can access.' }, { label: 'Needed', title: 'Final checklist', detail: 'One approval remains.' }, { label: 'Restricted', title: 'Infrastructure credentials', detail: 'Credentials stay in the protected administration layer.' }] },
        connections: { title: 'Tools connect by role and purpose', summary: 'A project Space should receive only the records needed for the work.', cards: [{ label: 'Planned', title: 'GitHub', detail: 'Issues, pull requests and release status.' }, { label: 'Planned', title: 'Calendar and chat', detail: 'Meetings and approved decisions.' }, { label: 'Restricted', title: 'Admin systems', detail: 'Least-privilege access only.' }] }
      },
      space: { title: 'Project Space', private: ['Member-private notes', 'Leadership preparation', 'Restricted credentials and HR context'], shared: ['Project goals and timeline', 'Role assignments and handoffs', 'Approved decisions and release history'] },
      soundtrack: { title: 'Midnight City', artist: 'M83', spotifyTrackId: '1eyzqe2QqGZUmfcPZtrIyt', previewUrl: '', note: 'A focused build and release track.' }
    }
  }
};
