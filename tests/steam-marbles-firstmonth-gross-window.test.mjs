import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const x=read('ontology/steam/steam-marbles-firstmonth-gross-and-discovery-2026.json');
test('Paid launch and a postmortem 37 days later are not a verified exact thirty-day ledger',()=>{
 assert.equal(x.release.app_id,4137920);
 assert.equal(x.release.first_paid_release_date,'2026-01-07');
 const a=x.developer_self_report;
 assert.equal(a.publication_date,'2026-02-13');
 assert.equal((Date.parse(a.publication_date+'T00:00:00Z')-Date.parse(x.release.first_paid_release_date+'T00:00:00Z'))/86400000,37);
 assert.equal(a.release_to_post_elapsed_calendar_days,37);
 assert.equal(a.reported_outcome_window_label,'first_month');
 assert.equal(a.exact_30_day_end_date_authenticated,false);
 assert.equal(x.unknown.exact_sold_unit_timecut,null);
});
test('An author gross label, short development and approximate returns do not identify developer income',()=>{
 const a=x.developer_self_report;
 assert.equal(a.approximate_units_reported,4300);
 assert.equal(a.reported_gross_usd_more_than,30000);
 assert.equal(a.reported_refund_rate_percent_approx,6.5);
 assert.equal(a.refund_units_denominator_verified,false);
 assert.equal(a.reported_development_elapsed_months_upper_exclusive,2);
 assert.equal(x.release.publisher_legal_agreement_verified,false);
 assert.equal(x.unknown.platform_after_fee_remittance,null);
 assert.equal(x.unknown.personal_income_after_costs,null);
});
test('Late wishlist and discovery impressions do not identify matched buyers or causal traffic',()=>{
 const a=x.developer_self_report;
 assert.equal(a.prelaunch_wishlist_stock_approx,5800);
 assert.equal(a.wishlist_stock_about_one_week_before_launch_less_than,3000);
 assert.equal(a.postlaunch_wishlist_stock_approx,22000);
 assert.equal(a.postlaunch_discovery_impressions_approx,2500000);
 assert.equal(a.external_trailer_views_approx,30000);
 assert.equal(a.external_viewers_matched_to_paid_orders,false);
 assert.equal(a.impressions_unique_buyers_verified,false);
 assert.equal(a.matched_release_wishlisters_who_purchased_verified,false);
 assert.equal(x.unknown.causal_trailer_view_sales_effect,null);
});
test('Different firstpaid windows do not make high and low selected postmortems a comparable cohort',()=>{
 const a=x.comparison_to_other_selected_cases;
 const prior=read('ontology/steam/steam-lostinart-early-launch-wishlist-window-2026.json');
 assert.equal(a.other_app_id,prior.release.steam_appid);
 assert.equal(a.other_self_reported_early_units,prior.developer_public_launch_report.reported_units_sold_so_far);
 assert.equal(a.other_self_reported_early_horizon_days_approx,1.5);
 assert.equal(a.identical_observation_windows,false);
 assert.equal(a.same_genre_or_price_tier_held_fixed,false);
 assert.equal(a.randomized_launch_comparison,false);
 assert.equal(a.ratios_do_not_establish_representative_wishlist_conversion,true);
});
test('Evidence claims source joins, privacy and fixed 293-task inventory are preserved',()=>{
 const d=read('specimens/steam.json'),p=read('plans/steam.json'),q=read('queues/steam.json');
 const sources=new Set(d.evidence.map(s=>s.id)),claims=new Map(d.claims.map(c=>[c.id,c]));
 assert.equal(x.source_ids.length,2);
 assert.equal(x.claim_ids.length,11);
 for(const id of x.source_ids)assert(sources.has(id),id);
 for(const id of x.claim_ids){assert(claims.has(id),id);assert(claims.get(id).source_ids.every(s=>sources.has(s)),id);}
 assert(Object.values(x.unknown).every(v=>v===null));
 assert.equal(x.interpretation.no_private_records_used,true);
 const scores=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(scores.length,293);
 assert.equal(Math.round(scores.reduce((n,s)=>n+s,0)/293),p.progress_percent);
});
