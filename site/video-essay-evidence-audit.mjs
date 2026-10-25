export function selectEssayEvidence(model,source,metric){
 const frame=source==='youtube_views'?model.frame_1:source==='bfi_poll'?model.frame_2:null;
 if(!frame)return {valid:false,reason:'unregistered_essay_frame'};
 const allowed=source==='youtube_views'?['reported_view_events_strictly_greater_than']:
 ['distinct_selected_video_essays','youtube_published_essays_selected','vimeo_published_essays_selected','selected_youtube_mean_minutes','selected_vimeo_mean_minutes','selected_youtube_essays_external_support_link_percent_strictly_greater_than'];
 if(!allowed.includes(metric))return {valid:false,reason:'unsupported_metric_or_population'};
 return {valid:true,source_frame:frame.id,metric,value:frame[metric],
  unique_people:null,creator_cash_income:null,payment_conversion:null,representative_creator_sample:false};
}
export function assessEssayComparison(model,{claim,first_source,second_source}={}){
 if(!model?.frame_1||!model?.frame_2)return {allowed:false,reason:'missing_study_frames'};
 if(['creator_income','viewer_retention','platform_genre_share','mean_creator_work_hours','creator_patron_conversion','creator_upload_cadence'].includes(claim))
  return {allowed:false,reason:'not_observed_in_sources'};
 if(first_source!==second_source)return {allowed:false,reason:'curated_works_and_platform_view_events_incompatible'};
 return {allowed:false,reason:'no_observed_common_unit_with_population_denominator'};
}
