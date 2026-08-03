window.BRIEF_DATA = {
  edition: {
    date: 'Monday, August 3, 2026',
    generated: 'Fictional product demonstration',
    timezone: 'America/New_York'
  },
  scenarios: {
    individual: {
      timezone: 'America/New_York',
      nextUp: {
        title: 'Website review with Morgan',
        time: '2:30 PM · 45 minutes',
        prep: ['Open prototype', 'Confirm launch risks', 'Leave with one owner']
      },
      weather: {
        location: 'Brooklyn, New York',
        condition: 'Mostly sunny',
        advice: 'Best outdoor window: 5:30–7:30 PM, once the heat starts backing off.',
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
          { time: '8 PM', temp: 76, condition: 'Clear', rain: 4, wind: 6 },
          { time: '10 PM', temp: 73, condition: 'Calm', rain: 3, wind: 4 }
        ],
        daily: [
          { time: 'Today', temp: 85, low: 72, condition: 'Sunny', rain: 8 },
          { time: 'Tue', temp: 83, low: 70, condition: 'Clouds', rain: 18 },
          { time: 'Wed', temp: 79, low: 68, condition: 'Rain', rain: 62 },
          { time: 'Thu', temp: 81, low: 69, condition: 'Clear', rain: 12 },
          { time: 'Fri', temp: 84, low: 71, condition: 'Sunny', rain: 7 },
          { time: 'Sat', temp: 86, low: 73, condition: 'Hot', rain: 10 },
          { time: 'Sun', temp: 82, low: 70, condition: 'Mixed', rain: 24 }
        ]
      },
      priorities: [
        { id: 'send-proposal', rank: '01', title: 'Send the revised proposal', detail: 'Resolve the two open pricing notes, then send it before 2 PM.', due: 'Before 2:00 PM', owner: 'You', status: 'SUGGESTED' },
        { id: 'client-review', rank: '02', title: 'Prepare the client review', detail: 'Open the prototype, list launch risks and decide which item needs an owner today.', due: 'Before 2:30 PM', owner: 'You', status: 'CONNECTED DEMO' },
        { id: 'movement', rank: '03', title: 'Use the cooler evening window', detail: 'A 30-minute walk or short workout fits best after the temperature drops.', due: '5:30–7:30 PM', owner: 'You', status: 'ANALYSIS' }
      ],
      schedule: [
        { time: '1:30 PM', title: 'Proposal pass', meta: '30 minutes · private' },
        { time: '2:30 PM', title: 'Website review with Morgan', meta: '45 minutes · calendar demo' },
        { time: '3:30 PM', title: 'Focused build window', meta: '1 hour 45 minutes · suggested' },
        { time: '6:15 PM', title: 'Walk and decompression', meta: '30 minutes · remembered routine' }
      ],
      shared: {
        private: [
          { label: 'Private goal', title: 'Finish the proposal before the meeting', note: 'Visible only in this individual profile.' },
          { label: 'Private health', title: 'Move during the cooler evening window', note: 'Not shared automatically.' },
          { label: 'Private note', title: 'Ask for clarity before agreeing to more scope', note: 'Personal preparation only.' }
        ],
        shared: [
          { label: 'Shared plan', title: 'Dinner at 7:45 PM', note: 'Approved for the shared space.' },
          { label: 'Shared decision', title: 'Choose the weekend train', note: 'Both people can review the options.' },
          { label: 'Shared reminder', title: 'Call the vet tomorrow morning', note: 'One owner still needs to be assigned.' }
        ]
      }
    },
    couple: {
      timezone: 'America/New_York',
      nextUp: {
        title: 'Ten-minute shared check-in',
        time: '7:40 PM · 10 minutes',
        prep: ['One appreciation each', 'One practical decision', 'No scorekeeping']
      },
      weather: {
        location: 'Brooklyn, New York',
        condition: 'Warm evening',
        advice: 'A walk after 7 PM gives the conversation somewhere to go besides another glowing rectangle.',
        metrics: [
          { label: 'Feels like', value: '79°' },
          { label: 'Rain', value: '10%' },
          { label: 'Wind', value: '7 mph' },
          { label: 'Sunset', value: '8:09 PM' }
        ],
        hourly: [
          { time: 'Now', temp: 82, condition: 'Bright', rain: 8, wind: 8 },
          { time: '5 PM', temp: 82, condition: 'Mixed', rain: 10, wind: 8 },
          { time: '7 PM', temp: 78, condition: 'Clearer', rain: 7, wind: 7 },
          { time: '9 PM', temp: 74, condition: 'Calm', rain: 4, wind: 5 },
          { time: '11 PM', temp: 72, condition: 'Clear', rain: 3, wind: 4 }
        ],
        daily: [
          { time: 'Today', temp: 84, low: 72, condition: 'Mixed', rain: 18 },
          { time: 'Tue', temp: 85, low: 73, condition: 'Sunny', rain: 12 },
          { time: 'Wed', temp: 81, low: 70, condition: 'Showers', rain: 48 },
          { time: 'Thu', temp: 82, low: 69, condition: 'Clear', rain: 14 }
        ]
      },
      priorities: [
        { id: 'couple-plan', rank: '01', title: 'Decide the weekend plan', detail: 'Pick the train and book only after both people confirm the budget.', due: 'Tonight', owner: 'Shared', status: 'APPROVED SHARED' },
        { id: 'couple-repair', rank: '02', title: 'Finish one conversation calmly', detail: 'Use the neutral summary below, correct anything inaccurate, then agree on one next step.', due: '10-minute check-in', owner: 'Both', status: 'MEDIATOR DEMO' },
        { id: 'couple-private', rank: '03', title: 'Protect private processing time', detail: 'Each person keeps one private note that is not automatically shared or interpreted.', due: 'Before check-in', owner: 'Each person', status: 'PRIVATE' }
      ],
      schedule: [
        { time: '5:30 PM', title: 'Maya private work block', meta: 'Private profile · not shared in detail' },
        { time: '6:45 PM', title: 'Jordan gym session', meta: 'Private health · shared only as unavailable time' },
        { time: '7:40 PM', title: 'Shared check-in', meta: '10 minutes · approved shared space' },
        { time: '8:00 PM', title: 'Dinner and one episode', meta: 'Shared ritual · remembered preference' }
      ],
      shared: {
        private: [
          { label: 'Maya private', title: 'Needs an hour without problem-solving', note: 'The platform can remember the boundary without sharing the private journal entry.' },
          { label: 'Jordan private', title: 'Wants time to choose words carefully', note: 'A private draft can become a shared message only after approval.' },
          { label: 'Private by default', title: 'Personal conversations stay personal', note: 'Shared spaces receive only approved summaries and actions.' }
        ],
        shared: [
          { label: 'Shared promise', title: 'No major decisions during late-night arguments', note: 'Confirmed by both people and reviewable later.' },
          { label: 'Shared plan', title: 'Weekend train decision', note: 'Budget and preferred departure time are visible to both.' },
          { label: 'Shared ritual', title: 'Ten calm minutes before the show', note: 'The briefing can remind both people without blaming either one.' }
        ]
      }
    },
    partners: {
      timezone: 'Europe/London',
      nextUp: {
        title: 'UK–US operating review',
        time: '6:00 PM London · 1:00 PM New York',
        prep: ['Cash collected', 'Client risks', 'One owner per action']
      },
      weather: {
        location: 'London, United Kingdom',
        condition: 'Cloudy with brighter breaks',
        advice: 'The best walking window is around 6:30 PM, after the operating review and before the evening cools.',
        metrics: [
          { label: 'Feels like', value: '19°C' },
          { label: 'Rain', value: '22%' },
          { label: 'Wind', value: '14 km/h' },
          { label: 'Sunset', value: '8:43 PM' }
        ],
        hourly: [
          { time: 'Now', temp: 20, condition: 'Cloudy', rain: 18, wind: '14 km/h' },
          { time: '5 PM', temp: 20, condition: 'Bright breaks', rain: 16, wind: '13 km/h' },
          { time: '7 PM', temp: 18, condition: 'Mixed', rain: 22, wind: '11 km/h' },
          { time: '9 PM', temp: 16, condition: 'Cloudy', rain: 20, wind: '9 km/h' },
          { time: '11 PM', temp: 15, condition: 'Cool', rain: 14, wind: '8 km/h' }
        ],
        daily: [
          { time: 'Today', temp: 21, low: 14, condition: 'Clouds', rain: 28 },
          { time: 'Tue', temp: 22, low: 15, condition: 'Mixed', rain: 22 },
          { time: 'Wed', temp: 19, low: 13, condition: 'Rain', rain: 58 },
          { time: 'Thu', temp: 23, low: 15, condition: 'Bright', rain: 18 }
        ]
      },
      priorities: [
        { id: 'collect-cash', rank: '01', title: 'Assign the £31k receivables follow-up', detail: 'Three invoices are more than 21 days old. Name one owner before the operating review ends.', due: 'Today', owner: 'Unassigned', status: 'FINANCE DEMO' },
        { id: 'risk-account', rank: '02', title: 'Protect the at-risk account', detail: 'The client has two unresolved delivery concerns and no scheduled executive check-in.', due: 'Before Friday', owner: 'Amina', status: 'RISK' },
        { id: 'approve-hire', rank: '03', title: 'Decide whether the contractor starts Monday', detail: 'Pipeline supports the cost, but cash timing needs to be considered first.', due: '6:00 PM London', owner: 'Both partners', status: 'DECISION' }
      ],
      schedule: [
        { time: '4:30 PM UK', title: 'Finance review', meta: '30 minutes · London partner' },
        { time: '1:00 PM NY', title: 'UK–US operating review', meta: '45 minutes · shared' },
        { time: '7:00 PM UK', title: 'Client recovery call', meta: '30 minutes · owner assigned' },
        { time: '2:30 PM NY', title: 'Pipeline follow-up block', meta: '60 minutes · New York partner' }
      ],
      shared: {
        private: [
          { label: 'Private partner note', title: 'Concern about hiring pace', note: 'The concern can remain private until the partner chooses to share or convert it into a decision question.' },
          { label: 'Private compensation', title: 'Personal financial details stay separate', note: 'Only approved business-level numbers enter the shared operating brief.' },
          { label: 'Private draft', title: 'Feedback can be rewritten before sharing', note: 'The AI can help make it direct without turning it into an accusation.' }
        ],
        shared: [
          { label: 'Shared decision', title: 'Contractor start date', note: 'Both partners see the evidence, options and final owner.' },
          { label: 'Shared finance', title: '£31k in overdue receivables', note: 'Business records, not either partner’s personal finances.' },
          { label: 'Shared risk', title: 'One account requires executive attention', note: 'The briefing records the decision and next review date.' }
        ]
      }
    },
    trainer: {
      timezone: 'America/New_York',
      nextUp: {
        title: 'Lower-body strength session',
        time: '5:45 PM · 55 minutes',
        prep: ['Warm-up logged', 'Knee check', 'Use last session weights']
      },
      weather: {
        location: 'Queens, New York',
        condition: 'Warm with a cooler evening',
        advice: 'Outdoor cardio is better after 7 PM. The strength session can stay indoors at 5:45 PM.',
        metrics: [
          { label: 'Feels like', value: '84°' },
          { label: 'Rain', value: '12%' },
          { label: 'Wind', value: '8 mph' },
          { label: 'Sunset', value: '8:08 PM' }
        ],
        hourly: [
          { time: 'Now', temp: 82, condition: 'Bright', rain: 8, wind: 8 },
          { time: '4 PM', temp: 84, condition: 'Warm', rain: 12, wind: 9 },
          { time: '6 PM', temp: 80, condition: 'Mixed', rain: 10, wind: 7 },
          { time: '8 PM', temp: 75, condition: 'Clear', rain: 5, wind: 5 },
          { time: '10 PM', temp: 72, condition: 'Calm', rain: 3, wind: 4 }
        ],
        daily: [
          { time: 'Today', temp: 84, low: 72, condition: 'Warm', rain: 18 },
          { time: 'Tue', temp: 83, low: 70, condition: 'Clouds', rain: 24 },
          { time: 'Wed', temp: 79, low: 68, condition: 'Rain', rain: 62 },
          { time: 'Thu', temp: 81, low: 69, condition: 'Clear', rain: 12 }
        ]
      },
      priorities: [
        { id: 'trainer-session', rank: '01', title: 'Complete the planned strength session', detail: 'Keep the first working set conservative, then adjust using the knee check.', due: '5:45 PM', owner: 'Sam', status: 'COACH PLAN' },
        { id: 'trainer-protein', rank: '02', title: 'Close the protein gap', detail: 'Current intake is tracking at 82% of the daily target. One planned meal closes most of it.', due: 'Dinner', owner: 'Sam', status: 'PATTERN' },
        { id: 'trainer-note', rank: '03', title: 'Confirm the knee note', detail: 'The coach sees the training impact only after Sam approves sharing the private symptom note.', due: 'Before session', owner: 'Sam', status: 'REQUIRES APPROVAL' }
      ],
      schedule: [
        { time: '12:30 PM', title: 'Lunch and hydration check', meta: 'Private habit data' },
        { time: '4:45 PM', title: 'Pre-session snack', meta: 'Remembered routine · suggested' },
        { time: '5:45 PM', title: 'Lower-body strength', meta: '55 minutes · shared coach plan' },
        { time: '8:30 PM', title: 'Two-minute session note', meta: 'Student approves what coach can view' }
      ],
      shared: {
        private: [
          { label: 'Student private', title: 'Body-image journal stays private', note: 'The coach receives only approved training-relevant context.' },
          { label: 'Coach private', title: 'Draft programming notes', note: 'The student sees the final plan, not every internal draft.' },
          { label: 'Temporary note', title: 'Poor sleep may expire after 48 hours', note: 'Temporary context does not need to become a permanent identity fact.' }
        ],
        shared: [
          { label: 'Shared goal', title: 'Four sessions this week', note: 'Progress and plan are visible to coach and student.' },
          { label: 'Shared pattern', title: 'Late sessions reduce completion', note: 'Based on approved logs, with the user able to correct the conclusion.' },
          { label: 'Shared action', title: 'Move Thursday workout to 6 PM', note: 'The action requires confirmation before changing a calendar.' }
        ]
      }
    }
  }
};
