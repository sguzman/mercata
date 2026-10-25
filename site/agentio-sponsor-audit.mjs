export function validateSponsorMetric(model, observationId, requestedInference) {
 const x=model.selected_aggregates.find(e=>e.id===observationId);
 if(!x)return {allowed:false,reason:'unknown_vendor_observation'};
 const allowedClaims={
  views_after_day_30:'post30_view_share',
  views_after_day_90:'post90_view_share',
  clicks_after_day_30:'post30_click_share',
  ctr_relative_eighth_placement:'relative_eighth_sponsorship_ctr',
  conversion_rate_relative_sixth_placement:'relative_sixth_sponsorship_cvr',
  advertiser_cumulative_cpm_decline_one_year:'advertiser_cumulative_cpm_decline'
 };
 if(allowedClaims[observationId]!==requestedInference)
  return {allowed:false,reason:'incompatible_units_or_unobserved_creator_outcome'};
 return {allowed:true,value:x.value,unit:x.unit,source_frame:model.selection.unit,net_creator_income:null,absolute_conversion_rate:null};
}
export function addLateViewShares(model,ids){
 const items=ids.map(id=>model.selected_aggregates.find(x=>x.id===id));
 if(items.some(x=>!x))return {allowed:false,reason:'missing_observation'};
 if(ids.includes('views_after_day_30')&&ids.includes('views_after_day_90'))
  return {allowed:false,reason:'overlapping_age_windows'};
 if(items.some(x=>!x.unit.includes('views')))
  return {allowed:false,reason:'incompatible_units'};
 return {allowed:false,reason:'unverified_disjoint_observation_windows'};
}
export function assessCausalSponsorshipLift(model,comparison){
 return {allowed:false,reason:!model.selection.random_sample_of_all_youtube_creators?'selected_nonrandom_repeat_partnership_cohort':'no_randomized_incrementality_or_creator_profit',causal_lift:null,net_creator_profit:null};
}
