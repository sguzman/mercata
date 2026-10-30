import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {hypotheticalSteamRemittance} from '../site/steam-remittance-bridge.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const x=read('ontology/steam/steam-direct-history-and-bank-remittance-2026.json'),d=read('specimens/steam.json'),p=read('plans/steam.json'),q=read('queues/steam.json');
test('historical admission regimes and marginal rate cutoff are dated separately',()=>{
 assert.deepEqual(x.policy_timeline.map(z=>z.date),['2012-08-30','2017-06-06','2017-06-13','2018-10-01']);
 assert.equal(x.unknown.real_publisher_profit,null);
});
test('synthetic remittance separates withholding and bank charges from not-proven card fees',()=>{
 const a=hypotheticalSteamRemittance({gross_usd:1000,sales_tax_usd:100,returns_usd:100,chargebacks_usd:50,bank_fee_usd:10,assumed_partner_share:0.7,assumed_withholding_rate:0.1});
 assert.equal(a.adjusted_net_usd,750);
 assert.equal(a.assumed_partner_revenue_share_usd,525);
 assert.equal(a.assumed_withholding_usd,52.5);
 assert.equal(a.hypothetical_usd_after_bank_fees,462.5);
 assert.equal(a.additional_card_processing_fee_usd,null);
 assert.equal(a.actual_bank_deposit_usd,null);
 assert.equal(a.developer_profit_usd,null);
 assert.throws(()=>hypotheticalSteamRemittance({gross_usd:20,sales_tax_usd:50,returns_usd:0,chargebacks_usd:0,bank_fee_usd:0,assumed_partner_share:0.7,assumed_withholding_rate:0}),/Adjustments/);
 const valid={gross_usd:1000,sales_tax_usd:100,returns_usd:100,chargebacks_usd:50,
  bank_fee_usd:10,assumed_partner_share:0.7,assumed_withholding_rate:0.1};
 assert.throws(()=>hypotheticalSteamRemittance({...valid,account_number:'redacted'}),/permitted synthetic/);
 assert.throws(()=>hypotheticalSteamRemittance({...valid,actual_paid_units:100}),/permitted synthetic/);
 assert.throws(()=>hypotheticalSteamRemittance([1000,100,100,50,10,.7,.1]),/permitted synthetic/);
});
test('reporting payment method/fees are distinct from actual bank receipt',()=>{
 assert.equal(x.payment.payout_currency,'USD');
 assert.equal(x.payment.foreign_bank_method,'SWIFT_USD');
 assert.equal(x.payment.partner_paid_by_valve_wire_fee_usd,0);
 assert.equal(x.payment.bank_receiver_or_correspondent_fees_possible,true);
 assert.equal(x.unknown.actual_bank_wire_deduction,null);
});
test('all sources and claims attributable and total task count unchanged',()=>{
 const s=new Set(d.evidence.map(z=>z.id)),c=new Map(d.claims.map(z=>[z.id,z]));
 assert.equal(x.source_ids.length,5);assert.equal(x.claim_ids.length,17);
 for(const id of x.source_ids)assert(s.has(id),id);
 for(const id of x.claim_ids){assert(c.has(id),id);assert(c.get(id).source_ids.every(sid=>s.has(sid)));}
 const score=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(score.length,293);assert.equal(p.progress_percent,Math.round(score.reduce((a,b)=>a+b,0)/293));
});
