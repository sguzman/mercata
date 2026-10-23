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
ensure(schema.properties.color && schema.properties.evidence && schema.properties.audience_research, 'Incomplete specimen schema');
const audienceSchema = load('ontology/audience.schema.json');
ensure(audienceSchema.properties.communities && audienceSchema.properties.demographics, 'Incomplete audience ontology schema');
const core = load('pipeline/queues.json'), domains = load('pipeline/domains.json'), social = load('pipeline/social.json');
ensure(social.queues.length >= 8,'Missing social-audience research queues');
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
  const expectedByQueue = new Map([...core.queues, ...domains.domains.map(d => ({id:'special-'+d.id,tasks:d.tasks})).filter(d => d.id === 'special-'+dossier.domain), ...(socialEnabled ? social.queues : [])].map(q => [q.id,q.tasks.map(t => q.id+'/'+t.id)]));
  const profiles = dossier.research_profiles || [];
  ensure(JSON.stringify(profiles) === JSON.stringify(entry.research_profiles || []),'Research profile/index mismatch');
  const socialEnabled = profiles.includes('social_audience');
  ensure(queue.queues.length === core.queues.length + 1 + (socialEnabled ? social.queues.length : 0),'Incomplete specimen queue');
  const expectedQueues = [...core.queues.map(q => q.id),'special-' + dossier.domain,
    ...(socialEnabled ? social.queues.map(q => q.id) : [])];
  ensure(expectedQueues.every(id => queue.queues.some(q => q.id === id)),'Missing named queues');
  if(socialEnabled) {
    const audience = dossier.audience_research;
    ensure(audience?.profile === 'social_audience','Missing social-audience dossier structure');
    for(const key of ['populations','demographics','communities','overlaps','formats','insights'])
      ensure(Array.isArray(audience[key]),'Missing audience research collection '+key);
    const sources = new Set(dossier.evidence.map(source => source.id));
    const sourced = (measure,label,value) => {
      ensure(typeof measure.id === 'string' && measure.id.length > 0,'Missing measurement ID: '+label);
      ensure(Array.isArray(measure.source_ids),'Missing source array: '+label);
      if(value !== null && value !== undefined) {
        ensure(Number.isFinite(value),'Invalid numeric observation: '+label);
        ensure(measure.source_ids.length > 0,'Unsourced measurement: '+label);
        ensure(typeof measure.period === 'string' && measure.period.length > 0,'Missing period: '+label);
        ensure(typeof measure.method === 'string' && measure.method.length > 0,'Missing method: '+label);
        ensure(typeof measure.limitations === 'string','Missing limitations: '+label);
      }
      for(const id of measure.source_ids)
        ensure(sources.has(id),'Unregistered source '+id+' for '+label);
    };
    for(const x of audience.populations)sourced(x,'population',x.value);
    for(const x of audience.formats)sourced(x,'format',x.value);
    for(const x of audience.demographics)sourced(x,'demographic',x.share_percent);
    const communityIds = new Set();
    for(const community of audience.communities) {
      ensure(community.id && community.label && community.definition,'Incomplete community');
      ensure(!communityIds.has(community.id),'Duplicate community');
      communityIds.add(community.id);
      for(const estimate of community.estimates)sourced(estimate,'community '+community.id,estimate.value);
    }
    for(const overlap of audience.overlaps) {
      ensure(overlap.community_ids?.length >= 2 && overlap.community_ids.every(id => communityIds.has(id)),
        'Community overlap references missing community');
      sourced(overlap,'overlap',overlap.value);
    }
    for(const insight of audience.insights) {
      ensure(typeof insight.statement === 'string' && insight.statement.length > 0,'Empty audience insight');
      ensure(insight.source_ids?.length > 0,'Unsourced audience insight');
      for(const id of insight.source_ids)ensure(sources.has(id),'Unregistered insight source '+id);
    }
  }
  for(const group of queue.queues) {
  const expectedTasks = expectedByQueue.get(group.id);
  ensure(expectedTasks && group.tasks.length === expectedTasks.length,'Task coverage mismatch in queue '+group.id);
  ensure(expectedTasks.every(id => group.tasks.some(t => t.id === id)),'Missing task in queue '+group.id);
  for(const task of group.tasks) {
    ensure(!taskIds.has(task.id),'Duplicate task ID');
    taskIds.add(task.id);
    ensure(Number.isInteger(task.progress) && task.progress >= 0 && task.progress <= 100,'Bad progress');
    ensure(task.progress < 100 || (task.status === 'complete' && task.evidence.length > 0),'Unverified completion: ' + task.id);
  }
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
