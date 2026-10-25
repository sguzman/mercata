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
 if(a.length!==4||!a.every(x=>sources.has(x.source_id)&&x.decision_requires_individual_review===true))errors.push('policy gates');
 if(m?.historical_note?.reused_content_policy_changed!==false)errors.push('false 2025 rule change');
 if(!m?.economic_observability||Object.values(m.economic_observability).some(x=>x!==null))errors.push('invented economic observation');
 if(!m?.unmeasured||Object.values(m.unmeasured).some(x=>x!==null))errors.push('invented population estimate');
 return {valid:errors.length===0,errors};
}
