export function selectFashionContentSignal(model,id){
 const x=model?.observations?.find(r=>r.id===id);
 if(!x)return {valid:false,reason:'no_registered_topic_frame'};
 return {valid:true,unit:x.unit,value_lower_bound:x.strict_lower_bound,
  window_start:x.window_start,window_end:x.window_end,
  creator_earnings:null,unique_people:null,buyer_conversion:null,audience_gender:null};
}
export function compareFashionSignals(model,first,second){
 const a=model?.observations?.find(x=>x.id===first);
 const b=model?.observations?.find(x=>x.id===second);
 if(!a||!b)return {allowed:false,reason:'unknown_topic_observation'};
 if(a.population!==b.population)return {allowed:false,reason:'different_content_filters'};
 if(a.window_start!==b.window_start||a.window_end!==b.window_end)
  return {allowed:false,reason:'different_reporting_windows'};
 return {allowed:false,reason:'only_published_lower_bounds_without_shared_sampling_information'};
}
export function inferAudienceGender(model,contentCategory){
 return {allowed:false,reason:'content_interest_is_not_validated_demographic_identity',
 gender_distribution:null,gender_identity:null,sex:null};
}
