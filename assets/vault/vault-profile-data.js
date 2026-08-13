'use strict';

/* Shared profile demo content. Approved facts only; demo briefing copy is labeled. */
window.VaultProfiles = Object.freeze({
  biggz: {
    name: 'Biggz', initials: 'BG', role: 'Vault owner', location: 'London', zone: 'Europe/London', accent: 'violet',
    intro: 'A personal Vault surface for local time, approved context, server catch-ups and the morning briefing.',
    facts: ['Owner of Vault 3.0', 'Based in London'],
    status: 'Profile demo live'
  },
  mel: {
    name: 'Mel', initials: 'ME', role: 'Vault member', location: 'South Africa', zone: 'Africa/Johannesburg', accent: 'pink',
    intro: 'A personal Vault surface for local time, approved context, server catch-ups and the morning briefing.',
    facts: ['Based in South Africa', 'City still to be confirmed'],
    status: 'Profile demo live'
  },
  anymuz: {
    name: 'Anymuz', initials: 'AN', role: 'Vault owner · developer', location: 'Location not confirmed', zone: null, accent: 'red',
    intro: 'A builder-focused Vault surface for server context, projects, useful links and the morning briefing.',
    facts: ['Owner of Vault 3.0', 'Codes and builds things', 'Location still to be confirmed'],
    status: 'Profile demo live'
  }
});
