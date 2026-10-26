import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const x=JSON.parse(fs.readFileSync(new URL('../ontology/itch-io/api-purchase-privacy-2026.json',import.meta.url),'utf8'));
test('Scoped API buyer lookups do not constitute a public merchant sales dataset',()=>{
 assert.equal(x.documented_api_requires_authentication,true);
 assert.equal(x.documented_operations.length,4);
 assert.equal(x.documented_operations.find(a=>a.id==='purchases').completed_purchases_only,true);
 assert.equal(x.documented_operations.find(a=>a.id==='download_keys').key_can_exist_without_paid_purchase,true);
 assert.equal(x.documented_operations.find(a=>a.id==='ownership').oauth_authorized_owner_only,true);
 assert.equal(x.documented_operations.find(a=>a.id==='claimed_rewards').may_include_shipping_address,true);
 assert(x.documented_operations.every(o=>o.can_prove_aggregated_income===false));
 assert.equal(x.actual_api_requests,0);assert.equal(x.actual_buyer_records_read,0);
 assert(Object.values(x.unknown).every(v=>v===null));
});
