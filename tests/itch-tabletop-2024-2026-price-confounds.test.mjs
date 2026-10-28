import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const file='ontology/itch-io/2024-2026-tabletop-receipts-and-listing-price-confounds.json';
test('Same publisher annual download reports retain currency, payment and cohort boundaries',()=>{
 const x=read(file),s=read('specimens/itch-io.json');
 assert.equal(x.frame.independent_publishers,3);
 assert.equal(x.frame.documented_public_posts,4);
 assert.equal(x.frame.probability_sample,false);
 assert.equal(x.frame.currency_years_identical_for_copper,false);
 assert(x.source_ids.every(id=>s.evidence.some(e=>e.id===id)));
 const [a,b,c]=x.annual_cases;
 assert.equal(a.reporting_year,2024);assert.equal(b.reporting_year,2025);
 assert.equal(a.itch_download_events,3022);assert.equal(b.itch_download_events,5440);
 assert.equal(x.calculations.copper_2024_to_2025_download_event_change,b.itch_download_events-a.itch_download_events);
 assert.equal(a.currency,'USD');assert.equal(b.currency,'GBP');
 assert.equal(a.itch_receipts_reported_after_platform_share,54.15);
 assert.equal(b.itch_receipts_reported_after_platform_share,118.26);
 assert.equal(b.positive_payment_count_itch,35);
 assert.equal(x.calculations.cross_currency_copper_receipts_growth_percent,null);
 assert.equal(x.calculations.copper_2025_35_payments_divided_by_5440_downloads_is_paid_checkout_conversion,false);
 const k=b.other_channels;
 assert.equal(Number((b.itch_receipts_reported_after_platform_share+k.convention_income_gbp+k.drive_thru_income_gbp).toFixed(2)),206.19);
 assert.equal(k.drive_thru_positive_payment_events,22);
 assert.equal(k.drive_thru_reported_purchase_events_including_zero_price,257);
 assert.equal(c.itch_receipts_reported_gbp,13);
 assert.equal(c.all_business_reported_profit_gbp,-1055);
 assert.equal(c.itch_specific_allocation_of_business_loss,null);
 assert.equal(x.calculations.plane_sailing_negative_whole_business_profit_is_itch_loss,false);
});
test('First-game zero sale during misconfigured donation pricing does not prove demand failure',()=>{
 const x=read(file),c=x.launch_case;
 assert.equal(c.reported_sales_as_of_post,0);
 assert.equal(c.creator_reported_listing_price_configuration_error,true);
 assert.equal(c.creator_reported_donation_prices_were_additive_not_tier_alternatives,true);
 assert.equal(c.intended_multiplayer_version_maximum_listed_price_usd,9.99);
 assert.equal(c.post_fix_positive_price_paid_orders,null);
 assert.equal(c.documented_pre_fix_price_charged_usd,null);
 assert.equal(c.actual_page_views,null);
 assert.equal(c.causal_conclusion_mispricing_was_sole_cause_of_zero_sales,false);
 assert(Object.values(x.unknown).every(v=>v===null));
});
test('Two pre-existing unfinished detail tasks receive bounded annual and payment evidence only',()=>{
 const p=read('plans/itch-io.json'),q=read('queues/itch-io.json');
 assert.equal(p.total_tracked_tasks,244);assert.equal(q.queues.flatMap(x=>x.tasks).length,84);
 assert.equal(p.detail_tasks.length,160);
 for(const [id,pct] of [['itch-io/market/estimate-paid-purchase-demand',71],['itch-io/risk/study-sales-volatility',94]]){
  const t=p.detail_tasks.find(t=>t.id===id);assert(t);
  assert(t.percent>=pct&&t.percent<100);assert.equal(t.status,'in_progress');
  for(const f of [file,'ontology/itch-io/2024-2026-tabletop-receipts-and-listing-price-confounds.md','tests/itch-tabletop-2024-2026-price-confounds.test.mjs'])assert(t.evidence.includes(f));
 }
});
