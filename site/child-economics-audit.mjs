export function auditChildMonetization(model, child, eligibility, revenue, knownSources) {
 const errors=[], found=new Set();
 if(model?.kind!=='child_directed_video_monetization_boundary_matrix'||model?.pathways?.length!==16)errors.push('Incorrect scoped product inventory');
 const products=new Map((revenue?.pathways||[]).map(p=>[p.id,p]));
 const official=new Map((eligibility?.records||[]).map(p=>[p.pathway_id,p]));
 for(const row of model?.pathways||[]){
  if(found.has(row.id))errors.push('Duplicate pathway');found.add(row.id);
  const prod=products.get(row.id),gate=official.get(row.id);
  if(!prod||!gate||gate.child_directed_status!==row.child_status_from_matrix||prod.kind!==row.revenue_path_kind)errors.push('Broken policy reference');
  if(!row.source_ids?.length||!row.source_ids.every(x=>knownSources.has(x)))errors.push('Unsourced row');
  if([row.verified_account_approval,row.expected_revenue_per_view,row.median_earnings,row.profit_effect].some(v=>v!==null))errors.push('Invented creator outcome');
 }
 if(found.size!==products.size||found.size!==official.size)errors.push('Missing pathway');
 const cp=child?.made_for_kids_platform_impacts;
 if(cp?.personalized_advertising_allowed!==false||cp?.all_advertising_banned!==false)errors.push('Incorrect advertising boundary');
 if(model?.feature_restrictions?.personalized_advertising_allowed!==false||model?.feature_restrictions?.all_advertising_banned!==false)errors.push('Incorrect data-copy policy');
 if(model?.classification_rules?.find(x=>x.case==='general_family_friendly')?.economic_handling!=='classify_on_actual_content')errors.push('Animation misclassified as child-directed');
 if(model?.quality_review?.actual_penalty_rate!==null||model?.quality_review?.actual_channel_penalty_incidence!==null||Object.values(model?.unmeasured||{}).some(v=>v!==null))errors.push('Imputed rates');
 return {valid:errors.length===0,errors};
}
