import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const load=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
test('Publisher rights are nonexclusive and buyer data cannot be disclosed',()=>{
 const model=load('ontology/itch-io/publisher-rights-refunds-2026.json');
 const dossier=load('specimens/itch-io.json');
 const ids=new Set(dossier.evidence.map(s=>s.id));
 assert(model.source_ids.every(id=>ids.has(id)));
 assert.equal(model.publisher_rights.company_content_license_exclusive,false);
 assert.equal(model.publisher_rights.universal_cross_store_permission_for_all_thirdparty_material,null);
 assert.equal(model.buyer_privacy.private_buyer_data_collected,0);
 assert.equal(model.buyer_privacy.automatic_mailing_list_enrollment_allowed,false);
 assert(model.buyer_privacy.forbidden_to_redistribute_identifying_fields.includes('country_code'));
 assert.equal(model.buyer_privacy.merchant_aggregate_data_release_without_risk_review,false);
 assert(Object.values(model.unknown).every(value=>value===null));
});
test('Unclaimed earnings risk is conditional and not a generic sale fee',()=>{
 const d=load('ontology/itch-io/publisher-rights-refunds-2026.json');
 const x=d.unclaimed_collected_proceeds;
 assert.equal(x.collected_mode_only,true);
 assert.equal(x.eligible_transaction_aging_months_over,12);
 assert.equal(x.monthly_original_purchase_revenue_fraction,0.1);
 assert.equal(x.can_create_negative_balance,false);
 assert.equal(x.observed_frequency_of_application,null);
 assert.equal(x.observed_seller_losses_usd,null);
 assert.equal(d.refunds.observed_refund_rate,null);
});
