import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {assessCrossStoreComparability} from '../site/itch-crossstore-comparability.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Crossstore inputs require matching product, currency, age, price and transparent cost basis',()=>{
 const d=read('ontology/itch-io/crossstore-sales-comparability-2026.json'),s=read('specimens/itch-io.json'),p=read('plans/itch-io.json');
 assert(d.source_ids.every(x=>s.evidence.some(e=>e.id===x)));
 const a={gameId:'hypothetical-game',edition:'v1',store:'itch',productType:'premium',priceCurrency:'USD',priceAmount:10,discountStatus:'none',priceWindowStartUTC:'2026-01-01T00:00:00Z',priceWindowEndUTC:'2026-01-31T00:00:00Z',releaseAgeDays:30,marketingCohort:'known-comparable-audience',grossReceipts:20,platformFee:2,processorFee:1,refunds:0,distributionLaborHours:2,qaLaborHours:2,supportLaborHours:1,paidOrders:2,merchantPayoutBasis:'gross-before-tax'};
 const b={...a,store:'other-store'};
 assert.equal(assessCrossStoreComparability(a,b).comparisonReady,true);
 assert.equal(assessCrossStoreComparability(a,b).causalStoreEffect,null);
 assert.equal(assessCrossStoreComparability(a,{...b,priceAmount:5}).comparisonReady,false);
 assert.equal(assessCrossStoreComparability(a,{...b,priceCurrency:'GBP'}).comparisonReady,false);
 assert.equal(assessCrossStoreComparability(a,{...b,marketingCohort:null}).comparisonReady,false);
 assert.equal(assessCrossStoreComparability(a,{...b,releaseAgeDays:365}).comparisonReady,false);
 assert.equal(assessCrossStoreComparability(a,{...b,distributionLaborHours:null}).comparisonReady,false);
 assert(Object.values(d.unmeasured).every(x=>x===null));
 const done=p.detail_tasks.find(t=>t.id==='itch-io/review/plan-cross-store-comparisons');
 assert.equal(done.percent,100);assert.equal(done.status,'complete');
 const other=p.detail_tasks.find(t=>t.id==='itch-io/strategy/compare-itch-only-and-multi-store-publishing');
 assert.equal(other.percent,100);assert.equal(other.status,'complete');
 for(const t of [done,other])for(const x of ['ontology/itch-io/crossstore-sales-comparability-2026.json','ontology/itch-io/crossstore-sales-comparability-2026.md','site/itch-crossstore-comparability.mjs','tests/itch-crossstore-sales-comparability.test.mjs'])assert(t.evidence.includes(x));
 assert.equal(p.total_tracked_tasks,244);assert.equal(p.detail_tasks.length,160);
});

test('Cross-store readiness rejects malformed or impossible windows even when two records match each other',()=>{
 const original={gameId:'fixture',edition:'v1',store:'itch',productType:'premium',priceCurrency:'USD',priceAmount:10,
  discountStatus:'none',priceWindowStartUTC:'2026-01-01T00:00:00Z',priceWindowEndUTC:'2026-01-31T00:00:00Z',
  releaseAgeDays:30,marketingCohort:'matched',grossReceipts:20,platformFee:2,processorFee:1,refunds:0,
  distributionLaborHours:1,qaLaborHours:1,supportLaborHours:1,paidOrders:2,merchantPayoutBasis:'gross-before-tax'};
 const pair=v=>assessCrossStoreComparability(v,{...v,store:'other-store'});
 assert.equal(pair(original).comparisonReady,true);
 for(const [start,end] of [
  ['2026-02-30T00:00:00Z','2026-03-31T00:00:00Z'],
  ['2026-01-01T00:00:00Z','2025-12-31T00:00:00Z'],
  ['2026-01-01T00:00:00Z','2026-01-01T00:00:00Z'],
  ['2026-13-01T00:00:00Z','2026-14-01T00:00:00Z'],
  ['2026-01-01','2026-01-31'],
  ['2026-01-01T24:00:00Z','2026-01-31T00:00:00Z']
 ]) {
  const result=pair({...original,priceWindowStartUTC:start,priceWindowEndUTC:end});
  assert.equal(result.comparisonReady,false,start+'..'+end);
  assert(result.issues.some(x=>x.includes('invalid UTC price window')),start);
  assert.equal(result.observedIncrementalRevenue,null);
 }
});
test('Cross-store readiness requires whole order counts, whole release age and identifiable accounting fields',()=>{
 const a={gameId:'fixture',edition:'v1',store:'itch',productType:'premium',priceCurrency:'USD',priceAmount:10,
  discountStatus:'none',priceWindowStartUTC:'2026-01-01T00:00:00Z',priceWindowEndUTC:'2026-01-31T00:00:00Z',
  releaseAgeDays:30,marketingCohort:'matched',grossReceipts:20,platformFee:2,processorFee:1,refunds:0,
  distributionLaborHours:1,qaLaborHours:1,supportLaborHours:1,paidOrders:2,merchantPayoutBasis:'gross-before-tax'};
 for(const patch of [{paidOrders:2.5},{releaseAgeDays:1.5},{priceCurrency:'usd'},
  {priceCurrency:'U'},{marketingCohort:'   '},{merchantPayoutBasis:'  '},{store:'   '},
  {paidOrders:NaN},{platformFee:Infinity}]){
  const result=assessCrossStoreComparability({...a,...patch},{...a,...patch,store:'other-store'});
  assert.equal(result.comparisonReady,false,JSON.stringify(patch));
  assert.equal(result.causalStoreEffect,null);
 }
});

test('Two previously registered source-derived game comparisons preserve mismatches and noncausal release timing',()=>{
 const d=read('ontology/itch-io/crossstore-sales-comparability-2026.json'),s=read('specimens/itch-io.json'),p=read('plans/itch-io.json');
 const cases=d.recorded_cases;
 assert.equal(cases.length,6);
 for(const c of cases)assert(c.source_ids.every(id=>s.evidence.some(e=>e.id===id)));
 const m=cases.find(c=>c.id==='mixolumia'),c=cases.find(c=>c.id==='crumbling_world');
 assert.equal(m.days_from_itch_launch_until_steam_launch,114);
 assert.equal(m.self_reported.itch_io.paid_units+m.self_reported.steam.paid_units,2489);
 assert.equal(m.self_reported.itch_io.gross_usd+m.self_reported.steam.gross_usd,24108);
 assert.equal(m.self_reported.itch_io.bank_cash_received_usd+m.self_reported.steam.bank_cash_received_usd,18660);
 assert.equal(m.arithmetic.combined_figures_reconcile,true);
 assert.equal(m.matched_release_age,false);
 assert.equal(m.observed_incremental_sales_caused_by_steam,null);
 assert.equal(m.total_game_profit_usd,null);
 assert.equal(c.summed_disclosed_venue_paid_units,141);
 assert.equal(c.source_reported_combined_paid_units,141);
 assert.equal(c.summed_disclosed_venue_amounts_usd,1374.82);
 assert.equal(c.source_reported_total_receipts_usd,1380.82);
 assert.equal(c.source_total_minus_disclosed_store_amounts_usd,6);
 assert.equal(c.monetary_total_reconciles,false);
 assert.equal(c.gap_explanation_verified,null);
 assert.equal(c.refund_adjusted_itch_proceeds_usd,null);
 assert.equal(c.marketing_spend_allocated_by_store_usd,null);
 const t=p.detail_tasks.find(t=>t.id==='itch-io/competition/create-cross-platform-benchmarks');
 assert(t.percent>=97&&t.percent<=100);
 assert.equal(t.status,t.percent===100?'complete':'in_progress');
 assert.equal(p.total_tracked_tasks,244);
});

test('Zero-minimum donations and positive-price orders with no gross cash cannot enter paid-game benchmarks',()=>{
 const a={gameId:'fixture',edition:'v1',store:'itch',productType:'premium',priceCurrency:'USD',
  priceAmount:10,discountStatus:'none',priceWindowStartUTC:'2026-01-01T00:00:00Z',priceWindowEndUTC:'2026-01-31T00:00:00Z',
  releaseAgeDays:30,marketingCohort:'matched',grossReceipts:20,platformFee:2,processorFee:1,
  refunds:0,distributionLaborHours:1,qaLaborHours:1,supportLaborHours:1,paidOrders:2,
  merchantPayoutBasis:'gross-before-tax'};
 const pair=x=>assessCrossStoreComparability(x,{...x,store:'other-store'});
 assert.equal(pair(a).comparisonReady,true);
 for(const [fixture,reason] of [
  [{...a,priceAmount:0,paidOrders:0,grossReceipts:0},'positive minimum price required'],
  [{...a,priceAmount:0,paidOrders:1,grossReceipts:10},'positive minimum price required'],
  [{...a,paidOrders:1,grossReceipts:0},'positive paid orders require positive gross receipts'],
 ]){
  const result=pair(fixture);
  assert.equal(result.comparisonReady,false,reason);
  assert(result.issues.some(i=>i.includes(reason)),reason);
  assert.equal(result.observedIncrementalRevenue,null);
  assert.equal(result.representativePaidGameIncome,null);
 }
 assert.equal(pair({...a,priceAmount:0.01,paidOrders:0,grossReceipts:0}).comparisonReady,true);
 assert.equal(pair({...a,priceAmount:10,paidOrders:0,grossReceipts:0}).comparisonReady,true);
});
