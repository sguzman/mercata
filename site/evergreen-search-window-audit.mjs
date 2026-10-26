const day=24*60*60*1000;
export function validateSearchStudyFrame(model,req){
 if(!req?.ownerAuthorized||!Array.isArray(req.videoIds)||req.videoIds.length===0||
    new Set(req.videoIds).size!==req.videoIds.length)
  return {valid:false,reason:'owner_and_distinct_video_ids_required'};
 if(!Number.isInteger(req.queriedDays)||req.queriedDays<=0)
  return {valid:false,reason:'positive_integer_days_required'};
 const total=req.videoIds.length*req.queriedDays;
 if(!Number.isSafeInteger(total)||total>model.official_features[2].query_complexity_video_count_times_days_max)
  return {valid:false,reason:'video_days_above_supported_query_limit'};
 if(!model.content_candidate_types.some(x=>x.id===req.contentType))
  return {valid:false,reason:'unregistered_format'};
 if(!req.topic||!req.language||!req.observationCutoff)
  return {valid:false,reason:'reproducible_topic_language_and_cutoff_required'};
 return {valid:true,query_video_days:total,source_metric:'owner_traffic_source_view_events_and_watch_minutes',
  observed_search_share:null,evergreen_confirmed:null,creator_profit:null};
}
export function bucketVideoAge(model,ageDays){
 if(!Number.isInteger(ageDays)||ageDays<0)return null;
 const item=model.disjoint_video_age_windows_days.find(x=>ageDays>=x.start_inclusive&&ageDays<=x.end_inclusive);
 return item?.id??null;
}
export function inferEvergreenFromTrends(model,data){
 return {supported:false,reason:'28_day_ordinal_interest_not_longitudinal_search_or_profit',
  absolute_search_volume:null,year_round_search_share:null,creator_profit:null};
}

export function auditInstructionalVideoSurveyContext(model,registeredSources,shoppingModel){
 const errors=[],x=model?.instructional_video_survey_context;
 if(!x||!registeredSources.has(x.source_id)||!model.source_ids.includes(x.source_id))
  return {valid:false,errors:['unregistered instructional survey']};
 if(x.full_sample_n!==2160||x.question_specific_sample_n!==null||
    x.overall_youtube_viewer_subset_n_separately_reported!==1001||
    x.publication_year!==2025)
  errors.push('survey population or question-level precision distorted');
 if(x.observations?.length!==4||
    x.observations.map(y=>y.id).join(',')!=='learn_new_skill_video_preferred,learn_to_build_video_preferred,learn_to_cook_video_preferred,youtube_best_instructional_agreement'||
    x.observations.map(y=>y.value_percent).join(',')!=='69,70,63,91'||
    x.observations.map(y=>y.is_youtube_only).join(',')!=='false,false,false,true')
  errors.push('survey predicates and rates mislabeled');
 if(x.source_id!==shoppingModel?.intent_reference_frames?.[0]?.source_id||
    x.observations.some(y=>!shoppingModel.intent_reference_frames[0].observations.some(z=>
      z.percent===y.value_percent&&z.id===({
       learn_new_skill_video_preferred:'rather_video_learn_skill',
       learn_to_build_video_preferred:'rather_video_build_something',
       learn_to_cook_video_preferred:'rather_video_cook_something',
       youtube_best_instructional_agreement:'youtube_best_instructional_content'
      })[y.id])))
  errors.push('survey results differ from registered shopping source');
 for(const key of ['actual_evergreen_search_queries','verified_repeat_search_users','recurring_tutorial_watch_minutes','income_from_tutorials','causal_effect_of_video_instruction','inferred_search_volume'])
  if(x[key]!==null)errors.push('invented tutorial repeat search or earnings outcome');
 if(model.unmeasured.instructional_video_search_to_repeat_watching!==null)
  errors.push('invented instructional visitor retention');
 return {valid:errors.length===0,errors};
}
