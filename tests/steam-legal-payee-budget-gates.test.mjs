import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {auditSyntheticSteamLegalPayeeBudget as audit} from '../site/steam-legal-payee-budget-gates.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const x=read('ontology/steam/steam-sole-proprietor-versus-company-form-cash-gates-2026.json'),d=read('specimens/steam.json'),p=read('plans/steam.json'),q=read('queues/steam.json');
test('Sole proprietor can model published Steam fee without invented incorporation charge',()=>{
 const r=audit(x.hypothetical_cases[0]);
 assert.equal(r.fixed_published_product_application_fees_usd,100);
 assert.equal(r.must_incorporate_to_sign_steam_distribution_agreement,false);
 assert.equal(r.documented_blockers.length,0);
 assert.equal(r.public_fee_is_full_startup_cost,false);
 assert.equal(r.actual_local_legal_registration_cost_usd,null);
 assert.equal(r.partner_specific_permission,null);
});
test('Unformed corporation and non-US partner-taxed partnership require different paperwork',()=>{
 const corporation=audit(x.hypothetical_cases[1]);
 assert(corporation.documented_blockers.includes('form_selected_entity_before_partner_paperwork'));
 assert(corporation.documented_blockers.includes('valid_bank_and_tax_required_before_release'));
 const partnership=audit(x.hypothetical_cases[2]);
 assert.equal(partnership.fixed_published_product_application_fees_usd,200);
 assert.equal(partnership.additional_individual_partner_tax_documents_indicated,true);
 assert(partnership.documented_blockers.includes('individual_partner_tax_details_required'));
});
test('Legal-name change means new Steam partner onboarding and game-rights migration',()=>{
 const r=audit(x.hypothetical_cases[3]);
 assert.equal(r.legal_name_change_requires_new_partner_account_and_game_rights_migration,true);
 assert(r.documented_blockers.includes('new_partner_reonboarding_and_game_rights_transfer'));
 assert.equal(r.new_partner_transfer_approved,null);
});
test('Mismatched legal names, absent rights and private fields fail or block appropriately',()=>{
 const a=audit({...x.hypothetical_cases[0],legal_name_bank_tax_consistent:false,publishing_rights_attested:false});
 assert(a.documented_blockers.includes('legal_contract_bank_tax_name_mismatch'));
 assert(a.documented_blockers.includes('document_publish_rights'));
 assert.throws(()=>audit({...x.hypothetical_cases[0],legal_name:'Alice Example'}),/Only synthetic/);
 assert.throws(()=>audit({...x.hypothetical_cases[0],new_product_app_count:0}),/Positive/);
 assert.throws(()=>audit({...x.hypothetical_cases[0],bank_and_tax_validated:'yes'}),/explicit booleans/);
 assert.throws(()=>audit({...x.hypothetical_cases[0],non_us_partner_taxed_individually:true}),/only/);
});
test('Public claims and fixed inventory remain auditable and no local business expense is invented',()=>{
 const ss=new Set(d.evidence.map(s=>s.id)),cc=new Map(d.claims.map(c=>[c.id,c]));
 assert.equal(x.source_ids.length,3);assert.equal(x.claim_ids.length,6);
 for(const id of x.source_ids)assert(ss.has(id));
 for(const id of x.claim_ids)assert(cc.has(id)&&cc.get(id).source_ids.every(s=>ss.has(s)));
 assert(Object.values(x.unknown).every(v=>v===null));
 const vals=[...p.detail_tasks.map(t=>t.percent),...q.queues.flatMap(g=>g.tasks.map(t=>t.progress))];
 assert.equal(vals.length,293);assert.equal(p.progress_percent,Math.round(vals.reduce((a,b)=>a+b,0)/293));
});
