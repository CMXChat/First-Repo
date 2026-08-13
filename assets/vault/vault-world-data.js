'use strict';

/*
 * Static Vault world data. This drives demos only and contains no Discord API data.
 * Spotify IDs link to official Spotify embeds. Member facts remain approved-only.
 */
window.VaultWorld = Object.freeze({
  tracks: [
    { id: '1eyzqe2QqGZUmfcPZtrIyt', title: 'Midnight City', artist: 'M83', mood: 'Late-night server energy', accent: '#42a7ff', votes: 8 },
    { id: '2gZUPNdnz5Y45eiGxpHGSc', title: 'POWER', artist: 'Kanye West', mood: 'Main-character admin energy', accent: '#f1c36d', votes: 6 },
    { id: '4i0ioe6BC6qvV6FOm6nf7K', title: 'The Recipe', artist: 'Kendrick Lamar feat. Dr. Dre', mood: 'Chill voice-chat rotation', accent: '#75e7c0', votes: 5 },
    { id: '5Z01UMMf7V1o0MzF86s6WJ', title: 'Lose Yourself', artist: 'Eminem', mood: 'Locked-in builder mode', accent: '#ff778b', votes: 7 },
    { id: '1IFSa6KKHLeSwRe8mDlz6k', title: 'Dreams', artist: 'The Cranberries', mood: 'The server finally calmed down', accent: '#c27cff', votes: 4 }
  ],
  memberTracks: {
    biggz: '2gZUPNdnz5Y45eiGxpHGSc',
    anymuz: '5Z01UMMf7V1o0MzF86s6WJ',
    kazy: '1eyzqe2QqGZUmfcPZtrIyt',
    mel: '1IFSa6KKHLeSwRe8mDlz6k'
  },
  lore: [
    { tag: 'BOOST ARC', title: 'Kazy carried Vault to Level 1', text: 'Two boosts landed back-to-back. The server hit Level 1 at 12:40 PM.', date: 'Aug 13' },
    { tag: 'LANGUAGE ARC', title: 'Anymuz opened the ancient-language side quest', text: 'Hebrew and Aramaic are officially part of the current server lore.', date: 'Aug 13' },
    { tag: 'FOUNDING', title: 'The Vault got a home outside Discord', text: 'Profiles, briefings, radio, lore, and server memory moved into one portal.', date: 'Aug 13' }
  ],
  archive: [
    { date: 'Aug 13', title: 'Two boosts and a new language arc', summary: 'Kazy pushed the server to Level 1. Anymuz started learning Hebrew and Aramaic.', mood: 'W day', status: 'current' },
    { date: 'Next', title: 'The first real morning brief', summary: 'Weather, overnight chat, links, lore, and member updates arrive in one clean read.', mood: 'queued', status: 'preview' },
    { date: 'Later', title: 'Server memory goes live', summary: 'Approved Discord data and member-controlled details turn the static demo into a daily portal.', mood: 'roadmap', status: 'planned' }
  ],
  relationships: [
    { from: 'anymuz', to: 'biggz', label: 'owners' },
    { from: 'anymuz', to: 'kazy', label: 'developers' },
    { from: 'biggz', to: 'mel', label: 'server' },
    { from: 'kazy', to: 'vault', label: 'boosted' }
  ],
  changes: [
    'Vault Radio opened with five tracks.',
    'Kazy received a developer room.',
    'The server reached Level 1.',
    'Member rooms gained personal soundtracks.',
    'Search now covers people, music, lore, and briefings.'
  ]
});
