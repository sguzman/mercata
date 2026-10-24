// Validation of source-grounded production-effort research; this is not a labor estimator.
export function auditProductionEffort(model,production,sourceIds){
  const errors=[];
  if(model?.kind!=='content_production_barrier_and_educational_entertainment_comparison')
    errors.push('Incorrect production-effort research kind');
  const stageIds=new Set((production?.labor_categories||[]).map(x=>x.id));
  const cashIds=new Set((production?.cash_categories||[]).map(x=>x.id));
  const src=sourceIds instanceof Set?sourceIds:new Set(sourceIds||[]);
  if(stageIds.size!==10||cashIds.size!==10)errors.push('Missing baseline labor/cash taxonomy');
  const checkSources=(ids,label)=>{
    if(!Array.isArray(ids)||!ids.length||ids.some(id=>!src.has(id)))errors.push('Unregistered sources: '+label);
  };
  checkSources(model?.source_ids,'root');
  if(new Set(model?.stage_dictionary).size!==stageIds.size||
     model.stage_dictionary.some(id=>!stageIds.has(id)))errors.push('Stage vocabulary differs from research baseline');
  if(new Set(model?.cash_dictionary).size!==cashIds.size||
     model.cash_dictionary.some(id=>!cashIds.has(id)))errors.push('Cash vocabulary differs from research baseline');
  if(!Array.isArray(model?.workflows)||model.workflows.length!==6)
    errors.push('Require six distinct documented workflows');
  const ids=new Set();
  for(const w of model?.workflows||[]){
    if(!w.id||ids.has(w.id))errors.push('Duplicate or blank workflow id');
    ids.add(w.id);
    const required=new Set(w.required_stage_ids||[]);
    const conditional=new Set(w.conditional_stage_ids||[]);
    if(!required.size||!conditional.size)errors.push('Incomplete stage flags for '+w.id);
    if([...required,...conditional].some(id=>!stageIds.has(id)))errors.push('Unknown work stage in '+w.id);
    if([...required].some(id=>conditional.has(id)))errors.push('Overlapping required/conditional stages in '+w.id);
    if(w.candidate_cash_category_ids.some(id=>!cashIds.has(id)))
      errors.push('Unknown cost class in '+w.id);
    checkSources(w.official_source_ids,w.id);
    for(const key of ['measured_median_labor_hours','measured_median_cash_cost','representative_completed_projects_n','representative_abandoned_projects_n'])
      if(w[key]!==null)errors.push('Unmeasured workload reported as numeric: '+w.id+'/'+key);
  }
  for(const gate of model?.gate_definitions||[])checkSources(gate.source_ids,gate.id);
  if(!Array.isArray(model?.paired_comparisons)||model.paired_comparisons.length!==3)
    errors.push('Paired education/entertainment designs incomplete');
  for(const pair of model?.paired_comparisons||[]){
    if(!ids.has(pair.a)||!ids.has(pair.b)||pair.a===pair.b)
      errors.push('Pair references invalid workflows: '+pair.id);
    if(!pair.match_on?.length||!pair.outcomes?.length)errors.push('Pair lacks matched estimand: '+pair.id);
    if(pair.expected_direction!==null||pair.observed_effect_size!==null||pair.causal_identification!==false)
      errors.push('Unobserved format contrast treated as evidence: '+pair.id);
  }
  if(Object.values(model?.results||{}).length<6||
     Object.values(model.results).some(x=>x!==null))
    errors.push('Unknown typical hours/cost/profit fields must remain null');
  if(!model?.prohibitions?.some(x=>x.includes('abandoned')))
    errors.push('Survivorship accounting omitted');
  return {valid:errors.length===0,errors};
}
// Label-preserving observed accounting; not a platform benchmark.
export function assessStageHours(stages){
  if(!Array.isArray(stages)||!stages.length)return {status:'invalid',total_hours:null};
  const ids=new Set();
  let sum=0;
  for(const x of stages){
    if(typeof x?.stage_id!=='string'||ids.has(x.stage_id)||
       typeof x.hours!=='number'||!Number.isFinite(x.hours)||x.hours<0)
      return {status:'invalid',total_hours:null};
    ids.add(x.stage_id);sum+=x.hours;
  }
  if(!Number.isFinite(sum))return {status:'invalid',total_hours:null};
  return {status:'recorded_stages_only',total_hours:sum,stage_count:stages.length,
    caveat:'This sum covers entered non-overlapping personal creator hours, not missing stages or any representative creator population.'};
}
