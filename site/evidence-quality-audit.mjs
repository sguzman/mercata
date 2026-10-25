export function auditEvidenceQuality(model,dossier){
 const errors=[],sources=new Map((dossier?.evidence||[]).map(s=>[s.id,s]));
 if(model?.kind!=='purpose_specific_research_evidence_quality_and_scope_register'||model?.source_records?.length!==8)errors.push('Unexpected selected scope');
 const seen=new Set();
 for(const r of model?.source_records||[]){
  if(seen.has(r.id))errors.push('Duplicate source classification');seen.add(r.id);
  const source=sources.get(r.id);
  if(!source||source.url!==r.source_url||source.publisher!==r.publisher||source.evidence_class!==r.original_evidence_class||source.published_at!==r.published_at||source.retrieved_at!==r.retrieved_at)errors.push('Source metadata mismatch');
  if(!r.valid_for||!r.not_for||!r.unit||r.intended_inference_limit!=='only_supports_the_declared_scope')errors.push('No substantive use boundary');
  if(r.full_method_reviewed!==false)errors.push('Unverified complete study review');
  const count=(dossier?.claims||[]).filter(c=>c.source_ids.includes(r.id)).length;
  if(r.verified_claim_count!==count)errors.push('Source citation count drift');
 }
 if(model?.source_ids?.length!==seen.size||model?.source_ids?.some(id=>!seen.has(id)))errors.push('Classification and provenance references differ');
 if(model?.full_registered_source_count_at_review!==(dossier?.evidence||[]).length)errors.push('Source register grew: review selected coverage');
 if((model?.comparison_axes||[]).length!==6||model.comparison_axes.some(x=>x.unmeasured_standardized_weight!==null))errors.push('False objective quality weights');
 if(Object.values(model?.unmeasured||{}).some(x=>x!==null))errors.push('Invented all-source review');
 return {valid:errors.length===0,errors,reviewed:seen.size,registered:sources.size};
}
