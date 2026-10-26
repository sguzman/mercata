import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const load=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Ten original measurement/policy task acceptances have dated sources and existing regression coverage',()=>{
 const x=load('ontology/itch-io/accepted-measurement-and-policy-tasks-2026.json'),p=load('plans/itch-io.json'),d=load('specimens/itch-io.json');
 const ids=new Set(d.evidence.map(e=>e.id));
 assert.equal(x.task_count,10);assert.equal(x.decisions.length,10);assert.equal(new Set(x.decisions.map(x=>x.task_id)).size,10);
 assert.equal(x.added_tasks,0);assert.equal(x.added_specimens,0);assert.equal(x.real_market_sales_measured,0);
 assert.equal(x.representative_seller_population_inferred,false);
 assert.equal(p.total_tracked_tasks,244);assert.equal(p.detail_tasks.length,160);
 for(const decision of x.decisions){
  const t=p.detail_tasks.find(t=>t.id===decision.task_id);
  assert(t,decision.task_id);assert.equal(t.status,'complete');assert.equal(t.percent,100);
  for(const path of [decision.supporting_document,decision.regression_test,'ontology/itch-io/accepted-measurement-and-policy-tasks-2026.json','tests/itch-io-accepted-measurement-tasks.test.mjs']){
   assert(t.evidence.includes(path),t.id+' missing '+path);
   assert(fs.existsSync(new URL('../'+path,import.meta.url)),path);
  }
  assert(decision.source_ids.every(id=>ids.has(id)),t.id+' source id not registered');
  assert.equal(decision.scope,'verified_measurement_definition_or_platform_policy_not_observed_market_result');
 }
});
