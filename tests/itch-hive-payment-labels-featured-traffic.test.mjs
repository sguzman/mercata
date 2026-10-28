import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const file="ontology/itch-io/the-hive-2025-2026-payment-labels-and-featured-traffic.json";
test('One seller, three reports, and incompatible sale/payment counters',()=>{
 const x=get(file),d=get('specimens/itch-io.json');
 assert.equal(x.seller_count,1);assert(x.source_ids.every(id=>d.evidence.some(s=>s.id===id)));
 assert.equal(x.december_2025.reported_sales_label,414);
 assert.equal(x.may_2026.reported_payments_label,141);
 assert.equal(x.accounting.valid_cumulative_paid_order_series,false);
 assert.equal(x.accounting.sales_and_payments_same_event_definition_verified,false);
});
test('In-progress traffic must not manufacture purchases or income statistics',()=>{
 const x=get(file);
 assert.equal(x.july_2026.visits_during_ongoing_feature_approx,7000);
 assert.equal(x.july_2026.paid_orders_during_feature,null);
 assert.equal(x.accounting.feature_visits_valid_paid_order_conversion_denominator,false);
 assert(Object.values(x.unknown).every(v=>v===null));
});
test('Fixed task inventory and only existing demand task affected',()=>{
 const p=get('plans/itch-io.json'),q=get('queues/itch-io.json');
 const t=p.detail_tasks.find(t=>t.id==='itch-io/market/estimate-paid-purchase-demand');
 assert.equal(t.percent,75);
 for(const f of [file,"ontology/itch-io/the-hive-2025-2026-payment-labels-and-featured-traffic.md","tests/itch-hive-payment-labels-featured-traffic.test.mjs"])assert(t.evidence.includes(f));
 assert.equal(p.detail_tasks.length,160);assert.equal(q.queues.flatMap(w=>w.tasks).length,84);
 assert.equal(p.detail_tasks.filter(t=>t.percent<100).length+q.queues.flatMap(w=>w.tasks).filter(t=>t.progress<100).length,32);
});
