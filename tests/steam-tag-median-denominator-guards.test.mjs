import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {auditPublicSteamTagMedians as audit} from '../site/steam-tag-median-denominator-guards.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const doc=read('ontology/steam/steam-tag-median-denominator-2026.json'),d=read('specimens/steam.json'),p=read('plans/steam.json'),q=read('queues/steam.json');
const sample=()=>({published_tag_count:doc.source.successfully_reported_tag_count,published_below_5000:doc.source.reported_below_5000_tag_medians,published_below_10000:doc.source.reported_below_10000_tag_medians,median_of_tag_medians_usd:doc.source.reported_unweighted_median_of_tag_medians_usd,tag_rows:doc.tag_rows});
test('Published tag estimates preserve distinct paid-only and all-license median populations',()=>{
 const r=audit(sample());
 assert.equal(r.summary.tags_observed_by_provider,107);
 assert.equal(r.summary.tags_median_revenue_proxy_below_5000,56);
 assert.equal(r.summary.tags_median_revenue_proxy_below_10000,81);
 assert.equal(r.summary.unweighted_median_of_tag_medians_usd,4837);
 assert.equal(r.copy_and_revenue_median_populations_differ,true);
 assert.equal(r.source_method_midrank_selection_not_full_raw_merchant_ledger,true);
 assert.equal(r.median_of_tag_medians_is_median_paid_game_income,false);
});
test('Visual novel and 2D platformer modeled medians are not an inferred checkout price or causal profit',()=>{
 const r=audit(sample());
 const novel=r.rows.find(x=>x.tag==='Visual Novel'),platformer=r.rows.find(x=>x.tag==='2D Platformer');
 assert.equal(novel.author_reported_paid_only_median_revenue_proxy_usd,10300);
 assert.equal(platformer.author_reported_paid_only_median_revenue_proxy_usd,1040);
 assert.equal(platformer.author_reported_median_copies_all_free_and_paid,209);
 for(const row of r.rows){
  assert.equal(row.derived_ratio_of_two_medians_as_unit_price_usd,null);
  assert.equal(row.actual_merchant_gross_usd,null);
  assert.equal(row.median_revenue_verified_from_entire_tag_catalog,false);
 }
 assert.equal(r.population_paid_release_median_usd,null);assert.equal(r.causal_best_genre,null);
});
test('One title can hold several tags, so their midpoints and populations must not be summed',()=>{
 const r=audit(sample());
 assert.equal(r.genre_tags_overlap,true);
 assert.equal(r.rows.length,5);
 assert.equal(r.distinct_legal_publishers,null);
});
test('Reject contradictory tag tallies, duplicate tags, invalid modeled values or hidden rows',()=>{
 assert.throws(()=>audit({...sample(),published_below_5000:82}),/Invalid public tag/);
 assert.throws(()=>audit({...sample(),published_tag_count:0}),/Invalid public tag/);
 assert.throws(()=>audit({...sample(),tag_rows:[...doc.tag_rows,doc.tag_rows[0]]}),/Invalid or repeated/);
 const bad=structuredClone(doc.tag_rows);bad[0].data_sharing_key='secret';
 assert.throws(()=>audit({...sample(),tag_rows:bad}),/raw records/);
 const wrong=structuredClone(doc.tag_rows);wrong[1].reported_paid_only_median_revenue_proxy_usd=-1;
 assert.throws(()=>audit({...sample(),tag_rows:wrong}),/Invalid or repeated/);
});
test('Quoted model data refer to documented source and 293 existing tasks',()=>{
 const sources=new Set(d.evidence.map(x=>x.id)),claims=new Map(d.claims.map(x=>[x.id,x]));
 assert.equal(doc.source_ids.length,1);assert.equal(doc.claim_ids.length,9);
 for(const id of doc.source_ids)assert(sources.has(id),id);
 for(const id of doc.claim_ids){assert(claims.has(id),id);assert(claims.get(id).source_ids.every(s=>sources.has(s)),id);}
 assert(Object.values(doc.unknown).every(x=>x===null));
 const v=[...p.detail_tasks.map(x=>x.percent),...q.queues.flatMap(z=>z.tasks.map(x=>x.progress))];
 assert.equal(v.length,293);assert.equal(Math.round(v.reduce((a,b)=>a+b,0)/293),p.progress_percent);
});
