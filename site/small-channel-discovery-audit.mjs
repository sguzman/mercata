export function auditDiscoveryMetric(model,{source,metric}={}){
 const row=model?.metrics?.find(x=>x.id===metric);
 if(!row)return {allowed:false,reason:'unknown_discovery_metric'};
 if(source==='public_vendor_index'){
   if(row.access.startsWith('authorized'))return {allowed:false,reason:'owner_only_impression_or_earning_metric'};
   if(!['public_subscribers','public_video_count_delta','public_views'].includes(metric))return {allowed:false,reason:'not_public_metric'};
   return {allowed:true,unit:row.unit,public_or_owner:'public',actual_value:null,creator_earnings:null};
 }
 if(source==='authorized_owner'){
   return {allowed:true,unit:row.unit,public_or_owner:'owner_authorized',actual_value:null,creator_earnings:null};
 }
 return {allowed:false,reason:'unknown_source_or_authorization'};
}
export function classifyNewChannel(model,{first_publication_age_days,subscribers_at_start}={}){
 if(!Number.isInteger(subscribers_at_start)||subscribers_at_start<0||
    !Number.isInteger(first_publication_age_days)||first_publication_age_days<0)
   return {valid:false,reason:'owner_confirmed_age_and_subscribers_required'};
 const id=first_publication_age_days<=90?'new_verified_entry':
   subscribers_at_start<1000?'small_incumbent':'medium_incumbent';
 return {valid:true,stratum:id,first_publication_age_confirmed_by_owner:true,
   observed_thumbnail_impressions:null,causal_growth_probability:null};
}

export function auditFirstWeekVideoSample(model,registeredSources){
 const errors=[],x=model?.first_week_video_distribution,p=model?.first_upload_preprint_comparison;
 if(!x||!registeredSources.has(x.source_id)||x.observed_video_objects!==38229639||
    x.observed_first_week_views!==261962388719||x.measurement_window_days!==7)
   errors.push('missing first-week video source or denominator');
 if(x?.classification!=='indexed_longform_video_objects_not_creator_cohort'||
    x?.shorts_excluded!==true||x?.livestreams_separately_excluded!==false||
    x?.reported_nonrandom_indexing!==true||x?.all_youtube_uploads_in_window!==false)
   errors.push('source population or format inferred incorrectly');
 if(x?.seven_day_median_views!==234||x?.below_100_first_week_views_percent!==37.7||
    x?.below_1000_first_week_views_percent!==70.1||
    x?.at_least_10000_first_week_views_percent!==8.5||
    x?.first_week_view_percentiles?.map(v=>v.views).join(',')!=='234,8154,109778,663099')
   errors.push('unsupported first-week percentile or threshold');
 if(x?.approximate_rank_band_view_shares?.map(v=>v.percent_of_cohort_first_week_views).join(',')!=='54.1,34.6,10.8,0.5'||
    x?.rank_bands_exact_video_headcounts!==false)
   errors.push('rank bands overclaimed');
 if(x?.counts_unique_channels!==null||x?.unique_viewers!==null||
    x?.creator_subscriber_size_distribution!==null||x?.eligible_first_time_creators!==null||
    x?.observed_owner_thumbnail_impressions!==null||x?.observed_ctr!==null||
    x?.causal_algorithmic_concentration!==null||x?.creator_net_revenue!==null)
   errors.push('video views misrepresented as channel or revenue evidence');
 if(!p||!registeredSources.has(p.source_id)||p.selected_first_upload_channels!==107||
    p.reported_percent!==51.4||p.first_week_view_distribution_compatible!==false||
    p.same_observation_unit!==false||p.same_followup_interval!==false||
    p.representative_new_creator_success_rate!==null||p.channel_overlap_observed!==null)
   errors.push('first-upload channel cohort falsely pooled');
 if(model?.unmeasured?.first_week_small_creator_view_distribution!==null||
    model?.unmeasured?.new_channel_ctr_percent!==null)
   errors.push('newcomer discoverability fabricated');
 return {valid:errors.length===0,errors};
}
