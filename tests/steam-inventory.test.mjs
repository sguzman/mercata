import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const json=path=>JSON.parse(fs.readFileSync(new URL('../'+path,import.meta.url),'utf8'));
const read=path=>fs.readFileSync(new URL('../'+path,import.meta.url),'utf8');
const plan=json('plans/steam.json'),q=json('queues/steam.json'),d=json('specimens/steam.json'),
      index=json('gallery/index.json'),entry=index.specimens.find(x=>x.id==='steam');
test('Existing Steam specimen is retained with original identity and untouched research data',()=>{
 assert.equal(index.specimens.length,26);
 assert.equal(index.specimens.filter(x=>x.id==='steam').length,1);
 assert.equal(d.id,'steam');assert.equal(d.name,'Steam');
 assert.equal(d.created_at,'2026-10-23');
 assert.deepEqual(d.color,{hex:'#A665CB',oklch:{l:0.62,c:0.16,h:312}});
 assert(['queued','researching','review','published','archived'].includes(d.status));
 if(d.status==='queued')for(const key of ['evidence','claims','observations','opportunities','risks','experiments'])
  assert.deepEqual(d[key],[],key+' must be empty before research');
 assert.equal(entry.status,d.status);
 assert.equal(entry.plan,'plans/steam.json');
 assert.equal(q.plan,entry.plan);
 assert.equal(entry.planning_state,'inventory_ready');
});
test('All 84 baseline tasks are immutable, unresearched and retain their original queue structure',()=>{
 const core=json('pipeline/queues.json'),special=json('pipeline/domains.json').domains.find(x=>x.id==='games');
 const expected=[...core.queues.map(x=>({id:x.id,tasks:x.tasks})),{id:'special-games',tasks:special.tasks}];
 assert.equal(q.queues.length,13);
 assert.equal(q.queues.reduce((n,g)=>n+g.tasks.length,0),84);
 for(const group of expected){
  const actual=q.queues.find(x=>x.id===group.id);assert(actual,group.id);
  assert.deepEqual(actual.tasks.map(x=>x.id),group.tasks.map(x=>group.id+'/'+x.id));
  assert(actual.tasks.every(x=>Number.isInteger(x.progress)&&x.progress>=0&&x.progress<=100&&Array.isArray(x.evidence)&&
    (x.progress===0||(x.evidence.length>0&&x.status!=='pending'))));
  if(d.status==='queued')assert(actual.tasks.every(x=>x.status==='pending'&&x.progress===0&&x.evidence.length===0));
 }
});
test('All 209 new Steam questions have unique IDs, meaningful acceptance and no claimed progress',()=>{
 assert.equal(plan.schema_version,1);assert.equal(plan.kind,'research_plan');
 assert.equal(plan.specimen_id,'steam');assert(['queued','researching','review','published'].includes(plan.status));
 assert.equal(plan.generated_at,'2026-10-28');
 assert(Number.isInteger(plan.progress_percent)&&plan.progress_percent>=0&&plan.progress_percent<=100);
 assert.equal(typeof plan.permission_required_before_execution,'boolean');
 if(plan.status==='queued')assert.equal(plan.permission_required_before_execution,true);
 assert.equal(plan.baseline.base_task_count,84);assert.equal(plan.baseline.base_queue_count,13);
 assert.equal(plan.detail_task_count,209);assert.equal(plan.total_tracked_tasks,293);
 assert.equal(plan.detail_tasks.length,209);assert.equal(plan.workstreams.length,13);
 assert.equal(plan.phases.length,4);
 const ids=plan.detail_tasks.map(x=>x.id),baselineIds=q.queues.flatMap(x=>x.tasks.map(y=>y.id));
 assert.equal(new Set(ids).size,ids.length);
 assert.equal(new Set([...baselineIds,...ids]).size,293);
 assert(plan.detail_tasks.every(x=>
   x.id.startsWith('steam/'+x.queue_id+'/')&&x.title.length>12&&x.objective.length>40&&
   x.acceptance.length>130&&x.acceptance.includes('evidence')&&
   Number.isInteger(x.percent)&&x.percent>=0&&x.percent<=100&&x.weight===1&&
   Array.isArray(x.evidence)&&
   (x.percent===0||(x.evidence.length>0&&x.status!=='pending'))));
 if(plan.status==='queued'){
  assert.equal(plan.progress_percent,0);
  assert(plan.detail_tasks.every(x=>x.status==='pending'&&x.percent===0&&x.evidence.length===0&&x.artifact===null));
 }
 for(const w of plan.workstreams){
  const group=q.queues.find(x=>x.id===w.id);
  assert(group);assert.equal(w.base_tasks.length,group.tasks.length);
  assert.deepEqual(w.base_tasks,group.tasks.map(x=>x.id));
  assert.deepEqual(w.detail_tasks,plan.detail_tasks.filter(x=>x.queue_id===w.id).map(x=>x.id));
  assert(Number.isInteger(w.progress_percent)&&w.progress_percent>=0&&w.progress_percent<=100);
  if(plan.status==='queued')assert.equal(w.progress_percent,0);
  assert(plan.phases.some(x=>x.id===w.phase&&x.queue_ids.includes(w.id)));
 }
});
test('Named Steam-specific research questions cover demand, cash, sampling, discovery and game production',()=>{
 const ids=new Set(plan.detail_tasks.map(x=>x.id));
 for(const id of [
  'steam/identity/distinguish-appid-and-package-entities',
  'steam/access/map-steamworks-legal-onboarding',
  'steam/economics/verify-current-revenue-share-schedule',
  'steam/market/count-eligible-paid-releases-including-zeros',
  'steam/discovery/study-next-fest-eligibility-and-timing',
  'steam/competition/construct-like-for-like-competitor-sets',
  'steam/income/design-zero-selling-publisher-sampling-frame',
  'steam/income/audit-review-to-sales-multiplier-methods',
  'steam/rights/analyze-steam-key-distribution-terms',
  'steam/sales/investigate-wishlist-purchase-conversion',
  'steam/risk/study-multiplayer-shutdown-and-deprecation',
  'steam/strategy/define-no-go-and-stop-loss-conditions',
  'steam/review/design-privacy-safe-permissioned-data-route',
  'steam/special-games/investigate-deck-verified-and-playable-programs'
 ])assert(ids.has(id),id);
});
test('Human plan, gallery and README present inventory only rather than research outcomes',()=>{
 const doc=read('plans/steam.md');
 if(plan.status==='queued')assert(doc.includes('research NOT started'));
 else assert(doc.includes('research'));
 assert(doc.includes('209 Steam-specific'));
 assert(doc.includes('293 total tasks'));
 if(plan.status==='queued')for(const task of plan.detail_tasks)assert(doc.includes('`'+task.id+'`'),task.id);
 for(const p of ['README.md','gallery/README.md','pipeline/README.md','roadmap/README.md'])
  assert(read(p).includes('plans/steam.md'),p);
 assert(plan.evidence_rules.some(x=>x.includes('Missing sales/earnings')));
 const baseline=q.queues.flatMap(x=>x.tasks);
 const average=Math.round((baseline.reduce((n,x)=>n+x.progress,0)+plan.detail_tasks.reduce((n,x)=>n+x.percent,0))/293);
 assert.equal(plan.progress_percent,average);
});
