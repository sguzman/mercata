import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {auditWishlistVolunteerEraStudy as audit} from '../site/steam-volunteer-wishlist-ratio.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const study=read('ontology/steam/steam-voluntary-wishlist-ratio-2026-era-comparison.json'),d=read('specimens/steam.json'),p=read('plans/steam.json'),q=read('queues/steam.json');
const inputs=()=>({sample:structuredClone(study.sample),
 unit_ratio_benchmarks_from_summary:structuredClone(study.unit_ratio_benchmarks_from_summary),
 in_sample_associations_primary:structuredClone(study.in_sample_associations_primary)});
test('Distinct 2020–22 and 2023–25 volunteer groups reconcile without market inference',()=>{
 const r=audit(inputs());assert.equal(r.earlier_cohort_games,34);
 assert.equal(r.later_cohort_games,126);assert.equal(r.total_developer_volunteer_games,160);
 assert.equal(r.matched_wishlister_purchase_fraction,null);
 assert.equal(r.representative_2026_paid_release_prediction,null);
});
test('Recent first-month unit/wishlist ratio is lower, not a direct buyer conversion rate',()=>{
 const r=audit(inputs());
 assert(Math.abs(r.month_one_units_per_launch_wishlist_median_ratio_later_to_earlier-(.22/.45))<1e-12);
 assert.equal(r.actual_publisher_net_income,null);
 assert.throws(()=>audit({...inputs(),unit_ratio_benchmarks_from_summary:{
  ...study.unit_ratio_benchmarks_from_summary,not_matched_wishlister_purchase_probability:false}}),/No representative/);
});
test('Velocity does not outscore wishlist stock in the later survey era',()=>{
 const r=audit(inputs());
 assert.equal(r.last_30_day_wishlist_velocity_outperforms_total_in_later_era,false);
 assert(Math.abs(r.combined_pool_in_sample_r_squared_gain-.02)<1e-10);
 assert.equal(r.verified_out_of_sample_forecast_advantage,null);
});
test('Contradictory cohorts, source provenance, follow-up and private fields fail closed',()=>{
 const x=inputs();x.sample.total_games=161;
 assert.throws(()=>audit(x),/reconcile/);
 const y=inputs();y.sample.full_12month_followup_for_each_game_verified=true;
 assert.throws(()=>audit(y),/No representative/);
 const z=inputs();z.in_sample_associations_primary.era_2023_2025.total_wishlists_r_squared=1.5;
 assert.throws(()=>audit(z),/Invalid era/);
 const a=inputs();a.unit_ratio_benchmarks_from_summary.later.month6=.1;
 assert.throws(()=>audit(a),/Invalid cumulative/);
 const b=inputs();b.account_identifier='private';
 assert.throws(()=>audit(b),/Invalid volunteer/);
});
test('Public sources, source-bound claims and original 293 Steam task IDs stay intact',()=>{
 const sourceIds=new Set(d.evidence.map(x=>x.id)),claims=new Map(d.claims.map(x=>[x.id,x]));
 assert.equal(study.source_ids.length,2);assert.equal(study.claim_ids.length,8);
 for(const id of study.source_ids)assert(sourceIds.has(id),id);
 for(const id of study.claim_ids){assert(claims.has(id),id);assert(claims.get(id).source_ids.every(x=>sourceIds.has(x)),id);}
 const scores=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(w=>w.tasks.map(t=>t.progress))];
 assert.equal(scores.length,293);
 assert.equal(p.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
});
