export function auditQualityCrosswalk(data,sources) {
 const errors=[];
 if(data?.kind!=='video_quality_proxies_and_production_effort_crosswalk'||data?.bounded_observations?.length!==5)errors.push('Wrong evidence frame');
 const seen=new Set();
 for(const row of data?.bounded_observations||[]){
  if(!row.id||seen.has(row.id))errors.push('Duplicated case');seen.add(row.id);
  if(!sources.has(row.source_id)||!(row.sampled_video_count>0)||row.profit_observed!==false||row.representative_of_youtube_creators!==false)errors.push('Unsourced or overgeneralized case');
 }
 for(const row of data?.dimensions||[]){
  if(!row.source_ids?.length||row.source_ids.some(id=>!sources.has(id))||row.universal_quality_cutoff!==null)errors.push('Unverified quality cutpoint');
 }
 const photo=data?.bounded_observations?.find(x=>x.id==='single_photography_work_diary');
 if(photo){
  const total=Object.values(photo.reported_stage_mean_hours||{}).reduce((a,b)=>a+b,0);
  if(photo.sampled_creator_count!==1||photo.sampled_video_count!==61||Math.abs(total-9.73)>1e-8||Math.abs(photo.reported_hour_mean-total-0.01)>1e-8||photo.reported_hour_median!==7.37)errors.push('Photography work diary measurement mismatch');
 }
 const ind=data?.bounded_observations?.find(x=>x.id==='indonesian_learning_channel');
 if(ind?.sampling_frame_videos!==218||ind?.sampled_video_count!==139)errors.push('Indonesian selected sample denominator lost');
 const tur=data?.bounded_observations?.find(x=>x.id==='turkish_high_view_math');
 if(tur?.sampled_creator_count!==null||tur?.sampled_video_count!==126)errors.push('Turkish study cannot claim creator count');
 const quality=data?.bounded_observations?.find(x=>x.id==='english_statistics_search_expert_ratings');
 const expectedFormats=['slides:45','narrative:24','animated:29','software_demonstration:16'];
 if(quality?.source_id!=='j-korean-med-sci-statistics-video-quality-2026'||quality?.search_snapshot!=='2025-11-17'||
  quality?.search_terms_count!==4||quality?.per_query_top_urls!==50||quality?.search_results_initial_urls!==200||
  quality?.duplicate_urls_excluded!==41||quality?.other_language_excluded!==22||quality?.off_topic_excluded!==23||
  quality?.sampled_video_count!==114||quality?.search_results_initial_urls-quality?.duplicate_urls_excluded-
    quality?.other_language_excluded-quality?.off_topic_excluded!==quality?.sampled_video_count)
  errors.push('Statistics quality sample selection differs from primary study');
 if(quality?.high_quality_videos!==87||quality?.intermediate_quality_videos!==15||
  quality?.low_quality_videos!==12||quality?.high_quality_videos+quality?.intermediate_quality_videos+
    quality?.low_quality_videos!==114||quality?.reported_high_quality_percent!==76.3||
    Math.abs(100*quality?.high_quality_videos/114-76.3)>=0.051)
  errors.push('Expert GQS category results corrupted');
 if(quality?.presentation_formats?.map(x=>x.id+':'+x.selected_videos).join('|')!==expectedFormats.join('|')||
    quality?.presentation_formats?.reduce((s,x)=>s+x.selected_videos,0)!==114)
  errors.push('Statistics presentation format counts diverge');
 if(quality?.sampled_creator_count!==null||quality?.creator_labor_hours!==null||
  quality?.viewer_learning_improvement!==null||quality?.unique_viewer_count!==null||
  quality?.reported_hour_mean!==null||quality?.reported_hour_median!==null||
  quality?.measured_educational_outcome!==null)
  errors.push('Expert ratings falsely converted to people, labor or learner outcomes');
 const dimensions=data?.dimensions||[];
 if(dimensions.length!==8||dimensions.find(x=>x.id==='independent_expert_content_rating')?.measurement_access!=='manual_expert_content_review'||
   dimensions.find(x=>x.id==='educational_presentation_format')?.measurement_access!=='manual_public_video_format_coding')
   errors.push('Production and content quality dimensions improperly pooled');
 if(Object.values(data?.unknowns||{}).some(x=>x!==null))errors.push('Invented unmeasured result');
 return {valid:!errors.length,errors};
}
