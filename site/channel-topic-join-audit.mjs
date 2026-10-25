export function auditChannelTopicJoin(model, index, topics, knownSources) {
 const problems=[];
 if(model?.kind!=='channel_category_vs_topic_attention_compatibility_audit'||model?.cases?.length!==3)problems.push('Wrong selected comparison frame');
 for(const row of model?.cases||[]){
  const supply=index?.creatordb?.primary_category_counts?.find(x=>x.name===row.supply_category);
  const observation=topics?.observations?.find(x=>x.id===row.attention_observation_id);
  if(row.supply_index_source_id!=='creatordb-june2026-index'||!knownSources.has(row.supply_index_source_id)||!knownSources.has(row.attention_source_id))problems.push('Invalid linked source');
  if(!supply||supply.channels!==row.indexed_channels)problems.push('Indexed category changed');
  if(!observation||observation.topic_id!==row.attention_topic_id||observation.metric!==row.attention_unit||observation.value!==row.attention_value||observation.comparison!==row.attention_qualifier||observation.period!==row.attention_period||observation.geography!==row.attention_geography)problems.push('Topic evidence changed');
  if(row.join_status!=='incompatible_scope_or_unit'||row.audience_per_creator!==null||row.active_audience_size!==null||row.estimated_creator_profit!==null)problems.push('Unsupported audience/creator conversion');
  if(!row.reason||!row.attention_population)problems.push('Missing scope caveat');
 }
 if(Object.values(model?.unmeasured||{}).some(x=>x!==null))problems.push('Invented matched outcome');
 return {valid:problems.length===0,problems};
}
