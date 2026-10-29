import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {summarizeSyntheticMtxLatestStatuses} from '../site/steam-mtx-status-guards.mjs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const study=get('ontology/steam/in-game-transaction-fraud-and-account-boundaries-2026.json'),d=get('specimens/steam.json'),p=get('plans/steam.json'),q=get('queues/steam.json');
test('Approved, reversed and partial in-game purchases are not final paid base-game orders',()=>{
 const x=summarizeSyntheticMtxLatestStatuses(study.hypothetical.status_sequence.map((latest_status,i)=>({fixture_id:'fixture-'+i,latest_status})));
 assert.equal(x.currently_succeeded,1);
 assert.equal(x.approved_but_not_final,1);
 assert.equal(x.current_reversed_or_partial,5);
 assert.equal(x.partial_refunds_requiring_item_status,1);
 assert.equal(x.merchant_net_revenue_usd,null);
 assert.equal(x.partner_bank_payment_held,null);
 assert.equal(x.real_steam_base_game_orders,null);
});
test('No real identifiers, duplicate records or unsupported statuses allowed',()=>{
 assert.throws(()=>summarizeSyntheticMtxLatestStatuses([{fixture_id:'real_user_123',latest_status:'Succeeded'}]),/Only synthetic/);
 assert.throws(()=>summarizeSyntheticMtxLatestStatuses([{fixture_id:'fixture-a',latest_status:'Succeeded'},{fixture_id:'fixture-a',latest_status:'Chargedback'}]),/Duplicate/);
 assert.throws(()=>summarizeSyntheticMtxLatestStatuses([{fixture_id:'fixture-a',latest_status:'SomeOtherState'}]),/Unknown/);
 const x=summarizeSyntheticMtxLatestStatuses([]);
 assert.equal(x.total_status_records,0);
 assert.equal(x.actual_chargeback_rate,null);
});
test('Consumer payment restrictions are not bank remittance restrictions',()=>{
 assert.equal(study.customer_locked_means_publisher_payout_held,false);
 assert.equal(study.transaction_error_codes.consumer_billing_agreement_hold_due_to_dispute,14);
 assert.equal(study.transaction_error_codes.denied_by_fraud_detection,104);
 assert.equal(study.unknown.partner_payment_hold_duration,null);
 assert.equal(study.no_account_data,true);
 assert.equal(study.no_partner_api_calls,true);
});
test('New claims have public attributable sources and fixed Steam task count',()=>{
 const sources=new Set(d.evidence.map(x=>x.id)),claims=new Map(d.claims.map(c=>[c.id,c]));
 assert.equal(study.source_ids.length,3);assert.equal(study.claim_ids.length,18);
 for(const id of study.source_ids)assert(sources.has(id),id);
 for(const id of study.claim_ids){const c=claims.get(id);assert(c,id);assert(c.source_ids.every(s=>sources.has(s)));}
 const scores=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(scores.length,293);assert.equal(p.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
});
