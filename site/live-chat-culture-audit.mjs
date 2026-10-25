export function getLiveChatObservation(model, frame, unit){
 const paper=model.paper;
 const frames={
  initial:{videos:paper.initial_filtered_videos,messages:paper.initial_filtered_chat_messages},
  final:{videos:paper.final_model_videos,messages:paper.final_model_chat_messages}
 };
 if(!Object.hasOwn(frames,frame)||!['videos','messages'].includes(unit))
  return {valid:false,reason:'unsupported_frame_or_unit'};
 return {valid:true,unit,frame,value:frames[frame][unit],unique_people:null,creator_earnings:null};
}
export function assessLiveChatClaim(model,claim){
 if(['all_youtube_chatters','all_youtube_messages','people_with_emotion','causal_peer_profit','creator_cash_profit','political_affiliation'].includes(claim))
  return {allowed:false,reason:'unmeasured_people_causality_or_earnings'};
 if(claim==='selected_model_peer_intensity'){
  return {allowed:true,ratio_up_to:model.paper.endogenous_peer_to_video_influence_ratio_reported_up_to,
    interpretation:'model_based_observational_intensity_not_causal_or_economic',verified_creator_profit:null};
 }
 return {allowed:false,reason:'unregistered_inference'};
}
