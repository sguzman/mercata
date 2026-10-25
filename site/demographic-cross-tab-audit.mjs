export function auditDemographicCrossTabs(data,use,news,identity,sources){
 const errors=[];
 if(data?.kind!=='demographic_cross_tabulation_nonresponse_and_availability_audit'||data?.unavailable_joint_tables?.length!==7)errors.push('Wrong cross-tab register');
 if(data?.npors?.whole_sample_n!==use?.survey?.total_respondents_n||data?.npors?.whole_sample_moe_pp!==use?.survey?.reported_overall_moe_pp||data?.atp_news?.whole_sample_n!==news?.sources?.find(x=>x.id==='atp_august_2026')?.respondents_n)errors.push('Whole-survey metadata mismatch');
 for(const frame of data?.published_marginal_rates||[]){
  const original=use.strata.find(x=>x.id===frame.dimension);
  if(!original||frame.cells.length!==original.categories.length)errors.push('Marginal dimension absent');
  for(const cell of frame.cells){
   const from=original?.categories?.find(x=>x.id===cell.id);
   if(!from||cell.percent!==from.percent||cell.subgroup_n!==null||cell.subgroup_margin_of_error_pp!==null)errors.push('False marginal cell precision');
  }
 }
 for(const query of data?.unavailable_joint_tables||[]){
  if(!sources.has(query.source_id)||query.status!=='unmeasured_or_incompatible'||query.joint_sample_n!==null||query.cell_count!==null||query.intersection_prevalence_percent!==null||query.intersection_margin_of_error_pp!==null||query.representativeness_verified!==false||query.denominator_match_verified!==false)errors.push('Inferred or unlinked cross table');
 }
 if(data?.npors?.english_only_asian_estimate!==true||identity?.race_ethnicity_groups?.find(x=>x.english_only_restriction)?.value_percent!==95)errors.push('Asian language sample restriction lost');
 if(data?.npors?.subgroup_n!==null||data?.npors?.subgroup_moe_pp!==null||data?.atp_news?.subgroup_n!==null||Object.values(data?.unmeasured||{}).some(v=>v!==null))errors.push('Invented subgroup precision');
 return {valid:!errors.length,errors};
}
