export function getEngagedViewObservation(model, studyId, target){
 const study=model.studies.find(x=>x.id===studyId);
 if(!study)return {allowed:false,reason:'unknown_study'};
 if(study.id==='prechange_retention_proxy') {
   if(target!=='modeled_public_view_lift')return {allowed:false,reason:'model_not_observed_engagement'};
   return {allowed:true,status:'modeled_not_observed',percent:study.hypothetical_public_views_above_engaged_percent,
     causal_creator_profit:null,platformwide_conversion:null};
 }
 if(target!=='selected_postchange_engaged_share')return {allowed:false,reason:'not_measured_in_this_frame'};
 return {allowed:true,status:'observed_vendor_selected',percent:study.reported_engaged_views_per_public_views_percent_approx,
   causal_creator_profit:null,platformwide_conversion:null};
}
export function compareViewMetricUnits(model, request){
 if(!request || !['public_view','engaged_view'].includes(request.metric))return {comparable:false,reason:'unregistered_measurement_unit'};
 if(request.crosses_definition_change===true)return {comparable:false,reason:'public_view_2026_definitional_break'};
 if(request.claim==='creator_profit'||request.claim==='unique_people'||request.claim==='buyer_conversion'||request.claim==='global_engaged_fraction')
   return {comparable:false,reason:'missing_creator_money_or_person_population'};
 return {comparable:true,units:'video_events_not_people',global_ratio:null};
}
export function assessBrowseGapClaim(model,requestedDenominator){
 const s=model.studies.find(x=>x.id==='postchange_permissioned_counts');
 const browse=s.surfaces.find(x=>x.id==='browse_feed');
 if(requestedDenominator!=='total_unengaged_gap')return {allowed:false,reason:'77_percent_is_share_of_gap_not_all_views'};
 return {allowed:true,percent:browse.reported_share_of_unengaged_gap_percent,all_view_share:null};
}
