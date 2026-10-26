import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const get=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('International risk separates visitor geography, merchant eligibility, VAT, withholding and buyer rights',()=>{
 const x=get('ontology/itch-io/jurisdiction-buyer-tax-entitlement-risk-2026.json');
 const d=get('specimens/itch-io.json');
 assert(x.source_ids.every(id=>d.evidence.some(e=>e.id===id)));
 assert.deepEqual(x.axes.map(x=>x.dimension),['buyer_jurisdiction_visibility','seller_residency_payment_connectivity','buyer_vat','seller_withholding','after_sale_entitlement','refund_and_dispute']);
 assert.equal(x.axes[0].known_example.all_buyers_restricted,false);
 assert.equal(x.axes[0].known_example.unknown_2026_policy_state,null);
 assert.equal(x.axes[3].documented_default_without_valid_tax_id_percent,30);
 assert.equal(x.axes[3].universal_effective_foreign_withholding_rate,null);
 assert.equal(x.axes[4].permanent_future_download_access_guarantee,false);
});
test('Source-backed compliance mapping cannot infer current seller eligibility or lost game income',()=>{
 const x=get('ontology/itch-io/jurisdiction-buyer-tax-entitlement-risk-2026.json'),p=get('plans/itch-io.json');
 assert.equal(x.example_country_rows.find(r=>r.place==='Mexico').legal_eligibility_confirmed,null);
 assert.equal(x.commercial_population_coverage,0);
 assert(Object.values(x.not_inferred).every(v=>v===null));
 const t=p.detail_tasks.find(t=>t.id==='itch-io/risk/map-international-compliance-risk');
 assert.equal(t.percent,100);assert.equal(t.status,'complete');
 assert(t.evidence.includes('tests/itch-jurisdiction-risk-separation.test.mjs'));
});
