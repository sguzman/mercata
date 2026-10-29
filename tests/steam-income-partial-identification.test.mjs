import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {boundGrossPaidGameLowerMedian,boundSyntheticSteamGrossOrderMedian as median} from '../site/steam-gross-median-bounds.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const x=read('ontology/steam/nonresponse-gross-median-identification-bounds-2026.json'),d=read('specimens/steam.json'),p=read('plans/steam.json'),q=read('queues/steam.json');
test('Synthetic complete observed cohort gives a point identified lower median',()=>{
 const r=boundGrossPaidGameLowerMedian({eligibleFrameSize:5,observedGrossUsd:[100,0,50,20,10],frameComplete:true});
 assert.equal(r.lower_median_dollars_lower_bound,20);assert.equal(r.lower_median_dollars_upper_bound,20);assert.equal(r.median_point_identified,true);
});
test('Missing outcomes yield ordered partial identification intervals, not imputations',()=>{
 const a=boundGrossPaidGameLowerMedian({eligibleFrameSize:5,observedGrossUsd:[10,20,30],frameComplete:true});
 assert.equal(a.lower_median_dollars_lower_bound,10);assert.equal(a.lower_median_dollars_upper_bound,30);assert.equal(a.exact_zero_sale_fraction,null);
 const b=boundGrossPaidGameLowerMedian({eligibleFrameSize:5,observedGrossUsd:[10,20,30,40],frameComplete:true});
 assert.equal(b.lower_median_dollars_lower_bound,20);assert.equal(b.lower_median_dollars_upper_bound,30);
});
test('Three missing out of five has unbounded upper median; does not assert infinity in dollars',()=>{
 const a=boundGrossPaidGameLowerMedian({eligibleFrameSize:5,observedGrossUsd:[10,20],frameComplete:true});
 assert.equal(a.lower_median_dollars_lower_bound,0);assert.equal(a.lower_median_dollars_upper_bound,null);assert.equal(a.upper_is_unbounded,true);
 assert.equal(a.developer_net_payout_median,null);
});
test('An incomplete frame cannot report even conditional population bounds',()=>{
 const a=boundGrossPaidGameLowerMedian({eligibleFrameSize:5,observedGrossUsd:[10,20,30,40,50]});
 assert.equal(a.lower_median_dollars_lower_bound,null);assert.equal(a.lower_median_dollars_upper_bound,null);
 assert.throws(()=>boundGrossPaidGameLowerMedian({eligibleFrameSize:1,observedGrossUsd:[-1],frameComplete:true}),/nonnegative/);
 assert.throws(()=>boundGrossPaidGameLowerMedian({eligibleFrameSize:1,observedGrossUsd:[1,2],frameComplete:true}),/frame/);
});
test('No empirical claims are created and original 293 tasks remain unchanged',()=>{
 const sourceIds=new Set(d.evidence.map(e=>e.id)),claimIds=new Map(d.claims.map(c=>[c.id,c]));
 assert.equal(x.source_ids.length,3);assert.equal(x.claim_ids.length,12);
 for(const id of x.source_ids)assert(sourceIds.has(id),id);
 for(const id of x.claim_ids){assert(claimIds.has(id),id);assert(claimIds.get(id).source_ids.every(s=>sourceIds.has(s)));}
 assert.equal(x.unknown.actual_steam_median_gross,null);
 const scores=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(scores.length,293);assert.equal(p.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
});


const verified=(id,gross,h=30)=>({fixture_id:'fixture-'+id,coverage:'complete_reconciled',
 horizon_days:h,gross_usd_cents:gross,financial_access_attested:true,
 transfer_history_reconciled:true,paid_checkout_attribution_attested:true,release_horizon_reconciled:true});
const missingGame=(id,cap=null,h=30)=>({fixture_id:'fixture-'+id,horizon_days:h,
 verified_upper_cap_usd_cents:cap,cap_verified:cap!==null});
test('Authenticated fixed-horizon all-complete gross median matches legacy order statistic',()=>{
 const x=median({eligibleFrameSize:5,horizonDays:30,cohortFrameVerified:true,
 observed:[verified('a',0),verified('b',1000),verified('c',2000),verified('d',5000),verified('e',10000)]});
 assert.equal(x.gross_lower_median_lower_bound_usd_cents,2000);
 assert.equal(x.gross_lower_median_upper_bound_usd_cents,2000);
 assert.equal(x.median_point_identified,true);
 assert.equal(x.actual_steam_median_gross,null);
});
test('Missing games produce possible median bounds and preserve unbounded upper median',()=>{
 const three=median({eligibleFrameSize:5,horizonDays:30,cohortFrameVerified:true,
 observed:[verified('a',1000),verified('b',2000),verified('c',3000)],
 missing:[missingGame('d'),missingGame('e')]});
 assert.equal(three.gross_lower_median_lower_bound_usd_cents,1000);
 assert.equal(three.gross_lower_median_upper_bound_usd_cents,3000);
 const two=median({eligibleFrameSize:5,horizonDays:30,cohortFrameVerified:true,
 observed:[verified('a',1000),verified('b',2000)],
 missing:[missingGame('c'),missingGame('d'),missingGame('e')]});
 assert.equal(two.gross_lower_median_lower_bound_usd_cents,0);
 assert.equal(two.gross_lower_median_upper_bound_usd_cents,null);
 assert.equal(two.median_upper_unbounded,true);
});
test('Authenticated partial sales floors and justified caps tighten median identification',()=>{
 const a=missingGame('d',5000),b=missingGame('e',6000);
 Object.assign(a,{observed_partial_gross_usd_cents:1500,partial_gross_verified:true,
  partial_horizon_attested:true,paid_checkout_attribution_attested:true});
 Object.assign(b,{observed_partial_gross_usd_cents:2500,partial_gross_verified:true,
  partial_horizon_attested:true,paid_checkout_attribution_attested:true});
 const x=median({eligibleFrameSize:5,horizonDays:30,cohortFrameVerified:true,
 observed:[verified('a',1000),verified('b',2000),verified('c',3000)],missing:[a,b]});
 assert.equal(x.gross_lower_median_lower_bound_usd_cents,2000);
 assert.equal(x.gross_lower_median_upper_bound_usd_cents,3000);
 assert.equal(x.median_point_identified,false);
 assert.equal(x.verified_partial_floor_games,2);
});
test('Four-decimal complete observations retain an interval rather than invented exact cents',()=>{
 const a={...verified('a',0),gross_sales_usd_4dp:'0.0001'};delete a.gross_usd_cents;
 const x=median({eligibleFrameSize:1,horizonDays:30,cohortFrameVerified:true,observed:[a]});
 assert.equal(x.gross_lower_median_lower_bound_usd_cents,0);
 assert.equal(x.gross_lower_median_upper_bound_usd_cents,1);
 assert.equal(x.median_point_identified,false);
});
test('Mean contract prevents median claims from unauthorized or missing population data',()=>{
 const a=verified('a',1000);delete a.transfer_history_reconciled;
 assert.throws(()=>median({eligibleFrameSize:1,horizonDays:30,cohortFrameVerified:true,observed:[a]}),/Complete gross requires/);
 const b=missingGame('b',500);
 b.observed_partial_gross_usd_cents=600;b.partial_gross_verified=true;
 b.partial_horizon_attested=true;b.paid_checkout_attribution_attested=true;
 assert.throws(()=>median({eligibleFrameSize:1,horizonDays:30,cohortFrameVerified:true,missing:[b]}),/below authenticated partial/);
 const c=median({eligibleFrameSize:1,horizonDays:30,cohortFrameVerified:false,observed:[verified('c',500)]});
 assert.equal(c.gross_lower_median_lower_bound_usd_cents,null);
 assert.equal(c.gross_lower_median_upper_bound_usd_cents,null);
 assert.equal(c.median_point_identified,false);
});

test('Null optional partial fields remain unknown rather than a fabricated lower floor',()=>{
 const missing=missingGame('unknown');
 missing.observed_partial_gross_usd_cents=null;
 missing.observed_partial_gross_usd_4dp=null;
 const r=median({eligibleFrameSize:1,horizonDays:30,cohortFrameVerified:true,missing:[missing]});
 assert.equal(r.gross_lower_median_lower_bound_usd_cents,0);
 assert.equal(r.gross_lower_median_upper_bound_usd_cents,null);
 assert.equal(r.verified_partial_floor_games,0);
 assert.equal(r.median_upper_unbounded,true);
});
