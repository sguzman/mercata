const count=n=>Number.isSafeInteger(n)&&n>=0;
export function buildLiveReplayQuery(model,x){
 if(!x?.owner_authorized||typeof x.video_id!=='string'||!x.video_id.trim()||
 !/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(x.start)||!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(x.end)||x.start>x.end)
  return {valid:false,reason:'owner_video_and_time_frame_required'};
 const metrics=x.metrics??['views','estimatedMinutesWatched'];
 if(!Array.isArray(metrics)||metrics.length===0||new Set(metrics).size!==metrics.length||
 !metrics.every(v=>model.official_report.metrics.includes(v)))
  return {valid:false,reason:'incompatible_live_or_on_demand_metrics'};
 return {valid:true,dimensions:['liveOrOnDemand'],metrics,filter:'video=='+x.video_id,actual_query_executed:false};
}
export function compareLiveReplay(model,live,replay){
 if(!live||!replay||live.phase!=='LIVE'||replay.phase!=='ON_DEMAND'||
 !live.owner_authorized||!replay.owner_authorized||!live.video_id||live.video_id!==replay.video_id||
 live.period!==replay.period||live.country!==replay.country||
 !count(live.views)||!count(replay.views)||!Number.isSafeInteger(live.views+replay.views))
  return {valid:false,reason:'same_owner_video_time_country_and_view_event_unit_required'};
 const total=live.views+replay.views;
 return {valid:true,unit:'view_events_not_people',live_views:live.views,replay_views:replay.views,
 replay_event_share:total>0?replay.views/total:null,unique_returning_viewers:null,creator_revenue:null};
}
