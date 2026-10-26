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

export function auditRegionalAvailabilityMechanisms(model,sourceIds){
 const errors=[],m=model?.region_specific_video_availability;
 if(!m||m.policy_review_date!=='2026-10-25'||m.source_ids?.length!==3||
    !m.source_ids.every(id=>sourceIds.has(id)))return {valid:false,errors:['missing official country restriction sources']};
 if(m.mechanisms?.length!==3||m.mechanisms.map(x=>x.id).join(',')!=='video_owner_licensing_region,platform_local_law,content_id_claimant'||
    m.mechanisms.some(x=>!sourceIds.has(x.source_id)||x.observed_territory_codes!==null||
      x.affected_video_count!==null||x.incremental_creator_revenue_effect!==null))
    errors.push('unsupported actual video-territory mechanism or exposure');
 if(m.music_claim_policy_outcomes?.length!==3||
    m.music_claim_policy_outcomes.map(x=>x.id).join(',')!=='monetize,block_worldwide,block_some_territories'||
    m.music_claim_policy_outcomes.some(x=>!sourceIds.has(x.source_id)||x.uploader_revenue_share_percent!==null))
    errors.push('invented claimant earnings or music policy');
 if(m.ypp_country_listing_implies_viewer_video_availability!==false||
    m.ypp_country_listing_implies_claimant_rights_clearance!==false||
    m.ypp_country_listing_implies_advertising_approval!==false||
    m.all_three_reference_countries_have_verified_claimed_video_records!==false||
    m.country_specific_legal_advice_provided!==false||
    m.per_video_audience_geo_mix!==null||m.per_video_rightsholder_claims!==null||
    m.country_specific_affected_view_count!==null||m.actual_settled_payout_by_territory!==null)
    errors.push('unsupported country payout or legal inference');
 if(Object.values(model.unmeasured||{}).some(x=>x!==null))errors.push('fabricated region-specific payouts');
 return {valid:errors.length===0,errors};
}
