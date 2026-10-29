import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {evaluateHypotheticalAcquisition,describeUtmSpendPerAttributedEvent} from '../site/steam-acquisition-economics.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const x=read('ontology/steam/paid-acquisition-incrementality-and-unit-margin-2026.json'),d=read('specimens/steam.json'),p=read('plans/steam.json'),q=read('queues/steam.json');
test('Invented campaign demonstrates contribution shortfall and nonzero reserve correctly',()=>{
 const v=evaluateHypotheticalAcquisition(x.synthetic_only_example);
 assert.equal(v.unit_contribution_cents,600);
 assert.equal(v.total_incremental_contribution_cents,6000);
 assert.equal(v.total_campaign_cost_cents,7000);
 assert.equal(v.simulated_after_campaign_contribution_cents,-1000);
 assert.equal(v.max_ad_spend_cents_under_profit_reserve,1000);
 assert.equal(v.minimum_incremental_orders_required,14);
 assert.equal(v.campaign_meets_assumed_profit_reserve,false);
 assert.equal(v.observed_partner_profit,null);
});
test('Paid event attribution never becomes verified incremental CAC',()=>{
 const r=describeUtmSpendPerAttributedEvent({spend_cents:3000,utm_attributed_purchase_events:10});
 assert.equal(r.spend_per_attributed_event_cents,300);
 assert.equal(r.true_cost_per_incremental_paid_customer_cents,null);
 assert.equal(r.verified_unique_paid_buyers,null);
 assert.equal(r.causal_return_on_ad_spend,null);
 assert.equal(describeUtmSpendPerAttributedEvent({spend_cents:10,utm_attributed_purchase_events:0}).spend_per_attributed_event_cents,null);
});
test('Zero or negative contribution and invalid counts cannot silently claim viability',()=>{
 const common={assumed_incremental_paid_orders:1,assumed_net_partner_receipt_per_order_cents:300,variable_support_per_order_cents:400,other_variable_cost_per_order_cents:0,ad_spend_cents:0,fixed_creative_cost_cents:100,required_profit_reserve_cents:0};
 const v=evaluateHypotheticalAcquisition(common);
 assert.equal(v.unit_contribution_cents,-100);
 assert.equal(v.minimum_incremental_orders_required,null);
 assert.equal(v.campaign_meets_assumed_profit_reserve,false);
 assert.throws(()=>evaluateHypotheticalAcquisition({...common,ad_spend_cents:-1}),/nonnegative/);
 assert.throws(()=>evaluateHypotheticalAcquisition({...common,assumed_incremental_paid_orders:Number.MAX_SAFE_INTEGER}),/overflow/);
});
test('The official sources and bounded claims exist without changing 293 tasks',()=>{
 const ss=new Set(d.evidence.map(s=>s.id)),cs=new Map(d.claims.map(c=>[c.id,c]));
 assert.equal(x.source_ids.length,4);assert.equal(x.claim_ids.length,6);
 for(const id of x.source_ids)assert(ss.has(id),id);
 for(const id of x.claim_ids){assert(cs.has(id),id);assert(cs.get(id).source_ids.every(s=>ss.has(s)));}
 const vs=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(vs.length,293);
 assert.equal(p.progress_percent,Math.round(vs.reduce((a,b)=>a+b,0)/293));
 assert(Object.values(x.unknown).every(x=>x===null));
 assert.equal(x.no_spend,true);
});
