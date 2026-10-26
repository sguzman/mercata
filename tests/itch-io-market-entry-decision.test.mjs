import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const load=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Game selling entry guidance distinguishes actual paid orders, free plays and incomplete research',()=>{
 const a=load('ontology/itch-io/market-entry-decision-guide-2026.json'),d=load('specimens/itch-io.json');
 const src=new Set(d.evidence.map(e=>e.id));
 assert(a.source_ids.every(id=>src.has(id)));
 assert.equal(a.launch_options.length,3);
 assert(a.launch_options.every(x=>x.platform_mechanic_source_ids.every(id=>src.has(id))));
 assert.equal(a.launch_options.find(x=>x.id==='browser_donation').buyer_event_to_count,'optional_positive_payment_not_browser_play');
 assert.equal(a.business_math.illustrative_per_order_before_other_costs_usd,8.41);
 assert.equal(a.business_math.example_is_actual_creator_profit,false);
 assert(Object.values(a.actual_outcomes).every(v=>v===null||v===false));
 assert(a.readiness_gates.every(x=>Object.values(x).includes(false)||Object.values(x).includes(null)));
});
