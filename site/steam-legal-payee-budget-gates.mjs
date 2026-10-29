// Public Steamworks entity-form checklist with invented booleans only.
// No legal name, jurisdiction, banking/tax records, partner account or authenticated contract.
const fields=['fixture_id','legal_form','new_product_app_count','company_formed_before_paperwork',
 'legal_name_bank_tax_consistent','publishing_rights_attested','bank_and_tax_validated',
 'non_us_partner_taxed_individually','legal_entity_name_changing'];
const forms=new Set(['individual_sole_proprietor','incorporated_company','partnership']);
export function auditSyntheticSteamLegalPayeeBudget(x){
 if(!x||typeof x!=='object'||Array.isArray(x)||Object.keys(x).some(k=>!fields.includes(k))||
  typeof x.fixture_id!=='string'||!/^fixture-[a-z0-9-]+$/.test(x.fixture_id))
  throw new TypeError('Only synthetic partner-form fixture fields permitted');
 if(!forms.has(x.legal_form))throw new TypeError('Unsupported legal form');
 if(!Number.isSafeInteger(x.new_product_app_count)||x.new_product_app_count<1||x.new_product_app_count>100)
  throw new RangeError('Positive bounded Steam product count required');
 for(const key of fields.slice(3))if(typeof x[key]!=='boolean')throw new TypeError('Partner prerequisites must be explicit booleans');
 if(x.non_us_partner_taxed_individually&&x.legal_form!=='partnership')
  throw new RangeError('Extra individual-partner tax details apply only to indicated non-US partnerships');
 const blockers=[];
 if(x.legal_form!=='individual_sole_proprietor'&&!x.company_formed_before_paperwork)
  blockers.push('form_selected_entity_before_partner_paperwork');
 if(!x.legal_name_bank_tax_consistent)blockers.push('legal_contract_bank_tax_name_mismatch');
 if(!x.publishing_rights_attested)blockers.push('document_publish_rights');
 if(!x.bank_and_tax_validated)blockers.push('valid_bank_and_tax_required_before_release');
 if(x.non_us_partner_taxed_individually)blockers.push('individual_partner_tax_details_required');
 if(x.legal_entity_name_changing)blockers.push('new_partner_reonboarding_and_game_rights_transfer');
 const fees=100*x.new_product_app_count;
 return {kind:'hypothetical_steamworks_form_and_published_fee_floor_not_live_partner_approval',
  legal_form:x.legal_form,new_product_app_count:x.new_product_app_count,
  fixed_published_product_application_fees_usd:fees,
  usd_adjusted_gross_per_product_to_trigger_possible_fee_recoupment:1000,
  application_fee_nonrefundable:true,has_documented_blockers:blockers.length>0,documented_blockers:blockers,
  must_incorporate_to_sign_steam_distribution_agreement:false,
  legal_name_change_requires_new_partner_account_and_game_rights_migration:x.legal_entity_name_changing,
  additional_individual_partner_tax_documents_indicated:x.non_us_partner_taxed_individually,
  public_fee_is_full_startup_cost:false,
  actual_local_legal_registration_cost_usd:null,actual_tax_rate:null,
  professional_legal_accounting_cost_usd:null,partner_specific_permission:null,
  new_partner_transfer_approved:null,valid_legal_capacity_verified:null,
  expected_bank_cash_receipt_usd:null,after_cost_profit_usd:null,
  caveat:'Only USD 100 per-product Steam Direct fee is quantified. All legal forms, ownership, tax, bank validation, local liability, operating expenses, cash disbursement and entity transfer require case-specific verification.'};
}
