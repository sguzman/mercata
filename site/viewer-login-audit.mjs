export function auditLoginStateObservability(data,sources){
 const errors=[],log=data?.login_state_observability;
 if(data?.kind!=='viewer_person_account_and_activity_measurement'||log?.official_login_metric?.id!=='viewerPercentage'||log?.scope!=='owner_authorized_video_or_playlist_analytics_not_global_people')errors.push('Wrong report semantic frame');
 if(!log?.source_ids?.length||log.source_ids.some(x=>!sources.has(x)))errors.push('Missing registered source');
 const m=log?.official_login_metric;
 if(m?.observed_value!==null||m?.not_a_public_channel_metric!==true||m?.not_verified_unique_person_share!==true||m?.not_global_login_rate!==true)errors.push('Logged-in percentage turned into population estimate');
 const u=log?.official_modeled_unique_people;
 if(u?.can_include_signed_out!==true||u?.observed_value!==null||u?.not_derived_from_viewerPercentage!==true)errors.push('Incompatible unique-person inference');
 if(log?.contrasted_counts?.length!==4||log.contrasted_counts.some(x=>!sources.has(x.source_id)||x.supports_deduplicated_signed_out_person_count!==false))errors.push('Event or account count recast as people');
 if(log?.collected_owner_rows?.length!==0||[log?.global_unique_signed_out_people,log?.creator_channel_signed_out_unique_people,log?.all_global_viewer_login_fraction,log?.logged_out_conversion_to_customer].some(x=>x!==null))errors.push('Invented signed-out people data');
 if(data?.unmeasured?.nonregistered_view_share!==null)errors.push('Unsupported global unregistered share');
 return {valid:!errors.length,errors};
}
