import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Store feature history is not a customer-sales timeseries',()=>{
 const s=get('ontology/itch-io/store-feature-history-2026.json');
 const d=get('specimens/itch-io.json');
 assert.equal(s.events.length,5);
 assert(s.source_ids.every(id=>d.evidence.some(e=>e.id===id)));
 assert.equal(s.historical_analytics.initial_impressions_window_days,7);
 assert.equal(s.historical_analytics.ctr_is_paid_conversion,false);
 assert.equal(s.historical_analytics.present_day_window_verified,null);
 assert.equal(s.summer_sale_2026.discounted_projects_lower_bound_exclusive,30000);
 assert.equal(s.summer_sale_2026.observed_paid_orders,null);
 assert.equal(s.patreon_2026.third_party_membership_not_itch_checkout,true);
 assert(Object.values(s.unknown).every(v=>v===null));
});
