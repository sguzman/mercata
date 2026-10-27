import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Six existing bounded tasks distinguish events and rights from measured seller economics',()=>{
 const d=read('ontology/itch-io/core-economic-event-access-and-rights-audit-2026.json'),q=read('queues/itch-io.json'),p=read('plans/itch-io.json'),s=read('specimens/itch-io.json');
 const ids=new Set(s.evidence.map(e=>e.id));assert(d.source_ids.every(id=>ids.has(id)));
 assert.equal(d.audited_existing_tasks.length,6);
 assert(d.audited_existing_tasks.every(x=>x.source_ids.every(id=>ids.has(id))&&x.completed_empirical_population_inference===false));
 assert(d.rights_matrix.every(x=>x.source_ids.every(id=>ids.has(id))&&x.commercial_approval_of_specific_game===null));
 assert.equal(d.transactions_or_authorized_customer_records_read,0);
 assert.equal(d.real_world_experiment_performed,false);
 assert(Object.values(d.unknown).every(v=>v===null));
 for(const row of d.audited_existing_tasks){
   const task=q.queues.flatMap(x=>x.tasks).find(x=>x.id===row.id);
   assert(task,row.id);assert.equal(task.progress,100,row.id);assert.equal(task.status,'complete',row.id);
   for(const f of ['ontology/itch-io/core-economic-event-access-and-rights-audit-2026.json','ontology/itch-io/core-economic-event-access-and-rights-audit-2026.md','tests/itch-core-economic-event-access-rights-audit.test.mjs'])assert(task.evidence.includes(f),row.id+' '+f);
 }
 assert.equal(p.total_tracked_tasks,244);assert.equal(p.detail_tasks.length,160);
 assert.equal(p.progress_percent,Math.round((q.queues.flatMap(x=>x.tasks).reduce((a,t)=>a+t.progress,0)+p.detail_tasks.reduce((a,t)=>a+t.percent,0))/244));
});
