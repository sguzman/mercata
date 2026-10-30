// Source-classified Steam partner cash scenarios only; never actual payment or sales evidence.
const TYPES=Object.freeze({
 bank_tax_unverified:{class:'release_and_payment_gate',is_punitive_enforcement:false,cash_status:'not_payable_until_verified',release_gate:true},
 tax_verification_pending:{class:'processing_gate',is_punitive_enforcement:false,cash_status:'not_payable_until_verified',release_gate:true},
 subminimum_payment_balance:{class:'settlement_threshold',is_punitive_enforcement:false,cash_status:'may_be_deferred_below_threshold',release_gate:false},
 voluntary_partner_threshold:{class:'partner_elected_settlement_delay',is_punitive_enforcement:false,cash_status:'delayed_if_below_elected_threshold',release_gate:false},
 late_bank_update:{class:'possible_operational_delay',is_punitive_enforcement:false,cash_status:'may_be_deferred_to_next_batch',release_gate:false},
 returned_bank_transfer:{class:'failed_transfer',is_punitive_enforcement:false,cash_status:'next_normal_batch_after_correction',release_gate:false},
 charged_back_or_fraudulent_direct_fee:{class:'possible_withholding',is_punitive_enforcement:null,cash_status:'sales_and_fee_recoupment_may_be_withheld',release_gate:null},
 sanctioned_counterparty:{class:'contractual_access_restriction',is_punitive_enforcement:null,cash_status:'counterparty_eligibility_not_verifiable_here',release_gate:null},
 missing_payment_with_valid_details:{class:'request_finance_trace',is_punitive_enforcement:null,cash_status:'trace_not_automatic_reissue',release_gate:false}
});
export function classifySyntheticSteamCashDisposition(rows){
 if(!Array.isArray(rows))throw new TypeError('Expected synthetic payment scenarios');
 const seen=new Set(),out=[];
 for(const row of rows){
  if(!row||typeof row!=='object'||Array.isArray(row)||
    Object.keys(row).some(key=>!['fixture_id','reason'].includes(key))||
    typeof row.fixture_id!=='string'||!/^fixture-[a-z0-9-]+$/.test(row.fixture_id))
   throw new TypeError('Only synthetic fixture IDs and permitted condition fields accepted');
  if(seen.has(row.fixture_id))throw new RangeError('Duplicate synthetic scenario');
  seen.add(row.fixture_id);
  if(typeof row.reason!=='string'||!Object.hasOwn(TYPES,row.reason))
   throw new TypeError('Unknown Steam payment condition');
  out.push({fixture_id:row.fixture_id,reason:row.reason,...TYPES[row.reason],
   actual_payment_deferred:null,actual_order_count:null,actual_bank_deposit_usd:null,
   actual_zero_paid_sales:null,publisher_profit_usd:null});
 }
 return {scenarios:out,scenario_count:out.length,
  actual_zero_paid_sale_fraction:null,actual_payment_hold_prevalence:null,
  reported_partner_income_median_usd:null,
  no_sale_inference_from_absent_bank_payment:false,
  note:'Possible reasons for cash timing are not observed merchant financial data or rates.'};
}
