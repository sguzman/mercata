// Structural identifiability check; refuses conversion from unrelated aggregate totals.
export function assessShortsReferral(candidate){
 const errors=[];
 if(!candidate||candidate.source_format!=='shorts'||candidate.destination_format!=='regular_video')errors.push('Required source/destination formats');
 for(const field of ['channel_id','source_video_id','destination_video_id','period_start','period_end','measurement_epoch']){
  if(typeof candidate?.[field]!=='string'||!candidate[field])errors.push('Missing '+field);
 }
 if(candidate?.channel_id && candidate?.source_channel_id && candidate.channel_id!==candidate.source_channel_id)errors.push('Cross-channel source');
 if(candidate?.source_video_id===candidate?.destination_video_id)errors.push('Same source and destination');
 if(typeof candidate?.period_start==='string'&&typeof candidate?.period_end==='string'&&candidate.period_start>candidate.period_end)errors.push('Inverted period');
 if(candidate?.related_video_feature_verified!==true)errors.push('Related-video link eligibility unverified');
 if(candidate?.destination_visibility!=='public'&&candidate?.destination_visibility!=='unlisted')errors.push('Ineligible destination visibility');
 if(candidate?.authorization!=='owner_consent')errors.push('Owner data authorization missing');
 if(candidate?.direct_link_event_linkage_verified!==true)errors.push('Unverified Short-specific click and destination attribution');
 if(candidate?.unit!=='attributed_event_pairs')errors.push('Incompatible units; mixed views or viewer counts');
 for(const field of ['attributed_click_events','matched_destination_event_pairs']){
  if(!Number.isSafeInteger(candidate?.[field])||candidate[field]<0)errors.push('Invalid '+field);
 }
 if(Number.isSafeInteger(candidate?.matched_destination_event_pairs)&&Number.isSafeInteger(candidate?.attributed_click_events)&&candidate.matched_destination_event_pairs>candidate.attributed_click_events)errors.push('Destination pairs exceed clicks');
 if(errors.length)return {status:'not_identifiable',descriptive_event_pair_rate:null,causal_lift_verified:false,errors};
 if(candidate.attributed_click_events===0)return {status:'no_attributed_clicks',descriptive_event_pair_rate:null,causal_lift_verified:false,errors:[]};
 return {status:'descriptive_attributed_event_pairs',descriptive_event_pair_rate:candidate.matched_destination_event_pairs/candidate.attributed_click_events,causal_lift_verified:false,errors:[]};
}
export function auditShortsFunnelProtocol(study,sources){
 const errors=[];
 if(study?.platform!=='youtube'||study?.kind!=='shorts_to_regular_video_referral_study')errors.push('study identity');
 if(study?.surfaces?.length!==4||study?.identifiability_gates?.length!==5)errors.push('missing measurement surfaces/gates');
 for(const s of study?.surfaces||[]){
  if(!s.source_ids?.length||!s.source_ids.every(id=>sources.has(id)))errors.push('unknown source ID');
  if(s.measured!==null||!s.not_equivalent_to)errors.push('unverified observation');
 }
 if(study?.identifiability_gates?.some(x=>x.passed!==false))errors.push('unsupported acceptance pass');
 if(!study?.unmeasured||Object.values(study.unmeasured).some(v=>v!==null))errors.push('invented conversions or costs');
 if(study?.actual_funnel_experiments?.length||study?.research_outputs?.length)errors.push('unsupported real observations');
 return {valid:errors.length===0,errors};
}
