import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const load=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Published itch.io direct Stripe country examples cannot imply worldwide eligibility',()=>{
 const x=load('ontology/itch-io/merchant-country-first-payout-2026.json');
 const d=load('specimens/itch-io.json');
 assert(x.source_ids.every(id=>d.evidence.some(s=>s.id===id)));
 assert.deepEqual(x.direct_stripe_documented_countries.map(x=>x.country),['United States','Canada','Ireland','United Kingdom']);
 assert.deepEqual(x.direct_stripe_documented_countries[1].documented_checkout_currencies,['CAD','USD']);
 assert.equal(x.unlisted_country_case.listed_in_itch_direct_stripe_country_examples,false);
 assert.equal(x.unlisted_country_case.individual_itch_direct_stripe_eligibility_approved,null);
 assert.equal(x.direct_paypal.eligible_seller_country_census,null);
});
test('One-time collected payout identity adjustment is not an upfront listing or processing fee',()=>{
 const x=load('ontology/itch-io/merchant-country-first-payout-2026.json').collected;
 assert.equal(x.initial_tax_identity_account_adjustment_usd,3);
 assert.equal(x.adjustment_applied_once,true);
 assert.equal(x.upfront_listing_fee_usd,0);
 assert.equal(x.first_payment_seller_approved,null);
 assert.equal(x.actual_tax_withholding_percent,null);
 assert.equal(x.one_order_total_cash_payout_usd,null);
});
