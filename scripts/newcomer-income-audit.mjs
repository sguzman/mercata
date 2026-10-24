// Public, aggregate-only newcomer income acceptance gates. No raw creator records.
export function auditCohortProtocol(protocol, knownSources=new Set()) {
  const errors=[];
  if(protocol?.kind!=='new_creator_income_cohort_protocol')errors.push('Wrong protocol kind');
  if(!protocol?.target_population?.include_zero_income || !protocol?.target_population?.include_nonmonetized ||
     !protocol?.target_population?.include_inactive_after_entry)errors.push('Incomplete target population');
  const cases=protocol?.existing_evidence_cases;
  if(!Array.isArray(cases)||!cases.length)errors.push('Missing scoped evidence cases');
  else for(const study of cases){
    if(!study.id||!study.cannot_estimate||!study.sample_scope||!study.source_ids?.length)
      errors.push('Incomplete external evidence case');
    else if(study.source_ids.some(id=>!knownSources.has(id)))
      errors.push('Unregistered external source in '+study.id);
  }
  const gates=protocol?.acceptance_gates;
  if(!Array.isArray(gates)||gates.length<4||new Set(gates.map(x=>x.id)).size!==gates.length)
    errors.push('Missing/duplicate acceptance gates');
  const results=protocol?.results;
  if(!results || Object.keys(results).length<6)errors.push('Missing candidate result fields');
  if(protocol?.status==='protocol_only_no_new_entrant_income_measurements'&&
     results&&Object.values(results).some(v=>v!==null))
    errors.push('Protocol-only record contains fabricated measurements');
  if(protocol?.release_policy?.publish_aggregate_only!==true ||
     protocol?.release_policy?.ban_public_person_level_raw_rows!==true ||
     protocol?.release_policy?.never_replace_missing_with_zero!==true)
    errors.push('Public aggregate privacy and missingness restrictions required');
  return {structurally_valid:errors.length===0,release_ready:errors.length===0 &&
    gates?.every(g=>g.pass===true) && Object.values(results||{}).some(v=>v!==null),
    errors};
}

export function assessAggregateNewcomerIncome(report) {
  const errors=[];
  if(!report||typeof report!=='object')return {structurally_valid:false,population_inference_permitted:false,errors:['Missing report']};
  const sample=report.sample||{};
  const fields=['entrants_n','observed_income_n','missing_income_n','zero_income_n','nonmonetized_n','inactive_n'];
  for(const f of fields)if(!Number.isSafeInteger(sample[f])||sample[f]<0)errors.push('Invalid sample count: '+f);
  if(fields.every(f=>Number.isSafeInteger(sample[f])&&sample[f]>=0)){
    if(sample.observed_income_n+sample.missing_income_n!==sample.entrants_n)
      errors.push('Observed and missing income must partition the original entry cohort');
    if(sample.zero_income_n>sample.observed_income_n)
      errors.push('Recorded zero income exceeds observed income');
    if(sample.nonmonetized_n>sample.entrants_n||sample.inactive_n>sample.entrants_n)
      errors.push('Subgroup exceeds enrollment cohort');
  }
  if(report.raw_person_level_rows!==undefined)errors.push('Individual creator rows cannot enter public aggregate reports');
  if(report.excludes_nonmonetized===true||report.excludes_inactive===true)
    errors.push('Survivor-only selection cannot represent all new entrants');
  if(!report.entry_window_start||!report.entry_window_end||!report.population_definition||!report.recruitment_method)
    errors.push('Missing population, entry period, or recruitment method');
  if(!Array.isArray(report.source_ids)||report.source_ids.length===0)
    errors.push('Missing public source attribution');
  if(!report.reporting_currency||!report.income_basis)
    errors.push('Currency and gross/net revenue basis must be explicit');
  if(report.median_income!==null && (!Number.isFinite(report.median_income)||report.median_income<0))
    errors.push('Invalid median income measurement; use null when unknown');
  const inference=report.probability_sampling===true&&report.frame_coverage_verified===true &&
    report.nonresponse_adjustment_documented===true&&report.uncertainty_reported===true &&
    report.excludes_nonmonetized!==true&&report.excludes_inactive!==true;
  // Flags are self-reported protocol metadata, not verification of probability sampling.
  // An automated validator cannot certify representative population inference.
  if(report.claims_representative===true)
    errors.push('Representative population claim requires independent methodological review, not only self-declared sampling flags');
  return {
    structurally_valid:errors.length===0,
    eligible_for_independent_method_review:errors.length===0&&inference,
    population_inference_permitted:false,
    errors
  };
}
