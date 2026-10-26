import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const load=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Unsettled itch launch receipts are never called profit or matched equal products',()=>{
 const m=load('ontology/itch-io/game-sales-feature-cases-2025-2026.json'),d=load('specimens/itch-io.json');
 const c=m.cases.find(x=>x.id==='no_signal');
 assert(m.source_ids.every(id=>d.evidence.some(e=>e.id===id)));
 assert.equal(c.reported_itcho_game_plus_ost_units,3);
 assert.equal(c.reported_itcho_game_plus_ost_gross_usd,75);
 assert.equal(c.estimated_itcho_game_plus_ost_after_transaction_usd,63.61);
 assert.equal(c.estimated_itch_receipts_settled,false);
 assert.equal(c.sku_identical_across_stores,false);
 assert.equal(c.developer_net_profit_usd,null);
});
test('The Hive contradicting sale/payment counts and featured traffic cannot imply causal purchase lift',()=>{
 const m=load('ontology/itch-io/game-sales-feature-cases-2025-2026.json');
 const h=m.cases.find(x=>x.id==='the_hive');
 assert.deepEqual([h.dec_2025.sales_label_count,h.may_2026.payment_event_count],[414,141]);
 assert.equal(h.counts_comparable_as_cumulative_paid_orders,false);
 assert.equal(h.metric_reconciliation_available,false);
 assert.equal(h.july_2026_feature.feature_window_duration_days,null);
 assert.equal(h.july_2026_feature.paid_order_uplift,null);
 assert.equal(h.july_2026_feature.causal_discovery_effect,null);
 assert(Object.values(m.unknown).every(x=>x===null));
});
