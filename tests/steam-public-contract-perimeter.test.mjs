import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read = path => JSON.parse(fs.readFileSync(new URL('../'+path,import.meta.url),'utf8'));
const study=read('ontology/steam/steam-public-contract-perimeter-and-oss-licenses-2026.json');
const dossier=read('specimens/steam.json'),plan=read('plans/steam.json'),queue=read('queues/steam.json');
test('The public contract boundary is not a substitute for the signed agreement',()=>{
 assert.equal(study.license_scope.required_steam_distribution_agreement,true);
 for(const k of ['full_partner_signed_contract_publicly_verified','automatic_ip_assignment_to_valve_established','exclusivity_clause_verified','termination_and_appeal_clauses_verified','public_documentation_is_contract_substitute'])
  assert.equal(study.license_scope[k],false,k);
 assert(Object.values(study.unknown).every(v=>v===null));
 assert.equal(study.no_private_contract_or_partner_account_used,true);
});
test('Open-source guidance is conditional, not a blanket GPL ban',()=>{
 const o=study.opensource;
 assert.equal(o.publisher_rights_warranty_explained_by_valve,true);
 assert.equal(o.steamworks_sdk_and_license_compatibility_requires_project_review,true);
 assert.equal(o.copyleft_license_automatically_prohibited,false);
 assert.equal(o.blanket_gpl_ban_claim_supported,false);
 assert.equal(o.case_specific_author_permission_and_integration_matter,true);
 assert.equal(o.source_code_audited,false);
});
test('Café commercial licenses do not imply personal retail purchases or actual income',()=>{
 const c=study.commercial_cafe;
 for(const k of ['commercial_license_requires_cafe_addendum','commercial_license_setup_requires_regular_game_already_on_sale','addendum_signature_requires_actual_authority','separate_commercial_license_package_and_valve_price_approval','licenses_can_be_concurrent_pool','commercial_license_sales_separate_in_partner_reports'])
  assert.equal(c[k],true,k);
 assert.equal(c.pc_cafe_active_customers_equal_individual_paid_game_buyers,false);
 assert.equal(c.actual_commercial_sales_observed,false);
});
test('Public sources, claim IDs, original research task count and status are preserved',()=>{
 const sources=new Set(dossier.evidence.map(s=>s.id)),claims=new Map(dossier.claims.map(c=>[c.id,c]));
 assert.equal(study.source_ids.length,4);
 assert.equal(study.claim_ids.length,9);
 for(const id of study.source_ids)assert(sources.has(id),id);
 for(const id of study.claim_ids){assert(claims.has(id),id);assert(claims.get(id).source_ids.every(x=>sources.has(x)),id);}
 const scores=[...plan.detail_tasks.map(t=>t.percent),...queue.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(scores.length,293);
 assert.equal(plan.progress_percent,Math.round(scores.reduce((a,b)=>a+b,0)/scores.length));
 const rights=plan.detail_tasks.find(t=>t.id==='steam/rights/record-steam-distribution-contract-license');
 assert(rights.evidence.includes('ontology/steam/steam-public-contract-perimeter-and-oss-licenses-2026.json'));
});
