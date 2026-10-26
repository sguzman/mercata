import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Mexico payout example separates provider support from itch.io eligibility',()=>{
 const m=read('ontology/itch-io/payment-country-corridors-2026.json'),d=read('specimens/itch-io.json');
 assert.equal(m.routes.length,3);
 assert.equal(m.routes.find(r=>r.id==='direct_stripe').generic_stripe_mx_country_supported,true);
 assert.equal(m.routes.find(r=>r.id==='direct_stripe').configured_direct_stripe_mx_supported,null);
 assert(m.routes.every(r=>r.personally_confirmed_eligible===null));
 assert.equal(m.routes.find(r=>r.id==='collected').checkout_currency,'USD');
 assert.equal(m.tax_rules.individual_withholding_percent,null);
 assert(Object.values(m.unknown).every(v=>v===null));
 assert(m.routes.flatMap(r=>r.source_ids).every(id=>d.evidence.some(s=>s.id===id)));
});
