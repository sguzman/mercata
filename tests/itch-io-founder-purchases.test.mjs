import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Historical itch.io purchases are not used to invent 2026 sale success',()=>{
 const x=read('ontology/itch-io/founder-purchases-2014.json'),s=read('specimens/itch-io.json');
 assert(x.source_ids.every(id=>s.evidence.some(e=>e.id===id)));
 assert.equal(x.accounts.share_linked_public_game_publishers_with_any_purchase_approx,0.3);
 assert.equal(x.accounts.positive_price_only,false);
 assert.equal(x.transactions.external_referrer_fraction_2014,0.84);
 assert.equal(x.transactions.share_purchases_during_sale,0.11);
 assert.equal(x.transactions.median_conditional_payment_to_free_game_usd,3);
 assert(Object.values(x.not_observed).every(v=>v===null));
});
