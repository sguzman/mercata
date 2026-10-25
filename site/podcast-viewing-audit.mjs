export function comparePodcastObservations(model,first,second) {
 const a=model.observations.find(x=>x.id===first),b=model.observations.find(x=>x.id===second);
 if(!a||!b)return {allowed:false,reason:'missing_observation'};
 if(a.unit!==b.unit || a.population!==b.population || a.device!==b.device || !a.value || !b.value)
  return {allowed:false,reason:'incompatible_population_units_or_missing_numbers'};
 if(a.id==='oct2024_living_room_hours'&&b.id==='oct2025_living_room_hours')
  return {allowed:true,same_broad_metric:true,exact_growth:null,verified_unique_people:null,creator_earnings:null};
 return {allowed:false,reason:'no_valid_paired_timeframe'};
}
export function inferPodcastAudience(model,claim){
 return {allowed:false,reason:'this_metric_does_not_determine_the_requested_person_or_earnings_measure',claim,global_creator_profit:null,individual_watch_minutes:null};
}
export function canSumPodcastSurveyFormats(model){
 return !model.observations.find(x=>x.id==='q3_2025_weekly_video_audio_format').format_usage_categories_overlap;
}
