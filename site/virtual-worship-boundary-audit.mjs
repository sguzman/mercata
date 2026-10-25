export function assessVirtualWorshipClaim(model,claim){
 if(claim==='US_adults_monthly_online_or_TV_services'){
  return {allowed:true,value_pct:model.survey.monthly_or_more_pct,
   scope:model.survey.question,platform_specific_count:null,youtube_pct:null};
 }
 return {allowed:false,reason:'religious_worship_question_did_not_identify_youtube'};
}
export function compareTwoSurveys(model,query){
 if(query?.mode==='joint_youtube_and_religious_video_users')
  return {allowed:false,reason:'no_joint_respondent_sample_or_platform_specific_question'};
 if(query?.mode==='survey_methodology_description')
  return {allowed:true,cross_survey_person_count:null,estimated_platform_attendance:null};
 return {allowed:false,reason:'unregistered_inference'};
}
