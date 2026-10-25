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
