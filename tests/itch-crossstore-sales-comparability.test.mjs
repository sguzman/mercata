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
