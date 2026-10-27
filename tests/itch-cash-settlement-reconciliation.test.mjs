import test from 'node:test';
import assert from 'node:assert/strict';import fs from 'node:fs';
import {modelSellerSettlement} from '../site/itch-cash-settlement-reconciliation.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Synthetic refundable orders and separately withheld payout cash do not double deduct money',()=>{
 const d=read('ontology/itch-io/merchant-cash-settlement-reconciliation-2026.json'),s=read('specimens/itch-io.json'),q=read('queues/itch-io.json'),p=read('plans/itch-io.json');
 const sources=new Set(s.evidence.map(x=>x.id));assert(d.source_ids.every(id=>sources.has(id)));
 const x=modelSellerSettlement(d.example_inputs);
 assert.equal(x.transactionResult.retainedPaidOrders,7);
 assert.equal(x.transactionResult.retainedGrossCents,7000);
 assert.equal(x.transactionResult.platformFeesCents,700);
 assert.equal(x.transactionResult.processorFeesNetCents,590);
 assert.equal(x.transactionResult.chargebackFeesCents,1500);
 assert.equal(x.transactionResult.pretaxCashAfterTransactionAndPayoutCostsCents,4210);
 assert.equal(x.unreservedNetBalanceCents,3610);
 assert.equal(x.couldRequestCollectedPayout,true);
 assert.equal(x.realBankTransferCents,null);
 assert.equal(x.sourcePopulationObserved,false);
 assert.throws(()=>modelSellerSettlement({...d.example_inputs,reserveHeldCents:9000}),RangeError);
 assert.throws(()=>modelSellerSettlement({...d.example_inputs,transactions:{...d.example_inputs.transactions,fullyRefundedOrders:10}}),RangeError);
 const direct=modelSellerSettlement({...d.example_inputs,paymentMode:'direct_to_you',review:null});
 assert.equal(direct.collectedPayoutReview,null);
 assert.equal(direct.couldRequestCollectedPayout,null);
 assert.equal(direct.automaticDirectBankSettlementClaimed,false);
 assert(Object.values(d.unknown).every(x=>x===null));
 for(const id of ['economics/threshold','sales/refund']){
  const t=q.queues.flatMap(x=>x.tasks).find(t=>t.id===id);assert.equal(t.progress,100,id);assert.equal(t.status,'complete',id);
  assert(t.evidence.includes('ontology/itch-io/merchant-cash-settlement-reconciliation-2026.json'));
 }
 for(const id of ['itch-io/economics/trace-gross-to-net-payout','itch-io/economics/audit-refunds-and-disputes']){
  const t=p.detail_tasks.find(t=>t.id===id);assert.equal(t.percent,100,id);assert.equal(t.status,'complete',id);
  for(const f of ['site/itch-cash-settlement-reconciliation.mjs','ontology/itch-io/merchant-cash-settlement-reconciliation-2026.json','ontology/itch-io/merchant-cash-settlement-reconciliation-2026.md','tests/itch-cash-settlement-reconciliation.test.mjs'])assert(t.evidence.includes(f));
 }
 assert.equal(p.total_tracked_tasks,244);assert.equal(p.detail_tasks.length,160);
});
