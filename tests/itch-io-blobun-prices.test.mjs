import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Blobun paid purchases are never conflated with bundle entitlements or file downloads',()=>{
 const x=read('ontology/itch-io/blobun-and-pwyw-copy-counts-2025-2026.json'),d=read('specimens/itch-io.json');
 assert(x.source_ids.every(id=>d.evidence.some(e=>e.id===id)));
 assert.equal(x.blobun.as_of_march_25_2025.direct_itch_purchases,143);
 assert.equal(x.blobun.as_of_march_25_2025.itch_bundle_claims_approx,1984);
 assert.equal(x.blobun.as_of_march_25_2025.itch_full_download_events,2059);
 assert.equal(x.blobun.as_of_march_11_2026.direct_itch_units,271);
 assert.equal(x.blobun.as_of_march_11_2026.itch_only_after_deduction_receipts_usd,null);
 assert.equal(x.blobun.arithmetical_difference_in_described_direct_itch_units,128);
 assert.equal(x.blobun.difference_interpretable_only_if_unit_definitions_match,true);
 assert.equal(x.blobun.independent_statistical_publishers_in_snapshots,1);
});
test('Optional-price copy headline is not verified paid sales',()=>{
 const x=read('ontology/itch-io/blobun-and-pwyw-copy-counts-2025-2026.json');
 assert.equal(x.error143.publisher_reported_headline_copy_count,100000);
 assert.equal(x.error143.distinct_paid_orders_observed,null);
 assert.equal(x.error143.developer_income_observed_usd,null);
 assert(Object.values(x.market_estimates).every(v=>v===null));
});
