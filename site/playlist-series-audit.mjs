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
