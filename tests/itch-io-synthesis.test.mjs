import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Interim income synthesis retains open zero-earner and buyer data gaps',()=>{
 const s=get('ontology/itch-io/research-synthesis-2026.json');
 const d=get('specimens/itch-io.json');
 const claims=new Set(d.claims.map(x=>x.id));
 assert(s.findings.every(x=>x.claim_ids.every(id=>claims.has(id))));
 assert(s.source_records<=d.evidence.length,'Historical snapshot cannot exceed latest source count');
 assert(s.claims<=d.claims.length,'Historical snapshot cannot exceed latest claim count');
 assert.equal(s.fixed_research_tasks,244);
 assert(s.unresolved.every(x=>x.measured_value===null));
 assert.equal(s.representative_income_dataset_available,false);
 assert.equal(s.executed_commercial_experiments,0);
 assert.equal(s.buyer_personal_data_collected,0);
 assert(s.pending_task_ids_at_creation.length>0);
});
