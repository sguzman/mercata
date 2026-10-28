import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const j=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const x=j('ontology/steam/workshop-ugc-monetization-and-rights-2026.json'),d=j('specimens/steam.json'),p=j('plans/steam.json'),q=j('queues/steam.json');
test('Workshop interactions do not become base-game paid orders',()=>{
 assert.equal(x.monetization.free_subscription_is_paid_order,false);
 assert.equal(x.monetization.paid_workshop_item_is_base_game_sale,false);
 assert.equal(x.monetization.exact_royalty_percent,null);
});
test('A game developer cannot presume ownership of all user content',()=>{
 assert.equal(x.rights.all_user_items_owned_by_game_developer,false);
 assert.equal(x.rights.all_ugc_reusable_without_individual_rights_check,false);
 assert.equal(x.unknown.actual_profit,null);
});
test('Source traceability and fixed 293-task denominator',()=>{
 const ss=new Set(d.evidence.map(x=>x.id)),cc=new Map(d.claims.map(c=>[c.id,c]));
 assert.equal(x.source_ids.length,2);assert.equal(x.claim_ids.length,12);
 for(const id of x.source_ids)assert(ss.has(id),id);
 for(const id of x.claim_ids){assert(cc.has(id));assert(cc.get(id).source_ids.every(s=>ss.has(s)));}
 const z=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(z.length,293);assert.equal(p.progress_percent,Math.round(z.reduce((a,b)=>a+b,0)/293));
});
