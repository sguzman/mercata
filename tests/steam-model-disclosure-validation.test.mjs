import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {auditSteamModelDisclosurePanel as audit} from '../site/steam-model-disclosure-validation.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const s=read('ontology/steam/steam-steammaho-disclosure-validation-and-low-sales-bins-2026.json'),d=read('specimens/steam.json'),p=read('plans/steam.json'),q=read('queues/steam.json');
const fixture=()=>({recent_disclosed_sales_validation:structuredClone(s.recent_disclosed_sales_validation),
 review_matched_disclosed_sales_validation:structuredClone(s.review_matched_disclosed_sales_validation),
 sales_per_review_calibration:structuredClone(s.sales_per_review_calibration),
 other_forecasts:structuredClone(s.other_forecasts)});
test('Thirty-two recent disclosures and 132 review-matched cases keep distinct denominators',()=>{
 const r=audit(fixture());
 assert.equal(r.recent_panel_count,32);
 assert.equal(r.recent_within_50_percent_disclosed_sales_share,17/32);
 assert.equal(r.recent_within_30_percent_disclosed_sales_share,11/32);
 assert.equal(r.review_matched_sample_count,132);
 assert.equal(r.review_matched_within_50_percent_share,79/132);
 assert.equal(r.panels_have_unreconciled_overlaps,true);
});
test('Only sixteen of 230 size-binned sales disclosures cover below one thousand units',()=>{
 const a=audit(fixture());assert.equal(a.sales_review_calibration_game_count,230);
 assert.equal(a.under_1000_disclosed_games,16);
 assert.equal(a.low_sales_band_share_of_disclosures,16/230);
 assert.equal(a.low_band_typical_sales_per_review,9.9);
 assert.equal(a.low_vs_next_band_ratio,9.9/31.8);
 assert.equal(a.zero_paid_sales_fraction,null);
 assert.equal(a.unique_nonreviewed_games_observed,null);
});
test('Contradictory sample counts, unsupported accuracy claims and real-looking secrets fail',()=>{
 const cases=[
  x=>{x.recent_disclosed_sales_validation.within_30_percent_count=18;},
  x=>{x.review_matched_disclosed_sales_validation.within_50_percent_count=133;},
  x=>{x.sales_per_review_calibration.bins[0].games=17;},
  x=>{x.sales_per_review_calibration.bins[0].inner_half_high=4;},
  x=>{x.recent_disclosed_sales_validation.representative_paid_release_population=true;},
  x=>{x.sales_per_review_calibration.complete_zero_review_sampling_frame=true;},
  x=>{x.other_forecasts.peak_players_week1_is_not_paid_sales=false;}
 ];
 for(const change of cases){let f=fixture();change(f);assert.throws(()=>audit(f));}
 const f=fixture();f.account_api_key='credential';
 assert.throws(()=>audit(f),/Unexpected/);
});
test('Source, claims and original 293 tasks reconcile without inventing publisher money',()=>{
 const sources=new Set(d.evidence.map(z=>z.id)),claimMap=new Map(d.claims.map(z=>[z.id,z]));
 assert.equal(s.source_ids.length,1);assert.equal(s.claim_ids.length,7);
 for(const id of s.source_ids)assert(sources.has(id),id);
 for(const id of s.claim_ids){assert(claimMap.has(id),id);
  assert(claimMap.get(id).source_ids.every(z=>sources.has(z)),id);}
 const scores=[...p.detail_tasks.map(x=>x.percent),...q.queues.flatMap(g=>g.tasks.map(x=>x.progress))];
 assert.equal(scores.length,293);
 assert.equal(p.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
 assert(Object.values(s.unresolved).every(z=>z===null));
});
