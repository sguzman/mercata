import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('creative planning task acceptance complete without pretending experiments ran',()=>{
 const p=get('plans/itch-io.json');
 const d=get('ontology/itch-io/creative-comparison-audit-2026.json');
 for(const id of ['itch-io/discovery/study-thumbnail-and-page-presentation','itch-io/strategy/design-page-creative-experiments']){
  const t=p.detail_tasks.find(x=>x.id===id);
  assert.equal(t.percent,100);assert.equal(t.status,'complete');
  assert(t.evidence.includes('tests/itch-creative-comparison.test.mjs'));
 }
 assert.equal(d.authorized_live_experiment,false);
 assert.equal(d.audited_measurements_are_synthetic,true);
 assert.equal(d.causal_lift_without_randomization,null);
});
