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

test('Published store amounts remain source-accurate even when the combined figure differs by six dollars',()=>{
 const x=get('ontology/itch-io/crumbling-world-launch-2020.json');
 const units=x.venues.reduce((s,v)=>s+v.paid_units,0);
 const sum=Number(x.venues.reduce((s,v)=>s+v.amount_reported_usd,0).toFixed(2));
 assert.equal(units,141);assert.equal(x.venue_units_arithmetic_sum,units);
 assert.equal(x.venue_units_reconcile_with_reported_total,true);
 assert.equal(sum,1374.82);assert.equal(x.venue_amounts_arithmetic_sum_usd,sum);
 assert.equal(x.cross_store_total_amount_reported_usd,1380.82);
 assert.equal(x.reported_total_less_sum_of_venue_amounts_usd,6);
 assert.equal(x.venue_amounts_reconcile_with_reported_total,false);
 assert.equal(x.unresolved_reason_for_six_dollar_gap,null);
});
