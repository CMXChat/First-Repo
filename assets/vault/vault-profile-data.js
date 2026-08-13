'use strict';

/* Shared profile demo content. Approved facts only; demo briefing copy is labeled. */
window.VaultProfiles = Object.freeze({
  biggz: {
    name: 'Biggz', initials: 'BG', role: 'Vault owner', location: 'London', zone: 'Europe/London', accent: 'violet',
    intro: 'London time, the server catch-up, your people, and the important stuff are all right here.',
    facts: ['Owner of Vault 3.0', 'Based in London'],
    status: 'Owner room live', connections: ['Anymuz · co-owner', 'Mel · South Africa'],
    currentTitle: 'Simple and useful', current: 'Catch up, check London time, find someone, or play a song.'
  },
  mel: {
    name: 'Mel', initials: 'ME', role: 'Vault member', location: 'South Africa', zone: 'Africa/Johannesburg', accent: 'pink',
    intro: 'Your local time, the overnight catch-up, saved links, and today’s useful updates live here.',
    facts: ['Based in South Africa', 'City still to be confirmed'],
    status: 'Member room live', connections: ['Biggz · London', 'Vault 3.0 · home base'],
    currentTitle: 'South Africa briefing', current: 'Local time is live. City-level weather can start after Mel confirms her city.'
  },
  anymuz: {
    name: 'Anymuz', initials: 'AN', role: 'Vault owner · developer', location: 'Location pending', zone: null, accent: 'red',
    intro: 'Server updates, projects, useful links, the language arc, and the morning catch-up are all in one room.',
    facts: ['Owner of Vault 3.0', 'Codes and builds things', 'Learning Hebrew and Aramaic', 'Location pending'],
    status: 'Builder room live', connections: ['Biggz · co-owner', 'Kazy · developer'],
    currentTitle: 'Language arc active', current: 'Hebrew and Aramaic are in the current briefing. Builder notes and active projects can come next.'
  },
  kazy: {
    name: 'Kazy', initials: 'KZ', role: 'Developer · server booster', location: 'Location pending', zone: null, accent: 'magenta',
    intro: 'Projects, server updates, useful links, boost history, and the morning catch-up go here.',
    facts: ['Developer', 'Boosted Vault 3.0 twice', 'Helped the server reach Level 1', 'Location pending'],
    status: 'Builder room live', connections: ['Anymuz · developer', 'Vault 3.0 · Level 1'],
    currentTitle: 'Two boosts landed', current: 'Kazy boosted twice and pushed Vault 3.0 to Level 1. That stays in the server history.'
  }
});
