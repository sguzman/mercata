import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {classifySyntheticSteamCashDisposition as classify} from '../site/steam-payout-disposition-guards.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const x=read('ontology/steam/steam-publisher-payment-exception-and-revenue-hold-boundaries-2026.json'),d=read('specimens/steam.json'),p=read('plans/steam.json'),q=read('queues/steam.json');
test('Payment conditions cannot establish zero game sales or developer income',()=>{
 const a=classify([{fixture_id:'fixture-a',reason:'subminimum_payment_balance'},{fixture_id:'fixture-b',reason:'voluntary_partner_threshold'},{fixture_id:'fixture-c',reason:'charged_back_or_fraudulent_direct_fee'}]);
 assert.equal(a.scenario_count,3);
 assert.equal(a.actual_zero_paid_sale_fraction,null);
 assert.equal(a.reported_partner_income_median_usd,null);
 assert.equal(a.no_sale_inference_from_absent_bank_payment,false);
 for(const c of a.scenarios){assert.equal(c.actual_order_count,null);assert.equal(c.actual_payment_deferred,null);assert.equal(c.actual_zero_paid_sales,null);}
 assert.equal(a.scenarios[0].is_punitive_enforcement,false);
 assert.equal(a.scenarios[1].is_punitive_enforcement,false);
 assert.equal(a.scenarios[2].is_punitive_enforcement,null);
});
test('Release, settlement, fraud and access risks are separate official conditions',()=>{
 assert.equal(x.conditions.bank_tax_unverified.release_blocked,true);
 assert.equal(x.conditions.tax_verification_pending.guaranteed_max_days,null);
 assert.deepEqual(x.conditions.tax_verification_pending.public_estimated_business_days,[2,7]);
 assert.equal(x.conditions.late_bank_update.always_delayed,false);
 assert.equal(x.conditions.returned_bank_transfer.off_cycle_reissue_supported,false);
 assert.equal(x.conditions.charged_back_or_fraudulent_direct_fee.actual_case_proven,false);
 assert.equal(x.conditions.sanctioned_counterparty.individual_status_checked,false);
 assert.equal(x.conditions.missing_payment_with_valid_details.formal_appeal_established,false);
 assert.equal(x.payment_reporting.no_deposit_is_not_zero_sales,true);
 assert(Object.values(x.unknown).every(v=>v===null));
});
test('The classifier rejects real-looking IDs, duplicates and unsupported payout states',()=>{
 assert.throws(()=>classify({}),/Expected synthetic/);
 assert.throws(()=>classify([{fixture_id:'account-123',reason:'returned_bank_transfer'}]),/synthetic fixture/);
 assert.throws(()=>classify([{fixture_id:'fixture-a',reason:'returned_bank_transfer'},{fixture_id:'fixture-a',reason:'late_bank_update'}]),/Duplicate/);
 assert.throws(()=>classify([{fixture_id:'fixture-a',reason:'account_terminated'}]),/Unknown/);
 assert.equal(classify([]).scenario_count,0);
});
test('All claims and sources resolve while original research tasks and published progress remain intact',()=>{
 const s=new Set(d.evidence.map(v=>v.id)),c=new Map(d.claims.map(v=>[v.id,v]));
 assert.equal(x.source_ids.length,4);assert.equal(x.claim_ids.length,12);
 for(const id of x.source_ids)assert(s.has(id),id);
 for(const id of x.claim_ids){assert(c.has(id),id);assert(c.get(id).source_ids.every(v=>s.has(v)),id);}
 const scores=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(scores.length,293);assert.equal(p.progress_percent,Math.round(scores.reduce((sum,n)=>sum+n,0)/293));
 const item=p.detail_tasks.find(t=>t.id==='steam/risk/investigate-account-restrictions-and-revenue-holds');
 assert(item.evidence.includes('ontology/steam/steam-publisher-payment-exception-and-revenue-hold-boundaries-2026.json'));
 assert(item.percent<100);
});
