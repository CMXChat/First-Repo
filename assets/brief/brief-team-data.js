(() => {
  'use strict';

  const presets = window.BRIEF_PRESETS;
  const data = window.BRIEF_DATA;
  const scenarios = window.BRIEF_SCENARIOS;
  if (!presets || !data?.scenarios || !scenarios) return;

  presets.team = {
    id: 'team',
    label: 'Team and project',
    profileName: 'Atlas Delivery Team',
    greeting: 'Good afternoon, Atlas team.',
    heroTitle: 'Everyone sees the work they need. Nothing more.',
    summary: 'Role-based spaces turn project status, procedures, handoffs, risks, approvals and finance signals into one shared operating picture.'
  };

  data.scenarios.team = {
    timezone: 'America/New_York',
    nextUp: {
      title: 'Launch readiness handoff',
      time: '3:00 PM · 25 minutes',
      prep: ['Confirm blockers', 'Assign every handoff', 'Approve the release owner']
    },
    weather: {
      location: 'Brooklyn, New York',
      condition: 'Mostly sunny',
      advice: 'Field work is clear through early evening. Remote and onsite teams can keep the same readiness brief.',
      metrics: [
        { label: 'Feels like', value: '85°' },
        { label: 'Rain', value: '8%' },
        { label: 'Wind', value: '9 mph' },
        { label: 'Sunset', value: '8:09 PM' }
      ],
      hourly: [
        { time: 'Now', temp: 82, condition: 'Sunny', rain: 4, wind: 9 },
        { time: '2 PM', temp: 84, condition: 'Sunny', rain: 5, wind: 10 },
        { time: '4 PM', temp: 85, condition: 'Bright', rain: 8, wind: 11 },
        { time: '6 PM', temp: 81, condition: 'Clear', rain: 6, wind: 8 },
        { time: '8 PM', temp: 76, condition: 'Clear', rain: 4, wind: 6 }
      ],
      daily: [
        { time: 'Today', temp: 85, low: 72, condition: 'Sunny', rain: 8 },
        { time: 'Tue', temp: 83, low: 70, condition: 'Clouds', rain: 18 },
        { time: 'Wed', temp: 79, low: 68, condition: 'Rain', rain: 62 },
        { time: 'Thu', temp: 81, low: 69, condition: 'Clear', rain: 12 }
      ]
    },
    priorities: [
      { id: 'team-blocker', rank: '01', title: 'Resolve the launch blocker', detail: 'The permissions review is the only item preventing the final release check.', due: 'Before 2:30 PM', owner: 'Security lead', status: 'BLOCKER' },
      { id: 'team-handoff', rank: '02', title: 'Complete the QA to deployment handoff', detail: 'Attach the approved checklist and name the rollback owner.', due: '3:00 PM', owner: 'QA + DevOps', status: 'HANDOFF' },
      { id: 'team-brief', rank: '03', title: 'Give each member the right view', detail: 'Members see their tasks and dependencies. Leadership sees aggregate risk and approvals.', due: 'Before launch', owner: 'Project lead', status: 'ROLE SPACE' }
    ],
    schedule: [
      { time: '1:30 PM', title: 'Member work blocks', meta: 'Role-private assignments' },
      { time: '2:15 PM', title: 'Readiness check', meta: 'Shared project space' },
      { time: '3:00 PM', title: 'Launch handoff', meta: 'QA, DevOps and project lead' },
      { time: '4:30 PM', title: 'Post-release watch', meta: 'Operations and finance signals' }
    ],
    shared: {
      private: [
        { label: 'Member-private', title: 'Draft notes and unfinished work', note: 'Visible to the member and approved supervisors only.' },
        { label: 'Role-private', title: 'Security findings and clinical notes', note: 'Restricted by role, purpose and need-to-know.' },
        { label: 'Leadership-private', title: 'Compensation and sensitive personnel context', note: 'Never exposed through the general team space.' }
      ],
      shared: [
        { label: 'Project space', title: 'Launch readiness is 82%', note: 'Shared status, owners, dependencies and deadlines.' },
        { label: 'Procedure space', title: 'All required pre-operation checks are visible', note: 'Only approved readiness information is shared.' },
        { label: 'Finance watch', title: 'Budget remains inside the approved threshold', note: 'Members see only the financial context needed for their work.' }
      ]
    }
  };

  scenarios.team = {
    kicker: 'ROLE-BASED TEAM + PROJECT BRIEF',
    title: 'One project, many views, controlled by purpose.',
    summary: 'Each member receives the assignments, handoffs, procedures and risks relevant to their role. Shared spaces hold approved project truth while sensitive records remain restricted.',
    members: [
      { role: 'Project lead', name: 'Leah', sees: 'Whole-project status, owners, approvals, blockers and leadership decisions', private: 'Personnel notes, compensation and unapproved drafts', next: 'Confirm the release owner' },
      { role: 'Designer', name: 'Noah', sees: 'Approved requirements, design feedback, dependencies and delivery dates', private: 'Security findings and unrelated finance records', next: 'Close the final accessibility note' },
      { role: 'Developer', name: 'Priya', sees: 'Technical tasks, accepted designs, environments, incidents and deployment handoffs', private: 'Private client messages and personnel records', next: 'Attach the rollback checklist' },
      { role: 'QA / readiness', name: 'Marcus', sees: 'Test evidence, procedure steps, blockers, sign-offs and escalation paths', private: 'Unapproved member notes and leadership-only context', next: 'Verify the permissions fix' }
    ],
    spaces: [
      { label: 'Private profile', text: 'Personal notes, learning preferences, workload and drafts stay with the member.' },
      { label: 'Role space', text: 'People with the same responsibility share procedures, evidence and handoffs.' },
      { label: 'Project space', text: 'Approved scope, tasks, dependencies, risks, decisions and deadlines become the shared operating truth.' },
      { label: 'Leadership space', text: 'Aggregate finance, staffing, legal and escalation context stays limited to approved leaders.' }
    ],
    timeline: [
      { phase: 'Plan', state: 'Complete', owner: 'Project lead', detail: 'Scope, acceptance criteria and owners approved.' },
      { phase: 'Build', state: 'Complete', owner: 'Design + development', detail: 'Primary work finished with two documented exceptions.' },
      { phase: 'Verify', state: 'In progress', owner: 'QA + security', detail: 'One permissions blocker remains.' },
      { phase: 'Release', state: 'Waiting', owner: 'DevOps', detail: 'Begins after readiness approval.' },
      { phase: 'Watch', state: 'Scheduled', owner: 'Operations', detail: 'Monitor errors, usage and financial impact.' }
    ],
    handoffs: [
      { from: 'Design', to: 'Development', status: 'Accepted', item: 'Final interaction specifications' },
      { from: 'Development', to: 'QA', status: 'Needs evidence', item: 'Permissions fix and regression result' },
      { from: 'QA', to: 'DevOps', status: 'Waiting', item: 'Signed readiness checklist' },
      { from: 'Operations', to: 'Leadership', status: 'Scheduled', item: 'Post-release performance and cost summary' }
    ],
    procedure: [
      { label: 'Identity', state: 'Ready', detail: 'Correct people and roles confirmed.' },
      { label: 'Materials', state: 'Ready', detail: 'Required files, tools and evidence attached.' },
      { label: 'Risk check', state: 'Blocked', detail: 'One permissions issue requires approval.' },
      { label: 'Escalation', state: 'Ready', detail: 'Owner, fallback and stop conditions are clear.' }
    ],
    finance: [
      { label: 'Budget used', value: '68%', note: 'Fictional project budget' },
      { label: 'Forecast variance', value: '+4%', note: 'Inside the demonstration threshold' },
      { label: 'Unapproved cost', value: '$0', note: 'No action without the correct approval' }
    ],
    security: [
      'Least-privilege access by person, role and space',
      'Encrypted transport with protected server-side secrets',
      'Audit history for approvals, changes and sensitive reads',
      'Time-limited access, rate limits, backups and revocation',
      'Approval gates before external messages, financial changes or operational actions'
    ],
    songs: [
      { title: 'Midnight City', artist: 'M83', spotify: '1eyzqe2QqGZUmfcPZtrIyt', note: 'Build focus' },
      { title: 'On Top Of The World', artist: 'Imagine Dragons', spotify: '213x4gsFDm04hSqIUkg88w', note: 'Team lift' },
      { title: 'A Sky Full of Stars', artist: 'Coldplay', spotify: '0FDzzruyVECATHXKHFs9eJ', note: 'Release moment' }
    ]
  };

  window.BRIEF_TEAM_VIEW = {
    quote: 'A strong team sees the same mission without exposing every private detail.',
    updated: 'Fictional team and project demonstration',
    quickSignals: [
      'Launch readiness 82%',
      '1 blocker needs approval',
      '3 handoffs due today',
      'Budget remains in range',
      'Every action has an owner'
    ]
  };
})();
