window.BRIEF_DATA = {
  edition: {
    date: 'Monday, August 3, 2026',
    generated: 'Fictional product demonstration',
    timezone: 'America/New_York'
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
};
