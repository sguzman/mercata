import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Founder 2014 public payout and active game pages are dated historical unlike units',()=>{
 const d=get('ontology/itch-io/first-party-2014-payout-historical-crosscheck.json'),s=get('specimens/itch-io.json');
 assert(d.source_ids.every(id=>s.evidence.some(e=>e.id===id)));
 assert.equal(d.observations[0].reported_since_launch_developer_payout_usd_greater_than,100000);
 assert.equal(d.observations[1].reported_approx_payout_usd,170000);
 assert.equal(d.observations[1].reported_published_active_game_pages,6666);
 assert.equal(d.developer_payouts_are_marketplace_gmv,false);
 assert.equal(d.game_pages_are_seller_accounts,false);
});
test('No exact payout change or seller average follows from 2014 platform snapshot counts',()=>{
 const d=get('ontology/itch-io/first-party-2014-payout-historical-crosscheck.json');
 assert.equal(d.matched_same_currency_precisely,false);
 for(const val of Object.values(d.inferences_not_supported))assert.equal(val,null);
});
