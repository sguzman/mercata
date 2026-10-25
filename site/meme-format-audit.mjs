export function auditMemeFormatTaxonomy(d,sources){
 const errors=[],seen=new Set();
 if(d?.kind!=='public_short_humor_and_remix_format_typology'||d?.formats?.length!==6)errors.push('Wrong format taxonomy');
 for(const f of d?.formats||[]){
  if(seen.has(f.id)||!f.definition||f.source_ids?.some(x=>!sources.has(x)))errors.push('Duplicate or ungrounded category');
  seen.add(f.id);
  if(f.unique_audience_size!==null||f.creator_income!==null)errors.push('Invented economic population');
 }
 if(d?.dated_bounded_observation?.value!==1000000000||d?.dated_bounded_observation?.distinct_viewers!==null||d?.dated_bounded_observation?.comedy_only_fraction!==null)errors.push('Misclassified tier-list views');
 if(d?.remix_controls?.studio_collaborations_same_feature!==false||d?.remix_controls?.monetization_share_implied!==false||d?.remix_controls?.visual_opt_out_possible!==true)errors.push('Official remix feature conflated');
 if(Object.values(d?.actual_format_specific_counts||{}).some(x=>x!==null))errors.push('Invented population');
 return {valid:!errors.length,errors};
}
