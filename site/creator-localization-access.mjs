// Published product capabilities, not an estimator of creator reach or cash earnings.
export function assessCreatorLocalizationRoute(protocol,routeId,options) {
 const route=protocol.routes.find(r=>r.id===routeId);
 if(!route)return {status:'unsupported_route',observed_outcome:null};
 if(!options||typeof options!=='object'||Array.isArray(options))
  return {status:'unknown',missing:[...route.required_flags],observed_outcome:null};
 const missing=route.required_flags.filter(f=>typeof options[f]!=='boolean');
 if(missing.length)return {status:'unknown',missing,observed_outcome:null};
 const blocked=route.required_flags.filter(f=>options[f]===false);
 if(route.maximum_minutes!==undefined){
  if(!Number.isFinite(options.videoMinutes)||options.videoMinutes<0)
   return {status:'unknown',missing:['videoMinutes'],observed_outcome:null};
  if(options.videoMinutes>route.maximum_minutes)blocked.push('over_maximum_video_minutes');
 }
 if(blocked.length)return {status:'ineligible_by_stated_feature_gates',blocked,observed_outcome:null};
 return {status:'passes_documented_feature_gates',route:routeId,observed_outcome:null,verified_audience_gain:null,verified_creator_pay:null};
}
export function inferLocalizationAudience(protocol,claim) {
 return {allowed:false,claim,reason:'no_language_matched_audience_or_cash_observations',unique_viewers:null,incremental_revenue:null};
}
