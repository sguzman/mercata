import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const load=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const s=load('ontology/steam/steam-drm-cloud-saves-and-switching-costs-2026.json'),d=load('specimens/steam.json'),p=load('plans/steam.json'),q=load('queues/steam.json');
test('License, cloud file, DRM-free export and reviews remain distinct',()=>{
 assert.equal(s.drm.wrapper_protects_only_against_casual_copying,true);
 assert.equal(s.drm.guarantees_no_piracy,false);
 assert.equal(s.auth.developer_can_offer_owned_user_drm_free_web_build,true);
 assert.equal(s.auth.automatic_cross_store_entitlement_export,false);
 assert.equal(s.cloud.cloud_file_sync_equals_purchase,false);
 assert.equal(s.cloud.files_guaranteed_interoperable_across_game_versions,false);
});
test('No profits or cross-store repurchase behavior inferred from technical documentation',()=>{
 assert.equal(s.unknown.actual_customer_switching_cost_usd,null);
 assert.equal(s.unknown.customer_cross_store_repurchase_rate,null);
 assert.equal(s.unknown.causal_revenue_effect_of_steam_drm,null);
 assert.equal(s.no_game_build_tested,true);
});
test('Source claims and fixed Steam task count stay valid',()=>{
 const sources=new Set(d.evidence.map(x=>x.id)),claims=new Map(d.claims.map(c=>[c.id,c]));
 assert.equal(s.source_ids.length,4);assert.equal(s.claim_ids.length,12);
 for(const id of s.source_ids)assert(sources.has(id),id);
 for(const id of s.claim_ids){const c=claims.get(id);assert(c,id);assert(c.source_ids.every(id=>sources.has(id)));}
 const values=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(values.length,293);assert.equal(p.progress_percent,Math.round(values.reduce((a,b)=>a+b,0)/293));
});
