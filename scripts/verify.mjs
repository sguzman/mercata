import fs from 'node:fs';
import path from 'node:path';
import {toHex,verifyPalette} from './palette.mjs';
const root = path.resolve(process.argv[2] || process.cwd());
const load = name => JSON.parse(fs.readFileSync(path.join(root,name),'utf8'));
const has = name => fs.existsSync(path.join(root,name));
function ensure(ok,message) { if (!ok) throw Error(message); }
const manifest = load('tarium.json');
ensure(manifest.project === 'mercata', 'Invalid manifest identity');
ensure(has(manifest.ontology.index) && has(manifest.ontology.data), 'Missing ontology path');
ensure(has(manifest.gallery.index) && has(manifest.gallery.data), 'Missing gallery path');
const model = load('ontology/ontology.json'), schema = load('ontology/specimen.schema.json');
ensure(model.schema_version === 1 && model.entities.length >= 20, 'Incomplete public ontology');
ensure(schema.properties.color && schema.properties.evidence, 'Incomplete specimen schema');
const core = load('pipeline/queues.json'), domains = load('pipeline/domains.json');
ensure(core.queues.length >= 12, 'Missing core queues');
ensure(domains.domains.length >= 9, 'Missing specialist domains');
const allTasks = core.queues.flatMap(q => q.tasks.map(t => q.id + '/' + t.id));
ensure(allTasks.length >= 70 && new Set(allTasks).size === allTasks.length,'Missing or duplicate core tasks');
for (const q of core.queues) for (const t of q.tasks) {
  ensure(t.title && t.acceptance && t.weight > 0, 'Incomplete core task ' + t.id);
}
const index = load('gallery/index.json');
ensure(Array.isArray(index.specimens),'Invalid gallery');
ensure(new Set(index.specimens.map(x => x.id)).size === index.specimens.length,'Duplicate specimen ID');
verifyPalette(index.specimens);
for (const entry of index.specimens) {
  const dossier = load(entry.dossier), queue = load(entry.queue);
  ensure(dossier.id === entry.id && queue.specimen_id === entry.id,'Dossier/index mismatch');
  ensure(dossier.schema_version === 1 && dossier.color.hex === entry.color.hex,'Dossier schema/color mismatch');
  ensure(toHex(dossier.color.oklch) === dossier.color.hex,'Bad specimen color');
  const taskIds = new Set();
  ensure(queue.queues.length === core.queues.length + 1,'Incomplete specimen queue');
  for(const group of queue.queues) for(const task of group.tasks) {
    ensure(!taskIds.has(task.id),'Duplicate task ID');
    taskIds.add(task.id);
    ensure(Number.isInteger(task.progress) && task.progress >= 0 && task.progress <= 100,'Bad progress');
    ensure(task.progress < 100 || (task.status === 'complete' && task.evidence.length > 0),'Unverified completion: ' + task.id);
  }
}
const ledger=load('roadmap/progress.json');
for(const milestone of ledger.milestones) {
  const tasks = milestone.phases.flatMap(phase => phase.features.flatMap(feature => feature.tasks));
  ensure(tasks.length > 0,'Missing milestone tasks: ' + milestone.id);
  const avg = Math.round(tasks.reduce((n,t)=>n+t.percent,0)/tasks.length);
  ensure(avg === milestone.percent,'Milestone percent mismatch: ' + milestone.id);
  for(const task of tasks) {
    ensure(task.percent < 100 || (task.evidence.length > 0 && task.evidence.every(has)), 'Unverified ledger item: ' + task.id);
  }
}
for(const file of ['index.html','site/app.js','site/styles.css','assets/swatch.svg']) ensure(has(file),'Missing website asset '+file);
const web = fs.readFileSync(path.join(root,'index.html'),'utf8');
ensure(web.includes('id="theme"') && web.includes('value="system"'),'No system-first theme control');
console.log('PASS: ontology, schema, queues (' + allTasks.length + ' core), catalog (' +
 index.specimens.length + ' specimens), unique OKLab colors, progress evidence, website assets');
