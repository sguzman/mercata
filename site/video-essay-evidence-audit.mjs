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

export function auditBFI2025EssayFrame(model,registeredSources){
 const errors=[],p=model?.frame_3;
 if(!p||p.id!=='bfi_2025_curated_cross_ecosystem_poll'||!registeredSources.has(p.source_id)||
    !model.source_ids?.includes(p.source_id))errors.push('missing independent 2025 curated source');
 if(p?.voters!==72||p?.mentioned_video_essays!==255||
    p?.unit!=='poll_mentioned_video_essay_works_not_uploads_or_view_events')
    errors.push('2025 poll sample not reproduced');
 const x=p?.ecosystem_segments||[];
 if(x.length!==3||
    x.map(y=>y.id).join(',')!=='academic_and_criticism,festival_museum_gallery,social_media_and_youtube'||
    x.reduce((s,y)=>s+y.voters,0)!==p?.voters||
    x.reduce((s,y)=>s+y.mentioned_works,0)!==p?.mentioned_video_essays||
    x.map(y=>[y.voters,y.mentioned_works].join('/')).join(',')!=='34/94,17/65,21/96')
    errors.push('cross-ecosystem nominations misrepresented');
 if(p?.ecosystem_work_identity_deduplication_verified!==false||
    p?.voter_overlap_between_2024_and_2025!==null||
    p?.selected_youtube_published_work_count!==null||
    p?.actual_youtube_creator_count!==null||
    p?.total_distinct_platform_video_essay_uploads!==null||
    p?.actual_year_over_year_supply_change!==null||
    p?.viewer_average_watch_minutes!==null||
    p?.nominated_work_paid_income!==null||
    model?.unmeasured?.industry_video_essay_supply_change_2024_2025!==null)
    errors.push('inferred upload growth or population from invited poll');
 return {valid:errors.length===0,errors};
}
