export function evaluateContentIDRoute(model,{route,claim_policy,prior_reinstatement=false,appeal_eligible=false}={}){
 const row=model.stages.find(s=>s.id===route);
 if(!row)return {valid:false,reason:'unknown_procedure'};
 if(row.requires_claim_policy && !row.requires_claim_policy.includes(claim_policy))
  return {valid:false,reason:'ineligible_claim_policy'};
 if(row.requires_prior_reinstatement && !prior_reinstatement)
  return {valid:false,reason:'claim_not_reinstated'};
 if(row.requires_creator_appeal_eligibility && !appeal_eligible)
  return {valid:false,reason:'appeal_eligibility_not_verified'};
 if(row.requires_valid_scheduled_copyright_removal_request)
  return {valid:false,reason:'requires_verified_specific_scheduled_removal'};
 return {valid:true,route:row.id,response_days:row.claimant_response_days,
  claimant_actions:row.outcomes,estimated_creator_earnings:null,creator_bank_received:null,
  copyright_strike_automatically_imposed:false};
}
export function classifyClaimConsequence(model,status){
 const row=model.status_categories.find(x=>x.id===status);
 if(!row)return {valid:false,reason:'unknown_rights_action'};
 return {valid:true,status,is_copyright_strike:row.is_copyright_strike===true,
  can_cause_strike:row.can_cause_strike===true,verified_infringement:null,
  observed_creator_cash:null};
}

export function auditCopyrightStrikeAccumulation(model,registeredSources){
 const errors=[],m=model?.copyright_strike_accumulation;
 if(!m||!registeredSources.has(m.source_id)||!model.source_ids?.includes(m.source_id))
  return {valid:false,errors:['missing copyright strike source']};
 if(m.unit!=='active_copyright_strikes_on_creator_channel'||
    m.accumulation_period_days!==90||m.termination_threshold_active_strikes!==3||
    m.expiration_in_days_if_fewer_than_three_and_school_completed!==90||
    m.strike_expiry_requires_copyright_school!==true)
  errors.push('strike expiry or termination threshold altered');
 if(m.strikes?.length!==3||
    m.strikes.some((x,i)=>x.active_strikes!==i+1||x.content_removed!==true)||
    m.strikes.slice(0,2).some(x=>x.termination_status!=='not_automatic'||x.expiry_after_days_if_condition_met!==90)||
    m.strikes[2].termination_status!=='subject_to_termination'||
    m.strikes[2].expiry_after_days_if_condition_met!==null)
  errors.push('copyright strike consequences distorted');
 if(m.ordinary_video_deletion_removes_strike!==false||
    m.scheduled_removal_days_to_avoid_strike!==7||
    m.scheduled_removal_deletion_can_prevent_strike!==true||
    m.content_id_claim_typically_is_copyright_strike!==false||
    m.legal_counter_notification_is_content_id_dispute!==false||
    m.single_video_max_simultaneous_copyright_strikes!==1||
    m.live_stream_restriction_days_first_strike!==7||
    m.live_stream_restriction_days_second_strike!==14)
  errors.push('copyright procedural boundaries invalid');
 for(const k of ['measured_strikes_across_all_channels','probability_three_strikes',
                  'creator_lost_revenue_distribution','counter_notification_success_rate',
                  'linked_channel_termination_probability'])
  if(m[k]!==null)errors.push('invented copyright economic or legal outcome');
 if(Object.values(model.unmeasured||{}).some(x=>x!==null))
  errors.push('invented aggregate strike statistics');
 return {valid:errors.length===0,errors};
}
