import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Seven evidence-backed task acceptances add no tasks, sources or market-income assertions',()=>{
 const x=read('ontology/itch-io/verified-existing-task-acceptance-2026.json'),p=read('plans/itch-io.json'),d=read('specimens/itch-io.json');
 const ids=new Set(d.evidence.map(s=>s.id));
 assert.equal(x.added_tasks,0);assert.equal(x.new_sources,0);assert.equal(x.new_paid_market_observations,0);
 assert.equal(x.decisions.length,7);assert.equal(new Set(x.decisions.map(t=>t.task_id)).size,7);
 for(const z of x.decisions){
  const t=p.detail_tasks.find(t=>t.id===z.task_id);
  assert(t,z.task_id);assert.equal(t.percent,100);assert.equal(t.status,'complete');
  assert(z.source_ids.every(id=>ids.has(id)));
  for(const file of [z.supporting_document,z.regression_test,'ontology/itch-io/verified-existing-task-acceptance-2026.json','ontology/itch-io/verified-existing-task-acceptance-2026.md','tests/itch-io-existing-task-acceptance.test.mjs'])assert(t.evidence.includes(file),z.task_id+' missing '+file);
 }
 assert.equal(p.total_tracked_tasks,244);assert.equal(p.detail_tasks.length,160);
 for(const val of Object.values(x.unresolved_platform_population))assert.equal(val,null);
});
