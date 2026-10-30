import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>JSON.parse(fs.readFileSync(new URL('../'+path,import.meta.url),'utf8'));
const study=read('ontology/steam/go-up-earliest-paid-ea-and-contributor-proceeds-2026.json');
const dossier=read('specimens/steam.json'),plan=read('plans/steam.json'),queue=read('queues/steam.json');

test('Earliest paid Early Access date is one launch, not full-release time zero',()=>{
 assert.equal(study.store_listing.app_id,2934520);
 assert.equal(study.store_listing.first_public_paid_early_access_date,'2025-07-11');
 assert.equal(study.store_listing.later_full_release_date,'2026-08-31');
 assert(study.store_listing.first_public_paid_early_access_date<study.store_listing.later_full_release_date);
 assert.equal(study.store_listing.distinct_first_paid_launches,1);
 assert.equal(study.observation_controls.release_date_cannot_be_reset_to_full_release,true);
});

test('Reported game gross, ambiguous net and contractor allocation never become verified personal income or zero orders',()=>{
 const r=study.public_author_report;
 assert.equal(r.gross_steam_usd_reported,675);
 assert.equal(r.net_steam_usd_reported_undefined_deduction_basis,517);
 assert.equal(r.proceeds_available_for_artist_and_musician_approx_usd,500);
 assert.equal(r.principal_developers_future_receipts_statement,'author_says_likely_zero_not_verified');
 for(const key of ['steam_partner_after_platform_cut_receipts_usd','verified_legal_publisher_bank_receipts_usd',
 'verified_contractor_disbursements_usd','verified_principal_developer_cash_usd',
 'after_cost_profit_usd','representative_newcomer_payout_median','exact_market_zero_paid_sale_fraction'])
  assert.equal(study.unknown[key],null,key);
 assert.equal(study.observation_controls.author_forecast_not_zero_ledger_entry,true);
});

test('Retail units, returns, wishlists and demo activity cannot supply verified buyer counts',()=>{
 const r=study.public_author_report;
 assert.equal(r.lifetime_steam_units_reported+r.retail_units_reported,r.total_units_reported);
 assert.equal(r.returned_units_reported,20);
 assert.equal(study.observation_controls.retail_units_verified_direct_paid_sales,false);
 assert.equal(study.observation_controls.returned_units_cannot_be_reconciled_from_public_post,true);
 assert.equal(study.unknown.observed_actual_paid_steam_orders,null);
 assert.equal(study.unknown.real_refunded_order_denominator,null);
 assert.equal(study.unknown.matched_wishlist_conversion,null);
 assert(r.demo_downloads_approx>r.demo_players_reported);
});

test('Attributable public citations and the original 293 tasks remain intact',()=>{
 const ids=new Set(dossier.evidence.map(x=>x.id)),cmap=new Map(dossier.claims.map(c=>[c.id,c]));
 assert.equal(study.source_ids.length,3);
 assert.equal(study.claim_ids.length,9);
 for(const id of study.source_ids)assert(ids.has(id),id);
 for(const id of study.claim_ids){assert(cmap.has(id),id);assert(cmap.get(id).source_ids.every(s=>ids.has(s)));}
 const scores=[...plan.detail_tasks.map(t=>t.percent),...queue.queues.flatMap(q=>q.tasks.map(t=>t.progress))];
 assert.equal(scores.length,293);
 assert.equal(plan.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/293));
});
