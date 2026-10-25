export function evaluateLiveMeasurement(model,request){
 if(!request || !['sampled_concurrent_viewers','broadcast_duration_minutes'].includes(request.metric))
   return {allowed:false,reason:'not_a_measured_unit'};
 if(request.window!=='2024-05_to_2024-06')return {allowed:false,reason:'outside_recorded_sample_window'};
 if(request.claim && request.claim!=='selected_sample_description')
   return {allowed:false,reason:'not_an_inference_supported_by_concurrency_snapshots'};
 return {allowed:true,unit:request.metric,unique_viewers:null,creator_profit:null};
}
export function classifyDuration(model,minutes){
 if(!Number.isFinite(minutes)||minutes<0)return null;
 const bucket=model.duration_categories_minutes.find(x=>minutes>=x.lower_inclusive&&(x.upper_exclusive===null||minutes<x.upper_exclusive));
 return bucket?.id??null;
}
