import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const load=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Launch indexing and TOTP documentation cannot imply observed seller success',()=>{
 const x=load('ontology/itch-io/account-launch-indexing-2026.json'),d=load('specimens/itch-io.json');
 assert(x.source_ids.every(id=>d.evidence.some(s=>s.id===id)));
 assert.equal(x.seller_account.totp_supported,true);
 assert.equal(x.seller_account.private_security_data_collected,0);
 assert.equal(x.seller_account.observed_2fa_adoption_rate,null);
 assert.equal(x.measurement.actual_days_to_index,null);
 assert.equal(x.measurement.paid_units_attributable_to_search,null);
 assert(x.release_states.some(s=>s.id==='public_unindexed_first_paid_seller' && s.direct_url_accessible===true));
});
