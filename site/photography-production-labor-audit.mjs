export function assessProductionLabor(model,metric,{scope}={}){
 if(scope!=='single_photography_creator_completed_videos')return {valid:false,reason:'wrong_creator_or_attempt_denominator'};
 const values={
  mean_hours:model.time_per_completed_video_hours.arithmetic_mean,
  median_hours:model.time_per_completed_video_hours.median,
  minimum_hours:model.time_per_completed_video_hours.minimum,
  maximum_hours:model.time_per_completed_video_hours.maximum,
  work_minutes_per_published_minute:model.work_minutes_per_finished_video_minute.arithmetic_mean
 };
 if(!Object.hasOwn(values,metric))return {valid:false,reason:'unsupported_or_unobserved_metric'};
 return {valid:true,value:values[metric],sample_video_count:model.published_video_count,
   creator_population_n:model.subject_count,creator_wages:null,industry_labor_distribution:null};
}
export function assessWorkflowRounding(model){
 const sum=model.hours_per_video_workflow.reduce((a,b)=>a+b.mean_hours,0);
 const share=model.hours_per_video_workflow.reduce((a,b)=>a+b.pct_work,0);
 return {rounded_total_hours:Number(sum.toFixed(2)),reported_mean_hours:model.time_per_completed_video_hours.arithmetic_mean,
  rounding_gap_hours:Number((model.time_per_completed_video_hours.arithmetic_mean-sum).toFixed(2)),
  shares_total_percent:Number(share.toFixed(1)),consistent_with_component_rounding:Math.abs(sum-model.time_per_completed_video_hours.arithmetic_mean)<=0.03};
}
