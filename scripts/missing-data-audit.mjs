export function auditMissingDataDependencies(model,load){
 const errors=[];
 if(model?.kind!=='evidence_backed_missing_data_dependencies'||model?.blockers?.length!==12)errors.push('Wrong source-backed blocker register');
 const ids=new Set();
 for(const b of model?.blockers||[]){
  if(!b.id||ids.has(b.id)||!b.path?.startsWith('ontology/youtube/')||!b.path.endsWith('.json')||b.section!=='unmeasured'||!b.field)errors.push('Duplicate or malformed source pointer');
  ids.add(b.id);
  if(!b.required_to_measure||!b.invalid_shortcut||b.expected_source_value!==null||b.currently_measured!==false)errors.push('Unsupported blocker measurement: '+b.id);
  let file;try{file=load(b.path);}catch{errors.push('Referenced artifact missing: '+b.id);continue;}
  if(!Object.hasOwn(file,b.section)||!Object.hasOwn(file[b.section],b.field))errors.push('Unregistered source field: '+b.id);
  else if(file[b.section][b.field]!==null)errors.push('Source field changed; update evidence register: '+b.id);
 }
 if(model?.all_blockers_resolved!==false||model?.representative_profit_observed!==false||model?.privacy_clearance_claimed!==false)errors.push('Inferred research clearance');
 return {valid:errors.length===0,errors,count:model?.blockers?.length||0};
}
