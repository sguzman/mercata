import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const load=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const cents=x=>Math.round(x*100);
test('2024 mixed-format merchant self-report reconciles two physical and digital-and-tips lines to gross and event totals',()=>{
 const a=load('ontology/itch-io/mixed-physical-digital-payment-ledger-2024.json'),s=load('specimens/itch-io.json');
 assert(a.source_ids.every(id=>s.evidence.some(e=>e.id===id)));
 const rows=a.per_title_report_2024,r=a.arithmetic_reconciliation,sum=(key)=>rows.reduce((n,x)=>n+x[key],0);
 assert.equal(sum('physical_payment_events'),108);
 assert.equal(cents(sum('physical_gross_usd')),440500);
 assert.equal(sum('digital_and_tips_payment_events'),86);
 assert.equal(cents(sum('digital_and_tips_gross_usd')),194930);
 assert(rows.every(x=>cents(x.physical_gross_usd+x.digital_and_tips_gross_usd)===cents(x.title_total_gross_usd)));
 assert(rows.every(x=>x.physical_payment_events+x.digital_and_tips_payment_events===x.title_total_payment_events));
 assert.equal(cents(sum('title_total_gross_usd')+r.other_unclassified_itch_gross_usd),cents(a.itch_account_report_2024.gross_usd));
 assert.equal(sum('title_total_payment_events')+r.other_unclassified_itch_payment_events,a.itch_account_report_2024.payment_events);
 assert.equal(r.selected_title_physical_payment_events,108);
 assert.equal(r.selected_title_physical_gross_usd,4405);
 assert.equal(Number((4405/8026.85*100).toFixed(2)),r.disclosed_physical_share_of_full_reported_itch_gross_percent_approx);
 assert.equal(Number((108/358*100).toFixed(2)),r.disclosed_physical_share_of_full_reported_itch_payment_events_percent_approx);
 assert.equal(r.digital_and_tips_are_verified_mandatory_paid_game_orders,false);
 assert.equal(r.physical_share_is_lower_bound_if_other_itch_items_may_be_physical,true);
 assert.equal(a.itch_account_report_2024.after_fee_value_is_bank_settled_cash_verified,false);
 assert(Object.values(a.unknown).every(v=>v===null));
});
test('Historical cross-year reporting does not manufacture stable game-income growth',()=>{
 const a=load('ontology/itch-io/mixed-physical-digital-payment-ledger-2024.json'),p=load('plans/itch-io.json'),q=load('queues/itch-io.json');
 assert.equal(a.cross_year.same_product_inventory_and_allocation_bases_verified,false);
 assert.equal(a.cross_year.matching_2023_2024_sales_mix_income_growth_usd,null);
 assert.equal(a.cross_year.matching_2023_2024_digital_only_growth_percent,null);
 assert.equal(a.cross_year.seasonal_monthly_revenue_volatility,null);
 assert.equal(a.all_channel_2024_context.profit_is_itch_only,false);
 for(const id of ['itch-io/risk/study-sales-volatility']){
  const task=p.detail_tasks.find(t=>t.id===id);
  assert(task.status==='in_progress'&&task.percent===89);
  for(const path of ['ontology/itch-io/mixed-physical-digital-payment-ledger-2024.json','ontology/itch-io/mixed-physical-digital-payment-ledger-2024.md','tests/itch-mixed-physical-digital-payment-ledger.test.mjs'])assert(task.evidence.includes(path));
 }
 const market=q.queues.flatMap(x=>x.tasks).find(t=>t.id==='market/volume');
 assert(market.status==='in_progress'&&market.progress===90);
 for(const path of ['ontology/itch-io/mixed-physical-digital-payment-ledger-2024.json','ontology/itch-io/mixed-physical-digital-payment-ledger-2024.md','tests/itch-mixed-physical-digital-payment-ledger.test.mjs'])assert(market.evidence.includes(path));
 assert.equal(p.total_tracked_tasks,244);
 assert.equal(p.detail_tasks.length,160);
 assert.equal(q.queues.flatMap(x=>x.tasks).length,84);
});
