export function compareNielsenTelevisionShare(m,a,b){
 const before=m.observations.find(o=>o.period===a);
 const after=m.observations.find(o=>o.period===b);
 if(!before||!after)return {allowed:false,reason:'unknown_month'};
 if(before.period>=after.period)return {allowed:false,reason:'chronology'};
 const points=Math.round((after.youtube_share_total_tv_percent-before.youtube_share_total_tv_percent)*10)/10;
 return {allowed:true,unit:'percentage_points_of_total_us_tv_watch_time',change:points,comparability:'same_broad_us_tv_population',mobile_watch_share:null,creator_cash_income:null,causal_explanation:null};
}
export function assessNielsenDeviceInference(m,claim){
 if(claim==='within_month_us_total_tv_watch_time_share')
  return {allowed:true,unit:m.scope.unit,scope:m.scope.population,mobile_share:null};
 return {allowed:false,reason:'not_inferred_from_us_tv_watch_time',mobile_share:null,unique_people:null,creator_earnings:null};
}
export function isNestedStreamingShare(row){
 return Number.isFinite(row?.youtube_share_total_tv_percent)&&Number.isFinite(row?.streaming_share_total_tv_percent)
  &&row.youtube_share_total_tv_percent>=0&&row.youtube_share_total_tv_percent<=row.streaming_share_total_tv_percent&&row.streaming_share_total_tv_percent<=100;
}
