export function auditPublicCommentLanguageFrame(model,study){
 if(!study||study.authorizedPrivateData||study.storeCommentBodies||study.storeAuthorIds)return {valid:false,reason:'forbidden_private_data_capture'};
 if(!study.creatorSampleFrame||!study.window||!study.selectionRule||!study.languageMethod)return {valid:false,reason:'missing_predeclared_sampling_method'};
 if(study.topLevelPaginationComplete!==true||study.replyPaginationComplete!==true)
   return {valid:false,reason:'unverified_complete_accessible_reply_frame'};
 if(!Number.isInteger(study.unknownLanguageEvents)||study.unknownLanguageEvents<0)return {valid:false,reason:'missing_unknown_language_class'};
 if(study.eventDenominator!=='public_comment_events')return {valid:false,reason:'wrong_denominator'};
 return {valid:true,unit:'sampled_public_comment_events',observed_events:model.study_frame.sampled_comment_event_count,
   unique_viewers:null,unique_authors:null,language_user_population:null};
}
export function auditLanguageParticipationClaim(model,claim) {
 const allowed=['declared_video_metadata_language','default_video_audio_language','sampled_public_comment_event_language'];
 if(!allowed.includes(claim))return {allowed:false,reason:'unmeasured_viewer_language_or_sensitive_person_attribute'};
 return {allowed:true,observed_data:model.actual_public_comment_language_observations.length,
   unique_people:null,creator_earnings:null};
}
