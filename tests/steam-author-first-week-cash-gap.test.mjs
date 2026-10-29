import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {auditSyntheticLaunchWeek as audit,compareReportedLaunchWeeks as compare} from '../site/steam-author-first-week-cash-gap.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const d=read('specimens/steam.json'),p=read('plans/steam.json'),q=read('queues/steam.json'),doc=read('ontology/steam/steam-author-first-week-cash-gap-2026.json');
const f={grossUsdCents:174900,reportedUnits:489,reportedReturnedUnits:10,reportedReviews:41,launchWishlistLowerBound:800,weekWishlistStock:1927,claimedWishlistConversionPct:10.4,estimatedFutureBankUsdCents:90000,developmentMonths:4};
test('Publisher-projected bank receipts remain different from gross sales and observed deposits',()=>{
 const r=audit(f);assert.equal(r.gross_usd_reported,1749);assert.equal(r.estimated_future_bank_usd,900);
 assert(Math.abs(r.projected_bank_share_of_reported_gross_conditional-900/1749)<1e-12);
 assert(Math.abs(r.approximate_gross_per_reported_unit_usd-1749/489)<1e-12);
 assert.equal(r.observed_bank_deposit_usd,null);assert.equal(r.actual_after_cost_profit_usd,null);
});
test('Refunds, wishlist metrics, median playtime and reviews remain distinct outcomes',()=>{
 const r=audit(f);assert.equal(r.conditional_returns_over_reported_units,10/489);
 assert.equal(r.comparable_actual_launch_wishlist_conversion,null);
 assert.equal(r.review_based_paid_unit_estimator_validated,false);
 assert.equal(doc.source_report.reported_median_playtime_minutes,70);
});
test('Two unrelated first-week reports cannot constitute a median or causal effect',()=>{
 const r=compare(doc.descriptive_comparison.cases);assert.equal(r.case_count,2);
 assert.equal(r.representative_first_week_median,null);
 assert.equal(r.first_game_vs_second_game_effect,null);
 assert.equal(r.source_population_complete,false);
 assert.deepEqual(r.cases.map(x=>x.first_week_gross_usd),[1749,19851]);
});
test('Impossible return and cash numbers, multiple or duplicate source reports fail closed',()=>{
 assert.throws(()=>audit({...f,reportedReturnedUnits:490}),/Returns exceed/);
 assert.throws(()=>audit({...f,grossUsdCents:1.5}),/safe nonnegative/);
 assert.throws(()=>audit({...f,weekWishlistStock:799}),/below launch/);
 assert.throws(()=>audit({...f,claimedWishlistConversionPct:101}),/Invalid author/);
 assert.throws(()=>compare([doc.descriptive_comparison.cases[0]]),/Two or more/);
 assert.throws(()=>compare([doc.descriptive_comparison.cases[0],doc.descriptive_comparison.cases[0]]),/Unique source/);
});
test('Public source, claim and original 293-task provenance remain consistent',()=>{
 const sources=new Set(d.evidence.map(x=>x.id)),claims=new Map(d.claims.map(x=>[x.id,x]));
 assert.equal(doc.source_ids.length,2);assert.equal(doc.claim_ids.length,8);
 for(const id of doc.source_ids)assert(sources.has(id),id);
 for(const id of doc.claim_ids){assert(claims.has(id),id);assert(claims.get(id).source_ids.every(s=>sources.has(s)),id);}
 assert(Object.values(doc.unknown).every(x=>x===null));
 const nums=[...p.detail_tasks.map(x=>x.percent),...q.queues.flatMap(g=>g.tasks.map(x=>x.progress))];
 assert.equal(nums.length,293);assert.equal(Math.round(nums.reduce((a,b)=>a+b,0)/293),p.progress_percent);
});
