import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {auditSteamEarlyAccessSelection as audit} from '../site/steam-earlyaccess-cohort-coverage.mjs';
const load=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const source=load('ontology/steam/steam-early-access-release-survival-review-selection-2026.json'),d=load('specimens/steam.json'),
 p=load('plans/steam.json'),q=load('queues/steam.json');
const fixture=()=>({
 total_recovered_all_eras:structuredClone(source.total_recovered_all_eras),
 historical_2013_2023:structuredClone(source.historical_2013_2023),
 live_as_of_snapshot:structuredClone(source.live_as_of_snapshot),
 graduated_duration_subset:structuredClone(source.graduated_duration_subset),
 post_full_release_update_post_subset:structuredClone(source.post_full_release_update_post_subset),
 selection_limitations:structuredClone(source.selection_limitations)
});
test('The 2013–2023 review-threshold cohort has disjoint statuses and never doubles graduation removals',()=>{
 const x=audit(fixture()),gr=source.historical_2013_2023.reviewed_10plus;
 assert.equal(x.all_eras_recovered_early_access_games,23247);
 assert.equal(x.historical_2013_2023_10plus_games,10141);
 assert.equal(gr.graduated_full_release+gr.still_ea_with_no_update_notice+
   gr.still_ea_recently_updated+gr.removed_while_in_ea,10141);
 assert.equal(x.historical_10plus_removed_while_in_ea_minimum,702);
 assert.equal(x.graduated_then_removed_are_subset_not_extra_status,404);
 assert(Math.abs(x.historical_10plus_graduation_fraction-6144/10141)<1e-12);
});
test('Review floor reweights the recovered 2013–2023 denominator, never the actual sales population',()=>{
 const x=audit(fixture());
 assert.equal(x.historical_2013_2023_any_review_games,14597);
 assert.equal(x.reviewless_and_lowreview_games,4456);
 assert.equal(x.reported_all_recovered_graduation_percent,51);
 assert.equal(x.review_threshold_selection_gap_percentage_points,10);
 assert.equal(x.actual_zero_paid_sale_fraction,null);
 assert.equal(x.paid_first_release_cohort_complete,false);
});
test('The historical live Early Access no-update-note share is age-specific and noncausal',()=>{
 const x=audit(fixture());
 assert.equal(x.live_ea_no_update_note_fraction,6989/12320);
 assert.equal(x.live_ea_one_year_plus_no_update_note_fraction,6977/9063);
 assert.equal(x.abandonment_probability,null);
 assert.equal(x.developer_net_income_median,null);
});
test('False cohort completion, invented financial evidence and doubled status counts fail closed',()=>{
 const cases=[
  o=>{o.historical_2013_2023.reviewed_10plus.graduated_full_release+=404;},
  o=>{o.historical_2013_2023.review_bins[0].games=4500;},
  o=>{o.historical_2013_2023.review_bins[3].reported_graduation_percent=101;},
  o=>{o.live_as_of_snapshot.aged_one_year_or_more_with_note=10000;},
  o=>{o.selection_limitations.initial_paid_release_frame_complete=true;},
  o=>{o.selection_limitations.no_marketwide_paid_order_observations=false;},
  o=>{o.live_as_of_snapshot.presence_of_note_proves_abandoned=true;},
  o=>{o.historical_2013_2023.reviewed_10plus.graduated_subsequently_removed=9000;}
 ];
 for(const change of cases){const z=fixture();change(z);assert.throws(()=>audit(z));}
 const z=fixture();z.partner_account_id='private';
 assert.throws(()=>audit(z),/Unexpected/);
});
test('Publication registers a distinct public study with the fixed original 293 research tasks',()=>{
 const sourceIDs=new Set(d.evidence.map(e=>e.id)),claims=new Map(d.claims.map(c=>[c.id,c]));
 assert.equal(source.source_ids.length,1);
 assert.equal(source.claim_ids.length,11);
 for(const id of source.source_ids)assert(sourceIDs.has(id),id);
 for(const id of source.claim_ids){
  assert(claims.has(id),id);
  assert(claims.get(id).source_ids.every(x=>sourceIDs.has(x)),id);
 }
 const scores=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(scores.length,293);
 assert.equal(p.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
 assert(Object.values(source.unknown).every(v=>v===null));
});
