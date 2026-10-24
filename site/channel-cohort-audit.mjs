// Verifies published aggregate counts, not all-creator inclusion or upload causality.
export function auditChannelCohorts(model,sources){
 const errors=[];
 if(model?.platform!=='youtube'||model?.kind!=='vendor_indexed_channel_sizes_and_360_day_endpoint_cohort')errors.push('study identity');
 const [dist,growth,endpoint]=model?.datasets||[];
 if(model?.datasets?.length!==3||!dist||!growth||!endpoint)errors.push('three study frames required');
 else {
  for(const sample of [dist,growth,endpoint])if(!sources.has(sample.source_id))errors.push('unknown registered source');
  if(dist.raw_channel_rows-dist.missing_subscriber_count_rows-dist.zero_subscriber_rows!==dist.included_channels||dist.included_channels!==61186246)errors.push('snapshot exclusions do not reconcile');
  if(dist.milestones.length!==8||dist.milestones.some((m,i)=>m.channels>dist.included_channels||i>0&&(m.minimum_subscribers<=dist.milestones[i-1].minimum_subscribers||m.channels>dist.milestones[i-1].channels)))errors.push('invalid cumulative milestones');
  for(const m of dist.milestones)if(Math.abs(m.channels/dist.included_channels*100-m.reported_percent)>0.051)errors.push('published snapshot rate mismatch');
  if(growth.growth_tiers?.reduce((sum,x)=>sum+x.channel_count,0)!==growth.included_channels||growth.included_channels!==11752034)errors.push('active channel tier sum mismatch');
  if(endpoint.bins?.reduce((sum,x)=>sum+x.channels,0)!==endpoint.included_channels||endpoint.included_channels!==32926088)errors.push('small channel denominators mismatch');
  if(endpoint.bins?.reduce((sum,x)=>sum+x.reached_1000_at_end,0)!==endpoint.reached_1000_at_endpoint||endpoint.reached_1000_at_endpoint!==500409)errors.push('small channel successes mismatch');
  for(const b of endpoint.bins||[])if(b.reached_1000_at_end>b.channels||Math.abs(100*b.reached_1000_at_end/b.channels-b.reported_percent)>0.011)errors.push('bad published conditional proportion');
  if(endpoint.ypp_approvals_verified!==null||endpoint.new_entrants_only!==false||endpoint.actual_upload_events_observed!==false)errors.push('invented cohort type or monetization');
 }
 if(model?.independent_probability_samples!==0||model?.possible_cross_dataset_overlap!==true)errors.push('independence overclaimed');
 if(!model?.unmeasured||Object.values(model.unmeasured).some(x=>x!==null))errors.push('unmeasured results invented');
 if(model?.readiness_gates?.some(x=>x.passed!==false))errors.push('unsupported empirical acceptance gate');
 return {valid:errors.length===0,errors};
}
