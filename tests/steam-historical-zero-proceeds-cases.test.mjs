import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const x=read('ontology/steam/historical-zero-proceeds-versus-zero-sales-2026.json'),d=read('specimens/steam.json'),p=read('plans/steam.json'),q=read('queues/steam.json');
test('2018 zero personal proceeds is explicitly distinct from positive game units',()=>{
 const a=x.cases.find(c=>c.id==='water_tastes_like_wine_2018');
 assert.equal(a.reported.steam_units_positive,true);assert.equal(a.reported.steam_units_exact,null);
 assert.equal(a.reported.author_personal_proceeds_usd_to_snapshot,0);
 assert.equal(a.reported.paid_collaborator_expenses_usd_approx,140000);
 assert.equal(a.definition.actual_total_studio_after_cost_profit_usd,null);
 assert.equal(a.not_lifetime,true);
});
test('2025 self-reported zero wishlist outside buyers does not erase paid orders',()=>{
 const a=x.cases.find(c=>c.id==='low_sales_no_self_reported_wishlist_buyer_2025');
 assert.equal(a.reported.sold_copies_reported,7);
 assert.equal(a.reported.independent_prelaunch_wishlist_buys_claimed,0);
 assert.equal(a.reported.launch_wishlist_count_approx,150);
 assert.equal(a.definition.actual_wishlist_buyer_crosswalk_verified,false);
 assert.equal(a.definition.actual_after_labor_profit_usd,null);
});
test('Distinct zero units and unknown population parameters remain explicit',()=>{
 assert.equal(x.claim_boundaries.zero_personal_proceeds_is_zero_game_sales,false);
 assert.equal(x.claim_boundaries.zero_self_declared_wishlister_buyers_is_zero_game_sales,false);
 assert.equal(x.claim_boundaries.observational_stories_are_representative,false);
 assert.equal(x.claim_boundaries.unknown_actual_zero_sale_fraction,null);
 assert.equal(x.claim_boundaries.unknown_publisher_profit_distribution,null);
});
test('Original 293 tasks and evidence sources join correctly',()=>{
 const sources=new Set(d.evidence.map(t=>t.id)),claims=new Map(d.claims.map(t=>[t.id,t]));
 assert.equal(x.source_ids.length,2);assert.equal(x.claim_ids.length,9);
 for(const id of x.source_ids)assert(sources.has(id),id);
 for(const id of x.claim_ids){assert(claims.has(id),id);assert(claims.get(id).source_ids.every(s=>sources.has(s)),id);}
 const scores=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(scores.length,293);
 assert.equal(p.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
});
