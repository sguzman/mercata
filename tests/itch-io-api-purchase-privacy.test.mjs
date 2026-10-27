import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const x=JSON.parse(fs.readFileSync(new URL('../ontology/itch-io/api-purchase-privacy-2026.json',import.meta.url),'utf8'));
test('Scoped API buyer lookups do not constitute a public merchant sales dataset',()=>{
 assert.equal(x.documented_api_requires_authentication,true);
 assert.equal(x.documented_operations.length,5);
 assert.equal(x.documented_operations.find(a=>a.id==='purchases').completed_purchases_only,true);
 assert.equal(x.documented_operations.find(a=>a.id==='download_keys').key_can_exist_without_paid_purchase,true);
 assert.equal(x.documented_operations.find(a=>a.id==='ownership').oauth_authorized_owner_only,true);
 assert.equal(x.documented_operations.find(a=>a.id==='claimed_rewards').may_include_shipping_address,true);
 assert(x.documented_operations.every(o=>o.can_prove_aggregated_income===false));
 assert.equal(x.actual_api_requests,0);assert.equal(x.actual_buyer_records_read,0);
 assert(Object.values(x.unknown).every(v=>v===null));
});

test('Authorized profile inventory example is not a retained paid-game income cohort',()=>{
 const o=x.documented_operations.find(x=>x.id==='owner_profile_games');
 assert(o&&o.required_scope==='profile:games');
 assert.equal(o.endpoint,'https://api.itch.io/profile/games');
 assert.equal(o.fetches_uploaded_or_editable_games,true);
 assert.equal(o.can_include_nonowned_editable_games,true);
 assert.equal(o.purchase_count_is_refund_adjusted_paid_game_orders,false);
 assert.equal(o.earnings_amount_is_merchant_bank_cash,false);
 assert.equal(o.current_min_price_proves_original_published_price,false);
 assert.equal(o.historical_30_90_365_day_sale_cohorts_available,false);
 assert.equal(o.eligible_first_paid_game_publisher_population_defined,false);
 assert.equal(x.owner_portfolio_data_scope.api_calls_executed,0);
 assert.equal(x.owner_portfolio_data_scope.owner_authorized_consent_obtained,false);
 assert.equal(x.owner_portfolio_data_scope.sample_purchases_and_earnings_are_real_mercata_observations,false);
});
