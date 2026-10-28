import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {auditVoluntaryPaymentDenominators} from '../site/itch-voluntary-payment-denominators.mjs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));

test('Selected public payment disclosures retain cross-store event and free-game distinctions',()=>{
 const x=get('ontology/itch-io/pwyw-horror-and-demo-donation-denominators-2026.json'),d=get('specimens/itch-io.json');
 assert.equal(x.source_ids.length,6);assert.equal(x.claim_ids.length,11);
 assert(x.source_ids.every(id=>d.evidence.some(e=>e.id===id)));
 assert(x.claim_ids.every(id=>d.claims.some(c=>c.id===id)));
 assert.equal(x.samples[0].claimed_usd_received,2);
 assert.equal(x.samples[0].access_mode,'free_pwyw');
 assert.equal(x.samples[1].claimed_usd_received,38);
 assert.equal(x.samples[1].download_events_approximately,20000);
 assert.deepEqual(x.samples[1].download_platforms,['Steam','itch.io']);
 assert.equal(x.samples[2].independent_commenter_historical_creator_account_usd_approximately,500);
 assert.equal(x.derived.first_dollar_thread_zero_earners_as_current_population_estimate,false);
 assert(Object.values(x.unknown).every(v=>v===null));
});

test('Audit prevents cross-platform downloads and optional receipts from being called paid conversion',()=>{
 const a=auditVoluntaryPaymentDenominators({accessMode:'free_demo_pwyw',reportedUsd:38,downloadEvents:20000,downloadPlatforms:['Steam','itch.io'],receiptPlatform:'itch.io',paidOrderCount:null,matchedWindow:false});
 assert.equal(a.claimedUsd,38);
 assert.equal(a.invalidForPaidGameDemand,true);assert.equal(a.singleStoreDownloadScope,false);
 assert.equal(a.invalidForDownloadToPaymentConversion,true);assert.equal(a.purchaseConversion,null);
 assert.equal(a.verifiedMandatoryPricePaidOrders,null);assert.equal(a.netSellerProfit,null);
 const b=auditVoluntaryPaymentDenominators({accessMode:'free_pwyw',reportedUsd:2,downloadPlatforms:['itch.io'],paidOrderCount:1,matchedWindow:true});
 assert.equal(b.verifiedMandatoryPricePaidOrders,null);
 assert.equal(b.purchaseConversion,null);
});

test('Even mandatory-price orders cannot be converted from raw download events to unique customer conversion',()=>{
 const a=auditVoluntaryPaymentDenominators({accessMode:'mandatory_positive_price',reportedUsd:12,downloadEvents:30,downloadPlatforms:['itch.io'],paidOrderCount:2,matchedWindow:true});
 assert.equal(a.verifiedMandatoryPricePaidOrders,2);assert.equal(a.purchaseConversion,null);
 for(const invalid of [
 {accessMode:'free_pwyw',reportedUsd:-1,downloadPlatforms:['itch.io']},
 {accessMode:'unknown',reportedUsd:2,downloadPlatforms:['itch.io']},
 {accessMode:'free_pwyw',reportedUsd:2,downloadEvents:-4,downloadPlatforms:['itch.io']},
 {accessMode:'free_pwyw',reportedUsd:2,downloadEvents:1.5,downloadPlatforms:['itch.io']},
 {accessMode:'free_pwyw',reportedUsd:2,downloadPlatforms:['itch.io','itch.io']},
 {accessMode:'free_pwyw',reportedUsd:2,downloadPlatforms:[]},
 {accessMode:'free_pwyw',reportedUsd:2,downloadPlatforms:['itch.io'],paidOrderCount:-1}
 ])assert.throws(()=>auditVoluntaryPaymentDenominators(invalid),TypeError);
});

test('Existing 244-task universe remains fixed while one nonterminal sales task advances',()=>{
 const p=get('plans/itch-io.json'),q=get('queues/itch-io.json');
 assert.equal(p.detail_tasks.length,160);
 assert.equal(q.queues.flatMap(w=>w.tasks).length,84);
 const t=p.detail_tasks.find(x=>x.id==='itch-io/sales/study-browser-play-conversion');
 assert.equal(t.percent,74);assert.equal(t.status,'in_progress');
 for(const path of ['ontology/itch-io/pwyw-horror-and-demo-donation-denominators-2026.json','ontology/itch-io/pwyw-horror-and-demo-donation-denominators-2026.md','site/itch-voluntary-payment-denominators.mjs','tests/itch-voluntary-payment-denominators.test.mjs'])assert(t.evidence.includes(path));
});
