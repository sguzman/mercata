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
 const x=model?.niche_maturity_contrasts, t=x?.tubeai, v=x?.vidiq, c=x?.cross_dataset;
 if(x?.kind!=='new_vs_established_conditional_niche_crosswalk'||!t||!v||!c)errors.push('niche maturity crosswalk missing');
 else {
  if(!sources.has(t.source_id)||!sources.has(v.source_id)||t.source_id===v.source_id)errors.push('unregistered or duplicated niche cohort source');
  if(t.eligible_indexed_10k_channels!==122341||t.new_at_10k!==14624||t.new_at_10k>t.eligible_indexed_10k_channels)errors.push('invalid success-conditioned index');
  const band=t.selected_band;
  if(band.included_channels!==80139||band.newer.channels!==11928||band.older.channels!==68211||
    band.newer.channels+band.older.channels!==band.included_channels||
    band.subscriber_min!==10000||band.subscriber_max_exclusive!==100000)errors.push('maturity cohort does not reconcile');
  if(!Array.isArray(t.niches)||t.niches.length!==4||
    t.niches.some(n=>n.newer_10k_active_channels>n.all_10k_active_channels||
      n.all_10k_active_channels<=0||
      Math.abs(n.newer_10k_active_channels/n.all_10k_active_channels*100-n.published_newer_share_percent)>0.051))errors.push('invalid conditional niche composition');
  if(t.representative_of_all_entrants!==false||t.newcomer_milestone_probability!==null||
    t.niche_openess_probability!==null||t.sample_n_from_raw_data_verified!==false)errors.push('invented newcomer success or verified vendor raw records');
  if(v.indexed_channels!==36163||v.days!==360||!Array.isArray(v.niches)||v.niches.length!==3||
    v.niches.reduce((sum,n)=>sum+n.channels,0)!==v.indexed_channels)errors.push('invalid newer gaming cohort population');
  for(const n of v.niches||[]){
   if(!Number.isSafeInteger(n.channels)||n.channels<=0||n.endpoint_1k>n.channels||
      n.endpoint_10k>n.endpoint_1k||
      Math.abs(n.endpoint_1k/n.channels*100-n.published_1k_percent)>0.011||
      Math.abs(n.endpoint_10k/n.channels*100-n.published_10k_percent)>0.011)errors.push('newer gaming endpoint count/rate mismatch');
  }
  if(v.matched_mature_channel_cohort!==null||v.verified_new_creator_success_probability!==null||
    v.monetization_approval!==null||v.earned_profit!==null||
    v.not_first_time_creators!==true||v.nonrandom_sampling!==true)errors.push('new creator causal or revenue evidence invented');
  if(c.sampling_frames_equivalent!==false||c.shared_channel_ids_observed!==null||
    c.independent_probability_samples!==0||
    c.probability_an_newcomer_reaches_10k!==null||
    c.causal_effect_of_channel_age!==null||
    c.all_niche_newcomer_denominators!==null)errors.push('incompatible vendor frames conflated');
 }
 if(model?.independent_probability_samples!==0||model?.possible_cross_dataset_overlap!==true)errors.push('independence overclaimed');
 if(!model?.unmeasured||Object.values(model.unmeasured).some(x=>x!==null))errors.push('unmeasured results invented');
 if(model?.readiness_gates?.some(x=>x.passed!==false))errors.push('unsupported empirical acceptance gate');
 return {valid:errors.length===0,errors};
}
