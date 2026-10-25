export function assessPlaylistMetricClaim(model, metricIds, claim){
 if(!Array.isArray(metricIds)||!metricIds.length||new Set(metricIds).size!==metricIds.length)
  return {allowed:false,reason:'invalid_metric_selection'};
 const rows=metricIds.map(id=>model.metric_definitions.find(x=>x.id===id));
 if(rows.some(x=>!x))return {allowed:false,reason:'unknown_playlist_metric'};
 if(['unique_people','returning_people','full_series_completion','buyer_conversion','creator_profit'].includes(claim))
  return {allowed:false,reason:'unsupported_people_or_economic_inference'};
 if(claim==='owner_video_minutes')return {allowed:metricIds.length===1&&metricIds[0]==='estimatedMinutesWatched',scope:'owner_video_aggregate',observed:null};
 if(claim==='in_playlist_minutes')return {allowed:metricIds.length===1&&metricIds[0]==='playlistEstimatedMinutesWatched',scope:'in_playlist',observed:null};
 if(claim==='web_view_events_per_start')return {allowed:metricIds.length===2&&metricIds.includes('playlistStarts')&&metricIds.includes('viewsPerPlaylistStart'),scope:'web_only',observed:null};
 return {allowed:false,reason:'unknown_inference'};
}
export function buildSeriesStudyFrame(model,frame){
 if(!frame?.ownerAuthorized||!frame.playlistId||!Number.isInteger(frame.episodes)||frame.episodes<2||
    !frame.start||!frame.end||frame.start>frame.end) return {ready:false};
 return {ready:true,requested_metrics:model.official_sample_query.metrics,observed_count:model.observations.length,unique_returners:null,purchasers:null};
}

export function auditSeriesProductVsRetention(model,registeredSourceIds){
 const errors=[],study=model?.shows_and_shorts_series;
 if(!study||study.modes?.length!==2||!study.source_ids?.every(id=>registeredSourceIds.has(id)))
   return {valid:false,errors:['missing or unsourced show rules']};
 const [n,s]=study.modes;
 if(n.id!=='non_serial'||n.episode_order!=='newest_to_oldest'||n.initial_conversion_default!==true||
    n.intended_to_watch_in_sequence!==false||
    s.id!=='serial'||s.episode_order!=='oldest_to_newest'||
    s.intended_to_watch_in_sequence!==true||s.playback_out_of_order_technically_blocked!==null)
   errors.push('invented serial navigation restriction or episode order');
 if(study.shorts_series?.maximum_duration_seconds!==180||
    study.shorts_series?.exclusive_shorts_playlist_required!==true||
    study.shorts_series?.allowed_orientations?.join(',')!=='portrait,square'||
    study.shorts_series?.previous_next_episode_navigation!==true)
   errors.push('Shorts show eligibility distorted');
 if(Object.values(study.general_statistics||{}).some(x=>x!==null)||
    Object.values(model.unmeasured||{}).some(x=>x!==null)||
    model.authorized_api_calls_performed!==false)
   errors.push('unmeasured series retention represented as observed');
 return {valid:errors.length===0,errors};
}
