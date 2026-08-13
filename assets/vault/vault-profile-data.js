'use strict';

/* Shared profile demo content. Approved facts only; demo briefing copy is labeled. */
window.VaultProfiles = Object.freeze({
  biggz: {
    name: 'Biggz', initials: 'BG', role: 'Vault owner', location: 'London', zone: 'Europe/London', accent: 'violet',
    intro: 'Biggz can open this room, check London time, see the server catch-up, and get on with his day.',
    facts: ['Owner of Vault 3.0', 'Based in London'],
    status: 'Profile demo live'
  },
  mel: {
    name: 'Mel', initials: 'ME', role: 'Vault member', location: 'South Africa', zone: 'Africa/Johannesburg', accent: 'pink',
    intro: 'Mel can open this room for local time, the server catch-up, saved links, and whatever matters that morning.',
    facts: ['Based in South Africa', 'City still to be confirmed'],
    status: 'Profile demo live'
  },
  anymuz: {
    name: 'Anymuz', initials: 'AN', role: 'Vault owner · developer', location: 'Location pending', zone: null, accent: 'red',
    intro: 'Anymuz gets the builder view: server updates, projects, useful links, and the morning catch-up in one room.',
    facts: ['Owner of Vault 3.0', 'Codes and builds things', 'Learning Hebrew and Aramaic', 'Location pending'],
    status: 'Profile demo live'
  },
  kazy: {
    name: 'Kazy', initials: 'KZ', role: 'Developer · server booster', location: 'Location pending', zone: null, accent: 'magenta',
    intro: 'Kazy gets a builder room for projects, server updates, useful links, and the morning catch-up.',
    facts: ['Developer', 'Boosted Vault 3.0 twice', 'Helped the server reach Level 1', 'Location pending'],
    status: 'Builder room live'
  }
});
