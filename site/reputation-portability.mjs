// Guard against interpreting platform feedback as exportable buyer reputation.
export function auditReputationPortability(study,sources){
 const errors=[];
 if(study?.platform!=='youtube'||study?.kind!=='native_feedback_and_portability_study')errors.push('identity');
 if(!Array.isArray(study?.surfaces)||study.surfaces.length!==7)errors.push('surface coverage');
 const ids=new Set(),scopes=new Set(['native_feedback','transfer_unverified','owner_aggregate_only','conditional_content_export','conditional_internal_move','delegation_only']);
 for(const x of study?.surfaces||[]){
  if(!x.id||ids.has(x.id))errors.push('duplicate surface');
  ids.add(x.id);
  if(!scopes.has(x.transfer_scope))errors.push('unknown movement class');
  if(!x.mechanism||!x.limit)errors.push('missing evidence boundary');
  if(!x.source_ids?.length||!x.source_ids.every(id=>sources.has(id)))errors.push('missing official source');
  if(x.observed_net_revenue_effect!==null||x.verified_buyer_score!==null)errors.push('invented impact/score');
 }
 const scopeFor=id=>(study?.surfaces||[]).find(x=>x.id===id)?.transfer_scope;
 if(scopeFor('subscribers')!=='transfer_unverified'||scopeFor('brand_move')!=='conditional_internal_move'||scopeFor('studio_access')!=='delegation_only'||scopeFor('video_assets')!=='conditional_content_export')errors.push('false transfer equivalence');
 if(study?.native_marketplace_rating_verified!==false||study?.verified_buyer_review_population!==null)errors.push('unverified marketplace rating');
 if(!study?.unmeasured||Object.values(study.unmeasured).some(x=>x!==null))errors.push('invented measured metric');
 return {valid:errors.length===0,errors};
}
