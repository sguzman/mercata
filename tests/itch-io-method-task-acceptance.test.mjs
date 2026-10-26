import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Eight existing source-backed method tasks are accepted without fabricating market results',()=>{
 const a=get('ontology/itch-io/accepted-methodology-tasks-2026.json');
 const p=get('plans/itch-io.json'),d=get('specimens/itch-io.json');
 const sourceIds=new Set(d.evidence.map(x=>x.id));
 assert.equal(a.added_tasks,0);
 assert.equal(a.measurements_of_new_paid_sales,0);
 assert.equal(a.decisions.length,8);
 assert.equal(new Set(a.decisions.map(x=>x.task_id)).size,8);
 for(const decision of a.decisions){
  const t=p.detail_tasks.find(x=>x.id===decision.task_id);
  assert(t,decision.task_id); assert.equal(t.percent,100);
  assert.equal(t.status,'complete');
  for(const x of [decision.supporting_document,decision.regression_test,'ontology/itch-io/accepted-methodology-tasks-2026.json'])
   assert(t.evidence.includes(x),decision.task_id+' missing '+x);
  assert(decision.source_ids.every(x=>sourceIds.has(x)));
  assert.equal(decision.scope,'source_verified_methodology_or_platform_rule_not_population_sales');
 }
 assert.equal(p.total_tracked_tasks,244);
 assert.equal(p.detail_tasks.length,160);
 assert.equal(a.no_missing_empirical_data_inferred,true);
});
