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
