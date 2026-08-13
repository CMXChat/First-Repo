'use strict';

/* Shared profile demo content. Approved facts only; demo briefing copy is labeled. */
window.VaultProfiles = Object.freeze({
  biggz: {
    name: 'Biggz', initials: 'BG', role: 'Vault owner', location: 'London', zone: 'Europe/London', accent: 'violet',
    intro: 'Biggz can open this room, check London time, see the server catch-up, and get on with his day.',
    facts: ['Owner of Vault 3.0', 'Based in London'],
    status: 'Owner room live', connections: ['Anymuz · co-owner', 'Mel · South Africa'],
    currentTitle: 'Keep it simple and useful', current: 'The owner view puts the morning catch-up, London time, people, and music up front.'
  },
  mel: {
    name: 'Mel', initials: 'ME', role: 'Vault member', location: 'South Africa', zone: 'Africa/Johannesburg', accent: 'pink',
    intro: 'Mel can open this room for local time, the server catch-up, saved links, and whatever matters that morning.',
    facts: ['Based in South Africa', 'City still to be confirmed'],
    status: 'Member room live', connections: ['Biggz · London', 'Vault 3.0 · home base'],
    currentTitle: 'South Africa briefing slot', current: 'Local time is active. City-level weather waits for Mel to confirm her city.'
  },
  anymuz: {
    name: 'Anymuz', initials: 'AN', role: 'Vault owner · developer', location: 'Location pending', zone: null, accent: 'red',
    intro: 'Anymuz gets the builder view: server updates, projects, useful links, and the morning catch-up in one room.',
    facts: ['Owner of Vault 3.0', 'Codes and builds things', 'Learning Hebrew and Aramaic', 'Location pending'],
    status: 'Builder room live', connections: ['Biggz · co-owner', 'Kazy · developer'],
    currentTitle: 'Language arc active', current: 'Hebrew and Aramaic are on the current briefing. Builder notes and server projects can live here next.'
  },
  kazy: {
    name: 'Kazy', initials: 'KZ', role: 'Developer · server booster', location: 'Location pending', zone: null, accent: 'magenta',
    intro: 'Kazy gets a builder room for projects, server updates, useful links, and the morning catch-up.',
    facts: ['Developer', 'Boosted Vault 3.0 twice', 'Helped the server reach Level 1', 'Location pending'],
    status: 'Builder room live', connections: ['Anymuz · developer', 'Vault 3.0 · Level 1'],
    currentTitle: 'Two boosts landed', current: 'Kazy boosted twice and pushed Vault 3.0 to Level 1. That stays in the server history.'
  }
});
