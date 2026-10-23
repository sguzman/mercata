import fs from 'node:fs/promises';
import path from 'node:path';
import {pickColor, verifyPalette} from './palette.mjs';

const argv = process.argv.slice(2);
function argument(name) {
  const i = argv.indexOf('--' + name);
  return i === -1 ? null : argv[i + 1];
}
const name = argument('name'), url = argument('url'), domain = argument('domain'), profile = argument('profile');
const root = path.resolve(argument('root') || process.cwd());
const slug = (name || '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
if (!name || !slug || !url || !domain) {
  console.error('Usage: node scripts/intake.mjs --name NAME --url HTTPS_URL --domain DOMAIN [--profile social_audience] [--root PATH]');
  process.exit(2);
}
let canonical;
try { canonical = new URL(url); } catch { throw new Error('Provide a valid official HTTPS URL'); }
if (canonical.protocol !== 'https:' || !canonical.hostname.includes('.')) throw new Error('Use a public HTTPS URL');
const read = async p => JSON.parse(await fs.readFile(path.join(root, p), 'utf8'));
const index = await read('gallery/index.json');
const core = await read('pipeline/queues.json');
const specialist = await read('pipeline/domains.json');
const social = await read('pipeline/social.json');
const domainEntry = specialist.domains.find(d => d.id === domain);
if (!domainEntry) throw new Error('Unknown domain: ' + domain);
if (profile && profile !== 'social_audience') throw new Error('Unknown research profile: ' + profile);
const research_profiles = domain === 'video' || profile === 'social_audience' ? ['social_audience'] : [];
if (index.specimens.some(x => x.id === slug || x.official_url === canonical.href)) {
  throw new Error('Marketplace already admitted: ' + name);
}
const dossierFile = 'specimens/' + slug + '.json';
const queueFile = 'queues/' + slug + '.json';
for (const file of [dossierFile, queueFile]) {
  try { await fs.access(path.join(root, file)); throw new Error('Refusing to overwrite: ' + file); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
}
const color = pickColor(slug, index.specimens.map(x => ({hex:x.color.hex,oklch:x.color.oklch})));
const created_at = new Date().toISOString().slice(0, 10);
const record = {
  schema_version:1, id:slug, name, official_url:canonical.href, domain,
  roles:[], status:'queued', created_at, color, research_profiles,
  evidence:[], claims:[], observations:[], opportunities:[], risks:[], experiments:[]
};
const task = (t, queueId) => ({
  id:queueId + '/' + t.id, emoji:t.emoji || '🔎', title:t.title,
  acceptance:t.acceptance, weight:t.weight, progress:0,
  status:'pending', evidence:[]
});
const groups = core.queues.map(q => ({
  id:q.id, emoji:q.emoji, title:q.title, objective:q.objective,
  tasks:q.tasks.map(t => task(t,q.id))
}));
const specialistId = 'special-' + domain;
groups.push({
  id:specialistId, emoji:domainEntry.emoji,
  title:domainEntry.title, objective:'Research conditions specific to ' + domain,
  tasks:domainEntry.tasks.map(t => task(t,specialistId))
});
if (research_profiles.includes('social_audience')) {
  record.audience_research = {schema_version:1,profile:'social_audience',populations:[],demographics:[],communities:[],overlaps:[],formats:[],insights:[]};
  for (const q of social.queues) {
    groups.push({id:q.id,emoji:q.emoji,title:q.title,objective:q.objective,
      tasks:q.tasks.map(t => task(t,q.id))});
  }
}
const queue = {schema_version:1, specimen_id:slug, created_at, queues:groups};
const galleryRecord = {
  id:slug, name, official_url:canonical.href, domain, color, status:'queued',
  created_at, dossier:dossierFile, queue:queueFile, research_profiles
};
verifyPalette([...index.specimens, galleryRecord]);
await fs.mkdir(path.join(root, 'specimens'), {recursive:true});
await fs.mkdir(path.join(root, 'queues'), {recursive:true});
const write = async (filename, data, flags='w') =>
  fs.writeFile(path.join(root, filename), JSON.stringify(data,null,2) + '\n', {encoding:'utf8',flag:flags});
await write(dossierFile, record, 'wx');
await write(queueFile, queue, 'wx');
index.specimens.push(galleryRecord);
index.description = `${index.specimens.length} marketplaces admitted as research specimens; all economic findings require source-backed investigation.`;
await write('gallery/index.json', index);
console.log(JSON.stringify({admitted:slug,color,queues:groups.length,
  tasks:groups.reduce((count,g)=>count+g.tasks.length,0)},null,2));
