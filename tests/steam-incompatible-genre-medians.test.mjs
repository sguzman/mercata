import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {compareSyntheticSteamGenreModels as compare} from '../site/steam-incompatible-genre-medians.mjs';
const load=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const study=load('ontology/steam/steam-puzzle-tag-incompatible-median-estimates-2026.json');
const d=load('specimens/steam.json'),p=load('plans/steam.json'),q=load('queues/steam.json');
const fixture=()=>({fixture_id:'fixture-two-distinct-tag-frames',provider_a_total_rows:58650,
 provider_a_tag_rows:1473,provider_a_median_usd:151347,
 provider_b_tag_rows:26452,provider_b_median_usd:2390,same_eligible_appids:false});
test('Same tag name does not imply matched priced title cohorts',()=>{
 const r=compare(fixture());assert.equal(r.provider_a_tag_rows,1473);
 assert.equal(r.provider_b_tag_rows,26452);
 assert(Math.abs(r.nominal_median_ratio-151347/2390)<1e-12);
 assert.equal(r.matched_game_population,false);
 assert.equal(r.game_sample_overlap_count,null);
});
test('Third-party median quotients never produce a market median or genre-profit treatment effect',()=>{
 const r=compare(fixture());
 for(const k of ['actual_paid_game_median','causal_genre_effect','zero_paid_order_fraction','developer_after_cost_profit'])assert.equal(r[k],null);
 assert(Object.values(study.unknown).every(x=>x===null));
});
test('Reject extra private columns, impossible sampled counts and misidentified same cohort',()=>{
 for(const patch of [{provider_a_tag_rows:60000},{provider_b_median_usd:0},
 {provider_a_total_rows:10.5},{same_eligible_appids:true},{private_account_id:'private'},
 {appid:12345},{verified_payout_usd:5}])
  assert.throws(()=>compare({...fixture(),...patch}));
 assert.throws(()=>compare([58650,1473,26452]));
});
test('All source IDs and claims are registered with 293 unmodified task identities',()=>{
 const ids=new Set(d.evidence.map(x=>x.id)),claims=new Map(d.claims.map(x=>[x.id,x]));
 assert.equal(study.source_ids.length,2);assert.equal(study.claim_ids.length,9);
 for(const id of study.source_ids)assert(ids.has(id));
 for(const id of study.claim_ids){assert(claims.has(id),id);assert(claims.get(id).source_ids.every(s=>ids.has(s)),id);}
 const scores=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(x=>x.progress))];
 assert.equal(scores.length,293);assert.equal(p.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
});
