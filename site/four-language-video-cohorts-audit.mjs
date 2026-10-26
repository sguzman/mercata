export function auditFourLanguageVideoCohorts(m,sourceIds){
 const errors=[];
 if(m?.kind!=='historical_four_detected_audio_language_video_cohorts')errors.push('Study type mismatch');
 if(!m?.source_ids?.every(x=>sourceIds.has(x)))errors.push('Source not registered');
 const s=m?.source_sampling||{};
 if(s.candidate_video_count!==246381||s.retrieval_2023_count!==194619||s.retrieval_2024_count!==51762||
    s.retrieval_2023_count+s.retrieval_2024_count!==s.candidate_video_count)errors.push('Candidate denominator changed');
 const r=m?.language_cohorts||[];
 if(r.map(x=>x.language).join('|')!=='en|es|hi|ru')errors.push('Four cohorts missing');
 if(r.map(x=>x.median_views_per_video).join('|')!=='38|39|37|34')errors.push('Views mismatch');
 if(r.map(x=>x.median_duration_seconds).join('|')!=='119|148|29|98')errors.push('Durations mismatch');
 if(r.map(x=>x.theil_video_view_index).join('|')!=='4.85|4.78|6.04|4.88')errors.push('View Theil mismatch');
 if(r.map(x=>x.sample_uploaded_in_2023_percent).join('|')!=='26.25|25.74|50.92|30.71')errors.push('Upload-year shares mismatch');
 if(!r.every(x=>x.zero_comment_video_percent_greater_than===70))errors.push('Missing no-comment lower bound');
 if(s.exact_calibrated_sample_n_by_language!==null||s.author_or_viewer_person_survey!==false)
  errors.push('Video sample miscast as person sample');
 if(!r.every(x=>x.active_language_viewers_2026===null&&x.unique_commenters===null&&x.creator_net_income===null))
  errors.push('Unverified language people or income');
 if(!m?.unmeasured||Object.values(m.unmeasured).some(x=>x!==null))errors.push('Population unknowns overwritten');
 return {valid:errors.length===0,errors};
}
export function compareHistoricalVideoLanguages(m,first,second){
 const x=m?.language_cohorts?.find(r=>r.language===first),y=m?.language_cohorts?.find(r=>r.language===second);
 if(!x||!y)return {allowed:false,reason:'unknown_language'};
 return {allowed:true,unit:'historical_video_objects_not_people',median_views:[x.median_views_per_video,y.median_views_per_video],
  median_duration_seconds:[x.median_duration_seconds,y.median_duration_seconds],
  unique_viewer_difference:null,commenting_people_difference:null,net_income_difference:null};
}
