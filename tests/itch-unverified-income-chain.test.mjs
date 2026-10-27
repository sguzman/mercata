import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Third-party paid-game income tier chain lacks an independent observable market sample',()=>{
 const x=get('ontology/itch-io/unverified-income-statistics-chain-2026.json'),s=get('specimens/itch-io.json');
 assert(x.source_ids.every(id=>s.evidence.some(z=>z.id===id)));
 assert.equal(x.independent_samples_observed,0);
 assert.equal(x.original_sources_are_independent_market_samples,false);
 assert.equal(x.chain[0].sample_size,null);
 assert.equal(x.chain[0].inspectable_itch_seller_data_or_methodology,false);
 assert.equal(x.chain[1].separate_market_revenue_sample_disclosed,false);
 assert.equal(x.chain[2].separate_market_revenue_sample_disclosed,false);
});
test('Editorial policy claims are contradicted by published source-specific requirements',()=>{
 const x=get('ontology/itch-io/unverified-income-statistics-chain-2026.json');
 const min=x.counterchecks.find(z=>z.id==='collected_seller_payout_minimum');
 const fee=x.counterchecks.find(z=>z.id==='epic_product_submission_fee');
 assert.equal(min.official_minimum_available_usd,5);
 assert.equal(min.editorial_claim_minimum_usd,0);
 assert.equal(fee.official_submission_fee_usd,100);
 assert.equal(fee.editorial_claim_fee_usd,0);
 assert(x.counterchecks.every(z=>z.conflicting));
});
test('Unsupported third-party averages do not fill first-paid-game market income fields',()=>{
 const x=get('ontology/itch-io/unverified-income-statistics-chain-2026.json');
 for(const field of ['marketwide_percent_in_monthly_income_tiers','typical_itcho_creator_monthly_revenue_usd','first_commercial_premium_game_monthly_income_distribution','marketwide_paid_new_game_zero_sale_fraction','platform_average_seller_income','platform_median_seller_income'])assert.equal(x[field],null);
});
