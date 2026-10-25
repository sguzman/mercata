export function auditTopicTaxonomyDrift(model,taxonomy,observations){
 const errors=[];
 const topics=new Set((taxonomy?.topics||[]).map(x=>x.id)),values=new Map((observations?.observations||[]).map(x=>[x.id,x]));
 if(model?.kind!=='topic_taxonomy_version_and_reclassification_safety_protocol'||model?.current_taxonomy_version!==taxonomy?.taxonomy_version||model?.proposed_new_taxonomy_version!==null)errors.push('Unsupported taxonomy state');
 if(model?.topics_at_baseline!==topics.size||model?.selected_observations_at_baseline!==values.size||model?.candidate_overlap_examples?.length!==4)errors.push('Original frame changed');
 for(const x of model?.candidate_overlap_examples||[]){
  const original=values.get(x.observation_id);
  if(!original||original.topic_id!==x.original_topic_id||original.source_url!==x.original_source_url||original.metric!==x.original_metric||original.value!==x.original_value||original.period!==x.original_period||original.population!==x.original_population||original.comparison!==x.original_comparison||original.unit!==x.original_unit)errors.push('Historic source/metric moved');
  if(!x.candidate_related_topic_ids?.length||x.candidate_related_topic_ids.some(id=>!topics.has(id)))errors.push('New category outside original taxonomy');
  if(x.status!=='example_only_no_reclassification'||[x.observed_relation_count,x.reassigned_metric_value,x.reassigned_people_count,x.confirmed_split_fraction,x.new_source_classification].some(v=>v!==null))errors.push('Invented reclassification');
 }
 const types=new Set((model?.change_categories||[]).map(x=>x.id));
 if(['rename','split','merge','cross_list','deprecate'].some(x=>!types.has(x)))errors.push('Incomplete change taxonomy');
 if(Object.values(model?.unmeasured||{}).some(v=>v!==null))errors.push('Unmeasured split inferred');
 return {valid:!errors.length,errors};
}
