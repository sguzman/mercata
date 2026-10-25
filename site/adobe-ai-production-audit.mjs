export function assessAIVideoSurveyClaim(model,metric,requestedPopulation){
 const choices={
  used_ai_video: {value:model.survey.ai_video_tool_ever_used_percent,population:'surveyed_us_video_creators'},
  weekly_ai_video: {value:model.survey.weekly_use_among_ai_users_percent,population:'ai_users_only'},
  youtube_poster_ai_use:{value:model.survey.youtube_posting_creator_ai_use_percent,population:'youtube_posting_subsample'},
  reported_saved_over_30_minutes:{value:model.survey.self_reported_ai_saves_over_30_min_percent,population:'surveyed_us_video_creators'},
  reported_saved_over_4_hours:{value:model.survey.self_reported_ai_saves_over_4h_percent,population:'surveyed_us_video_creators'},
  more_brand_deals:{value:model.survey.reported_more_sponsors_among_prior_brand_deal_creators_percent,population:'respondents_with_past_brand_deals'}
 };
 const chosen=choices[metric];
 if(!chosen||requestedPopulation!==chosen.population)return {allowed:false,reason:'wrong_sample_frame_or_unmeasured_effect'};
 return {allowed:true,value_percent:chosen.value,unit:'respondent_self_reported_percent',
  measured_time_saved_hours:null,net_creator_profit:null,randomized_causal_effect:null};
}
export function combineNestedSavedTimeCategories(model){
 if(model.survey.self_reported_ai_saves_over_4h_percent<=model.survey.self_reported_ai_saves_over_30_min_percent)
  return {allowed:false,reason:'nested_thresholds_cannot_be_summed'};
 return {allowed:false,reason:'unverified_disjoint_subsamples'};
}
