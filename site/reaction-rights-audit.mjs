// Published examples are not permissions, creator earnings or case-specific YPP decisions.
export function auditReactionRights(m,sources){
 const errors=[];
 if(m?.platform!=='youtube'||m?.kind!=='reaction_compilation_originality_copyright_distinction')errors.push('study identity');
 const cases=m?.published_example_cases||[];
 if(cases.length!==7||new Set(cases.map(x=>x.id)).size!==7)errors.push('example coverage');
 for(const x of cases){
  if(!x.title||!x.example_notes||!x.source_ids?.every(id=>sources.has(id)))errors.push('missing source');
  if(x.copyright_clearance!==null||x.claim_free_guarantee!==false)errors.push('false rights assurance');
  if(!['permitted_example_not_a_channel_approval','ineligible_example_not_individual_case_judgment'].includes(x.platform_reused_content_example))errors.push('fabricated approval');
 }
 const a=m?.axes||[];
 if(a.length!==5||!a.every(x=>sources.has(x.source_id)&&x.decision_requires_individual_review===true))errors.push('policy gates');
 const shorts=m?.shorts_recommendation_originality;
 if(shorts?.announced_at!=='2026-10-01'||!sources.has(shorts.source_id)||
   !a.some(x=>x.id==='shorts_recommendation_originality'&&x.source_id===shorts.source_id))
  errors.push('missing 2026 Shorts feed discovery gate');
 if(shorts?.blanket_no_clips_allowed!==false||
    shorts?.proof_of_licensed_clip_recommendation_approval!==false||
    shorts?.proof_of_YPP_approval!==false||shorts?.proof_of_copyright_fair_use!==false)
  errors.push('false Short discovery or copyright entitlement');
 if(shorts?.actual_rollout_percentage!==null||shorts?.affected_channels!==null||
    shorts?.observed_loss_of_recommendation_impressions!==null||
    shorts?.measured_incremental_creator_income!==null)
  errors.push('invented reach or payout effect');
 if(m?.historical_note?.reused_content_policy_changed!==false)errors.push('false 2025 rule change');
 if(!m?.economic_observability||Object.values(m.economic_observability).some(x=>x!==null))errors.push('invented economic observation');
 if(!m?.unmeasured||Object.values(m.unmeasured).some(x=>x!==null))errors.push('invented population estimate');
 return {valid:errors.length===0,errors};
}
