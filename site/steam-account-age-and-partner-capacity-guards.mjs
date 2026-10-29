// Synthetic-only Steam Subscriber age gate; separate Steamworks distribution eligibility is always unknown.
export function classifySyntheticSteamSubscriberAndPartnerAge({fixture_age_years}={}){
 if(!Number.isSafeInteger(fixture_age_years)||fixture_age_years<0||fixture_age_years>120)throw new TypeError('Synthetic age must be an integer between 0 and 120');
 return {synthetic_age_years:fixture_age_years,
  steam_subscriber_general_age_gate:fixture_age_years<13?'barred_under_13':'meets_general_age_floor_only',
  additional_country_registration_restrictions_verified:false,
  steamworks_distribution_signatory_eligible:null,
  distribution_contract_capacity_verified:null,
  steamworks_partner_account_approved:null,
  tax_and_bank_approval_verified:null,
  actual_publishing_sales:null,actual_publisher_profit:null,
  note:'The 13-year floor governs Steam subscriber registration, not Steamworks publishing agreement eligibility. National laws, identity, tax and rights gates remain separate.'};
}
