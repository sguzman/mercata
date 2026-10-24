// Illustrative disclosure classifications only; monetization, privacy and ownership never inferred.
export function classifyAIDisclosureExample(flags){
 const unknown={status:'insufficient_case_information',disclosure:null,monetization_allowed:null,copyright_ownership:null};
 if(!flags||Object.values(flags).some(v=>typeof v!=='boolean')||
 !['ai_used','meaningful_realistic_alteration','ai_music_main_focus','minor_or_non_realistic_only'].every(k=>typeof flags[k]==='boolean'))
  return unknown;
 if(flags.minor_or_non_realistic_only&&(flags.meaningful_realistic_alteration||flags.ai_music_main_focus))return unknown;
 if((flags.meaningful_realistic_alteration||flags.ai_music_main_focus)&&flags.ai_used)
  return {status:'policy_illustration_only',disclosure:'disclosure_required_under_examples',monetization_allowed:null,copyright_ownership:null};
 if(flags.minor_or_non_realistic_only&&flags.ai_used)
  return {status:'policy_illustration_only',disclosure:'not_required_under_examples',monetization_allowed:null,copyright_ownership:null};
 return unknown;
}
export function auditSyntheticMediaStudy(study,sources){
 const errors=[];
 if(study?.platform!=='youtube'||study?.kind!=='synthetic_media_disclosure_monetization_and_rights_study')errors.push('study identity');
 if(study?.illustrative_examples?.length!==5||study?.policy_axes?.length!==4)errors.push('missing distinct policy gates');
 for(const x of [...study?.illustrative_examples||[],...study?.policy_axes||[]]){
  if(!x.source_ids?.length||!x.source_ids.every(id=>sources.has(id)))errors.push('unattributed policy example');
 }
 for(const x of study?.illustrative_examples||[]){
  const result=classifyAIDisclosureExample(x.flags);
  if(result.disclosure!==x.expected)errors.push('mismatched example '+x.id);
 }
 if(study?.policy_axes?.some(x=>x.automatic_monetization_ban!==false||x.assessed_individual_case!==null))errors.push('invented universal monetization rule');
 if(study?.disclosure_process?.automatic_reach_penalty_for_disclosure_only!==false)errors.push('false automatic reach penalty');
 if(study?.likeness_review?.individual_video_privacy_violation_proven_by_detection!==false||study?.likeness_review?.global_availability!==false)errors.push('overclaimed likeness detection');
 if(study?.policy_dates?.[0]?.date!=='2025-07-15'||study.policy_dates[0]?.general_ai_content_ban!==false)errors.push('incorrect inauthentic-policy history');
 if(!study?.unmeasured||Object.values(study.unmeasured).some(v=>v!==null))errors.push('unmeasured outcomes invented');
 return {valid:errors.length===0,errors};
}
