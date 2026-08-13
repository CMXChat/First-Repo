import { readFileSync, existsSync } from 'node:fs';

const failures = [];
const read = (path) => readFileSync(path, 'utf8');
const requireFile = (path) => {
  if (!existsSync(path)) failures.push(`missing ${path}`);
};
const requireText = (path, needle, label = needle) => {
  const text = read(path);
  if (!text.includes(needle)) failures.push(`${path}: missing ${label}`);
};

const profileIds = ['anymuz', 'biggz', 'kazy', 'mel'];
const sharedFiles = [
  'vault/index.html',
  'vault/README.md',
  'assets/vault/vault-directory.js',
  'assets/vault/vault-profile-data.js',
  'assets/vault/vault-profile.js',
  'assets/vault/vault-profile.css',
  'assets/vault/vault-restricted-node-social.png'
];

sharedFiles.forEach(requireFile);
profileIds.forEach((id) => requireFile(`vault/${id}/index.html`));

requireText('vault/index.html', 'https://discord.gg/48xdhWJ9RD', 'permanent Discord invite');
requireText('vault/index.html', 'id="memberDirectory"', 'member directory section');
requireText('vault/index.html', 'id="dailyBriefings"', 'daily briefing section');
requireText('vault/index.html', 'id="serverWire"', 'server briefing wire');
requireText('vault/index.html', 'Kazy dropped two boosts', 'Kazy boost update');
requireText('vault/index.html', 'learning Hebrew and Aramaic', 'Anymuz language update');
requireText('vault/index.html', 'vault-directory.js', 'directory data asset');
requireText('vault/index.html', 'vault-restricted-node-social.png', 'Vault social image metadata');
requireText('assets/vault/vault-portal.js', "const THEME_KEY = 'vault_theme_v1'", 'shared theme key');
requireText('assets/vault/vault-profile.js', "const SESSION_KEY = 'cmx_vault_session_v1'", 'profile session boundary');
requireText('vault/README.md', '7:00 AM in that member\'s confirmed local timezone', 'local briefing schedule rule');

profileIds.forEach((id) => {
  const path = `vault/${id}/index.html`;
  requireText(path, `data-member-id="${id}"`, `profile id ${id}`);
  requireText(path, 'vault-profile.js', 'shared profile renderer');
  requireText(path, 'https://discord.gg/48xdhWJ9RD', 'Discord invite');
  requireText(path, 'vault-restricted-node-social.png', 'Vault social image metadata');
});

const socialImage = readFileSync('assets/vault/vault-restricted-node-social.png');
const socialWidth = socialImage.readUInt32BE(16);
const socialHeight = socialImage.readUInt32BE(20);
if (socialWidth !== 1200 || socialHeight !== 630) failures.push(`social image must be 1200x630, got ${socialWidth}x${socialHeight}`);

const directory = read('assets/vault/vault-directory.js');
profileIds.forEach((id) => {
  if (!directory.includes(`route: '/vault/${id}/'`)) failures.push(`directory missing route for ${id}`);
});

if (failures.length) {
  console.error(`Vault validation failed:\n${failures.map((failure) => ` - ${failure}`).join('\n')}`);
  process.exit(1);
}

console.log(`Vault validation passed for ${profileIds.length} profile routes and shared portal assets.`);
