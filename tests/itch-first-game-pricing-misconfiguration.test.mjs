import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const load=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('First-game pricing error preserves observed zero but not a causal or population result',()=>{
 const x=load('ontology/itch-io/first-game-pricing-misconfiguration-2026.json');
 const s=load('specimens/itch-io.json');
 assert(x.source_ids.every(id=>s.evidence.some(e=>e.id===id)));
 assert.equal(x.publisher_reported_sales_as_of_report,0);
 assert.equal(x.actual_first_release_date,null);
 assert.equal(x.intended_multiplayer_price_ceiling_usd,9.99);
 assert.equal(x.actual_unintended_storefront_price_before_fix_usd,null);
 assert.equal(x.exact_cart_math_independently_verified,false);
 assert.equal(x.causal_zero_sale_explanation_identified,false);
 assert.equal(x.post_fix_sales,null);
 assert.equal(x.first_time_seller_zero_sale_share,null);
});
