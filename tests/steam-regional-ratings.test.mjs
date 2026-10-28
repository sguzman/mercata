import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const j=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const x=j('ontology/steam/age-ratings-regional-market-access-2026.json'),d=j('specimens/steam.json'),p=j('plans/steam.json'),q=j('queues/steam.json');
test('Country cutoff differs: German known, Indonesian unknown',()=>{
 assert.equal(x.germany.effective_visibility_date_for_unrated,'2024-11-15');
 assert.equal(x.indonesia.future_unrated_visibility_cutoff,null);
 assert.equal(x.indonesia.existing_license_access_continues,true);
 assert.equal(x.germany.app_specific_region_sales_loss,null);
});
test('Rating source evidence and stable 293 tasks',()=>{
 const sourceIds=new Set(d.evidence.map(s=>s.id)),claims=new Map(d.claims.map(c=>[c.id,c]));
 assert.equal(x.source_ids.length,3);assert.equal(x.claim_ids.length,11);
 for(const id of x.source_ids)assert(sourceIds.has(id),id);
 for(const id of x.claim_ids){assert(claims.has(id),id);assert(claims.get(id).source_ids.every(s=>sourceIds.has(s)));}
 const scores=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(scores.length,293);assert.equal(p.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
});
