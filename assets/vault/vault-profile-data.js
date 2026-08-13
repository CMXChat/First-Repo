'use strict';

/* Shared profile demo content. Approved facts only; demo briefing copy is labeled. */
window.VaultProfiles = Object.freeze({
  biggz: {
    name: 'Biggz', initials: 'BG', role: 'Vault owner', location: 'London', zone: 'Europe/London', accent: 'violet',
    intro: 'Morning, boss. London time, the server catch-up, your people, and the important stuff are all right here.',
    facts: ['Owner of Vault 3.0', 'Based in London'],
    status: 'Owner room live', connections: ['Anymuz · co-owner', 'Mel · South Africa'],
    currentTitle: 'Straight to the point', current: 'Catch up, check London time, find someone, play a song. Done.'
  },
  mel: {
    name: 'Mel', initials: 'ME', role: 'Vault member', location: 'South Africa', zone: 'Africa/Johannesburg', accent: 'pink',
    intro: 'Hey Mel. Your local time, the overnight tea, saved stuff, and today’s useful bits live here.',
    facts: ['Based in South Africa', 'City still to be confirmed'],
    status: 'Member room live', connections: ['Biggz · London', 'Vault 3.0 · home base'],
    currentTitle: 'South Africa check-in', current: 'Local time is live. Tell us the city whenever you want the weather to get specific.'
  },
  anymuz: {
    name: 'Anymuz', initials: 'AN', role: 'Vault owner · developer', location: 'Location pending', zone: null, accent: 'red',
    intro: 'Builder mode. Server updates, projects, weird language arcs, useful links, and the morning tea are all loaded in.',
    facts: ['Owner of Vault 3.0', 'Codes and builds things', 'Learning Hebrew and Aramaic', 'Location pending'],
    status: 'Builder room live', connections: ['Biggz · co-owner', 'Kazy · developer'],
    currentTitle: 'Language arc unlocked', current: 'Hebrew and Aramaic made the briefing. Builder notes and current projects are next up.'
  },
  kazy: {
    name: 'Kazy', initials: 'KZ', role: 'Developer · server booster', location: 'Location pending', zone: null, accent: 'magenta',
    intro: 'Dev room online. Projects, server updates, useful links, boost lore, and whatever broke overnight go here.',
    facts: ['Developer', 'Boosted Vault 3.0 twice', 'Helped the server reach Level 1', 'Location pending'],
    status: 'Builder room live', connections: ['Anymuz · developer', 'Vault 3.0 · Level 1'],
    currentTitle: 'Double boost behavior', current: 'Kazy dropped two boosts and pushed Vault 3.0 to Level 1. Extremely valid.'
  }
});
