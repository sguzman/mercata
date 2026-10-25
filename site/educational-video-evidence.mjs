const supported={
 spanish_stem_exercise_vs_dissemination:['average_view_duration','audience_retention_after_30_seconds'],
 indonesian_instruction_vs_test:['video_views','shares','likes','watch_time','average_view_duration'],
 turkish_highly_viewed_mathematics:['views','likes','comments']
};
export function inspectEducationCohort(model,id,metric) {
 const entry=model.studies.find(x=>x.id===id);
 if(!entry)return {allowed:false,reason:'unknown_selected_cohort'};
 if(!supported[id]?.includes(metric))return {allowed:false,reason:'unit_not_measured_by_selected_study'};
 return {allowed:true,selected_videos:entry.selected_videos,unit:metric,study:id,
  all_youtube_typical_income:null,causal_video_length_lift:null};
}
export function compareEducationStudies(model,left,right,claim) {
 const l=model.studies.find(x=>x.id===left),r=model.studies.find(x=>x.id===right);
 if(!l||!r)return {allowed:false,reason:'unknown_study'};
 if(claim==='distinct_selected_video_counts'&&left!==right)
   return {allowed:true,selected_count_left:l.selected_videos,selected_count_right:r.selected_videos,
    combined_representative_sample:null};
 return {allowed:false,reason:'incompatible_channel_populations_outcomes_or_nonrandom_causal_inference'};
}
