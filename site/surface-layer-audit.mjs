export function auditYouTubeSurfaceLayers(data,revenue,sources){
 const errors=[],ids=new Set(),formats=new Set((data?.formats||[]).map(x=>x.id)),earnings=new Set((revenue?.pathways||[]).map(x=>x.id));
 if(data?.surface_layers?.length!==8||data?.formats?.length!==8)errors.push('Incorrect surface inventory');
 for(const x of data?.surface_layers||[]){
  if(!x.id||ids.has(x.id))errors.push('Duplicate surface');
  ids.add(x.id);
  if(!x.source_ids?.length||x.source_ids.some(s=>!sources.has(s)))errors.push('Unsourced surface');
  if(!x.format_ids?.length||x.format_ids.some(s=>!formats.has(s))||x.money_pathway_ids.some(s=>!earnings.has(s)))errors.push('Broken catalog link');
  if(x.observed_unique_people!==null||x.observed_creator_median_income!==null||x.measured_cross_surface_conversion!==null||x.account_specific_product_eligibility_verified!==false)errors.push('Invented creator economics');
 }
 const tv=data?.surface_layers?.find(x=>x.id==='connected_tv'),pod=data?.surface_layers?.find(x=>x.id==='podcast_collection'),money=data?.surface_layers?.find(x=>x.id==='earning_products');
 if(tv?.kind!=='device_context'||tv?.money_pathway_ids.length!==0)errors.push('TV incorrectly counted as native business');
 if(pod?.kind!=='playlist_label')errors.push('Podcast counted as extra video');
 if(money?.kind!=='transaction_or_contract_layer')errors.push('Products counted as video');
 return {valid:errors.length===0,errors};
}