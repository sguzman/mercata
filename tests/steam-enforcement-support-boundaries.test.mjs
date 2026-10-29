import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const load=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const x=load('ontology/steam/steam-enforcement-support-and-key-revocation-boundaries-2026.json'),d=load('specimens/steam.json'),p=load('plans/steam.json'),q=load('queues/steam.json');
test('Support tickets do not imply guaranteed independent appeals or reinstatement',()=>{
 assert.equal(x.situations.developer_support_ticket.public_process,true);
 assert.equal(x.situations.developer_support_ticket.guaranteed_reinstatement,false);
 assert.equal(x.situations.developer_support_ticket.independent_tribunal_promised,false);
 assert.equal(x.situations.developer_support_ticket.guaranteed_resolution_time_days,null);
});
test('Retirement preserves different license and sale states',()=>{
 assert.equal(x.situations.voluntary_retirement.existing_library_entitlement_generally_retained,true);
 assert.equal(x.situations.voluntary_retirement.normal_online_service_guaranteed,false);
 assert.equal(x.situations.voluntary_retirement.stop_external_steam_key_retail,true);
 assert.equal(x.situations.fraudulent_or_expired_beta_key_revocation.revoking_legitimately_sold_keys_allowed,false);
 assert.equal(x.situations.fraudulent_or_expired_beta_key_revocation.equals_stored_paid_order_refund,false);
 assert(Object.values(x.unknown).every(v=>v===null));
});
test('Ten policy claims are referenced and the fixed Steam task inventory is unchanged',()=>{
 const src=new Set(d.evidence.map(s=>s.id)),claims=new Map(d.claims.map(c=>[c.id,c]));
 assert.equal(x.source_ids.length,5);assert.equal(x.claim_ids.length,10);
 for(const id of x.source_ids)assert(src.has(id),id);
 for(const id of x.claim_ids){assert(claims.has(id),id);assert(claims.get(id).source_ids.every(s=>src.has(s)),id);}
 const scores=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(scores.length,293);assert.equal(p.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
});
