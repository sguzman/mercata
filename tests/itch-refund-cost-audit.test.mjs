import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {reconcileFullRefundChargebackCase} from '../site/itch-refund-cost-audit.mjs';
const load=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const row=load('ontology/itch-io/refund-chargeback-unit-cost-2026.json').examples[0];
test('Full refund + dispute sensitivity keeps captured orders separate from retained units',()=>{
 const x=reconcileFullRefundChargebackCase(row);
 assert.equal(x.capturedOrders,10);assert.equal(x.retainedPaidOrders,7);
 assert.equal(x.retainedGrossCents,7000);assert.equal(x.platformFeesCents,700);
 assert.equal(x.processorFeesNetCents,590);assert.equal(x.chargebackFeesCents,1500);
 assert.equal(x.pretaxCashAfterTransactionAndPayoutCostsCents,4210);
 assert.equal(x.sellerPopulationMedianIncome,null);assert.equal(x.representativeRefundRate,null);
});
test('Refund model rejects incomplete, fractional, overlapping or invented negative counts',()=>{
 for(const override of [{capturedOrders:1},{fullyRefundedOrders:-1},{chargebackOrders:0.2},{priceCents:10.5},{processingRefundCreditCentsPerFullyRefundedOrder:60}])
  assert.throws(()=>reconcileFullRefundChargebackCase({...row,...override}));
 assert.throws(()=>reconcileFullRefundChargebackCase({...row,merchantPayoutAndFxFeesCents:undefined}));
});
test('Synthetic reversal model uses existing official sources without pretending observed refunds',()=>{
 const model=load('ontology/itch-io/refund-chargeback-unit-cost-2026.json');
 const d=load('specimens/itch-io.json');
 assert(model.source_ids.every(id=>d.evidence.some(x=>x.id===id)));
 assert.equal(model.verified_market_refund_rate,null);
 assert.equal(model.typical_provider_dispute_fee,null);
});
