export function assessVTuberInference(model, request) {
 const kind=request?.kind;
 const supported={
  selected_cohort_mean_public_superchat:true,
  selected_cohort_median_public_superchat:true,
  selected_cohort_zero_superchat_share:true,
  selected_public_chat_sender_superchat_share:true,
  selected_public_chat_sender_membership_share:true,
  selected_2018_2023_gini_proxy:true
 };
 if(!supported[kind])return {allowed:false,reason:'unmeasured_income_or_population'};
 const frame=kind?.includes('chat_sender')?'public_chat_posting_accounts': 'selected_vtuber_cohort';
 if(request.population!==frame)return {allowed:false,reason:'wrong_denominator'};
 const value={
 selected_cohort_mean_public_superchat:model.creator_superchats.reported_monthly_mean_usd_equivalent,
 selected_cohort_median_public_superchat:model.creator_superchats.reported_monthly_median_usd_equivalent,
 selected_cohort_zero_superchat_share:model.creator_superchats.channels_without_superchat_reported_fraction,
 selected_public_chat_sender_superchat_share:model.commenter_conversion.posted_at_least_one_superchat_percent,
 selected_public_chat_sender_membership_share:model.commenter_conversion.purchased_at_least_one_membership_percent
 }[kind]??null;
 return {allowed:true,value,unit:kind?.includes('monthly')?'USD':'source_defined',verified_net_creator_profit:null};
}
export function combineBuyerGroups(model){
 if(!model.commenter_conversion.superchat_and_membership_purchasers_disjoint)return {allowed:false,buyer_share:null,reason:'purchaser_sets_overlap'};
 return {allowed:false,buyer_share:null,reason:'no_verified_intersection'};
}
