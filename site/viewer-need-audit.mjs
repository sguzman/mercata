export function auditViewerNeeds(data,topics,podcasts,sources) {
 const problems=[];
 if(data?.kind!=='pre_registered_viewer_need_and_niche_hypothesis_examples'||data?.hypotheses?.length!==3)problems.push('Wrong existing niche examples');
 const seen=new Set();
 for(const x of data?.hypotheses||[]){
  if(seen.has(x.id)||!sources.has(x.public_reference_source_id))problems.push('Duplicate or missing source');
  seen.add(x.id);
  const present=x.public_reference_observation==='q3_2025_weekly_video_audio_format'
    ?podcasts?.observations?.some(p=>p.id===x.public_reference_observation)
    :topics?.observations?.some(p=>p.id===x.public_reference_observation&&p.topic_id===x.topic_id);
  if(!present)problems.push('Missing original observation');
  if(!x.hypothesis||!x.viewer_need||!x.negative_result_rule||!x.primary_comparator||!x.observable_pilot_metric)problems.push('Inadequate hypothesis');
  if(x.status!=='hypothesis_not_tested'||[x.sample_size,x.exposure_minimum,x.calendar_window,x.spend_ceiling_cents,x.total_labor_ceiling_hours,x.observed_views,x.observed_effect,x.p_value,x.creator_profit,x.probability_of_niche_success].some(v=>v!==null))problems.push('Unapproved experiment or invented niche outcome');
 }
 if(Object.values(data?.unmeasured||{}).some(v=>v!==null))problems.push('Estimated unmeasured opportunity');
 return {valid:!problems.length,problems};
}
