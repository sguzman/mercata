export function auditRecommendationEvidence(d,sources){
 const errors=[];
 if(d?.platform!=='youtube'||d?.kind!=='recommendation_surface_evidence')errors.push('identity');
 if(d?.surfaces?.length!==5||new Set(d.surfaces.map(x=>x.id)).size!==5)errors.push('surface count');
 for(const x of d?.surfaces||[]){
  if(!x.claim||!x.context||!x.source_ids?.length||!x.source_ids.every(id=>sources.has(id)))errors.push('unsourced or incomplete surface');
  if(x.ranking_weight!==null||x.observed_creator_reach!==null)errors.push('invented effect');
 }
 if(d?.separate_conditions?.length!==5||d.separate_conditions.some(x=>!sources.has(x.source_id)||x.quantified_lift!==null))errors.push('invented condition');
 if(!d?.unmeasured||Object.values(d.unmeasured).some(v=>v!==null))errors.push('invented ranking weights');
 return {valid:errors.length===0,errors};
}
