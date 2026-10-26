export function summarizeTopicCoverage(m) {
 if(!m||!Array.isArray(m.topics))return {valid:false};
 const count=m.topics.reduce((n,x)=>n+x.observations.length,0);
 const seen=m.topics.filter(x=>x.observations.length>0).length;
 if(new Set(m.topics.map(x=>x.id)).size!==m.topics.length||count!==m.total_observations||seen!==m.topics_with_selected_observations||m.topics.length-seen!==m.topics_without_selected_observations)return {valid:false};
 return {valid:true,topics:m.topics.length,observations:count,with_evidence:seen,missing:m.topics.length-seen,unique_people:null};
}
export function compareTopicObservations(a,b,claim){
 if(!a||!b||claim==='unique_topic_audience'||claim==='add_topic_communities')return {allowed:false,reason:'no_joint_person_denominator'};
 if(claim!=='descriptive_metric_comparison')return {allowed:false,reason:'unknown_claim'};
 for(const key of ['metric','unit','period','geography','population'])if(!a[key]||a[key]!==b[key])return {allowed:false,reason:'different_'+key};
 return {allowed:true,additive:false,causal:false,unique_people:null};
}
export function validateCategoryChange(m,x){
 if(!x?.effective_date||!x?.old_topic||!x?.new_topic||!x?.source_version||!x?.destination_version||!x?.reason)
  return {allowed:false,reason:'missing_taxonomy_crosswalk'};
 if(!m.topics.some(t=>t.id===x.old_topic))return {allowed:false,reason:'unregistered_original_category'};
 return {allowed:true,retroactively_reclassified:false,unique_people:null};
}

export function auditTopicMetricCoverage(crosswalk, observed){
 const errors=[],a=crosswalk?.metric_family_coverage_audit,topics=a?.topic_metric_coverage;
 if(!a||!Array.isArray(topics)||topics.length!==crosswalk.topics?.length)
   return {valid:false,errors:['missing topic metric-family audit']};
 const counts={},ids=new Set();
 for(const t of crosswalk.topics||[]){
  const row=topics.find(x=>x.topic_id===t.id);
  if(!row||ids.has(row.topic_id)){errors.push('topic missing or duplicated');continue;}
  ids.add(row.topic_id);
  const metrics=[...new Set(t.observations.map(x=>x.metric))];
  if(row.observation_count!==t.observations.length||row.distinct_metric_family_count!==metrics.length||
     row.metric_families.join('|')!==metrics.join('|')||row.source_document_count!==t.source_count||
     row.with_multiple_metric_families!==(metrics.length>1))errors.push('misreported per-topic metric coverage');
  if(row.verified_full_topic_unique_viewers!==null||row.verified_full_topic_active_creators!==null||
     row.has_joint_person_and_creator_population!==false||row.independent_sampling_frames_verified!==false)
    errors.push('invented full-topic audience or source independence');
  for(const x of t.observations)counts[x.metric]=(counts[x.metric]||0)+1;
 }
 if(JSON.stringify(counts)!==JSON.stringify(a.observations_by_metric_family)) {
  for(const [k,v] of Object.entries(a.observations_by_metric_family||{}))
   if((counts[k]||0)!==v)errors.push('metric family counts not reconciled');
  for(const k of Object.keys(counts))if(!Object.hasOwn(a.observations_by_metric_family||{},k))errors.push('missing observed metric family');
 }
 const multiple=topics.filter(t=>t.with_multiple_metric_families);
 if(a.topics_with_two_or_more_metric_families!==multiple.length||
    a.selected_multi_metric_topic_ids.join('|')!==multiple.map(x=>x.topic_id).join('|')||
    a.topics_with_two_or_more_distinct_source_documents!==topics.filter(t=>t.source_document_count>=2).length)
   errors.push('unreconciled cross-topic counts');
 if(a.topics_with_both_full_topic_unique_viewers_and_creators!==0||
    a.topics_with_verified_disjoint_independent_sample_frames!==0||
    Object.values(a.verification_gate||{}).some(x=>x!==false))errors.push('unverified population inference');
 if(!Array.isArray(observed?.observations)||observed.observations.length!==crosswalk.total_observations||
    observed.observations.some(x=>!crosswalk.topics.some(t=>t.id===x.topic_id&&
      t.observations.some(y=>y.id===x.id&&y.metric===x.metric&&y.source_url===x.source_url))))
    errors.push('topic metric rows do not match original observations');
 return {valid:errors.length===0,errors};
}
