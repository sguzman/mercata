import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const file="ontology/itch-io/zero-sales-snapshot-window-comparability-2017-2026.json";const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Five selected titles have distinct zero checkpoint definitions, not a common seller cohort',()=>{
 const x=get(file),d=get('specimens/itch-io.json');assert.equal(x.distinct_named_games,5);assert.equal(x.observations.length,5);
 assert(x.source_ids.every(id=>d.evidence.some(e=>e.id===id)));
 assert.equal(x.all_365_day_exact_windows,false);assert.equal(x.representative_merchant_population,false);
 assert.equal(x.unknown.verified_zero_earner_fraction,null);assert(Object.values(x.unknown).every(v=>v===null));
 assert.equal(x.interpretation.zero_is_tied_to_a_title_route_and_report_date,true);
 assert.equal(x.interpretation.one_year_fumes_statement_is_exact_365_day_merchant_ledger,false);
 assert.equal(x.interpretation.selected_zero_cases_can_be_averaged_to_infer_platform_rate,false);
});
test('FUMES is a named 2D paid year-zero report, never zero lifetime without evidence',()=>{
 const x=get(file),d=get('specimens/itch-io.json'),o=x.observations[0];
 assert.equal(o.game,'FUMES: PvP dogfighting');assert.equal(o.reported_sales,0);
 assert.equal(o.exact_days_since_release,null);assert.equal(o.later_orders_verified,null);
 assert.equal(o.minimum_price_at_anniversary_usd,1);assert.equal(o.minimum_price_at_2026_10_review_usd,2);
 assert.equal(o.current_public_ratings,1);assert.equal(x.interpretation.one_public_rating_proves_a_paid_order,false);
 assert.equal(d.evidence.find(e=>e.id==='fumes-2026-june-one-year-zero-paid-sales').published_at,'2026-06-26');
 assert.equal(d.evidence.find(e=>e.id==='fumes-2026-june-anniversary-price-one-dollar').published_at,'2026-06-24');
 assert.equal(d.evidence.find(e=>e.id==='fumes-2026-october-positive-price-2d-store-page').published_at,null);
});
test('Checkout friction, cross-store counterexamples and nonpermanent day-one zeros remain separate',()=>{
 const x=get(file),[f,n,a,w,s]=x.observations;
 assert.equal(n.reported_sales,0);assert.equal(n.reported_listing_impressions_approx,700);
 assert.equal(a.reported_sales,0);assert.equal(a.individual_game_stripe_checkout_connected,false);
 assert.equal(w.reported_itch_sales,0);assert.equal(w.reported_steam_sales_net_refunds,47);
 assert.equal(s.reported_itch_launch_day_sales,0);assert.equal(s.reported_later_paid_copy_count_to_approx,40);
 assert.equal(s.complete_after_fee_after_labor_profit,null);
 assert.equal(x.interpretation.undelivered_checkout_must_not_be_converted_to_negative_demand_evidence,true);
 assert.equal(x.interpretation.zero_on_itch_means_zero_on_all_stores,false);
 assert.equal(x.interpretation.zero_on_release_day_proves_zero_lifetime,false);
});
test('Previously undated original devlog records acquire documented exact publication dates',()=>{
 const d=get('specimens/itch-io.json');assert.equal(d.evidence.find(e=>e.id==='srrt-developer-postmortem-2021').published_at,'2021-09-22');
 assert.equal(d.evidence.find(e=>e.id==='itch-case-exodrifter').published_at,'2021-10-02');
});
test('Long-tail task adds bounded record while original 244 tasks are unchanged',()=>{
 const p=get('plans/itch-io.json'),q=get('queues/itch-io.json');
 const t=p.detail_tasks.find(x=>x.id==='itch-io/sales/measure-long-tail-income');assert(t&&t.percent>=99&&t.percent<100&&t.status==='in_progress');
 for(const f of [file,"ontology/itch-io/zero-sales-snapshot-window-comparability-2017-2026.md","tests/itch-zero-sales-snapshot-window-comparability.test.mjs"])assert(t.evidence.includes(f));
 assert.equal(p.detail_tasks.length,160);assert.equal(q.queues.flatMap(w=>w.tasks).length,84);
});
