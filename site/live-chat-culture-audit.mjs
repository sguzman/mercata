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

export function auditLiveChatInteraction(model,sources){
 const errors=[],p=model?.interaction_paper;
 if(!p||!sources.has(p.source_id)||p.streams!==10||p.minutes_per_stream_examined!==60||
    p.selected_chat_messages!==64279)errors.push('interaction source or first-hour frame invalid');
 const rows=p?.observations||[];
 if(rows.length!==10||rows.map(x=>x.stream_id).join(',')!=='A,B,C,D,E,F,G,H,I,J'||
    rows.reduce((s,x)=>s+x.messages,0)!==p?.selected_chat_messages)errors.push('per-stream messages inconsistent');
 for(const row of rows){
  if(!Number.isInteger(row.messages)||!Number.isInteger(row.referenced)||row.messages<row.referenced||
     Math.abs(row.referenced/row.messages*100-row.published_referenced_percent)>0.051||
     row.mean_reference_lag_seconds<8||row.mean_reference_lag_seconds>38)
    errors.push('referenced-message fraction or delay invalid');
 }
 if(p?.excluded_paid_superchats!==true||p?.source_streamer_identifiers_collected!==false||
    p?.source_chatter_identifiers_collected!==false||p?.total_unique_people!==null||
    p?.representative_responded_chat_fraction!==null||p?.platform_average_response_lag!==null||
    p?.paid_response_effect!==null||p?.channel_income!==null)errors.push('privacy or inference boundary violated');
 return {valid:errors.length===0,errors};
}

export function auditLiveChatEmotionDynamics(model,knownSourceIds){
 const errors=[],p=model?.paper,e=p?.emotion_excitation_coefficients;
 if(!e||!knownSourceIds.has(e.source_id))errors.push('Peer-reviewed source or emotion model missing');
 if(p?.final_model_chat_messages!==92412||p?.final_model_videos!==397||
    p?.initial_filtered_chat_messages!==673551||p?.initial_filtered_videos!==1957)
  errors.push('Nested sampling units changed');
 if(e?.joy!==0.77||e?.anger!==0.26||e?.disgust!==0.26||e?.sadness!==0.21)
  errors.push('Model coefficients altered');
 if(e?.causal_emotion_transmission_proven!==false||e?.verified_individual_feelings!==null||
    e?.viewer_survey_corroboration!==null||e?.directly_observed_bot_exclusion!==false||
    e?.creator_revenue_correlation!==null)
  errors.push('Unsupported psychological or income interpretation');
 if(e?.exact_decay_time_seconds!==null||e?.negative_emotion_decay_relative_to_positivity!=='nearly_twice_as_long_as_reported')
  errors.push('Invented numerical persistence window');
 return {valid:errors.length===0,errors};
}
