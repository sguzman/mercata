import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const r=read('ontology/steam/curator-connect-and-community-events-2026.json'),d=read('specimens/steam.json'),p=read('plans/steam.json'),q=read('queues/steam.json');
test('Curator limits cannot be transformed into real orders or guaranteed reviews',()=>{
 assert.equal(r.curator_connect.max_curators_offered,100);
 assert.equal(r.curator_connect.max_copies_each_curator,5);
 assert.equal(r.curator_connect.paid_units_per_granted_copy,0);
 assert.equal(r.curator_connect.accepted_curator_review_guaranteed,false);
 assert.equal(r.unknown.actual_incremental_orders,null);
});
test('Event exposure is conditional and observed revenues remain null',()=>{
 assert.equal(r.events.english_fallback,true);
 assert.equal(r.events.cross_promotion_categorization_required,true);
 assert.equal(r.events.start_date_in_past_allowed,false);
 assert.equal(r.unknown.net_revenue,null);
 assert.equal(r.no_event_posted,true);
});
test('Source references and fixed 293-task progress remain consistent',()=>{
 const sourceIds=new Set(d.evidence.map(s=>s.id)),claimIds=new Map(d.claims.map(c=>[c.id,c]));
 assert.equal(r.source_ids.length,2);assert.equal(r.claim_ids.length,20);
 for(const id of r.source_ids)assert(sourceIds.has(id),id);
 for(const id of r.claim_ids){assert(claimIds.has(id),id);assert(claimIds.get(id).source_ids.every(s=>sourceIds.has(s)));}
 const values=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(values.length,293);assert.equal(p.progress_percent,Math.round(values.reduce((a,b)=>a+b,0)/293));
});
