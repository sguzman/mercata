import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const x=read('ontology/steam/legal-signatory-onboarding-and-contract-scope-2026.json'),d=read('specimens/steam.json'),p=read('plans/steam.json'),q=read('queues/steam.json');
test('Public onboarding requirements do not fabricate private license rights',()=>{
 assert.equal(x.onboarding.signed_steam_distribution_agreement_required,true);
 assert.equal(x.onboarding.sole_proprietor_option,true);
 assert.equal(x.onboarding.legal_name_and_bank_name_must_match,true);
 assert.equal(x.unverified.signed_contract_license_grant,null);
 assert.equal(x.unverified.contractual_seller_royalty_percentage,null);
});
test('The public source does not supply a universal minor capacity rule',()=>{
 assert.equal(x.unverified.universal_minimum_partner_signatory_age,null);
 assert.equal(x.unverified.minor_capacity_by_jurisdiction,null);
 assert(Object.values(x.not_done).every(v=>v===false));
});
test('Every source and bounded claim is valid without changing the 293-task inventory',()=>{
 const s=new Set(d.evidence.map(x=>x.id)),c=new Map(d.claims.map(x=>[x.id,x]));
 assert.equal(x.source_ids.length,3);assert.equal(x.claim_ids.length,12);
 for(const id of x.source_ids)assert(s.has(id),id);
 for(const id of x.claim_ids){assert(c.has(id),id);assert(c.get(id).source_ids.every(s=>s&&Array.from(new Set(d.evidence.map(x=>x.id))).includes(s)));}
 const values=[...p.detail_tasks.map(x=>x.percent),...q.queues.flatMap(g=>g.tasks.map(x=>x.progress))];
 assert.equal(values.length,293);assert.equal(p.progress_percent,Math.round(values.reduce((a,b)=>a+b,0)/293));
});
