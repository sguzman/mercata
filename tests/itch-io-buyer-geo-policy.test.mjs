import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const load=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Historical UK content geography is not universal buyer or seller exclusion',()=>{
 const x=load('ontology/itch-io/buyer-seller-geographic-policy-2026.json'),d=load('specimens/itch-io.json');
 assert(x.source_ids.every(id=>d.evidence.some(s=>s.id===id)));
 const uk=x.policies[0];
 assert.equal(uk.source_date,'2025-07-27');
 assert.equal(uk.every_game_blocked,false);
 assert.equal(uk.all_game_buyers_blocked,false);
 assert.equal(uk.historical_existing_buyer_download_entitlement_preserved,true);
 assert.equal(uk.independently_confirmed_2026_status,null);
 assert.equal(uk.actual_purchases_prevented,null);
 assert.equal(x.policies[1].approved_countries_complete_census,null);
 assert(Object.values(x.unresolved).every(v=>v===null));
});
