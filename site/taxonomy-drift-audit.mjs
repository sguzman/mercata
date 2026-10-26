export function auditTopicTaxonomyDrift(model,taxonomy,observations){
 const errors=[];
 const topics=new Set((taxonomy?.topics||[]).map(x=>x.id)),values=new Map((observations?.observations||[]).map(x=>[x.id,x]));
 if(model?.kind!=='topic_taxonomy_version_and_reclassification_safety_protocol'||model?.current_taxonomy_version!==taxonomy?.taxonomy_version||model?.proposed_new_taxonomy_version!==null)errors.push('Unsupported taxonomy state');
 const appended=model?.post_baseline_source_observations||[];
 if(model?.topics_at_baseline!==topics.size||model?.selected_observations_at_baseline!==36||
    model.selected_observations_at_baseline+appended.length!==values.size||
    model?.candidate_overlap_examples?.length!==4)errors.push('Original frame changed');
 const additionIds=new Set();
 for(const x of appended){
   const y=values.get(x.id);
   if(!y||additionIds.has(x.id)||x.taxonomy_version!==taxonomy.taxonomy_version||
      x.original_topic_id!==y.topic_id||x.original_source_url!==y.source_url||
      x.original_metric!==y.metric||x.original_unit!==y.unit||x.original_period!==y.period||
      x.original_population!==y.population||x.baseline_reclassification_occurred!==false||
      x.new_record_is_bounded_video_event_metric!==true||x.category_population_inferred!==null)
      errors.push('Undocumented or reclassified post-baseline observation');
   additionIds.add(x.id);
 }
 if(appended.some(x=>(model?.candidate_overlap_examples||[]).some(z=>z.observation_id===x.id)))
   errors.push('Historical baseline cannot be registered as new');
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
