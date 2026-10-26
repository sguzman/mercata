import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('2025 low-sale game cases retain dates and distinct payment/exposure units',()=>{
 const a=read('ontology/itch-io/zero-five-paid-game-snapshots-2025.json'),d=read('specimens/itch-io.json');
 assert(a.source_ids.every(id=>d.evidence.some(e=>e.id===id)));
 assert.equal(a.cases[0].self_reported_itch_sold_copies,0);
 assert.equal(a.cases[0].sales_observed_through,'2025-05-30');
 assert.equal(a.cases[0].positive_price_required_during_original_period,null);
 assert.equal(a.cases[0].dedicated_itch_build_hours,null);
 assert.equal(a.cases[1].self_reported_copies,5);
 assert.equal(a.cases[1].list_price_units_product_usd,5);
 assert.equal(a.cases[1].audited_gross_receipts_usd,null);
 assert.equal(a.cases[1].same_paid_game_download_exposure,false);
 assert.equal(a.cases[1].followers_matched_to_paid_buyers,false);
 assert.equal(a.cases[1].later_purchases_described_in_replies,true);
 for(const key of ['all_launches_zero_rate','representative_paid_game_median','representative_paid_game_mean','genre_income_effect','actual_paid_2d_buyer_population'])assert.equal(a.sampling[key],null);
});
