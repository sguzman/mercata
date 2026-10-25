export function inspectCountryAccess(model,{country_code,account_currency=null,feature=null}={}){
 const country=model?.observations?.find(x=>x.country_code===country_code);
 if(!country)return {valid:false,reason:'country_not_in_study'};
 if(account_currency!==null && (!/^[A-Z]{3}$/.test(account_currency)))
  return {valid:false,reason:'invalid_explicit_account_currency'};
 const minimum=account_currency===null?null:model.currency_examples.find(x=>x.currency===account_currency);
 return {valid:true,country_code,geography_standard_ypp_listed:country.standard_ypp_geography_listed,
  geography_expanded_ypp_listed:country.expanded_ypp_geography_listed,
  payment_method_listings:country.payment_methods_by_address,
  reporting_currency:account_currency,
  documented_account_currency_minimum:minimum?.payout_minimum??null,
  claimed_feature_approved:null,actual_account_payment_method:null,
  video_rights_policy_by_country:null,observed_creator_income:null};
}
export function inferCountryVideoRights(model,{country_code,content_id_action,video_rightsholder_case}={}){
 const registered=model?.observations?.some(x=>x.country_code===country_code);
 if(!registered)return {allowed:false,reason:'country_not_in_study'};
 if(!['block','monetize','track'].includes(content_id_action))
  return {allowed:false,reason:'not_a_content_id_action'};
 // Global possibility of territorial claims does not establish actual rights for a particular video.
 return {allowed:false,reason:'no_owner_authorized_per_video_territory_claim_observed',verified_video_rights:null,revenue_loss:null};
}
