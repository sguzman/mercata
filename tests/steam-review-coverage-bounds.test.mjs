import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {boundReviewMilestone as bound,contrastUnmatchedReleaseReviewFractions as contrast} from '../site/steam-review-coverage-bounds.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const x=read('ontology/steam/steam-public-review-milestone-coverage-bounds-2026.json'),d=read('specimens/steam.json'),p=read('plans/steam.json'),q=read('queues/steam.json');
test('Five checked bins are disjoint and exactly sum to published count',()=>{
 const a=x.gaugedb;assert.equal(a.review_count_disjoint_bins.reduce((sum,b)=>sum+b.count,0),a.review_checked);
 assert.equal(a.review_checked+a.review_unknown,a.catalog_games);
 const r=bound({catalogGames:a.catalog_games,checkedGames:a.review_checked,uncheckedGames:a.review_unknown,checkedBelow:a.review_under10_checked,threshold:10});
 assert.equal(r.observed_at_or_above,45382);
 assert.equal(r.lower_below_threshold_count,12651);
 assert.equal(r.upper_below_threshold_count,110085);
 assert.equal(r.early_review_concentration_verified,false);
 assert.equal(r.real_zero_paid_orders_share,null);
});
test('All missing or fully checked populations preserve true ranges',()=>{
 const a=bound({catalogGames:5,checkedGames:0,uncheckedGames:5,checkedBelow:0,threshold:10});
 assert.equal(a.below_threshold_checked_conditional_share,null);
 assert.equal(a.lower_below_threshold_share,0);assert.equal(a.upper_below_threshold_share,1);
 const b=bound({catalogGames:5,checkedGames:5,uncheckedGames:0,checkedBelow:2,threshold:10});
 assert.equal(b.lower_below_threshold_share,0.4);assert.equal(b.upper_below_threshold_share,0.4);
 assert.equal(b.completely_observed,true);
});
test('Impossible or invented coverage fails closed',()=>{
 assert.throws(()=>bound({catalogGames:5,checkedGames:3,uncheckedGames:3,checkedBelow:2,threshold:10}),/equal/);
 assert.throws(()=>bound({catalogGames:5,checkedGames:3,uncheckedGames:2,checkedBelow:4,threshold:10}),/exceeds/);
 assert.throws(()=>bound({catalogGames:5,checkedGames:3,uncheckedGames:2,checkedBelow:-1,threshold:10}),/nonnegative/);
});
test('Unmatched 2025 trackers cannot be treated as a causal trend or earnings',()=>{
 const a=x.videogamescritic,b=x.steamlense;
 assert.equal(a.reached_10reviews+a.under_10reviews,a.game_count_including_f2p);
 assert.equal(b.paid_label+b.free_label,b.total_2025);
 const r=contrast({name:'vgc',releaseYear:2025,gameCount:a.game_count_including_f2p,belowTenShare:a.under_10reviews/a.game_count_including_f2p},{name:'steamlense',releaseYear:2025,gameCount:b.total_2025,belowTenShare:b.under_10reviews_share});
 assert(r.difference_percentage_points>11&&r.difference_percentage_points<12);
 assert.equal(r.paid_checkout_rate,null);assert.equal(r.actual_market_trend,null);
});
test('Dated public sources join to claims, original 293 Steam tasks preserved',()=>{
 const sources=new Set(d.evidence.map(v=>v.id)),claims=new Map(d.claims.map(c=>[c.id,c]));
 assert.equal(x.source_ids.length,3);assert.equal(x.claim_ids.length,14);
 for(const id of x.source_ids)assert(sources.has(id),id);
 for(const id of x.claim_ids){assert(claims.has(id),id);assert(claims.get(id).source_ids.every(z=>sources.has(z)),id);}
 const scores=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(scores.length,293);assert.equal(p.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
});
