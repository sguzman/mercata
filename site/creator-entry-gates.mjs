// Official YouTube creator-entry gate predicates. No account state or identity information stored.
export function evaluateCreatorEntryGate(protocol,action,flags,subscribers) {
 const gate=protocol.activity_gates.find(g=>g.id===action);
 if(!gate)return {status:'unsupported_action',missing:[],denied:[]};
 if(!flags||typeof flags!=='object'||Array.isArray(flags))return {status:'unknown',missing:[...gate.requires],denied:[]};
 if(gate.minimum_subscribers!==null && (!Number.isSafeInteger(subscribers)||subscribers<0))
   return {status:'unknown',missing:['subscriber_count'],denied:[]};
 const unknown=gate.requires.filter(f=>flags[f]!==true&&flags[f]!==false);
 const denied=gate.requires.filter(f=>flags[f]===false);
 if(gate.minimum_subscribers!==null&&subscribers<gate.minimum_subscribers)denied.push('subscriber_floor_'+gate.minimum_subscribers);
 if(unknown.length)return {status:'unknown',missing:unknown,denied};
 if(denied.length)return {status:'ineligible_by_stated_gates',missing:[],denied};
 return {status:'passes_documented_gates',missing:[],denied:[],actual_account_approved:null,
    actual_creator_cash:null,real_operating_cost:null};
}
export function assessNoNewPurchaseClaims(protocol,claim) {
 if(claim==='ordinary_publish_does_not_require_new_paid_software_or_equipment')
  return {supported:true,strictly_no_incremental_purchases_only:true,total_creator_cost:null};
 return {supported:false,total_creator_cost:null,reason:'not_supported_by_official_required_purchases'};
}

export function evaluateCreatorAgeRoute(protocol, routeId, context) {
 const r=protocol.age_and_guardian_routes.find(x=>x.id===routeId);
 if(!r)return {status:'unsupported_route',actual_approval:null};
 if(!context||!Number.isSafeInteger(context.age)||context.age<0)
  return {status:'unknown',actual_approval:null};
 if(routeId==='channel_creation_brazil_under16') {
  if(context.region!=='BR')return {status:'unknown_jurisdiction_rules',actual_approval:null};
  if(context.age>=16)return {status:'age_specific_supervision_not_required',actual_approval:null};
  if(typeof context.supervisionLinked!=='boolean')return {status:'unknown',actual_approval:null};
  return {status:context.supervisionLinked?'passes_documented_supervision_gate':'needs_parent_supervision',actual_approval:null};
 }
 if(routeId==='livestreaming_min16')
  return {status:context.age>=16?'passes_age_requirement_only':'under_16_not_eligible',actual_approval:null};
 if(routeId==='direct_adsense_min18')
  return {status:context.age>=18?'passes_direct_payee_age_only':'direct_payee_under_18',actual_approval:null};
 if(routeId==='guardian_adsense_under18') {
  if(context.age>=18)return {status:'not_minor_guardian_route',actual_approval:null};
  if(typeof context.approvedGuardianAdSense!=='boolean')return {status:'unknown',actual_approval:null};
  return {status:context.approvedGuardianAdSense?'adult_payee_route_condition_met':'no_approved_adult_payee',actual_approval:null};
 }
 return {status:'unsupported_route',actual_approval:null};
}

export function assessYPPReviewDeadline(protocol,routeId,elapsedDays) {
 const row=protocol.ypp_review_lifecycle.stages.find(x=>x.id===routeId);
 if(!row)return {status:'unsupported_route',verified_acceptance:null,bank_receipt:null};
 if(!Number.isSafeInteger(elapsedDays)||elapsedDays<0)
  return {status:'unknown',verified_acceptance:null,bank_receipt:null};
 if(Number.isInteger(row.last_submission_day_inclusive))
  return {status:elapsedDays<=row.last_submission_day_inclusive?'within_published_appeal_window':'appeal_window_elapsed',
    days_since_reference_event:elapsedDays,verified_acceptance:null,bank_receipt:null};
 if(Number.isInteger(row.first_eligible_day))
  return {status:elapsedDays>=row.first_eligible_day?'minimum_reapply_wait_elapsed':'must_wait_to_reapply',
    days_since_reference_event:elapsedDays,verified_acceptance:null,bank_receipt:null};
 return {status:'published_service_timing_not_a_deterministic_eligibility_window',
  days_since_reference_event:elapsedDays,verified_acceptance:null,bank_receipt:null};
}
