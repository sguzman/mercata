import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {assessFirstPublisherEffort,commonStages,extraStages} from '../site/itch-first-publisher-effort.mjs';
const load=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Only fully entered work records produce monetary and time totals',()=>{
 const incomplete=assessFirstPublisherEffort({mode:'free'});
 assert.equal(incomplete.measuredInputCoverageComplete,false);
 assert.equal(incomplete.personHours,null);
 assert.equal(incomplete.externalUpfrontCashUsd,null);
 assert.equal(incomplete.typicalSetupHours,null);
 const steps=commonStages.map(stage=>({stage,minutes:20,externalCashUsd:0}));
 const ok=assessFirstPublisherEffort({mode:'free',records:steps,hourlyValueUsd:18,readiness:{
  termsAccepted:true,distributionRightsVerified:true,gameTested:true,pageAccessible:true
 }});
 assert.equal(ok.personHours,2);
 assert.equal(ok.combinedCostsUsd,36);
 assert.equal(ok.readyAccordingToInputs,true);
 assert.equal(ok.firstTimeSellerSuccessRate,null);
 const collected=assessFirstPublisherEffort({mode:'collected',records:[...commonStages,...extraStages.collected].map(stage=>({stage,minutes:0,externalCashUsd:0}))});
 assert.equal(collected.conditionalCollectedPayoutAccountAdjustmentUsd,3);
 assert.equal(collected.externalUpfrontCashUsd,0);
 assert.equal(collected.conditionalAdjustmentIsAnUpfrontListingFee,false);
 assert.equal(collected.readyAccordingToInputs,false);
 assert.throws(()=>assessFirstPublisherEffort({mode:'free',records:[{stage:'account_security',minutes:-1,externalCashUsd:0}]}),TypeError);
 assert.throws(()=>assessFirstPublisherEffort({mode:'free',records:[{stage:'account_security',minutes:0,externalCashUsd:0},{stage:'account_security',minutes:0,externalCashUsd:0}]}),TypeError);
});
test('Official policy frame closes documentation tasks without claiming global provider eligibility',()=>{
 const d=load('ontology/itch-io/first-publisher-effort-and-eligibility-2026.json'),s=load('specimens/itch-io.json'),q=load('queues/itch-io.json'),p=load('plans/itch-io.json');
 const sources=new Set(s.evidence.map(x=>x.id));assert(d.source_ids.every(id=>sources.has(id)));
 assert(d.requirements.every(x=>x.source_ids.every(id=>sources.has(id))&&x.observed_labor_minutes===null));
 assert.equal(d.unlisted_country_case.itch_io_direct_Stripe_eligibility_verified,null);
 assert.equal(d.assumptions.first_time_publisher_typical_setup_hours,null);
 assert.equal(d.assumptions.real_first_sale,null);
 assert.equal(d.mode_differences.collected.adjustment_not_upfront_listing_fee,true);
 for(const id of ['access/friction']){
  const task=q.queues.flatMap(x=>x.tasks).find(t=>t.id===id);
  assert.equal(task.progress,100);assert.equal(task.status,'complete');
  for(const file of ['ontology/itch-io/first-publisher-effort-and-eligibility-2026.json','ontology/itch-io/first-publisher-effort-and-eligibility-2026.md','site/itch-first-publisher-effort.mjs','tests/itch-first-publisher-effort.test.mjs'])assert(task.evidence.includes(file));
 }
 for(const id of ['itch-io/access/measure-minimum-setup-burden','itch-io/access/verify-paid-seller-eligibility','itch-io/access/compare-payment-account-routes']){
  const task=p.detail_tasks.find(t=>t.id===id);
  assert.equal(task.percent,100,id);assert.equal(task.status,'complete',id);
  for(const file of ['ontology/itch-io/first-publisher-effort-and-eligibility-2026.json','ontology/itch-io/first-publisher-effort-and-eligibility-2026.md','site/itch-first-publisher-effort.mjs','tests/itch-first-publisher-effort.test.mjs'])assert(task.evidence.includes(file));
 }
 assert.equal(p.detail_tasks.find(t=>t.id==='itch-io/access/map-seller-countries').percent,100);
 assert.equal(p.total_tracked_tasks,244);assert.equal(p.detail_tasks.length,160);
 assert.equal(p.progress_percent,Math.round((q.queues.flatMap(x=>x.tasks).reduce((a,t)=>a+t.progress,0)+p.detail_tasks.reduce((a,t)=>a+t.percent,0))/244));
});
