import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {auditSteamReviewerPlaytimeAggregates as audit} from '../site/steam-reviewer-playtime-cohort-guards.mjs';
const load=path=>JSON.parse(fs.readFileSync(new URL('../'+path,import.meta.url),'utf8'));
const x=load('ontology/steam/steam-curated-review-playtime-and-price-value-observability-2026.json'),d=load('specimens/steam.json'),p=load('plans/steam.json'),q=load('queues/steam.json');
const parts=()=>({game_count:x.source_frame.game_count,price_bands:x.price_bands,review_cost_per_hour_bands:x.review_cost_per_hour_bands,within_price_playtime_quartiles:x.within_price_playtime_quartiles,genre_bands:x.genre_bands,release_year_cohorts:x.release_year_cohorts});
test('Source price, genre and age bins all reconcile to the selected 6954 games',()=>{
 const a=audit(parts());
 assert.equal(a.curated_game_count,6954);assert.deepEqual(a.source_count_checks,{price_bands:6954,genres:6954,release_cohorts:6954});
 assert.equal(a.minimum_median_reviewer_hours,3.3);assert.equal(a.maximum_median_reviewer_hours,26);
 assert.equal(a.ten_dollar_plus_regular_price_ratio_min,1.9);
 assert.equal(a.ten_dollar_plus_regular_price_ratio_max,2.06);
});
test('Review-score gradients and within-price quartile gaps remain descriptive',()=>{
 const a=audit(parts());
 assert.equal(a.median_positive_review_gradient_points,22.4);
 assert.equal(a.under70positive_game_share_gradient_points,50);
 assert.deepEqual(a.within_price_long_minus_short_review_points,[2.9,5.3,6.5,8.8]);
 for(const k of ['average_buyer_playtime','actual_checkout_price','causal_price_elasticity','causal_playtime_review_effect','total_paid_game_units','after_cost_publisher_profit'])assert.equal(a[k],null,k);
 assert.equal(x.interpretation.causal_length_or_price_effect_established,false);
 assert.equal(x.interpretation.never_assume_median_price_over_median_hours_equals_median_per_game_ratio,true);
});
test('Inconsistent cohorts and impossible scores are rejected rather than converted to market claims',()=>{
 const a=parts();
 assert.throws(()=>audit({...a,price_bands:a.price_bands.map((r,i)=>i===0?{...r,game_count:1013}:r)}),/disagree/);
 assert.throws(()=>audit({...a,review_cost_per_hour_bands:a.review_cost_per_hour_bands.map((r,i)=>i===0?{...r,median_positive_review_pct:101}:r)}),/Invalid/);
 assert.throws(()=>audit({...a,genre_bands:[a.genre_bands[0],...a.genre_bands]}),/Duplicate/);
 assert.throws(()=>audit({...a,source_frame:{game_count:-1},game_count:-1}),/Invalid/);
});
test('Review study source, claims and 293-task original Steam inventory remain intact',()=>{
 const sources=new Set(d.evidence.map(s=>s.id)),claims=new Map(d.claims.map(c=>[c.id,c]));
 assert.equal(x.source_ids.length,2);assert.equal(x.claim_ids.length,16);
 for(const s of x.source_ids)assert(sources.has(s),s);
 for(const id of x.claim_ids){assert(claims.has(id),id);assert(claims.get(id).source_ids.every(s=>sources.has(s)),id);}
 const scores=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(scores.length,293);assert.equal(p.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
 assert(p.detail_tasks.find(t=>t.id==='steam/competition/investigate-game-length-and-perceived-value').evidence.includes('ontology/steam/steam-curated-review-playtime-and-price-value-observability-2026.json'));
 assert(Object.values(x.unknown).every(v=>v===null));
});
