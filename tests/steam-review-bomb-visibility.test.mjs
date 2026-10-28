import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {scorePeriodExclusion} from '../site/steam-review-score-filters.mjs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const r=get('ontology/steam/review-bombing-score-and-store-visibility-2026.json'),d=get('specimens/steam.json'),p=get('plans/steam.json'),q=get('queues/steam.json');
test('Synthetic off-topic time-period removal changes denominator without deleting review records',()=>{
 const x=scorePeriodExclusion({steamPositive:39,steamNegative:61,excludedPeriodPositive:0,excludedPeriodNegative:10});
 assert.equal(x.steam_origin_review_records,100);
 assert.equal(x.remaining_eligible_review_records,90);
 assert.equal(x.raw_40pct_boundary_reached,false);
 assert.equal(x.hypothetical_filtered_40pct_boundary_reached,true);
 assert.equal(x.actual_purchases,null);
 assert.equal(x.observed_steam_visibility,null);
});
test('No reviews and impossible exclusions fail closed',()=>{
 const x=scorePeriodExclusion({steamPositive:0,steamNegative:0,excludedPeriodPositive:0,excludedPeriodNegative:0});
 assert.equal(x.hypothetical_filtered_positive_fraction,null);
 assert.equal(x.valve_rating_category,null);
 assert.throws(()=>scorePeriodExclusion({steamPositive:1,steamNegative:2,excludedPeriodPositive:2,excludedPeriodNegative:0}),/Invalid/);
});
test('Individual off-topic flag is distinct from off-topic bomb-period default score filter',()=>{
 assert.equal(r.reviews.individual_off_topic_flag_does_not_automatically_remove_score,true);
 assert.equal(r.reviews.offtopic_bomb_period_excluded_by_default,true);
 assert.equal(r.api.default_languages[0],'english');
 assert.equal(r.api.default_filter_offtopic_activity,true);
 assert.equal(r.current_public_discovery.below_threshold_blocks_sale,false);
 assert.equal(r.actual_incremental_sales,null);
});
test('Evidence and stable 293-task denominator',()=>{
 const ss=new Set(d.evidence.map(x=>x.id)),cc=new Map(d.claims.map(x=>[x.id,x]));
 assert.equal(r.source_ids.length,5);assert.equal(r.claim_ids.length,16);
 for(const id of r.source_ids)assert(ss.has(id),id);
 for(const id of r.claim_ids){assert(cc.has(id),id);assert(cc.get(id).source_ids.every(s=>ss.has(s)));}
 const scores=[...p.detail_tasks.map(x=>x.percent),...q.queues.flatMap(g=>g.tasks.map(x=>x.progress))];
 assert.equal(scores.length,293);assert.equal(p.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
});
