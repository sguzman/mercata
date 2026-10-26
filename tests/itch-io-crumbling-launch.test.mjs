import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('First-game failure case never assigns total agency costs to itch sales or implies market-wide failure rates',()=>{
 const x=get('ontology/itch-io/crumbling-world-launch-2020.json'),d=get('specimens/itch-io.json');
 assert(x.source_ids.every(id=>d.evidence.some(s=>s.id===id)));
 assert.equal(x.venues.find(v=>v.venue==='itch.io').paid_units,7);
 assert.equal(x.venues.find(v=>v.venue==='itch.io').amount_reported_usd,102.83);
 assert.equal(x.all_channel_marketing_agency_cost_approx_usd,10000);
 assert.equal(x.marketing_cost_assignable_to_itch,null);
 assert.equal(x.creator_net_profit_usd,null);
 assert.equal(x.platform_newcomer_success_rate,null);
 assert.equal(x.refund_units,null);
 assert.equal(x.cross_store_total_units_reported,141);
});
