import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {auditSyntheticSteamCatalogScopes as audit} from '../site/steam-aiepa-catalog-scope-audit.mjs';
const load=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const x=load('ontology/steam/steam-aiepa-2024-2025-raw-vs-filtered-catalog-proxy-audit-2026.json');
const d=load('specimens/steam.json'),p=load('plans/steam.json'),q=load('queues/steam.json');
const fixture=()=>({fixture_id:'fixture-two-catalogs',raw_2024:87806,raw_2025:94948,strict_2024:77184,strict_2025:81251,
shared_raw:78264,only_2024_raw:9542,only_2025_raw:16684,
free_tier:6921,budget_tier:57443,mid_tier:15237,aaa_tier:1650});
test('Raw overlap and exclusions reconcile; raw overlap is too large to be a strict intersection',()=>{
 const a=audit(fixture());
 assert.equal(a.raw_2024_excluded,10622);assert.equal(a.raw_2025_excluded,13697);
 assert.equal(a.shared_raw,78264);assert.equal(a.reported_shared_raw_exceeds_smaller_strict_sample,true);
 assert.equal(x.raw_cross_snapshot.intersection_of_two_strict_samples,null);
});
test('All four price tier counts match strict March population but modelled F2P zero is not income',()=>{
 const a=audit(fixture());assert.equal(a.strict_2025,81251);
 assert.equal(x.march_2025_price_tiers.reduce((n,t)=>n+t.count,0),81251);
 assert.equal(x.march_2025_price_tiers[0].proxy_median_revenue_usd,0);
 assert.equal(x.proxy_method.free_to_play_zero_is_structural,true);
 for(const k of ['paid_first_release_population','zero_actual_paid_sales_fraction','actual_publisher_revenue','actual_developer_profit','true_delistings'])
  assert.equal(a[k],null);
});
test('Reject unpermitted IDs, observed money, invalid partitions and impossible sample counts',()=>{
 for(const bad of [{reported_bank_usd:300},{private_game_id:'foo'},{shared_raw:78265},
  {strict_2024:87807},{free_tier:6922},{only_2025_raw:16683},{raw_2025:-1},{aaa_tier:1.5}])
  assert.throws(()=>audit({...fixture(),...bad}));
 assert.throws(()=>audit([87806,94948]));
});
test('Source and task links remain anchored to original 293 tasks',()=>{
 const src=new Set(d.evidence.map(s=>s.id)),claims=new Map(d.claims.map(c=>[c.id,c]));
 assert.equal(x.claim_ids.length,10);assert.equal(x.source_ids.length,2);
 for(const id of x.source_ids)assert(src.has(id));
 for(const id of x.claim_ids){assert(claims.has(id),id);assert(claims.get(id).source_ids.every(s=>src.has(s)),id);}
 const scores=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(scores.length,293);assert.equal(p.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
 assert(Object.values(x.unknown).every(v=>v===null));
});
