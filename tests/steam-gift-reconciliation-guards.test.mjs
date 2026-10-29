import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {auditSyntheticSteamGiftEvents as audit} from '../site/steam-gift-reconciliation-guards.mjs';
const load=path=>JSON.parse(fs.readFileSync(new URL('../'+path,import.meta.url),'utf8'));
const x=load('ontology/steam/steam-gift-checkout-redemption-refund-and-license-units-2026.json'),d=load('specimens/steam.json'),p=load('plans/steam.json'),q=load('queues/steam.json');
const rows=x.hypothetical_lifecycle_states.map((latest_state,i)=>({fixture_id:'fixture-'+i,latest_state}));
test('Gift purchases count as historical checkouts, not purchases again upon redemption',()=>{
 const a=audit(rows);
 assert.equal(a.synthetic_distinct_event_records,10);
 assert.equal(a.historical_paid_game_checkout_events_in_fixture,7);
 assert.equal(a.currently_reported_refunded_game_checkout_events,4);
 assert.equal(a.not_yet_refunded_game_checkout_events,3);
 assert.equal(a.pending_gift_checkout_events,1);
 assert.equal(a.accepted_unreversed_gift_license_events,1);
 assert.equal(a.accepted_reversed_gift_events,1);
 assert.equal(a.gift_acceptance_creates_another_paid_order,false);
 assert.equal(a.pending_implies_final_net_retained_sale,false);
});
test('Keys, free licenses and wallet gift cards never become store base-game checkouts',()=>{
 const a=audit(rows);
 assert.equal(a.external_key_activations_not_store_checkouts,1);
 assert.equal(a.free_licenses_not_store_checkouts,1);
 assert.equal(a.wallet_funding_not_game_checkouts,1);
 for(const k of ['unique_real_customers','actual_game_units_sold','actual_gift_refund_rate','actual_merchant_revenue_usd','actual_developer_profit_usd'])assert.equal(a[k],null,k);
 assert.equal(x.unit_rules.bundle_product_rows_may_exceed_distinct_basket_purchases,true);
});
test('No real-looking identifiers, duplicate units or invented states accepted',()=>{
 assert.throws(()=>audit([{}]),/synthetic/);
 assert.throws(()=>audit([{fixture_id:'user-1',latest_state:'gift_paid_accepted'}]),/synthetic/);
 assert.throws(()=>audit([{fixture_id:'fixture-a',latest_state:'gift_paid_accepted'},{fixture_id:'fixture-a',latest_state:'gift_paid_expired_refunded'}]),/Duplicate/);
 assert.throws(()=>audit([{fixture_id:'fixture-a',latest_state:'gift_paid_paid_twice'}]),/Unsupported/);
 assert.equal(audit([]).historical_paid_game_checkout_events_in_fixture,0);
});
test('Gift acceptance, cancellation and refund rules remain explicitly separate',()=>{
 assert.equal(x.scope.delivered_gift_acceptance_days,30);
 assert.equal(x.scope.gift_can_be_scheduled_up_to_months,12);
 assert.equal(x.scope.redeemed_gift_refund_requires_recipient_consent,true);
 assert.equal(x.unit_rules.gift_acceptance_is_separate_checkout,false);
 assert(Object.values(x.unknown).every(v=>v===null));
});
test('Official source-linked findings retain fixed 293 task inventory',()=>{
 const sources=new Set(d.evidence.map(e=>e.id)),claims=new Map(d.claims.map(c=>[c.id,c]));
 assert.equal(x.source_ids.length,5);assert.equal(x.claim_ids.length,15);
 for(const id of x.source_ids)assert(sources.has(id),id);
 for(const id of x.claim_ids){assert(claims.has(id),id);assert(claims.get(id).source_ids.every(s=>sources.has(s)),id);}
 const scores=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(scores.length,293);assert.equal(p.progress_percent,Math.round(scores.reduce((n,s)=>n+s,0)/293));
 assert(p.detail_tasks.find(t=>t.id==='steam/sales/study-gift-purchases-and-redemption').evidence.includes('ontology/steam/steam-gift-checkout-redemption-refund-and-license-units-2026.json'));
});
