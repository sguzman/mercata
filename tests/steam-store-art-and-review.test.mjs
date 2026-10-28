import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const a=read('ontology/steam/capsule-store-page-compliance-and-review-2026.json'),d=read('specimens/steam.json'),p=read('plans/steam.json'),q=read('queues/steam.json');
test('Standard capsule copy cannot be used for awards or discount messaging',()=>{
 assert.equal(a.store_capsule.default_reviews_or_awards_allowed,false);
 assert.equal(a.store_capsule.default_discount_copy_allowed,false);
 assert.equal(a.artwork_override.temporary_only,true);
 assert.equal(a.artwork_override.must_localize_to_supported_game_languages,true);
});
test('Real artwork and paid-order outcomes remain unmeasured',()=>{
 assert.equal(a.store_review.screenshots_must_be_gameplay,true);
 assert.equal(a.store_review.coming_soon_public_min_days,14);
 assert.equal(a.observed.real_capsule_variations_experimented,0);
 assert.equal(a.observed.paid_sales_causal_lift,null);
});
test('Stable 293 tasks and attributed public claims preserved',()=>{
 const src=new Set(d.evidence.map(s=>s.id)),claims=new Map(d.claims.map(c=>[c.id,c]));
 assert.equal(a.source_ids.length,5);assert.equal(a.claim_ids.length,15);
 for(const id of a.source_ids)assert(src.has(id),id);
 for(const id of a.claim_ids){assert(claims.has(id),id);assert(claims.get(id).source_ids.every(s=>src.has(s)));}
 const v=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(v.length,293);assert.equal(p.progress_percent,Math.round(v.reduce((a,b)=>a+b,0)/293));
});
