import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Currency table is limited to explicitly documented direct Stripe integration and PayPal currency options',()=>{
 const x=get('ontology/itch-io/checkout-settlement-currency-conditions-2026.json'),d=get('specimens/itch-io.json');
 assert(x.source_ids.every(id=>d.evidence.some(e=>e.id===id)));
 assert.deepEqual(x.direct_stripe_published_account_pairs.map(x=>x.country),['United States','Canada','Ireland','United Kingdom']);
 assert.deepEqual(x.direct_stripe_published_account_pairs.find(x=>x.country==='Canada').currencies,['CAD','USD']);
 assert.deepEqual(x.direct_paypal_configurable_currencies,['USD','CAD','GBP','EUR','JPY','AUD']);
 assert.equal(x.collected_by_itch_io.payment_transaction_currency,'USD');
 assert.equal(x.direct_stripe_other_country_integrations_approved,null);
});
test('Currency config has no invented FX spread, countrywide active sellers or final bank credit',()=>{
 const x=get('ontology/itch-io/checkout-settlement-currency-conditions-2026.json'),p=get('plans/itch-io.json');
 assert.equal(x.paypal_mexico_local_bank_transfer_can_convert_usd_to_mxn,true);
 assert.equal(x.publisher_example.actual_bank_pesos,null);
 assert.equal(x.publisher_example.actual_fx_spread,null);
 assert.equal(x.publisher_example.actual_seller_approval,null);
 assert.equal(x.operator_verified_seller_census_by_country,null);
 assert.equal(x.publisher_income_aggregate_after_currency_conversion,null);
 const t=p.detail_tasks.find(t=>t.id==='itch-io/access/study-currency-settings');
 assert.equal(t.percent,100);assert.equal(t.status,'complete');
 assert(t.evidence.includes('tests/itch-checkout-settlement-currency.test.mjs'));
});
